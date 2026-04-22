import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router";
import NewDropdown from "./NewDropDown";
import { useActive, useArchive } from "../common/list/Api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {
  setCopyModel,
  setDeleteModel,
  setSelectedId,
  setSelectedStudyName,
} from "../../store/TriggerSlice";
import { cn } from "../../utils";
import {
  LuArchive,
  LuChartColumn,
  LuClipboardList,
  LuCopy,
  LuTable2,
  LuTrash2,
} from "react-icons/lu";
import { getStudyStateTheme } from "../../utils/studyStateTheme";

type StudyCardProps = {
  id: string;
  name: string;
  status: string;
  owner: string;
  createAt: string;
  share: number;
  isArchived: number;
  launch: number;
  studystate: string;
};

export const StudyCard: React.FC<StudyCardProps> = ({
  id,
  name,
  status,
  owner,
  createAt,
  share,
  isArchived,
  launch,
  studystate,
}) => {
  const navigate = useNavigate();
  const { Archived } = useArchive();
  const { Active } = useActive();
  const dispatch = useDispatch<AppDispatch>();
  const cleanStatus = (status || "").replace(/\|\s*\d+\s*questions?/i, "").trim();
  const questionMatch = (status || "").match(/(\d+)\s*questions?/i);
  const questionCount = questionMatch?.[1];
  const stateTheme = getStudyStateTheme(studystate || cleanStatus);
  const initials = owner
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  const dropdownItem = [
    {
      id: "questionnaire",
      label: "Questionnaire",
      icon: <LuClipboardList className="h-4 w-4" />,
      onClick: () => navigate("/questionnaire", { state: { studyID: id } }),
    },
    {
      id: "copy",
      label: "Copy",
      icon: <LuCopy className="h-4 w-4" />,
      onClick: () => {
        dispatch(setSelectedId(id));
        dispatch(setSelectedStudyName(name));
        dispatch(setCopyModel(true));
      },
    },
    Boolean(isArchived)
      ? {
          id: "active",
          label: "Active",
          icon: <LuArchive className="h-4 w-4" />,
          onClick: () => Active(id),
          disabled: !Boolean(share),
        }
      : {
          id: "archived",
          label: "Archived",
          icon: <LuArchive className="h-4 w-4" />,
          onClick: () => Archived(id),
          disabled: !Boolean(share),
        },
    {
      id: "delete",
      label: "Delete",
      icon: <LuTrash2 className="h-4 w-4" />,
      onClick: () => {
        dispatch(setSelectedId(id));
        dispatch(setDeleteModel(true));
      },
      disabled: !Boolean(share),
    },
    {
      id: "output",
      label: "View Report",
      icon: <LuChartColumn className="h-4 w-4" />,
      onClick: () => navigate("/report", { state: { studyID: id } }),
      disabled: !Boolean(launch),
    },
    {
      id: "crosstab",
      label: "Crosstab",
      icon: <LuTable2 className="h-4 w-4" />,
      onClick: () => navigate("/crosstab", { state: { studyID: id } }),
      disabled: !Boolean(launch),
    },
  ];

  return (
    <>
      <div className="home-surface group relative w-full cursor-pointer overflow-visible rounded-[22px] border home-border-soft px-4 py-4 shadow-md transition-shadow duration-200 hover:shadow-lg">
        <div className={cn("absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full opacity-0 transition-opacity duration-200 group-hover:opacity-100", stateTheme.accentClass)} />
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <span
              className={cn(
                "mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold uppercase shadow-sm",
                stateTheme.avatarClass
              )}
            >
              {initials || "ST"}
            </span>
            <div className="max-w-[12rem]">
              <h3
                data-test-id={name}
                title={name}
                className="home-heading line-clamp-2 overflow-hidden text-ellipsis text-[15px] leading-5 font-semibold"
                onClick={() =>
                  navigate("/questionnaire", { state: { studyID: id } })
                }
              >
                {name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <p className={cn("font-semibold", stateTheme.textClass)}>
                  {studystate || cleanStatus || "Draft"}
                </p>
                {questionCount && (
                  <>
                    <span className="home-muted">|</span>
                    <span className="home-highlight">{`${questionCount} questions`}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <NewDropdown
            className="-mr-1"
            trigger={
              <div
                data-test-id={`${name}_CLICK`}
                className="home-muted hover:bg-home-panel flex h-8 w-8 items-center justify-center rounded-full transition-colors"
              >
                <HiOutlineDotsVertical />
              </div>
            }
            items={dropdownItem}
            position="bottom-right"
            searchable={false}
          />
        </div>
        <div className="pl-14">
          <p className="home-subtle text-[12px]">{createAt}</p>
        </div>
      </div>
    </>
  );
};
