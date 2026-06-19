import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription,
  Button, Field, FieldLabel, Input, Select, Tag, Checkbox,
} from '@qijenchen/design-system'
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
          {/* Info bar */}
          <div className="flex items-center gap-[var(--layout-space-loose)] bg-surface-raised rounded px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] mb-[var(--layout-space-loose)]">
            <span className="text-body text-fg-secondary">請款單號</span>
            <span className="text-body text-fg font-medium">PAGE2605250001-1</span>
            <div className="w-px self-stretch bg-divider" />
            <span className="text-body text-fg-secondary">狀態</span>
            <Tag color="neutral" size="sm">Draft</Tag>
          </div>

          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            {/* 收款人/廠商 — read-only */}
            <Field>
              <FieldLabel required>收款人/廠商</FieldLabel>
              <Input mode="readonly" value={isEmployee ? '林問宜 (023156)' : '沈淮民 (Y_123136)'} />
            </Field>

            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>憑證類型</FieldLabel>
                <Select
                  options={VOUCHER_TYPES}
                  value={voucherType}
                  onChange={setVoucherType}
                  placeholder="請選擇"
                />
              </Field>

              <Field>
                <FieldLabel required>日期</FieldLabel>
                <Input type="date" placeholder="選擇日期" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel>發票號碼</FieldLabel>
                <Input placeholder="輸入發票號碼" />
              </Field>

              <Field>
                <FieldLabel required>幣別</FieldLabel>
                <Select
                  options={CURRENCY_OPTIONS}
                  value={currency}
                  onChange={setCurrency}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>合計金額（未稅）</FieldLabel>
                <Input type="number" placeholder="0" />
              </Field>

              <Field>
                <FieldLabel>稅額</FieldLabel>
                <Input type="number" placeholder="0" />
              </Field>
            </div>

            {/* 稅後金額 info panel */}
            <div className="bg-surface-raised rounded px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
              <div className="flex gap-[var(--layout-space-loose)]">
                <div className="flex flex-col gap-[var(--layout-space-tight)]">
                  <span className="text-caption text-fg-secondary">稅後金額</span>
                  <span className="text-body font-medium text-fg">—</span>
                </div>
                <div className="w-px self-stretch bg-divider" />
                <div className="flex flex-col gap-[var(--layout-space-tight)]">
                  <span className="text-caption text-fg-secondary">匯率</span>
                  <span className="text-body font-medium text-fg">1.0000</span>
                </div>
                <div className="w-px self-stretch bg-divider" />
                <div className="flex flex-col gap-[var(--layout-space-tight)]">
                  <span className="text-caption text-fg-secondary">更新時間</span>
                  <span className="text-body text-fg">—</span>
                </div>
              </div>
            </div>

            {/* Employee-specific fields */}
            {isEmployee && (
              <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                <Field>
                  <FieldLabel>稅號</FieldLabel>
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
              <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
                <Field>
                  <FieldLabel>收入類型</FieldLabel>
                  <Input placeholder="輸入收入類型" />
                </Field>
                <Field>
                  <FieldLabel>免稅額</FieldLabel>
                  <Select options={[{ value: '0', label: '0' }]} value="0" onChange={() => {}} />
                </Field>
                <Field>
                  <FieldLabel>代扣金額</FieldLabel>
                  <Input mode="readonly" value="—" />
                </Field>
                <Field>
                  <FieldLabel>二代健保</FieldLabel>
                  <Input mode="readonly" value="—" />
                </Field>
              </div>
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
          <Button variant="primary" onClick={handleConfirm}>下一步</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
