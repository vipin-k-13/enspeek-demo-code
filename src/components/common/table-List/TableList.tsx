import { FaSyncAlt, FaDownload, FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  setIsEditModal,
  setSelectedQid,
  setSelectedTable,
} from "../../../store/CrosstabSlice";
import { useLocation } from "react-router";
import { useProcessHook } from "../Report/ReportMutations";
import { LuLoaderCircle } from "react-icons/lu";
import { useBannerPointerList, useDownloadtable, useTableOutput } from "../Crosstab/CrossTab.Api";

interface TableListProp {
  Id: string;
  qID: string;
  Title: string;
  Description: string;
  tableIDList: string[];
  tableID: string;
  sdata?: any;
}

export default function TableList({
  Id,
  Title,
  Description,
  qID,
  tableID,
  sdata
}: TableListProp) {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { bannerPointerListData } = useBannerPointerList(
    state.bannerID,
    state.studyID
  );
  const {
  tableOutputData,
  TableOutputData,
  isTableOutputRefetching,
} = useTableOutput(
  Id,
  state?.bannerID,
  state?.studyID
);

const isStatic = !!sdata;
const dataSource = isStatic ? sdata : tableOutputData;

  const { Process } = useProcessHook();
  const { downloadTableMutate } = useDownloadtable({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      if (studyID && pid) {
        Process({ studyID, pid });
      }
    },
  });

  const onEditHandle = () => {
    dispatch(setSelectedTable(Id));
    dispatch(setSelectedQid(qID));
    dispatch(setIsEditModal(true));
  };

  return (
    <div className="mt-4" data-test-id={`TABLE_${qID}`}>
      <div className="bg-white border border-gray-200 rounded shadow-md p-3">
        <div className="flex justify-between bg-white items-center px-3 py-1">
          <div>
            <h2 className="font-semibold text-gray-800">{Title}</h2>
            <p className="text-gray-500 text-sm">{Description}</p>
          </div>
          <div className="flex space-x-3">
            {!isStatic && (
            <button
              className="p-1 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label="Refresh"
              onClick={() => TableOutputData()}
            >
              <FaSyncAlt size={18} />
            </button>
             )}
            <button
              className="p-1 text-yellow-500 hover:text-yellow-600 transition-colors cursor-pointer"
              aria-label="Download"
              onClick={() =>
                downloadTableMutate({
                  bannerID: state.bannerID,
                  tableID: [tableID],
                })
              }
            >
              <FaDownload size={18} />
            </button>
             {!isStatic && (
            <button
              className="p-1 text-action hover:text-action/80 transition-colors cursor-pointer"
              aria-label="Edit"
              onClick={onEditHandle}
            >
              <FaEdit size={18} />
            </button>  
             )}         
          </div>
        </div>
        <div className="overflow-x-auto mx-auto border border-gray-300 my-4">
          {isTableOutputRefetching ? (
            <div className="flex p-4 justify-center">
              <LuLoaderCircle size={34} className="animate-spin text-action" />
            </div>
          ) : (
            <table className="w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-200/50">
                  <th className="px-6 py-3 text-left text-gray-500"></th>
                  {bannerPointerListData.map((header: BannerPoint) => (
                    <th
                      key={header.pointID}
                      className="px-6 py-3 text-center text-gray-500 border-l border-gray-300"
                    >
                      <div>{header.title}</div>
                      <div className="text-red-500">{header.alpha}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                    Base
                  </td>
                  {bannerPointerListData.map((seq: BannerPoint) => (
                    <td
                      key={seq.pointID}
                      className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold border-l border-gray-300"
                    >
                      {
                        dataSource.base[
                          seq.pointID as keyof typeof dataSource.base
                        ]
                      }
                    </td>
                  ))}
                </tr>
                {dataSource._row_order.map((seq: any) => (
                  <tr key={seq}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {
                        dataSource._rows[
                          seq as keyof typeof dataSource._rows
                        ]
                      }
                    </td>
                    {bannerPointerListData.map((seqData: BannerPoint) => {
                      const value =
                        dataSource.data[
                          seq as keyof typeof dataSource.data
                        ];
                      return (
                        <td
                          key={seqData.pointID}
                          className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700 border-l border-gray-300"
                        >
                          {value[seqData.pointID as keyof typeof value]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
