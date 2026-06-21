import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button, Field, FieldLabel, Input, RadioGroup, RadioGroupItem, FileUpload, FileItem,
} from '@qijenchen/design-system'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export interface NewAttachment {
  type: string
  description: string
  name: string
}

interface UploadingFile {
  name: string
  status: 'uploading' | 'completed'
  progress: number
}

interface AddAttachmentDialogProps {
  trigger: ReactNode
  onConfirm?: (attachments: NewAttachment[]) => void
}

const TYPE_LABEL: Record<string, string> = {
  invoice: '發票',
  auxiliary: '輔助文件',
}

export function AddAttachmentDialog({ trigger, onConfirm }: AddAttachmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [attachType, setAttachType] = useState<'invoice' | 'auxiliary'>('invoice')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<UploadingFile[]>([])

  function reset() {
    setAttachType('invoice')
    setDescription('')
    setFiles([])
  }

  // Simulate an upload: file lands as "uploading", then settles to "completed".
  function handleUpload(picked: File[]) {
    const incoming = picked.map((f) => ({ name: f.name, status: 'uploading' as const, progress: 30 }))
    setFiles((prev) => [...prev, ...incoming])
    incoming.forEach((f) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((cur) => (cur.name === f.name ? { ...cur, status: 'completed', progress: 100 } : cur)),
        )
      }, 700)
    })
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name))
  }

  const hasReadyFile = files.some((f) => f.status === 'completed')

  function handleConfirm() {
    const ready = files.filter((f) => f.status === 'completed')
    onConfirm?.(ready.map((f) => ({ type: TYPE_LABEL[attachType], description, name: f.name })))
    setOpen(false)
    reset()
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent maxWidth={480} autoHeight>
        <DialogHeader>
          <DialogTitle>新增附件</DialogTitle>
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

            {/* 上傳檔案 — consumes DS FileUpload drop zone */}
            <Field>
              <FieldLabel required>上傳檔案</FieldLabel>
              <FileUpload
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                maxSize={20 * 1024 * 1024}
                onUpload={handleUpload}
              />
            </Field>

            {/* Selected files — DS FileItem with upload status */}
            {files.length > 0 && (
              <div className="flex flex-col gap-[var(--layout-space-tight)]">
                {files.map((f) => (
                  <FileItem
                    key={f.name}
                    name={f.name}
                    mode="rich"
                    status={f.status}
                    progress={f.progress}
                    actions={
                      <Button
                        variant="text"
                        size="xs"
                        iconOnly
                        startIcon={X}
                        aria-label={`移除 ${f.name}`}
                        onClick={() => removeFile(f.name)}
                      />
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="tertiary" onClick={() => handleOpenChange(false)}>取消</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!hasReadyFile}>新增</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
