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
import {
  LuBotMessageSquare,
  LuCircleCheckBig,
  LuMessagesSquare,
  LuRocket,
  LuSparkles,
  LuWandSparkles,
} from "react-icons/lu";
import { setChatOpen, setMessage } from "../../../store/ChatSlice";

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
  const firstName = user.firstName || "there";

  const starterPrompts = [
    {
      title: "Create a new study",
      text: "Create a study about healthy snacks for school kids",
      icon: <LuWandSparkles className="h-4 w-4" />,
    },
    {
      title: "Generate survey questions",
      text: "Generate 5 screening questions about pizza preferences",
      icon: <LuMessagesSquare className="h-4 w-4" />,
    },
    {
      title: "Activate an existing study",
      text: "Activate study [study name]",
      icon: <LuRocket className="h-4 w-4" />,
    },
  ];

  const steps = [
    {
      title: "Tell Enspeek what you want",
      body: "Describe your topic in simple words. No survey experience needed.",
    },
    {
      title: "Review and refine",
      body: "Edit, reorder, or ask AI to improve the generated questions.",
    },
    {
      title: "Launch with confidence",
      body: "Activate, collect responses, and move into reports and crosstab.",
    },
  ];


  if (infoError) {
    return <Error />;
  }

  return (
    <div className="home-page-bg relative flex h-full min-h-0 w-full justify-center overflow-hidden py-5 md:py-7">
      {messages.length > 0 ? (
        <div className="h-full min-h-0 w-full pb-40 md:pb-44">
          <div className="mx-auto h-full w-full max-w-6xl px-4 md:px-6">
            <ChatWindow />
          </div>
        </div>
      ) : (
        <div className="h-full min-h-0 w-full overflow-y-auto overflow-x-hidden pb-32 md:pb-36">
          <div
            className={cn(
              "mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-1 transition-all duration-300 ease-in-out md:gap-5 md:px-6 lg:pt-2"
            )}
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-start">
              <div className="home-surface home-border-soft overflow-hidden rounded-[32px] border shadow-[0_18px_46px_rgba(79,86,230,0.08)]">
                <div className="bg-[radial-gradient(circle_at_top_left,_rgba(109,99,255,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(251,250,255,0.96)_100%)] px-6 py-6 md:px-8 md:py-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="home-panel-soft-bg home-highlight inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                      <LuSparkles className="h-3.5 w-3.5" />
                      Chat-first survey design
                    </span>
                  </div>

                  <div className="mt-5 max-w-3xl">
                    <p className="home-title text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] md:text-[42px]">
                      Build a survey by simply describing it.
                    </p>
                    <p className="home-text mt-3 max-w-2xl text-[15px] leading-7 md:text-[17px]">
                      Tell Enspeek what you want in plain language and it helps
                      you create studies, generate questions, and move toward launch.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold home-heading shadow-sm">
                      <LuBotMessageSquare className="h-4 w-4 text-login-primary" />
                      Good evening, {firstName}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border home-border bg-white px-4 py-2 text-sm home-muted shadow-sm">
                      Try:
                      <span className="font-semibold text-login-primary">
                        “Create a study about healthy snacks”
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            <div className="home-surface home-border-soft rounded-[28px] border px-5 py-6 shadow-[0_14px_36px_rgba(79,86,230,0.07)] md:px-6">
              <div className="flex items-center gap-3">
                <div className="home-panel-soft-bg flex h-12 w-12 items-center justify-center rounded-2xl">
                  <LuCircleCheckBig className="h-6 w-6 text-login-primary" />
                </div>
                  <div>
                    <p className="home-heading text-lg font-semibold">
                      How it works
                    </p>
                    <p className="home-muted mt-1 text-sm leading-6">
                      Three simple steps from idea to launch.
                    </p>
                  </div>
                </div>

              <div className="mt-4 space-y-2.5">
                {steps.map((step, index) => (
                  <div
                    key={step.title}
                    className="home-panel-soft-bg rounded-[20px] border home-border-soft px-4 py-3.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-login-primary text-sm font-semibold text-white">
                        {index + 1}
                      </div>
                        <div>
                          <p className="home-heading text-[15px] font-semibold">
                            {step.title}
                          </p>
                          <p className="home-muted mt-1 text-sm leading-6">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="home-surface home-border-soft rounded-[28px] border px-5 py-5 shadow-[0_14px_36px_rgba(79,86,230,0.07)] md:px-6 md:py-6">
              <div className="flex items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-login-primary to-action shadow-lg">
                  <LuBotMessageSquare className="h-7 w-7 text-white" />
                  <LuSparkles className="absolute -right-3 -top-3 h-4 w-4 text-amber-400" />
                  <LuSparkles className="absolute -left-3 bottom-0 h-3.5 w-3.5 text-violet-500" />
                </div>
                <div>
                  <p className="home-heading text-xl font-semibold">
                    Start with one message
                  </p>
                  <p className="home-muted mt-1 text-sm leading-6">
                    Pick a suggestion below or type your own request in the chat bar.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt.title}
                    type="button"
                    onClick={() => {
                      dispatch(setChatOpen(true));
                      dispatch(setMessage(prompt.text));
                    }}
                    className="home-panel-soft-bg home-border-soft group flex w-full items-start gap-3 rounded-[20px] border px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="home-dropdown-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                      {prompt.icon}
                    </span>
                    <span>
                      <span className="home-heading block text-sm font-semibold">
                        {prompt.title}
                      </span>
                      <span className="home-muted mt-1 block text-sm leading-6">
                        {prompt.text}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <ChatTextArea/>
    </div>
  );
}
