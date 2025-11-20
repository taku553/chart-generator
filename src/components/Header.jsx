import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { NavigationMenu } from './NavigationMenu.jsx'
import { AuthModal } from './AuthModal.jsx'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from './ui/button.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.jsx'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx'
import { LogIn, LogOut, User as UserIcon, Crown } from 'lucide-react'

export function Header({ onResetClick, hasData }) {
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'
  const { user, logOut, loading } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const handleLogoClick = (e) => {
    if (isHomePage && hasData) {
      e.preventDefault()
      onResetClick?.()
    }
  }

  const handleLogout = async () => {
    try {
      await logOut()
    } catch (err) {
      console.error('ログアウトエラー:', err)
    }
  }

  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName.charAt(0).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
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
          
          <div className="flex items-center gap-4">
            <NavigationMenu />
            
            {/* 認証ボタン */}
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.photoURL} alt={user.displayName || user.email} />
                          <AvatarFallback>{getUserInitial()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.displayName || 'ユーザー'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/mypage')}>
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>マイページ</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled className="cursor-default">
                        <Crown className="mr-2 h-4 w-4" />
                        <span className="text-foreground">プラン: {user.plan === 'free' ? '無料' : '有料'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>ログアウト</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button onClick={() => setAuthModalOpen(true)} variant="default">
                    <LogIn className="mr-2 h-4 w-4" />
                    ログイン
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        {isHomePage && (
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            統計データから美しいグラフを生成
          </p>
        )}
      </div>

      {/* 認証モーダル */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </header>
  )
}
