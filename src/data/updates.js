// 更新情報のメタデータ（id と date のみ）
// タイトルと説明文は LanguageContext.jsx で多言語管理
// 新しい更新を追加する場合：
//   1. ここに { id, date } を追加
//   2. LanguageContext.jsx の ja/en 両方に updates.{id}.title と updates.{id}.description を追加
export const updates = [
  { id: 9, date: '2026.01.21' },
  { id: 8, date: '2026.01.13' },
  { id: 7, date: '2025.12.11' },
  { id: 6, date: '2025.12.01' },
  { id: 5, date: '2025.11.26' },
  { id: 4, date: '2025.11.23' },
  { id: 3, date: '2025.11.20' },
  { id: 2, date: '2025.11.18' },
  { id: 1, date: '2025.11.17' },
]
