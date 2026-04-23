import { useState } from "react";
import {
  LuCopy,
  LuDownload,
  LuFilePenLine,
  LuSettings2,
  LuTable2,
  LuTrash2,
} from "react-icons/lu";
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
import IconActionButton from "../../ui/IconActionButton";

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
        className="report-card mt-3"
        data-test-id={Title}
      >
        <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2
              className={`crosstab-title text-xl font-semibold ${
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
            <p className="crosstab-muted mt-1 text-sm">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {Array.isArray(bannerPointerListData) &&
              bannerPointerListData.length > 0 && (
                <>
                  <IconActionButton
                    aria-label="Grid View"
                    onClick={() => {
                      dispatch(setBannerName(Title));
                      navigate("/crosstab/table-list", {
                        state: { studyID: state.studyID, bannerID: Id },
                        });
                    }}
                  >
                    <LuTable2 size={18} />
                  </IconActionButton>
                  <IconActionButton
                    data-test-id={`${Title}_COPY`}
                    tone="info"
                    aria-label="Copy"
                    onClick={() => setIsCopyModalOpen(true)}
                  >
                    <LuCopy size={18} />
                  </IconActionButton>
                  <IconActionButton
                    data-test-id={`${Title}_SETTING`}
                    tone="success"
                    aria-label="Settings"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <LuSettings2 size={18} />
                  </IconActionButton>
                  <IconActionButton
                    tone="warning"
                    aria-label="Download"
                    onClick={() => {
                      downloadTableMutate({
                        bannerID: Id,
                        tableID: tableIDList,
                      });
                    }}
                  >
                    <LuDownload size={18} />
                  </IconActionButton>
                </>
              )}
            <IconActionButton
              tone="primary"
              aria-label="Edit"
              onClick={() => {
                dispatch(setBannerName(Title));
                navigate("/crosstab/edit-banner", {
                  state: { studyID: state.studyID, bannerID: Id },
                });
              }}
            >
              <LuFilePenLine size={18} />
            </IconActionButton>
            <IconActionButton
              data-test-id={`${Title}_DELETE`}
              tone="danger"
              aria-label="Delete"
              onClick={() => {
                setDeleteInputValue("");
                setIsDeleteModalOpen(true);
              }}
            >
              <LuTrash2 size={18} />
            </IconActionButton>
          </div>
        </div>

        <div className="px-4 py-1">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.isArray(bannerPointerListData) &&
            bannerPointerListData.length ? (
              bannerPointerListData.map((info) => (
                <div
                  key={info.pointID}
                  className="crosstab-soft-panel crosstab-title w-full px-3 py-2 text-sm font-medium"
                >
                  {info.title}
                </div>
              ))
            ) : (
              <div className="crosstab-muted p-2">No banner point added.</div>
            )}
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="crosstab-muted text-sm italic">
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
        <p className="crosstab-title">Please type banner name in the below box.</p>
        <Input
          value={copyTitle}
          placeholder="Default Banner (copy)"
          className="questionnaire-input questionnaire-heading my-3 border questionnaire-border focus:outline-none"
          onChange={(e) => setCopyTitle(e.target.value)}
          disabled={isRelicateBannerPending}
        />
        <p className="crosstab-muted">
          <span className="text-login-primary">*</span> Please click on "Copy Banner"
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
        <p className="crosstab-title">{`Are you sure want to delete ${Title}?`}</p>
        <p className="crosstab-muted my-3">Type delete in the input box</p>
        <Input
          data-test-id="BANNER_DELETE"
          placeholder="eg. delete"
          value={deleteInputValue}
          onChange={(e) => setDeleteInputValue(e.target.value)}
          className="questionnaire-input questionnaire-heading my-3 border questionnaire-border focus:outline-none"
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
