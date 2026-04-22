import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { resetQuestionGroup } from "../../../store/QuestionSlice";
import Error from "../../global/Error";
import { cn } from "../../../utils";
import ChatWindow from "../chat-window/chat";
import ChatTextArea from "../../global/chattextares";
import { LuBotMessageSquare } from "react-icons/lu";

export default function ProjectListing() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(resetQuestionGroup());
  }, []);

  const user = useSelector((state: RootState) => state.user);

  const { error: infoError } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const res = await apiRequest("post", "user/info", {
        apiToken: user.apiToken,
      });
      const userInfo = res.response;
      return userInfo;
    },
    enabled: !!user.apiToken,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { messages } = useSelector((state: RootState) => state.chat);


  if (infoError) {
    return <Error />;
  }

  return (
    <div className="w-full h-full bg-[#f4f5ff] p-4 flex justify-center relative">
      {messages.length > 0 ? (
        <div className="w-full md:max-w-2xl">
          <ChatWindow />
        </div>
      ) : (
        <div
          className={cn(
            "w-full md:max-w-4xl flex flex-col gap-10 transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "transition-all duration-300 ease-in-out text-center"
            )}
          >
            <p className="text-center text-[40px] font-semibold leading-tight text-[#232542]">
              Good evening, {user.firstName || "there"}
            </p>
            <p className="mt-2 text-[#8f93b0]">I can help you activate study...</p>
          </div>
          <div className={cn("transition-all duration-300 ease-in-out")}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d9f4ff] to-[#b3d7ff] shadow-[0_8px_24px_rgba(79,86,230,0.16)]">
              <LuBotMessageSquare className="h-9 w-9 text-[#2b5fbf]" />
            </div>
            <div className="mt-6 text-center">
              <p className="text-[30px] font-semibold text-[#2a2d4a]">
                Start a conversation with your AI assistant
              </p>
              <p className="mt-2 text-[#8f93b0]">
                Ask me anything... like "Generate questions about ..."
              </p>
            </div>
          </div>
        </div>
      )}
      <ChatTextArea/>
    </div>
  );
}
