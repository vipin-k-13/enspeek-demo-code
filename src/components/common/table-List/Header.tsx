import React, { useState, type RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router";
import type { RootState } from "../../../store/store";
import Button from "../../ui/Button";
import { FaGears } from "react-icons/fa6";
import {
  setIsBannerSettingsOpen,
  setIsDownloadDropdownOpen,
  setSelectedQuestions,
} from "../../../store/CrosstabSlice";
import { FaDownload, FaSave } from "react-icons/fa";
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
    <div className="justify-between items-center rounded grid grid-cols-2 w-full">
      <div>
        <span className="text-gray-700 font-semibold">{bannerName} :</span>
        <span> </span>
        <Link
          to="/crosstab"
          state={{ studyID: location.state.studyID }}
          className="text-gray-600 hover:text-action"
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
              ? "text-action font-semibold"
              : "text-gray-600"
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
              ? "text-action font-semibold"
              : "text-gray-600"
          }
        >
          Crosstab
        </Link>
      </div>
      <div className="flex justify-end gap-2">
        {tableData.length > 0 ? (
          <>
            <Button
              className="bg-gray-500 text-white py-2"
              onClick={() => dispatch(setIsBannerSettingsOpen(true))}
            >
              <FaGears />
            </Button>
            <div className="relative" ref={dropdownRef}>
              <Button
                className="bg-yellow-500 text-white py-2"
                onClick={() =>
                  dispatch(setIsDownloadDropdownOpen(!isDownloadDropdownOpen))
                }
              >
                <FaDownload />
              </Button>
              {isDownloadDropdownOpen && (
                <div className="absolute right-0 mt-1 z-50">
                  <DropDown Data={dropDownData} />
                </div>
              )}
            </div>
            <div className="border border-gray-300 flex rounded py-1 px-3 focus:outline-none">
              <select
                value={selectedBanner}
                onChange={(e) => setSelectedBanner(e.target.value)}
                className="pr-2 focus:outline-none"
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
                className="ml-2 border border-action px-2 text-sm rounded cursor-pointer text-action flex items-center justify-center"
              >
                Go
              </span>
            </div>
          </>
        ) : (
          <Button
            data-test-id="SAVE_QUESTION"
            className="border border-action rounded-md text-action hover:text-white hover:bg-primary"
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
            <FaSave /> Save Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default Header;
