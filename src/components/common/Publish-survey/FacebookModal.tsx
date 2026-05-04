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
  LuSparkle,
} from "react-icons/lu";
import type { RootState } from "../../../store/store";
import { apiRequest } from "../../../services/apiService";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

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
      className="max-w-[90vw] md:max-w-[980px] rounded-[36px] border border-white/70 bg-white shadow-[0_40px_100px_rgba(30,41,59,0.22)]"
    >
      <div className="bg-white">
        <div className="questionnaire-border px-6 py-6 pr-16">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-[var(--color-brand-info)]">
              <FaFacebookF className="h-5 w-5" />
            </div>
            <h3 className="home-heading text-[24px] font-extrabold text-[#08144f]">
              Facebook Link
            </h3>
          </div>
        </div>

        <div className="h-[calc(100vh-300px)] overflow-auto py-5 md:px-12">
          <div className="flex flex-col gap-5">
            {data?.short_url ? (
              <>
                <div className="flex items-center gap-5 rounded-lg bg-white px-5 py-5 shadow-[0_12px_28px_rgba(91,77,247,0.07)] border border-login-primary/35">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-[var(--color-brand-info)]">
                    <LuLink className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
                      <strong className="questionnaire-heading shrink-0 text-[24px] font-extrabold text-[#08144f]">
                        Link:
                      </strong>
                      <a
                        data-test-id="FACEBOOK_LINK"
                        href={data.short_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-w-0 truncate text-[22px] leading-8 text-[#5b4df7] underline decoration-dashed underline-offset-4"
                      >
                        {data.short_url}
                      </a>
                    </div>
                  </div>
                </div>

                {data.Message && (
                  <div className="flex items-center gap-5 rounded-lg bg-white px-5 py-5 shadow-[0_12px_28px_rgba(91,77,247,0.07)] border border-login-primary/35">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-[var(--color-brand-info)]">
                      <LuMessageSquareQuote className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
                        <p className="questionnaire-heading shrink-0 text-[24px] font-extrabold text-[#08144f]">
                          Message:
                        </p>
                        <p className="min-w-0 truncate text-[22px] leading-8 text-[#1f2c67]">
                          {data.Message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg bg-white px-5 py-8 text-center shadow-[0_12px_28px_rgba(91,77,247,0.07)] border border-login-primary/35">
                <p className="text-lg text-gray-400">Generating link...</p>
              </div>
            )}

            <div className="flex gap-5 items-center px-5 py-5 rounded-lg">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-[var(--color-brand-info)]">
                <LuInfo className="h-5 w-5" />
              </span>
              <p className="text-left text-[21px] leading-9 text-[#33406f]">
                Copy and paste the message to start the conversation after opening the link
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 questionnaire-border bg-white px-6 py-6">
          <Button
            type="button"
            varinat="cancel"
            className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
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
