import { LuDownload, LuPlus, LuSearch } from "react-icons/lu";
import { useLocation } from "react-router";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { setIsAddBannerModalOpen } from "../../../store/CrosstabSlice";
import { useState } from "react";
import { useStudyInfo } from "./CrossTab.Api";
import Input from "../../ui/Input";
import HistoryModal from "../Report/HistoryModal";
import { SurfaceCard } from "../../ui/SurfaceCard";
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
    <SurfaceCard variant="toolbar" className="mb-4 flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
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
      <div className="flex justify-end">
        <div className="flex flex-wrap items-center gap-3">
            <Button
              data-test-id="CREATE_BANNER"
              className="report-toolbar-btn bg-login-primary px-4 py-2.5 text-white hover:bg-login-primary-hover"
              onClick={() => dispatch(setIsAddBannerModalOpen(true))}
            >
              <LuPlus />
              Banner
            </Button>
            <div className="crosstab-soft-panel flex min-w-[220px] items-center px-3 py-2">
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
    </SurfaceCard>
  );
}
