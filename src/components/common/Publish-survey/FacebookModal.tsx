import React from "react";
import DynamicModel from "../../global/DynamicModel";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { apiRequest } from "../../../services/apiService";
import { toast } from "sonner";

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
    <DynamicModel
      isOpen={true}
      onClose={onClose}
      Title="Facebook Link"
      ButtonText="Copy"
      onClick={() => {
        if (copyContent) {
          navigator.clipboard.writeText(copyContent);
          toast.success("Facebook link copied to clipboard!");
        }
        onClose();
      }}
      className="max-w-lg"
    >
      <div className="flex flex-col justify-center items-center text-center gap-3 min-h-[100px]">
        {data?.short_url ? (
          <>
            <div className="flex justify-center items-center text-center">
              <strong>Link:</strong>
              <a
                data-test-id="FACEBOOK_LINK"
                href={data.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 break-words underline ml-1 cursor-pointer"
              >
                {data.short_url}
              </a>
            </div>

            {data.Message && (
              <div>
                <strong>Message:</strong> {data.Message}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400">Generating link...</p>
        )}
        <p className="text-gray-700">
          Copy and paste the message to start the conversation after opening the
          lik
        </p>
      </div>
    </DynamicModel>
  );
};

export default FacebookModal;
