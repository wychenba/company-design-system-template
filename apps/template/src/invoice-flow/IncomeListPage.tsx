import {
  Button, Tag, Alert,
} from '@qijenchen/design-system'
import { TriangleAlert, CircleCheck } from 'lucide-react'
import { AppLayout } from './AppLayout'
import type { IncomeListDetail } from './IncomeListDetailPage'

type FillStatus = 'unfilled' | 'filled'

interface IncomeListRow {
  applicationId: string
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
    applicationId: 'PAE20260525001',
    serialNo: 'PAGE2605250001-1',
    company: 'TA01',
    status: 'unfilled',
    payeeType: '員工',
    payee: '林問宜 (023156)',
    invoiceNo: 'BD28114045',
    currency: 'TWD',
    total: '1,600',
    incomeType: '50',
  },
  {
    applicationId: '',
    serialNo: 'PAGE2605250001-2',
    company: 'TA01',
    status: 'unfilled',
    payeeType: '員工',
    payee: '林問宜 (023156)',
    invoiceNo: 'BD28114045',
    currency: 'TWD',
    total: '1,600',
    incomeType: '50',
  },
  {
    applicationId: 'PAE20260525002',
    serialNo: 'PAGE2605250002-1',
    company: 'TA01',
    status: 'filled',
    payeeType: '員工',
    payee: '林問宜 (023156)',
    invoiceNo: 'BD28114045',
    currency: 'TWD',
    total: '1,600',
    incomeType: '50',
  },
]

const COL_TEMPLATE = '160px 200px 100px 140px 100px 180px 130px 80px 80px 100px'
const HEADERS = ['單號', '流水號', '公司代號', '填寫狀態', '收款對象', '收款人 / 廠商', '發票號碼', '幣別', '總額', '']

const unfilledCount = STUB_ROWS.filter((r) => r.status === 'unfilled').length

interface IncomeListPageProps {
  onOpenDetail?: (detail: IncomeListDetail) => void
}

export function IncomeListPage({ onOpenDetail }: IncomeListPageProps = {}) {
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
    <AppLayout activeMenu="所得人清單">
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
              <div
                style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE }}
                className="bg-surface-raised border-b border-divider"
              >
                {HEADERS.map((h, i) => {
                  const isLast = i === HEADERS.length - 1
                  return (
                    <div
                      key={i}
                      className="p-[var(--layout-space-tight)] text-body text-fg bg-surface-raised"
                      style={isLast ? { position: 'sticky', right: 0, zIndex: 2, boxShadow: '-1px 0 0 0 var(--color-border-divider, #e5e7eb)' } : undefined}
                    >
                      {h}
                    </div>
                  )
                })}
              </div>

              {STUB_ROWS.map((row, rowIdx) => {
                const isLastRow = rowIdx === STUB_ROWS.length - 1
                return (
                  <div
                    key={row.serialNo}
                    style={{ display: 'grid', gridTemplateColumns: COL_TEMPLATE }}
                    className={`group bg-surface hover:bg-surface-raised ${isLastRow ? '' : 'border-b border-divider'}`}
                  >
                    <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                      {row.applicationId}
                    </div>
                    <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                      {row.serialNo}
                    </div>
                    <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 56 }}>
                      {row.company}
                    </div>
                    <div className="flex items-center p-[var(--layout-space-tight)]" style={{ minHeight: 56 }}>
                      {row.status === 'unfilled' ? (
                        <Tag color="yellow" size="sm" icon={TriangleAlert}>尚未填寫</Tag>
                      ) : (
                        <Tag color="green" size="sm" icon={CircleCheck}>填寫完成</Tag>
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
                        minHeight: 56,
                        position: 'sticky',
                        right: 0,
                        zIndex: 1,
                        boxShadow: `-1px 0 0 0 var(--color-border-divider, #e5e7eb)${isLastRow ? '' : ', inset 0 -1px 0 0 var(--color-border-divider, #e5e7eb)'}`,
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
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
