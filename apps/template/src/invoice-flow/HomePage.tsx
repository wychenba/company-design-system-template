import { Button, Tag, Tabs, TabsList, TabsTrigger, Separator, DataTable } from '@qijenchen/design-system'
import { createColumnHelper } from '@tanstack/react-table'
import { Plus, Download, Info, PenLine, Trash2, ChevronDown } from 'lucide-react'
import { AppLayout } from './AppLayout'

interface DraftRow {
  id: string
  date: string
  company: string
  applicant: string
  payeeType: string
  total: string
  urgentDate: string
  reason: string
  status: 'Default' | 'Processing'
}

const DRAFT_ROWS: DraftRow[] = [
  { id: 'PAE20260525001', date: '2026/5/29', company: 'TA01', applicant: '林問宜 (023156)', payeeType: '員工', total: '1,600', urgentDate: '-', reason: '-', status: 'Default' },
  { id: 'PAE20260525002', date: '2026/5/28', company: 'TA01', applicant: '林問宜 (023156)', payeeType: '員工', total: '2,400', urgentDate: '-', reason: '-', status: 'Default' },
  { id: 'PAE20260525003', date: '2026/5/27', company: 'TA01', applicant: '林問宜 (023156)', payeeType: '員工', total: '3,800', urgentDate: '-', reason: '-', status: 'Processing' },
]

const col = createColumnHelper<DraftRow>()

// 單號 column has no `meta.type` → DataTable honours this custom cell (id stacked
// over a status Tag), matching the Figma table-item anatomy.
const COLUMNS = [
  col.accessor('id', {
    header: '單號',
    meta: { width: 184 },
    cell: ({ row }) => (
      <div className="flex flex-col items-start gap-[var(--layout-space-tight)]">
        <span className="text-body text-fg truncate">{row.original.id}</span>
        <Tag color={row.original.status === 'Processing' ? 'blue' : 'neutral'} size="sm">
          {row.original.status === 'Processing' ? '審核中' : '草稿'}
        </Tag>
      </div>
    ),
  }),
  col.accessor('date', { header: '申請日期', meta: { type: 'string', width: 120 } }),
  col.accessor('company', { header: '公司代號', meta: { type: 'string', width: 120 } }),
  col.accessor('applicant', { header: '申請人', meta: { type: 'string', width: 160 } }),
  col.accessor('payeeType', { header: '收款對象', meta: { type: 'string', width: 80 } }),
  col.accessor('total', { header: '總額', meta: { type: 'string', width: 160 } }),
  col.accessor('urgentDate', { header: '緊急/指定付款日期', meta: { type: 'string', width: 160 } }),
  col.accessor('reason', { header: '申請原因', meta: { type: 'string', width: 160 } }),
]

interface HomePageProps {
  onNewApplication: () => void
}

export function HomePage({ onNewApplication }: HomePageProps) {
  return (
    <AppLayout activeMenu="暫存申請單">
      <div className="flex flex-col h-full">
        {/* Page header + DS Tabs */}
        <div className="bg-surface border-b border-divider px-[var(--layout-space-loose)] pt-[var(--layout-space-loose)]">
          <h1 className="text-h3 font-medium text-fg mb-[var(--layout-space-tight)]">暫存申請單</h1>
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
            <span className="flex-1 text-h4 font-medium text-fg">一般暫存申請</span>
            <Button variant="primary" size="sm" startIcon={Plus} endIcon={ChevronDown} onClick={onNewApplication}>
              新增
            </Button>
            <Separator orientation="vertical" style={{ height: 24 }} />
            <Button variant="secondary" size="sm" startIcon={Download}>
              下載 Excel 範本
            </Button>
          </div>

          {/* Draft list — consumes DataTable primitive */}
          <DataTable
            columns={COLUMNS}
            data={DRAFT_ROWS}
            getRowId={(r) => r.id}
            height="auto"
            autoRowHeight
            rowActions={(row) => (
              <>
                <Button variant="text" size="xs" iconOnly startIcon={Info} aria-label="查看詳情" />
                <Button variant="text" size="xs" iconOnly startIcon={PenLine} aria-label="編輯" onClick={onNewApplication} />
                <Button variant="text" size="xs" iconOnly startIcon={Trash2} aria-label="刪除" />
              </>
            )}
          />
        </div>
      </div>
    </AppLayout>
  )
}
