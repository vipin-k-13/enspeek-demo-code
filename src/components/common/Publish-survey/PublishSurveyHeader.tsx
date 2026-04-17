import { useEffect, useRef, useState, type FC } from "react";
import { FaFacebookSquare, FaUsers, FaWhatsappSquare } from "react-icons/fa";
import SampleCollectionModel from "./SampleCollectionModel";
import { setIsHistoryModalOpen } from "../../../store/CrosstabSlice";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "../../global/DropDown";
import type { RootState } from "../../../store/store";
import { useLocation, useNavigate } from "react-router";
import {
  setIsWhatsappModalOpen,
  setIsFbModalOpen,
} from "../../../store/CrosstabSlice";
import FacebookModal from "./FacebookModal";
import WhatsaapModal from "./WhatsaapModal";

interface PublishSurveyHeaderProps {
  studyName?: string;
  launch?: number;
  isSurveyActive: boolean;
}
const PublishSurveyHeader: FC<PublishSurveyHeaderProps> = ({
  studyName,
  launch,
  isSurveyActive,
}) => {
  const [isOpenInitiate, setIsOpenInitiate] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const studyInfo = useSelector((state: RootState) => state.study);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isWhatsappModalOpen, isFbModalOpen } = useSelector(
    (state: RootState) => state.crosstab
  );
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };
  const rawDataDropdown = [
    {
      Title: "Download Excel Raw Data",
      onClick: () => {},
    },
    {
      Title: "Download SPSS Raw Data",
      onClick: () => {},
    },
    {
      Title: "Download History",
      onClick: () => {
        dispatch(setIsHistoryModalOpen(true));
      },
    },
  ];

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          {isSurveyActive && (
            <div className="flex gap-2 justify-between items-center">
              <button
                data-test-id="FACEBOOK_SURVEY"
                className="bg-primary text-white px-1 py-1 rounded flex items-center cursor-pointer hover:bg-primary/90"
                onClick={() => {
                  dispatch(setIsFbModalOpen(true));
                }}
              >
                <FaFacebookSquare className="text-2xl" />
              </button>
              <button
                className="bg-green-500 text-white px-1 py-1 rounded flex items-center cursor-pointer hover:bg-green-500/80"
                data-test-id="WHATSAPP_SURVEY"
                onClick={() => {
                  dispatch(setIsWhatsappModalOpen(true));
                }}
              >
                <FaWhatsappSquare className="text-2xl" />
              </button>
            </div>
          )}
          {isSurveyActive && launch !== 1 && (
            <button
              data-test-id="INITIATE"
              className="px-3 py-1 gap-2 flex items-center text-lg bg-primary text-white rounded hover:bg-primary/90 cursor-pointer focue:outline-none"
              onClick={() => {
                setIsOpenInitiate(true);
              }}
            >
              <FaUsers /> Initiate Sample Collection
            </button>
          )}
          {isSurveyActive && launch === 1 && studyInfo.closed === 1 && (
            <button
              className="px-3 py-1 gap-2 flex items-center text-lg bg-primary text-white rounded hover:bg-primary/90 cursor-pointer focue:outline-none"
              onClick={() => {
                setIsOpenInitiate(true);
              }}
            >
              Relaunch Survey
            </button>
          )}
          {launch === 1 && (
            <>
              <button
                data-test-id="NEXT_TO_REPORT"
                className="px-3 py-1 gap-2 flex items-center text-lg bg-primary text-white rounded hover:bg-primary/90 cursor-pointer focue:outline-none"
                onClick={() => {
                  navigate("/report", { state: { studyID: state.studyID } });
                }}
              >
                Next
              </button>
            </>
          )}
          <div className="relative" ref={dropdownRef}>
            {open && (
              <div className="absolute right-0 shadow-2xl rounded-lg z-10">
                <DropDown Data={rawDataDropdown} className="w-52" />
              </div>
            )}
          </div>
        </div>
      </div>
      <SampleCollectionModel
        isOpen={isOpenInitiate}
        Closed={() => setIsOpenInitiate(false)}
        studyName={studyName}
      />
      {isWhatsappModalOpen && (
        <WhatsaapModal
          onClose={() => dispatch(setIsWhatsappModalOpen(false))}
          onSave={() => {
            dispatch(setIsWhatsappModalOpen(false));
          }}
        />
      )}
      {isFbModalOpen && (
        <FacebookModal
          onClose={() => dispatch(setIsFbModalOpen(false))}
          onSave={() => {
            dispatch(setIsFbModalOpen(false));
          }}
        />
      )}
    </>
  );
};
export default PublishSurveyHeader;
