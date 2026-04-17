import React, { useState } from "react";
import DynamicModel from "./DynamicModel";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import LoaderSpinner from "./LoaderSpinner";
import { handleKeyPress } from "../../utils";
import { useCopy } from "../common/list/Api";
import { setCopyModel } from "../../store/TriggerSlice";

const ListingCopyModel: React.FC = () => {
  const { selectedStudyName, copyModel, selectedId } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState<string>("");
  const { Copy, isPending } = useCopy();

  if (isPending) {
    return <LoaderSpinner />;
  }

  return (
    <DynamicModel
      Title={`Copy Study : ${selectedStudyName}`}
      ButtonText="Copy Study"
      isOpen={copyModel}
      onClose={() => dispatch(setCopyModel(false))}
      onClick={() => {
        Copy({ studyId: selectedId, studyName: value }), setValue("");
      }}
      disable={isPending}
      className="max-w-lg"
    >
      <>
        <p>Please type study name in the below box</p>
        <input
          value={value.trim() !== "" ? value : selectedStudyName}
          onChange={(e) => setValue(e.target.value)}
          className="border border-gray-400 px-3 py-1 my-3 w-full rounded-md focus-visible:outline-none"
          placeholder="new(copy)"
          onKeyDown={(e) =>
            handleKeyPress(e, () => {
              Copy({ studyId: selectedId, studyName: value });
              setValue("");
            })
          }
        />
        <div className="flex">
          <span className="text-action pl-1">*</span>
          <p>
            Please click on "Copy study" button and wait for some time till the
            study is copied.
          </p>
        </div>
      </>
    </DynamicModel>
  );
};

export default ListingCopyModel;
