import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription,
  Button, Field, FieldLabel, Input, RadioGroup, RadioGroupItem,
} from '@qijenchen/design-system'
import { Upload } from 'lucide-react'
import type { ReactNode } from 'react'

interface AddAttachmentDialogProps {
  trigger: ReactNode
  onConfirm?: () => void
}

export function AddAttachmentDialog({ trigger, onConfirm }: AddAttachmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [attachType, setAttachType] = useState<'invoice' | 'auxiliary'>('invoice')
  const [description, setDescription] = useState('')

  function handleConfirm() {
    onConfirm?.()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={480}>
        <DialogHeader>
          <DialogTitle>新增附件</DialogTitle>
          <DialogDescription>上傳並說明附件</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            {/* 附件類型 */}
            <Field>
              <FieldLabel required>附件類型</FieldLabel>
              <RadioGroup
                value={attachType}
                onValueChange={(v) => setAttachType(v as 'invoice' | 'auxiliary')}
                className="flex gap-[var(--layout-space-loose)]"
              >
                <RadioGroupItem value="invoice" label="發票" />
                <RadioGroupItem value="auxiliary" label="輔助文件" />
              </RadioGroup>
            </Field>

            {/* 附件說明 */}
            <Field>
              <FieldLabel>附件說明</FieldLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="填寫附件說明"
              />
            </Field>

            {/* Upload area */}
            <div className="border-2 border-dashed border-divider rounded-lg p-[var(--layout-space-loose)] flex flex-col items-center gap-[var(--layout-space-tight)] cursor-pointer hover:bg-surface-hovered transition-colors">
              <Upload className="text-fg-secondary" size={32} />
              <p className="text-body text-fg text-center">點擊或拖曳到此上傳檔案</p>
              <p className="text-caption text-fg-secondary text-center">每個檔案大小不得超過 20 MB</p>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="tertiary" onClick={() => setOpen(false)}>取消</Button>
          <Button variant="primary" onClick={handleConfirm}>新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
