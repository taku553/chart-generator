import { useRef, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Upload, BarChart3, LineChart, PieChart, Download, Palette, Settings } from 'lucide-react'
import { aggregateDataForPieChart } from '@/lib/dataUtils.js'
import { formatValueWithUnit, generateAxisLabel } from '@/lib/unitUtils.js'

// Chart.jsの必要なコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export function ChartDisplay({ data, chartType, setChartType, onReset, onReconfigure }) {
  const chartRef = useRef(null)

  const chartTypes = [
    { id: 'bar', icon: BarChart3, label: '棒グラフ', component: Bar },
    { id: 'line', icon: LineChart, label: '折れ線グラフ', component: Line },
    { id: 'pie', icon: PieChart, label: '円グラフ', component: Pie }
  ]

  // モノクロ基調のカラーパレット
  const colorPalettes = {
    monochrome: [
      'rgba(0, 0, 0, 0.8)',
      'rgba(64, 64, 64, 0.8)',
      'rgba(128, 128, 128, 0.8)',
      'rgba(160, 160, 160, 0.8)',
      'rgba(192, 192, 192, 0.8)',
      'rgba(224, 224, 224, 0.8)'
    ],
    monochromeLight: [
      'rgba(0, 0, 0, 0.1)',
      'rgba(64, 64, 64, 0.1)',
      'rgba(128, 128, 128, 0.1)',
      'rgba(160, 160, 160, 0.1)',
      'rgba(192, 192, 192, 0.1)',
      'rgba(224, 224, 224, 0.1)'
    ]
  }

  // グラフデータの準備
  const prepareChartData = () => {
    if (!data) return null

    const { labels, values, chartData } = data

    if (chartType === 'pie') {
      // 円グラフの場合は集計データを使用
      const pieData = aggregateDataForPieChart(
        chartData.map(item => ({ [data.xColumn]: item.label, [data.yColumn]: item.y })),
        data.xColumn,
        data.yColumn
      )
      
      return {
        labels: pieData.labels,
        datasets: [{
          data: pieData.values,
          backgroundColor: colorPalettes.monochrome,
          borderColor: colorPalettes.monochrome.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          hoverBackgroundColor: colorPalettes.monochrome.map(color => color.replace('0.8', '0.9')),
          hoverBorderWidth: 3
        }]
      }
    }

    // 棒グラフ・折れ線グラフ用のデータ
    return {
      labels: labels,
      datasets: [{
        label: data.chartTitle || data.yColumn,
        data: values,
        backgroundColor: chartType === 'bar' ? colorPalettes.monochromeLight[0] : 'transparent',
        borderColor: colorPalettes.monochrome[0],
        borderWidth: 2,
        fill: chartType === 'line' ? false : true,
        tension: chartType === 'line' ? 0.4 : 0,
        pointBackgroundColor: chartType === 'line' ? colorPalettes.monochrome[0] : undefined,
        pointBorderColor: chartType === 'line' ? '#ffffff' : undefined,
        pointBorderWidth: chartType === 'line' ? 2 : undefined,
        pointRadius: chartType === 'line' ? 6 : undefined,
        pointHoverRadius: chartType === 'line' ? 8 : undefined,
        hoverBackgroundColor: colorPalettes.monochrome[1],
        hoverBorderColor: colorPalettes.monochrome[0]
      }]
    }
  }

  // グラフオプションの設定
  const getChartOptions = () => {
    const unitSettings = data?.unitSettings || {}
    const xUnit = unitSettings.x || {}
    const yUnit = unitSettings.y || {}
    const displayTitle = data?.chartTitle || data?.yColumn || '値'

    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // デフォルトの凡例を非表示
          position: 'top',
          labels: {
            color: 'rgb(107, 114, 128)',
            font: {
              size: 12,
              family: 'Inter, system-ui, sans-serif'
            },
            padding: 20,
            usePointStyle: true
          }
        },
        title: {
          display: true,
          text: displayTitle,
          color: 'rgb(0, 0, 0)',
          font: {
            size: 16,
            weight: 'bold',
            family: 'Inter, system-ui, sans-serif'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          },
          padding: 12,
          callbacks: {
            label: function(context) {
              let label = ''
              
              if (chartType === 'pie') {
                // 円グラフの場合: データ値のみ表示
                const value = context.parsed
                label = formatValueWithUnit(value, yUnit, true)
              } else {
                // 棒グラフ・折れ線グラフの場合: データ値のみ表示（グラフタイトル名を除外）
                if (context.parsed.y !== null && context.parsed.y !== undefined) {
                  label = formatValueWithUnit(context.parsed.y, yUnit, true)
                }
              }
              return label
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    }

    if (chartType === 'pie') {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          title: {
            display: true,
            text: displayTitle,
            color: 'rgb(0, 0, 0)',
            font: {
              size: 16,
              weight: 'bold',
              family: 'Inter, system-ui, sans-serif'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          legend: {
            display: true, // 円グラフは凡例を表示
            position: 'right',
            labels: {
              color: 'rgb(75, 85, 99)',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              },
              padding: 10,
              usePointStyle: true
            }
          }
        }
      }
    }

    // 棒グラフ・折れ線グラフ用のオプション
    return {
      ...baseOptions,
      scales: {
        x: {
          grid: {
            color: 'rgba(107, 114, 128, 0.1)',
            borderColor: 'rgba(107, 114, 128, 0.2)'
          },
          ticks: {
            color: 'rgb(107, 114, 128)',
            font: {
              size: 11
            },
            maxRotation: 45
          },
          title: {
            display: true,
            text: generateAxisLabel(data?.xColumn || 'X軸', xUnit),
            color: 'rgb(75, 85, 99)',
            font: {
              size: 13,
              weight: 'bold'
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(107, 114, 128, 0.1)',
            borderColor: 'rgba(107, 114, 128, 0.2)'
          },
          ticks: {
            color: 'rgb(107, 114, 128)',
            font: {
              size: 11
            },
            callback: function(value, index, ticks) {
              // 数値のみ表示（単位は軸タイトルに表示）
              return value.toLocaleString()
            }
          },
          title: {
            display: true,
            text: generateAxisLabel(data?.yColumn || 'Y軸', yUnit),
            color: 'rgb(75, 85, 99)',
            font: {
              size: 13,
              weight: 'bold'
            }
          }
        }
      }
    }
  }

  // グラフのダウンロード機能
  const handleDownload = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.canvas
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `chart-${chartType}-${Date.now()}.png`
      link.href = url
      link.click()
    }
  }

  const chartData = prepareChartData()
  const chartOptions = getChartOptions()
  const ChartComponent = chartTypes.find(type => type.id === chartType)?.component

  if (!data || !chartData || !ChartComponent) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">データが読み込まれていません</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Chart Type Selector */}
      <Card className="glass-card stagger-animation">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            グラフの種類を選択
          </CardTitle>
          <CardDescription>
            データに最適なグラフ形式を選んでください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center flex-wrap">
            {chartTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.id}
                  variant={chartType === type.id ? "default" : "outline"}
                  className={`glass-button flex flex-col items-center gap-2 h-auto py-4 px-6 ${
                    chartType === type.id ? 'bg-black text-white hover:bg-gray-800' : ''
                  }`}
                  onClick={() => setChartType(type.id)}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{type.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chart Display */}
      <Card className="glass-card stagger-animation">
        <CardHeader>
          <CardTitle>生成されたグラフ</CardTitle>
          <CardDescription>
            {data.xColumn} × {data.yColumn} ({data.chartData?.length || 0} データポイント)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="chart-container p-6 shadow-inner">
            <div className="h-96 w-full">
              <ChartComponent
                ref={chartRef}
                data={chartData}
                options={chartOptions}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="glass-card stagger-animation">
        <CardHeader>
          <CardTitle>データサマリー</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.chartData?.length || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">データ数</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatValueWithUnit(Math.max(...(data.values || [0])), data.unitSettings?.y || {}, true)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">最大値</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatValueWithUnit(Math.min(...(data.values || [0])), data.unitSettings?.y || {}, true)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">最小値</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatValueWithUnit(
                  (data.values?.reduce((a, b) => a + b, 0) / data.values?.length || 0),
                  data.unitSettings?.y || {},
                  true
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">平均値</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Button 
          variant="outline" 
          className="glass-button" 
          onClick={onReset}
        >
          <Upload className="h-4 w-4 mr-2" />
          ホームに戻る
        </Button>
        <Button 
          variant="outline" 
          className="glass-button" 
          onClick={onReconfigure}
        >
          <Settings className="h-4 w-4 mr-2" />
          条件を変えて再生成
        </Button>
        <Button 
          className="glass-button bg-black text-white hover:bg-gray-800" 
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-2" />
          グラフをダウンロード
        </Button>
      </div>
    </div>
  )
}
