import { Link, useLocation } from 'react-router-dom'
import { NavigationMenu } from './NavigationMenu.jsx'

export function Header({ onResetClick, hasData }) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  const handleLogoClick = (e) => {
    if (isHomePage && hasData) {
      e.preventDefault()
      onResetClick?.()
    }
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
            onClick={handleLogoClick}
          >
            <img 
              src="/logo.svg" 
              alt="Grafico Logo" 
              className="h-8 sm:h-10 w-auto"
            />
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
              Grafico
            </h1>
          </Link>
          <NavigationMenu />
        </div>
        {isHomePage && (
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            統計データから美しいグラフを生成
          </p>
        )}
      </div>
    </header>
  )
}
