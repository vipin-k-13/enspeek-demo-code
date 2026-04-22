import React, { useState, type RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import type { RootState } from "../../../store/store";
import Button from "../../ui/Button";
import { LuArrowRight, LuDownload, LuSave, LuSettings2 } from "react-icons/lu";
import {
  setIsBannerSettingsOpen,
  setIsDownloadDropdownOpen,
  setSelectedQuestions,
} from "../../../store/CrosstabSlice";
import DropDown from "../../global/DropDown";
import { toast } from "sonner";
import { useTableListAdd } from "../Crosstab/CrossTab.Api";

interface CrosstabHeaderProps {
  dropdownRef: RefObject<HTMLDivElement | null>;
  dropDownData: any[];
}

const Header: React.FC<CrosstabHeaderProps> = ({
  dropDownData,
  dropdownRef,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedBanner, setSelectedBanner] = useState<string>("");
  const { tableListAddMutate } = useTableListAdd(
    location.state?.bannerID,
    location.state.studyID
  );

  const { bannerName, isDownloadDropdownOpen, selectedQuestions } = useSelector(
    (state: RootState) => state.crosstab
  );
  const { tableData, BannersAll } = useSelector(
    (state: RootState) => state.crossTabData
  );

  React.useEffect(() => {
    if (!isDownloadDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        dispatch(setIsDownloadDropdownOpen(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDownloadDropdownOpen, dropdownRef, dispatch]);

  React.useEffect(() => {
    setSelectedBanner(location.state?.bannerID);
  }, [location.state?.bannerID]);

  return (
    <div className="crosstab-surface mb-4 flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <span className="crosstab-title font-semibold">{bannerName} :</span>
        <span> </span>
        <Link
          to="/crosstab"
          state={{ studyID: location.state.studyID }}
          className="crosstab-muted hover:text-login-primary"
        >
          Banner List
        </Link>
        <span> / </span>
        <Link
          to="/crosstab/edit-banner"
          state={{
            studyID: location.state.studyID,
            bannerID: location.state?.bannerID,
          }}
          className={
            location.pathname === "/crosstab/edit-banner"
              ? "questionnaire-label font-semibold"
              : "crosstab-muted"
          }
        >
          Design Banner
        </Link>
        <span> / </span>
        <Link
          to="/crosstab/table-list"
          state={{
            studyID: location.state.studyID,
            bannerID: location.state?.bannerID,
          }}
          className={
            location.pathname === "/crosstab/table-list"
              ? "questionnaire-label font-semibold"
              : "crosstab-muted"
          }
        >
          Crosstab
        </Link>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {tableData.length > 0 ? (
          <>
            <Button
              className="report-toolbar-btn bg-[var(--color-questionnaire-multi)] py-2 text-white hover:opacity-90"
              onClick={() => dispatch(setIsBannerSettingsOpen(true))}
            >
              <LuSettings2 />
            </Button>
            <div className="relative" ref={dropdownRef}>
              <Button
                className="report-toolbar-btn bg-[var(--color-study-progress)] py-2 text-white hover:opacity-90"
                onClick={() =>
                  dispatch(setIsDownloadDropdownOpen(!isDownloadDropdownOpen))
                }
              >
                <LuDownload />
              </Button>
              {isDownloadDropdownOpen && (
                <div className="absolute right-0 mt-1 z-50">
                  <DropDown Data={dropDownData} />
                </div>
                )}
            </div>
            <div className="crosstab-soft-panel flex items-center rounded-[16px] px-3 py-2">
              <select
                value={selectedBanner}
                onChange={(e) => setSelectedBanner(e.target.value)}
                className="home-text bg-transparent pr-2 focus:outline-none"
              >
                {BannersAll.map((banner) => (
                  <option key={banner.bannerid} value={banner.bannerid}>
                    {banner.title}
                  </option>
                ))}
              </select>
              <span
                onClick={() =>
                  navigate("/crosstab/table-list", {
                    state: {
                      studyID: location.state.studyID,
                      bannerID: selectedBanner,
                    },
                  })
                }
                className="report-toolbar-btn ml-2 inline-flex items-center justify-center rounded-xl border border-login-primary px-3 py-1 text-sm text-login-primary hover:bg-login-primary hover:text-white"
              >
                Go <LuArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </div>
          </>
        ) : (
          <Button
            data-test-id="SAVE_QUESTION"
            className="report-toolbar-btn border border-login-primary rounded-2xl text-login-primary hover:bg-login-primary hover:text-white"
            onClick={() => {
              if (selectedQuestions.length === 0) {
                toast.error(
                  "Please select at least one question before saving."
                );
                return;
              }
              tableListAddMutate();
              dispatch(setSelectedQuestions(selectedQuestions));
            }}
          >
            <LuSave /> Save Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
