import { useState } from 'react'
import { HomePage } from './HomePage'
import { ApplicationPage } from './ApplicationPage'

export type AppView = 'home' | 'application'

export default function InvoiceFlow() {
  const [view, setView] = useState<AppView>('home')

  return (
    <div className="min-h-screen min-w-[1200px] bg-surface-sunken">
      {view === 'home' && <HomePage onNewApplication={() => setView('application')} />}
      {view === 'application' && <ApplicationPage onBack={() => setView('home')} />}
    </div>
  )
}
