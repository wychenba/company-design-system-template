import type { ReactNode } from 'react'
import { Avatar, Separator } from '@qijenchen/design-system'
import { ChevronDown, Folder, Globe, Images, Menu, Users } from 'lucide-react'

interface TPhotosLayoutProps {
  children: ReactNode
}

const NAV_SECTIONS: {
  label: string
  items: { id: string; label: string; icon: typeof Images; active?: boolean }[]
}[] = [
  { label: 'My Albums', items: [{ id: 'all-media', label: 'All Media', icon: Images, active: true }] },
  { label: 'My Organization', items: [{ id: 'uxp', label: 'UXP', icon: Folder }] },
  { label: 'Shared', items: [
    { id: 'csd-02', label: 'CSD-02', icon: Users },
    { id: 'hrsd', label: 'HRSD', icon: Users },
  ] },
]

export function TPhotosLayout({ children }: TPhotosLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-surface border-b border-divider flex items-center h-14 px-[var(--layout-space-loose)] shrink-0 gap-[var(--layout-space-tight)]">
        <Menu size={20} className="text-fg-secondary" />
        <div className="flex items-center justify-center size-8 rounded bg-primary shrink-0">
          <Images size={18} className="text-white" />
        </div>
        <span className="text-body-lg font-medium text-fg">tPhotos</span>
        <div className="flex-1" />
        <div className="flex items-center gap-[var(--layout-space-tight)]">
          <Globe size={18} className="text-fg-secondary" />
          <span className="text-body text-fg-secondary">EN</span>
          <ChevronDown size={16} className="text-fg-secondary" />
          <Separator orientation="vertical" className="h-5 mx-1" />
          <Avatar size={28} src="https://i.pravatar.cc/80?u=wychenba-150986" alt="Wendy Chen" />
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="w-70 border-r border-divider overflow-y-auto shrink-0 p-[var(--layout-space-tight)]">
          {NAV_SECTIONS.map((section, si) => (
            <div key={section.label} className={si > 0 ? 'mt-[var(--layout-space-loose)]' : ''}>
              <div className="h-9 flex items-center px-[var(--layout-space-tight)] text-caption font-medium text-fg-secondary">
                {section.label}
              </div>
              {section.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center h-9 gap-[var(--layout-space-tight)] px-[var(--layout-space-tight)] rounded-sm cursor-pointer text-body ${
                    item.active ? 'bg-neutral-selected text-fg font-medium' : 'text-fg-secondary hover:bg-neutral-hover hover:text-fg'
                  }`}
                >
                  <item.icon size={18} className="shrink-0" />
                  {item.label}
                </div>
              ))}
            </div>
          ))}
        </aside>

        <main className="flex-1 min-w-0 bg-surface overflow-auto">{children}</main>
      </div>
    </div>
  )
}
