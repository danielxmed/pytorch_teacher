import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useUIStore } from '../../stores/uiStore'

export function Layout() {
  const { sidebarOpen } = useUIStore()

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      <div className="flex">
        <Sidebar />
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-4xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
