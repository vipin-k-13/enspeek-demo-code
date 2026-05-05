import { useEffect, useState, type FC } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { queryClient } from "../../../App";
import Button from "../../ui/Button";
import { LuInfo, LuPlay, LuUsers } from "react-icons/lu";

interface SampleCollectionModelProps {
  isOpen: boolean;
  Closed: () => void;
  studyName?: string;
}

const SampleCollectionModel: FC<SampleCollectionModelProps> = ({
  isOpen,
  Closed,
  studyName,
}) => {
  const [inputValueInitiate, setInputValueInitiate] = useState("");
  const user = useSelector((state: RootState) => state.user);
  const studyInfo = useSelector((state: RootState) => state.study);
  const { state } = useLocation();
  const { mutate, isPending } = useMutation({
    mutationKey: ["Initiate Sample", state.studyID],
    mutationFn: async () => {
      const res = await apiRequest("post", "study/set/launch", {
        apiToken: user.apiToken,
        studyID: state.studyID,
      });
      return res.response;
    },
    onSuccess: () => {
      toast.success("Study set for sample collection");
      queryClient.invalidateQueries({ queryKey: ["studyInfo"] });
      setInputValueInitiate("");
      Closed();
    },
  });

  useEffect(() => {
    if (isOpen && !isPending) {
      setInputValueInitiate("");
    }
  }, [isOpen, isPending]);

  const handleInitiate = () => {
    if (inputValueInitiate.trim().toLowerCase() !== "collect") {
      toast.error("Please type 'collect' to confirm sample collection.");
      return;
    }
    mutate();
  };

  return (
    <DynamicModel
      Title={studyInfo.closed === 1 ? "Relaunch Survey" : "Initiate Sample Collection"}
      headerIcon={
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
          <LuUsers className="h-5 w-5" />
        </span>
      }
      ButtonText={isPending ? "Collecting..." : studyInfo.closed === 1 ? "Relaunch Survey" : "Initiate Sample Collection"}
      buttonVariant="success"
      buttonIcon={
        isPending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        ) : (
          <LuPlay className="h-4 w-4" />
        )
      }
      isOpen={isOpen}
      onClick={handleInitiate}
      onClose={() => !isPending && Closed()}
      className="max-w-lg"
      disable={isPending}
      bodyClassName="bg-white"
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
          className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
          onClick={Closed}
          disabled={isPending}
        >
          Cancel
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-base text-[var(--color-text-strong)]">
          Please confirm if you are ready to collect sample for{" "}
          <span className="font-semibold text-login-primary">{studyName}</span>
          ?
        </p>
        <div className="rounded-[20px] border questionnaire-border bg-white px-4 py-4 shadow-[0_8px_24px_rgba(79,70,229,0.08)]">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
              <LuInfo className="h-4 w-4" />
            </span>
            <p className="text-sm leading-6 text-[var(--color-text-strong)]">
              Please type <strong className="text-login-primary">collect</strong>{" "}
              in the box below to confirm.
            </p>
          </div>
        </div>
      </div>
      <input
        type="text"
        data-test-id="Initiate_INPUT"
        placeholder="eg. collect"
        className="questionnaire-input questionnaire-heading questionnaire-border mt-4 w-full rounded-[18px] border border-login-primary/30 px-4 py-3 text-sm shadow-[0_8px_24px_rgba(79,70,229,0.08)] focus:outline-none"
        value={inputValueInitiate}
        onChange={(e) => setInputValueInitiate(e.target.value)}
        disabled={isPending}
      />
    </DynamicModel>
  );
};

export default SampleCollectionModel;
