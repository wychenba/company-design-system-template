import { useState } from 'react'
import {
  Button, Alert,
} from '@qijenchen/design-system'
import { TriangleAlert, CircleCheck, ChevronRight, ChevronDown } from 'lucide-react'
import { AppLayout } from './AppLayout'
import type { IncomeListDetail } from './IncomeListDetailPage'

type FillStatus = 'unfilled' | 'filled'

interface IncomeListRow {
  serialNo: string
  company: string
  status: FillStatus
  payeeType: string
  payee: string
  invoiceNo: string
  currency: string
  total: string
  incomeType: string
}

export const STUB_ROWS: IncomeListRow[] = [
  {
    serialNo: 'PAGE2605250001-1',
    company: 'TA01',
    status: 'unfilled',
    payeeType: '廠商',
    payee: '林問宜 (023156)',
    invoiceNo: 'BD28114045',
    currency: 'TWD',
    total: '1,600',
    incomeType: '50',
  },
  {
    serialNo: 'PAGE2605250001-2',
    company: 'TA01',
    status: 'unfilled',
    payeeType: '廠商',
    payee: '林問宜 (023156)',
    invoiceNo: 'BD28114045',
    currency: 'TWD',
    total: '1,600',
    incomeType: '50',
  },
  {
    serialNo: 'PAGE2605250002-1',
    company: 'TA01',
    status: 'filled',
    payeeType: '廠商',
    payee: '林問宜 (023156)',
    invoiceNo: 'BD28114045',
    currency: 'TWD',
    total: '1,600',
    incomeType: '50',
  },
]

function groupKey(serialNo: string) {
  return serialNo.replace(/-\d+$/, '')
}

interface Group {
  key: string
  rows: IncomeListRow[]
}

function buildGroups(rows: IncomeListRow[]): Group[] {
  const map = new Map<string, IncomeListRow[]>()
  for (const r of rows) {
    const k = groupKey(r.serialNo)
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(r)
  }
  return [...map.entries()].map(([key, rows]) => ({ key, rows }))
}

const COL_TEMPLATE = '160px 200px 100px 140px 100px 180px 130px 80px 80px 100px'
const HEADERS = ['單號', '流水號', '公司代號', '填寫狀態', '收款對象', '收款人 / 廠商', '發票號碼', '幣別', '總額', '']

const unfilledCount = STUB_ROWS.filter((r) => r.status === 'unfilled').length

interface IncomeListPageProps {
  onOpenDetail?: (detail: IncomeListDetail) => void
  onNavigate?: (id: string) => void
}

export function IncomeListPage({ onOpenDetail, onNavigate }: IncomeListPageProps = {}) {
  const groups = buildGroups(STUB_ROWS)
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(groups.filter((g) => g.rows.some((r) => r.status === 'unfilled')).map((g) => g.key)))

  function toggle(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function openDetail(row: IncomeListRow) {
    onOpenDetail?.({
      serialNo: row.serialNo,
      company: row.company,
      payeeType: row.payeeType,
      payee: row.payee,
      invoiceNo: row.invoiceNo,
      currency: row.currency,
      total: row.total,
      incomeType: row.incomeType,
    })
  }

  return (
    <AppLayout activeMenu="所得人清單" onNavigate={onNavigate}>
      <div className="flex flex-col h-full">
        <div className="bg-surface border-b border-divider px-[var(--layout-space-loose)] py-[var(--layout-space-loose)]">
          <h1 className="text-h3 font-medium text-fg">所得人清單</h1>
        </div>

        <div className="flex-1 overflow-auto p-[var(--layout-space-loose)] flex flex-col gap-[var(--layout-space-loose)]">
          {unfilledCount > 0 && (
            <Alert
              variant="warning"
              title="所得清單待填寫"
              description={`您尚有 ${unfilledCount} 筆所得人清單待填寫。`}
            />
          )}

          <div className="overflow-x-auto rounded border border-divider bg-surface">
            <div style={{ minWidth: 1200 }}>
              {/* Header */}
              <div
                style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE, minHeight: 48 }}
                className="bg-surface-raised border-b border-divider"
              >
                {HEADERS.map((h, i) => {
                  const isLast = i === HEADERS.length - 1
                  return (
                    <div
                      key={i}
                      className="flex items-center p-[var(--layout-space-tight)] text-body text-fg"
                      style={isLast ? { position: 'sticky', right: 0, zIndex: 2, alignSelf: 'stretch', backgroundColor: 'var(--color-surface-raised, #f5f5f5)', boxShadow: '-1px 0 0 0 var(--color-border-divider, #e5e7eb), inset 0 -1px 0 0 var(--color-border-divider, #e5e7eb)' } : undefined}
                    >
                      {h}
                    </div>
                  )
                })}
              </div>

              {groups.map((group, gIdx) => {
                const isOpen = expanded.has(group.key)
                const isLastGroup = gIdx === groups.length - 1
                return (
                  <div key={group.key}>
                    {/* Group parent row */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => toggle(group.key)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(group.key) } }}
                      style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE, isolation: 'isolate', cursor: 'pointer' }}
                      className={`group bg-surface hover:bg-surface-raised ${isLastGroup && !isOpen ? '' : 'border-b border-divider'}`}
                    >
                      <div className="flex items-center gap-[4px] p-[var(--layout-space-tight)] text-body text-fg" style={{ gridColumn: '1 / -1', minHeight: 48 }}>
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span>{group.key}</span>
                      </div>
                    </div>

                    {/* Child rows */}
                    {isOpen && group.rows.map((row, rIdx) => {
                      const isLastChild = rIdx === group.rows.length - 1
                      const isLast = isLastGroup && isLastChild
                      return (
                        <div
                          key={row.serialNo}
                          style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE, isolation: 'isolate' }}
                          className={`group bg-surface hover:bg-surface-raised ${isLast ? '' : 'border-b border-divider'}`}
                        >
                          <div className="p-[var(--layout-space-tight)]" style={{ minHeight: 56 }} />
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                            {row.serialNo}
                          </div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                            {row.company}
                          </div>
                          <div className="flex items-center gap-[6px] p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                            {row.status === 'unfilled' ? (
                              <>
                                <TriangleAlert size={16} className="text-warning" />
                                <span>尚未填寫</span>
                              </>
                            ) : (
                              <>
                                <CircleCheck size={16} className="text-success" />
                                <span>填寫完成</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                            {row.payeeType}
                          </div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                            {row.payee}
                          </div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                            {row.invoiceNo}
                          </div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                            {row.currency}
                          </div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                            {row.total}
                          </div>
                          <div
                            className="flex items-center justify-end p-[var(--layout-space-tight)] bg-surface group-hover:bg-surface-raised"
                            style={{
                              position: 'sticky',
                              right: 0,
                              zIndex: 1,
                              alignSelf: 'stretch',
                              boxShadow: `-1px 0 0 0 var(--color-border-divider, #e5e7eb)${isLast ? '' : ', inset 0 -1px 0 0 var(--color-border-divider, #e5e7eb)'}`,
                            }}
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openDetail(row)}
                            >
                              {row.status === 'unfilled' ? '填寫清單' : '編輯清單'}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
