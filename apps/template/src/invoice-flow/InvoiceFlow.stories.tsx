import type { Meta, StoryObj } from '@storybook/react'
import InvoiceFlow from './InvoiceFlow'

const meta: Meta<typeof InvoiceFlow> = {
  title: 'Apps/template/Invoice_payeelist_v1',
  component: InvoiceFlow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '請款流程 prototype：首頁 → 新建申請單 → 新增請款 → 新增付款細項 → 新增附件 → 填寫補充資訊',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof InvoiceFlow>

export const Default: Story = {
  name: '完整流程',
}
