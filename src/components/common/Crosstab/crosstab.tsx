import { LuPlus } from "react-icons/lu";
import DefaultBanner from "./DefaultBanner";
import AddBannerModal from "./BannerModal";
import {
  useAddBanner,
  useBannerList,
  useQList,
  useTableListAdd,
} from "./CrossTab.Api";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setIsAddBannerModalOpen,
  setSelectedQuestions,
} from "../../../store/CrosstabSlice";
import { useEffect } from "react";
import {
  resetLogicData,
  resetTableData,
} from "../../../store/CrossTabDataSlice";
import Error from "../../global/Error";
import { useLocation } from "react-router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "../../../utils";

export default function Crosstab() {
  const { state } = useLocation();
  const { BannerListData, isBannerListLoading, isBannerListError } =
    useBannerList(state.studyID);
  const { addBannerMutation, isAddBannerPending } = useAddBanner({
    studyID: state.studyID,
    cb: () => dispatch(setIsAddBannerModalOpen(false)),
  });
  const { firstName, lastName } = useSelector((state: RootState) => state.user);

  const defaultBannerID =
    BannerListData?.length === 1 && BannerListData[0].default === 1
      ? BannerListData[0].bannerid
      : null;

  const { QListData } = useQList(state.studyID, defaultBannerID || "");
  const { tableListAddMutate } = useTableListAdd(
    defaultBannerID,
    state.studyID
  );
  const dispatch = useDispatch<AppDispatch>();
  const { isAddBannerModalOpen } = useSelector(
    (state: RootState) => state.crosstab
  );
  const { Banners } = useSelector((state: RootState) => state.crossTabData);

  useEffect(() => {
    if (QListData && defaultBannerID) {
      const Q = QListData.map((q: any) => q.qID);
      dispatch(setSelectedQuestions(Q));
      tableListAddMutate();
    }
  }, [QListData]);

  useEffect(() => {
    dispatch(resetLogicData());
    dispatch(resetTableData());
  }, []);

 if (isBannerListLoading) {
  return (
    <div className="flex items-center justify-center w-full h-[78vh]">
      <AiOutlineLoading3Quarters
        size={34}
        className={cn("animate-spin text-action")}
      />
    </div>
  );
}

  if (isBannerListError) return <Error showHome />;

  return (
    <div className="crosstab-surface min-h-[78vh] overflow-hidden">
      <div className="h-[78vh] w-full overflow-y-auto px-3 py-3 md:px-4">
        {Banners.length ? (
          Banners.map((Banner: any) => {
            const matchedBanner = BannerListData.find(
              (b: any) => b.bannerid === Banner.bannerid
            );
            const tableIDList = matchedBanner?.tableID_list || [];
            return (
              <DefaultBanner
                key={Banner.bannerid}
                Id={Banner.bannerid}
                Title={Banner.title}
                description={Banner.description}
                OwnerName={
                  Banner.firstName && Banner.lastName
                    ? `${Banner.firstName} ${Banner.lastName}`
                    : `${firstName} ${lastName}`
                }
                tableIDList={tableIDList}
              />
            );
          })
        ) : BannerListData && BannerListData.length && !Banners.length ? (
          <div className="flex flex-col items-center justify-center mt-24">
            <p className="crosstab-muted text-base">No data found</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-24">
            <p className="crosstab-title mb-4 text-base font-medium">No banner list found.</p>
            <button
              className="report-toolbar-btn inline-flex items-center gap-2 rounded-2xl bg-login-primary px-5 py-3 text-white hover:bg-login-primary-hover"
              onClick={() => dispatch(setIsAddBannerModalOpen(true))}
            >
              <LuPlus />
              <span>Add New Banner</span>
            </button>
          </div>
        )}
      </div>
      <AddBannerModal
        onClose={() => dispatch(setIsAddBannerModalOpen(false))}
        onBannerDesignClick={(e) => {
          addBannerMutation(e);
        }}
        isPending={isAddBannerPending}
        isOpen={isAddBannerModalOpen}
      />
    </div>
  );
}
