import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
  Button, Field, FieldLabel, RadioGroup, RadioGroupItem, Alert,
} from '@qijenchen/design-system'
import type { QuestionnaireRoute } from './questionnaireRouting'

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
  route?: QuestionnaireRoute
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

interface PayeeOption {
  value: string
  label: string
  // If set, this Q1 option resolves directly without Q2 (Spec D rows 1 and 4).
  directIncomeType?: IncomeTypeOption
}

const PAYEE_OPTIONS: PayeeOption[] = [
  { value: 'domestic-org', label: '國內法人/組織' },
  { value: 'domestic-individual', label: '國內個人' },
  { value: 'overseas-org', label: '國外公司/機構' },
  { value: 'overseas-individual', label: '國外個人' },
  { value: 'gov', label: '政府/公立組織' },
]

// Direct-resolution map for Q1 options that skip Q2.

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

const DIRECT_RESOLVE: Record<string, IncomeTypeOption> = {
  'gov': T.i00,
}

const NATURE_OPTIONS_BY_PAYEE: Record<string, NatureOption[]> = {
  'domestic-individual': INDIVIDUAL_NATURE,
  'overseas-individual': INDIVIDUAL_NATURE,

  // 國內法人/組織：合併 Spec E (機關團體) + Spec F (事務所)
  'domestic-org': [
    { value: 'product', label: '購買實體物品 (如：喜餅、月餅) — 免列所得', incomeTypes: [T.i00] },
    { value: 'reimburse', label: '代墊費 (如：政府規費) — 免列所得', incomeTypes: [T.i00] },
    { value: 'membership', label: '常年會員費 — 免列所得', incomeTypes: [T.i00] },
    { value: 'consult', label: '顧問費 / 訓練費 / 研討會報名費等 — 列所得', incomeTypes: [T.i92] },
    { value: 'donation', label: '捐贈 / 贊助 (如：香油錢) — 列所得', incomeTypes: [T.i97] },
    { value: 'service', label: '無形勞務 (如：律師公費) — 9A 執行業務', incomeTypes: [T.i9A] },
    { value: 'mixed', label: '同時包含無形勞務及代墊費 (代墊費需填入 Tax Exempt 欄位)', incomeTypes: [T.i9A] },
  ],

  // 國外公司/機構：合併 Spec F-1 (國外事務所) + Spec J+K (國外公司)
  'overseas-org': [
    { value: 'firm-offshore', label: '國外事務所在台灣境外執行業務 — 免列所得', incomeTypes: [T.i00] },
    { value: 'firm-onshore', label: '國外事務所在台灣境內執行業務 — 列 92 其他所得', incomeTypes: [T.i92] },
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

// Gift sub-tree per Figma spec H/H-1/I/I-1.
// Each option either resolves (terminal) or jumps to a follow-up question (next).
interface GiftOption {
  value: string
  label: string
  incomeTypes?: IncomeTypeOption[]
  next?: 'H1' | 'I' | 'I1'
}

const GIFT_TREE: Record<'H' | 'H1' | 'I' | 'I1', { question: string; options: GiftOption[] }> = {
  H: {
    question: '贈送禮品 / 票券 / 禮物的哪一種',
    options: [
      { value: 'voucher', label: '禮券 / 商品卡 (如：7-11)', incomeTypes: [T.i50, T.i91, T.i97] },
      { value: 'ticket', label: '餐飲券、咖啡券、提貨券、圖書券、電影票、門票、住宿券', next: 'H1' },
      { value: 'physical', label: '實體禮物', next: 'I' },
      { value: 'tsmc-only', label: '商品兌換券 (如：7-11 咖啡券)，限 TSMC 廠內使用', incomeTypes: [T.i00] },
    ],
  },
  H1: {
    question: '票券使用情境',
    options: [
      { value: 'group-meal', label: '辦理團體聚餐 / 康樂活動 / 下午茶 (apply reason 註明人事時地物)', incomeTypes: [T.i00] },
      { value: 'over-1000', label: '非上述用途，超過 NT$1,000 / 人，需列所得', incomeTypes: [T.i50, T.i91, T.i97] },
      { value: 'under-1000', label: '非上述用途，小於等於 NT$1,000 / 人，免列所得', incomeTypes: [T.i00] },
    ],
  },
  I: {
    question: '實體禮物的目的性',
    options: [
      { value: 'external', label: '外部交際：公司對外 / 外部人士交流 (限交際費)', incomeTypes: [T.i00] },
      { value: 'ceremony', label: '婚喪喜慶：婚禮 / 喪禮 / 生育慰問', incomeTypes: [T.i00] },
      { value: 'food', label: '食物 / 植物：中秋月餅、端午粽子、盆栽花束等', incomeTypes: [T.i00] },
      { value: 'engraved', label: '禮品有刻字 (TSMC logo / 單位 / 送禮人或收禮人名字)', incomeTypes: [T.i00] },
      { value: 'other', label: '非上述情境', next: 'I1' },
    ],
  },
  I1: {
    question: '其他性質的禮物',
    options: [
      { value: 'fest-over-3000', label: '工程師節 / 秘書節，超過 NT$3,000 / 人，需列所得', incomeTypes: [T.i50, T.i91, T.i97] },
      { value: 'fest-under-3000', label: '工程師節 / 秘書節，小於等於 NT$3,000 / 人，免列所得', incomeTypes: [T.i00] },
      { value: 'other-over-1000', label: '非上述情境，超過 NT$1,000 / 人，需列所得', incomeTypes: [T.i50, T.i91, T.i97] },
      { value: 'other-under-1000', label: '非上述情境，小於等於 NT$1,000 / 人，免列所得', incomeTypes: [T.i00] },
    ],
  },
}

export function IncomeQuestionnaireDialog({
  open, onOpenChange, initial, onConfirm, route = 'vendor',
}: IncomeQuestionnaireDialogProps) {
  const [payeeKind, setPayeeKind] = useState('')
  const [nature, setNature] = useState('')
  const [incomeTypeOverride, setIncomeTypeOverride] = useState<string>('')

  // Gift sub-tree state: stack of (questionId, optionValue) crumbs.
  const [giftPath, setGiftPath] = useState<{ q: 'H' | 'H1' | 'I' | 'I1'; v: string }[]>([])

  useEffect(() => {
    if (open) {
      setPayeeKind('')
      setNature('')
      setIncomeTypeOverride('')
      setGiftPath([])
    }
  }, [open])

  // Vendor route — payee + nature (or direct resolution for gov)
  const payeeOption = PAYEE_OPTIONS.find((o) => o.value === payeeKind)
  const directType = payeeKind ? DIRECT_RESOLVE[payeeKind] : undefined
  const natureOptions = payeeKind && !directType ? NATURE_OPTIONS_BY_PAYEE[payeeKind] ?? [] : []
  const natureOption = natureOptions.find((o) => o.value === nature)

  // Gift route — walk the H/H-1/I/I-1 tree
  const giftCurrentQ: 'H' | 'H1' | 'I' | 'I1' = (() => {
    if (giftPath.length === 0) return 'H'
    const last = giftPath[giftPath.length - 1]
    const opt = GIFT_TREE[last.q].options.find((o) => o.value === last.v)
    return opt?.next ?? last.q
  })()
  const giftTerminal = (() => {
    if (giftPath.length === 0) return null
    const last = giftPath[giftPath.length - 1]
    const opt = GIFT_TREE[last.q].options.find((o) => o.value === last.v)
    return opt?.incomeTypes ? opt : null
  })()

  // Resolve the income type based on the active route
  const activeNatureOption = route === 'gift'
    ? (giftTerminal ? { label: giftTerminal.label, incomeTypes: giftTerminal.incomeTypes! } : null)
    : natureOption ?? null

  const selectedIncomeType = (() => {
    if (route === 'tbd') return T.TBD
    if (route === 'direct') return T.i00
    // Vendor route — direct-resolve Q1 (政府/計程車) skips Q2.
    if (route === 'vendor' && directType) return directType
    if (!activeNatureOption) return null
    return activeNatureOption.incomeTypes.find((t) => t.code === incomeTypeOverride) ?? activeNatureOption.incomeTypes[0]
  })()
  const hasMultiple = (activeNatureOption?.incomeTypes.length ?? 0) > 1
  const isExempt = selectedIncomeType?.code === '00'
  const isTBD = selectedIncomeType?.code === 'TBD'

  const canConfirm = (() => {
    if (route === 'tbd' || route === 'direct') return true
    if (route === 'gift') return giftTerminal !== null
    if (directType) return payeeKind !== ''
    return payeeKind !== '' && nature !== '' && selectedIncomeType !== null
  })()

  function handleConfirm() {
    if (!selectedIncomeType) return
    let payeeKindLabel = ''
    let natureLabel = ''
    if (route === 'vendor') {
      if (!payeeOption) return
      payeeKindLabel = payeeOption.label
      if (directType) {
        natureLabel = '直接認列'
      } else {
        if (!natureOption) return
        natureLabel = natureOption.label
      }
    } else if (route === 'gift') {
      payeeKindLabel = '禮券 / 禮物'
      natureLabel = giftTerminal?.label ?? ''
    } else if (route === 'tbd') {
      payeeKindLabel = '需 TAMD 評估'
      natureLabel = '依 TAMD 信件填寫'
    } else if (route === 'direct') {
      payeeKindLabel = '直接認列'
      natureLabel = '免列所得'
    }
    onConfirm({
      incomeType: selectedIncomeType.code,
      incomeTypeLabel: selectedIncomeType.label,
      payeeKindLabel,
      natureLabel,
    })
    onOpenChange(false)
  }

  function pickGift(q: 'H' | 'H1' | 'I' | 'I1', v: string) {
    setGiftPath((prev) => [...prev, { q, v }])
    setIncomeTypeOverride('')
  }
  function backGift() {
    setGiftPath((prev) => prev.slice(0, -1))
    setIncomeTypeOverride('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth={640} autoHeight>
        <DialogHeader>
          <DialogTitle>填寫問券</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-[var(--layout-space-loose)]">

            {/* Vendor route */}
            {route === 'vendor' && (
              <>
                <div className="flex flex-col gap-[var(--layout-space-tight)]">
                  <FieldLabel required>1. 付款對象類型</FieldLabel>
                  <RadioGroup
                    value={payeeKind}
                    onValueChange={(v) => { setPayeeKind(v); setNature(''); setIncomeTypeOverride('') }}
                    className="grid grid-cols-2 gap-x-[8px] gap-y-[12px]"
                  >
                    {PAYEE_OPTIONS.map((o) => (
                      <label
                        key={o.value}
                        className={[
                          'flex flex-col items-start p-[12px] rounded-[4px] border cursor-pointer transition-colors',
                          payeeKind === o.value
                            ? 'border-primary'
                            : 'border-border-default hover:bg-surface-raised',
                        ].join(' ')}
                        onClick={() => { setPayeeKind(o.value); setNature(''); setIncomeTypeOverride('') }}
                      >
                        <RadioGroupItem value={o.value} label={o.label} />
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {natureOptions.length > 0 && (
                  <div className="flex flex-col gap-[var(--layout-space-tight)]">
                    <FieldLabel required>2. 購買 / 所得性質</FieldLabel>
                    <RadioGroup
                      value={nature}
                      onValueChange={(v) => { setNature(v); setIncomeTypeOverride('') }}
                      className="flex flex-col gap-y-[12px]"
                    >
                      {natureOptions.map((o) => (
                        <label
                          key={o.value}
                          className={[
                            'flex flex-col items-start p-[12px] rounded-[4px] border cursor-pointer transition-colors',
                            nature === o.value
                              ? 'border-primary'
                              : 'border-border-default hover:bg-surface-raised',
                          ].join(' ')}
                          onClick={() => { setNature(o.value); setIncomeTypeOverride('') }}
                        >
                          <RadioGroupItem value={o.value} label={o.label} />
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </>
            )}

            {/* Gift route — H/H-1/I/I-1 tree */}
            {route === 'gift' && !giftTerminal && (
              <>
                {/* Breadcrumb / back */}
                {giftPath.length > 0 && (
                  <div className="flex items-center gap-[var(--layout-space-tight)] text-caption text-fg-secondary">
                    <button type="button" className="bg-transparent border-0 p-0 cursor-pointer text-primary hover:underline" onClick={backGift}>
                      ← 上一題
                    </button>
                    <span>已選：{giftPath.map((p) => GIFT_TREE[p.q].options.find((o) => o.value === p.v)?.label).join(' › ')}</span>
                  </div>
                )}
                <Field>
                  <FieldLabel required>{giftPath.length + 1}. {GIFT_TREE[giftCurrentQ].question}</FieldLabel>
                  <RadioGroup
                    value=""
                    onValueChange={(v) => pickGift(giftCurrentQ, v)}
                    className="flex flex-col gap-[var(--layout-space-tight)]"
                  >
                    {GIFT_TREE[giftCurrentQ].options.map((o) => (
                      <RadioGroupItem key={o.value} value={o.value} label={o.label} />
                    ))}
                  </RadioGroup>
                </Field>
              </>
            )}

            {/* Gift terminal — show back button to revise */}
            {route === 'gift' && giftTerminal && giftPath.length > 0 && (
              <div>
                <button type="button" className="bg-transparent border-0 p-0 cursor-pointer text-primary hover:underline text-caption" onClick={backGift}>
                  ← 重新選擇
                </button>
              </div>
            )}

            {/* Result alert — shown at bottom only after last question is answered */}
            {selectedIncomeType && (
              <Alert
                variant={isTBD ? 'info' : isExempt ? 'neutral' : 'info'}
                title={isTBD ? '需 TAMD 單位評估' : isExempt ? '無需認列所得' : '需認列所得'}
                description={
                  <div className="flex flex-col gap-[var(--layout-space-tight)]">
                    {hasMultiple && activeNatureOption ? (
                      <>
                        <div>
                          所得類型建議：<span className="font-medium">{activeNatureOption.incomeTypes.map((t) => t.code).join('、')}</span>
                          ，系統預計推薦 <span className="font-medium">{selectedIncomeType.label}</span>（可前往發票編輯所得類型）。
                        </div>
                        <div>備註：請於送出申請單前填寫<span className="text-primary cursor-pointer hover:underline">所得人清單</span></div>
                      </>
                    ) : (
                      <>
                        <div>建議所得類型：<span className="font-medium">{selectedIncomeType.label}</span></div>
                        <div>
                          備註：
                          <span className="font-medium">
                            {isTBD
                              ? '請依 TAMD 單位評估結果填寫，並附上詢問信件'
                              : isExempt
                                ? '不認列'
                                : '請於送出申請單後填寫所得人清單'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                }
              />
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="tertiary" onClick={() => onOpenChange(false)}>取消</Button>
          <Button variant="primary" disabled={!canConfirm} onClick={handleConfirm}>完成</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
