import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setBannerPointer } from "../../../store/CrossTabDataSlice";
import BannerLogic from "../../global/BannerLogic";
import { FaTrash } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Skeleton } from "../../global/skeleton";

interface pointDetailsProps {
  activeTab: number;
  isBannerPointerListPending: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  bannerPointerListData: any[];
}

const PointDetails: React.FC<pointDetailsProps> = ({
  activeTab,
  isBannerPointerListPending,
  setActiveTab,
  bannerPointerListData,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [lastAddedLogic, setLastAddedLogic] = React.useState<
    { pointLogic: string }[]
  >([]);
  const { BannerPointer } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const { groups } = useSelector((state: RootState) => state.crosstab);

  const updateBannerPoint = (
    id: number,
    field: keyof BannerPoint,
    value: string | any
  ) => {
    dispatch(
      setBannerPointer(
        BannerPointer.map((p, index) => {
          if (index !== id) return p;

          if (field === "logic") {
            const currentLogic = p.logic || [];

            if (!Array.isArray(value)) return p;
            if (value.length === 0 && lastAddedLogic.length > 0) {
              const updatedLogic = currentLogic.filter(
                (item) =>
                  !lastAddedLogic.some(
                    (added) => added.pointLogic === item.pointLogic
                  )
              );

              setLastAddedLogic([]);

              return {
                ...p,
                logic: updatedLogic,
              };
            }
            const filtered = currentLogic.filter(
              (item) =>
                !value.some(
                  (added: any) => added.pointLogic === item.pointLogic
                )
            );

            const updatedLogic = [...filtered, ...value];

            setLastAddedLogic(value);

            return {
              ...p,
              logic: updatedLogic,
            };
          }

          return { ...p, [field]: value };
        })
      )
    );
  };

  const deleteBannerPoint = (id: number) => {
    if (BannerPointer.length > 1) {
      const updated = BannerPointer.filter((_, index) => index !== id);
      dispatch(setBannerPointer(updated));
      if (activeTab === id) {
        setActiveTab(updated.indexOf(updated[0]) || 0);
      }
    }
  };

  const handleDeleteLogic = (e: string) => {
    if (!activePoint) return;
    const update = activePoint.logic.filter((prev) => prev.pointLogic !== e);
    dispatch(
      setBannerPointer(
        BannerPointer.map((p, index) =>
          index === activeTab ? { ...p, logic: update } : p
        )
      )
    );
  };

  const activePoint = BannerPointer.find((_, index) => index === activeTab);
  const currentServerPoint =
    Array.isArray(bannerPointerListData) &&
    bannerPointerListData.find((_, index) => index === activeTab)
      ? bannerPointerListData.find((_, index) => index === activeTab)
      : {
          active: 1,
          statLevel: null,
          bannerGroup: "",
          logic: [],
          pointID: "",
          seq: 1,
          title: "",
          alpha: "A",
        };

  return (
    <div>
      {isBannerPointerListPending ? (
        <Skeleton className="w-full h-[30vh] space-y-4" />
      ) : (
        activePoint && (
          <div className="p-4 space-y-4 bg-white shadow-lg rounded-b-md">
            <div className="flex justify-between items-center">
              <div className="flex space-x-8">
                <div>
                  <label className="block text-action mb-2">
                    Banner Point Name
                  </label>
                  <input
                    data-test-id="POINTER_NAME"
                    type="text"
                    value={activePoint.title}
                    onChange={(e) =>
                      updateBannerPoint(activeTab!, "title", e.target.value)
                    }
                    className="w-fit border border-gray-300 px-3 py-2 rounded focus:outline-none"
                  />
                </div>

                {groups.length > 0 && (
                  <div>
                    <label className="block text-action mb-2">Group Name</label>
                    <select
                      className="border w-48 border-gray-300 rounded px-3 py-2 focus:outline-none"
                      value={activePoint.bannerGroup}
                      onChange={(e) =>
                        updateBannerPoint(
                          activeTab!,
                          "bannerGroup",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select group</option>
                      {groups.map((group, index) => (
                        <option key={index} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {BannerPointer.length > 1 && (
                <button
                  onClick={() => deleteBannerPoint(activeTab!)}
                  className="bg-white px-3 py-1 rounded-md border border-red-300 text-red-600 flex items-center cursor-pointer hover:bg-red-50 transition-colors"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              )}
            </div>

            <div>
              <label className="block text-action mb-2">
                Banner Point Logic
              </label>
              {currentServerPoint?.logic?.length > 0 &&
                currentServerPoint.logic.map((item: any, index: number) => {
                  const isInBannerPointer = BannerPointer.some((point) =>
                    point.logic?.some(
                      (logic: any) => logic.pointLogic === item.pointLogic
                    )
                  );

                  if (!isInBannerPointer) return null;

                  return (
                    <div
                      key={index}
                      className="flex text-red-500 items-center gap-4 my-3"
                    >
                      <span>
                        <span className="text-black">{index + 1}.</span>{" "}
                        {item.pointLogic}
                      </span>
                      <MdDeleteForever
                        className="h-5 w-5"
                        onClick={() => handleDeleteLogic(item.pointLogic)}
                      />
                    </div>
                  );
                })}

              <BannerLogic
                activeTab={activeTab!}
                storeComponent={String(activeTab)}
                key={activeTab}
                setLogicFunc={(logic) =>
                  updateBannerPoint(activeTab!, "logic", [...logic])
                }
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PointDetails;
