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
import { setChatOpen } from "../../../store/ChatSlice";
import { MdArrowForwardIos } from "react-icons/md";
import ChatWindow from "../chat-window/chat";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ChatTextArea from "../../global/chattextares";
import { LuBotMessageSquare, LuSparkles } from "react-icons/lu";

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
        <header className="questionnaire-card questionnaire-border flex border-b px-5 py-4 md:px-6">
          <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 md:flex md:min-h-[42px] md:items-center">
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
            </div>
            <div className="flex items-center justify-between gap-2 md:min-h-[42px]">
              {submitItems.length > 0 && (
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
              )}
            </div>
          </div>
        </header>
      )}
      {!hasQuestionnaire && !isAddingQuestion ? (
        hasMessages ? (
          <div className="mx-auto h-full w-full max-w-5xl">
            <ChatWindow surface="page" />
          </div>
        ) : (
          <div className="flex flex-1 justify-center overflow-y-auto px-6 pb-52 pt-8 md:px-8 md:pb-56 md:pt-10">
            <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-[20px] bg-gradient-to-br from-login-primary to-action shadow-lg">
                <LuBotMessageSquare className="h-9 w-9 text-white" />
                <LuSparkles className="absolute -right-4 -top-4 h-5 w-5 text-amber-400" />
                <LuSparkles className="absolute -left-4 bottom-0 h-4 w-4 text-violet-500" />
              </div>
              <h2 className="questionnaire-heading mt-8 text-[clamp(1.9rem,3.8vw,3rem)] font-semibold leading-tight">
                Start building your questionnaire
              </h2>
              <p className="home-highlight mt-3 max-w-2xl text-[clamp(1rem,1.8vw,1.2rem)] leading-7">
                Ask Enspeek AI to generate questions or create your first question manually.
              </p>
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
