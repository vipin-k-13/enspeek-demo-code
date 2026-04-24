import { useLocation } from "react-router";
import DesignBanner_Header from "../components/common/design-banner/header";
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import TabButtons from "../components/common/design-banner/tabButtons";
import PointDetails from "../components/common/design-banner/pointerDetails";
import { useBannerPointerList } from "../components/common/design-banner/designBanner_Api";

const BannerDesign_page = () => {
  const { state } = useLocation();

  const { BannerPointer } = useSelector(
    (state: RootState) => state.crossTabData
  );

  const { bannerPointerListData, isBannerPointerListPending } =
    useBannerPointerList(state?.bannerID, state.studyID);

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="crosstab-page-bg flex h-full min-h-0 flex-col overflow-hidden">
      <DesignBanner_Header />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-8 pt-3 md:px-4 md:pb-10 md:pt-4">
        <div className="w-full">
        <TabButtons
          activeTab={activeTab}
          isBannerPointerListPending={isBannerPointerListPending}
          setActiveTab={setActiveTab}
        />

        <PointDetails
          activeTab={activeTab}
          isBannerPointerListPending={isBannerPointerListPending}
          setActiveTab={setActiveTab}
          bannerPointerListData={bannerPointerListData}
        />

        <div className="mt-4">
          <h3 className="crosstab-title mb-3 text-sm font-semibold">Banner Preview</h3>
          {!isBannerPointerListPending && (
            <div className="crosstab-surface flex flex-wrap p-2">
              {BannerPointer.map((point, index) => (
                <div
                  key={index}
                  className="crosstab-soft-panel crosstab-title min-w-[150px] flex-1 p-3 text-sm"
                >
                  {point.title}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDesign_page;
