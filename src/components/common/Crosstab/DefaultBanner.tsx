import { useState } from "react";
import { FaEdit, FaDownload, FaTrash, FaTable } from "react-icons/fa";
import { FaCopy, FaGears } from "react-icons/fa6";
import DynamicModel from "../../global/DynamicModel";
import Input from "../../ui/Input";
import { toast } from "sonner";
import BannerSettings from "./BannerSettings";
import { useLocation, useNavigate } from "react-router";
import {
  useBannerPointerList,
  useDeleteBanner,
  useDownloadtable,
  useReplicateBanner,
} from "./CrossTab.Api";
import { useProcessHook } from "../Report/ReportMutations";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { setBannerName } from "../../../store/CrosstabSlice";

interface DefaultBannerProps {
  Id: string;
  Title: string;
  description: string;
  OwnerName: string;
  tableIDList: string[];
}

export default function DefaultBanner({
  Id,
  Title,
  description,
  OwnerName,
  tableIDList,
}: DefaultBannerProps) {
  const { state } = useLocation();
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteInputValue, setDeleteInputValue] = useState("");
  const [copyTitle, setCopyTitle] = useState<string>(`${Title} (COPY)`);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleCb = () => {
    setIsCopyModalOpen(false);
    setCopyTitle(`${Title} (COPY)`);
  };
  const { replicateBannerMutate, isRelicateBannerPending } = useReplicateBanner(
    {
      studyID: state.studyID,
      cb: handleCb,
    }
  );

  const { deleteBannerMutation, isDeleteBannerPending } = useDeleteBanner({
    studyID: state.studyID,
    cb: () => setIsDeleteModalOpen(false),
  });
  const { bannerPointerListData } = useBannerPointerList(Id, state.studyID);
  const { Process } = useProcessHook();
  const { downloadTableMutate } = useDownloadtable({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      if (studyID && pid) {
        Process({ studyID, pid });
      }
    },
  });

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 mt-3"
        data-test-id={Title}
      >
        <div className="flex justify-between items-start px-3 py-2">
          <div>
            <h2
              className={`text-xl font-semibold text-action ${
                Array.isArray(bannerPointerListData) &&
                bannerPointerListData.length > 0
                  ? "cursor-pointer"
                  : "cursor-default"
              }`}
              onClick={() => {
                if (
                  Array.isArray(bannerPointerListData) &&
                  bannerPointerListData.length > 0
                ) {
                  dispatch(setBannerName(Title));
                  navigate("/crosstab/table-list", {
                    state: { studyID: state.studyID, bannerID: Id },
                  });
                }
              }}
            >
              {Title}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{description}</p>
          </div>
          <div className="flex space-x-3">
            {Array.isArray(bannerPointerListData) &&
              bannerPointerListData.length > 0 && (
                <>
                  <button
                    className="p-1 hover:text-gray-600 cursor-pointer transition-colors"
                    aria-label="Grid View"
                    onClick={() => {
                      dispatch(setBannerName(Title));
                      navigate("/crosstab/table-list", {
                        state: { studyID: state.studyID, bannerID: Id },
                      });
                    }}
                  >
                    <FaTable size={18} />
                  </button>
                  <button
                    data-test-id={`${Title}_COPY`}
                    className="p-1 text-blue-400 hover:text-blue-500 cursor-pointer transition-colors"
                    aria-label="Copy"
                    onClick={() => setIsCopyModalOpen(true)}
                  >
                    <FaCopy size={18} />
                  </button>
                  <button
                    data-test-id={`${Title}_SETTING`}
                    className="p-1 text-green-600 hover:text-green-700 cursor-pointer transition-colors"
                    aria-label="Settings"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <FaGears size={18} />
                  </button>
                  <button
                    className="p-1 text-yellow-500 hover:text-yellow-600 cursor-pointer transition-colors"
                    aria-label="Download"
                    onClick={() => {
                      downloadTableMutate({
                        bannerID: Id,
                        tableID: tableIDList,
                      });
                    }}
                  >
                    <FaDownload size={18} />
                  </button>
                </>
              )}
            <button
              className="p-1 text-action hover:text-action/80 cursor-pointer transition-colors"
              aria-label="Edit"
              onClick={() => {
                dispatch(setBannerName(Title));
                navigate("/crosstab/edit-banner", {
                  state: { studyID: state.studyID, bannerID: Id },
                });
              }}
            >
              <FaEdit size={18} />
            </button>
            <button
              data-test-id={`${Title}_DELETE`}
              className="p-1 text-red-500 hover:text-red-600 cursor-pointer transition-colors"
              aria-label="Delete"
              onClick={() => {
                setDeleteInputValue("");
                setIsDeleteModalOpen(true);
              }}
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>

        <div className="px-3 py-1">
          <div className="flex items-center justify-center">
            {Array.isArray(bannerPointerListData) &&
            bannerPointerListData.length ? (
              bannerPointerListData.map((info) => (
                <div
                  key={info.pointID}
                  className="border-2 border-gray-300 w-full p-1"
                >
                  {info.title}
                </div>
              ))
            ) : (
              <div className="p-2">No banner point added.</div>
            )}
          </div>
        </div>
        <div className="px-6 py-3">
          <p className="text-sm italic text-gray-600">
            {`Modified By: ${OwnerName}`}
          </p>
        </div>
      </div>
      <DynamicModel
        isOpen={isCopyModalOpen}
        onClose={() => setIsCopyModalOpen(false)}
        Title={`Copy : ${Title}`}
        ButtonText="Copy Banner"
        onClick={() =>
          replicateBannerMutate({ bannerID: Id, title: copyTitle })
        }
        className="max-w-2xl"
        disable={isRelicateBannerPending}
      >
        <p>Please type banner name in the below box.</p>
        <Input
          value={copyTitle}
          placeholder="Default Banner (copy)"
          className="my-3 focus:outline-none border border-gray-300"
          onChange={(e) => setCopyTitle(e.target.value)}
          disabled={isRelicateBannerPending}
        />
        <p>
          <span className="text-action">*</span> Please click on "Copy Banner"
          button and wait for some time till the banner is copied.
        </p>
      </DynamicModel>
      <DynamicModel
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        Title="Confirm Delete"
        ButtonText="Delete"
        onClick={() => {
          if (deleteInputValue.trim().toLowerCase() === "delete") {
            deleteBannerMutation(Id);
          } else {
            toast.error("Please type 'delete' to confirm.");
          }
        }}
        className="max-w-lg"
        disable={isDeleteBannerPending}
      >
        <p>{`Are you sure want to delete ${Title}?`}</p>
        <p className="my-3">Type delete in the input box</p>
        <Input
          data-test-id="BANNER_DELETE"
          placeholder="eg. delete"
          value={deleteInputValue}
          onChange={(e) => setDeleteInputValue(e.target.value)}
          className="my-3 focus:outline-none border border-gray-300"
          disabled={isDeleteBannerPending}
        />
      </DynamicModel>
      {isSettingsOpen && (
        <BannerSettings
          Id={Id}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
}
