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
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import Input from "../../ui/Input";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import OptionLogic from "./OptionLogic";
import { cn } from "../../../utils";
import {
  formatQuestionTypeLabel,
  getQuestionTypeTheme,
} from "../../../utils/questionnaireTheme";
import { useAccordionContext } from "../../ui/Accrodion/Accordion";
import Button from "../../ui/Button";

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
  const { isExpanded, toggleItem } = useAccordionContext();
  const { launch, output } = useSelector((state: RootState) => state.study);
  const disableActions = launch === 1 && output === 1;
  const logic2Skip = useSelector(
    (state: RootState) => state.question.logic2Skip?.[Data.qID]
  );
  const expanded = isExpanded(Data.qID);
  const qTypeTheme = getQuestionTypeTheme(Data.qType);
  
  return (
    <AccordionItem value={Data.qID} className="border-0">
      <AccordionTrigger>
        <div
          data-test-id={Data.qID}
          className={cn(
            "questionnaire-card questionnaire-border w-full rounded-[24px] border px-4 py-4 shadow-sm transition-shadow md:px-5",
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
            <div className="min-w-0 flex-1">
              <p className="questionnaire-heading truncate text-left text-lg font-medium">
                {Data.qText}
              </p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <button
                type="button"
                className="questionnaire-label questionnaire-clickable inline-flex items-center gap-2 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openLogicModal();
                }}
              >
                <LuGitBranchPlus className="h-4 w-4" />
                <span>Add/Edit Logic</span>
              </button>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium",
                  qTypeTheme.badgeClass
                )}
              >
                {formatQuestionTypeLabel(Data.qType)}
              </span>
            </div>
            {!disableActions && (
              <div
                className="questionnaire-muted flex items-center gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  role="button"
                  tabIndex={0}
                  className="questionnaire-clickable transition hover:text-login-primary"
                  data-test-id={`${Data.qID}_EDIT`}
                  title="Edit"
                  onClick={() => setEditData()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setEditData();
                    }
                  }}
                >
                  <LuPencil className="h-4 w-4" />
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  className="questionnaire-clickable transition hover:text-login-primary"
                  data-test-id={`${Data.qID}_COPY`}
                  title="Copy"
                  onClick={() => setIsCopyOpen(Data.qID, Data.qLabel)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsCopyOpen(Data.qID, Data.qLabel);
                    }
                  }}
                >
                  <LuCopy className="h-4 w-4" />
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  className="questionnaire-delete questionnaire-clickable transition hover:opacity-80"
                  data-test-id={`${Data.qID}_DELETE`}
                  title="Delete"
                  onClick={() => setIsDeleteOpen()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsDeleteOpen();
                    }
                  }}
                >
                  <LuTrash2 className="h-4 w-4" />
                </span>
              </div>
            )}
            <div className="questionnaire-muted questionnaire-clickable shrink-0">
              {expanded ? (
                <LuChevronDown className="h-5 w-5" />
              ) : (
                <LuChevronRight className="h-5 w-5" />
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="questionnaire-card questionnaire-border rounded-b-[24px] border border-t-0 px-4 pb-5 pt-2 md:px-5">
          {logic2Skip &&
            Object.entries(logic2Skip).map(([type, message]) => (
              <p key={type} className="questionnaire-delete mb-1 text-sm">
                <span className="font-semibold capitalize">{type}:</span>{" "}
                {message}
              </p>
            ))}

          <div className="space-y-5 border-t questionnaire-border pt-4">
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
                      className="flex items-start gap-3"
                    >
                      <label className="questionnaire-label w-8 shrink-0 pt-0.5">{`R${
                        index + 1
                      }`}</label>
                      <div className="flex w-full min-w-0 items-start justify-between gap-4">
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
