import { Routes, Route, Link } from 'react-router-dom'
import { Header } from '@/components/Header.jsx'
import { SocialLinks } from '@/components/SocialLinks.jsx'
import { ProtectedRoute } from '@/components/ProtectedRoute.jsx'
import { useLanguage } from '@/contexts/LanguageContext'
import { Home } from '@/pages/Home.jsx'
import { UpdatesPage } from '@/pages/UpdatesPage.jsx'
import { MyPage } from '@/pages/MyPage.jsx'
import { ResetPassword } from '@/pages/ResetPassword.jsx'
import { Pricing } from '@/pages/Pricing.jsx'
import { LegalNotice } from '@/pages/LegalNotice.jsx'
import { TermsPage } from '@/pages/TermsPage.jsx'
import { PrivacyPage } from '@/pages/PrivacyPage.jsx'
import './App.css'

function App() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/updates" element={<UpdatesPage />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <SocialLinks />
          <div className="text-center space-y-2">
            <div className="flex justify-center gap-4 text-sm">
              <Link 
                to="/terms" 
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {t('footer.terms')}
              </Link>
              <Link 
                to="/privacy" 
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link 
                to="/legal-notice" 
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {t('footer.legal')}
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
