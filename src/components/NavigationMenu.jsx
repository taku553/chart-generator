import { Link } from 'react-router-dom'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Menu } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function NavigationMenu() {
  const { t } = useLanguage()
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Menu className="h-6 w-6" />
          <span className="sr-only">{t('menu.open')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{t('menu.title')}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          <Link
            to="/updates"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg font-medium">{t('menu.updates')}</span>
          </Link>
          <Link
            to="/pricing"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-lg font-medium">{t('menu.pricing')}</span>
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 dark:text-gray-600 cursor-not-allowed">
            <span className="text-lg font-medium">{t('menu.howToUse')}</span>
            <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {t('menu.comingSoon')}
            </span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 dark:text-gray-600 cursor-not-allowed">
            <span className="text-lg font-medium">{t('menu.faq')}</span>
            <span className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {t('menu.comingSoon')}
            </span>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}