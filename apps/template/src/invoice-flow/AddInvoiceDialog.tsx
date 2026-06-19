import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription,
  Button, Field, FieldLabel, Input, Select, Tag, Checkbox,
} from '@qijenchen/design-system'
import { Info } from 'lucide-react'
import type { ReactNode } from 'react'

interface AddInvoiceDialogProps {
  trigger: ReactNode
  payeeType?: 'employee' | 'vendor'
  onConfirm?: () => void
}

const VOUCHER_TYPES = [
  { value: 'e-invoice', label: '電子統一發票' },
  { value: 'paper-invoice', label: '紙本統一發票' },
  { value: 'receipt', label: '統一發票收據' },
  { value: 'deferred', label: '統一發票後補' },
  { value: 'acknowledgment', label: '茲收到' },
  { value: 'domestic', label: '國內廠商收據' },
  { value: 'foreign', label: '國外廠商收據' },
  { value: 'handler', label: '經手人證明' },
  { value: 'discount', label: '折讓單' },
]

const CURRENCY_OPTIONS = [
  { value: 'TWD', label: 'TWD' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'JPY', label: 'JPY' },
]

const TAX_EXEMPT_OPTIONS = [
  { value: '0', label: '無' },
  { value: '90000', label: '90,000' },
]

function InfoIcon() {
  return <Info size={14} className="inline-block align-middle text-fg-secondary shrink-0" />
}

export function AddInvoiceDialog({ trigger, payeeType = 'employee', onConfirm }: AddInvoiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [voucherType, setVoucherType] = useState('')
  const [currency, setCurrency] = useState('TWD')
  const [usePartial, setUsePartial] = useState(false)

  const isEmployee = payeeType === 'employee'

  function handleConfirm() {
    onConfirm?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={560}>
        <DialogHeader>
          <DialogTitle>新增發票</DialogTitle>
          <DialogDescription>填寫請款發票資訊</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {/* Info bar — label(caption) on top, value(body) below, sections separated by divider */}
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

            {/* 憑證類型 — full width */}
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
                <Input type="date" placeholder="填寫日期" />
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

            {/* 合計金額 | 稅額 ⓘ */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>合計金額（未稅）</FieldLabel>
                <Input type="number" placeholder="0" />
              </Field>
              <Field>
                <FieldLabel>稅額&nbsp;<InfoIcon /></FieldLabel>
                <Input type="number" placeholder="0" />
              </Field>
            </div>

            {/* 稅後金額 panel */}
            <div className="bg-surface-raised rounded px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
              <div className="flex gap-[var(--layout-space-loose)]">
                <div className="flex-1 flex flex-col gap-[var(--layout-space-tight)]">
                  <div>
                    <div className="text-caption text-fg-secondary">稅後金額</div>
                    <div className="text-body font-medium text-fg">-</div>
                  </div>
                  <div className="text-caption text-fg-secondary">
                    當地稅後金額&nbsp;<InfoIcon />&nbsp;-
                  </div>
                </div>
                <div className="w-px self-stretch bg-divider" />
                <div className="flex-1 flex flex-col gap-[var(--layout-space-tight)]">
                  <div>
                    <div className="text-caption text-fg-secondary">匯率</div>
                    <div className="text-body font-medium text-fg">-</div>
                  </div>
                  <div className="text-caption text-fg-secondary">更新時間 -</div>
                </div>
              </div>
            </div>

            {/* Employee-specific fields */}
            {isEmployee && (
              <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                <Field>
                  <FieldLabel>稅號&nbsp;<InfoIcon /></FieldLabel>
                  <Input placeholder="輸入稅號" />
                </Field>
                <Field>
                  <FieldLabel>二代健保</FieldLabel>
                  <Input mode="readonly" value="—" />
                </Field>
              </div>
            )}

            {/* Vendor-specific fields */}
            {!isEmployee && (
              <>
                <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                  <Field>
                    <FieldLabel>收入類型&nbsp;<InfoIcon /></FieldLabel>
                    <Input placeholder="輸入收入類型" />
                  </Field>
                  <Field>
                    <FieldLabel>免稅額</FieldLabel>
                    <Select options={TAX_EXEMPT_OPTIONS} placeholder="請選擇" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                  <Field>
                    <FieldLabel>代扣金額&nbsp;<InfoIcon /></FieldLabel>
                    <Input mode="readonly" value="—" />
                  </Field>
                  <Field>
                    <FieldLabel>二代健保</FieldLabel>
                    <Input mode="readonly" value="—" />
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
