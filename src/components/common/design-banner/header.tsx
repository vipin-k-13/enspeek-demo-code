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
    <div className="crosstab-surface mb-4 flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm">
        <span className="crosstab-title font-semibold">{bannerName} : </span>
        <Link
          to="/crosstab"
          state={{ studyID: location.state.studyID }}
          className="crosstab-muted hover:text-login-primary"
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
              ? "questionnaire-label font-semibold"
              : "crosstab-muted"
          }
        >
          Design Banner
        </Link>
      </div>
      <div className="flex justify-end">
        <Button
          data-test-id="SUBMIT"
          className="report-toolbar-btn bg-login-primary text-white hover:bg-login-primary-hover"
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
