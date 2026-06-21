import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button,
} from '@qijenchen/design-system'
import { ChevronDown, FileText, Plus, GripVertical, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

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
  items: PaymentItem[]
}

interface AttachmentRow {
  id: string
  type: string
  description: string
  fileName: string
}

interface SubmittedDialogProps {
  trigger: ReactNode
  company?: string
  payee?: string
  invoices?: InvoiceRow[]
  attachments?: AttachmentRow[]
  onSubmit?: () => void
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 flex flex-col" style={{ gap: 3 }}>
      <span className="text-caption text-fg-secondary">{label}</span>
      <span className="text-body font-medium text-fg">{value}</span>
    </div>
  )
}

function SectionCard({
  title,
  children,
  defaultOpen = true,
  nonCollapsible = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  nonCollapsible?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-divider rounded-lg bg-surface overflow-hidden flex-shrink-0">
      <div
        className={[
          'flex items-center justify-between px-[var(--layout-space-loose)]',
          nonCollapsible ? '' : 'cursor-pointer hover:bg-surface-raised',
        ].join(' ')}
        style={nonCollapsible
          ? { height: 60 }
          : open
            ? { minHeight: 58, paddingTop: 18, paddingBottom: 18 }
            : { height: 84 }
        }
        onClick={nonCollapsible ? undefined : () => setOpen((v) => !v)}
      >
        <span className="text-h3 font-semibold text-fg">{title}</span>
        {!nonCollapsible && (
          <button
            className="flex items-center bg-transparent border-0 cursor-pointer whitespace-nowrap text-body font-semibold text-fg-secondary"
            style={{ gap: 8 }}
            tabIndex={-1}
          >
            <span>{open ? '收合資訊' : '更多資訊'}</span>
            <ChevronDown
              size={14}
              className="transition-transform duration-200"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        )}
      </div>
      {open && <div className="border-t border-divider">{children}</div>}
    </div>
  )
}

function InvoiceItemRow({ inv }: { inv: InvoiceRow }) {
  const [open, setOpen] = useState(false)

  const LINE_COLS = '44px minmax(200px,1fr) 80px 120px 80px 56px 80px 120px minmax(140px,1fr)'

  return (
    <div className="border border-divider rounded-lg overflow-hidden flex-shrink-0">
      <div
        className="flex items-center cursor-pointer hover:bg-surface-raised"
        style={{ gap: 12, padding: '14px 16px' }}
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronDown
          size={14}
          className="text-fg-secondary transition-transform duration-200 shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-body font-semibold text-fg">{inv.displayId}</span>
            <span className="text-body font-semibold text-fg">TWD {inv.amount.toLocaleString()}</span>
          </div>
          <div className="text-caption text-fg-secondary" style={{ marginTop: 2 }}>
            收款人：{inv.payee}｜日期：{inv.date}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-divider px-[var(--layout-space-loose)] pb-[var(--layout-space-loose)]">
          {/* Meta row */}
          <div className="flex gap-0 py-[var(--layout-space-tight)] border-b border-divider">
            {[
              { label: '憑證類型', value: inv.type || '電子統一發票 (25)' },
              { label: '發票號碼', value: inv.voucherNumber || '-' },
              { label: '合計金額（未稅）', value: `TWD ${inv.amount.toLocaleString()}` },
              { label: '稅額', value: String(inv.taxAmount) },
              { label: '收入類型', value: '50' },
            ].map((cell, i) => (
              <div
                key={i}
                className={`flex-1 flex flex-col ${i > 0 ? 'pl-[var(--layout-space-loose)] border-l border-divider ml-[var(--layout-space-loose)]' : ''}`}
                style={{ gap: 3 }}
              >
                <span className="text-caption text-fg-secondary">{cell.label}</span>
                <span className="text-body font-medium text-fg">{cell.value}</span>
              </div>
            ))}
          </div>

          {/* Line items label */}
          <div className="flex items-center py-[var(--layout-space-tight)] text-caption text-fg-secondary" style={{ gap: 6 }}>
            <FileText size={14} className="text-fg-muted" />
            付款細項：<span className="font-semibold text-fg">{inv.items.length}</span> 項
          </div>

          {/* Line items table */}
          <div className="border border-divider rounded overflow-x-auto">
            <div
              style={{ display: 'grid', gridTemplateColumns: LINE_COLS, minWidth: 900 }}
              className="bg-surface-raised border-b border-divider text-caption text-fg-secondary font-medium"
            >
              {['序號', '分類/子分類', '成本中心', '會計科目', '總額', '稅率', '稅額', '是否提供合約編號', '合約編號/無合約原因'].map((h, i) => (
                <div key={i} className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{h}</div>
              ))}
            </div>
            {inv.items.length === 0 ? (
              <div className="text-caption text-fg-secondary px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">無付款細項</div>
            ) : inv.items.map((item, i) => (
              <div
                key={item.id}
                style={{ display: 'grid', gridTemplateColumns: LINE_COLS, minWidth: 900 }}
                className="border-b border-divider last:border-b-0 text-body text-fg hover:bg-surface-raised"
              >
                <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-fg-secondary">{i + 1}</div>
                <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">
                  <div className="truncate">{item.category}</div>
                  <div className="text-caption text-fg-secondary truncate">{item.subCategory}</div>
                </div>
                <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-fg-secondary">{item.costCenter}</div>
                <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">
                  <div>{item.account}</div>
                  <div className="text-caption text-fg-secondary">{item.accountName}</div>
                </div>
                <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{item.amount.toLocaleString()}</div>
                <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{item.taxRate}</div>
                <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{item.taxAmount}</div>
                <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{item.contractRequired}</div>
                <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-fg-secondary">{item.contractNumber || '-'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const STUB_REVIEWERS = [
  { role: '申請人', owner: '150986 陳文憶', date: '2025/7/10', draggable: false, deletable: false },
  { role: '主管', owner: '109964 洪挺鈞', date: '2025/7/12', draggable: true, deletable: true },
  { role: '會計', owner: '060069 黃蓉芬', date: '2025/7/16', draggable: false, deletable: false },
]

const REVIEWER_COLS = '32px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 40px'

export function SubmittedDialog({
  trigger,
  company = 'TA01',
  payee = '林問宜 (023156)',
  invoices = [],
  attachments = [],
  onSubmit,
}: SubmittedDialogProps) {
  const [open, setOpen] = useState(false)
  const [remark, setRemark] = useState('')

  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'numeric', day: 'numeric' })

  function handleSubmit() {
    onSubmit?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={960}>
        <DialogHeader>
          <DialogTitle>申請單預覽</DialogTitle>
        </DialogHeader>

        <DialogBody className="bg-surface-raised">
          <div className="flex flex-col gap-[var(--layout-space-loose)]">

            {/* ① 基本資訊 */}
            <SectionCard title="基本資訊" defaultOpen={false}>
              <div className="flex gap-0 px-[var(--layout-space-loose)] py-[var(--layout-space-loose)]">
                <InfoCell label="公司代碼" value={company} />
                <div className="w-px self-stretch bg-divider shrink-0 mx-[var(--layout-space-loose)]" />
                <InfoCell label="申請人" value={payee} />
                <div className="w-px self-stretch bg-divider shrink-0 mx-[var(--layout-space-loose)]" />
                <InfoCell label="申請日期" value={today} />
                <div className="w-px self-stretch bg-divider shrink-0 mx-[var(--layout-space-loose)]" />
                <InfoCell label="申請類型" value="PettyCash" />
              </div>
            </SectionCard>

            {/* ② 請款資訊 */}
            <SectionCard title="請款資訊" defaultOpen={false}>
              <div className="flex flex-col gap-[var(--layout-space-tight)] p-[var(--layout-space-tight)]">
                {invoices.length === 0 ? (
                  <div className="text-body text-fg-secondary px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">無請款資訊</div>
                ) : invoices.map((inv) => (
                  <InvoiceItemRow key={inv.id} inv={inv} />
                ))}
              </div>
            </SectionCard>

            {/* ③ 憑證附件資訊 */}
            <SectionCard title="憑證附件資訊" defaultOpen={false}>
              <div className="m-[var(--layout-space-tight)] border border-divider rounded overflow-hidden">
                <div
                  className="grid bg-surface-raised border-b border-divider text-caption text-fg-secondary font-medium"
                  style={{ gridTemplateColumns: '120px 1fr 200px' }}
                >
                  <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">類型</div>
                  <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">描述</div>
                  <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">附件</div>
                </div>
                {attachments.length === 0 ? (
                  <div className="text-body text-fg-secondary px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">無附件</div>
                ) : attachments.map((att) => (
                  <div
                    key={att.id}
                    className="grid border-b border-divider last:border-b-0 hover:bg-surface-raised text-body text-fg"
                    style={{ gridTemplateColumns: '120px 1fr 200px' }}
                  >
                    <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{att.type}</div>
                    <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-fg-secondary">{att.description || '-'}</div>
                    <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">
                      <span className="flex items-center text-primary" style={{ gap: 4 }}>
                        <FileText size={12} />
                        {att.fileName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ④ 審核流程 */}
            <SectionCard title="審核流程">
              <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-loose)]">
                <div className="flex items-center justify-between mb-[var(--layout-space-tight)]">
                  <span className="text-body text-fg">您可以依照需求新增審核人員。</span>
                  <Button variant="tertiary" size="sm" startIcon={Plus}>新增審核人員</Button>
                </div>
                <div className="border border-divider rounded overflow-hidden">
                  <div
                    className="grid bg-surface-raised border-b border-divider text-caption text-fg-secondary font-medium"
                    style={{ gridTemplateColumns: REVIEWER_COLS }}
                  >
                    <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]" />
                    {['流程角色', '任務擁有者', '指派', '執行人員', '動作', '評論', '更新日期'].map((h) => (
                      <div key={h} className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{h}</div>
                    ))}
                    <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]" />
                  </div>
                  {STUB_REVIEWERS.map((r, i) => (
                    <div
                      key={i}
                      className="grid border-b border-divider last:border-b-0 text-body text-fg hover:bg-surface-raised items-center"
                      style={{ gridTemplateColumns: REVIEWER_COLS }}
                    >
                      <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-fg-muted">
                        {r.draggable && <GripVertical size={14} />}
                      </div>
                      <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{r.role}</div>
                      <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{r.owner}</div>
                      <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-fg-muted">-</div>
                      <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-fg-muted">-</div>
                      <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-fg-muted">-</div>
                      <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-fg-muted">-</div>
                      <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">{r.date}</div>
                      <div className="px-[var(--layout-space-tight)] py-[var(--layout-space-tight)]">
                        {r.deletable && (
                          <button
                            className="border border-divider rounded bg-surface flex items-center justify-center text-fg-secondary hover:bg-surface-raised cursor-pointer"
                            style={{ width: 28, height: 28 }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* ⑤ 簽核補充說明 */}
            <SectionCard title="簽核補充說明" nonCollapsible>
              <div className="px-[var(--layout-space-loose)] pb-[var(--layout-space-tight)]">
                <p className="text-body text-fg mb-[var(--layout-space-tight)]">您可以填寫簽核補充說明，協助下一階段簽核人員快速完成審核</p>
                <textarea
                  className="w-full border border-divider rounded px-[var(--layout-space-tight)] py-[var(--layout-space-tight)] text-body text-fg bg-surface resize-none focus:outline-none"
                  style={{ height: 64 }}
                  placeholder="請填寫補充說明"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
            </SectionCard>

          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>上一步</Button>
          <Button variant="primary" onClick={handleSubmit}>送出</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
