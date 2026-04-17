import Button from "../../ui/Button";
import { FiPlus, FiSearch } from "react-icons/fi";
import { FaArchive, FaTrash, FaCheckCircle, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router";
import DynamicModel from "../../global/DynamicModel";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { toast } from "sonner";
import LoaderSpinner from "../../global/LoaderSpinner";
import { handleKeyPress } from "../../../utils";
import { resetStudyInfo } from "../../../store/CrosstabStudySlice";

interface TooltipProp {
  activeTab: "myactive" | "allactive" | "isarchived";
  setActiveTab: (e: string) => void;
  globalFilter: string;
  setGlobalFilter: (e: string) => void;
  selectedStudies: string[];
  setSelectedStudies: (ids: string[]) => void;
}

const Tooltip: React.FC<TooltipProp> = ({
  activeTab,
  setActiveTab,
  globalFilter,
  setGlobalFilter,
  selectedStudies,
  setSelectedStudies,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [deleteInputValue, setDeleteInputValue] = useState("");
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const [isSearchActive, setIsSearchActive] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["studyDelete"],
    mutationFn: async () => {
      return await apiRequest("post", "study/delete", {
        apiToken: user.apiToken,
        study_list: selectedStudies,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyList"] });
      setSelectedStudies([]);
      setIsOpen(false);
      toast.success("Study deleted successfully");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("post", "study/archive", {
        apiToken: user.apiToken,
        study_list: selectedStudies,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyList"] });
      setSelectedStudies([]);
      toast.success("Study archived successfully");
    },
  });

  const studyFilterMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("post", "study/filter", {
        apiToken: user.apiToken,
        selection:
          activeTab === "myactive" ? "myactive" : activeTab.toLowerCase(),
        studyName: globalFilter.trim(),
      });
    },
  });

  const activeMutation = useMutation({
    mutationKey: ["activeProject"],
    mutationFn: async () => {
      return await apiRequest("post", "study/activate", {
        apiToken: user.apiToken,
        study_list: selectedStudies,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studyList"] });
      setSelectedStudies([]);
      setIsOpen(false);
      setActiveTab("myactive");
      toast.success("Project activated successfully");
    },
  });

  const { data } = useQuery({
    queryKey: ["studyListCount", activeTab],
    queryFn: async () => {
      const res = await apiRequest("post", "study/listingCount", {
        apiToken: user.apiToken,
      });
      return res.response;
    },
    enabled: !!user.apiToken,
    refetchOnWindowFocus: false,
  });

  const handleSearch = () => {
    if (inputValue.trim()) {
      setGlobalFilter(inputValue.trim());
      studyFilterMutation.mutate();
      setIsSearchActive(true);
    } else {
      toast.warning("Please enter a study name to search.");
    }
  };

  const handleSetTab = (e: string) => {
    setActiveTab(e);
    handleClear();
  };

  const handleClear = () => {
    setInputValue("");
    setGlobalFilter("");
    setIsSearchActive(false);
  };

  if (isPending) {
    return <LoaderSpinner />;
  }
  return (
    <div className="flex justify-between items-center mb-3">
      <div className="flex gap-2">
        <Button
          className={`px-3 py-1 rounded items-center border ${
            activeTab === "myactive"
              ? "text-red-400 border-red-400"
              : "text-gray-300 border-gray-300"
          }`}
          onClick={() => handleSetTab("myactive")}
        >
          My Active {data?.myactive > 0 ? data.myactive : ""}
        </Button>
        <Button
          className={`px-3 py-1 rounded items-center border ${
            activeTab === "allactive"
              ? "text-red-400 border-red-400"
              : "text-gray-300 border-gray-300"
          }`}
          onClick={() => 
            handleSetTab("allactive")
          }
        >
          All Active {data?.allactive > 0 ? data.allactive : ""}
        </Button>
        <Button
          className={`px-3 py-1 rounded items-center border ${
            activeTab === "isarchived"
              ? "text-red-400 border-red-400"
              : "text-gray-300 border-gray-300"
          }`}
          onClick={() => 
            handleSetTab("isarchived")
          }
        >
          {" "}
          Archived {data?.isarchived > 0 ? data.isarchived : ""}
        </Button>
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => handleKeyPress(e, handleSearch)}
          className="border border-gray-300 outline-none px-3 py-1 w-64 rounded-l"
        />
        <button
          tabIndex={-1}
          className={`text-bg flex items-center py-2 px-3 rounded-r cursor-pointer ${
            isSearchActive ? "bg-red-600" : "bg-action"
          }`}
          onClick={isSearchActive ? handleClear : handleSearch}
        >
          {isSearchActive ? <FaTimes /> : <FiSearch />}
        </button>
      </div>

      <div className="flex gap-2">
        <Button
          className="bg-action text-bg px-3 py-2 rounded items-center"
          title="Create Project"
          onClick={() => {
            dispatch(resetStudyInfo());
            navigate("/create");
          }}
        >
          <FiPlus />
        </Button>
        {activeTab !== "allactive" && activeTab !== "isarchived" && (
          <>
            <Button
              className="px-3 py-2 bg-action text-bg rounded items-center disabled:opacity-50"
              title="Archived Project"
              onClick={() => {
                if (selectedStudies.length > 0) {
                  archiveMutation.mutate();
                } else {
                  toast.warning("Please select study");
                }
              }}
            >
              <FaArchive />
            </Button>
            <Button
              className="bg-red-400 px-3 py-2 text-bg rounded items-center"
              title="Delete Project"
              onClick={() => {
                if (selectedStudies.length > 0) {
                  setDeleteInputValue("");
                  setIsOpen(true);
                } else {
                  toast.warning("Please select study");
                }
              }}
            >
              <FaTrash />
            </Button>
          </>
        )}
        {activeTab === "isarchived" && data?.isarchived > 0 && (
          <Button
            className="bg-action text-bg px-3 py-2 rounded items-center"
            title="Activate Projects"
            onClick={() => {
              activeMutation.mutate();
            }}
          >
            <FaCheckCircle />
          </Button>
        )}
      </div>
      <DynamicModel
        Title="Delete Study"
        ButtonText={"Delete"}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        onClick={() => {
          if (
            deleteInputValue.trim().toLowerCase() === "delete" &&
            selectedStudies.length > 0
          ) {
            mutate();
          }
        }}
        className="max-w-lg"
      >
        <p>Are you sure you want to delete?</p>
        <p className="mt-3">
          Type <strong>delete</strong> in the input box
        </p>
        <input
          className="border border-gray-300 focus:outline-none px-3 items-center rounded-md w-full py-1 mt-3"
          placeholder="eg. delete"
          value={deleteInputValue}
          onChange={(e) => setDeleteInputValue(e.target.value)}
          onKeyDown={(e) =>
            handleKeyPress(e, () => {
              if (
                deleteInputValue.toLowerCase().trim() === "delete" &&
                selectedStudies.length > 0
              ) {
                mutate();
              }
            })
          }
        />
      </DynamicModel>
    </div>
  );
};

export default Tooltip;
