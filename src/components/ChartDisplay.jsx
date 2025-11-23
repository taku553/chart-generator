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

  // Excel風スチールブルー系カラーパレット
  const colorPalettes = {
    // 円グラフ用: 複数色のパレット
    excel: [
      'rgba(68, 114, 196, 0.8)',   // ブルー
      'rgba(237, 125, 49, 0.8)',   // オレンジ
      'rgba(165, 165, 165, 0.8)',  // グレー
      'rgba(255, 192, 0, 0.8)',    // イエロー
      'rgba(91, 155, 213, 0.8)',   // ライトブルー
      'rgba(112, 173, 71, 0.8)',   // グリーン
      'rgba(38, 68, 120, 0.8)',    // ダークブルー
      'rgba(158, 72, 14, 0.8)',    // ブラウン
      'rgba(99, 99, 99, 0.8)',     // ダークグレー
      'rgba(153, 115, 0, 0.8)'     // ダークイエロー
    ],
    // 棒グラフ・折れ線グラフ用: スチールブルー単色
    primary: 'rgba(68, 114, 196, 1)',      // 境界線・ライン用
    primaryLight: 'rgba(68, 114, 196, 0.6)' // 塗りつぶし用
  }

  // グラフデータの準備
  const prepareChartData = () => {
    if (!data) return null

    const { labels, values, chartData } = data

    if (chartType === 'pie') {
      // 円グラフの場合は集計データを使用（上位10個 + その他）
      const pieData = aggregateDataForPieChart(
        chartData.map(item => ({ [data.xColumn]: item.label, [data.yColumn]: item.y })),
        data.xColumn,
        data.yColumn,
        {
          maxSlices: 10,        // 最大10個まで表示
          minPercentage: 2,     // 2%未満は「その他」に統合
          showOthers: true,     // 「その他」を表示
          parenthesesMode: data.parenthesesMode || 'positive' // 括弧解釈モードを渡す
        }
      )
      
      return {
        labels: pieData.labels,
        datasets: [{
          data: pieData.values,
          backgroundColor: colorPalettes.excel,
          borderColor: colorPalettes.excel.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          hoverBackgroundColor: colorPalettes.excel.map(color => color.replace('0.8', '0.95')),
          hoverBorderWidth: 3
        }],
        pieData // 「その他」の詳細情報用に保持
      }
    }

    // 棒グラフ・折れ線グラフ用のデータ
    return {
      labels: labels,
      datasets: [{
        label: data.chartTitle || data.yColumn,
        data: values,
        backgroundColor: chartType === 'bar' ? colorPalettes.primaryLight : 'transparent',
        borderColor: colorPalettes.primary,
        borderWidth: 2,
        fill: chartType === 'line' ? false : true,
        tension: chartType === 'line' ? 0.4 : 0,
        pointBackgroundColor: chartType === 'line' ? colorPalettes.primary : undefined,
        pointBorderColor: chartType === 'line' ? '#ffffff' : undefined,
        pointBorderWidth: chartType === 'line' ? 2 : undefined,
        pointRadius: chartType === 'line' ? 6 : undefined,
        pointHoverRadius: chartType === 'line' ? 8 : undefined,
        hoverBackgroundColor: chartType === 'bar' ? 'rgba(68, 114, 196, 0.8)' : undefined,
        hoverBorderColor: colorPalettes.primary
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
                // 円グラフの場合: データ値とパーセンテージを表示
                const value = context.parsed
                const dataIndex = context.dataIndex
                const chartData = context.chart.data
                const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                
                label = `${formatValueWithUnit(value, yUnit, true)} (${percentage}%)`
                
                return label
              } else {
                // 棒グラフ・折れ線グラフの場合: データ値のみ表示（グラフタイトル名を除外）
                if (context.parsed.y !== null && context.parsed.y !== undefined) {
                  label = formatValueWithUnit(context.parsed.y, yUnit, true)
                }
              }
              return label
            },
            afterLabel: function(context) {
              // 円グラフで「その他」の場合、含まれる項目の詳細を表示
              if (chartType === 'pie' && context.label === 'その他') {
                const pieData = prepareChartData()?.pieData
                if (pieData?.hasOthers) {
                  const othersItem = pieData.chartData.find(item => item.isOthers)
                  if (othersItem) {
                    const itemsPreview = othersItem.items.slice(0, 5).join(', ')
                    const moreText = othersItem.items.length > 5 ? ` 他${othersItem.items.length - 5}件` : ''
                    return `\n含まれる項目 (${othersItem.itemCount}件):\n${itemsPreview}${moreText}`
                  }
                }
              }
              return ''
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

  // 中央値を計算する関数
  const calculateMedian = (values) => {
    if (!values || values.length === 0) return 0
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    
    if (sorted.length % 2 === 0) {
      // 偶数個の場合は中央2つの平均
      return (sorted[mid - 1] + sorted[mid]) / 2
    } else {
      // 奇数個の場合は中央の値
      return sorted[mid]
    }
  }

  // グラフのダウンロード機能（白背景で出力）
  const handleDownload = () => {
    if (chartRef.current) {
      const originalCanvas = chartRef.current.canvas
      
      // オフスクリーンキャンバスを作成
      const offscreenCanvas = document.createElement('canvas')
      offscreenCanvas.width = originalCanvas.width
      offscreenCanvas.height = originalCanvas.height
      
      const ctx = offscreenCanvas.getContext('2d')
      
      // 白背景を描画
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      
      // 元のグラフを白背景の上に描画
      ctx.drawImage(originalCanvas, 0, 0)
      
      // 白背景付きの画像をダウンロード
      const url = offscreenCanvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `chart-${chartType}-${Date.now()}.png`
      link.href = url
      link.click()
    }
  }

  // データ数に応じた最小幅を計算する関数
  const calculateMinWidth = (dataCount) => {
    // データ1つあたり40px以上確保、最小800px
    const minWidthPerData = 40 // px
    return Math.max(800, dataCount * minWidthPerData)
  }

  const chartData = prepareChartData()
  const chartOptions = getChartOptions()
  const ChartComponent = chartTypes.find(type => type.id === chartType)?.component
  
  // 棒グラフと折れ線グラフの場合のみ動的幅を計算
  const minChartWidth = ['bar', 'line'].includes(chartType) 
    ? calculateMinWidth(data.chartData?.length || 0)
    : null

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
          <div className="chart-container p-6 shadow-inner overflow-x-auto">
            <div 
              className="h-96" 
              style={{ 
                minWidth: minChartWidth ? `${minChartWidth}px` : '100%',
                width: minChartWidth ? `${minChartWidth}px` : '100%'
              }}
            >
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
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
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatValueWithUnit(
                  calculateMedian(data.values),
                  data.unitSettings?.y || {},
                  true
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">中央値</p>
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
