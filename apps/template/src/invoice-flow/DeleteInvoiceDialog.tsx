import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button,
} from '@qijenchen/design-system'
import type { ReactNode } from 'react'

interface DeleteInvoiceDialogProps {
  trigger: ReactNode
  displayId: string
  onConfirm?: () => void
}

export function DeleteInvoiceDialog({ trigger, displayId, onConfirm }: DeleteInvoiceDialogProps) {
  const [open, setOpen] = useState(false)

  function handleDelete() {
    onConfirm?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={480}>
        <DialogHeader>
          <DialogTitle>是否刪除 {displayId}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <p className="text-body text-fg">
            刪除後將無法復原。若此發票已綁定請款單，相關請款資料可能受到影響，確定要刪除嗎？
          </p>
        </DialogBody>

        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>保留資料</Button>
          <Button variant="primary" danger onClick={handleDelete}>刪除發票</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
