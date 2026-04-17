import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
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

export const useChat = () => {
  const { pathname, state } = useLocation();
  const pageName = getPageName(pathname);
  const navigate = useNavigate();
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { followUp, messages } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch<AppDispatch>();
  const { Process } = useProcessHook();

  const { mutate: submit } = useMutation({
    mutationKey: ["questions", state?.studyID],
    mutationFn: async (CQID: string) => {
      const res = await apiRequest("post", `questionnaire/view/${CQID}`, {
        apiToken,
        studyID: state?.studyID,
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
        studyID: state?.studyID,
      });
      return res.response;
    },
    onSuccess: async (data) => {
      dispatch(setIsTyping(false));

      if (data.showGraph) {
        dispatch(
          setMessages([
            ...messages,
            {
              type: "surveydata",
              sdata: data.sdata,
              text: data.message,
              studyID: data.studyID,
            },
          ])
        );
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
      dispatch(setMessages([...messages, aiMessage]));

      if (data.opt === true && data.qid) {
        submit(data.qid);
      }

      if (data.active && data.route) {
        navigate(data.route, { state: { studyID: data?.studyId } });
      }

      if (data.add && !data.questions) {
        queryClient.invalidateQueries({ queryKey: ["viewCustomList"] });
      }

      if (data.add && data.liveLink && state?.studyID) {
        queryClient.invalidateQueries({ queryKey: ["studyInfo"] });
      }

      dispatch(setFollowUp(data.followUp));

      if (data.questions?.questions?.length > 0 && data.add) {
        queryClient.invalidateQueries({ queryKey: ["viewCustomList"] });
      }

      if (data.download === true && data?.pid) {
        Process({ studyID: data.studyID, pid: data.pid });
      }
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
