import type React from "react";
import { useState } from "react";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import type { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import LoaderSpinner from "../../global/LoaderSpinner";
import { setStudyInfo } from "../../../store/CrosstabStudySlice";

export default function CreationProject() {
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    panelProvider: "",
    metaDescription: "",
  });

  const [errors, setErrors] = useState({
    projectName: "",
  });

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const {
    mutate: create,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      const payload = {
        studyName: formData.projectName,
        projectDescription: formData.projectDescription,
        panel: formData.panelProvider,
        meta: formData.metaDescription || "",
        apiToken: user.apiToken,
      };

      const res = await apiRequest("post", "study/create", payload);

      return res.response;
    },
    onSuccess: (data) => {
      const studyID = data.studyID;
      if (!studyID) {
        toast.error("Study ID not returned");
        return;
      }

      navigate("/questionnaire", {
        state: {
          studyID: data.studyID,
          studyFlags: {
            hasQuestionnaire: data.hasQuestionnaire,
            launch: data.launch,
            output: data.output,
          },
        },
      });

      toast.success("Study Created Successfully");
    },
  });


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "projectName" && value.trim() !== "") {
      setErrors((prev) => ({ ...prev, projectName: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!formData.projectName.trim()) {
      setErrors((prev) => ({
        ...prev,
        projectName: "Project name is required.",
      }));
      hasError = true;
    }
    if (!formData.panelProvider) {
      toast.error("Please select a Panel Provider.");
      hasError = true;
    }
    if (!formData.projectDescription.trim()) {
      toast.error("Please enter the Project Description.");
      hasError = true;
    }
    if (hasError) return;
    create();
  };

  const {} = useQuery({
    queryKey: ["CateAndSpec"],
    queryFn: async () => {
      const [categories, specs] = await Promise.all([
        apiRequest("post", "/specification/getCategories", {
          apiToken: user.apiToken,
          survey: "CS",
        }),
        apiRequest("post", "/specification/getSpecs", {
          apiToken: user.apiToken,
          survey: "CS",
        }),
      ]);
      return { categories, specs };
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const studyID = state?.studyID;
  const dispatch = useDispatch();
  const { data: StudyInfo, isLoading: isInfoLoading } = useQuery({
    queryKey: [studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "study/info", {
        apiToken: user.apiToken,
        studyID: studyID,
      });
      dispatch(
        setStudyInfo({
          studyID: studyID,
          hasQuestionnaire: res.response.hasQuestionnaire,
          launch: res.response.launch,
          name: res.response.studyName,
          output: res.response.output,
          link: res.response.link,
          closed: res.response.closed
        })
      );
      return res.response;
    },
    enabled: !!user.apiToken && !!studyID,
    refetchOnWindowFocus: false,
  });

  if (isInfoLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="w-full h-full mx-auto bg-white rounded-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-medium text-gray-600">
          {StudyInfo ? StudyInfo.studyName : "PROJECT CREATION"}
        </h1>
        {state?.studyID ? (
          <Button
            className="bg-primary hover:bg-primary-700 px-3 py-1 rounded text-white"
            onClick={() => {
              navigate("/questionnaire", { state: { studyID: state.studyID } });
            }}
            disabled={isPending}
          >
            {isPending ? "Next..." : "Next"}
          </Button>
        ) : (
          <Button
            className="bg-primary hover:bg-primary-700 px-3 py-1 rounded text-white"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        )}
      </div>
      <hr className="text-gray-300"></hr>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-8 mb-8">
          <div>
            <label htmlFor="projectName" className="block mb-2 font-medium">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="projectName"
              name="projectName"
              value={StudyInfo ? StudyInfo.studyName : formData.projectName}
              onChange={handleChange}
              className={`w-full outline-none border px-3 py-2 rounded-md bg-white ${
                errors.projectName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
            )}
          </div>
          <div>
            <label htmlFor="panelProvider" className="block mb-2 font-medium">
              Panel Provider <span className="text-red-500">*</span>
            </label>
            <select
              id="panelProvider"
              name="panelProvider"
              value={StudyInfo ? StudyInfo.panel : formData.panelProvider}
              onChange={handleChange}
              className="w-full h-10 rounded-md px-3 py-2 text-sm text-gray-800
               bg-white border focus:outline-none border-gray-300"
            >
              <option value="">Choose Panel</option>
              <option value="Dynata">Dynata</option>
              <option value="DISQO">DISQO</option>
              <option value="None (Multi-use Link)">None (Multi-use Link)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="projectDescription"
              className="block mb-2 font-medium"
            >
              Project Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="projectDescription"
              name="projectDescription"
              value={
                StudyInfo
                  ? StudyInfo.projectDescription
                  : formData.projectDescription
              }
              onChange={handleChange}
              className="w-full h-32 border bg-white border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="metaDescription" className="block mb-2 font-medium">
              Meta Description
            </label>
            <Textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              className="w-full h-32 border bg-white border-gray-300 rounded-md"
            />
            <p className="text-sm text-gray-500 mt-1">
              Use comma to separate keywords.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
