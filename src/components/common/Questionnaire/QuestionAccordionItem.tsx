import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/Accrodion";
import { MdAnchor, MdDelete, MdEdit, MdFileCopy } from "react-icons/md";
import Input from "../../ui/Input";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import OptionLogic from "./OptionLogic";

interface QuestionAccordionItem {
  Data: Question;
  setIsDeleteOpen: () => void;
  setIsCopyOpen: (qID: string, qLabel: string) => void;
  setEditData: () => void;
  openLogicModal: () => void;
}

const QuestionAccordionItem: React.FC<QuestionAccordionItem> = ({
  Data,
  setIsDeleteOpen,
  setIsCopyOpen,
  setEditData,
  openLogicModal,
}) => {
  const { launch, output } = useSelector((state: RootState) => state.study);
  const disableActions = launch === 1 && output === 1;
  const logic2Skip = useSelector(
    (state: RootState) => state.question.logic2Skip?.[Data.qID]
  );
  
  return (
    <AccordionItem value={Data.qID}>
      <AccordionTrigger>
        <div data-test-id={Data.qID} className="w-full flex justify-between items-center rounded-t-lg px-4 py-2 bg-white border-[1px] border-gray-300 focus:outline-none">
          <div
            className={`flex text-gray-700 text-lg gap-1 ${
              disableActions ? "cursor-default" : "cursor-move"
            }`}
          >
            <p>{Data.qLabel}</p>
          </div>
          <div className="flex items-center gap-4 text-gray-600 text-sm">
            <span className="bg-gray-200 py-0.5 px-2 rounded text-primary">
              {Data.qType}
            </span>
            {!disableActions && (
              <>
                <MdDelete
                  className="cursor-pointer text-red-500 hover:text-red-500/80"
                  title="Delete"
                  data-test-id={`${Data.qID}_DELETE`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteOpen();
                  }}
                />
                <MdEdit
                  className="cursor-pointer text-action hover:text-action/80"
                  data-test-id={`${Data.qID}_EDIT`}
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditData();
                  }}
                />
                <MdFileCopy
                  className="cursor-pointer text-blue-600 hover:text-blue-900 focus:outline-none"
                  data-test-id={`${Data.qID}_COPY`}
                  title="Copy"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCopyOpen(Data.qID, Data.qLabel);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="px-4 py-3 bg-gray-50">
          {logic2Skip &&
            Object.entries(logic2Skip).map(([type, message]) => (
              <p key={type} className="text-red-500 text-sm mb-1">
                <span className="font-semibold capitalize">{type}:</span>{" "}
                {message}
              </p>
            ))}

            <div className="flex items-center gap-3">
              <MdAnchor
                className="text-red-500 cursor-pointer"
                title="Add/Edit Question Logic"
                onClick={() => openLogicModal()}
              />
              <p className="text-red-500 opacity-29">Add/Edit Logic</p>
            </div>
           
          <div className="text-md text-gray-700 my-2">{Data.qText}</div>
          <div className="space-y-4">
            {Data.rowOptionList &&
              Data.rowOptionList.map((key, index) => (
                <div key={key.optionText} className="flex items-center gap-2">
                  <label> R{index + 1}</label>
                  <input
                    type="radio"
                    id={`option-${index}`}
                    name="carPurchaseReason"
                  />
                  <div className="flex items-center justify-between gap-4 w-full">
                    <label
                      htmlFor={`option-${index}`}
                      className="text-md flex items-center"
                    >
                      {key.optionText}
                    </label>

                    <div className="flex items-center gap-2">
                      <OptionLogic key={index} qID={Data.qID} rowIndex={key.optionID} optionText={key.optionText} />
                    </div>
                  </div>

                  {Boolean(key.other) && (
                    <Input className="h-6 w-20 bg-white focus-visible:ring-0 pl-1" />
                  )}
                </div>
              ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default QuestionAccordionItem;
