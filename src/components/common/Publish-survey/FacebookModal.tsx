import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { FaFacebookF } from "react-icons/fa";
import {
  LuCopy,
  LuInfo,
  LuLink,
  LuMessageSquareQuote,
} from "react-icons/lu";
import type { RootState } from "../../../store/store";
import { apiRequest } from "../../../services/apiService";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import ModalInfoBlock from "../../ui/modal/ModalInfoBlock";
import ModalHeader from "../../ui/modal/ModalHeader";

interface FacebookModalProps {
  onSave: (selected: string) => void;
  onClose: () => void;
}

const FacebookModal: React.FC<FacebookModalProps> = ({ onClose }) => {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const user = useSelector((state: RootState) => state.user);

  const { data } = useQuery({
    queryKey: ["facebook"],
    queryFn: async () => {
      const res = await apiRequest(
        "post",
        "questionnaire/generate/facebook/link",
        {
          apiToken: user.apiToken,
          studyID,
        }
      );
      return res.response;
    },
    enabled: !!studyID && !!user.apiToken,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const copyContent = data?.short_url || "";

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      className="max-w-[90vw] md:max-w-[980px]"
    >
      <div className="theme-surface">
        <ModalHeader
          title="Facebook Link"
          icon={
            <span className="text-[var(--color-brand-info)]">
              <FaFacebookF className="h-5 w-5" />
            </span>
          }
          onClose={onClose}
        />

        <div className="modal-body py-5 md:px-12">
          <div className="flex flex-col gap-5">
            {data?.short_url ? (
              <>
                <div className="modal-card flex items-center gap-5 px-5 py-5">
                  <span className="modal-header-icon text-[var(--color-brand-info)]">
                    <LuLink className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
                      <strong className="questionnaire-heading shrink-0 text-[24px] font-extrabold text-[var(--color-text-strong)]">
                        Link:
                      </strong>
                      <a
                        data-test-id="FACEBOOK_LINK"
                        href={data.short_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 truncate text-[22px] leading-8 text-[var(--color-brand-primary)] underline decoration-dashed underline-offset-4"
                      >
                        {data.short_url}
                      </a>
                    </div>
                  </div>
                </div>

                {data.Message && (
                  <div className="modal-card flex items-center gap-5 px-5 py-5">
                    <span className="modal-header-icon text-[var(--color-brand-info)]">
                      <LuMessageSquareQuote className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
                        <p className="questionnaire-heading shrink-0 text-[24px] font-extrabold text-[var(--color-text-strong)]">
                          Message:
                        </p>
                        <p className="min-w-0 truncate text-[22px] leading-8 text-[var(--color-text-default)]">
                          {data.Message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="modal-card px-5 py-8 text-center">
                <p className="text-lg theme-text-muted">Generating link...</p>
              </div>
            )}

            <ModalInfoBlock
              className="gap-5 rounded-lg px-5 py-5"
              icon={
                <span className="modal-header-icon text-[var(--color-brand-info)]">
                <LuInfo className="h-5 w-5" />
                </span>
              }
            >
              <p className="text-left text-[21px] leading-9 text-[var(--color-text-default)]">
                Copy and paste the message to start the conversation after opening the link
              </p>
            </ModalInfoBlock>
          </div>
        </div>

        <div className="flex justify-end gap-3 questionnaire-border theme-surface px-6 py-6">
          <Button
            type="button"
            varinat="cancel"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            varinat="theme"
            onClick={() => {
              if (copyContent) {
                navigator.clipboard.writeText(copyContent);
                toast.success("Facebook link copied to clipboard!");
              }
              onClose();
            }}
          >
            <LuCopy className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FacebookModal;
