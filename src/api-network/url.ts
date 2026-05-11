import type { ApiMethod } from "../services/apiService";

type ApiRegistryEntry = {
  endpoint: string;
  method: ApiMethod;
  queryKey: string;
};

const url = {
  studyListing: {
    endpoint: "/study/listing",
    method: "post",
    queryKey: "studyList",
  },

  userLogin: {
    endpoint: "/user/login",
    method: "post",
    queryKey: "userLogin",
  },

  userInfo: {
    endpoint: "/user/info",
    method: "post",
    queryKey: "userInfo",
  },

  userLookup: {
    endpoint: "/user/lookup",
    method: "post",
    queryKey: "userLookup",
  },

  studyShare: {
    endpoint: "/study/share",
    method: "post",
    queryKey: "studyShare",
  },

  studyCreate: {
    endpoint: "/study/create",
    method: "post",
    queryKey: "studyCreate",
  },

  studyInfo: {
    endpoint: "/study/info",
    method: "post",
    queryKey: "studyInfo",
  },

  studyArchive: {
    endpoint: "/study/archive",
    method: "post",
    queryKey: "studyArchive",
  },

  studyDelete: {
    endpoint: "/study/delete",
    method: "post",
    queryKey: "studyDelete",
  },

  studyReplicate: {
    endpoint: "/study/replicate",
    method: "post",
    queryKey: "studyReplicate",
  },

  studyActivate: {
    endpoint: "/study/activate",
    method: "post",
    queryKey: "studyActivate",
  },

  setLaunch: {
    endpoint: "/study/set/launch",
    method: "post",
    queryKey: "studySetLaunch",
  },

  setQuota: {
    endpoint: "/study/set/quota",
    method: "post",
    queryKey: "studySetQuota",
  },

  getSubgroup: {
    endpoint: "/study/get_subgroup",
    method: "post",
    queryKey: "studyGetSubgroup",
  },

  generateGlobalLink: {
    endpoint: "/study/generate/globallink",
    method: "post",
    queryKey: "studyGenerateGlobalLink",
  },

  studyChatbot: {
    endpoint: "/studychatbot/chatStudy",
    method: "post",
    queryKey: "studyChatbot",
  },

  getCategories: {
    endpoint: "/specification/getCategories",
    method: "post",
    queryKey: "specificationGetCategories",
  },

  getSpecs: {
    endpoint: "/specification/getSpecs",
    method: "post",
    queryKey: "specificationGetSpecs",
  },

  questionnaireQuestionType: {
    endpoint: "/questionnaire/qtype",
    method: "post",
    queryKey: "questionnaireQuestionType",
  },

  questionnaireAddRi: {
    endpoint: "/questionnaire/add/ri",
    method: "post",
    queryKey: "questionnaireAddRi",
  },

  questionnaireAdd: {
    endpoint: "/questionnaire/add",
    method: "post",
    queryKey: "questionnaireAdd",
  },

  questionnaireEdit: {
    endpoint: "/questionnaire/edit",
    method: "post",
    queryKey: "questionnaireEdit",
  },

  deleteQuestion: {
    endpoint: "/questionnaire/deleteQuestion",
    method: "post",
    queryKey: "questionnaireDeleteQuestion",
  },

  questionCopy: {
    endpoint: "/questionnaire/replicate",
    method: "post",
    queryKey: "questionnaireReplicate",
  },

  questionRearrange: {
    endpoint: "/questionnaire/rearrange",
    method: "post",
    queryKey: "questionnaireRearrange",
  },

  fetchQuestionList: {
    endpoint: "/questionnaire/fetch/qlist",
    method: "post",
    queryKey: "questionnaireFetchQuestionList",
  },

  questionView: {
    endpoint: "/questionnaire/view/:qId",
    method: "post",
    queryKey: "questionnaireViewById",
  },

  questionGet: {
    endpoint: "/questionnaire/get/:questionId",
    method: "post",
    queryKey: "questionnaireGetById",
  },

  questionEditLogic: {
    endpoint: "/questionnaire/edit/:qId/logic",
    method: "post",
    queryKey: "questionnaireEditLogicById",
  },

  questionLogicVars: {
    endpoint: "/questionnaire/logic/vars",
    method: "post",
    queryKey: "questionnaireLogicVars",
  },

  questionLogicOptions: {
    endpoint: "/questionnaire/logic/opts",
    method: "post",
    queryKey: "questionnaireLogicOptions",
  },

  facebookLink: {
    endpoint: "/questionnaire/generate/facebook/link",
    method: "post",
    queryKey: "questionnaireGenerateFacebookLink",
  },

  whatsappLink: {
    endpoint: "/questionnaire/generate/whatsapp/link",
    method: "post",
    queryKey: "questionnaireGenerateWhatsappLink",
  },

  crosstabFinalReport: {
    endpoint: "/crosstab/freport",
    method: "post",
    queryKey: "crosstabFinalReport",
  },

  crosstabBannerList: {
    endpoint: "/crosstab/banner/list",
    method: "post",
    queryKey: "crosstabBannerList",
  },

  crosstabBannerAdd: {
    endpoint: "/crosstab/banner/add",
    method: "post",
    queryKey: "crosstabBannerAdd",
  },

  crosstabBannerEdit: {
    endpoint: "/crosstab/banner/edit",
    method: "post",
    queryKey: "crosstabBannerEdit",
  },

  crosstabBannerDelete: {
    endpoint: "/crosstab/banner/delete",
    method: "post",
    queryKey: "crosstabBannerDelete",
  },

  crosstabBannerCopy: {
    endpoint: "/crosstab/banner/replicate",
    method: "post",
    queryKey: "crosstabBannerReplicate",
  },

  crosstabTableList: {
    endpoint: "/crosstab/tableList/list",
    method: "post",
    queryKey: "crosstabTableList",
  },

  crosstabQuestionList: {
    endpoint: "/crosstab/tableList/qlist",
    method: "post",
    queryKey: "crosstabTableQuestionList",
  },

  crosstabTableAdd: {
    endpoint: "/crosstab/tableList/add",
    method: "post",
    queryKey: "crosstabTableAdd",
  },

  crosstabTableOutput: {
    endpoint: "/crosstab/tableList/output/:bannerId/:tableId",
    method: "post",
    queryKey: "crosstabTableOutput",
  },

  crosstabLogicVars: {
    endpoint: "/crosstab/logic/vars",
    method: "post",
    queryKey: "crosstabLogicVars",
  },

  crosstabLogicOptions: {
    endpoint: "/crosstab/logic/opts",
    method: "post",
    queryKey: "crosstabLogicOptions",
  },

  crosstabTableOptionList: {
    endpoint: "/crosstab/tableList/opList/:tableId/:qId",
    method: "post",
    queryKey: "crosstabTableOptionList",
  },

  crosstabBannerPointList: {
    endpoint: "/crosstab/bannerPoint/list",
    method: "post",
    queryKey: "crosstabBannerPointList",
  },

  crosstabBannerPointAdd: {
    endpoint: "/crosstab/bannerPoint/add",
    method: "post",
    queryKey: "crosstabBannerPointAdd",
  },

  crosstabCustomTableAdd: {
    endpoint: "/crosstab/tableList/custom/add",
    method: "post",
    queryKey: "crosstabCustomTableAdd",
  },

  crosstabTableEditByQuestionId: {
    endpoint: "/crosstab/tableList/edit/:qId",
    method: "post",
    queryKey: "crosstabTableEditByQuestionId",
  },

  crosstabTableDownload: {
    endpoint: "/crosstab/table/download",
    method: "post",
    queryKey: "crosstabTableDownload",
  },

  reportSideBySideVariables: {
    endpoint: "/report/side_by_side/list/vars",
    method: "post",
    queryKey: "reportSideBySideVariables",
  },

  reportFiltersInclude: {
    endpoint: "/report/filters/include",
    method: "post",
    queryKey: "reportFiltersInclude",
  },

  reportProcessList: {
    endpoint: "/report/processList",
    method: "post",
    queryKey: "reportProcessList",
  },

  reportViewList: {
    endpoint: "/report/view/list",
    method: "post",
    queryKey: "reportViewList",
  },

  reportExportExcel: {
    endpoint: "/report/export/data/excel",
    method: "post",
    queryKey: "reportExportExcel",
  },

  reportProcess: {
    endpoint: "/report/process",
    method: "post",
    queryKey: "reportProcess",
  },

  reportExportSpss: {
    endpoint: "/report/export/data/spss",
    method: "post",
    queryKey: "reportExportSpss",
  },

  reportProcessClear: {
    endpoint: "/report/process/clear",
    method: "post",
    queryKey: "reportProcessClear",
  },

  reportTableReadyAll: {
    endpoint: "/report/table/ready/all",
    method: "post",
    queryKey: "reportTableReadyAll",
  },

  reportReadyAll: {
    endpoint: "/report/reportReadyAll",
    method: "post",
    queryKey: "reportReadyAll",
  },

  reportViewById: {
    endpoint: "/report/view/:qId",
    method: "post",
    queryKey: "reportViewById",
  },

  reportAppliedFilter: {
    endpoint: "/report/appliedfilter",
    method: "post",
    queryKey: "reportAppliedFilter",
  },

  reportFiltersList: {
    endpoint: "/report/filters/list",
    method: "post",
    queryKey: "reportFiltersList",
  },

  reportFilters: {
    endpoint: "/report/filters",
    method: "post",
    queryKey: "reportFilters",
  },

} as Record<string, ApiRegistryEntry>;

export default url;
