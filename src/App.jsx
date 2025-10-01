import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload.jsx'
import { ChartDisplay } from '@/components/ChartDisplay.jsx'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [chartType, setChartType] = useState('bar')

  const handleDataLoaded = (chartData) => {
    setData(chartData)
  }

  const handleReset = () => {
    setData(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold gradient-text">
            Chart Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            統計データから美しいグラフを生成
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!data ? (
          <FileUpload onDataLoaded={handleDataLoaded} />
        ) : (
          <ChartDisplay 
            data={data} 
            chartType={chartType} 
            setChartType={setChartType}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2025 Chart Generator. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}



export default App
