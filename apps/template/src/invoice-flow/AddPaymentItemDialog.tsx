import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button, Field, FieldLabel, Input, Select, RadioGroup, RadioGroupItem, Alert,
} from '@qijenchen/design-system'
import { Info, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

interface AddPaymentItemDialogProps {
  trigger: ReactNode
  onConfirm?: () => void
}

const CATEGORY_OPTIONS = [
  { value: 'a', label: '一般費用' },
  { value: 'b', label: '差旅費' },
  { value: 'c', label: '採購' },
]

const SUB_CATEGORY_OPTIONS = [
  { value: 'a1', label: '辦公用品' },
  { value: 'a2', label: '餐費' },
  { value: 'a3', label: '交通費' },
]

const TAX_RATE_OPTIONS = [
  { value: '5', label: '5%' },
  { value: '0', label: '0%' },
  { value: 'exempt', label: '免稅' },
]

function InfoIcon() {
  return <Info size={14} className="inline-block align-middle text-fg-secondary shrink-0" />
}

export function AddPaymentItemDialog({ trigger, onConfirm }: AddPaymentItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [hasContract, setHasContract] = useState<'yes' | 'no'>('yes')
  const [contractIds, setContractIds] = useState([''])
  const [noContractReason, setNoContractReason] = useState('')
  const [showNotice, setShowNotice] = useState(true)

  function addContract() {
    setContractIds((prev) => [...prev, ''])
  }

  function removeContract(idx: number) {
    setContractIds((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleConfirm() {
    onConfirm?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={560}>
        <DialogHeader>
          <DialogTitle>新增付款細項</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {/* Info bar — label(caption) on top, value(body) below */}
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

          {/* Info alert */}
          {showNotice && (
            <div className="mb-[var(--layout-space-loose)]">
              <Alert
                variant="info"
                title="注意事項"
                description="自 2026/12/31 起「國內出差」、「現金獎金」、「QIF」、「銀行自動扣款」已移至首頁/專區，如有需求請前往專區請款。"
                onDismiss={() => setShowNotice(false)}
              />
            </div>
          )}

          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            {/* 分類 | 子分類 */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>分類</FieldLabel>
                <Select options={CATEGORY_OPTIONS} placeholder="請選擇" />
              </Field>
              <Field>
                <FieldLabel required>子分類</FieldLabel>
                <Select options={SUB_CATEGORY_OPTIONS} placeholder="請選擇" />
              </Field>
            </div>

            {/* 成本中心 ⓘ | 會計科目 ⓘ */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>成本中心&nbsp;<InfoIcon /></FieldLabel>
                <Input placeholder="輸入成本中心" />
              </Field>
              <Field>
                <FieldLabel>會計科目&nbsp;<InfoIcon /></FieldLabel>
                <Input placeholder="輸入會計科目" />
              </Field>
            </div>

            {/* 總額 | 稅率 ⓘ | 稅額 */}
            <div className="grid grid-cols-3 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>總額</FieldLabel>
                <Input type="number" placeholder="填寫總額" />
              </Field>
              <Field>
                <FieldLabel>稅率&nbsp;<InfoIcon /></FieldLabel>
                <Select options={TAX_RATE_OPTIONS} placeholder="請選擇" />
              </Field>
              <Field>
                <FieldLabel>稅額</FieldLabel>
                <Input type="number" placeholder="0" />
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
                  <div key={idx} className="flex items-center gap-[var(--layout-space-tight)]">
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
                        className="mt-[var(--layout-space-tight)]"
                      />
                    )}
                  </div>
                ))}
                <Button variant="tertiary" size="sm" startIcon={Plus} onClick={addContract}>
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
