import React from "react";
import DynamicModel from "../../global/DynamicModel";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { apiRequest } from "../../../services/apiService";
import { toast } from "sonner";
interface WhatsaapModalProps {
  onSave: (selected: string) => void;
  onClose: () => void;
}

const WhatsaapModal: React.FC<WhatsaapModalProps> = ({ onClose }) => {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const user = useSelector((state: RootState) => state.user);

  const { data } = useQuery({
    queryKey: ["whatsaap"],
    queryFn: async () => {
      const res = await apiRequest(
        "post",
        "questionnaire/generate/whatsapp/link",
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

  return (
    <DynamicModel
      isOpen={true}
      onClose={onClose}
      Title="WhatsApp Link"
      ButtonText="Copy"
      onClick={() => {
        if (data?.short_url) {
          navigator.clipboard.writeText(data.short_url);
          toast.success("WhatsApp link copied to clipboard!");
        }
        onClose();
      }}
      className="max-w-lg"
    >
      <div className="flex justify-center items-center text-center">
        {data?.short_url ? (
          <a
            data-test-id="WHATSAPP_LINK"
            href={data.short_url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words text-action underline cursor-pointer"
          >
            {data.short_url}
          </a>
        ) : (
          <p className="text-gray-400">Generating link...</p>
        )}
      </div>
    </DynamicModel>
  );
};

export default WhatsaapModal;
