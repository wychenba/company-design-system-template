import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
  Button, Field, FieldLabel, RadioGroup, RadioGroupItem, Alert,
} from '@qijenchen/design-system'

export interface IncomeAnswer {
  incomeType: string
  incomeTypeLabel: string
  payeeKindLabel: string
  natureLabel: string
}

interface IncomeQuestionnaireDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: IncomeAnswer
  onConfirm: (answer: IncomeAnswer) => void
}

const PAYEE_OPTIONS = [
  { value: 'domestic-individual', label: '國內人士 (一般)' },
  { value: 'overseas-individual', label: '國外人士' },
  { value: 'domestic-company', label: '國內公司/法人' },
  { value: 'overseas-company', label: '國外公司' },
]

const NATURE_OPTIONS = [
  { value: 'salary', label: '薪資、獎金、補貼', incomeType: '50', incomeLabel: '50 薪資所得' },
  { value: 'professional', label: '專職技術人員自負盈虧 (如：律師)', incomeType: '9A', incomeLabel: '9A 執行業務所得' },
  { value: 'service', label: '顧問費/講師費/攝影師費 等勞務費用', incomeType: '92', incomeLabel: '92 其他所得' },
  { value: 'exempt', label: '實報實銷 (差旅/交通/住宿)、免列所得', incomeType: '00', incomeLabel: '00 免列所得' },
]

export function IncomeQuestionnaireDialog({
  open, onOpenChange, initial, onConfirm,
}: IncomeQuestionnaireDialogProps) {
  const [payeeKind, setPayeeKind] = useState('')
  const [nature, setNature] = useState('')

  useEffect(() => {
    if (open) {
      setPayeeKind('')
      setNature('')
    }
  }, [open])

  const natureOption = NATURE_OPTIONS.find((o) => o.value === nature)
  const payeeOption = PAYEE_OPTIONS.find((o) => o.value === payeeKind)
  const isExempt = natureOption?.incomeType === '00'
  const canConfirm = payeeKind !== '' && nature !== ''

  function handleConfirm() {
    if (!natureOption || !payeeOption) return
    onConfirm({
      incomeType: natureOption.incomeType,
      incomeTypeLabel: natureOption.incomeLabel,
      payeeKindLabel: payeeOption.label,
      natureLabel: natureOption.label,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth={560}>
        <DialogHeader>
          <DialogTitle>{initial ? '編輯問券' : '所得問券'}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            {/* Result preview — appears once both questions answered */}
            {natureOption ? (
              <Alert
                variant={isExempt ? 'success' : 'warning'}
                title={isExempt ? '不需認列所得' : '依問券推算結果'}
                description={
                  <div className="flex flex-col gap-[var(--layout-space-tight)]">
                    <div>收入類型：<span className="font-medium">{natureOption.incomeLabel}</span></div>
                    <div>
                      所得人名單：
                      <span className="font-medium">
                        {isExempt ? '無須填寫' : '請於下方所得人清單填寫'}
                      </span>
                    </div>
                  </div>
                }
              />
            ) : (
              <Alert
                variant="info"
                title="填寫說明"
                description="請依實際付款對象與所得性質填寫，系統將依此判斷收入類型及代扣稅額。"
              />
            )}

            <Field>
              <FieldLabel required>1. 付款對象類別</FieldLabel>
              <RadioGroup
                value={payeeKind}
                onValueChange={setPayeeKind}
                className="flex flex-col gap-[var(--layout-space-tight)]"
              >
                {PAYEE_OPTIONS.map((o) => (
                  <RadioGroupItem key={o.value} value={o.value} label={o.label} />
                ))}
              </RadioGroup>
            </Field>

            {payeeKind && (
              <Field>
                <FieldLabel required>2. 所得性質</FieldLabel>
                <RadioGroup
                  value={nature}
                  onValueChange={setNature}
                  className="flex flex-col gap-[var(--layout-space-tight)]"
                >
                  {NATURE_OPTIONS.map((o) => (
                    <RadioGroupItem key={o.value} value={o.value} label={o.label} />
                  ))}
                </RadioGroup>
              </Field>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="tertiary" onClick={() => onOpenChange(false)}>取消</Button>
          <Button variant="primary" disabled={!canConfirm} onClick={handleConfirm}>確認</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
