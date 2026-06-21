import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, Button,
} from '@qijenchen/design-system'

interface SubmitSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicationId?: string
  onGoToIncomeList?: () => void
}

export function SubmitSuccessDialog({
  open,
  onOpenChange,
  applicationId = 'PAE20260525001',
  onGoToIncomeList,
}: SubmitSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth={480}>
        <DialogHeader>
          <DialogTitle>申請已送出</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p className="text-body text-fg">
            {applicationId} 申請已送出，此筆申請單需填寫所得人清單，請前往「<span className="font-medium">所得人清單</span>」填寫資訊。
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="tertiary" onClick={() => onOpenChange(false)}>取消</Button>
          <Button variant="primary" onClick={() => { onGoToIncomeList?.(); onOpenChange(false) }}>
            前往所得人清單
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
