import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
  Button, Field, FieldLabel, RadioGroup, RadioGroupItem, Alert,
} from '@qijenchen/design-system'

export interface IncomeAnswer {
  incomeType: string
  incomeTypeLabel: string
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
  { value: 'professional', label: '專職技術人員自負盈虧 (如：律師)', incomeType: '9A', incomeLabel: '9A 執行業務' },
  { value: 'other', label: '顧問費/講師費/攝影師費 等勞務費用', incomeType: '92', incomeLabel: '92 其他所得' },
  { value: 'exempt', label: '實報實銷 (差旅/交通/住宿)、免列所得', incomeType: '00', incomeLabel: '00 免列所得' },
]

export function IncomeQuestionnaireDialog({
  open, onOpenChange, initial, onConfirm,
}: IncomeQuestionnaireDialogProps) {
  const [payeeKind, setPayeeKind] = useState('')
  const [nature, setNature] = useState('')

  useEffect(() => {
    if (open) {
      setPayeeKind(initial ? 'domestic-individual' : '')
      setNature('')
    }
  }, [open, initial])

  function handleConfirm() {
    const found = NATURE_OPTIONS.find((o) => o.value === nature)
    if (!found) return
    onConfirm({ incomeType: found.incomeType, incomeTypeLabel: found.incomeLabel })
    onOpenChange(false)
  }

  const canConfirm = payeeKind !== '' && nature !== ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth={560}>
        <DialogHeader>
          <DialogTitle>所得問券</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            <Alert
              variant="info"
              title="填寫說明"
              description="請依實際付款對象與所得性質填寫，系統將依此判斷收入類型及代扣稅額。"
            />

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
