import React, { useState, useRef, useEffect } from "react";
import Button from "../../ui/Button";
import { IoMdMore } from "react-icons/io";
import {
  FaChartBar,
  FaDownload,
  FaFile,
  FaFileExcel,
  FaFilePowerpoint,
  FaFilter,
  FaHandPointer,
  FaList,
  FaPlus,
  FaRegFileExcel,
  FaTable,
  FaToggleOff,
  FaToggleOn,
} from "react-icons/fa6";
import ReportFilter from "./ReportFilter";
import FilterModal from "./FilterModal";
import HistoryModal from "./HistoryModal";
import {
  useExcelDownload,
  usePptDownloadHook,
  useProcessHook,
  useSpssHook,
  useTableDownload,
} from "./ReportMutations";
import LoaderSpinner from "../../global/LoaderSpinner";
import DropDown from "../../global/DropDown";
import SetSubgroupModal from "./SetSubGroupModal";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import type { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  setFliterReportData,
  setSelected,
  setSide_by_side,
} from "../../../store/FiltersSlice";
import { Link, useLocation } from "react-router";
import { setSubgroupOn } from "../../../store/CrosstabSlice";

type ActionButtonProps = {
  showTableView: boolean;
  setShowTableView: React.Dispatch<React.SetStateAction<boolean>>;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  showTableView,
  setShowTableView,
}) => {
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showPointerDropdown, setShowPointerDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const subgroupOn = useSelector(
    (state: RootState) => state.crosstab.subgroupOn
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectDropdownRef = useRef<HTMLDivElement>(null);
  const user = useSelector((state: RootState) => state.user);
  const { tableQList, fliterReportData } = useSelector(
    (state: RootState) => state.filter
  );
  const { state } = useLocation();
  const [showSubgroupModal, setshowSubgroupModal] = useState(false);
  const dispatch = useDispatch();

  const { Process } = useProcessHook();
  const { DownloadExcel, isDownloadExcelPending } = useExcelDownload({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      Process({ studyID, pid });
    },
  });
  const { DownloadSpss, isDownloadSpssPending } = useSpssHook({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      Process({ studyID, pid });
    },
  });
  const { DownloadTable, isDownloadTablePending } = useTableDownload({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      Process({ studyID, pid });
    },
  });
  const { DownloadPpt, isDownloadPptPending } = usePptDownloadHook({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      Process({ studyID, pid });
    },
  });

  const pointerDropdownData = [
    {
      Title: "Select All",
      checked:
        tableQList.length > 0 &&
        tableQList.every((item) => fliterReportData.includes(item)),
      onClick: () => {
        const allSelected =
          tableQList.length > 0 &&
          tableQList.every((item) => fliterReportData.includes(item));
        if (allSelected) {
          dispatch(setFliterReportData([]));
        } else {
          dispatch(setFliterReportData([...tableQList]));
        }
      },
    },
    ...tableQList.map((item) => ({
      Title: item,
      checked: fliterReportData.includes(item),
      onClick: () =>
        dispatch(
          setFliterReportData(
            fliterReportData.includes(item)
              ? fliterReportData.filter((pre) => pre !== item)
              : [...fliterReportData, item]
          )
        ),
    })),
  ];

  const MoreDropdownData = [
    {
      Title: "Add New Filters",
      Icon: FaPlus,
      onClick: () => {
        setShowModal(true);
      },
    },
    {
      Title: "Download Excel Raw Data",
      Icon: FaFileExcel,
      onClick: () => DownloadExcel(),
    },
    {
      Title: "Download SPSS Raw Data",
      Icon: FaFile,
      onClick: () => DownloadSpss(),
    },
    {
      Title: "Download Table Raw Data",
      Icon: FaRegFileExcel,
      onClick: () => DownloadTable(),
    },
    {
      Title: "Download PPT",
      Icon: FaFilePowerpoint,
      onClick: () => DownloadPpt(),
    },
    {
      Title: "Download History",
      Icon: FaDownload,
      onClick: () => {
        setOpen(true);
      },
    },
  ];

  const { data } = useQuery({
    queryKey: ["listVar"],
    queryFn: async () => {
      const res = await apiRequest("post", "/report/side_by_side/list/vars", {
        apiToken: user.apiToken,
        studyID: state.studyID,
      });
      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const handleSave = () => {
    setshowSubgroupModal(false);
  };

  const subGroupToggle = () => {
    if (!!subgroupOn) {
      dispatch(setSide_by_side("0"));
    } else {
      dispatch(setSelected([...data][0].qID));
      dispatch(setSide_by_side("1"));
    }
    dispatch(setSubgroupOn(!subgroupOn));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        showMoreDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setShowMoreDropdown(false);
      }

      if (
        showPointerDropdown &&
        selectDropdownRef.current &&
        !selectDropdownRef.current.contains(target)
      ) {
        setShowPointerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreDropdown, showPointerDropdown]);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Button
          data-test-id="GROUP_TOGGLE"
          className="text-gray-600 bg-white border [&_svg]:size-6"
          onClick={subGroupToggle}
        >
          {subgroupOn ? (
            <FaToggleOn className="mr-1 text-action" />
          ) : (
            <FaToggleOff className="mr-1 text-gray-400" />
          )}
          Subgroups
        </Button>
        <div className="relative" ref={selectDropdownRef}>
          <Button
            data-test-id="SELECTOR"
            onClick={() => setShowPointerDropdown((prev) => !prev)}
            size="icon"
            className="bg-orange-400 text-white hover:bg-orange-500"
          >
            <FaHandPointer />
          </Button>
          {showPointerDropdown && (
            <div className="absolute right-0 z-20">
              <DropDown showCheckbox={true} Data={pointerDropdownData} />
            </div>
          )}
        </div>
        {subgroupOn && (
          <Button
            data-test-id="GROUP_TOGGLE_ON"
            size="icon"
            className="bg-yellow-500 text-white hover:bg-yellow-600"
            onClick={() => {
              setshowSubgroupModal(true);
            }}
          >
            <FaList />
          </Button>
        )}
        <Button
          data-test-id="TABLE"
          size="icon"
          title={
            showTableView
              ? "Click to view data in chart"
              : "Click to view data in table"
          }
          className="bg-gray-50 border border-gray-300"
          onClick={() => setShowTableView((prev) => !prev)}
        >
          {showTableView ? <FaChartBar /> : <FaTable />}
        </Button>
        <Button
          size="icon"
          title="Click to see filters"
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => {
            setShowFilter(true);
          }}
          disabled
        >
          <FaFilter />
        </Button>
        <div className="relative" ref={dropdownRef}>
          <Button
            data-test-id="MORE_ACTIONS"
            size="icon"
            className="bg-teal-500 text-white hover:bg-teal-600"
            onClick={() => {
              setShowMoreDropdown((prev) => !prev);
            }}
          >
            <IoMdMore />
          </Button>
          {showMoreDropdown && (
            <div className="absolute right-0 mt-2 z-10">
              <DropDown Data={MoreDropdownData} className="w-72 z-20" />
            </div>
          )}
        </div>
        <Link
          to={"/crosstab"}
          state={{ studyID: state.studyID }}
          className="px-4 py-1 gap-2 flex items-center text-lg bg-primary text-white rounded hover:bg-primary/90 cursor-pointer focue:outline-none"
        >
          Next
        </Link>
      </div>
      {showFilter && (
        <ReportFilter onClose={() => setShowFilter(false)} onClear={() => {}} />
      )}
      <div>
        {showSubgroupModal && (
          <SetSubgroupModal
            options={data}
            onSave={handleSave}
            onClose={() => setshowSubgroupModal(false)}
          />
        )}
      </div>
      <FilterModal isOpen={showModal} setIsOpen={() => setShowModal(false)} />
      <HistoryModal open={open} onOpenChange={setOpen} />
      {(isDownloadExcelPending ||
        isDownloadSpssPending ||
        isDownloadTablePending ||
        isDownloadPptPending) && <LoaderSpinner />}
    </div>
  );
};

export default ActionButton;
