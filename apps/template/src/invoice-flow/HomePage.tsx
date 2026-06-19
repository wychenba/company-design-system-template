import { Button, Tag, Tabs, TabsList, TabsTrigger, Separator } from '@qijenchen/design-system'
import { Plus, Download, Info, PenLine, Trash2 } from 'lucide-react'
import { AppLayout } from './AppLayout'

interface HomePageProps {
  onNewApplication: () => void
}

const DRAFT_ROWS = [
  { id: 'PAE20260525001', date: '2026/5/29', company: 'TA01', applicant: '林問宜 (023156)', payeeType: '員工', total: '1,600', urgentDate: '-', reason: '-', status: 'Default' },
  { id: 'PAE20260525002', date: '2026/5/28', company: 'TA01', applicant: '林問宜 (023156)', payeeType: '員工', total: '2,400', urgentDate: '-', reason: '-', status: 'Default' },
  { id: 'PAE20260525003', date: '2026/5/27', company: 'TA01', applicant: '林問宜 (023156)', payeeType: '員工', total: '3,800', urgentDate: '-', reason: '-', status: 'Processing' },
]

// Column widths are fixed structural table dimensions stored as JS data, not Tailwind spacing
const TABLE_COLS = [
  { label: '單號', w: 184 },
  { label: '申請日期', w: 120 },
  { label: '公司代號', w: 120 },
  { label: '申請人', w: 160 },
  { label: '收款對象', w: 80 },
  { label: '總額', w: 160 },
  { label: '緊急/指定付款日期', w: 160 },
  { label: '申請原因', w: 160 },
]

// Cell padding via inline style so no Tailwind magic numbers are introduced
const CELL_STYLE: React.CSSProperties = {
  padding: '8px var(--layout-space-tight)',
}

export function HomePage({ onNewApplication }: HomePageProps) {
  return (
    <AppLayout activeMenu="暫存申請單">
      <div className="flex flex-col h-full">
        {/* Page header + DS Tabs */}
        <div className="bg-surface border-b border-divider px-[var(--layout-space-loose)] pt-[var(--layout-space-loose)]">
          <h1 className="text-h4 font-medium text-fg mb-[var(--layout-space-tight)]">暫存申請單</h1>
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">一般</TabsTrigger>
              <TabsTrigger value="bonus">現金獎金</TabsTrigger>
              <TabsTrigger value="travel">國內差旅</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-[var(--layout-space-loose)]">
          {/* Section header */}
          <div className="flex items-center gap-[var(--layout-space-tight)] mb-[var(--layout-space-loose)]">
            <span className="flex-1 text-body-lg font-medium text-fg">一般暫存申請</span>
            <Button variant="primary" size="sm" startIcon={Plus} onClick={onNewApplication}>
              新增
            </Button>
            <Separator orientation="vertical" style={{ height: 20 }} />
            <Button variant="tertiary" size="sm" startIcon={Download}>
              下載 Excel 範本
            </Button>
          </div>

          {/* Table — bounded region */}
          <div className="bg-surface border border-divider rounded overflow-hidden">
            {/* Header */}
            <div className="bg-surface-raised flex items-center border-b border-divider">
              {TABLE_COLS.map((col, i) => (
                <div key={col.label} className="flex items-center self-stretch">
                  {i > 0 && <Separator orientation="vertical" />}
                  <div style={{ ...CELL_STYLE, width: col.w }} className="text-body text-fg">
                    {col.label}
                  </div>
                </div>
              ))}
              <div className="flex-1" />
            </div>

            {/* Rows */}
            {DRAFT_ROWS.map((row, rowIdx) => (
              <div key={row.id}>
                {rowIdx > 0 && <Separator />}
                <div className="flex items-center hover:bg-surface-hovered transition-colors">
                  <div style={{ ...CELL_STYLE, width: 184 }} className="flex flex-col gap-[var(--layout-space-tight)]">
                    <span className="text-body text-fg truncate">{row.id}</span>
                    <Tag color={row.status === 'Processing' ? 'blue' : 'neutral'} size="sm">
                      {row.status === 'Processing' ? '審核中' : '草稿'}
                    </Tag>
                  </div>
                  {[
                    { val: row.date, w: 120 },
                    { val: row.company, w: 120 },
                    { val: row.applicant, w: 160 },
                    { val: row.payeeType, w: 80 },
                    { val: row.total, w: 160 },
                    { val: row.urgentDate, w: 160 },
                    { val: row.reason, w: 160 },
                  ].map((cell, i) => (
                    <div key={i} style={{ ...CELL_STYLE, width: cell.w }} className="text-body text-fg">
                      {cell.val}
                    </div>
                  ))}
                  <div className="flex items-center gap-[var(--layout-space-tight)] px-[var(--layout-space-tight)]">
                    <Button variant="text" size="sm" iconOnly startIcon={Info} aria-label="查看詳情" />
                    <Button variant="text" size="sm" iconOnly startIcon={PenLine} aria-label="編輯" onClick={onNewApplication} />
                    <Button variant="text" size="sm" iconOnly startIcon={Trash2} aria-label="刪除" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
