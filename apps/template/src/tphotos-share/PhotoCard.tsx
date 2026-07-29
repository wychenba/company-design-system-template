import { Lock, MoreHorizontal, Share2, Users } from 'lucide-react'
import {
  Checkbox, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
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

        {/* M29 DS anchor preflight — overlay ⋯ trigger 的 owner SSOT 對照:
         *
         * | owner spec                          | canonical sentence                                              | 本處 code                                           |
         * |-------------------------------------|-----------------------------------------------------------------|-----------------------------------------------------|
         * | dropdown-menu.spec.md:34            | 「次要動作集合:卡片右上角 ⋮ 三點選單(複製、刪除、分享、匯出)」      | ✅ 照用 DropdownMenu + DropdownMenuItem              |
         * | dropdown-menu.spec.md:55            | 「DropdownMenuTrigger ← 觸發按鈕(**通常**是 Button)」              | trigger 自刻 overlay chip(「通常」非強制,理由見下)  |
         * | button.spec.md:119                  | 「xs ... **24px 固定**(不隨 density 縮放),配合工具列密集排佈」     | 設計稿 scrim = 14px,DS Button 下限 24px 表達不了     |
         * | item-anatomy.spec.md:411            | 「Inline Action(單一副動作)`ItemInlineAction`(⋯ …)…靶子 ≤ 24px」  | 14px ≤ 24px cap 相符;⋯ 橫向亦是 DS inline-action idiom |
         *
         * 視覺 = Figma 7628:14529(14x14 深色半透明 scrim + 10px 橫向三點),與同卡片的
         * duration badge 共用一套 media-overlay 語言。此處是壓在縮圖上的 overlay,非 row 內
         * 的 action slot,故不套 row-action 的 Button 線。
         */}
        <div
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={`${photo.title} 更多操作`}
                className="grid place-items-center size-3.5 rounded-xs bg-black/70 text-white cursor-pointer"
              >
                <MoreHorizontal size={10} />
              </button>
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
