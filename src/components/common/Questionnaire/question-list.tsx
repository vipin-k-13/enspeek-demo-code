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
  const { isAddingQuestion } = useSelector((state: RootState) => state.trigger);

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
    <div className="flex flex-col bg-white border-gray-200 relative h-full">
      <header className="flex justify-end items-center px-4">
        <div className="flex gap-2 justify-between items-center">
          {submitItems.length > 0 && (
            <button
              data-test-id="NEXTTOSURVEY"
              className="bg-primary text-white px-4 py-1 rounded flex items-center cursor-pointer hover:bg-primary/90"
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
      </header>
      {!hasQuestionnaire && !isAddingQuestion ? (
        <div className="w-full md:max-w-2xl mx-auto">
          <ChatWindow />
        </div>
      ) : (
        <div className="flex flex-1">
          <div
            className="flex-1 relative flex items-start justify-center"
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
