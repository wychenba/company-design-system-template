import { useEffect, useState } from 'react'
import { ChevronDown, Users } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogClose,
  Button, Avatar, Switch, ItemSuffix,
} from '@qijenchen/design-system'
import { OWNER, type Photo } from './mock-data'

function computeInitialIsPublic(photos: Photo[]): boolean {
  if (photos.length === 0) return true
  const publicCount = photos.filter((p) => p.visibility === 'public').length
  const privateCount = photos.length - publicCount
  if (publicCount !== privateCount) return publicCount > privateCount
  // Tie → 以第一張為準
  return photos[0].visibility === 'public'
}

interface SharePermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetPhotos: Photo[]
  onConfirm: (isPublic: boolean) => void
}

export function SharePermissionDialog({ open, onOpenChange, targetPhotos, onConfirm }: SharePermissionDialogProps) {
  const [isPublic, setIsPublic] = useState(true)

  useEffect(() => {
    if (open) setIsPublic(computeInitialIsPublic(targetPhotos))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const count = targetPhotos.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent autoHeight maxWidth={640}>
        <DialogHeader>
          <DialogTitle>Share {count} item{count > 1 ? 's' : ''}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-[var(--layout-space-loose)]">
            <div className="text-body font-medium">Members</div>

            {/* Owner row — Family 2 reading:prefix Avatar 40 + content(title+desc)+ suffix disabled role pill */}
            <div className="flex items-start gap-[var(--layout-space-tight)]">
              <Avatar size={40} src={OWNER.avatarSrc} alt={OWNER.name} />
              <div className="min-w-0 flex-1">
                <div className="text-body font-medium">{OWNER.name}</div>
                <div className="mt-[var(--item-gap-label-desc-scanning)] text-caption text-fg-secondary truncate">
                  {OWNER.meta}
                </div>
              </div>
              <ItemSuffix>
                <Button variant="secondary" size="sm" endIcon={ChevronDown} disabled>
                  Owner
                </Button>
              </ItemSuffix>
            </div>

            <div className="border-t border-divider" />

            {/* View Permission row — prefix icon(blue circle)+ content(title+desc)+ suffix Switch */}
            <div className="flex items-start gap-[var(--layout-space-tight)]">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary shrink-0">
                <Users size={20} className="text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-body font-medium">View Permission</div>
                <div className="mt-[var(--item-gap-label-desc-scanning)] text-caption text-fg-secondary">
                  {isPublic
                    ? 'Members of Organizations can view and access your photos.'
                    : 'Only you can view and access these photos.'}
                </div>
              </div>
              <ItemSuffix>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} aria-label="View Permission" />
              </ItemSuffix>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="tertiary">Cancel</Button>
          </DialogClose>
          <Button variant="primary" onClick={() => onConfirm(isPublic)}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
