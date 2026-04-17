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
    <div className="min-h-screen px-3">
      <DesignBanner_Header />
      <div>
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
          <h3 className="text-sm mb-2">Banner Preview</h3>
          {!isBannerPointerListPending && (
            <div className="flex flex-wrap border border-gray-300">
              {BannerPointer.map((point, index) => (
                <div
                  key={index}
                  className="flex-1 border border-gray-200 bg-white p-2 min-w-[150px] text-sm"
                >
                  {point.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerDesign_page;