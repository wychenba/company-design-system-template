import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, Button,
} from '@qijenchen/design-system'
import type { ReactNode } from 'react'

interface CancelApplicationDialogProps {
  trigger: ReactNode
  onConfirm?: () => void
}

export function CancelApplicationDialog({ trigger, onConfirm }: CancelApplicationDialogProps) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={480}>
        <DialogHeader>
          <DialogTitle>是否取消申請</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-body text-fg">
            您尚未儲存目前填寫的內容。若取消申請，已填寫的資料將無法保留，是否仍要取消？
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>繼續編輯</Button>
          <Button variant="primary" danger onClick={() => { onConfirm?.(); setOpen(false) }}>
            取消申請
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
