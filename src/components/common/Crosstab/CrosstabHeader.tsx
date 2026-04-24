import { LuDownload, LuPlus, LuSearch } from "react-icons/lu";
import { useLocation } from "react-router";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { setIsAddBannerModalOpen } from "../../../store/CrosstabSlice";
import { useState } from "react";
import { useStudyInfo } from "./CrossTab.Api";
import Input from "../../ui/Input";
import HistoryModal from "../Report/HistoryModal";
import PageBreadcrumbs from "../../ui/PageBreadcrumbs";

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
    <header className="questionnaire-card questionnaire-border flex border-b px-5 py-4 md:px-6">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 md:flex md:min-h-[42px] md:items-center">
          <PageBreadcrumbs
            items={[
              {
                label: "Banner List",
                to: "/crosstab",
                active: location.pathname.replace(/\/$/, "") === "/crosstab",
              },
            ]}
          />
        </div>
        <div className="flex min-h-[42px] justify-end">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              data-test-id="CREATE_BANNER"
              className="report-toolbar-btn h-10 bg-login-primary px-4 text-sm font-bold text-white hover:bg-login-primary-hover"
              onClick={() => dispatch(setIsAddBannerModalOpen(true))}
            >
              <LuPlus />
              Banner
            </Button>
            <div className="crosstab-soft-panel flex h-10 min-w-[220px] items-center px-3">
              <LuSearch className="crosstab-muted h-4 w-4" />
              <Input
                placeholder="Search banner..."
                className="home-text border-0 bg-transparent px-2 py-0 focus:outline-none focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="report-toolbar-btn border home-border-soft bg-white text-[var(--color-brand-info)] hover:bg-[var(--color-brand-primary-softest)]"
              onClick={() => setIsDownloadModalOpen(true)}
            >
              <LuDownload />
            </Button>
            <HistoryModal
              open={isDownloadModalOpen}
              onOpenChange={setIsDownloadModalOpen}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
