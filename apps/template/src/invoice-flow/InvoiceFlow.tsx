import { useState } from 'react'
import { HomePage, type DraftRow } from './HomePage'
import { ApplicationPage, type ApplicationInitialData, type InvoiceRow, type PaymentItem } from './ApplicationPage'
import { IncomeListPage } from './IncomeListPage'

export type AppView = 'home' | 'application' | 'incomeList'

// Fake line items seeded into the first invoice when editing an existing draft,
// so the prototype shows table data flowing through (matches Figma 104-59258).
function buildMockItems(invoiceId: string): PaymentItem[] {
  return [
    {
      id: `${invoiceId}-ITEM-1`,
      category: '小型工具/物品、電腦/手機週邊、辦公室用品',
      subCategory: '電腦/手機週邊',
      costCenter: '00690',
      account: '613000',
      accountName: '會議相關費用',
      amount: 1000,
      taxRate: 0,
      taxAmount: 0,
      contractRequired: '無須提供',
      contractNumber: '',
    },
    {
      id: `${invoiceId}-ITEM-2`,
      category: '小型工具/物品、電腦/手機週邊、辦公室用品',
      subCategory: '辦公室用品',
      costCenter: '00690',
      account: '613000',
      accountName: '會議相關費用',
      amount: 3000,
      taxRate: 0,
      taxAmount: 0,
      contractRequired: '無須提供',
      contractNumber: '',
    },
    {
      id: `${invoiceId}-ITEM-3`,
      category: '外部研討會/跨組織學習之研討會、宣導活動',
      subCategory: '跨組織學習之研討會、宣導活動-場地費',
      costCenter: '00690',
      account: '655540',
      accountName: '訓練費',
      amount: 4000,
      taxRate: 0,
      taxAmount: 0,
      contractRequired: '是',
      contractNumber: 'CTR-2026-0512',
    },
  ]
}

function rowToInitialData(row: DraftRow): ApplicationInitialData {
  const totalNumeric = Number(row.total.replace(/,/g, '')) || 0
  const invoiceId = `INV-${row.id}-1`
  const items = buildMockItems(invoiceId)
  const invoice: InvoiceRow = {
    id: invoiceId,
    displayId: `${row.id}-1`,
    type: '電子統一發票 (25)',
    voucherNumber: 'BD28114045',
    amount: totalNumeric,
    taxAmount: 0,
    payee: row.applicant,
    date: row.date,
    expanded: true,
    items,
    incomeStatus: 'unfilled',
  }
  return {
    displayId: row.id,
    company: row.company,
    payeeType: row.payeeType === '員工' ? 'employee' : 'vendor',
    reason: row.reason === '-' ? '' : row.reason,
    invoices: [invoice],
  }
}

export default function InvoiceFlow() {
  const [view, setView] = useState<AppView>('home')
  const [initialData, setInitialData] = useState<ApplicationInitialData | undefined>(undefined)

  return (
    <div className="min-h-screen min-w-[1200px] bg-surface-sunken">
      {view === 'home' && (
        <HomePage
          onNewApplication={() => { setInitialData(undefined); setView('application') }}
          onEditApplication={(row) => { setInitialData(rowToInitialData(row)); setView('application') }}
        />
      )}
      {view === 'application' && (
        <ApplicationPage
          onBack={() => setView('home')}
          initialData={initialData}
          onGoToIncomeList={() => setView('incomeList')}
        />
      )}
      {view === 'incomeList' && (
        <IncomeListPage />
      )}
    </div>
  )
}
