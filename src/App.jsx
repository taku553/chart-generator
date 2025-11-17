import { Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header.jsx'
import { SocialLinks } from '@/components/SocialLinks.jsx'
import { Home } from '@/pages/Home.jsx'
import { UpdatesPage } from '@/pages/UpdatesPage.jsx'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/updates" element={<UpdatesPage />} />
      </Routes>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <SocialLinks />
          <p className="text-center text-gray-600 dark:text-gray-300">
            &copy; 2025 Grafico. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
