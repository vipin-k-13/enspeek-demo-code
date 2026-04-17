import { FaPlusCircle } from "react-icons/fa";
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
    <div className="min-h-screen bg-white">
      <div className="h-[78vh] overflow-y-auto w-full">
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
            No data found
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-24">
            <p className="text-gray-700 mb-4">No banner list found.</p>
            <button
              className="bg-primary hover:opacity-90 text-white cursor-pointer
               font-semibold px-5 py-2 rounded-md flex items-center space-x-2"
              onClick={() => dispatch(setIsAddBannerModalOpen(true))}
            >
              <FaPlusCircle />
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
