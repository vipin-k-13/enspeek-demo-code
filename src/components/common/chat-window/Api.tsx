import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { store, type AppDispatch, type RootState } from "../../../store/store";
import { useLocation, useNavigate } from "react-router";
import { getPageName } from "../../../utils/getPageName";
import { queryClient } from "../../../App";
import {
  setFollowUp,
  setIsTyping,
  setMessages,
  setPending,
} from "../../../store/ChatSlice";
import { useEffect } from "react";
import { useProcessHook } from "../Report/ReportMutations";
import { setSubmitItems } from "../../../store/QuestionSlice";
import { REFRESH_STUDY_LIST_EVENT } from "../../../utils/studyListRefresh";

const MAX_RECALL_CHAIN_CALLS = 10;

export const useChat = () => {
  const { pathname, state } = useLocation();
  const studyID = state?.studyID;
  const pageName = getPageName(pathname);
  const navigate = useNavigate();
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { followUp, messages } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();
  const { Process } = useProcessHook();

  const getLatestMessages = () => store.getState().chat.messages;

  const appendChatMessage = (message: any) => {
    dispatch(setMessages([...getLatestMessages(), message]));
  };

  const requestRecallResponse = async () => {
    const payload = studyID
      ? { apiToken, studyID, recallFlag: 1 }
      : { apiToken, recallFlag: 1 };
    const res = await apiRequest("post", "studychatbot/chatStudy", payload);
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
      queryKey: ["studyList"],
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: ["studyList"],
      exact: false,
      type: "active",
    });
  };

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

    const aiMessage: any = {
      text: data.message || "AI responded with no message.",
      sender: "ai",
      questions: data.questions,
      instruction: data.instruction,
      response: data.response || {},
      liveLink: data.liveLink,
    };
    appendChatMessage(aiMessage);

    if (data.opt === true && data.qid) {
      submit(data.qid);
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

  const { mutate: submit } = useMutation({
    mutationKey: ["questions", state?.studyID],
    mutationFn: async (CQID: string) => {
      const res = await apiRequest("post", `questionnaire/view/${CQID}`, {
        apiToken,
        studyID,
      });
      return res.response;
    },
    onSuccess: (data: Question) => {
      dispatch(setSubmitItems(data));
    },
  });
  const {
    mutate: Chat,
    isPending: isChatPending,
    data,
  } = useMutation({
    mutationKey: ["chatBot"],
    mutationFn: async (payload: { prompt: string }) => {
      const res = await apiRequest("post", "studychatbot/chatStudy", {
        apiToken: apiToken,
        prompt: payload.prompt,
        pageName: pageName,
        followUp: followUp,
        studyID,
      });
      return res.response;
    },
    onSuccess: async (data) => {
      let currentResponse = data;
      let totalCallsCompleted = 1;

      await processChatResponse(currentResponse);

      while (
        totalCallsCompleted < MAX_RECALL_CHAIN_CALLS &&
        shouldRequestRecall(currentResponse)
      ) {
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
      const errorMessage: any = {
        text: "❌ Failed to get response from AI. Please try again.",
        sender: "ai",
      };
      dispatch(setIsTyping(false));
      dispatch(setMessages([...messages, errorMessage]));
    },
  });

  useEffect(() => {
    if (!followUp) return;
    if (followUp !== "" && data && data.active) {
      const userMessage: any = {
        text: followUp,
        sender: "user",
      };
      dispatch(setFollowUp(""));
      dispatch(setMessages([...messages, userMessage]));
      setTimeout(() => {
        Chat({ prompt: userMessage.text });
      }, 1000);
    }
  }, [data, followUp]);

  useEffect(() => {
    dispatch(setPending(isChatPending));
  }, [isChatPending, dispatch]);

  return { Chat, isChatPending };
};
