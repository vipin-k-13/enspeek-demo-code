import React from 'react'
import ActionButton from './Action-button'

type ReportHeaderProps = {
  Title:string,
  Type: string,
  showTableView: boolean
  setShowTableView: React.Dispatch<React.SetStateAction<boolean>>
}

const ReportHeader: React.FC<ReportHeaderProps> = ({showTableView, setShowTableView }) => {
  return (
    <div className="flex justify-end">
      <ActionButton
        showTableView={showTableView}
        setShowTableView={setShowTableView}
      />
    </div>
  )
}

export default ReportHeader
