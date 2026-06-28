import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button, Field, FieldLabel, Input, Select, Tag, Checkbox, DatePicker,
} from '@qijenchen/design-system'
import { Info } from 'lucide-react'
import type { ReactNode } from 'react'

interface EditInvoiceDialogProps {
  trigger: ReactNode
  payeeType?: 'employee' | 'vendor'
  initialData?: {
    displayId: string
    type: string
    voucherNumber: string
    amount: number
    taxAmount: number
    payee: string
    date: string
  }
  onConfirm?: () => void
}

const VOUCHER_TYPES = [
  { value: 'e-invoice-25', label: '電子統一發票 (25)' },
  { value: 'paper-invoice', label: '紙本統一發票' },
  { value: 'receipt-26', label: '統一發票收據 (26)' },
  { value: 'deferred-26', label: '統一發票後補 (26)' },
  { value: 'acknowledgment-26', label: '茲收到 (26)' },
  { value: 'domestic-26', label: '國內廠商收據 (26)' },
  { value: 'foreign-26', label: '國外廠商收據 (26)' },
  { value: 'handler-26', label: '經手人證明 (26)' },
  { value: 'discount-23', label: '折讓單 (23)' },
]

const CURRENCY_OPTIONS = [
  { value: 'TWD', label: 'TWD' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'JPY', label: 'JPY' },
]

const TAX_EXEMPT_OPTIONS = [
  { value: 'yes', label: '是' },
  { value: 'no', label: '否' },
]

function InfoIcon({ tip }: { tip?: string }) {
  return (
    <span title={tip} className="inline-flex items-center">
      <Info size={14} className="text-fg-secondary shrink-0 cursor-default" aria-label={tip} />
    </span>
  )
}

export function EditInvoiceDialog({ trigger, payeeType = 'employee', initialData, onConfirm }: EditInvoiceDialogProps) {
  const initialVoucherType = VOUCHER_TYPES.find((o) => o.label === initialData?.type)?.value ?? 'e-invoice-25'
  const [open, setOpen] = useState(false)
  const [voucherType, setVoucherType] = useState(initialVoucherType)
  const [currency, setCurrency] = useState('TWD')
  const [invoiceDate, setInvoiceDate] = useState(initialData?.date ?? '')
  const [usePartial, setUsePartial] = useState(false)
  const [pretaxAmount, setPretaxAmount] = useState(initialData ? String(initialData.amount) : '')
  const [taxAmount2, setTaxAmount2] = useState(initialData ? String(initialData.taxAmount) : '')

  const isEmployee = payeeType === 'employee'

  const exchangeRate = currency === 'TWD' ? 1 : currency === 'USD' ? 32.5 : currency === 'EUR' ? 35.2 : currency === 'JPY' ? 0.22 : 1
  const exchangeRateUpdated = '2026/06/20 09:00'
  const afterTaxAmount = pretaxAmount ? (parseFloat(pretaxAmount) + (parseFloat(taxAmount2) || 0)) : null
  const localAfterTax = afterTaxAmount != null ? (afterTaxAmount * exchangeRate) : null

  function handleConfirm() {
    onConfirm?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={720} autoHeight>
        <DialogHeader>
          <DialogTitle>編輯發票</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-[var(--layout-space-loose)]">

            {/* Info bar */}
            <div className="flex border border-divider rounded bg-surface-raised px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] gap-[var(--layout-space-loose)]">
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-caption text-fg-secondary">請款單號</span>
                <span className="text-body font-medium text-fg">{initialData?.displayId ?? 'PAGE2605250001-1'}</span>
              </div>
              <div className="w-px self-stretch bg-divider shrink-0" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-caption text-fg-secondary">狀態</span>
                <Tag color="neutral" size="sm">Draft</Tag>
              </div>
            </div>

            {/* 收款人/廠商 */}
            <Field>
              <FieldLabel required>收款人/廠商</FieldLabel>
              <Input mode="readonly" value={initialData?.payee ?? (isEmployee ? '林問宜 (023156)' : '沈淮民 (Y_123136)')} />
            </Field>

            {/* 憑證類型 */}
            <Field>
              <FieldLabel required>憑證類型</FieldLabel>
              <Select options={VOUCHER_TYPES} value={voucherType} onChange={setVoucherType} placeholder="請選擇" />
            </Field>

            {/* 日期 | 發票號碼 */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>日期</FieldLabel>
                <DatePicker value={invoiceDate} onChange={setInvoiceDate} />
              </Field>
              <Field>
                <FieldLabel>發票號碼</FieldLabel>
                <Input placeholder="填寫發票號碼" defaultValue={initialData?.voucherNumber} />
              </Field>
            </div>

            {/* 幣別 — left half only */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>幣別</FieldLabel>
                <Select options={CURRENCY_OPTIONS} value={currency} onChange={setCurrency} />
              </Field>
              <div />
            </div>

            {/* 合計金額（未稅）| 稅額 */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>合計金額（未稅）</FieldLabel>
                <Input type="number" placeholder="" value={pretaxAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPretaxAmount(e.target.value)} />
              </Field>
              <Field>
                <FieldLabel>稅額&nbsp;<InfoIcon tip="依憑證類型自動計算" /></FieldLabel>
                <Input type="number" placeholder="" value={taxAmount2} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaxAmount2(e.target.value)} />
              </Field>
            </div>

            {/* Summary: 稅後金額 / 匯率 */}
            <div className="flex border border-divider rounded bg-surface-raised px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] gap-[var(--layout-space-loose)]">
              <div className="flex-1 flex flex-col gap-[var(--layout-space-tight)]">
                <span className="text-caption text-fg-secondary">稅後金額</span>
                <span className="text-body font-medium text-fg">
                  {afterTaxAmount != null ? `TWD ${afterTaxAmount.toLocaleString()}` : '-'}
                </span>
                <span className="text-caption text-fg-secondary flex items-center gap-[var(--layout-space-tight)]">
                  實發金額&nbsp;<InfoIcon tip="實際發放金額（扣除代扣稅款後）" />&nbsp;
                  <span>{localAfterTax != null ? `TWD ${localAfterTax.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : '-'}</span>
                </span>
              </div>
              <div className="w-px self-stretch bg-divider shrink-0" />
              <div className="flex-1 flex flex-col gap-[var(--layout-space-tight)]">
                <span className="text-caption text-fg-secondary">匯率</span>
                <span className="text-body font-medium text-fg">{exchangeRate}</span>
                <span className="text-caption text-fg-muted">更新時間 {exchangeRateUpdated}</span>
              </div>
            </div>

            {/* 員工專屬：稅號 + 二代健保 */}
            {isEmployee && (
              <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                <Field>
                  <FieldLabel>稅號&nbsp;<InfoIcon tip="統一編號" /></FieldLabel>
                  <Input placeholder="" />
                </Field>
                <Field>
                  <FieldLabel>二代健保</FieldLabel>
                  <Input mode="readonly" value="0" />
                </Field>
              </div>
            )}

            {/* 廠商專屬欄位 */}
            {!isEmployee && (
              <>
                <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                  <Field>
                    <FieldLabel>所得類型&nbsp;<InfoIcon tip="所得類型代碼" /></FieldLabel>
                    <Input placeholder="" />
                  </Field>
                  <Field>
                    <FieldLabel>免稅額</FieldLabel>
                    <Select options={TAX_EXEMPT_OPTIONS} placeholder="請選擇" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                  <Field>
                    <FieldLabel>代扣金額&nbsp;<InfoIcon tip="依所得類型計算扣繳金額" /></FieldLabel>
                    <Input mode="readonly" value="" />
                  </Field>
                  <Field>
                    <FieldLabel>二代健保</FieldLabel>
                    <Input mode="readonly" value="" />
                  </Field>
                </div>
              </>
            )}

            {/* 使用不足額請款 */}
            <Checkbox
              checked={usePartial}
              onCheckedChange={(checked) => setUsePartial(checked as boolean)}
              label="使用不足額請款"
            />

          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>關閉</Button>
          <Button variant="primary" onClick={handleConfirm}>更新</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
