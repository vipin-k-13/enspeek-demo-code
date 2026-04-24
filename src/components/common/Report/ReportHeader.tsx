import React from 'react'
import ActionButton from './Action-button'
import PageSubheader from '../../ui/PageSubheader'

type ReportHeaderProps = {
  Title:string,
  Type: string,
  showTableView: boolean
  setShowTableView: React.Dispatch<React.SetStateAction<boolean>>
}

const ReportHeader: React.FC<ReportHeaderProps> = ({
  Title,
  Type,
  showTableView,
  setShowTableView,
}) => {
  return (
    <PageSubheader
      left={
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="report-title truncate text-[18px] font-semibold leading-none md:text-[24px]">
            {Title || "Report"}
          </h1>
          {Type && (
            <span className="question-type-default inline-flex min-h-[34px] items-center rounded-full px-3.5 py-1.5 text-sm font-semibold leading-none">
              {Type}
            </span>
          )}
        </div>
      }
      right={
        <ActionButton
          showTableView={showTableView}
          setShowTableView={setShowTableView}
        />
      }
    />
  )
}

export default ReportHeader
