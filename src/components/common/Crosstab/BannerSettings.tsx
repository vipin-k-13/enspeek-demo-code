import DynamicModel from "../../global/DynamicModel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useEditBanner, useQList, useTableListAdd } from "./CrossTab.Api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BannerLogic from "../../global/BannerLogic";
import { useLocation } from "react-router";
import { setSelectedQuestions } from "../../../store/CrosstabSlice";
import { toast } from "sonner";
import { cn } from "../../../utils";
import CrosstabInput from "../../global/CrosstabInput";

interface BannerSettingsProps {
  Id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BannerSettings({
  Id,
  isOpen,
  onClose,
}: BannerSettingsProps) {
  if (!isOpen) return null;
  const [bannerLogic, setBannerLogic] = useState<{ pointLogic: string }[]>([]);
  const { BannersAll, BannerPointer, tableData } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const { selectedQuestions } = useSelector(
    (state: RootState) => state.crosstab
  );
  const dispatch = useDispatch<AppDispatch>();
  const { state } = useLocation();
  const [value, setValue] = useState<Banner>({
    bannerid: "",
    title: "",
    description: "",
    bannerList_logic: "",
    active: 0,
    seq: 0,
    statGroup: "",
    statLevel: "",
    tb_enabled: 0,
    userID: "",
    count: 0,
    percent: 0,
    default: 0,
    tableID_list: [],
  });

  useEffect(() => {
    dispatch(setSelectedQuestions(tableData.map((table) => table.qID)));
    setValue(BannersAll.find((pre) => pre.bannerid === Id) as Banner);
  }, []);

  const { QListData, isQListDataPending } = useQList(state.studyID, Id);
  const { editBannerMutation, isEditBannerPending } = useEditBanner({
    studyID: state.studyID,
    cb: () => onClose(),
  });
  const { tableListAddMutate } = useTableListAdd(value.bannerid, state.studyID);

  const isAllSelected =
    !isQListDataPending && selectedQuestions.length === QListData.length;

  const toggleAll = () => {
    dispatch(
      setSelectedQuestions(
        isAllSelected ? [] : QListData.map((q: any) => q.qID)
      )
    );
  };

  const toggleQuestion = (question: string) => {
    dispatch(
      setSelectedQuestions(
        selectedQuestions.includes(question)
          ? selectedQuestions.filter((q) => q !== question)
          : [...selectedQuestions, question]
      )
    );
  };

  const handleClick = () => {
    if (!selectedQuestions.length) {
      toast.warning("Pelease select Atlest one question");
      return;
    }

    if (value) {
      tableListAddMutate();
      editBannerMutation({
        ...value,
        bannerID: value.bannerid,
        logic: bannerLogic,
      });
    }
  };

  if (isEditBannerPending) return;
  <div className="flex items-center justify-center w-full h-full">
    <AiOutlineLoading3Quarters
      size={34}
      className={cn("animate-spin text-action")}
    />
  </div>;

  return (
    <DynamicModel
      Title={`Banner Settings: ${value.title}`}
      ButtonText="Save Banner Settings"
      isOpen={isOpen}
      onClose={onClose}
      onClick={handleClick}
      className="max-w-4xl"
    >
      <div className="space-y-4">
        <div>
          <CrosstabInput
            label="Banner Name"
            data-test-id="BANNER_NAME"
            placeholder="Enter label"
            value={value.title}
            onChange={(e) =>
              setValue((prev) => prev && { ...prev, title: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <CrosstabInput
              data-test-id="BANNER_DESCRIPTION"
              label="Banner Description"
              placeholder="Enter Description"
              value={value.description}
              onChange={(e) =>
                setValue(
                  (prev) => prev && { ...prev, description: e.target.value }
                )
              }
            />
          </div>
          <div>
            <CrosstabInput
              label="Stat Testing"
              placeholder="eg. AB,C-F"
              onChange={() => {}}
            />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Select View Type</label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox cursor-pointer"
                checked={Boolean(value.percent)}
                onChange={(e) =>
                  setValue((prev) => ({
                    ...prev,
                    percent: e.target.checked ? 1 : 0,
                  }))
                }
              />
              <span className="ml-2">Percentage</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">
            Overall Banner Filter (optional)
          </label>
          <BannerLogic setLogicFunc={setBannerLogic} />
        </div>
        <div className="p-4 shadow-md border border-gray-200 rounded">
          <label className="block font-medium mb-1">Banner Preview</label>
          <div className="flex">
            {BannerPointer.map((info) => (
              <div
                key={info.pointID}
                className="border-2 border-gray-300 w-full p-1"
              >
                {info.title}
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 shadow-md border border-gray-200 rounded">
          <h3 className="font-semibold mb-3">Question list</h3>
          <div>
            <div className="flex items-center px-4 py-2 bg-white">
              <input
                type="checkbox"
                className="mr-3 cursor-pointer"
                checked={isAllSelected}
                onChange={toggleAll}
              />
              <span className="font-medium">Select All Questions</span>
            </div>

            {isQListDataPending ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              QListData.map((question: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center px-4 py-2 bg-gray-50 mb-2 last:mb-0"
                >
                  <input
                    type="checkbox"
                    data-test-id={`Q_${idx}`}
                    className="mr-3 cursor-pointer"
                    checked={selectedQuestions.includes(question.qID)}
                    onChange={() => toggleQuestion(question.qID)}
                  />
                  <span>{question.qLabel}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DynamicModel>
  );
}
