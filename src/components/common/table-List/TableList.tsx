import { LuDownload, LuLoaderCircle, LuPencilLine, LuRefreshCw } from "react-icons/lu";
import { useDispatch } from "react-redux";
import {
  setIsEditModal,
  setSelectedQid,
  setSelectedTable,
} from "../../../store/CrosstabSlice";
import { useLocation } from "react-router";
import { useProcessHook } from "../Report/ReportMutations";
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
      <div className="report-card p-3">
        <div className="flex flex-col justify-between gap-3 bg-white px-3 py-1 md:flex-row md:items-center">
          <div>
            <h2 className="crosstab-title font-semibold">{Title}</h2>
            <p className="crosstab-muted text-sm">{Description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!isStatic && (
            <button
              className="questionnaire-clickable crosstab-muted rounded-full p-2 transition-colors hover:bg-[var(--color-brand-primary-softest)] hover:text-login-primary"
              aria-label="Refresh"
              onClick={() => TableOutputData()}
            >
              <LuRefreshCw size={18} />
            </button>
             )}
            <button
              className="questionnaire-clickable rounded-full p-2 text-[var(--color-study-progress)] transition-colors hover:bg-[var(--color-home-panel-soft)]"
              aria-label="Download"
              onClick={() =>
                downloadTableMutate({
                  bannerID: state.bannerID,
                  tableID: [tableID],
                })
              }
            >
              <LuDownload size={18} />
            </button>
             {!isStatic && (
            <button
              className="questionnaire-clickable rounded-full p-2 text-login-primary transition-colors hover:bg-[var(--color-brand-primary-softest)]"
              aria-label="Edit"
              onClick={onEditHandle}
            >
              <LuPencilLine size={18} />
            </button>  
             )}         
          </div>
        </div>
        <div className="crosstab-soft-panel my-4 overflow-x-auto mx-auto">
          {isTableOutputRefetching ? (
            <div className="flex p-4 justify-center">
              <LuLoaderCircle size={34} className="animate-spin text-action" />
            </div>
          ) : (
            <table className="w-full divide-y home-border-soft">
              <thead>
                <tr className="home-panel-soft-bg">
                  <th className="px-6 py-3 text-left crosstab-muted"></th>
                  {bannerPointerListData.map((header: BannerPoint) => (
                    <th
                      key={header.pointID}
                      className="px-6 py-3 text-center crosstab-muted border-l home-border-soft"
                    >
                      <div>{header.title}</div>
                      <div className="text-[var(--color-questionnaire-stop)]">{header.alpha}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y home-border-soft">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold crosstab-title">
                    Base
                  </td>
                  {bannerPointerListData.map((seq: BannerPoint) => (
                    <td
                      key={seq.pointID}
                      className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold crosstab-title border-l home-border-soft"
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm crosstab-title">
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
                          className="px-6 py-4 whitespace-nowrap text-center text-sm home-text border-l home-border-soft"
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
