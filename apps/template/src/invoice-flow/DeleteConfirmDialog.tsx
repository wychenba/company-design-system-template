import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, Button,
} from '@qijenchen/design-system'
import type { ReactNode } from 'react'

interface DeleteConfirmDialogProps {
  trigger: ReactNode
  title: string
  description: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
}

export function DeleteConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = '刪除',
  cancelLabel = '取消',
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false)

  function handleConfirm() {
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={480} autoHeight>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-body text-fg">{description}</p>
        </DialogBody>
        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>{cancelLabel}</Button>
          <Button variant="primary" danger onClick={handleConfirm}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
