import { Link, useLocation } from "react-router";
import type { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../ui/Button";
import { toast } from "sonner";
import { resetLogicData } from "../../../store/CrossTabDataSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "../../../utils";
import { useAddBannerPointer } from "./designBanner_Api";

const DesignBanner_Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { bannerName, validateLogic } = useSelector(
    (state: RootState) => state.crosstab
  );
  const { BannerPointer } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const { addBannerPointerMutate, isAddBannerPointerPending } =
    useAddBannerPointer(location.state.studyID);

  const allseg = BannerPointer.map((pointer) => ({
    pointID: pointer.pointID,
    segTitle: pointer.title,
    groupName: "",
    logic: pointer.logic,
  }));

  const onSubmitHandle = () => {
    const hasInvalid = Object.values(validateLogic).some((logicList: any[]) =>
      logicList.some(
        (val: any) =>
          val.variable.trim() === "" ||
          val.option.trim() === "" ||
          val.value.trim() === ""
      )
    );

    if (hasInvalid) {
      toast.error(
        "Please define valid logic for at least one banner point before submitting."
      );
      return;
    }
    const isLogicApplied = BannerPointer.every(
      (item) => item.title.trim() !== "" && item.logic.length > 0
    );

    if (!isLogicApplied) {
      toast.error(
        "Please define valid logic for at least one banner point before submitting."
      );
      return;
    }
    dispatch(resetLogicData());
    addBannerPointerMutate({
      bannerID: location?.state?.bannerID as string,
      allSegment: allseg,
    });
  };

  return (
    <div className="justify-between items-center rounded grid grid-cols-2">
      <div className="text-sm">
        <span className="text-gray-700 font-semibold">{bannerName} : </span>
        <Link
          to="/crosstab"
          state={{ studyID: location.state.studyID }}
          className="text-gray-600 hover:text-action"
        >
          Banner List
        </Link>
        <span> / </span>
        <Link
          to="/crosstab/edit-banner"
          state={{
            studyID: location.state.studyID,
            bannerID: location.state?.bannerID,
          }}
          className={
            location.pathname === "/crosstab/edit-banner"
              ? "text-action font-semibold"
              : "text-gray-600"
          }
        >
          Design Banner
        </Link>
      </div>
      <div className="flex justify-end">
        <Button
          data-test-id="SUBMIT"
          className="bg-primary text-white"
          onClick={onSubmitHandle}
          disabled={isAddBannerPointerPending}
        >
          {isAddBannerPointerPending ? (
            <AiOutlineLoading3Quarters
              size={8}
              className={cn("animate-spin text-action")}
            />
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
};

export default DesignBanner_Header;
