import { Globe } from 'lucide-react'
import { Button } from './ui/button.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu.jsx'
import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <div className="flex items-center gap-1">
            <Globe className="h-5 w-5" />
            <span className="text-xs font-medium">
              {language === 'ja' ? 'JP' : 'EN'}
            </span>
          </div>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => language !== 'ja' && toggleLanguage()}
          className={language === 'ja' ? 'bg-gray-100 dark:bg-gray-800' : ''}
        >
          <span className="mr-2">🇯🇵</span>
          日本語
          {language === 'ja' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => language !== 'en' && toggleLanguage()}
          className={language === 'en' ? 'bg-gray-100 dark:bg-gray-800' : ''}
        >
          <span className="mr-2">🇺🇸</span>
          English
          {language === 'en' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
