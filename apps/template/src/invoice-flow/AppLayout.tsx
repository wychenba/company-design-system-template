import type { ReactNode } from 'react'
import { Separator } from '@qijenchen/design-system'

interface AppLayoutProps {
  children: ReactNode
  activeMenu: string
}

const MENU_SECTIONS = [
  {
    label: null,
    items: [{ id: '首頁', label: '首頁' }],
  },
  {
    label: '工作區',
    items: [
      { id: '暫存申請單', label: '暫存申請單' },
      { id: '批次匯入紀錄', label: '批次匯入紀錄' },
      { id: '我的工作清單', label: '我的工作清單' },
    ],
  },
  {
    label: '管理',
    items: [
      { id: '查看申請單', label: '查看申請單' },
      { id: '審核工作清單', label: '審核工作清單' },
      { id: '秘書工作清單', label: '秘書工作清單' },
    ],
  },
  {
    label: null,
    items: [{ id: '使用者體驗調查', label: '使用者體驗調查' }],
  },
]

function MenuItem({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`flex items-center h-9 px-[var(--layout-space-loose)] cursor-pointer text-body-lg font-medium rounded-sm transition-colors ${
        active ? 'bg-surface-hovered text-fg' : 'text-fg-secondary hover:bg-surface-hovered'
      }`}
    >
      {label}
    </div>
  )
}

export function AppLayout({ children, activeMenu }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      {/* Top header */}
      <header className="bg-surface border-b border-divider flex items-center h-16 px-[var(--layout-space-loose)] shrink-0">
        <div className="flex items-center gap-[var(--layout-space-tight)]">
          <div className="flex items-center justify-center size-8 rounded border border-divider overflow-hidden shrink-0">
            <span className="text-caption font-bold text-primary">R</span>
          </div>
          <span className="text-body-lg font-medium text-fg">RFC/PettyCash</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-[var(--layout-space-tight)]">
          <span className="text-body text-fg-secondary">使用手冊</span>
          <Separator orientation="vertical" style={{ height: 20 }} />
          <span className="text-body text-fg-secondary">繁體中文</span>
          <div className="size-8 rounded-full bg-primary-subtle flex items-center justify-center">
            <span className="text-caption font-medium text-primary">林</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Left sidebar */}
        <aside className="w-70 border-r border-divider overflow-y-auto shrink-0 py-[var(--layout-space-tight)]">
          {MENU_SECTIONS.map((section, si) => (
            <div key={si}>
              {si > 0 && <Separator className="my-[var(--layout-space-tight)]" />}
              {section.label && (
                <div className="px-[var(--layout-space-loose)] text-caption text-fg-secondary mb-[var(--layout-space-tight)]">
                  {section.label}
                </div>
              )}
              {section.items.map((item) => (
                <MenuItem key={item.id} label={item.label} active={item.id === activeMenu} />
              ))}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 bg-surface-sunken overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
