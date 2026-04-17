import React from "react";
import { FaHome, FaList, FaTable } from "react-icons/fa";
import { FaGears } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import { HiMiniClipboardDocumentList } from "react-icons/hi2";
import type { AppDispatch, RootState } from "../../store/store";
import { cn } from "../../utils";
import { resetStudyInfo } from "../../store/CrosstabStudySlice";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const dispatch = useDispatch<AppDispatch>()

  const study = useSelector((state: RootState) => state.study);

  const icons = [
    { path: "/", icon: <FaHome />, title: "Home" },
  ];

  if (study.studyID) {
    icons.push({
      path: "/questionnaire",
      icon: <FaList />,
      title: "Questionnaire",
    });

    if (Number(study.hasQuestionnaire) === 1) {
      icons.push({
        path: "/publish-survey",
        icon: <FaGears />,
        title: "Publish Survey",
      });
    }

    if (Number(study.launch) === 1) {
      icons.push({
        path: "/report",
        icon: <HiMiniClipboardDocumentList />,
        title: "Report",
      });
      icons.push({ path: "/crosstab", icon: <FaTable />, title: "Crosstab" });
    }
  }

  return (
    <div className="h-full w-[60px] border-r-[1px] border-gray-200 py-4">
      <div className="flex flex-col gap-4 w-full">
        {icons.map(({ path, icon, title }) => {
          const isActive =
            path === "/"
              ? pathname === "/"
              : pathname === path || pathname.startsWith(path + "/");
          return (
            <div
              key={path}
              data-test-id={title}
              className={cn(
                "sidebar_icons cursor-pointer hover:bg-primary hover:text-white",
                isActive && "bg-primary text-white"
              )}
              title={title}
              onClick={() => {
                if(path == "/"){
                  dispatch(resetStudyInfo())
                }
                navigate(path, {
                  state: path !== "/" ? { studyID: state?.studyID } : null,
                });
              }}
            >
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
