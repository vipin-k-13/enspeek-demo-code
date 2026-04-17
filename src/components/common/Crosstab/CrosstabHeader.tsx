import { FaDownload, FaPlusCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { setIsAddBannerModalOpen } from "../../../store/CrosstabSlice";
import { useState } from "react";
import { useStudyInfo } from "./CrossTab.Api";
import Input from "../../ui/Input";
import HistoryModal from "../Report/HistoryModal";

interface CrosstabHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function CrosstabHeader({
  searchTerm,
  setSearchTerm,
}: CrosstabHeaderProps) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const {} = useStudyInfo(location.state.studyID);

  return (
    <div className="justify-between items-center rounded grid grid-cols-2">
      <div>
        <div className="text-sm">
          <Link
            to="/crosstab"
            className={
              location.pathname.replace(/\/$/, "") === "/crosstab"
                ? "text-action font-semibold"
                : ""
            }
          >
            Banner List
          </Link>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex gap-3 items-center">
          <div className="flex gap-3">
            <Button
              data-test-id="CREATE_BANNER"
              className="text-white bg-primary"
              onClick={() => dispatch(setIsAddBannerModalOpen(true))}
            >
              <FaPlusCircle />
              Banner
            </Button>
            <Input
              placeholder="Search banner..."
              className="focus:outline-none border border-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              className="border border-gray-400 focus:outline-none text-gray-400
                        hover:text-white hover:bg-gray-400"
              onClick={() => setIsDownloadModalOpen(true)}
            >
              <FaDownload />
            </Button>
          </div>
          <HistoryModal
            open={isDownloadModalOpen}
            onOpenChange={setIsDownloadModalOpen}
          />
        </div>
      </div>
    </div>
  );
}
