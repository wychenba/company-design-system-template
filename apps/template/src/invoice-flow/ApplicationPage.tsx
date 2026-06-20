import { useState } from 'react'
import {
  Button, Field, FieldLabel, Input, Select, Textarea, Alert, Checkbox,
} from '@qijenchen/design-system'
import { Plus, ArrowUpFromLine, Calendar, Pencil, Copy, Trash2, ChevronDown, ChevronUp, AlignLeft, Paperclip } from 'lucide-react'
import { AppLayout } from './AppLayout'
import { AddInvoiceDialog } from './AddInvoiceDialog'
import { EditInvoiceDialog } from './EditInvoiceDialog'
import { DeleteInvoiceDialog } from './DeleteInvoiceDialog'
import { EditAttachmentDialog } from './EditAttachmentDialog'
import { AddPaymentItemDialog } from './AddPaymentItemDialog'
import { AddAttachmentDialog, type NewAttachment } from './AddAttachmentDialog'
import { SubmittedDialog } from './SubmittedDialog'

interface ApplicationPageProps {
  onBack: () => void
}

const PAYEE_OPTIONS = [
  { value: 'employee', label: '員工' },
  { value: 'vendor', label: '廠商' },
]

const COMPANY_OPTIONS = [
  { value: 'TA01', label: 'TA01' },
]

interface PaymentItem {
  id: string
  category: string
  subCategory: string
  costCenter: string
  account: string
  accountName: string
  amount: number
  taxRate: number
  taxAmount: number
  contractRequired: string
  contractNumber: string
}

interface InvoiceRow {
  id: string
  displayId: string
  type: string
  voucherNumber: string
  amount: number
  taxAmount: number
  payee: string
  date: string
  expanded: boolean
  items: PaymentItem[]
}

interface AttachmentRow {
  id: string
  type: string
  description: string
  fileName: string
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-lg px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] flex flex-col gap-[var(--layout-space-tight)]">
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-h4 font-medium text-fg">{children}</h2>
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-divider rounded flex items-center justify-center py-[var(--layout-space-loose)]">
      <p className="text-body text-fg-secondary">{text}</p>
    </div>
  )
}

// line-items table: 序號/分類子分類/成本中心/會計科目/總額/稅率/稅額/是否提供合約編號/合約編號/actions
const LINE_ITEM_COLS = '40px minmax(160px,1fr) 88px 128px 72px 56px 56px 100px minmax(120px,1fr) 72px'
const ATTACH_COLS = '160px 1fr 240px 80px'

function LineItemsTable({ items, onDelete }: { items: PaymentItem[]; onDelete: (id: string) => void }) {
  return (
    <div className="border border-divider rounded overflow-hidden bg-surface">
      <div className="overflow-x-auto">
        <div style={{ display: 'grid', gridTemplateColumns: LINE_ITEM_COLS, minWidth: 900 }}
          className="bg-surface-raised border-b border-divider text-caption text-fg-secondary font-medium">
          {['序號','分類/子分類','成本中心','會計科目','總額','稅率','稅額','是否提供合約編號','合約編號/無合約原因',''].map((h, i) => (
            <div key={i} className={`p-[var(--layout-space-tight)] ${i >= 4 && i <= 6 ? 'text-right' : ''}`}>{h}</div>
          ))}
        </div>
        {items.map((item, i) => (
          <div key={item.id}
            style={{ display: 'grid', gridTemplateColumns: LINE_ITEM_COLS, minWidth: 900 }}
            className="border-b border-divider last:border-b-0 text-body text-fg hover:bg-surface-raised">
            <div className="p-[var(--layout-space-tight)] flex items-center justify-center text-fg-secondary">{i + 1}</div>
            <div className="p-[var(--layout-space-tight)] flex items-center overflow-hidden">
              <div className="min-w-0">
                <div className="text-body truncate">{item.category}</div>
                <div className="text-caption text-fg-secondary truncate">{item.subCategory}</div>
              </div>
            </div>
            <div className="p-[var(--layout-space-tight)] flex items-center text-fg-secondary">{item.costCenter}</div>
            <div className="p-[var(--layout-space-tight)] flex items-center overflow-hidden">
              <div className="min-w-0">
                <div className="text-body truncate">{item.account}</div>
                <div className="text-caption text-fg-secondary truncate">{item.accountName}</div>
              </div>
            </div>
            <div className="p-[var(--layout-space-tight)] flex items-center justify-end font-medium">{item.amount.toLocaleString()}</div>
            <div className="p-[var(--layout-space-tight)] flex items-center justify-end">{item.taxRate}</div>
            <div className="p-[var(--layout-space-tight)] flex items-center justify-end">{item.taxAmount}</div>
            <div className="p-[var(--layout-space-tight)] flex items-center">{item.contractRequired}</div>
            <div className="p-[var(--layout-space-tight)] flex items-center text-fg-secondary">{item.contractNumber || '-'}</div>
            <div className="p-[var(--layout-space-tight)] flex items-center justify-center gap-[var(--layout-space-tight)]">
              <Button variant="text" size="sm" iconOnly startIcon={Pencil} aria-label="編輯" />
              <Button variant="text" size="sm" iconOnly startIcon={Trash2} aria-label="刪除" onClick={() => onDelete(item.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AttachmentTable({ attachments, onEdit, onDelete }: {
  attachments: AttachmentRow[]
  onEdit: (id: string, updated: { type: string; description: string; fileName: string }) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="border border-divider rounded overflow-hidden bg-surface overflow-x-auto">
      <div style={{ display: 'grid', gridTemplateColumns: ATTACH_COLS, minWidth: 680 }}
        className="bg-surface-raised border-b border-divider text-caption text-fg-secondary font-medium">
        {['類型','描述','附件',''].map((h, i) => (
          <div key={i} className="p-[var(--layout-space-tight)]">{h}</div>
        ))}
      </div>
      {attachments.map((att) => (
        <div key={att.id}
          style={{ display: 'grid', gridTemplateColumns: ATTACH_COLS, minWidth: 680 }}
          className="border-b border-divider last:border-b-0 hover:bg-surface-raised">
          <div className="p-[var(--layout-space-tight)] flex items-center text-body text-fg">{att.type}</div>
          <div className="p-[var(--layout-space-tight)] flex items-center text-body text-fg-secondary">{att.description || '-'}</div>
          <div className="p-[var(--layout-space-tight)] flex items-center">
            <span className="inline-flex items-center gap-[var(--layout-space-tight)] text-primary text-body truncate cursor-pointer hover:underline">
              <Paperclip size={14} className="shrink-0" />
              <span className="truncate">{att.fileName}</span>
            </span>
          </div>
          <div className="p-[var(--layout-space-tight)] flex items-center gap-[var(--layout-space-tight)]">
            <EditAttachmentDialog
              trigger={<Button variant="text" size="sm" iconOnly startIcon={Pencil} aria-label="編輯" />}
              initialType={att.type}
              initialDescription={att.description}
              initialFileName={att.fileName}
              onConfirm={(updated) => onEdit(att.id, updated)}
            />
            <Button variant="text" size="sm" iconOnly startIcon={Trash2} aria-label="刪除" onClick={() => onDelete(att.id)} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ApplicationPage({ onBack }: ApplicationPageProps) {
  const [company, setCompany] = useState('TA01')
  const [payeeType, setPayeeType] = useState('employee')
  const [showNotice, setShowNotice] = useState(true)
  const [useUrgent, setUseUrgent] = useState(false)
  const [invoices, setInvoices] = useState<InvoiceRow[]>([])
  const [attachments, setAttachments] = useState<AttachmentRow[]>([])

  function addInvoice() {
    const n = invoices.length + 1
    setInvoices((prev) => [
      ...prev,
      {
        id: `INV-${n}`,
        displayId: `PAGE2605250001-${n}`,
        type: '電子統一發票 (25)',
        voucherNumber: '',
        amount: 0,
        taxAmount: 0,
        payee: '林問宜 (023156)',
        date: '2026/06/19',
        expanded: false,
        items: [],
      },
    ])
  }

  function toggleExpand(id: string) {
    setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, expanded: !inv.expanded } : inv))
  }

  function deleteInvoice(id: string) {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }

  function addPaymentItem(invoiceId: string) {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? {
              ...inv,
              items: [
                ...inv.items,
                {
                  id: `${invoiceId}-ITEM-${inv.items.length + 1}`,
                  category: '小型工具/物品、電腦/手機週邊',
                  subCategory: '電子標準化軟體',
                  costCenter: '00690',
                  account: '613000',
                  accountName: '會議相關費用',
                  amount: 1000,
                  taxRate: 0,
                  taxAmount: 0,
                  contractRequired: '無須提供',
                  contractNumber: '',
                },
              ],
            }
          : inv,
      ),
    )
  }

  function deletePaymentItem(invoiceId: string, itemId: string) {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, items: inv.items.filter((it) => it.id !== itemId) } : inv,
      ),
    )
  }

  function editAttachment(id: string, updated: { type: string; description: string; fileName: string }) {
    setAttachments((prev) => prev.map((a) => a.id === id ? { ...a, ...updated } : a))
  }

  function addAttachment(newOnes: NewAttachment[]) {
    setAttachments((prev) => [
      ...prev,
      ...newOnes.map((a, i) => ({
        id: `ATT-${prev.length + i + 1}`,
        type: a.type,
        description: a.description,
        fileName: a.name,
      })),
    ])
  }

  const hasInvoices = invoices.length > 0

  return (
    <AppLayout activeMenu="暫存申請單">
      <div className="flex flex-col h-full">

        {/* Page header */}
        <div className="bg-surface border-b border-divider px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
          <div className="flex items-center gap-[var(--layout-space-tight)] mb-[var(--layout-space-tight)]">
            <button onClick={onBack} className="text-body text-fg-secondary hover:text-fg transition-colors">
              暫存申請單
            </button>
            <span className="text-body text-fg-secondary">/</span>
          </div>
          <div className="flex items-center gap-[var(--layout-space-loose)]">
            <h1 className="text-h3 font-medium text-fg flex-1">一般項目申請單</h1>
            <Button variant="tertiary" size="sm" startIcon={ArrowUpFromLine}>批次匯入申請</Button>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-auto bg-surface-sunken p-[var(--layout-space-loose)]">
          <div className="w-full max-w-[960px] mx-auto flex flex-col gap-[var(--layout-space-loose)]">

            {/* 付款資訊 */}
            <Card>
              <CardTitle>付款資訊</CardTitle>
              <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                <Field>
                  <FieldLabel>公司代號</FieldLabel>
                  <Select options={COMPANY_OPTIONS} value={company} onChange={setCompany} />
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
                  <Select options={PAYEE_OPTIONS} value={payeeType} onChange={setPayeeType} />
                </Field>
              </div>
              <Field>
                <FieldLabel required>申請原因</FieldLabel>
                <Textarea placeholder="填寫申請原因，最多 250 字" rows={4} maxLength={250} />
              </Field>
            </Card>

            {/* ── State 0: 無發票 — 請款資訊 + 檢附憑證/證明 同一 card ── */}
            {!hasInvoices && (
              <Card>
                <div className="flex flex-col gap-[var(--layout-space-tight)]">
                  <CardTitle>請款資訊</CardTitle>
                  <div>
                    <AddInvoiceDialog
                      trigger={<Button variant="tertiary" size="sm" startIcon={Plus}>新增請款</Button>}
                      payeeType={payeeType === 'employee' ? 'employee' : 'vendor'}
                      onConfirm={addInvoice}
                    />
                  </div>
                  <EmptyState text="沒有任何資料" />
                </div>

                <div className="flex flex-col gap-[var(--layout-space-tight)] mt-[var(--layout-space-tight)]">
                  <CardTitle>檢附憑證 / 證明</CardTitle>
                  <div>
                    <AddAttachmentDialog
                      trigger={<Button variant="tertiary" size="sm" startIcon={Plus}>新增附件</Button>}
                      onConfirm={addAttachment}
                    />
                  </div>
                  {attachments.length === 0 ? (
                    <EmptyState text="沒有任何資料" />
                  ) : (
                    <AttachmentTable
                      attachments={attachments}
                      onEdit={editAttachment}
                      onDelete={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
                    />
                  )}
                </div>
              </Card>
            )}

            {/* ── State 1+: 有發票 — 各自獨立 card ── */}
            {hasInvoices && (
              <>
                {/* 請款資訊 card */}
                <Card>
                  <CardTitle>請款資訊</CardTitle>
                  <div>
                    <AddInvoiceDialog
                      trigger={<Button variant="tertiary" size="sm" startIcon={Plus}>新增請款</Button>}
                      payeeType={payeeType === 'employee' ? 'employee' : 'vendor'}
                      onConfirm={addInvoice}
                    />
                  </div>

                  {invoices.map((inv) => (
                    <div key={inv.id} className="border border-divider rounded overflow-hidden bg-surface">
                      {/* Invoice card header */}
                      <div className="flex items-center gap-[var(--layout-space-tight)] px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">
                        <button
                          onClick={() => toggleExpand(inv.id)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-raised text-fg-secondary shrink-0"
                          aria-label={inv.expanded ? '收合' : '展開'}
                        >
                          {inv.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-[var(--layout-space-loose)]">
                            <span className="text-body font-medium text-fg">{inv.displayId}</span>
                            <span className="text-body font-medium text-fg shrink-0">TWD {inv.amount.toLocaleString()}</span>
                          </div>
                          <div className="text-caption text-fg-secondary">
                            收款人：{inv.payee}｜日期：{inv.date}
                          </div>
                        </div>
                        <div className="flex items-center gap-[var(--layout-space-tight)] shrink-0">
                          <EditInvoiceDialog
                            trigger={<Button variant="tertiary" size="sm" iconOnly startIcon={Pencil} aria-label="編輯" />}
                            payeeType={payeeType === 'employee' ? 'employee' : 'vendor'}
                            initialData={inv}
                          />
                          <AddInvoiceDialog
                            trigger={<Button variant="tertiary" size="sm" iconOnly startIcon={Copy} aria-label="複製" />}
                            payeeType={payeeType === 'employee' ? 'employee' : 'vendor'}
                            onConfirm={addInvoice}
                          />
                          <DeleteInvoiceDialog
                            trigger={<Button variant="tertiary" size="sm" iconOnly startIcon={Trash2} aria-label="刪除" />}
                            displayId={inv.displayId}
                            onConfirm={() => deleteInvoice(inv.id)}
                          />
                        </div>
                      </div>

                      {/* Expanded body */}
                      {inv.expanded && (
                        <div className="border-t border-divider">
                          {/* Invoice details row */}
                          <div className="flex gap-0 px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] border-b border-divider">
                            {[
                              { label: '憑證類型', value: inv.type || '電子統一發票 (25)' },
                              { label: '發票號碼', value: inv.voucherNumber || '—' },
                              { label: '合計金額（未稅）', value: `TWD ${inv.amount.toLocaleString()}` },
                              { label: '稅額', value: String(inv.taxAmount) },
                            ].map((col, i, arr) => (
                              <div key={col.label}
                                className={`flex-1 flex flex-col gap-[var(--layout-space-tight)] pr-[var(--layout-space-tight)] ${i < arr.length - 1 ? 'border-r border-divider mr-[var(--layout-space-tight)]' : ''}`}>
                                <div className="text-caption text-fg-secondary">{col.label}</div>
                                <div className="text-body text-fg">{col.value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Line items section */}
                          <div className="bg-surface-sunken p-[var(--layout-space-tight)]">
                            <div className="flex items-center gap-[var(--layout-space-tight)] mb-[var(--layout-space-tight)]">
                              <div className="flex items-center gap-[var(--layout-space-tight)] text-body font-medium text-fg">
                                <AlignLeft size={16} className="text-fg-secondary shrink-0" />
                                付款細項：{inv.items.length} 項
                              </div>
                            </div>
                            <div className="flex items-center gap-[var(--layout-space-tight)] mb-[var(--layout-space-tight)]">
                              <Button variant="tertiary" size="sm">批次匯入</Button>
                              <AddPaymentItemDialog
                                trigger={<Button variant="tertiary" size="sm" startIcon={Plus}>新增細項</Button>}
                                onConfirm={() => addPaymentItem(inv.id)}
                              />
                            </div>
                            {inv.items.length === 0 ? (
                              <EmptyState text="沒有任何資料" />
                            ) : (
                              <LineItemsTable
                                items={inv.items}
                                onDelete={(itemId) => deletePaymentItem(inv.id, itemId)}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </Card>

                {/* 檢附憑證 / 證明 card */}
                <Card>
                  <CardTitle>檢附憑證 / 證明</CardTitle>
                  <div>
                    <AddAttachmentDialog
                      trigger={<Button variant="tertiary" size="sm" startIcon={Plus}>新增附件</Button>}
                      onConfirm={addAttachment}
                    />
                  </div>
                  {attachments.length === 0 ? (
                    <EmptyState text="沒有任何資料" />
                  ) : (
                    <AttachmentTable
                      attachments={attachments}
                      onEdit={editAttachment}
                      onDelete={(id) => setAttachments((prev) => prev.filter((a) => a.id !== id))}
                    />
                  )}
                </Card>
              </>
            )}

            {/* 補充資訊 */}
            <Card>
              <CardTitle>補充資訊</CardTitle>
              {showNotice && (
                <Alert
                  variant="info"
                  title="注意事項"
                  description={
                    <div className="flex flex-col gap-[var(--layout-space-tight)]">
                      <p>預計付款日為申請單審核完畢後的下個月一般付款日（每月最後工作日），若有緊急付款需求，請參考下列簽核層級：</p>
                      <ul className="list-disc pl-[var(--layout-space-loose)] flex flex-col gap-[var(--layout-space-tight)]">
                        <li>一般付款日：100,000 TWD 以下簽核至處長，以上簽核至副總。</li>
                        <li>特殊付款日：一律簽核至副總。</li>
                      </ul>
                    </div>
                  }
                  onDismiss={() => setShowNotice(false)}
                />
              )}
              <Checkbox
                checked={useUrgent}
                onCheckedChange={(checked) => setUseUrgent(checked as boolean)}
                label="使用緊急/指定付款"
              />
              <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                <Field>
                  <FieldLabel>緊急/指定付款日</FieldLabel>
                  <Input
                    disabled={!useUrgent}
                    placeholder="請選擇"
                    endAction={{ icon: Calendar, label: '選擇日期', onClick: () => {} }}
                  />
                </Field>
                <div />
              </div>
            </Card>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-surface border-t border-divider flex items-center justify-end gap-[var(--layout-space-tight)] px-[var(--layout-space-loose)] py-[var(--layout-space-loose)]">
          <Button variant="secondary" danger size="sm" onClick={onBack}>取消申請</Button>
          <Button variant="tertiary" size="sm">存成草稿</Button>
          <SubmittedDialog
            trigger={<Button variant="primary" size="sm">送出預覽</Button>}
          />
        </div>

      </div>
    </AppLayout>
  )
}
