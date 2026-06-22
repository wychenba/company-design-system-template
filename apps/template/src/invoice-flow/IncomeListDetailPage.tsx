import { useState } from 'react'
import {
  Button, Checkbox,
} from '@qijenchen/design-system'
import { Plus, ChevronDown, Download, Pencil, Trash2 } from 'lucide-react'
import { AppLayout } from './AppLayout'
import { showToast } from './useToast'

export interface IncomeListDetail {
  serialNo: string
  company: string
  payeeType: string
  payee: string
  invoiceNo: string
  currency: string
  total: string
  incomeType: string
}

interface PayeeRow {
  id: string
  type: string
  resident: string
  name: string
  beneficiaryId: string
  amount: string
  currency: string
  incomeType: string
  taxRate: string
  taxAmount: string
  nhi: string
  nationality: string
  residenceCert: string
  birthDate: string
  address: string
  email: string
  updatedAt: string
}

interface IncomeListDetailPageProps {
  detail: IncomeListDetail
  onBack: () => void
  onNavigate?: (id: string) => void
}

export function IncomeListDetailPage({ detail, onBack, onNavigate }: IncomeListDetailPageProps) {
  const [rows, setRows] = useState<PayeeRow[]>([{
    id: 'P-1',
    type: detail.payeeType || '員工',
    resident: '居住者',
    name: detail.payee.replace(/\s*\([^)]*\)$/, ''),
    beneficiaryId: detail.payee.match(/\(([^)]+)\)/)?.[1] ?? '',
    amount: detail.total,
    currency: detail.currency,
    incomeType: detail.incomeType || '50',
    taxRate: '0',
    taxAmount: '0',
    nhi: '0',
    nationality: 'TW',
    residenceCert: 'F123456789',
    birthDate: '2000/06/18',
    address: '300新竹市東區科園里力行路21號',
    email: 'wenee@gmail.com',
    updatedAt: new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/'),
  }])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function addRow() {
    const id = `P-${rows.length + 1}`
    setRows((prev) => [...prev, {
      id, type: '員工', resident: '居住者', name: '', beneficiaryId: '',
      amount: '', currency: 'TWD', incomeType: '50', taxRate: '0',
      taxAmount: '0', nhi: '0', nationality: 'TW', residenceCert: '',
      birthDate: '', address: '', email: '', updatedAt: '',
    }])
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id))
    showToast('deletePaymentItem')
  }

  return (
    <AppLayout activeMenu="所得人清單" onNavigate={onNavigate}>
      <div className="flex flex-col h-full">
        <div className="bg-surface border-b border-divider px-[var(--layout-space-loose)] py-[var(--layout-space-loose)]">
          <h1 className="text-h3 font-medium text-fg">所得人清單</h1>
        </div>

        <div className="flex-1 overflow-auto p-[var(--layout-space-loose)] flex flex-col gap-[var(--layout-space-loose)]">
          {/* 申請單資訊 */}
          <section className="flex flex-col gap-[var(--layout-space-tight)]">
            <h2 className="text-h4 font-medium text-fg">申請單資訊</h2>
            <div className="bg-surface rounded border border-divider p-[var(--layout-space-loose)] grid grid-cols-4 gap-[var(--layout-space-loose)]">
              <InfoItem label="單號" value={detail.serialNo} />
              <InfoItem label="收款對象" value={detail.payeeType} />
              <InfoItem label="收款人 / 廠商" value={detail.payee} />
              <InfoItem label="發票號碼" value={detail.invoiceNo} />
            </div>
          </section>

          {/* 所得人資訊 */}
          <section className="flex flex-col gap-[var(--layout-space-tight)]">
            <div className="flex items-center justify-between">
              <h2 className="text-h4 font-medium text-fg">所得人資訊</h2>
              <div className="flex items-center gap-[var(--layout-space-tight)]">
                <Button variant="primary" size="sm" startIcon={Plus} endIcon={ChevronDown} onClick={addRow}>
                  新增
                </Button>
                <Button variant="tertiary" size="sm" startIcon={Download} onClick={() => showToast('notImplemented')}>
                  下載 Excel 範本
                </Button>
              </div>
            </div>

            {(() => {
              // Figma column widths: 40+120+160+120+120+80+120+120+120+120+120+120+160+160+120 = 1700px + 88px sticky
              const COLS = '40px 120px 160px 120px 120px 80px 120px 120px 120px 120px 120px 120px 160px 160px 120px 88px'
              const STICKY_SHADOW = (isLast: boolean) =>
                `-1px 0 0 0 var(--color-border-divider, #e5e7eb)${isLast ? '' : ', inset 0 -1px 0 0 var(--color-border-divider, #e5e7eb)'}`
              const stickyHead: React.CSSProperties = { position: 'sticky', right: 0, zIndex: 2, boxShadow: '-1px 0 0 0 var(--color-border-divider, #e5e7eb)' }
              return (
                <div className="overflow-x-auto rounded border border-divider bg-surface">
                  <div style={{ minWidth: 1788 }}>
                    {/* Header */}
                    <div className="bg-surface-raised border-b border-divider grid items-center" style={{ gridTemplateColumns: COLS }}>
                      <div className="p-[var(--layout-space-tight)]" />
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">類型</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">居住者 / 非居住者</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">受益人姓名<br />受益人 ID</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">金額</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">幣別</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">收入類型</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">代扣稅率</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">代扣金額</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">二代健保</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">國籍<br />居留證號</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">出生日期</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">地址</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">E-Mail</div>
                      <div className="p-[var(--layout-space-tight)] text-body text-fg">更新時間</div>
                      <div className="p-[var(--layout-space-tight)] bg-surface-raised" style={stickyHead} />
                    </div>

                    {/* Rows */}
                    {rows.map((row, rowIdx) => {
                      const isLastRow = rowIdx === rows.length - 1
                      return (
                        <div
                          key={row.id}
                          className={`group grid items-start bg-surface hover:bg-surface-raised ${isLastRow ? '' : 'border-b border-divider'}`}
                          style={{ gridTemplateColumns: COLS, minHeight: 72 }}
                        >
                          <div className="flex items-center justify-center p-[var(--layout-space-tight)]" style={{ minHeight: 72 }}>
                            <Checkbox checked={selected.has(row.id)} onCheckedChange={() => toggleSelect(row.id)} />
                          </div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.type}</div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.resident}</div>
                          <div className="flex flex-col justify-center p-[var(--layout-space-tight)] gap-[var(--layout-space-tight)]" style={{ minHeight: 72 }}>
                            <span className="text-body text-fg">{row.name}</span>
                            <span className="text-caption text-fg-secondary">{row.beneficiaryId}</span>
                          </div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.amount}</div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.currency}</div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.incomeType}</div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.taxRate}</div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.taxAmount}</div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.nhi}</div>
                          <div className="flex flex-col justify-center p-[var(--layout-space-tight)] gap-[var(--layout-space-tight)]" style={{ minHeight: 72 }}>
                            <span className="text-body text-fg">{row.nationality}</span>
                            <span className="text-caption text-fg-secondary">{row.residenceCert}</span>
                          </div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.birthDate}</div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.address}</div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.email}</div>
                          <div className="flex items-center p-[var(--layout-space-tight)] text-body text-fg" style={{ minHeight: 72 }}>{row.updatedAt}</div>
                          <div
                            className="flex items-center justify-center gap-[var(--layout-space-tight)] p-[var(--layout-space-tight)] bg-surface group-hover:bg-surface-raised"
                            style={{ position: 'sticky', right: 0, zIndex: 1, minHeight: 72, boxShadow: STICKY_SHADOW(isLastRow) }}
                          >
                            <Button variant="text" size="xs" iconOnly startIcon={Pencil} aria-label="編輯" onClick={() => showToast('notImplemented')} />
                            <Button variant="text" size="xs" iconOnly startIcon={Trash2} aria-label="刪除" onClick={() => deleteRow(row.id)} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </section>
        </div>

        {/* Footer */}
        <div className="bg-surface border-t border-divider px-[var(--layout-space-loose)] py-[var(--layout-space-loose)] flex items-center justify-end gap-[var(--layout-space-tight)]">
          <Button variant="tertiary" onClick={onBack}>取消</Button>
          <Button variant="primary" onClick={() => { showToast('saveDraft'); onBack() }}>儲存</Button>
        </div>
      </div>
    </AppLayout>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[var(--layout-space-tight)]">
      <span className="text-caption text-fg-secondary">{label}</span>
      <span className="text-body font-medium text-fg">{value || '-'}</span>
    </div>
  )
}
