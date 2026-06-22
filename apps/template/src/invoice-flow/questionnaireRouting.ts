// Maps (category, subCategory) → questionnaire route per Figma 9932-64218.
//
// - 'vendor'  : default — 廠商問卷 (個人/公司 5-payee tree)
// - 'gift'    : 禮券/禮物問卷_不分內外商 (H/H-1/I/I-1 sub-tree)
// - 'tbd'     : N 須取得 TAMD 信件 (skip questionnaire; show TAMD note)
// - 'direct'  : 1.直接認 (auto 00 免列所得)
// - 'none'    : N (no income recognition needed; no questionnaire opens)

export type QuestionnaireRoute = 'vendor' | 'gift' | 'tbd' | 'direct' | 'none'

interface RouteRule {
  subCategory: string
  route: QuestionnaireRoute
}

// Specific (category, subCategory) overrides. Anything not listed falls through
// to the category-level default below; categories with no entry default to vendor.
const RULES: Record<string, RouteRule[]> = {
  '小型工具/物品、電腦/手機週邊、辦公室用品': [
    { subCategory: '雲端化軟體服務(Kahoot/Canvas等)、雲端服務(AI、API等)', route: 'tbd' },
  ],
  '文具用品、印刷、書報雜誌/資料庫、軟體': [
    { subCategory: '雲端化軟體服務(Kahoot/Canvas等)、雲端服務(AI、API等)', route: 'tbd' },
    { subCategory: '文具用品及紙品/資料夾...等)', route: 'none' },
  ],
  '外部研討會/跨組織學習之研討會、宣導活動': [
    { subCategory: '跨組織學習之研討會、宣導活動-禮品及其他', route: 'gift' },
  ],
  '訓練/招募/JDP/國內JOS': [
    { subCategory: '訓練費-人力資源費用-禮品/贈獎', route: 'gift' },
    { subCategory: '國內招募-禮品/贈獎', route: 'gift' },
    { subCategory: '國外招募-禮品/贈獎', route: 'gift' },
    { subCategory: 'JOS 平女貸幣補助', route: 'direct' },
  ],
  '雜支/打印/廣告公布置': [
    { subCategory: '禮品/贈物', route: 'gift' },
    { subCategory: '青油錢', route: 'direct' },
  ],
  'Legal專用': [
    { subCategory: '專利License', route: 'tbd' },
  ],
  '健康中心/JERG@tsmc等員工關懷': [
    { subCategory: '醫療器材、救護車…等非勞務費用', route: 'none' },
    { subCategory: '餐飲費用', route: 'none' },
    { subCategory: '非醫療用品及其他', route: 'none' },
    { subCategory: '禮品/贈物', route: 'gift' },
  ],
}

// Category-level defaults when subCategory doesn't match a specific rule.
const CATEGORY_DEFAULT: Record<string, QuestionnaireRoute> = {
  '贈、郵快遞費': 'none',
}

export function getQuestionnaireRoute(category: string, subCategory: string): QuestionnaireRoute {
  const rules = RULES[category]
  if (rules) {
    const hit = rules.find((r) => r.subCategory === subCategory)
    if (hit) return hit.route
  }
  return CATEGORY_DEFAULT[category] ?? 'vendor'
}
