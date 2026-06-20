import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button, Field, FieldLabel, Input, Select, Tag, Checkbox, DatePicker,
} from '@qijenchen/design-system'
import { Info } from 'lucide-react'
import type { ReactNode } from 'react'

interface AddInvoiceDialogProps {
  trigger: ReactNode
  payeeType?: 'employee' | 'vendor'
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

export function AddInvoiceDialog({ trigger, payeeType = 'employee', onConfirm }: AddInvoiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [voucherType, setVoucherType] = useState('')
  const [currency, setCurrency] = useState('TWD')
  const [invoiceDate, setInvoiceDate] = useState('')
  const [usePartial, setUsePartial] = useState(false)

  const isEmployee = payeeType === 'employee'

  function handleConfirm() {
    onConfirm?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={720}>
        <DialogHeader>
          <DialogTitle>新增發票</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {/* Info bar */}
          <div className="flex bg-surface-raised rounded px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] mb-[var(--layout-space-loose)] gap-[var(--layout-space-loose)]">
            <div className="flex flex-col flex-1">
              <span className="text-caption text-fg-secondary">請款單號</span>
              <span className="text-body font-medium text-fg">PAGE2605250001-1</span>
            </div>
            <div className="w-px self-stretch bg-divider" />
            <div className="flex flex-col">
              <span className="text-caption text-fg-secondary">狀態</span>
              <Tag color="neutral" size="sm">Draft</Tag>
            </div>
          </div>

          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            {/* 收款人/廠商 */}
            <Field>
              <FieldLabel required>收款人/廠商</FieldLabel>
              <Input mode="readonly" value={isEmployee ? '林問宜 (023156)' : '沈淮民 (Y_123136)'} />
            </Field>

            {/* 憑證類型 */}
            <Field>
              <FieldLabel required>憑證類型</FieldLabel>
              <Select
                options={VOUCHER_TYPES}
                value={voucherType}
                onChange={setVoucherType}
                placeholder="請選擇"
              />
            </Field>

            {/* 日期 | 發票號碼 */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>日期</FieldLabel>
                <DatePicker value={invoiceDate} onChange={setInvoiceDate} />
              </Field>
              <Field>
                <FieldLabel>發票號碼</FieldLabel>
                <Input placeholder="填寫發票號碼" />
              </Field>
            </div>

            {/* 幣別 — left half only */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>幣別</FieldLabel>
                <Select
                  options={CURRENCY_OPTIONS}
                  value={currency}
                  onChange={setCurrency}
                />
              </Field>
              <div />
            </div>

            {/* 合計金額（未稅） | 稅額 */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>合計金額（未稅）</FieldLabel>
                <Input type="number" placeholder="0" />
              </Field>
              <Field>
                <FieldLabel>稅額&nbsp;<InfoIcon tip="依憑證類型自動計算" /></FieldLabel>
                <Input type="number" placeholder="0" />
              </Field>
            </div>

            {/* 稅後金額 / 匯率 panel */}
            <div className="flex gap-[var(--layout-space-loose)] bg-surface-raised rounded px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
              {/* gap-[var(--layout-space-tight)] for stacked label/value rows within summary panel */}
              <div className="flex-1 flex flex-col gap-[var(--layout-space-tight)]">
                <div className="text-caption text-fg-secondary">稅後金額</div>
                <div className="text-body font-medium text-fg">-</div>
                {/* @layout-space-magic-ok: inline icon+text row — 4px is icon-text gap, not consumer layout spacing */}
                <div className="text-caption text-fg-secondary flex items-center gap-1">
                  當地稅後金額&nbsp;<InfoIcon tip="以TWD計算的稅後金額" />&nbsp;<span>-</span>
                </div>
              </div>
              <div className="w-px self-stretch bg-divider" />
              <div className="flex-1 flex flex-col gap-[var(--layout-space-tight)]">
                <div className="text-caption text-fg-secondary">匯率</div>
                <div className="text-body font-medium text-fg">-</div>
                <div className="text-caption text-fg-muted">更新時間 -</div>
              </div>
            </div>

            {/* Employee-specific: 稅號 | 二代健保 */}
            {isEmployee && (
              <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                <Field>
                  <FieldLabel>稅號&nbsp;<InfoIcon tip="統一編號" /></FieldLabel>
                  <Input placeholder="" />
                </Field>
                <Field>
                  <FieldLabel>二代健保</FieldLabel>
                  <Input mode="readonly" value="" />
                </Field>
              </div>
            )}

            {/* Vendor-specific fields */}
            {!isEmployee && (
              <>
                <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                  <Field>
                    <FieldLabel>收入類型&nbsp;<InfoIcon tip="所得類型代碼" /></FieldLabel>
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

            <Checkbox
              checked={usePartial}
              onCheckedChange={(checked) => setUsePartial(checked as boolean)}
              label="使用不足額請款"
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="primary" onClick={handleConfirm}>新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
