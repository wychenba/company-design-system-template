import { toast } from '@qijenchen/design-system'

const TOAST_MESSAGES = {
  addPaymentItem: { success: '付款細項已新增', error: '新增付款細項失敗' },
  importPaymentItems: { success: '批次匯入完成', error: '批次匯入失敗' },
  editPaymentItem: { success: '付款細項已更新', error: '更新付款細項失敗' },
  deletePaymentItem: { success: '付款細項已刪除', error: '刪除付款細項失敗' },
  editAttachment: { success: '附件已更新', error: '更新附件失敗' },
  addAttachment: { success: '附件已上傳', error: '上傳失敗' },
  saveDraft: { success: '已存成草稿', error: '存草稿失敗' },
  incomeQuestionnaire: { success: '所得問券已完成', error: '問券送出失敗' },
  notImplemented: { success: '此階段功能尚未開啟', error: '此階段功能尚未開啟' },
  featureReady: { success: '此功能已經開發', error: '此功能已經開發' },
  deleteReviewer: { success: '已刪除審核人員', error: '刪除審核人員失敗' },
}

export function showToast(key: keyof typeof TOAST_MESSAGES, type: 'success' | 'error' = 'success') {
  const msg = TOAST_MESSAGES[key]
  const variant = (key === 'notImplemented' || key === 'featureReady') ? 'info' : (type === 'success' ? 'success' : 'error')
  toast({ variant, title: msg[type] })
}
