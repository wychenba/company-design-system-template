import type { ReactNode } from 'react'
import { Separator } from '@qijenchen/design-system'
import {
  Home, FileText, FileInput, ClipboardList,
  FileSearch, ClipboardCheck, BookOpen, Megaphone,
  Briefcase, Shield, type LucideIcon,
} from 'lucide-react'

interface AppLayoutProps {
  children: ReactNode
  activeMenu: string
}

const MENU_SECTIONS: {
  label?: { text: string; icon: LucideIcon }
  items: { id: string; label: string; icon: LucideIcon }[]
}[] = [
  {
    items: [{ id: '首頁', label: '首頁', icon: Home }],
  },
  {
    label: { text: '工作區', icon: Briefcase },
    items: [
      { id: '暫存申請單', label: '暫存申請單', icon: FileText },
      { id: '批次匯入紀錄', label: '批次匯入紀錄', icon: FileInput },
      { id: '我的工作清單', label: '我的工作清單', icon: ClipboardList },
    ],
  },
  {
    label: { text: '管理', icon: Shield },
    items: [
      { id: '查看申請單', label: '查看申請單', icon: FileSearch },
      { id: '審核工作清單', label: '審核工作清單', icon: ClipboardCheck },
      { id: '秘書工作清單', label: '秘書工作清單', icon: BookOpen },
    ],
  },
  {
    items: [{ id: '使用者體驗調查', label: '使用者體驗調查', icon: Megaphone }],
  },
]

function MenuItem({ label, icon: Icon, active }: { label: string; icon: LucideIcon; active: boolean }) {
  return (
    <div
      className={`flex items-center h-9 gap-[var(--layout-space-tight)] px-[var(--layout-space-loose)] cursor-pointer text-body-lg font-medium rounded-sm transition-colors ${
        active ? 'bg-surface-hovered text-fg' : 'text-fg-secondary hover:bg-surface-hovered hover:text-fg'
      }`}
    >
      <Icon size={20} className="shrink-0" />
      {label}
    </div>
  )
}

function SectionLabel({ text, icon: Icon }: { text: string; icon: LucideIcon }) {
  return (
    <div className="flex items-center h-9 gap-[var(--layout-space-loose)] px-[var(--layout-space-loose)] text-body-lg font-medium text-fg-secondary">
      <Icon size={20} className="shrink-0" />
      {text}
    </div>
  )
}

export function AppLayout({ children, activeMenu }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      {/* Top header */}
      <header className="bg-surface border-b border-divider flex items-center h-14 px-[var(--layout-space-loose)] shrink-0">
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
                <SectionLabel text={section.label.text} icon={section.label.icon} />
              )}
              {section.items.map((item) => (
                <MenuItem key={item.id} label={item.label} icon={item.icon} active={item.id === activeMenu} />
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
