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
import { LuBotMessageSquare, LuSparkles } from "react-icons/lu";

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
    <div className="home-page-bg relative flex h-full w-full justify-center overflow-hidden px-4 py-5 md:px-6 md:py-7">
      {messages.length > 0 ? (
        <div className="w-full max-w-5xl">
          <ChatWindow />
        </div>
      ) : (
        <div
          className={cn(
            "flex w-full max-w-4xl flex-col gap-10 pt-3 transition-all duration-300 ease-in-out md:gap-12"
          )}
        >
          <div
            className={cn(
              "transition-all duration-300 ease-in-out text-center"
            )}
          >
            <p className="home-title text-center text-[28px] font-semibold leading-tight md:text-[42px]">
              Good evening, {user.firstName || "there"}
            </p>
            <p className="home-highlight mt-3 text-[16px] md:text-[18px]">
              I can help you <span className="font-medium text-login-primary">activate study...</span>
            </p>
          </div>
          <div className={cn("transition-all duration-300 ease-in-out")}>
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[20px] bg-gradient-to-br from-login-primary to-action shadow-lg">
              <LuBotMessageSquare className="h-9 w-9 text-white" />
              <LuSparkles className="absolute -right-4 -top-4 h-5 w-5 text-amber-400" />
              <LuSparkles className="absolute -left-4 bottom-0 h-4 w-4 text-violet-500" />
            </div>
            <div className="mt-6 text-center">
              <p className="home-heading text-[24px] font-semibold md:text-[28px]">
                Start a conversation with your AI assistant
              </p>
              <p className="home-highlight mt-3 text-[18px] md:text-[22px]">
                Ask me anything...{" "}
                <span className="font-medium text-login-primary">
                  "Generate questions about "
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
      <ChatTextArea/>
    </div>
  );
}
