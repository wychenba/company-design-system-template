import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
  Button, Field, FieldLabel, RadioGroup, RadioGroupItem, Alert, Select,
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

interface IncomeTypeOption {
  code: string
  label: string
}

interface NatureOption {
  value: string
  label: string
  // When multiple types available, first = most-used default per Figma 9919-62547
  incomeTypes: IncomeTypeOption[]
}

const PAYEE_OPTIONS: { value: string; label: string }[] = [
  { value: 'individual-domestic', label: '個人 — 國內人士 (一般)' },
  { value: 'individual-overseas', label: '個人 — 國外人士' },
  { value: 'company-domestic-org', label: '公司 — 國內機關團體' },
  { value: 'company-domestic-firm', label: '公司 — 國內事務所 / 律師 / 會計師' },
  { value: 'company-overseas', label: '公司 — 國外公司' },
]

const T = {
  i50: { code: '50', label: '50 薪資所得' },
  i9A: { code: '9A', label: '9A 執行業務所得' },
  i92: { code: '92', label: '92 其他所得' },
  i00: { code: '00', label: '00 免列所得' },
  i0B: { code: '0B', label: '0B 講演鐘點費' },
  i91: { code: '91', label: '91 競技競賽機會中獎獎金' },
  i97: { code: '97', label: '97 機會中獎' },
  i53: { code: '53', label: '53 權利金' },
} as const

const NATURE_OPTIONS_BY_PAYEE: Record<string, NatureOption[]> = {
  'individual-domestic': [
    { value: 'consult', label: '顧問費 / 諮詢費 / 勞務性質報酬', incomeTypes: [T.i50] },
    { value: 'lecture', label: '講演鐘點費 (含演講、教學)', incomeTypes: [T.i0B] },
    { value: 'professional', label: '專業服務人員自負盈虧 (如：律師、醫師)', incomeTypes: [T.i9A] },
    { value: 'bonus', label: '工作獎金 / 績效獎金', incomeTypes: [T.i50] },
    { value: 'prize', label: '競技競賽 / 機會中獎', incomeTypes: [T.i50, T.i91, T.i97] },
    { value: 'expense', label: '實報實銷 (交通、住宿、餐費)', incomeTypes: [T.i00] },
    { value: 'special', label: '特殊案例：依稅務認定，免列所得 (需附說明)', incomeTypes: [T.i00] },
  ],
  'individual-overseas': [
    { value: 'service', label: '勞務報酬 / 顧問費 (免二代健保)', incomeTypes: [T.i92] },
    { value: 'royalty', label: '權利金', incomeTypes: [T.i53] },
    { value: 'expense', label: '實報實銷', incomeTypes: [T.i00] },
  ],
  'company-domestic-org': [
    { value: 'product', label: '購買業務相關品牌品 / 免列所得', incomeTypes: [T.i00] },
    { value: 'reimburse', label: '代墊款項 (住宿、餐費等)', incomeTypes: [T.i00] },
    { value: 'consult', label: '顧問費 / 講師費等服務費用', incomeTypes: [T.i92] },
    { value: 'professional', label: '顧客專業服務 / 自負盈虧業務', incomeTypes: [T.i9A] },
  ],
  'company-domestic-firm': [
    { value: 'reimburse', label: '代墊款項 (住宿、餐費等)', incomeTypes: [T.i00] },
    { value: 'service', label: '事務所提供之顧問 / 法律 / 會計服務', incomeTypes: [T.i9A] },
    { value: 'exempt-firm', label: '事務所為 Tax Exempt 單位', incomeTypes: [T.i00] },
  ],
  'company-overseas': [
    { value: 'cloud', label: '線上 / 雲端服務 (Cloud Service)', incomeTypes: [T.i92] },
    { value: 'tech', label: '技術服務 / 客製化軟體', incomeTypes: [T.i92] },
    { value: 'royalty', label: '權利金 (專利、商標、著作權)', incomeTypes: [T.i53] },
    { value: 'product', label: '一般商品 / 電子或實體軟體授權', incomeTypes: [T.i00] },
  ],
}

export function IncomeQuestionnaireDialog({
  open, onOpenChange, initial, onConfirm,
}: IncomeQuestionnaireDialogProps) {
  const [payeeKind, setPayeeKind] = useState('')
  const [nature, setNature] = useState('')
  const [incomeTypeOverride, setIncomeTypeOverride] = useState<string>('')

  useEffect(() => {
    if (open) {
      setPayeeKind('')
      setNature('')
      setIncomeTypeOverride('')
    }
  }, [open])

  const payeeOption = PAYEE_OPTIONS.find((o) => o.value === payeeKind)
  const natureOptions = payeeKind ? NATURE_OPTIONS_BY_PAYEE[payeeKind] ?? [] : []
  const natureOption = natureOptions.find((o) => o.value === nature)

  // Default to first (most-used) when option has 3 income types
  const selectedIncomeType = natureOption
    ? (natureOption.incomeTypes.find((t) => t.code === incomeTypeOverride) ?? natureOption.incomeTypes[0])
    : null
  const hasMultiple = (natureOption?.incomeTypes.length ?? 0) > 1
  const isExempt = selectedIncomeType?.code === '00'
  const canConfirm = payeeKind !== '' && nature !== '' && selectedIncomeType !== null

  function handleConfirm() {
    if (!natureOption || !payeeOption || !selectedIncomeType) return
    onConfirm({
      incomeType: selectedIncomeType.code,
      incomeTypeLabel: selectedIncomeType.label,
      payeeKindLabel: payeeOption.label,
      natureLabel: natureOption.label,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth={600} autoHeight>
        <DialogHeader>
          <DialogTitle>{initial ? '編輯問券' : '所得問券'}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            {/* Result preview */}
            {selectedIncomeType ? (
              <Alert
                variant={isExempt ? 'success' : 'warning'}
                title={isExempt ? '不需認列所得' : '需認列所得'}
                description={
                  <div className="flex flex-col gap-[var(--layout-space-tight)]">
                    <div>
                      推薦收入類型：<span className="font-medium">{selectedIncomeType.label}</span>
                      {hasMultiple && <span className="text-caption text-fg-secondary ml-[4px]">(可調整)</span>}
                    </div>
                    {hasMultiple && natureOption && (
                      <div className="flex items-center gap-[var(--layout-space-tight)]">
                        <span className="text-caption">調整為：</span>
                        <Select
                          size="sm"
                          value={selectedIncomeType.code}
                          options={natureOption.incomeTypes.map((t) => ({ value: t.code, label: t.label }))}
                          onChange={setIncomeTypeOverride}
                        />
                      </div>
                    )}
                    <div>
                      所得人清單：
                      <span className="font-medium">
                        {isExempt ? '無須填寫' : '請於所得人清單填寫資訊'}
                      </span>
                    </div>
                  </div>
                }
              />
            ) : (
              <Alert
                variant="info"
                title="填寫說明"
                description="請依實際付款對象與所得性質回答，系統將依此判斷收入類型及代扣稅額。對應多種類別時，將預設顯示最常使用的。"
              />
            )}

            <Field>
              <FieldLabel required>1. 付款對象類別</FieldLabel>
              <RadioGroup
                value={payeeKind}
                onValueChange={(v) => { setPayeeKind(v); setNature(''); setIncomeTypeOverride('') }}
                className="flex flex-col gap-[var(--layout-space-tight)]"
              >
                {PAYEE_OPTIONS.map((o) => (
                  <RadioGroupItem key={o.value} value={o.value} label={o.label} />
                ))}
              </RadioGroup>
            </Field>

            {natureOptions.length > 0 && (
              <Field>
                <FieldLabel required>2. 所得 / 交易性質</FieldLabel>
                <RadioGroup
                  value={nature}
                  onValueChange={(v) => { setNature(v); setIncomeTypeOverride('') }}
                  className="flex flex-col gap-[var(--layout-space-tight)]"
                >
                  {natureOptions.map((o) => (
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
