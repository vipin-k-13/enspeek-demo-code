import { useState } from "react";
import {
  LuCopy,
  LuDownload,
  LuPencilLine,
  LuInfo,
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
import Button from "../../ui/Button";

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
              <LuPencilLine size={18} />
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
        onClose={() => {
          if (!isRelicateBannerPending) {
            setIsCopyModalOpen(false);
          }
        }}
        Title={`Copy : ${Title}`}
        headerIcon={
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
            <LuCopy className="h-5 w-5" />
          </span>
        }
        ButtonText={isRelicateBannerPending ? "Copying..." : "Copy Banner"}
        buttonIcon={
          isRelicateBannerPending ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
          ) : (
            <LuCopy className="h-4 w-4" />
          )
        }
        onClick={() =>
          replicateBannerMutate({ bannerID: Id, title: copyTitle })
        }
        className="max-w-2xl"
        disable={isRelicateBannerPending}
        secondaryAction={
          <Button
            type="button"
            varinat="cancel"
            className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
            onClick={() => setIsCopyModalOpen(false)}
            disabled={isRelicateBannerPending}
          >
            Cancel
          </Button>
        }
      >
        <p className="mt-1 text-[15px] leading-6 text-black">
          Create a copy of
          <span className="font-semibold text-login-primary">{` ${Title || "this banner"}`}</span>
          {" "}with a new banner name.
        </p>
        <label className="home-heading mt-5 block text-[15px] font-semibold">
          New Banner Name
        </label>
        <Input
          value={copyTitle}
          placeholder="Default Banner (copy)"
          className="questionnaire-input questionnaire-heading mt-3 w-full rounded-[18px] border border-login-primary/35 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(85,90,230,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-login-primary/20"
          onChange={(e) => setCopyTitle(e.target.value)}
          disabled={isRelicateBannerPending}
        />
        <div className="mt-4 flex items-start gap-3 rounded-[16px] home-panel-soft-bg px-4 py-3">
          <LuInfo className="mt-0.5 h-4 w-4 shrink-0 text-login-primary" />
          <p className="text-sm leading-6 text-black">
            Click <span className="font-semibold text-login-primary">Copy Banner</span> and wait a moment while the duplicated banner is created.
          </p>
        </div>
      </DynamicModel>
      <DynamicModel
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleteBannerPending) {
            setIsDeleteModalOpen(false);
          }
        }}
        Title="Delete Banner"
        headerIcon={
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-questionnaire-stop-bg)] text-[var(--color-questionnaire-stop)]">
            <LuTrash2 className="h-5 w-5" />
          </span>
        }
        ButtonText={isDeleteBannerPending ? "Deleting..." : "Delete"}
        buttonIcon={
          isDeleteBannerPending ? (
            <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
          ) : (
            <LuTrash2 className="h-4 w-4" />
          )
        }
        onClick={() => {
          if (deleteInputValue.trim().toLowerCase() === "delete") {
            deleteBannerMutation(Id);
          } else {
            toast.error("Please type 'delete' to confirm.");
          }
        }}
        className="max-w-lg"
        bodyClassName="bg-white"
        disable={isDeleteBannerPending}
        secondaryAction={
          <Button
            type="button"
            varinat="cancel"
            className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleteBannerPending}
          >
            Cancel
          </Button>
        }
      >
        <p className="mt-1 text-[15px] leading-6 text-black">
          Are you sure you want to delete
          <span className="font-semibold text-[var(--color-questionnaire-stop)]">{` ${Title || "this banner"}`}</span>
          ? This action cannot be undone.
        </p>
        <div className="mt-4 flex items-start gap-3 rounded-[16px] home-panel-soft-bg px-4 py-3">
          <LuInfo className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-questionnaire-stop)]" />
          <p className="text-sm leading-6 text-black">
            Type <span className="font-semibold text-[var(--color-questionnaire-stop)]">delete</span> to confirm this action.
          </p>
        </div>
        <Input
          data-test-id="BANNER_DELETE"
          placeholder="Type 'delete' here..."
          value={deleteInputValue}
          onChange={(e) => setDeleteInputValue(e.target.value)}
          className="questionnaire-input questionnaire-heading mt-4 w-full rounded-[18px] border border-[color:var(--color-questionnaire-stop)]/35 bg-white px-4 py-3 shadow-[0_8px_20px_rgba(239,68,68,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-questionnaire-stop)]/20"
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
