import { useEffect, useRef, useState, type FC } from "react";
import { FaFacebookF, FaUsers, FaWhatsapp } from "react-icons/fa";
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
import { LuArrowRight } from "react-icons/lu";
import PageSubheader from "../../ui/PageSubheader";

interface PublishSurveyHeaderProps {
  studyName?: string;
  launch?: number;
  isSurveyActive: boolean;
  onActivate?: () => void;
}
const PublishSurveyHeader: FC<PublishSurveyHeaderProps> = ({
  studyName,
  launch,
  isSurveyActive,
  onActivate,
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
      <PageSubheader
        left={
          isSurveyActive ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                data-test-id="FACEBOOK_SURVEY"
                className="questionnaire-action-btn inline-flex h-10 items-center gap-2 rounded-full bg-[var(--color-brand-info)] px-5 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
                onClick={() => {
                  dispatch(setIsFbModalOpen(true));
                }}
              >
                <FaFacebookF className="text-base" />
                <span>Share on Facebook</span>
              </button>
              <button
                className="questionnaire-action-btn inline-flex h-10 items-center gap-2 rounded-full bg-[var(--color-study-activated)] px-5 text-sm font-bold text-white shadow-sm transition hover:brightness-95"
                data-test-id="WHATSAPP_SURVEY"
                onClick={() => {
                  dispatch(setIsWhatsappModalOpen(true));
                }}
              >
                <FaWhatsapp className="text-base" />
                <span>Share on WhatsApp</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="questionnaire-question-count inline-flex min-h-[34px] items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="questionnaire-question-count-value text-sm font-semibold md:text-base">
                    Survey
                  </span>
                  <span className="questionnaire-question-count-label text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Not Active
                  </span>
                </div>
              </div>
            </div>
          )
        }
        right={
          <>
            {!isSurveyActive && (
              <button
                data-test-id="ACTIVATE_FROM_SUBHEADER"
                className="questionnaire-action-btn inline-flex h-10 items-center gap-2 rounded-full bg-login-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-login-primary-hover"
                onClick={onActivate}
              >
                Activate Survey
              </button>
            )}
            {isSurveyActive && launch !== 1 && (
              <button
                data-test-id="INITIATE"
                className="questionnaire-action-btn inline-flex h-10 items-center gap-2 rounded-full bg-login-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-login-primary-hover"
                onClick={() => {
                  setIsOpenInitiate(true);
                }}
              >
                <FaUsers /> Initiate Sample Collection
              </button>
            )}
            {isSurveyActive && launch === 1 && studyInfo.closed === 1 && (
              <button
                className="questionnaire-action-btn inline-flex h-10 items-center gap-2 rounded-full bg-login-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-login-primary-hover"
                onClick={() => {
                  setIsOpenInitiate(true);
                }}
              >
                Relaunch Survey
              </button>
            )}
            {launch === 1 && (
              <button
                data-test-id="NEXT_TO_REPORT"
                className="questionnaire-action-btn inline-flex h-10 items-center gap-2 rounded-full bg-login-primary px-6 text-sm font-bold text-white shadow-sm transition hover:bg-login-primary-hover"
                onClick={() => {
                  navigate("/report", { state: { studyID: state.studyID } });
                }}
              >
                Next <LuArrowRight className="h-4 w-4" />
              </button>
            )}
            <div className="relative" ref={dropdownRef}>
              {open && (
                <div className="absolute right-0 z-10 rounded-lg shadow-2xl">
                  <DropDown Data={rawDataDropdown} className="w-52" />
                </div>
              )}
            </div>
          </>
        }
        leftClassName="flex min-h-[42px] flex-wrap items-center gap-3 md:block"
        rightClassName="gap-3"
      />
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
