import { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { toast } from "sonner";
import AddCustomTableListModal from "./TableAdd";
import BannerLogic from "../../global/BannerLogic";
import { useAddCustomTable } from "../Crosstab/CrossTab.Api";
import { useLocation } from "react-router";
import CrosstabInput from "../../global/CrosstabInput";

interface ControlItem {
  id: number;
  variable: string;
}
interface TableRow {
  id: string;
  title: string;
  variables: string;
  logic: { pointLogic: string }[]
  controls: ControlItem[];
}

interface AddCustomTableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    label: string;
    text: string;
    logic: string;
    rows: TableRow[];
  }) => void;
}
export default function AddCustomTableModal({
  open,
  onOpenChange,
}: AddCustomTableModalProps) {
  const [tableLabel, setTableLabel] = useState("");
  const [tableText, setTableText] = useState("");
  const [tableLogic, setTableLogic] = useState<{ pointLogic: string }[]>([]);
  const location = useLocation()
   const { addCustomTableMutate } = useAddCustomTable(location.state.studyID);
  const [,setControlItems] = useState<ControlItem[]>([
    { id: Date.now(), variable: "variable1" },
  ]);

  const [rows, setRows] = useState<TableRow[]>([
    {
      id: "CT-1",
      title: "",
      variables: "",
      logic:[],
      controls: [{ id: Date.now(), variable: "variable1" }],
    },
  ]);

  const handleSubmit = () => {
  if (!tableLabel.trim()) {
    toast.error("Table label is required");
    return;
  }
  if (!tableText.trim()) {
    toast.error("Table text is required");
    return;
  }
  const emptyTitleRow = rows.find((row) => !row.title.trim());
  if (emptyTitleRow) {
    toast.error(`Row "${emptyTitleRow.id}" has an empty title`);
    return;
  }

  const payload = {
    bannerID: location?.state?.bannerID,
    title: tableLabel,
    description: tableText,
    qType: "Single-select", 
    logic: tableLogic,
    rowOptionList: rows.map((row, index) => ({
      active: 1, 
      id: row.id,
      optionCode: index + 1,
      optionLogic: row.logic,
      optionText: row.title,
      optionType: "standard", 
      seq: index + 1,
    })),
  };

  addCustomTableMutate(payload);
  setTableLabel("");
  setTableText("");
  setTableLogic([]);
  setRows([
    {
      id: "CT-1",
      title: "",
      variables: "",
      logic:[],
      controls: [{ id: Date.now(), variable: "variable1" }],
    },
  ]);
  setControlItems([{ id: Date.now(), variable: "variable1" }]);
  onOpenChange(false);
};

 

  return (
    <DynamicModel
      Title="Add Custom Table"
      ButtonText="Add Custom Table"
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onClick={handleSubmit}
      className="max-w-6xl"
    >
      <div className="space-y-4">
        <div>
          <CrosstabInput
            label="Table Label"
            required
            placeholder="Enter label"
            value={tableLabel}
            onChange={(e) => setTableLabel(e.target.value)}
          />
        </div>
        <div>
          <CrosstabInput
            label="Table Text"
            placeholder="Enter text"
            value={tableText}
            onChange={(e: any) => setTableText(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Table Logic</label>
          <BannerLogic setLogicFunc={(e)=>setTableLogic(e)} />
        </div>
        <AddCustomTableListModal rows={rows} setRows={setRows}/>
      </div>
    </DynamicModel>
  );
}
