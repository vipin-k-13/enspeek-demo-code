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
import { getCharBackgroundClass } from "../../utils/descriptions";

type StudyCardProps = {
  id: string;
  name: string;
  status: string;
  owner: string;
  createAt: string;
  share: number;
  isArchived: number;
  launch: number;
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
}) => {
  const navigate = useNavigate();
  const { Archived } = useArchive();
  const { Active } = useActive();
  const dispatch = useDispatch<AppDispatch>();
  const dropdownItem = [
    {
      id: "copy",
      label: "Copy",
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
          onClick: () => Active(id),
          disabled: !Boolean(share),
        }
      : {
          id: "archived",
          label: "Archived",
          onClick: () => Archived(id),
          disabled: !Boolean(share),
        },
    {
      id: "delete",
      label: "Delete",
      onClick: () => {
        dispatch(setSelectedId(id));
        dispatch(setDeleteModel(true));
      },
      disabled: !Boolean(share),
    },
    {
      id: "output",
      label: "Output",
      onClick: () => navigate("/report", { state: { studyID: id } }),
      disabled: !Boolean(launch),
    },
    {
      id: "crosstab",
      label: "Crosstab",
      onClick: () => navigate("/crosstab", { state: { studyID: id } }),
      disabled: !Boolean(launch),
    },
  ];

  return (
    <>
      <div className="cursor-pointer rounded-lg border border-gray-200 bg-indigo-50 shadow-sm py-2 px-4 hover:shadow-md transition-shadow duration-200 w-[22rem]">
        <div className="flex justify-between items-center mb-2">
          <h3
            data-test-id={name}
            className="font-semibold text-[14px] text-gray-800 truncate"
            onClick={() =>
              navigate("/questionnaire", { state: { studyID: id } })
            }
          >
            {name}
          </h3>
          <NewDropdown
            className="-mr-1"
            trigger={
              <div
                data-test-id={`${name}_CLICK`}
                className="peer/menu-button flex w-8 items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-gray-200 hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
              >
                <HiOutlineDotsVertical />
              </div>
            }
            items={dropdownItem}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">{status}</p>
            <p className="text-xs text-gray-600">{createAt}</p>
          </div>
          <span
            className={cn(
              `text-xs p-1.5 rounded-full uppercase`,
              getCharBackgroundClass(owner[0])
            )}
          >
            {`${owner.split(" ")[0][0]}${owner.split(" ")[1][0]}`}
          </span>
        </div>
      </div>
    </>
  );
};
