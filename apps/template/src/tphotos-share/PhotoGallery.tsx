// @story-baseline-allow: filter/sort toolbar row below (px-loose + border-b) is an in-page content
// row (Figma "Filter/Media" bar), not an overlay/popover/dialog chrome header — R9 false-positive.
import { useMemo, useState } from 'react'
import { ArrowDownToLine, ChevronDown, Share2 } from 'lucide-react'
import {
  Button, Checkbox, Tabs, TabsList, TabsTrigger,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@qijenchen/design-system'
import { TPhotosLayout } from './TPhotosLayout'
import { PhotoCard } from './PhotoCard'
import { SharePermissionDialog } from './SharePermissionDialog'
import { INITIAL_PHOTOS, type Photo } from './mock-data'

function groupByDate(photos: Photo[]): { dateGroup: string; items: Photo[] }[] {
  const groups: { dateGroup: string; items: Photo[] }[] = []
  for (const photo of photos) {
    const lastGroup = groups[groups.length - 1]
    if (lastGroup && lastGroup.dateGroup === photo.dateGroup) {
      lastGroup.items.push(photo)
    } else {
      groups.push({ dateGroup: photo.dateGroup, items: [photo] })
    }
  }
  return groups
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [shareTargetIds, setShareTargetIds] = useState<string[]>([])
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const groups = useMemo(() => groupByDate(photos), [photos])
  const shareTargets = useMemo(
    () => photos.filter((p) => shareTargetIds.includes(p.id)),
    [photos, shareTargetIds],
  )

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleGroupSelect(group: { items: Photo[] }) {
    const groupIds = group.items.map((p) => p.id)
    const allSelected = groupIds.every((id) => selectedIds.includes(id))
    setSelectedIds((prev) =>
      allSelected ? prev.filter((id) => !groupIds.includes(id)) : [...new Set([...prev, ...groupIds])],
    )
  }

  function openShareForSelection() {
    setShareTargetIds(selectedIds)
    setShareDialogOpen(true)
  }

  function openShareForOne(photo: Photo) {
    setShareTargetIds([photo.id])
    setShareDialogOpen(true)
  }

  function confirmShare(isPublic: boolean) {
    setPhotos((prev) =>
      prev.map((p) => (shareTargetIds.includes(p.id) ? { ...p, visibility: isPublic ? 'public' : 'private' } : p)),
    )
    setShareDialogOpen(false)
    setSelectedIds([])
  }

  return (
    <TPhotosLayout>
      <div className="flex flex-col h-full">
        <div className="px-[var(--layout-space-loose)] pt-[var(--layout-space-loose)]">
          <h1 className="text-h4 font-medium text-fg mb-[var(--layout-space-tight)]">All Media</h1>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Media</TabsTrigger>
              <TabsTrigger value="photo">Photo</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] border-b border-divider">
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" endIcon={ChevronDown}>
                Sort by: New to Old
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>New to Old</DropdownMenuItem>
              <DropdownMenuItem>Old to New</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 overflow-auto p-[var(--layout-space-loose)] flex flex-col gap-[var(--layout-space-loose)]">
          {groups.map((group) => (
            <div key={group.dateGroup} className="flex flex-col gap-[var(--layout-space-tight)]">
              <div className="flex items-center gap-[var(--layout-space-tight)]">
                <Checkbox
                  checked={group.items.every((p) => selectedIds.includes(p.id))}
                  onCheckedChange={() => toggleGroupSelect(group)}
                  aria-label={`選取 ${group.dateGroup} 全部`}
                />
                <span className="text-body font-medium text-fg">{group.dateGroup}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[var(--layout-space-tight)]">
                {group.items.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    selected={selectedIds.includes(photo.id)}
                    selectionActive={selectedIds.length > 0}
                    onToggleSelect={toggleSelect}
                    onShareOne={openShareForOne}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedIds.length > 0 && (
          <div className="sticky bottom-0 bg-surface border-t border-divider flex items-center gap-[var(--layout-space-tight)] px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
            <Checkbox
              checked={selectedIds.length === photos.length}
              onCheckedChange={() =>
                setSelectedIds(selectedIds.length === photos.length ? [] : photos.map((p) => p.id))
              }
              aria-label="全選"
            />
            <span className="text-body text-fg">Select all</span>
            <Button variant="secondary" size="sm" startIcon={ArrowDownToLine}>
              Download
            </Button>
            <Button variant="primary" size="sm" startIcon={Share2} onClick={openShareForSelection}>
              Share
            </Button>
            <div className="flex-1" />
            <span className="text-body text-fg-secondary">{selectedIds.length} selected</span>
          </div>
        )}
      </div>

      <SharePermissionDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        targetPhotos={shareTargets}
        onConfirm={confirmShare}
      />
    </TPhotosLayout>
  )
}
