import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button,
} from '@qijenchen/design-system'
import type { ReactNode } from 'react'

interface DeletePaymentItemDialogProps {
  trigger: ReactNode
  onConfirm?: () => void
}

export function DeletePaymentItemDialog({ trigger, onConfirm }: DeletePaymentItemDialogProps) {
  const [open, setOpen] = useState(false)

  function handleDelete() {
    onConfirm?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={480} autoHeight>
        <DialogHeader>
          <DialogTitle>是否刪除付款細項</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-body text-fg">
            刪除後將無法復原。刪除付款細項後，相關所得人及請款內容可能一併移除，確定要刪除嗎？
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>保留資料</Button>
          <Button variant="primary" danger onClick={handleDelete}>刪除細項</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
