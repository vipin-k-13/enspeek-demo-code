import React, { useEffect, type DragEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import QuestionnaireForm from "./QuestionnaireForm";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../../store/store";
import DataList from "./DataList";
import {
  setAllSubmitItems,
  setLogic2Skip,
  setQuestionGroup,
  setQuestionList,
  setSubmitItems,
} from "../../../store/QuestionSlice";
import { toast } from "sonner";
import { cn } from "../../../utils";
import { setStudyInfo } from "../../../store/CrosstabStudySlice";
import { setIsAddingQuestion } from "../../../store/TriggerSlice";
import { useQtype } from "./Api";
import { setChatOpen, setMessage } from "../../../store/ChatSlice";
import { MdArrowForwardIos } from "react-icons/md";
import ChatWindow from "../chat-window/chat";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ChatTextArea from "../../global/chattextares";
import {
  LuBotMessageSquare,
  LuCircleCheckBig,
  LuListChecks,
  LuPlus,
  LuSparkles,
  LuWandSparkles,
} from "react-icons/lu";
import PageSubheader from "../../ui/PageSubheader";

export default function QuestionList() {
  const navigate = useNavigate();
  const [editData, setEditData] = React.useState<Question | null>(null);
  const { qType } = useSelector((state: RootState) => state.trigger);
  const dispatch = useDispatch<AppDispatch>();
  const { launch, output, hasQuestionnaire } = useSelector(
    (state: RootState) => state.study
  );
  const isDragDisabled = launch === 1 && output === 1;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("questionType");
    if (type) {
    }
  };

  const handleEditItem = (data: Question) => {
    setEditData(data);
    dispatch(setIsAddingQuestion(true));
  };

  const location = useLocation();
  const studyID = location.state?.studyID;
  const user = useSelector((state: RootState) => state.user);
  const { messages } = useSelector((state: RootState) => state.chat);
  const { isAddingQuestion } = useSelector((state: RootState) => state.trigger);
  const hasMessages = messages.length > 0;
  const firstName = user.firstName || "there";
  const emptyStatePrompts = [
    {
      title: "Generate screening questions",
      text: "Generate 5 screening questions about pizza preferences",
      icon: <LuWandSparkles className="h-4 w-4" />,
    },
    {
      title: "Create your first question",
      text: "Create a single select question about favourite snacks",
      icon: <LuPlus className="h-4 w-4" />,
    },
    {
      title: "Ask for a full questionnaire",
      text: "Generate 10 survey questions about fresh food shopping",
      icon: <LuListChecks className="h-4 w-4" />,
    },
  ];

  const {
    data: StudyInfo,
    isLoading: isInfoLoading,
    refetch: StudyInfoRefetch,
  } = useQuery({
    queryKey: ["studyInfo", studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "study/info", {
        apiToken: user.apiToken,
        studyID,
      });
      dispatch(
        setStudyInfo({
          studyID: studyID,
          hasQuestionnaire: res.response.hasquestionnaire,
          launch: res.response.launch,
          name: res.response.studyname,
          output: res.response.output,
          link: res.response.link,
          closed: res.response.closed,
        })
      );
      return res.response;
    },
    enabled: !!user.apiToken && !!studyID,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {} = useQtype(studyID);
  const { submitItems } = useSelector((state: RootState) => state.question);
  const { mutate: submit, isPending } = useMutation({
    mutationKey: ["questions", studyID],
    mutationFn: async (CQID: string) => {
      const res = await apiRequest("post", `questionnaire/view/${CQID}`, {
        apiToken: user.apiToken,
        studyID,
      });
      return res.response;
    },
    onSuccess: (data: Question) => {
      dispatch(setSubmitItems(data));
      const logicMap: Record<string, string> = {};
      data.logic2?.forEach((entry: Record<string, string>) => {
        const logicType = Object.keys(entry)[0];
        const logicValue = entry[logicType];
        logicMap[logicType] = logicValue;
      });
      dispatch(setLogic2Skip({ qID: data.qID, message: logicMap }));
    },
  });

  const {
    data,
    isLoading: ListLoading,
    isRefetching: RefetchListLoading,
  } = useQuery({
    queryKey: ["viewCustomList", studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "questionnaire/fetch/qlist", {
        apiToken: user.apiToken,
        studyID,
      });
      const apiData = res.response[0];
      dispatch(setQuestionList(apiData.qList));

      return apiData;
    },
    enabled: !!user.apiToken && !!studyID,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  useEffect(() => {
    dispatch(setQuestionGroup(data));
  }, [data]);

  useEffect(() => {
    StudyInfoRefetch();
    if (data?.qList && Array.isArray(data.qList) && data.qList.length) {
      const newItems = data.qList.filter((item: any) => item && item.qID);
      dispatch(setAllSubmitItems(newItems));
      newItems.forEach((item: any) => submit(item.qID));
    } else {
      dispatch(setAllSubmitItems([]));
    }
  }, [data, submit]);

  useEffect(() => {
    if (!studyID) {
      navigate("/");
      toast.warning(
        "Invalid access route detected. Redirecting you to the homepage for a better experience."
      );
    }
  }, [studyID]);

  if (isInfoLoading || ListLoading || RefetchListLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <AiOutlineLoading3Quarters
          size={34}
          className={cn("animate-spin text-action")}
        />
      </div>
    );
  }

  return (
    <div className="questionnaire-page-bg relative flex h-full min-h-0 flex-col overflow-hidden">
      {(submitItems.length > 0 || isAddingQuestion) && (
        <PageSubheader
          left={
            <div className="flex flex-wrap items-center gap-3">
              {submitItems.length > 0 && (
                <div className="questionnaire-question-count inline-flex min-h-[34px] items-center gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="questionnaire-question-count-value text-sm font-semibold md:text-base">
                      {submitItems.length}
                    </span>
                    <span className="questionnaire-question-count-label text-[11px] font-semibold uppercase tracking-[0.16em]">
                      Questions
                    </span>
                  </div>
                </div>
              )}
            </div>
          }
          right={
            submitItems.length > 0 ? (
              <button
                data-test-id="NEXTTOSURVEY"
                className="platform-btn-pill questionnaire-action-btn inline-flex items-center gap-2 bg-login-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-login-primary-hover"
                onClick={() => {
                  navigate("/publish-survey", {
                    state: { studyID: studyID },
                  });
                }}
              >
                Next <MdArrowForwardIos />
              </button>
            ) : null
          }
          rightClassName="justify-between md:justify-end"
        />
      )}
      {!hasQuestionnaire && !isAddingQuestion ? (
        hasMessages ? (
          <div className="h-full w-full overflow-y-auto overflow-x-hidden pb-40 md:pb-44">
            <div className="mx-auto h-full w-full max-w-5xl px-4 pt-4 md:px-6 md:pt-5">
              <ChatWindow surface="page" scrollMode="external" />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 justify-center overflow-y-auto px-5 pb-40 pt-5 md:px-6 md:pb-44 md:pt-6">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)]">
                <div className="questionnaire-card questionnaire-border overflow-hidden rounded-[30px] border shadow-[0_18px_44px_rgba(79,86,230,0.08)]">
                  <div className="bg-[radial-gradient(circle_at_top_left,_rgba(109,99,255,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(251,250,255,0.98)_100%)] px-6 py-6 md:px-7 md:py-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="home-panel-soft-bg home-highlight inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                        <LuSparkles className="h-3.5 w-3.5" />
                        AI-assisted questionnaire
                      </span>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-login-primary to-action shadow-lg">
                        <LuBotMessageSquare className="h-7 w-7 text-white" />
                        <LuSparkles className="absolute -right-2 -top-2 h-4 w-4 text-amber-400" />
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold questionnaire-heading shadow-sm">
                        Good evening, {firstName}
                      </div>
                    </div>

                    <h2 className="questionnaire-heading mt-5 max-w-3xl text-[clamp(2rem,3.2vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.04em]">
                      Start building your questionnaire
                    </h2>
                    <p className="home-highlight mt-3 max-w-2xl text-[15px] leading-7 md:text-[17px]">
                      Tell Enspeek what your study is about and it can generate
                      your first set of questions in plain language.
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border questionnaire-border bg-white px-4 py-2 text-sm home-muted shadow-sm">
                      Try:
                      <span className="font-semibold text-login-primary">
                        "Generate 5 questions about fresh foods"
                      </span>
                    </div>
                  </div>
                </div>

                <div className="questionnaire-card questionnaire-border rounded-[28px] border px-5 py-6 shadow-[0_14px_36px_rgba(79,86,230,0.07)]">
                  <div className="flex items-center gap-3">
                    <div className="home-panel-soft-bg flex h-12 w-12 items-center justify-center rounded-2xl">
                      <LuCircleCheckBig className="h-6 w-6 text-login-primary" />
                    </div>
                    <div>
                      <p className="questionnaire-heading text-lg font-semibold">
                        What happens next
                      </p>
                      <p className="questionnaire-muted mt-1 text-sm leading-6">
                        A simple path from first question to final survey.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {[
                      "Describe your topic in simple words",
                      "Review and edit the generated questions",
                      "Move to publish survey when ready",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="home-panel-soft-bg rounded-[20px] border questionnaire-border px-4 py-3.5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-login-primary text-sm font-semibold text-white">
                            {index + 1}
                          </div>
                          <p className="questionnaire-heading text-sm font-semibold leading-6">
                            {item}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="questionnaire-card questionnaire-border rounded-[28px] border px-5 py-5 shadow-[0_14px_36px_rgba(79,86,230,0.07)] md:px-6">
                <div className="flex items-center gap-3">
                  <div className="home-panel-soft-bg flex h-12 w-12 items-center justify-center rounded-2xl">
                    <LuWandSparkles className="h-6 w-6 text-login-primary" />
                  </div>
                  <div>
                    <p className="questionnaire-heading text-lg font-semibold">
                      Start with one request
                    </p>
                    <p className="questionnaire-muted mt-1 text-sm leading-6">
                      Choose a suggestion below or type your own request in the chat bar.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {emptyStatePrompts.map((prompt) => (
                    <button
                      key={prompt.title}
                      type="button"
                      onClick={() => {
                        dispatch(setChatOpen(true));
                        dispatch(setMessage(prompt.text));
                      }}
                      className="home-panel-soft-bg questionnaire-border group flex w-full items-start gap-3 rounded-[20px] border px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span className="home-dropdown-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                        {prompt.icon}
                      </span>
                      <span>
                        <span className="questionnaire-heading block text-sm font-semibold">
                          {prompt.title}
                        </span>
                        <span className="questionnaire-muted mt-1 block text-sm leading-6">
                          {prompt.text}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-1 min-h-0">
          <div
            className="relative flex h-full min-h-0 flex-1 items-start justify-center overflow-y-auto overflow-x-hidden"
            onDragOver={isDragDisabled ? undefined : handleDragOver}
            onDrop={isDragDisabled ? undefined : handleDrop}
          >
            {isAddingQuestion ? (
              <QuestionnaireForm
                data={editData}
                onSubmit={(CQID) => submit(CQID)}
                onClose={() => {
                  dispatch(setIsAddingQuestion(false));
                  dispatch(setChatOpen(true));
                  setEditData(null);
                }}
                qType={qType}
                studyInfo={StudyInfo}
              />
            ) : submitItems.length === 0 ? (
              <div className="mt-8">Create or Generate Questions</div>
            ) : (
              <DataList
                submittedItems={submitItems}
                setAllSubmittedItems={(e) => dispatch(setAllSubmitItems(e))}
                onSubmit={(e) => submit(e)}
                handleEdit={(e) => handleEditItem(e)}
                isPending={isPending}
              />
            )}
          </div>
        </div>
      )}
      {!submitItems.length && <ChatTextArea />}
    </div>
  );
}
