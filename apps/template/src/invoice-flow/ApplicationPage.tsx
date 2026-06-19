import { useState } from 'react'
import {
  Button, Field, FieldLabel, Input, Select, Textarea, Alert,
} from '@qijenchen/design-system'
import { ArrowLeft, Plus } from 'lucide-react'
import { AppLayout } from './AppLayout'
import { AddInvoiceDialog } from './AddInvoiceDialog'
import { AddPaymentItemDialog } from './AddPaymentItemDialog'
import { AddAttachmentDialog } from './AddAttachmentDialog'

interface ApplicationPageProps {
  onBack: () => void
}

const PAYEE_OPTIONS = [
  { value: 'employee', label: '員工' },
  { value: 'vendor', label: '廠商' },
]

interface InvoiceRow {
  id: string
  type: string
  date: string
  amount: string
}

interface AttachmentRow {
  id: string
  type: string
  name: string
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-divider rounded flex items-center justify-center py-[var(--layout-space-loose)]">
      <p className="text-body text-fg-secondary">{text}</p>
    </div>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-lg p-[var(--layout-space-loose)] flex flex-col gap-[var(--layout-space-loose)]">
      <h2 className="text-body-lg font-medium text-fg">{title}</h2>
      {children}
    </div>
  )
}

export function ApplicationPage({ onBack }: ApplicationPageProps) {
  const [payeeType, setPayeeType] = useState('employee')
  const [showNotice, setShowNotice] = useState(true)
  const [useUrgent, setUseUrgent] = useState(false)
  const [invoices, setInvoices] = useState<InvoiceRow[]>([])
  const [attachments, setAttachments] = useState<AttachmentRow[]>([])

  function addInvoice() {
    setInvoices((prev) => [
      ...prev,
      { id: `INV-${prev.length + 1}`, type: '電子統一發票', date: '2026/06/19', amount: '1,000' },
    ])
  }

  function addAttachment() {
    setAttachments((prev) => [
      ...prev,
      { id: `ATT-${prev.length + 1}`, type: '發票', name: `附件_${prev.length + 1}.pdf` },
    ])
  }

  return (
    <AppLayout activeMenu="暫存申請單">
      <div className="flex flex-col h-full">
        {/* Breadcrumb + title row */}
        <div className="bg-surface border-b border-divider px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
          <div className="flex items-center gap-[var(--layout-space-tight)] mb-[var(--layout-space-tight)]">
            <button onClick={onBack} className="text-body text-fg-secondary hover:text-fg flex items-center gap-[var(--layout-space-tight)] transition-colors">
              <ArrowLeft size={16} />
              暫存申請單
            </button>
            <span className="text-body text-fg-secondary">/</span>
          </div>
          <div className="flex items-center gap-[var(--layout-space-loose)]">
            <h1 className="text-h4 font-medium text-fg flex-1">一般項目申請單</h1>
            <Button variant="tertiary" size="sm">批次匯入申請</Button>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-auto p-[var(--layout-space-loose)]">
          <div className="max-w-3xl mx-auto flex flex-col gap-[var(--layout-space-loose)]">

            {/* 基本資訊 */}
            <SectionCard title="基本資訊">
              <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                <Field>
                  <FieldLabel>公司代號</FieldLabel>
                  <Input mode="readonly" value="TA01" />
                </Field>
                <div />
              </div>
              <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                <Field>
                  <FieldLabel required>申請人</FieldLabel>
                  <Input mode="readonly" value="林問宜 (023156)" />
                </Field>
                <Field>
                  <FieldLabel required>收款對象</FieldLabel>
                  <Select
                    options={PAYEE_OPTIONS}
                    value={payeeType}
                    onChange={setPayeeType}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel required>申請原因</FieldLabel>
                <Textarea placeholder="填寫申請原因，最多 250 字" rows={4} maxLength={250} />
              </Field>
            </SectionCard>

            {/* 請款資訊 */}
            <SectionCard title="請款資訊">
              <AddInvoiceDialog
                trigger={
                  <Button variant="tertiary" size="sm" startIcon={Plus}>新增請款</Button>
                }
                payeeType={payeeType === 'employee' ? 'employee' : 'vendor'}
                onConfirm={addInvoice}
              />

              {invoices.length === 0 ? (
                <EmptyState text="沒有任何資料" />
              ) : (
                <div className="border border-divider rounded overflow-hidden">
                  <div className="bg-surface-raised flex items-center border-b border-divider text-body text-fg">
                    <div className="flex-1 px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">憑證類型</div>
                    <div className="w-28 px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">日期</div>
                    <div className="w-28 px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">合計金額</div>
                    <div className="w-24" />
                  </div>
                  {invoices.map((inv, i) => (
                    <div key={inv.id} className={`flex items-center ${i > 0 ? 'border-t border-divider' : ''}`}>
                      <div className="flex-1 px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-body text-fg">{inv.type}</div>
                      <div className="w-28 px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-body text-fg">{inv.date}</div>
                      <div className="w-28 px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-body text-fg">{inv.amount}</div>
                      <div className="w-24 flex items-center gap-[var(--layout-space-tight)] px-[var(--layout-space-tight)]">
                        <AddPaymentItemDialog
                          trigger={
                            <Button variant="text" size="sm" iconOnly startIcon={Plus} aria-label="新增付款細項" />
                          }
                        />
                        <Button variant="text" size="sm" aria-label="刪除" onClick={() => setInvoices(prev => prev.filter(r => r.id !== inv.id))}>
                          刪除
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 檢附憑證 / 證明 */}
              <h2 className="text-body-lg font-medium text-fg mt-[var(--layout-space-tight)]">檢附憑證 / 證明</h2>
              <AddAttachmentDialog
                trigger={
                  <Button variant="tertiary" size="sm" startIcon={Plus}>新增附件</Button>
                }
                onConfirm={addAttachment}
              />
              {attachments.length === 0 ? (
                <EmptyState text="沒有任何資料" />
              ) : (
                <div className="flex flex-col gap-[var(--layout-space-tight)]">
                  {attachments.map((att) => (
                    <div key={att.id} className="flex items-center gap-[var(--layout-space-loose)] border border-divider rounded px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
                      <span className="text-body text-fg flex-1">{att.name}</span>
                      <span className="text-caption text-fg-secondary">{att.type}</span>
                      <Button variant="text" size="sm" aria-label="刪除" onClick={() => setAttachments(prev => prev.filter(r => r.id !== att.id))}>
                        刪除
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* 補充資訊 */}
            <SectionCard title="補充資訊">
              {showNotice && (
                <Alert
                  variant="info"
                  title="注意事項"
                  description="預計付款日為申請單簽核完畢後的下個月一般付款日（每月最後工作日），若有緊急付款需求，請參考下列簽核層級：一般付款日：100,000 TWD 以下簽核至處長，以上簽核至副總。特殊付款日：一律簽核至副總。"
                  onDismiss={() => setShowNotice(false)}
                />
              )}

              <label className="flex items-center gap-[var(--layout-space-tight)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={useUrgent}
                  onChange={(e) => setUseUrgent(e.target.checked)}
                  className="rounded border-divider"
                />
                <span className="text-body text-fg">使用緊急/指定付款</span>
              </label>

              <Field>
                <FieldLabel>緊急/指定付款日</FieldLabel>
                <Input type="date" disabled={!useUrgent} placeholder="請選擇" />
              </Field>
            </SectionCard>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-surface border-t border-divider flex items-center justify-end gap-[var(--layout-space-tight)] px-[var(--layout-space-loose)] py-[var(--layout-space-loose)]">
          <Button variant="secondary" danger size="sm" onClick={onBack}>取消申請</Button>
          <Button variant="tertiary" size="sm">存成草稿</Button>
          <Button variant="primary" size="sm">送出預覽</Button>
        </div>
      </div>
    </AppLayout>
  )
}
