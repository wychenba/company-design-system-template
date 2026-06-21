import { useState } from 'react'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle,
  Button, FileUpload, FileItem, CircularProgress,
} from '@qijenchen/design-system'
import { toast } from '@qijenchen/design-system'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface BatchImportDialogProps {
  trigger: ReactNode
  onImported?: () => void
}

type Step = 'select' | 'importing' | 'error'

interface UploadingFile {
  name: string
  status: 'uploading' | 'completed'
  progress: number
}

export function BatchImportDialog({ trigger, onImported }: BatchImportDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('select')
  const [file, setFile] = useState<UploadingFile | null>(null)

  function reset() {
    setStep('select')
    setFile(null)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) reset()
  }

  function handleUpload(picked: File[]) {
    if (!picked[0]) return
    const f = picked[0]
    setFile({ name: f.name, status: 'uploading', progress: 30 })
    setTimeout(() => {
      setFile((prev) => prev ? { ...prev, status: 'completed', progress: 100 } : prev)
    }, 700)
  }

  function removeFile() {
    setFile(null)
  }

  function handleImport() {
    if (!file || file.status !== 'completed') return
    setStep('importing')
    // simulate async import
    setTimeout(() => {
      const success = Math.random() > 0.3
      if (success) {
        setOpen(false)
        reset()
        toast({ variant: 'success', title: '批次匯入成功', description: '付款細項已匯入完成。' })
        onImported?.()
      } else {
        setStep('error')
      }
    }, 1800)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {step === 'error' ? (
        <DialogContent maxWidth={480}>
          <DialogHeader>
            <DialogTitle>檔案格式不符</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p className="text-body text-fg">
              您上傳的檔案格式不符，請下載「Excel 範本」，填寫完成後再重新上傳。
            </p>
          </DialogBody>
          <DialogFooter>
            <Button variant="tertiary" onClick={() => handleOpenChange(false)}>取消</Button>
            <Button variant="primary" onClick={() => setStep('select')}>重新上傳</Button>
          </DialogFooter>
        </DialogContent>
      ) : step === 'importing' ? (
        <DialogContent maxWidth={560}>
          <DialogHeader>
            <DialogTitle>批次匯入 Excel 付款細項</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col items-center justify-center gap-[var(--layout-space-tight)] py-[var(--layout-space-loose)]">
              <CircularProgress size={72} aria-label="匯入中" />
              <div className="flex flex-col items-center gap-[var(--layout-space-tight)] text-center">
                <span className="text-h4 font-medium text-fg">檔案匯入中</span>
                <span className="text-body text-fg-secondary">檔案正在匯入中，請稍候。</span>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="tertiary" onClick={() => handleOpenChange(false)}>取消</Button>
            <Button variant="primary" disabled>新增</Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent maxWidth={560}>
          <DialogHeader>
            <DialogTitle>批次匯入 Excel 付款細項</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-[var(--layout-space-loose)]">
              <p className="text-body text-fg">
                請先下載「<span className="text-primary cursor-pointer hover:underline">Excel 付款細項範本</span>」，填寫完成後到此匯入檔案。
              </p>
              <FileUpload
                multiple={false}
                accept=".xlsx,.xls"
                onUpload={handleUpload}
              />
              {file && (
                <FileItem
                  name={file.name}
                  mode="rich"
                  status={file.status}
                  progress={file.progress}
                  actions={
                    <Button
                      variant="text"
                      size="xs"
                      iconOnly
                      startIcon={X}
                      aria-label={`移除 ${file.name}`}
                      onClick={removeFile}
                    />
                  }
                />
              )}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="tertiary" onClick={() => handleOpenChange(false)}>取消</Button>
            <Button
              variant="primary"
              disabled={!file || file.status !== 'completed'}
              onClick={handleImport}
            >
              匯入
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}
