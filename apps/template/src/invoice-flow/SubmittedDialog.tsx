import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button, Alert,
} from '@qijenchen/design-system'
import type { ReactNode } from 'react'

interface SubmittedDialogProps {
  trigger: ReactNode
  requestId?: string
  onGoToIncomeList?: () => void
}

export function SubmittedDialog({
  trigger,
  requestId = 'PAE20260525001',
  onGoToIncomeList,
}: SubmittedDialogProps) {
  const [open, setOpen] = useState(false)

  function handleGoToIncomeList() {
    onGoToIncomeList?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={480}>
        <DialogHeader>
          <DialogTitle>申請已送出</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Alert
            variant="info"
            title="申請已送出"
            description={`${requestId} 申請已送出，此筆申請單需填寫所得人清單，請前往「所得人清單」填寫資訊。`}
          />
        </DialogBody>

        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="primary" onClick={handleGoToIncomeList}>前往所得人清單</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
