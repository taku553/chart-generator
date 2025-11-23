import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartSample = ({ type, title, data, options }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        ...options
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-3 text-gray-800">{title}</h3>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default function ChartTypesDemo() {
  // レーダーチャート
  const radarData = {
    labels: ['速度', '耐久性', '攻撃力', '防御力', '特殊能力'],
    datasets: [{
      label: 'キャラクターA',
      data: [85, 70, 90, 60, 75],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2
    }, {
      label: 'キャラクターB',
      data: [65, 90, 70, 85, 60],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2
    }]
  };

  // 散布図
  const scatterData = {
    datasets: [{
      label: '商品A',
      data: [
        { x: 10, y: 20 }, { x: 15, y: 25 }, { x: 20, y: 30 },
        { x: 25, y: 35 }, { x: 30, y: 28 }, { x: 35, y: 45 }
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.6)'
    }, {
      label: '商品B',
      data: [
        { x: 12, y: 15 }, { x: 18, y: 20 }, { x: 22, y: 25 },
        { x: 28, y: 30 }, { x: 32, y: 32 }, { x: 38, y: 40 }
      ],
      backgroundColor: 'rgba(54, 162, 235, 0.6)'
    }]
  };

  // バブルチャート
  const bubbleData = {
    datasets: [{
      label: '製品売上',
      data: [
        { x: 20, y: 30, r: 15 },
        { x: 40, y: 10, r: 10 },
        { x: 30, y: 40, r: 20 },
        { x: 50, y: 25, r: 12 },
        { x: 60, y: 45, r: 18 }
      ],
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 1
    }]
  };

  // ドーナツチャート
  const doughnutData = {
    labels: ['営業', 'マーケティング', '開発', '管理', 'その他'],
    datasets: [{
      data: [30, 25, 28, 12, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // エリアチャート
  const areaData = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [{
      label: '売上(百万円)',
      data: [12, 19, 15, 25, 22, 30],
      fill: true,
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      tension: 0.4
    }, {
      label: 'コスト(百万円)',
      data: [8, 12, 10, 15, 14, 18],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.4)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      tension: 0.4
    }]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Chart.js グラフタイプ一覧
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <ChartSample
            type="radar"
            title="レーダーチャート"
            data={radarData}
            options={{
              plugins: {
                legend: { position: 'top' }
              },
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
          
          <ChartSample
            type="scatter"
            title="散布図"
            data={scatterData}
            options={{
              plugins: {
                legend: { position: 'top' }
              },
              scales: {
                x: {
                  title: { display: true, text: '価格(千円)' }
                },
                y: {
                  title: { display: true, text: '販売数' }
                }
              }
            }}
          />
          
          <ChartSample
            type="bubble"
            title="バブルチャート"
            data={bubbleData}
            options={{
              plugins: {
                legend: { position: 'top' },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `売上: ${context.parsed.y}百万円, 利益率: ${context.parsed.x}%, 規模: ${context.raw.r}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  title: { display: true, text: '利益率(%)' }
                },
                y: {
                  title: { display: true, text: '売上(百万円)' }
                }
              }
            }}
          />
          
          <ChartSample
            type="doughnut"
            title="ドーナツチャート"
            data={doughnutData}
            options={{
              plugins: {
                legend: { position: 'right' }
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ChartSample
            type="line"
            title="エリアチャート"
            data={areaData}
            options={{
              plugins: {
                legend: { position: 'top' }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">各グラフの特徴</h2>
          <div className="space-y-3 text-gray-700">
            <div>
              <span className="font-semibold">レーダーチャート:</span> 複数の項目を多角形で表示。複数のデータを比較するのに最適です。
            </div>
            <div>
              <span className="font-semibold">散布図:</span> X軸とY軸の2つの変数の関係を点で表示。相関関係の分析に使われます。
            </div>
            <div>
              <span className="font-semibold">バブルチャート:</span> 散布図に加えて、点の大きさで3つ目のデータを表現できます。
            </div>
            <div>
              <span className="font-semibold">ドーナツチャート:</span> 円グラフの中央に穴があるデザイン。全体に対する割合を見やすく表示します。
            </div>
            <div>
              <span className="font-semibold">エリアチャート:</span> 線グラフの下部を塗りつぶしたもの。時系列データの推移と量を同時に表現します。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
