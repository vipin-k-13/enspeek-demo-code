import { FaPlusCircle } from "react-icons/fa";
import type { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { setBannerPointer } from "../../../store/CrossTabDataSlice";

interface TabButtonsProps {
  activeTab: number;
  isBannerPointerListPending: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const TabButtons: React.FC<TabButtonsProps> = ({
  activeTab,
  isBannerPointerListPending,
  setActiveTab,
}) => {
  const { BannerPointer } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const dispatch = useDispatch<AppDispatch>();

  const addBannerPoint = () => {
    const last = BannerPointer[BannerPointer.length - 1];
    const nextTitle =
      last?.title.replace(/(\d+)$/, (m) => String(Number(m) + 1)) ||
      "Banner point 1";

    const newPoint: BannerPoint = {
      active: 1,
      statLevel: null,
      bannerGroup: "",
      logic: [],
      pointID: "",
      seq: 1,
      title: nextTitle,
      alpha: "A",
    };
    dispatch(setBannerPointer([...BannerPointer, newPoint]));
    setActiveTab(BannerPointer.length);
  };
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex space-x-2">
        {BannerPointer.map((point, index) => (
          <button
            key={point.title}
            onClick={() => setActiveTab(index)}
            className={`border-b-4 py-2 rounded-t-md px-3 transition-colors 
                    ${
                      activeTab === index
                        ? "bg-white border-blue-500 text-action"
                        : "bg-gray-100 border-transparent text-gray-400 hover:bg-gray-200"
                    }`}
            disabled={isBannerPointerListPending}
          >
            ● {point.title}
          </button>
        ))}
      </div>
      <button
        onClick={addBannerPoint}
        className="bg-white px-3 py-1 rounded cursor-pointer flex items-center"
        disabled={isBannerPointerListPending}
      >
        <FaPlusCircle className="mr-1" />
        Add point
      </button>
    </div>
  );
};

export default TabButtons;