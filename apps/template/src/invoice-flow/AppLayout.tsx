import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  AppShell,
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger,
  Button, Avatar, Separator, Toaster,
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuLabel, DropdownMenuItem,
} from '@qijenchen/design-system'
import { ChromeHeader } from '@qijenchen/design-system/patterns/header-canonical'
import {
  Home, FileText, FileInput, ClipboardList,
  FileSearch, ClipboardCheck, BookOpen, Megaphone,
  Building2, Globe, ChevronDown, User, Settings, LogOut, type LucideIcon,
} from 'lucide-react'
import { showToast } from './useToast'

interface AppLayoutProps {
  children: ReactNode
  activeMenu: string
}

const MENU_SECTIONS: {
  label?: string
  items: { id: string; label: string; icon: LucideIcon }[]
}[] = [
  {
    items: [{ id: '首頁', label: '首頁', icon: Home }],
  },
  {
    label: '工作區',
    items: [
      { id: '暫存申請單', label: '暫存申請單', icon: FileText },
      { id: '批次匯入紀錄', label: '批次匯入紀錄', icon: FileInput },
      { id: '我的工作清單', label: '我的工作清單', icon: ClipboardList },
    ],
  },
  {
    label: '管理',
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

// Left nav — consumes Sidebar primitive. Brand + account live in the global
// header (primary-header mode), so the sidebar carries navigation only.
function InvoiceSidebar() {
  return (
    <Sidebar collapsible="icon" viewportInsetTop="var(--chrome-header-height)">
      <SidebarContent>
        {MENU_SECTIONS.map((section, si) => (
          <SidebarGroup key={section.label ?? `section-${si}`}>
            {section.label && <SidebarGroupLabel>{section.label}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton id={item.id} startIcon={item.icon} tooltip={item.label}>
                      {item.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

// Global top bar — consumes ChromeHeader primitive. leadingRail aligns the
// sidebar collapse trigger with the icon rail; raw <Avatar size={24}> is the
// chrome-header canonical (not ItemAvatar).
function GlobalHeader() {
  return (
    <ChromeHeader className="bg-surface" leadingRail={<SidebarTrigger />}>
      <div className="flex flex-1 min-w-0 items-center gap-[var(--layout-space-loose)]">
        <div className="flex items-center gap-[var(--layout-space-tight)] min-w-0">
          <div className="flex items-center justify-center size-6 rounded border border-divider overflow-hidden shrink-0">
            <span className="text-caption font-bold text-primary">R</span>
          </div>
          <span className="text-body-lg font-medium text-fg whitespace-nowrap">RFC/PettyCash</span>
        </div>
        <Button variant="text" size="sm" startIcon={Building2} endIcon={ChevronDown} onClick={() => showToast('notImplemented')}>HQ</Button>
      </div>
      <div className="flex items-center gap-[var(--layout-space-loose)]">
        <Button variant="tertiary" size="sm" startIcon={BookOpen} onClick={() => showToast('notImplemented')}>使用手冊</Button>
        <Separator orientation="vertical" style={{ height: 24 }} />
        <Button variant="tertiary" size="sm" startIcon={Globe} endIcon={ChevronDown}>繁體中文</Button>
        <AccountMenu />
      </div>
    </ChromeHeader>
  )
}

// Account entry — chrome header canonical: raw 24px Avatar trigger + DropdownMenu
// (per app-shell account-entry SSOT). ProfileCard is for viewing *others*, not self.
function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="帳號與設定"
          className="flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          <Avatar size={24} alt="林問宜" color="blue" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>林問宜 (023156)</DropdownMenuLabel>
          <DropdownMenuItem startIcon={User}>個人資料</DropdownMenuItem>
          <DropdownMenuItem startIcon={Settings}>設定</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem startIcon={LogOut}>登出</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppLayout({ children, activeMenu }: AppLayoutProps) {
  // Prototype navigation is static (one page per screen); seed active state from
  // the current page so the matching menu item highlights.
  const [activeId, setActiveId] = useState(activeMenu)
  return (
    <SidebarProvider activeId={activeId} onActiveChange={setActiveId}>
      <AppShell
        layout="primary-header"
        globalHeader={<GlobalHeader />}
        sidebar={<InvoiceSidebar />}
      >
        {children}
      </AppShell>
      <Toaster position="bottom-right" />
    </SidebarProvider>
  )
}
