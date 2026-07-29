import { Lock, MoreVertical, Share2, Users } from 'lucide-react'
import {
  Checkbox, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@qijenchen/design-system'
import type { Photo } from './mock-data'

interface PhotoCardProps {
  photo: Photo
  selected: boolean
  selectionActive: boolean
  onToggleSelect: (id: string) => void
  onShareOne: (photo: Photo) => void
}

export function PhotoCard({ photo, selected, selectionActive, onToggleSelect, onShareOne }: PhotoCardProps) {
  const VisibilityIcon = photo.visibility === 'public' ? Users : Lock

  return (
    // @layout-space-magic-ok: gap-1(4px)card 內文字堆疊(title↔meta row)micro-stack,非跨範疇 consumer layout gap
    <div className="group flex flex-col gap-1">
      <div
        className={`relative aspect-4/3 rounded-md overflow-hidden cursor-pointer ${
          selected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => onToggleSelect(photo.id)}
      >
        <img src={photo.thumbnailUrl} alt={photo.title} className="w-full h-full object-cover" />

        <div
          className={`absolute top-2 left-2 transition-opacity ${
            selected || selectionActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect(photo.id)}
            aria-label={`選取 ${photo.title}`}
            className="bg-surface"
          />
        </div>

        <div
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="xs"
                iconOnly
                startIcon={MoreVertical}
                aria-label={`${photo.title} 更多操作`}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem startIcon={Share2} onSelect={() => onShareOne(photo)}>
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {photo.durationLabel && (
          // @layout-space-magic-ok: px-1.5/py-0.5 是 duration badge 自身 chrome padding(<8px pill),非 consumer layout gap
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-caption">
            {photo.durationLabel}
          </div>
        )}
      </div>

      <div className="text-body truncate" title={photo.title}>
        {photo.title}
      </div>
      {/* @layout-space-magic-ok: gap-1(4px)inline icon↔text pairing,非 consumer layout gap */}
      <div className="flex items-center gap-1 text-caption text-fg-secondary">
        <VisibilityIcon size={14} className="shrink-0" />
        <span className="truncate">{photo.timeLabel}</span>
      </div>
    </div>
  )
}
