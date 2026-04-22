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
  const statusKey = cleanStatus.toLowerCase();
  const stateColor = statusKey.includes("collect")
    ? { text: "text-[#46ad7e]", badge: "bg-[#dff7ec] text-[#46ad7e]" }
    : statusKey.includes("launch")
      ? { text: "text-[#4f68d8]", badge: "bg-[#e6ebff] text-[#4f68d8]" }
      : statusKey.includes("report")
        ? { text: "text-[#7b58d6]", badge: "bg-[#eee7ff] text-[#7b58d6]" }
        : { text: "text-[#6f7394]", badge: "bg-[#eef0ff] text-[#6f7394]" };

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
      <div className="w-full cursor-pointer rounded-2xl border border-[#ececf8] bg-white px-3 py-3 shadow-[0_2px_8px_rgba(54,57,102,0.06)] transition-shadow duration-200 hover:shadow-[0_6px_16px_rgba(54,57,102,0.12)]">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <span
              className={cn(
                "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold uppercase",
                stateColor.badge
              )}
            >
              {`${owner.split(" ")[0][0]}${owner.split(" ")[1]?.[0] ?? ""}`}
            </span>
            <div className="max-w-[11.5rem]">
              <h3
                data-test-id={name}
                title={name}
                className="line-clamp-2 overflow-hidden text-ellipsis text-[14px] leading-5 font-semibold text-[#2d3150]"
                onClick={() =>
                  navigate("/questionnaire", { state: { studyID: id } })
                }
              >
                {name}
              </h3>
              <p className={cn("mt-1 text-sm font-semibold", stateColor.text)}>
                {studystate}
              </p>
            </div>
          </div>
          <NewDropdown
            className="-mr-1"
            trigger={
              <div
                data-test-id={`${name}_CLICK`}
                className="peer/menu-button flex w-8 items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm text-[#8a8ead] outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-[#eff1ff] hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
              >
                <HiOutlineDotsVertical />
              </div>
            }
            items={dropdownItem}
          />
        </div>
        <div className="pl-10">
          <p className="text-xs text-[#8a8fad]">{createAt}</p>
        </div>
      </div>
    </>
  );
};
