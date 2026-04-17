import React from "react";
import DynamicModel from "../../global/DynamicModel";
import TableList from "../table-List/TableList";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: any;
}

const TableModal: React.FC<Props> = ({ isOpen, onClose, message }) => {
  if (!message?.sdata?.tableID) return null;

  return (
    <DynamicModel
      isOpen={isOpen}
      onClose={onClose}
      Title="Crosstab Table"
      ButtonText="Close"
      onClick={() => {
        onClose;
      }}
      className="max-w-5xl"
    >
      <TableList
        Id={"CROSSTAB"}
        qID={message.sdata.tableID}
        Title={"Crosstab Table"}
        Description={"This is a crosstab analysis of responses"}
        tableIDList={[message.sdata.tableID]}
        tableID={message.sdata.tableID}
        sdata={message.sdata}
      />
    </DynamicModel>
  );
};

export default TableModal;
