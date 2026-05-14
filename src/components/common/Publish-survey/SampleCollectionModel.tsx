import { useEffect, useRef, useState, type FC } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { handleKeyPress } from "../../../utils";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { LuInfo, LuPlay, LuUsers } from "react-icons/lu";
import ModalInfoBlock from "../../ui/modal/ModalInfoBlock";
import { useInitiateSampleCollectionMutation } from "../../../api-network/publish-survey/mutation";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isConfirmed = inputValueInitiate.trim().toLowerCase() === "collect";
  const studyInfo = useSelector((state: RootState) => state.study);
  const { state } = useLocation();
  const { mutate, isPending } = useInitiateSampleCollectionMutation(state.studyID);

  useEffect(() => {
    if (isOpen && !isPending) {
      setInputValueInitiate("");
      requestAnimationFrame(() => {
        const input = inputRef.current;
        if (!input) return;
        input.focus();
        const caretPosition = input.value.length;
        input.setSelectionRange(caretPosition, caretPosition);
      });
    }
  }, [isOpen, isPending]);

  const handleInitiate = () => {
    if (inputValueInitiate.trim().toLowerCase() !== "collect") {
      toast.error("Please type 'collect' to confirm sample collection.");
      return;
    }
    mutate(undefined, {
      onSuccess: () => {
        setInputValueInitiate("");
        Closed();
      },
    });
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
      disable={isPending || !isConfirmed}
      closeDisabled={isPending}
      bodyClassName="bg-white"
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
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
        <ModalInfoBlock
          className="modal-info-block"
          icon={
            <span className="modal-info-icon text-[var(--color-brand-primary)]">
              <LuInfo className="h-4 w-4" />
            </span>
          }
        >
          Please type <strong className="text-login-primary">collect</strong>{" "}
          in the box below to confirm.
        </ModalInfoBlock>
      </div>
      <Input
        ref={inputRef}
        variant="modal"
        type="text"
        data-test-id="Initiate_INPUT"
        placeholder="eg. collect"
        className="questionnaire-heading mt-4 rounded-[18px]"
        value={inputValueInitiate}
        onChange={(e) => setInputValueInitiate(e.target.value)}
        onKeyDown={(e) => handleKeyPress(e, handleInitiate)}
        disabled={isPending}
      />
    </DynamicModel>
  );
};

export default SampleCollectionModel;
