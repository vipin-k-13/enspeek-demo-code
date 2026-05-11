import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { queryClient } from "../../App";
import mutationStructure from "../mutation-template";
import url from "../url";
import { apiRequest } from "../../services/apiService";
import { store, type AppDispatch, type RootState } from "../../store/store";
import { setChatOpen, setFollowUp, setIsTyping, setMessage, setMessages, setPending } from "../../store/ChatSlice";
import { getPageName } from "../../utils/getPageName";
import { useProcessHook } from "../../components/common/Report/ReportMutations";
import { setSubmitItems } from "../../store/QuestionSlice";
import { REFRESH_STUDY_LIST_EVENT } from "../../utils/studyListRefresh";

const MAX_RECALL_CHAIN_CALLS = 10;

export const useChat = () => {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { Process } = useProcessHook();
  const pageName = getPageName(pathname);
  const studyID = state?.studyID;

  const { apiToken } = useSelector((storeState: RootState) => storeState.user);
  const { followUp, isChatOpen, isTyping, message, messages, pending } = useSelector((storeState: RootState) => storeState.chat);

  const getLatestMessages = () => store.getState().chat.messages;

  const appendChatMessage = (chatMessage: any) => {
    dispatch(setMessages([...getLatestMessages(), chatMessage]));
  };

  const setDraftMessage = (value: string) => {
    dispatch(setMessage(value));
  };

  const openChat = () => {
    dispatch(setChatOpen(true));
  };

  const closeChat = () => {
    dispatch(setChatOpen(false));
  };

  const openChatWithMessage = (value: string) => {
    dispatch(setChatOpen(true));
    dispatch(setMessage(value));
  };

  const requestRecallResponse = async () => {
    const payload = studyID ? { apiToken, studyID, recallFlag: 1 } : { apiToken, recallFlag: 1 };
    const res = await apiRequest(url.studyChatbot.method, url.studyChatbot.endpoint, payload);
    return res?.response;
  };

  const shouldRequestRecall = (data: any) => data?.recallFlag === 1;

  const refreshQuestionnaireList = async () => {
    if (!studyID) return;

    await queryClient.invalidateQueries({
      queryKey: ["viewCustomList", studyID],
    });
    await queryClient.refetchQueries({
      queryKey: ["viewCustomList", studyID],
      type: "all",
    });
  };

  const refreshHomeStudyList = async () => {
    if (pathname !== "/") return;

    await new Promise<void>((resolve) => {
      window.dispatchEvent(
        new CustomEvent(REFRESH_STUDY_LIST_EVENT, {
          detail: {
            selection: "myactive",
            resolve,
          },
        })
      );
    });

    await queryClient.invalidateQueries({
      queryKey: [url.studyListing.queryKey],
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: [url.studyListing.queryKey],
      exact: false,
      type: "active",
    });
  };

  const { mutate: submitQuestionById } = mutationStructure({
    mutationKey: ["questions", studyID],
    mutationFn: async (questionId: string) => {
      const res = await apiRequest(
        url.questionView.method,
        url.questionView.endpoint.replace(":qId", questionId), { apiToken, studyID }
      );
      return res.response;
    },
    onSuccess: (data: Question) => {
      dispatch(setSubmitItems(data));
    },
  });

  const processChatResponse = async (data: any) => {
    if (!data) return;

    if (data.showGraph) {
      appendChatMessage({
        type: "surveydata",
        sdata: data.sdata,
        text: data.message,
        studyID: data.studyID,
      });
      return;
    }

    appendChatMessage({
      text: data.message || "AI responded with no message.",
      sender: "ai",
      questions: data.questions,
      instruction: data.instruction,
      response: data.response || {},
      liveLink: data.liveLink,
    });

    if (data.opt === true && data.qid) {
      submitQuestionById(data.qid);
    }

    if (data.active && data.route) {
      navigate(data.route, { state: { studyID: data?.studyId } });
    }

    if (data.add && !data.questions) {
      await refreshQuestionnaireList();
    }

    if (data.add && data.liveLink && studyID) {
      await queryClient.invalidateQueries({ queryKey: ["studyInfo", studyID] });
      await queryClient.refetchQueries({
        queryKey: ["studyInfo", studyID],
        type: "all",
      });
    }

    if (data.type === "activated" && data.liveLink) {
      await refreshHomeStudyList();
    }

    dispatch(setFollowUp(data.followUp));

    if (data.questions?.questions?.length > 0 && data.add) {
      await refreshQuestionnaireList();
    }

    if (data.download === true && data?.pid) {
      Process({ studyID: data.studyID, pid: data.pid });
    }
  };

  const {
    mutate: requestChatResponse,
    isPending: isChatPending,
    data: chatResponse,
  } = mutationStructure({
    mutationKey: ["chatBot", pageName, studyID],
    mutationFn: async (payload: { prompt: string }) => {
      const res = await apiRequest(url.studyChatbot.method, url.studyChatbot.endpoint, { apiToken, prompt: payload.prompt, pageName, followUp, studyID });
      return res.response;
    },
    onSuccess: async (data) => {
      let currentResponse = data;
      let totalCallsCompleted = 1;

      await processChatResponse(currentResponse);

      while (totalCallsCompleted < MAX_RECALL_CHAIN_CALLS && shouldRequestRecall(currentResponse)) {
        const recallResponse = await requestRecallResponse();
        if (!recallResponse) {
          break;
        }

        totalCallsCompleted += 1;
        currentResponse = recallResponse;
        await processChatResponse(currentResponse);
      }

      dispatch(setIsTyping(false));
    },
    onError: () => {
      appendChatMessage({
        text: "❌ Failed to get response from AI. Please try again.",
        sender: "ai",
      });
      dispatch(setIsTyping(false));
    },
  });

  const sendMessage = (rawPrompt?: string) => {
    const prompt = (rawPrompt ?? message).trim();

    if (!prompt || isTyping || pending) {
      return false;
    }

    appendChatMessage({
      text: prompt,
      sender: "user",
    });
    dispatch(setIsTyping(true));
    requestChatResponse({ prompt });

    if (rawPrompt === undefined) {
      dispatch(setMessage(""));
    }

    return true;
  };

  useEffect(() => {
    if (!followUp) return;

    if (followUp !== "" && chatResponse && chatResponse.active) {
      dispatch(setFollowUp(""));
      window.setTimeout(() => {
        sendMessage(followUp);
      }, 1000);
    }
  }, [chatResponse, followUp]);

  useEffect(() => {
    dispatch(setPending(isChatPending));
  }, [dispatch, isChatPending]);

  return {
    closeChat,
    isChatOpen,
    isChatPending,
    isTyping,
    message,
    messages,
    openChat,
    openChatWithMessage,
    pending,
    sendMessage,
    setDraftMessage,
  };
};

export default useChat;
