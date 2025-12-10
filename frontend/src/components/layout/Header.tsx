import { Link } from 'react-router-dom'
import { Menu, Sun, Moon, Github } from 'lucide-react'
import { Button } from '../ui/Button'
import { useUIStore } from '../../stores/uiStore'

export function Header() {
  const { theme, toggleTheme, toggleSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-50 bg-dark-surface border-b border-dark-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={toggleSidebar}>
            <Menu className="w-5 h-5" />
          </Button>

          <Link to="/" className="flex items-center gap-2 hover:opacity-90">
            <svg
              className="w-8 h-8"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#ee4c2c"
                d="M16 2.5L4 9.5v13l12 7 12-7v-13L16 2.5zm0 2.31l9.23 5.38v10.62L16 26.19l-9.23-5.38V10.19L16 4.81z"
              />
              <circle fill="#ee4c2c" cx="21" cy="8" r="2" />
              <path
                fill="#ee4c2c"
                d="M16 10c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
              />
            </svg>
            <span className="font-semibold text-lg text-dark-text">
              PyTorch <span className="text-pytorch-500">Academy</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/curriculum"
            className="text-sm text-dark-muted hover:text-dark-text transition-colors"
          >
            Currículo
          </Link>
          <a
            href="https://pytorch.org/docs/stable/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-dark-muted hover:text-dark-text transition-colors"
          >
            Docs PyTorch
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
          <a
            href="https://github.com/pytorch/pytorch"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-dark-muted hover:text-dark-text transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  )
}
