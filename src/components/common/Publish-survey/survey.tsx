import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import PublishSurveyHeader from "./PublishSurveyHeader";
import ActivateSurvey from "./ActivateSurvey";
import { cn, handleCopy } from "../../../utils";
import { queryClient } from "../../../App";
import { setStudyInfo } from "../../../store/CrosstabStudySlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Quota from "./Quota";
import { useOverQuotaReport } from "./SurveyApi";

export default function PublishSurvey() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data: quotaData } = useOverQuotaReport(state?.studyID);

  useEffect(() => {
    if (!state || !state.studyID) {
      navigate("/");
      toast.warning(
        "Invalid access route detected. Redirecting you to the homepage for a better experience."
      );
    }
  }, [state, navigate]);

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { data: studyInfo, isLoading } = useQuery({
    queryKey: ["studyInfo"],
    queryFn: async () => {
      const res = await apiRequest("post", "study/info", {
        apiToken: user.apiToken,
        studyID: state.studyID,
      });
      dispatch(
        setStudyInfo({
          studyID: state.studyID,
          hasQuestionnaire: res.response.hasquestionnaire,
          launch: res.response.launch,
          name: res.response.studyname,
          output: res.response.output,
          link: res.response.link,
          closed: res.response.closed,
        })
      );
      return res.response;
    },
    enabled: !!user.apiToken,
    refetchOnWindowFocus: false,
  });

  const {} = useQuery({
    queryKey: ["studyGetSubgroup"],
    queryFn: async () => {
      const res = await apiRequest("post", "study/get_subgroup", {
        apiToken: user.apiToken,
        studyID: state.studyID,
      });
      return res.response;
    },
    enabled: !!user.apiToken,
    refetchOnWindowFocus: false,
  });

  const { mutate: activate, isPending } = useMutation({
    mutationKey: ["globalLink"],
    mutationFn: async () => {
      const res = await apiRequest("post", "study/generate/globallink", {
        apiToken: user.apiToken,
        studyID: state.studyID,
      });
      return res.response;
    },
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["studyInfo"] });
      toast.success(
        `${studyInfo.studyname} Study activated, data collection enabled`
      );
    },
  });

  if (isLoading || isPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <AiOutlineLoading3Quarters
          size={34}
          className={cn("animate-spin text-action")}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white h-full">
        <div className="flex flex-col h-full">
          <div className="w-full flex flex-col">
            <PublishSurveyHeader
              studyName={studyInfo.studyname}
              launch={studyInfo.launch}
              isSurveyActive={!!studyInfo.livelink}
            />
            <div className="w-full mx-auto py-16 px-4 text-center h-full">
              {studyInfo.livelink ? (
                <>
                  <p className="text-base text-blue-800 mb-4">
                    Survey is active, data collection is enabled.
                    <br />
                    Use the live link below to run the survey.
                  </p>
                  <p
                    data-test-id="SURVEY_LINK"
                    className="break-words text-2xl font-semibold text-blue-700 cursor-pointer"
                    onClick={() => handleCopy(studyInfo.livelink)}
                  >
                    {studyInfo.livelink || "Generating link..."}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base text-gray-800 mb-8">
                    Survey is not active yet, click the activate button below to
                    enable data collection.
                  </p>
                  <button
                    data-test-id="ACTIVATE"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    className="px-4 py-2 bg-[#0a3158] text-white cursor-pointer focus:outline-none font-medium rounded hover:bg-[#0a3158]/90"
                  >
                    Activate {studyInfo.studyname} Study
                  </button>
                </>
              )}
              <Quota
                complete={quotaData?.completes || 0}
                totalQuota={quotaData?.quota || 0}
                disqualified={quotaData?.disqualified || 0}
                incomplete={quotaData?.incompletes || 0}
                studyID={state.studyID}
              />
            </div>
          </div>
        </div>
      </div>
      <ActivateSurvey
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activate={activate}
        studyInfo={studyInfo}
      />
    </div>
  );
}
