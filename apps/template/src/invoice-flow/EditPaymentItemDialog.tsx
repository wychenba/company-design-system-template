import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button, Field, FieldLabel, Input, Select, RadioGroup, RadioGroupItem,
} from '@qijenchen/design-system'
import { Info, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'

interface PaymentItemData {
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

interface EditPaymentItemDialogProps {
  trigger: ReactNode
  initialData?: PaymentItemData
  onConfirm?: (data: PaymentItemData) => void
}

const CATEGORY_OPTIONS = [
  { value: '維修及購買零配件', label: '維修及購買零配件' },
  { value: '維修及購買零配件（公司產品）', label: '維修及購買零配件（公司產品）' },
  { value: '小型工具/物品、電腦/手機週邊、辦公室用品', label: '小型工具/物品、電腦/手機週邊、辦公室用品' },
  { value: '贈、郵快遞費', label: '贈、郵快遞費' },
  { value: '文具用品、印刷、書報雜誌/資料庫、軟體', label: '文具用品、印刷、書報雜誌/資料庫、軟體' },
  { value: '外部研討會/跨組織學習之研討會、宣導活動', label: '外部研討會/跨組織學習之研討會、宣導活動' },
  { value: '訓練/招募/JDP/國內JOS', label: '訓練/招募/JDP/國內JOS' },
  { value: '品片光罩等連接器/機器設備/辦公室傢俱/辦公室裝潢', label: '品片光罩等連接器/機器設備/辦公室傢俱/辦公室裝潢' },
  { value: '雜支/打印/廣告公布置', label: '雜支/打印/廣告公布置' },
  { value: '廣告費', label: '廣告費' },
  { value: 'Legal專用', label: 'Legal專用' },
  { value: '健康中心/JERG@tsmc等員工關懷', label: '健康中心/JERG@tsmc等員工關懷' },
  { value: '專業費用/專區', label: '專業費用/專區' },
]

const SUBCATEGORY_MAP: Record<string, string[]> = {
  '維修及購買零配件': ['純工/建工費料(制加工、加工等)', '純料(螺絲、O-ring等)', '公司設備/辦公室及其他非Fab區域', '維修服務及儀器維護'],
  '維修及購買零配件（公司產品）': ['純工/建工費料(制加工、加工等)', '純料(螺絲、O-ring等)'],
  '小型工具/物品、電腦/手機週邊、辦公室用品': ['電腦/手機週邊', '辦公室用品', '數位軟體/訂閱費(學習平台、adobe、字體、輸入法等)', '雲端化軟體服務(Kahoot/Canvas等)、雲端服務(AI、API等)'],
  '贈、郵快遞費': ['郵快遞費(如郵局、ups、快遞等)'],
  '文具用品、印刷、書報雜誌/資料庫、軟體': ['雲端化軟體服務(Kahoot/Canvas等)、雲端服務(AI、API等)', '公司書籍、書報雜誌、電子報、線上資料庫', '印刷(海報/傳貼/貼紙...等)', '周刊', '文具用品及紙品/資料夾...等)'],
  '外部研討會/跨組織學習之研討會、宣導活動': ['跨組織學習之研討會、宣導活動-餐飲費用', '跨組織學習之研討會、宣導活動-禮品及其他', '跨組織學習之研討會、宣導活動-講師外聘講師費', '跨組織學習之研討會、宣導活動-場地費', '參與台灣境內研討會-報費', '參與台灣境內研討會-報名費', '參與台灣境外研討會-旅費', '參與台灣境外研討會-報名費'],
  '訓練/招募/JDP/國內JOS': ['訓練費-全部門集體訓練學費', '訓練費-人力資源費用-台積學習平台', '考訓學習費用'],
  '品片光罩等連接器/機器設備/辦公室傢俱/辦公室裝潢': ['裝潢傢俱之期購置及期後裝設費用', '手提式電腦及其他(handcarry資產)', '門禁/安全'],
  '雜支/打印/廣告公布置': ['雜支/打印(個人與機關機構間)', '生活鐘'],
  '廣告費': ['廣告費(國內)', '廣告費(國外)', '非象廣告費(國內)', '非象廣告費(國外)'],
  'Legal專用': ['律師費(216631)-國外事務所只在海外執行業務', '律師費(216631)-國內事務所及其他', '專利費(01)-國外事務所只在海外執行業務', '專利費(01)-國外', '專利License'],
  '健康中心/JERG@tsmc等員工關懷': ['醫療器材、救護車…等非勞務費用', '禮品/贈物', '非醫療用品及其他'],
  '專業費用/專區': ['會計顧問費', '財務費用', '顧問費/學術合作'],
}

const CATEGORY_ACCOUNT_MAP: Record<string, string> = {
  '維修及購買零配件': '631100 維修費',
  '維修及購買零配件（公司產品）': '631100 維修費',
  '小型工具/物品、電腦/手機週邊、辦公室用品': '632200 辦公用品費',
  '贈、郵快遞費': '633100 郵電費',
  '文具用品、印刷、書報雜誌/資料庫、軟體': '632100 文具印刷費',
  '外部研討會/跨組織學習之研討會、宣導活動': '641100 訓練費',
  '訓練/招募/JDP/國內JOS': '641100 訓練費',
  '品片光罩等連接器/機器設備/辦公室傢俱/辦公室裝潢': '151000 固定資產',
  '雜支/打印/廣告公布置': '699900 雜支',
  '廣告費': '651000 廣告費',
  'Legal專用': '661000 法律費用',
  '健康中心/JERG@tsmc等員工關懷': '671000 員工福利費',
  '專業費用/專區': '681000 專業服務費',
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

export function EditPaymentItemDialog({ trigger, initialData, onConfirm }: EditPaymentItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [subCategory, setSubCategory] = useState(initialData?.subCategory ?? '')
  const [costCenter, setCostCenter] = useState(initialData?.costCenter ?? '')
  const [hasContract, setHasContract] = useState<'yes' | 'no'>(
    initialData?.contractRequired === '無須提供' || initialData?.contractRequired === '否' ? 'no' : 'yes'
  )
  const [contractIds, setContractIds] = useState([initialData?.contractNumber ?? ''])
  const [noContractReason, setNoContractReason] = useState(
    hasContract === 'no' ? (initialData?.contractNumber ?? '') : ''
  )
  const [totalAmount, setTotalAmount] = useState(initialData ? String(initialData.amount) : '')
  const [taxRate, setTaxRate] = useState(initialData ? String(initialData.taxRate) : '0')

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
      <DialogContent maxWidth={720}>
        <DialogHeader>
          <DialogTitle>編輯付款細項</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            {/* 分類 | 子分類 */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>分類</FieldLabel>
                <Select options={CATEGORY_OPTIONS} value={category} onChange={handleCategoryChange} placeholder="請選擇" />
              </Field>
              <Field>
                <FieldLabel required>子分類</FieldLabel>
                <Select options={subCategoryOptions} value={subCategory} onChange={setSubCategory} placeholder="請選擇" disabled={!category} />
              </Field>
            </div>

            {/* 成本中心 | 會計科目 */}
            <div className="grid grid-cols-2 gap-[var(--layout-space-loose)]">
              <Field>
                <FieldLabel required>成本中心&nbsp;<InfoIcon tip="請填入所屬成本中心代碼" /></FieldLabel>
                <Input value={costCenter} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCostCenter(e.target.value)} placeholder="" />
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
                <Select options={TAX_RATE_OPTIONS} value={taxRate} onChange={setTaxRate} />
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
                      <Button variant="text" size="sm" iconOnly startIcon={Trash2} aria-label="移除合約" onClick={() => removeContract(idx)} />
                    )}
                  </div>
                ))}
                <Button variant="tertiary" size="sm" startIcon={Plus} onClick={addContract}>新增合約編號</Button>
              </div>
            )}

            {hasContract === 'no' && (
              <Field>
                <FieldLabel required>填寫無合約原因</FieldLabel>
                <Input value={noContractReason} onChange={(e) => setNoContractReason(e.target.value)} placeholder="填寫無合約原因" />
              </Field>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="primary" onClick={handleConfirm}>更新</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
