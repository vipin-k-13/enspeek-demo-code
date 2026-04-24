import React from 'react'
import ActionButton from './Action-button'

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
    <header className="questionnaire-card questionnaire-border flex border-b px-5 py-4 md:px-6">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 md:flex md:min-h-[42px] md:items-center">
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
        </div>
        <ActionButton
          showTableView={showTableView}
          setShowTableView={setShowTableView}
        />
        </div>
    </header>
  )
}

export default ReportHeader
