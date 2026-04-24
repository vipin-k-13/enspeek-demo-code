import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useLocation } from "react-router";
import { useProcessHook } from "../components/common/Report/ReportMutations";
import { useDownloadtable } from "../components/common/Crosstab/CrossTab.Api";
import { setIsDownloadDropdownOpen, setIsHistoryModalOpen } from "../store/CrosstabSlice";
import { LuDownload, LuFileSpreadsheet } from "react-icons/lu";
import Header from "../components/common/table-List/Header";
import CrossTabTable from "../components/common/table-List/CrossTabTable";

const TableList_page = () => {
  const dispatch = useDispatch();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { state } = useLocation();

   const { tableData } = useSelector(
    (state: RootState) => state.crossTabData
  );

   const { Process } = useProcessHook();
    const { downloadTableMutate } = useDownloadtable({
      studyID: state.studyID,
      cb: ({ studyID, pid }) => {
        if (studyID && pid) {
          Process({ studyID, pid });
        }
      },
    });
  
    const tableIDList = tableData.map((t) => t.tableID);
    const dropDownData = [
      {
        Title: "Download All",
        Icon: LuFileSpreadsheet,
        onClick: () => {
          dispatch(setIsDownloadDropdownOpen(false));
          if (tableIDList.length) {
            downloadTableMutate({
              bannerID: state.bannerID,
              tableID: tableIDList,
            });
          }
        },
      },
      {
        Title: "Download History",
        Icon: LuDownload,
        onClick: () => {
          dispatch(setIsDownloadDropdownOpen(false));
          dispatch(setIsHistoryModalOpen(true));
        },
      },
    ];

  return (
    <div className="crosstab-page-bg flex h-full min-h-0 flex-col overflow-hidden">
      <Header dropdownRef={dropdownRef} dropDownData={dropDownData} />
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-8 pt-3 md:px-4 md:pb-10 md:pt-4">
        <div className="w-full">
          <CrossTabTable />
        </div>
      </div>
    </div>
  );
};

export default TableList_page;
