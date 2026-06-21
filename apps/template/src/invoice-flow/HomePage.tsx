import { useState } from 'react'
import {
  Button, Tag, Tabs, TabsList, TabsTrigger, Separator,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@qijenchen/design-system'
import { Plus, Download, Info, PenLine, Trash2, ChevronDown } from 'lucide-react'
import { AppLayout } from './AppLayout'
import { showToast } from './useToast'

type TabId = 'general' | 'bonus' | 'travel'
type DraftStatus = 'Default' | 'Processing'

interface DraftRow {
  id: string
  date: string
  company: string
  applicant: string
  payeeType: string
  total: string
  urgentDate: string
  reason: string
  status: DraftStatus
}

const DRAFT_ROWS: DraftRow[] = [
  { id: 'PAE20260525001', date: '2026/5/29', company: 'TA01', applicant: '林問宜 (023156)', payeeType: '員工', total: '1,600', urgentDate: '-', reason: '-', status: 'Default' },
  { id: 'PAE20260525002', date: '2026/5/28', company: 'TA01', applicant: '林問宜 (023156)', payeeType: '員工', total: '2,400', urgentDate: '-', reason: '-', status: 'Default' },
  { id: 'PAE20260525003', date: '2026/5/27', company: 'TA01', applicant: '林問宜 (023156)', payeeType: '員工', total: '3,800', urgentDate: '-', reason: '-', status: 'Processing' },
]

const COL_TEMPLATE = '180px 110px 100px 160px 100px 90px 160px minmax(140px,1fr) 104px'

const HEADERS = ['單號', '申請日期', '公司代號', '申請人', '收款對象', '總額', '緊急/指定付款日期', '申請原因', '']

interface HomePageProps {
  onNewApplication: () => void
}

export function HomePage({ onNewApplication }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('general')
  const [rows, setRows] = useState<DraftRow[]>(DRAFT_ROWS)

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <AppLayout activeMenu="暫存申請單">
      <div className="flex flex-col h-full">
        {/* Page header + tabs */}
        <div className="bg-surface border-b border-divider px-[var(--layout-space-loose)] pt-[var(--layout-space-loose)]">
          <h1 className="text-h3 font-medium text-fg mb-[var(--layout-space-tight)]">暫存申請單</h1>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
            <TabsList>
              <TabsTrigger value="general">一般</TabsTrigger>
              <TabsTrigger value="bonus">現金獎金</TabsTrigger>
              <TabsTrigger value="travel">國內差旅</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-[var(--layout-space-loose)]">
          {activeTab === 'general' ? (
            <>
              {/* Section header */}
              <div className="flex items-center gap-[var(--layout-space-tight)] mb-[var(--layout-space-loose)]">
                <span className="flex-1 text-h4 font-medium text-fg">一般暫存申請</span>
                <div className="flex items-center" style={{ gap: 1 }}>
                  <Button variant="primary" size="sm" startIcon={Plus} onClick={onNewApplication}>
                    新增
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="primary" size="sm" iconOnly startIcon={ChevronDown} aria-label="展開新增選單" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={onNewApplication}>單筆申請</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => showToast('importPaymentItems')}>Excel 匯入申請</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Separator orientation="vertical" style={{ height: 24 }} />
                <Button variant="tertiary" size="sm" startIcon={Download}>
                  下載 Excel 範本
                </Button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded border border-divider">
                <div style={{ minWidth: 1144 }}>
                  {/* Header */}
                  <div
                    style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE }}
                    className="bg-surface-raised border-b border-divider"
                  >
                    {HEADERS.map((h, i) => (
                      <div key={i} className="p-[var(--layout-space-tight)] text-body text-fg">{h}</div>
                    ))}
                  </div>

                  {/* Rows */}
                  {rows.length === 0 ? (
                    <div className="flex items-center justify-center p-[var(--layout-space-loose)] text-body text-fg-secondary">
                      沒有任何暫存申請單
                    </div>
                  ) : rows.map((row) => (
                    <div
                      key={row.id}
                      style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE }}
                      className="border-b border-divider last:border-b-0 hover:bg-surface-raised"
                    >
                      <div className="flex flex-col items-start justify-center gap-[var(--layout-space-tight)] p-[var(--layout-space-tight)]" style={{ minHeight: 56 }}>
                        <span className="text-body text-fg">{row.id}</span>
                        <Tag color={row.status === 'Processing' ? 'blue' : 'neutral'} size="sm">
                          {row.status === 'Processing' ? '審核中' : '草稿'}
                        </Tag>
                      </div>
                      <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>{row.date}</div>
                      <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>{row.company}</div>
                      <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>{row.applicant}</div>
                      <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>{row.payeeType}</div>
                      <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>{row.total}</div>
                      <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg-secondary" style={{ minHeight: 56 }}>{row.urgentDate}</div>
                      <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg-secondary" style={{ minHeight: 56 }}>{row.reason}</div>
                      <div className="flex items-center justify-center gap-[var(--layout-space-tight)] p-[var(--layout-space-tight)]" style={{ minHeight: 56 }}>
                        <Button variant="text" size="xs" iconOnly startIcon={Info} aria-label="查看詳情" />
                        <Button variant="text" size="xs" iconOnly startIcon={PenLine} aria-label="編輯" onClick={onNewApplication} />
                        <Button variant="text" size="xs" iconOnly startIcon={Trash2} aria-label="刪除" onClick={() => deleteRow(row.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-70 rounded border border-divider text-body text-fg-secondary">
              {activeTab === 'bonus' ? '現金獎金申請請至專區請款' : '國內差旅申請請至專區請款'}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
