import React from 'react'
import ActionButton from './Action-button'
import { SurfaceCard } from '../../ui/SurfaceCard'

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
    <SurfaceCard variant="toolbar" className="mx-3 mt-3 flex flex-col gap-4 px-5 py-4 md:mx-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="report-title truncate text-[18px] font-semibold md:text-[28px]">
            {Title || "Report"}
          </h1>
          {Type && (
            <span className="questionnaire-label rounded-full bg-[var(--color-brand-primary-softest)] px-3 py-1 text-sm">
              {Type}
            </span>
          )}
        </div>
      </div>
      <ActionButton
        showTableView={showTableView}
        setShowTableView={setShowTableView}
      />
    </SurfaceCard>
  )
}

export default ReportHeader
