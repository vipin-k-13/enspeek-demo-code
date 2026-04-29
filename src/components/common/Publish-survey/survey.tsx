import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import PublishSurveyHeader from "./PublishSurveyHeader";
import ActivateSurvey from "./ActivateSurvey";
import { cn, handleCopy, handleLinkClick } from "../../../utils";
import { queryClient } from "../../../App";
import { setStudyInfo } from "../../../store/CrosstabStudySlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Quota from "./Quota";
import { useOverQuotaReport } from "./SurveyApi";
import { LuCheck, LuCopy, LuExternalLink } from "react-icons/lu";
import Button from "../../ui/Button";

export default function PublishSurvey() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightActivate, setHighlightActivate] = useState(false);
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
    queryKey: ["studyInfo", state?.studyID],
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
    enabled: !!user.apiToken && !!state?.studyID,
    refetchOnWindowFocus: false,
  });

  const {} = useQuery({
    queryKey: ["studyGetSubgroup", state?.studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "study/get_subgroup", {
        apiToken: user.apiToken,
        studyID: state.studyID,
      });
      return res.response;
    },
    enabled: !!user.apiToken && !!state?.studyID,
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
      queryClient.invalidateQueries({ queryKey: ["studyInfo", state?.studyID] });
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
    <div className="questionnaire-page-bg flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
            <PublishSurveyHeader
              studyName={studyInfo.studyname}
              launch={studyInfo.launch}
              isSurveyActive={!!studyInfo.livelink}
              onHoverDisabledInitiate={setHighlightActivate}
            />
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-8 pt-2 md:px-6 md:pb-10 md:pt-3">
              <div className="flex w-full flex-col gap-6 pb-4">
              {studyInfo.livelink ? (
                <>
                  <div className="relative overflow-hidden rounded-[24px] bg-[var(--color-questionnaire-multi)] px-6 py-6 text-white shadow-sm">
                    <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
                    <div className="relative flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-white/10 backdrop-blur-sm">
                        <LuCheck className="h-9 w-9" />
                      </div>
                      <div>
                        <h2 className="text-[26px] font-bold leading-tight">
                          Survey is Live!
                        </h2>
                        <p className="mt-1 text-lg text-white/90">
                          Your survey is collecting responses
                        </p>
                      </div>
                    </div>
                  </div>

                  <section className="questionnaire-card rounded-[24px] border home-border-soft px-6 py-6 shadow-sm">
                    <h3 className="questionnaire-heading text-[16px] font-bold">
                      Survey Link
                    </h3>
                    <div className="questionnaire-input mt-5 flex flex-col gap-4 rounded-[20px] px-4 py-5 md:flex-row md:items-center md:justify-between">
                      <p
                        data-test-id="SURVEY_LINK"
                        className="home-highlight break-all text-[15px] font-medium questionnaire-clickable"
                        onClick={() => handleCopy(studyInfo.livelink)}
                      >
                        {studyInfo.livelink || "Generating link..."}
                      </p>
                      <div className="flex items-center gap-4 self-end md:self-auto">
                        <button
                          type="button"
                          aria-label="Copy survey link"
                          className="questionnaire-clickable home-highlight transition hover:opacity-80"
                          onClick={() => handleCopy(studyInfo.livelink)}
                        >
                          <LuCopy className="h-6 w-6" />
                        </button>
                        <button
                          type="button"
                          aria-label="Open survey link"
                          className="questionnaire-clickable home-highlight transition hover:opacity-80"
                          onClick={() => handleLinkClick(studyInfo.livelink)}
                        >
                          <LuExternalLink className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              ) : (
                <div className="questionnaire-card rounded-[24px] border home-border-soft px-6 py-8 text-center shadow-sm">
                  <p className="questionnaire-heading text-base md:text-lg">
                    Survey is not active yet. Activate it to enable data
                    collection and generate the live link.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="relative inline-flex">
                      {highlightActivate && (
                        <>
                          <span className="pointer-events-none absolute inset-0 rounded-full border border-login-primary/35 animate-ping" />
                          <span
                            className="pointer-events-none absolute inset-0 rounded-full border border-login-primary/25 animate-ping"
                            style={{ animationDelay: "250ms" }}
                          />
                        </>
                      )}
                      <Button
                        data-test-id="ACTIVATE"
                        varinat="theme"
                        onClick={() => {
                          setIsOpen(true);
                        }}
                        className={cn(
                          "relative",
                          highlightActivate &&
                            "shadow-[0_0_0_6px_rgba(79,86,230,0.12),0_14px_28px_rgba(79,86,230,0.24)]"
                        )}
                      >
                        Activate Study
                      </Button>
                    </div>
                  </div>
                </div>
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
