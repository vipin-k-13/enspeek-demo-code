import React, { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import LoaderSpinner from "../../global/LoaderSpinner";
import { useDispatch, useSelector } from "react-redux";
import { setBannerName } from "../../../store/CrosstabSlice";
import BannerLogic from "../../global/BannerLogic";
import type { RootState } from "../../../store/store";
import CrosstabInput from "../../global/CrosstabInput";
import ModalInstruction from "../../ui/ModalInstruction";

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBannerDesignClick: (e: AddBannerPayload) => void;
  isPending: boolean;
}

const AddBannerModal: React.FC<AddBannerModalProps> = ({
  isOpen,
  onClose,
  onBannerDesignClick,
  isPending,
}) => {
  const {name} = useSelector((state:RootState)=>state.study)
  const [bannerName, setBannerNameInput] = useState<string>("");
  const [bannerDescription, setBannerDescription] = useState<string>("");
  const [counts, setCounts] = useState<boolean>(false);
  const [percentage, setPercentage] = useState<boolean>(true);
  const [errors, setErrors] = useState<{
    bannerName?: string;
    bannerDescription?: string;
  }>({});

  const handleClose = ()=>{
    setBannerNameInput("")
    setBannerDescription("")
    onClose()
  }

  const dispatch = useDispatch();

  const logic = useSelector((state: RootState) => state.crosstab.logic);

  const HandleClick = () => {
    const newErrors: { bannerName?: string; bannerDescription?: string } = {};

    if (!bannerName.trim()) {
      newErrors.bannerName = "Banner name is required";
    }
    if (!bannerDescription.trim()) {
      newErrors.bannerDescription = "Banner description is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(setBannerName(bannerName));
      onBannerDesignClick({
        title: bannerName,
        description: bannerDescription,
        logic:logic["NewBanner"], 
        count: counts ? 1 : 0,
        percent: percentage ? 1 : 0,
      });
      setBannerName("");
      setBannerDescription("");
      setCounts(false);
      setPercentage(true);
    }
  };

  if (!isOpen) return null;
  if (isPending) return <LoaderSpinner />;

  return (
    <DynamicModel
      Title={`Add Banner: ${name}`}
      ButtonText="Design Banner"
      isOpen={isOpen}
      onClose={handleClose}
      onClick={HandleClick}
      className="max-w-5xl"
    >
      <ModalInstruction>
        Add the banner details and optional overall filter, then continue to banner design.
      </ModalInstruction>
      <div className="space-y-4">
        <div>
          <CrosstabInput
            label="Banner Name"
            data-test-id="BANNER_NAME"
            required
            placeholder="Enter Banner Title"
            value={bannerName}
            onChange={(e) => setBannerNameInput(e.target.value)}
          />
          {errors.bannerName && (
            <p className="mt-1 text-sm text-red-600">{errors.bannerName}</p>
          )}
        </div>
        <div>
          <CrosstabInput
            label="Banner Description"
            data-test-id="BANNER_DESCRIPTION"
            required
            placeholder="Enter banner description ..."
            value={bannerDescription}
            onChange={(e) => setBannerDescription(e.target.value)}
          />
          {errors.bannerDescription && (
            <p className="mt-1 text-sm text-red-600">
              {errors.bannerDescription}
            </p>
          )}
        </div>
        <div>
          <p className="crosstab-title mb-2 text-sm font-semibold">Select View Type</p>
          <div className="flex space-x-8">
            <label className="home-text flex items-center space-x-2">
              <input
                type="checkbox"
                checked={percentage}
                onChange={(e) => setPercentage(e.target.checked)}
                className="questionnaire-clickable"
              />
              <span>Percentage</span>
            </label>
          </div>
        </div>

        <div>
          <p className="crosstab-title mb-3 text-sm font-semibold">
            Overall Banner Filter <span className="crosstab-muted">(optional)</span>
          </p>
          <div className="flex items-center space-x-8">
            <BannerLogic storeComponent="NewBanner"/>
          </div>
        </div>
      </div>
    </DynamicModel>
  );
};

export default AddBannerModal;
