import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/Accrodion";
import {
  LuChevronDown,
  LuChevronRight,
  LuCopy,
  LuGripVertical,
  LuGitBranchPlus,
  LuPencilLine,
  LuTrash2,
} from "react-icons/lu";
import Input from "../../ui/Input";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import OptionLogic from "./OptionLogic";
import { cn } from "../../../utils";
import { formatQuestionTypeLabel } from "../../../utils/questionnaireTheme";
import { useAccordionContext } from "../../ui/Accrodion/Accordion";
import { Tooltip } from "../../ui/Tooltip";
import IconActionButton from "../../ui/IconActionButton";

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
  const { isExpanded } = useAccordionContext();
  const { launch, output } = useSelector((state: RootState) => state.study);
  const disableActions = launch === 1 && output === 1;
  const logic2Skip = useSelector(
    (state: RootState) => state.question.logic2Skip?.[Data.qID]
  );
  const expanded = isExpanded(Data.qID);

  return (
    <AccordionItem value={Data.qID} className="border-0">
      <AccordionTrigger>
        <div
          data-test-id={Data.qID}
          className={cn(
            "questionnaire-card questionnaire-border w-full rounded-[24px] border px-4 py-4 shadow-sm transition-shadow md:px-6",
            expanded && "rounded-b-none border-b-0 shadow-none"
          )}
        >
          <div className="flex w-full items-center gap-3">
            <div
              className={cn(
                "questionnaire-muted shrink-0",
                disableActions ? "cursor-default" : "cursor-move"
              )}
            >
              <LuGripVertical className="h-5 w-5" />
            </div>
            <span className="question-type-default rounded-full px-4 py-1 text-sm font-semibold">
              {Data.qID}
            </span>
            <div className="min-w-0 flex-1 pr-1">
              <p className="questionnaire-heading truncate text-left text-[18px] font-semibold">
                {Data.qText}
              </p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Tooltip content="Add or edit logic" position="top">
                <span
                  role="button"
                  tabIndex={0}
                  className="questionnaire-label questionnaire-clickable inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLogicModal();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      openLogicModal();
                    }
                  }}
                >
                  <LuGitBranchPlus className="h-4 w-4" />
                  <span>Add/Edit Logic</span>
                </span>
              </Tooltip>
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-semibold",
                  "question-type-open"
                )}
              >
                {formatQuestionTypeLabel(Data.qType)}
              </span>
            </div>
            {!disableActions && (
              <div
                className="questionnaire-muted flex items-center gap-2 md:gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <Tooltip content="Edit question" position="top">
                  <IconActionButton
                    tone="primary"
                    data-test-id={`${Data.qID}_EDIT`}
                    onClick={() => setEditData()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setEditData();
                      }
                    }}
                  >
                    <LuPencilLine className="h-4 w-4" />
                  </IconActionButton>
                </Tooltip>
                <Tooltip content="Copy question" position="top">
                  <IconActionButton
                    tone="primary"
                    data-test-id={`${Data.qID}_COPY`}
                    onClick={() => setIsCopyOpen(Data.qID, Data.qLabel)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsCopyOpen(Data.qID, Data.qLabel);
                      }
                    }}
                  >
                    <LuCopy className="h-4 w-4" />
                  </IconActionButton>
                </Tooltip>
                <Tooltip content="Delete question" position="top">
                  <IconActionButton
                    tone="danger"
                    data-test-id={`${Data.qID}_DELETE`}
                    onClick={() => setIsDeleteOpen()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsDeleteOpen();
                      }
                    }}
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </IconActionButton>
                </Tooltip>
              </div>
            )}
            <Tooltip content={expanded ? "Collapse question" : "Expand question"} position="top">
              <div className="questionnaire-muted questionnaire-clickable shrink-0">
                {expanded ? (
                  <LuChevronDown className="h-5 w-5" />
                ) : (
                  <LuChevronRight className="h-5 w-5" />
                )}
              </div>
            </Tooltip>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="questionnaire-card questionnaire-border rounded-b-[24px] border border-t-0 px-4 pb-6 pt-2 md:px-6">
          {logic2Skip &&
            Object.entries(logic2Skip).map(([type, message]) => (
              <p key={type} className="questionnaire-delete mb-1 text-sm">
                <span className="font-semibold capitalize">{type}:</span>{" "}
                {message}
              </p>
            ))}

          <div className="space-y-6 border-t questionnaire-border pt-5">
            <div>
              <p className="questionnaire-label">
                Question Text
              </p>
              <p className="questionnaire-heading mt-2 text-[17px]">
                {Data.qText}
              </p>
            </div>

            {Data.qNote3 && (
              <div>
                <p className="questionnaire-label">
                  Instruction
                </p>
                <p className="questionnaire-heading mt-2 text-[17px] italic">
                  {Data.qNote3}
                </p>
              </div>
            )}

            {!!Data.rowOptionList?.length && (
              <div>
                <p className="questionnaire-label">
                  Answer Options
                </p>
                <div className="mt-3 space-y-3">
            {Data.rowOptionList &&
              Data.rowOptionList.map((key, index) => (
                    <div
                      key={key.optionID}
                      className="questionnaire-input rounded-[18px] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <label className="questionnaire-label w-8 shrink-0 pt-0.5">{`R${
                          index + 1
                        }`}</label>
                        <div className="flex w-full min-w-0 items-center justify-between gap-4">
                          <label
                            htmlFor={`option-${index}`}
                            className="questionnaire-heading text-[16px]"
                          >
                            {key.optionText}
                          </label>

                          <div className="flex items-center gap-2">
                            <OptionLogic
                              key={index}
                              qID={Data.qID}
                              rowIndex={key.optionID}
                              optionText={key.optionText}
                            />
                          </div>
                        </div>

                        {Boolean(key.other) && (
                          <Input className="questionnaire-input h-8 w-24 border-0 focus-visible:ring-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default QuestionAccordionItem;
