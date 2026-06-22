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
  // First entry = most-used default per Figma 9919-62547
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
  i9B: { code: '9B', label: '9B 講演鐘點費' },
  i92: { code: '92', label: '92 其他所得' },
  i97: { code: '97', label: '97 捐贈' },
  i91: { code: '91', label: '91 競技競賽機會中獎獎金' },
  i53: { code: '53', label: '53 權利金' },
  i00: { code: '00', label: '00 免列所得' },
  TBD: { code: 'TBD', label: '不判斷 (請依 TAMD 單位評估結果填寫)' },
} as const

// Spec C — 個人國內/國外 共用同一組性質
const INDIVIDUAL_NATURE: NatureOption[] = [
  { value: 'consult', label: '顧問費 / 講師費 / 攝影師費 等勞務費用', incomeTypes: [T.i50] },
  { value: 'lecture', label: '演講費 (公開演講、開放全公司參加，附活動海報)', incomeTypes: [T.i9B] },
  { value: 'professional', label: '專職技術人員自負盈虧 (如：律師)', incomeTypes: [T.i9A] },
  { value: 'bonus', label: '工作表現獎勵外部廠商', incomeTypes: [T.i50] },
  { value: 'expense-tw', label: '實報實銷 — 取得台灣廠商統一發票或收據 (差旅、交通、住宿)', incomeTypes: [T.i00] },
  { value: 'expense-overseas', label: '實報實銷 — 取得國外廠商收據 (國外機票、住宿)', incomeTypes: [T.i50] },
  { value: 'special', label: '特殊案例：依稅務部意見免列所得 (需附 apply reason 與核准信)', incomeTypes: [T.TBD] },
]

const NATURE_OPTIONS_BY_PAYEE: Record<string, NatureOption[]> = {
  'individual-domestic': INDIVIDUAL_NATURE,
  'individual-overseas': INDIVIDUAL_NATURE,

  // Spec E — 國內機關團體
  'company-domestic-org': [
    { value: 'product', label: '購買實體物品 (如：喜餅、月餅) — 免列所得', incomeTypes: [T.i00] },
    { value: 'reimburse', label: '代墊費 (如：政府規費) — 免列所得', incomeTypes: [T.i00] },
    { value: 'membership', label: '常年會員費 — 免列所得', incomeTypes: [T.i00] },
    { value: 'consult', label: '顧問費 / 訓練費 / 研討會報名費等 — 列所得', incomeTypes: [T.i92] },
    { value: 'donation', label: '捐贈 / 贊助 (如：香油錢) — 列所得', incomeTypes: [T.i97] },
  ],

  // Spec F — 國內事務所
  'company-domestic-firm': [
    { value: 'reimburse', label: '代墊費 (如：政府規費) — 免列所得', incomeTypes: [T.i00] },
    { value: 'service', label: '無形勞務 (如：律師公費) — 9A 執行業務', incomeTypes: [T.i9A] },
    { value: 'mixed', label: '同時包含無形勞務及代墊費 (代墊費需填入 Tax Exempt 欄位)', incomeTypes: [T.i9A] },
  ],

  // Spec J + K (flattened) — 國外公司
  'company-overseas': [
    { value: 'database', label: '線上資料庫查詢 (含電子書)：非雲端、非客製化、無雙方互動 — 免列所得', incomeTypes: [T.i00] },
    { value: 'onsite', label: '來台提供服務 (顧問 / 訓練) — 有雙方互動', incomeTypes: [T.i92] },
    { value: 'offshore', label: '勞務提供地在國外 — 需 TAMD 評估', incomeTypes: [T.TBD] },
    { value: 'jdp', label: '共同研發費 (JDP) — 需 TAMD 評估', incomeTypes: [T.TBD] },
    { value: 'shared-membership', label: '分攤會員費 — 需 TAMD 評估', incomeTypes: [T.TBD] },
    { value: 'sw-custom', label: '電腦軟體 — TSMC 提需求、客製化軟體', incomeTypes: [T.i92] },
    { value: 'sw-interactive', label: '電腦軟體 — 線上互動軟體 (如：Kahoot / Canva)', incomeTypes: [T.i92] },
    { value: 'sw-cloud', label: '雲端服務 (cloud service)', incomeTypes: [T.i92] },
    { value: 'sw-standard', label: '標準化軟體 (如：Adobe) — 提供產品規格型錄，免列所得', incomeTypes: [T.i00] },
    { value: 'royalty', label: '專利權 / 權利金 (royalty / license / patent)', incomeTypes: [T.i53] },
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

  const selectedIncomeType = natureOption
    ? (natureOption.incomeTypes.find((t) => t.code === incomeTypeOverride) ?? natureOption.incomeTypes[0])
    : null
  const hasMultiple = (natureOption?.incomeTypes.length ?? 0) > 1
  const isExempt = selectedIncomeType?.code === '00'
  const isTBD = selectedIncomeType?.code === 'TBD'
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
      <DialogContent maxWidth={640} autoHeight>
        <DialogHeader>
          <DialogTitle>{initial ? '編輯問券' : '所得問券'}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            {selectedIncomeType ? (
              <Alert
                variant={isTBD ? 'info' : isExempt ? 'success' : 'warning'}
                title={isTBD ? '需 TAMD 單位評估' : isExempt ? '不需認列所得' : '需認列所得'}
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
                        {isTBD
                          ? '請依 TAMD 單位評估結果填寫，並附上詢問信件'
                          : isExempt
                            ? '無須填寫'
                            : '請於所得人清單填寫資訊'}
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
                <FieldLabel required>2. 購買 / 所得性質</FieldLabel>
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
