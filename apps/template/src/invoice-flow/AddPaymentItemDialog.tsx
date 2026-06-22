import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button, Field, FieldLabel, Input, Select, RadioGroup, RadioGroupItem, Alert,
} from '@qijenchen/design-system'
import { Info, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { CATEGORY_OPTIONS, SUBCATEGORY_MAP, CATEGORY_ACCOUNT_MAP } from './paymentItemCategories'

export interface NewPaymentItemData {
  category: string
  subCategory: string
  costCenter: string
  account: string
  amount: number
  taxRate: number
  taxAmount: number
  contractRequired: string
  contractNumber: string
}

interface AddPaymentItemDialogProps {
  trigger: ReactNode
  onConfirm?: (data: NewPaymentItemData) => void
}


const TAX_RATE_OPTIONS = [
  { value: '5', label: '5%' },
  { value: '0', label: '0%' },
  { value: 'exempt', label: '免稅' },
]

function InfoIcon({ tip }: { tip?: string }) {
  return (
    <span title={tip} className="inline-flex items-center">
      <Info size={14} className="text-fg-secondary shrink-0 cursor-default" aria-label={tip} />
    </span>
  )
}

export function AddPaymentItemDialog({ trigger, onConfirm }: AddPaymentItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [costCenter, setCostCenter] = useState('')
  const [hasContract, setHasContract] = useState<'yes' | 'no'>('yes')
  const [contractIds, setContractIds] = useState([''])
  const [noContractReason, setNoContractReason] = useState('')
  const [showNotice, setShowNotice] = useState(true)
  const [totalAmount, setTotalAmount] = useState('')
  const [taxRate, setTaxRate] = useState('0')

  const accountingSubject = category ? (CATEGORY_ACCOUNT_MAP[category] ?? '') : ''
  const taxAmount = totalAmount && taxRate && taxRate !== 'exempt'
    ? Math.round(parseFloat(totalAmount) * parseFloat(taxRate) / 100)
    : 0
  const taxAmountDisplay = totalAmount ? String(taxAmount) : ''

  const subCategoryOptions = category
    ? (SUBCATEGORY_MAP[category] ?? []).map((v) => ({ value: v, label: v }))
    : []

  function handleCategoryChange(val: string) {
    setCategory(val)
    setSubCategory('')
  }

  function addContract() {
    setContractIds((prev) => [...prev, ''])
  }

  function removeContract(idx: number) {
    setContractIds((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleConfirm() {
    onConfirm?.({
      category,
      subCategory,
      costCenter,
      account: accountingSubject,
      amount: parseFloat(totalAmount) || 0,
      taxRate: taxRate === 'exempt' ? 0 : parseFloat(taxRate) || 0,
      taxAmount,
      contractRequired: hasContract === 'yes' ? '是' : '無須提供',
      contractNumber: hasContract === 'yes' ? contractIds.join(', ') : noContractReason,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={720} autoHeight>
        <DialogHeader>
          <DialogTitle>新增付款細項</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {/* Info bar */}
          <div className="flex bg-surface-raised rounded px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] mb-[var(--layout-space-loose)] gap-[var(--layout-space-loose)]">
            <div className="flex flex-col">
              <span className="text-caption text-fg-secondary">請款單號</span>
              <span className="text-body font-medium text-fg">PAGE2605250001-1</span>
            </div>
            <div className="w-px self-stretch bg-divider" />
            <div className="flex flex-col">
              <span className="text-caption text-fg-secondary">發票號碼</span>
              <span className="text-body font-medium text-fg">BE-49506445</span>
            </div>
            <div className="w-px self-stretch bg-divider" />
            <div className="flex flex-col">
              <span className="text-caption text-fg-secondary">序號</span>
              <span className="text-body font-medium text-fg">1</span>
            </div>
          </div>

          {showNotice && (
            <div className="mb-[var(--layout-space-loose)]">
              <Alert
                variant="info"
                title="注意事項"
                description='自 2026/12/31 起「國內出差」、「現金獎金」、「QIF」、「銀行自動扣款」已移至首頁/專區，如有需求請前往專區請款。'
                onDismiss={() => setShowNotice(false)}
              />
            </div>
          )}

          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            {/* 分類 | 子分類 */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>分類</FieldLabel>
                <Select
                  options={CATEGORY_OPTIONS}
                  value={category}
                  onChange={handleCategoryChange}
                  placeholder="請選擇"
                />
              </Field>
              <Field>
                <FieldLabel required>子分類</FieldLabel>
                <Select
                  options={subCategoryOptions}
                  value={subCategory}
                  onChange={setSubCategory}
                  placeholder="請選擇"
                  disabled={!category}
                />
              </Field>
            </div>

            {/* 成本中心 | 會計科目 */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>成本中心&nbsp;<InfoIcon tip="請填入所屬成本中心代碼" /></FieldLabel>
                <Input
                  value={costCenter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCostCenter(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>會計科目&nbsp;<InfoIcon tip="依分類自動帶入" /></FieldLabel>
                <Input mode="readonly" value={accountingSubject} />
              </Field>
            </div>

            {/* 總額 | 稅率 | 稅額 */}
            <div className="grid grid-cols-3 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>總額</FieldLabel>
                <Input type="number" placeholder="填寫總額" value={totalAmount} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTotalAmount(e.target.value)} />
              </Field>
              <Field>
                <FieldLabel>稅率&nbsp;<InfoIcon tip="依憑證類型計算" /></FieldLabel>
                <Select options={TAX_RATE_OPTIONS} value={taxRate} onChange={setTaxRate} placeholder="請選擇" />
              </Field>
              <Field>
                <FieldLabel>稅額</FieldLabel>
                <Input type="number" mode="readonly" value={taxAmountDisplay} />
              </Field>
            </div>

            {/* 是否提供合約編號 */}
            <Field>
              <FieldLabel required>是否提供合約編號</FieldLabel>
              <RadioGroup
                value={hasContract}
                onValueChange={(v) => setHasContract(v as 'yes' | 'no')}
                className="flex gap-[var(--layout-space-loose)]"
              >
                <RadioGroupItem value="yes" label="是" />
                <RadioGroupItem value="no" label="否" />
              </RadioGroup>
            </Field>

            {/* Contract ID fields */}
            {hasContract === 'yes' && (
              <div className="flex flex-col gap-[var(--layout-space-tight)]">
                {contractIds.map((id, idx) => (
                  <div key={idx} className="flex items-end gap-[var(--layout-space-tight)]">
                    <Field className="flex-1">
                      {idx === 0 && <FieldLabel required>合約編號</FieldLabel>}
                      <Input
                        value={id}
                        onChange={(e) => {
                          const next = [...contractIds]
                          next[idx] = e.target.value
                          setContractIds(next)
                        }}
                        placeholder="請填寫合約編號"
                      />
                    </Field>
                    {idx > 0 && (
                      <Button
                        variant="text"
                        size="sm"
                        iconOnly
                        startIcon={Trash2}
                        aria-label="移除合約"
                        onClick={() => removeContract(idx)}
                      />
                    )}
                  </div>
                ))}
                <Button variant="tertiary" size="sm" startIcon={Plus} onClick={addContract} className="self-start">
                  新增合約編號
                </Button>
              </div>
            )}

            {/* No-contract reason */}
            {hasContract === 'no' && (
              <Field>
                <FieldLabel required>填寫無合約原因</FieldLabel>
                <Input
                  value={noContractReason}
                  onChange={(e) => setNoContractReason(e.target.value)}
                  placeholder="填寫無合約原因"
                />
              </Field>
            )}
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
