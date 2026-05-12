import { useSelector } from "react-redux";
import { toast } from "sonner";
import type { RootState } from "../../store/store";
import mutationStructure from "../mutation-template";
import { apiRequest } from "../../services/apiService";
import url from "../url";
import { queryClient } from "../../App";
import publishSurveyKeys from "./keys";

const refetchPublishSurveyStudyInfo = async (studyID?: string) => {
  if (!studyID) return;

  await queryClient.invalidateQueries({
    queryKey: publishSurveyKeys.studyInfo(studyID),
  });
  await queryClient.refetchQueries({
    queryKey: publishSurveyKeys.studyInfo(studyID),
    type: "active",
  });
};

const refetchPublishSurveyQuotaReport = async (studyID?: string) => {
  if (!studyID) return;

  await queryClient.invalidateQueries({
    queryKey: publishSurveyKeys.quotaReport(studyID),
  });
  await queryClient.refetchQueries({
    queryKey: publishSurveyKeys.quotaReport(studyID),
    type: "active",
  });
};

const refetchPublishSurveyQuota = async (studyID?: string) => {
  if (!studyID) return;

  await queryClient.invalidateQueries({
    queryKey: publishSurveyKeys.quota(studyID),
  });
  await queryClient.refetchQueries({
    queryKey: publishSurveyKeys.quota(studyID),
    type: "active",
  });
};

export const useGenerateGlobalLinkMutation = (studyID?: string, studyName?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  return mutationStructure({
    mutationKey: [url.generateGlobalLink.mutationKey, studyID],
    mutationFn: async () => {
      const res = await apiRequest(
        url.generateGlobalLink.method,
        url.generateGlobalLink.endpoint,
        {
          apiToken,
          studyID,
        }
      );
      return res.response;
    },
    onSuccess: async () => {
      await refetchPublishSurveyStudyInfo(studyID);
      toast.success(`${studyName ?? "Study"} activated, data collection enabled`);
    },
  });
};

export const useSetQuotaMutation = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  return mutationStructure({
    mutationKey: [url.setQuota.mutationKey, studyID],
    mutationFn: async (quota: number) => {
      const res = await apiRequest(url.setQuota.method, url.setQuota.endpoint, {
        apiToken,
        studyID,
        quota_limit: quota,
      });
      return res.response;
    },
    onSuccess: async () => {
      await refetchPublishSurveyQuota(studyID);
      await refetchPublishSurveyQuotaReport(studyID);
      toast.success("Quota updated successfully!");
    },
  });
};

export const useInitiateSampleCollectionMutation = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  return mutationStructure({
    mutationKey: [url.setLaunch.mutationKey, studyID],
    mutationFn: async () => {
      const res = await apiRequest(url.setLaunch.method, url.setLaunch.endpoint, {
        apiToken,
        studyID,
      });
      return res.response;
    },
    onSuccess: async () => {
      await refetchPublishSurveyStudyInfo(studyID);
      toast.success("Study set for sample collection");
    },
  });
};
