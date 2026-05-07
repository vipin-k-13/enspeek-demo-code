import { useState, type FC, type DragEvent, useRef } from "react";
import { Accordion } from "../../ui/Accrodion";
import QuestionAccordionItem from "./QuestionAccordionItem";
import DeleteModel from "../../global/DeleteModel";
import CopyModel from "../../global/CopyModel";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { cn } from "../../../utils";
import { toast } from "sonner";
import QuesLogicModal from "./QuestionLogicModal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { setChatOpen } from "../../../store/ChatSlice";
interface DataListProps {
  submittedItems: Question[];
  setAllSubmittedItems: (e: Question[]) => void;
  onSubmit: (e: string) => void;
  handleEdit: (e: Question) => void;
  isPending: boolean;
}

const DataList: FC<DataListProps> = ({
  submittedItems,
  setAllSubmittedItems,
  onSubmit,
  handleEdit,
  isPending,
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCopyOpen, setIsCopyOpen] = useState(false);
  const [qId, setQid] = useState<string>("");
  const [oldLabel, setOldLabel] = useState<string>("");
  const location = useLocation();
  const studyID = location.state?.studyID;
  const user = useSelector((state: RootState) => state.user);
  const { launch, output } = useSelector((state: RootState) => state.study);
  const isDragDisabled = launch === 1 && output === 1;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isLogicOpen, setIsLogicOpen] = useState(false);
  const [selectedLogicQID, setSelectedLogicQID] = useState<string | null>(null);
  const MainDiv = useRef<HTMLDivElement | null>(null);
  // const dispatch = useDispatch<AppDispatch>();
  const { mutate: QuestionDelete, isPending: DeleteIsPending } = useMutation({
    mutationKey: ["questionsDelete"],
    mutationFn: async (CQID: string) => {
      const res = await apiRequest("post", `questionnaire/deleteQuestion`, {
        apiToken: user.apiToken,
        studyID,
        QID: CQID,
      });
      return res.response;
    },
    onSuccess: (_, variables) => {
      setIsDeleteOpen(false);
      const newData = submittedItems.filter((p: any) => p.qID !== variables);
      setAllSubmittedItems(newData);
    },
  });
  const { mutate: QuestionCopy, isPending: isCopyPending } = useMutation({
    mutationKey: ["questionsCopy"],
    mutationFn: async (data: {
      CQID: string;
      newId: string;
      label: string;
    }) => {
      const res = await apiRequest("post", `questionnaire/replicate`, {
        apiToken: user.apiToken,
        studyID,
        oldQID: data.CQID,
        newQID: data.newId,
        qLabel: data.label,
      });
      return res.response;
    },
    onSuccess: (_, variables) => {
      setIsCopyOpen(false);
      onSubmit(variables.newId);
      toast.success(`${variables.CQID} question copied successfully`);
    },
  });

  const { mutate: ReArrange } = useMutation({
    mutationKey: ["questionsRearrange"],
    mutationFn: async (data: Record<number, string>) => {
      const res = await apiRequest("post", `questionnaire/rearrange`, {
        apiToken: user.apiToken,
        studyID,
        seq: data,
      });
      return res.response;
    },
  });

  const onDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    const updatedItems = [...submittedItems];
    const [movedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(index, 0, movedItem);
    setAllSubmittedItems(updatedItems);
    setDraggedIndex(null);

    const dropOrder = updatedItems.reduce((acc, item, idx) => {
      acc[idx + 1] = item.qID;
      return acc;
    }, {} as Record<number, string>);

    ReArrange(dropOrder);
  };

  // useEffect(() => {
  //   if (MainDiv.current) {
  //     const height = MainDiv.current.offsetHeight;
  //     if (height > 472) {
  //       dispatch(setChatOpen(false));
  //     }
  //   }
  // }, [MainDiv.current]);

  return (
    <div className="w-full px-3 py-4 md:px-6 md:py-6">
      {isPending && (
        <div className="flex items-center justify-center w-full h-full">
          <AiOutlineLoading3Quarters
            size={34}
            className={cn("animate-spin text-action")}
          />
        </div>
      )}
      <Accordion
        type="multiple"
        className="w-full space-y-4"
        ref={MainDiv}
      >
        {submittedItems.map((data, index) => (
          <div
            key={data.qID}
            draggable={!isDragDisabled}
            onDragStart={
              !isDragDisabled ? (e) => onDragStart(e, index) : undefined
            }
            onDragOver={!isDragDisabled ? (e) => onDragOver(e) : undefined}
            onDrop={!isDragDisabled ? (e) => onDrop(e, index) : undefined}
            className={cn(index === draggedIndex && "opacity-70")}
          >
            <QuestionAccordionItem
              Data={data}
              setIsDeleteOpen={() => {
                setIsDeleteOpen(true);
                setQid(data.qID);
                setOldLabel(data.qLabel);
              }}
              setEditData={() => handleEdit(data)}
              setIsCopyOpen={() => {
                setIsCopyOpen(true);
                setQid(data.qID);
                setOldLabel(data.qLabel);
              }}
              openLogicModal={() => {
                setIsLogicOpen(true);
                setSelectedLogicQID(data.qID);
              }}
            />
          </div>
        ))}

        <DeleteModel
          qID={qId}
          label={oldLabel}
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onClick={() => QuestionDelete(qId)}
          isPending={DeleteIsPending}
        />

        <CopyModel
          qID={qId}
          label={oldLabel}
          isOpen={isCopyOpen}
          onClose={() => setIsCopyOpen(false)}
          onClick={(newId, label) => QuestionCopy({ CQID: qId, newId, label })}
          isPending={isCopyPending}
        />
        <QuesLogicModal
          isOpen={isLogicOpen}
          onClose={() => setIsLogicOpen(false)}
          qID={selectedLogicQID}
          onSubmit={onSubmit}
        />
      </Accordion>
    </div>
  );
};

export default DataList;
