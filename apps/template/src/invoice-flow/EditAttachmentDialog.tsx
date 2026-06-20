import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button, Field, FieldLabel, Input, RadioGroup, RadioGroupItem, FileUpload, FileItem,
} from '@qijenchen/design-system'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface EditAttachmentDialogProps {
  trigger: ReactNode
  initialType?: string
  initialDescription?: string
  initialFileName?: string
  onConfirm?: (updated: { type: string; description: string; fileName: string }) => void
}

interface UploadingFile {
  name: string
  status: 'uploading' | 'completed'
  progress: number
}

const TYPE_VALUE: Record<string, 'invoice' | 'auxiliary'> = {
  '發票': 'invoice',
  '輔助文件': 'auxiliary',
}

const TYPE_LABEL: Record<string, string> = {
  invoice: '發票',
  auxiliary: '輔助文件',
}

export function EditAttachmentDialog({
  trigger,
  initialType = '發票',
  initialDescription = '',
  initialFileName = '',
  onConfirm,
}: EditAttachmentDialogProps) {
  const [open, setOpen] = useState(false)
  const [attachType, setAttachType] = useState<'invoice' | 'auxiliary'>(TYPE_VALUE[initialType] ?? 'invoice')
  const [description, setDescription] = useState(initialDescription)
  const [existingFile, setExistingFile] = useState(initialFileName)
  const [newFiles, setNewFiles] = useState<UploadingFile[]>([])

  function reset() {
    setAttachType(TYPE_VALUE[initialType] ?? 'invoice')
    setDescription(initialDescription)
    setExistingFile(initialFileName)
    setNewFiles([])
  }

  function handleUpload(picked: File[]) {
    const incoming = picked.map((f) => ({ name: f.name, status: 'uploading' as const, progress: 30 }))
    setNewFiles((prev) => [...prev, ...incoming])
    incoming.forEach((f) => {
      setTimeout(() => {
        setNewFiles((prev) =>
          prev.map((cur) => (cur.name === f.name ? { ...cur, status: 'completed', progress: 100 } : cur)),
        )
      }, 700)
    })
  }

  function removeNewFile(name: string) {
    setNewFiles((prev) => prev.filter((f) => f.name !== name))
  }

  function handleConfirm() {
    const latestFile = newFiles.find((f) => f.status === 'completed')?.name ?? existingFile
    onConfirm?.({ type: TYPE_LABEL[attachType], description, fileName: latestFile })
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
      <DialogContent maxWidth={480}>
        <DialogHeader>
          <DialogTitle>編輯附件</DialogTitle>
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

            {/* 上傳新檔案 */}
            <Field>
              <FieldLabel>更換檔案</FieldLabel>
              <FileUpload
                multiple={false}
                accept=".pdf,.png,.jpg,.jpeg"
                maxSize={20 * 1024 * 1024}
                onUpload={handleUpload}
              />
            </Field>

            {/* 現有檔案（若尚未替換） */}
            {existingFile && newFiles.length === 0 && (
              <div className="flex items-center gap-[var(--layout-space-tight)] text-body text-fg-secondary">
                <span className="text-caption">目前檔案：</span>
                <span className="text-body text-fg truncate">{existingFile}</span>
                <Button
                  variant="text"
                  size="xs"
                  iconOnly
                  startIcon={X}
                  aria-label="移除現有檔案"
                  onClick={() => setExistingFile('')}
                />
              </div>
            )}

            {/* 新上傳的檔案 */}
            {newFiles.length > 0 && (
              <div className="flex flex-col gap-[var(--layout-space-tight)]">
                {newFiles.map((f) => (
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
                        onClick={() => removeNewFile(f.name)}
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
          <Button variant="primary" onClick={handleConfirm}>更新</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
