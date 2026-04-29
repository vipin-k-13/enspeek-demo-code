import { useState, type FC } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { queryClient } from "../../../App";

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
  const { mutate } = useMutation({
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
  const handleInitiate = () => {
    if (inputValueInitiate.trim().toLowerCase() !== "collect") {
      toast.error("Please type 'collect' to confirm sample collection.");
      return;
    }
    mutate();
  };

  return (
    <DynamicModel
      Title="Confirmation"
      ButtonText={studyInfo.closed === 1 ? "Relaunch" : "Initiate Sample Collection"}
      buttonVariant="theme"
      isOpen={isOpen}
      onClick={handleInitiate}
      onClose={Closed}
      className="max-w-lg"
    >
      <p className="">
        Please confirm if you are ready to collect sample for :
        <strong className="ml-1">{studyName}</strong>?
      </p>
      <p className="mt-3">
        Please type <strong>collect</strong> in the box below to confirm.
      </p>
      <input
        type="text"
        data-test-id="Initiate_INPUT"
        placeholder="eg. collect"
        className="w-full border border-gray-300 focus:outline-none
         items-center rounded-md px-3 py-2 text-sm mt-3"
        value={inputValueInitiate}
        onChange={(e) => setInputValueInitiate(e.target.value)}
      />
    </DynamicModel>
  );
};

export default SampleCollectionModel;
