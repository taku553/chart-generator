# Chart Generator プロジェクト設計書

## 1. プロジェクト概要

Chart Generator は、複雑なレイアウトの統計データを含むファイルをアップロードすることで、美しく洗練されたグラフを簡単に生成できるウェブアプリケーションです。官公庁や企業が公開する統計表のような複雑なデータ構造にも対応し、柔軟なデータ選択とカスタマイズ機能を提供します。

### プロジェクトの特徴

- **複雑なデータ構造への対応**: 多段階の設定プロセスにより、さまざまなレイアウトの統計表に対応
- **直感的な操作**: ステップバイステップのガイドで、誰でも簡単にグラフを作成
- **モダンなデザイン**: モノクロ基調のミニマルデザインとグラスモーフィズム
- **柔軟なカスタマイズ**: 単位、スケール、グラフタイトルを自由に設定

---

## 2. 機能要件

### 2.1 ファイル処理機能

**ファイルアップロード**
- CSV形式（UTF-8、Shift_JIS、EUC-JP の自動判別）
- Excel形式（.xlsx, .xls）
- 複数シートの自動検出と選択
- ドラッグ&ドロップとファイル選択の両方に対応

**データ解析**
- 複雑なレイアウトの統計表に対応
- データ領域の柔軟な選択
- 列ヘッダーの位置指定（別領域にある場合も対応）
- データの向き（縦/横）の自動判別と転置
- 複数行にまたがるヘッダーの結合
- 複数列にまたがるデータ名の結合

### 2.2 グラフ生成機能

**グラフの種類**
- 棒グラフ（Bar Chart）
- 折れ線グラフ（Line Chart）
- 円グラフ（Pie Chart）

**カスタマイズ機能**
- X軸・Y軸の項目選択
- 単位設定（通貨、重量、数量、割合など）
- スケール設定（そのまま、千、万、百万、億など）
- グラフタイトルの設定
- データサマリーの自動計算（最大値、最小値、平均値）

**エクスポート機能**
- PNG形式での画像ダウンロード
- グラフの種類を保持したままダウンロード

### 2.3 ユーザーインターフェース機能

**ステップバイステップガイド**
1. ファイルアップロード
2. シート選択（Excelの場合）
3. データ領域選択
4. 列ヘッダー位置指定
5. データ向き確認
6. ヘッダー行範囲選択
7. データ名列選択（オプション）
8. 軸設定
9. 単位・スケール設定
10. グラフタイトル設定
11. グラフ生成

**ナビゲーション機能**
- 各ステップで「前に戻る」ボタン
- 「ホームに戻る」で最初からやり直し
- 「条件を変えて再生成」で同じファイルを再利用

**ユーザビリティ**
- サンプルデータの表示
- データプレビュー機能
- リアルタイムフォーマットプレビュー
- エラーメッセージとガイダンス

---

## 3. デザイン要件

### 3.1 デザインコンセプト

**ミニマリズム**
- モノクロを基調としたシンプルで洗練されたデザイン
- 余計な装飾を排除し、データとグラフに集中
- 白、黒、グレーのグラデーションで統一感を演出

**グラスモーフィズム**
- 半透明のガラスのようなUI要素
- 背景のぼかし効果（backdrop-blur）
- 微妙な影とボーダーで奥行きを表現

### 3.2 アニメーション

**インタラクティブフィードバック**
- フェードイン：要素がゆっくり現れる
- スライドイン：横や下から滑り込む
- バウンス：軽く跳ねるような動き
- シマー：光沢が流れる効果
- リップル：波紋のような広がり
- フロート：ふわふわと浮遊する動き

**アニメーションの目的**
- ユーザーの操作に対する視覚的フィードバック
- 画面遷移の滑らかさ
- 直感的で心地よい使用体験の提供

---

## 4. 技術選定

### 4.1 コアテクノロジー

**フロントエンドフレームワーク**
- **React 19.1.0**: 最新のReactで高速なUIレンダリング
- **Vite 6.3.5**: 高速な開発環境とビルドツール

**言語・ツール**
- **JavaScript (ES6+)**: モダンなJavaScript構文
- **JSX**: コンポーネントベースのUI記述
- **ESLint**: コード品質の維持

### 4.2 UIライブラリとコンポーネント

**Radix UI**
- アクセシビリティに優れたヘッドレスUIコンポーネント
- 使用コンポーネント：
  - Dialog, Alert Dialog（モーダル）
  - Select, Dropdown Menu（選択UI）
  - Accordion, Tabs（折りたたみUI）
  - Label, Switch, Checkbox（フォーム要素）
  - Tooltip, Popover（補助UI）

**shadcn/ui コンポーネントシステム**
- Radix UIをベースにしたカスタマイズ可能なUIコンポーネント
- 実装されたコンポーネント：
  - Card, Button, Input, Label
  - Select, Switch, Checkbox
  - Alert, Dialog, Tabs
  - Tooltip, Popover など

### 4.3 スタイリング

**Tailwind CSS 4.1.7**
- ユーティリティファーストのCSSフレームワーク
- カスタムプラグイン：`@tailwindcss/vite`
- アニメーションサポート：`tw-animate-css`

**カスタムCSS**
- `App.css`: グローバルスタイルとアニメーション定義
- CSS変数によるテーマ管理
- グラスモーフィズム効果の実装

**ユーティリティ**
- **clsx**: 条件付きクラス名の管理
- **tailwind-merge**: Tailwindクラスの競合解決
- **class-variance-authority**: バリアントベースのスタイリング

### 4.4 グラフ描画

**Chart.js 4.5.0**
- 高度なカスタマイズが可能なグラフライブラリ
- 美しいアニメーション効果
- レスポンシブデザインに対応

**React Chart.js 2 (5.3.0)**
- ReactでChart.jsを使用するためのラッパー
- コンポーネントベースのグラフ管理

**使用しているChart.jsモジュール**
- CategoryScale, LinearScale（軸のスケール）
- BarElement, LineElement, PointElement, ArcElement（グラフ要素）
- Title, Tooltip, Legend（補助要素）

### 4.5 データ処理

**PapaParse 5.5.3**
- 高性能なCSVパーサー
- ストリーミング対応
- エンコーディング自動判別のサポート

**SheetJS (xlsx) 0.18.5**
- Excelファイルの読み書き
- 複数シートの処理
- セルデータの柔軟な取得

### 4.6 アイコン

**Lucide React 0.510.0**
- モダンで統一感のあるアイコンセット
- 300以上のアイコンを利用可能
- SVGベースで拡張性が高い

**使用している主なアイコン**
- Upload, FileText, Table2（ファイル関連）
- BarChart3, LineChart, PieChart（グラフ関連）
- ChevronDown, ArrowLeft, Home（ナビゲーション）
- Settings, Download, Eye（操作）

### 4.7 その他のライブラリ

**ユーティリティ**
- **date-fns 4.1.0**: 日付処理
- **framer-motion 12.15.0**: 高度なアニメーション（将来の拡張用）

**フォーム管理**
- **react-hook-form 7.56.3**: パフォーマンスの高いフォーム管理
- **zod 3.24.4**: TypeScript優先のスキーマ検証
- **@hookform/resolvers 5.0.1**: zodとの統合

**UI拡張**
- **sonner 2.0.3**: トースト通知
- **cmdk 1.1.1**: コマンドパレット（将来の拡張用）
- **vaul 1.1.2**: モバイルフレンドリーなドロワー

---

## 5. プロジェクト構造

### 5.1 ディレクトリ構成

```
chart-generator/
├── public/                      # 静的ファイル
│   ├── sample-data.csv         # サンプルデータ
│   └── sample-good-data.csv    # 推奨データ形式のサンプル
├── src/
│   ├── main.jsx                # エントリーポイント
│   ├── App.jsx                 # ルートコンポーネント
│   ├── App.css                 # グローバルスタイル
│   ├── index.css               # Tailwind設定
│   ├── components/             # UIコンポーネント
│   │   ├── FileUpload.jsx      # ファイルアップロード管理
│   │   ├── ChartDisplay.jsx    # グラフ表示
│   │   ├── SheetSelector.jsx   # シート選択
│   │   ├── DataRangeSelector.jsx           # データ範囲選択
│   │   ├── SeparateHeaderSelector.jsx      # 列ヘッダー位置指定
│   │   ├── DataOrientationSelector.jsx     # データ向き確認
│   │   ├── HeaderRangeSelector.jsx         # ヘッダー範囲選択
│   │   ├── DataLabelRangeSelector.jsx      # データ名列選択
│   │   ├── UnitSettings.jsx                # 単位設定
│   │   ├── ChartTitleSettings.jsx          # タイトル設定
│   │   └── ui/                 # shadcn/ui コンポーネント
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── select.jsx
│   │       ├── alert-dialog.jsx
│   │       └── ... (その他30以上のコンポーネント)
│   ├── lib/                    # ユーティリティ関数
│   │   ├── dataUtils.js        # データ処理（解析、変換）
│   │   ├── dataTransform.js    # データ変換（転置、結合）
│   │   ├── unitUtils.js        # 単位とスケール処理
│   │   └── utils.js            # 汎用ユーティリティ
│   └── hooks/                  # カスタムフック
│       └── use-mobile.js       # モバイル判定
├── ドキュメント/
│   ├── Chart Generator アプリの使い方.md
│   ├── Chart Generator プログラムロジックの流れ.md
│   ├── project_design.md       # このファイル
│   └── プロジェクト構造と各ファイルの役割.md
├── components.json             # shadcn/ui設定
├── package.json                # 依存関係
├── vite.config.js              # Vite設定
├── jsconfig.json               # JavaScript設定
├── eslint.config.js            # ESLint設定
└── index.html                  # HTMLエントリーポイント
```

### 5.2 主要ファイルの役割

**コアファイル**
- `App.jsx`: アプリケーション全体の状態管理と画面切り替え
- `FileUpload.jsx`: データ設定の全プロセスを管理
- `ChartDisplay.jsx`: グラフの描画と操作

**データ処理**
- `dataUtils.js`: ファイル読み込み、データ解析、グラフ変換
- `dataTransform.js`: 転置、範囲抽出、ヘッダー/データ名結合
- `unitUtils.js`: 単位プリセット、スケール変換、フォーマット

**UIコンポーネント（ステップ別）**
1. `SheetSelector.jsx`: Excelシート選択
2. `DataRangeSelector.jsx`: データ領域選択
3. `SeparateHeaderSelector.jsx`: ヘッダー位置指定
4. `DataOrientationSelector.jsx`: データ向き確認
5. `HeaderRangeSelector.jsx`: ヘッダー行範囲選択
6. `DataLabelRangeSelector.jsx`: データ名列選択
7. `UnitSettings.jsx`: 単位とスケール設定
8. `ChartTitleSettings.jsx`: グラフタイトル設定

---

## 6. データフロー

### 6.1 処理の流れ

```
1. ファイルアップロード
   ↓ (parseFile)
2. ファイル解析 → rawRows（生データ配列）
   ↓
3. シート選択（Excelの場合）
   ↓
4. データ領域選択 → extractDataRange
   ↓
5. ヘッダー位置指定 → combineHeaderAndDataRanges（必要に応じて）
   ↓
6. データ向き確認 → transposeData（必要に応じて）
   ↓
7. ヘッダー範囲選択 → mergeHeaderRows
   ↓
8. データ名列選択 → mergeDataLabelColumns（必要に応じて）
   ↓
9. 軸設定（X軸・Y軸の列選択）
   ↓
10. 単位・スケール設定 → unitConfig
   ↓
11. グラフタイトル設定
   ↓
12. グラフデータ変換 → transformDataForChart
   ↓
13. グラフ描画 → Chart.js
```

### 6.2 状態管理の流れ

```
App.jsx (ルート状態)
  ├─ data: グラフ用データ
  ├─ chartType: グラフの種類
  ├─ uploadedFileData: アップロードファイル情報
  └─ isReconfiguring: 再設定モードフラグ

FileUpload.jsx (設定プロセス状態)
  ├─ file: アップロードされたファイル
  ├─ sheetNames, selectedSheet: シート情報
  ├─ rawRows: 生データ
  ├─ selectedRange: 選択されたデータ範囲
  ├─ headerRange: ヘッダー範囲
  ├─ processedDataForHeader: 向き調整後のデータ
  ├─ processedData: ヘッダー確定後のデータ
  ├─ dataLabels, labelRange: データ名情報
  ├─ xColumn, yColumn: 選択された軸
  ├─ unitSettings: 単位設定
  └─ chartTitle: グラフタイトル

ChartDisplay.jsx (表示状態)
  └─ chartType: 表示中のグラフの種類（親から受け取り）
```

---

## 7. 開発環境とビルド

### 7.1 パッケージマネージャー

**pnpm 10.4.1**
- 高速で効率的なパッケージ管理
- ディスク容量の節約
- 厳密な依存関係管理

### 7.2 開発スクリプト

```bash
# 開発サーバー起動
pnpm run dev

# ネットワーク公開（他デバイスからアクセス可能）
pnpm run dev --host

# 本番ビルド
pnpm run build

# ビルド結果のプレビュー
pnpm run preview

# コードの静的解析
pnpm run lint
```

### 7.3 ビルド設定

**Vite設定 (vite.config.js)**
- React Fast Refresh対応
- パスエイリアス（@/ → src/）
- 最適化されたバンドル生成

---

## 8. デザインシステム

### 8.1 カラーパレット

**モノクロームスケール**
- Primary: `rgba(0, 0, 0, 0.8)` - メインの黒
- Secondary: `rgba(64, 64, 64, 0.8)` - 濃いグレー
- Tertiary: `rgba(128, 128, 128, 0.8)` - 中間グレー
- Light: `rgba(192, 192, 192, 0.8)` - 明るいグレー
- Background: `rgba(255, 255, 255, 0.8)` - 白背景

**アクセントカラー**
- Success: グリーン系（確認、完了）
- Warning: オレンジ系（注意）
- Error: レッド系（エラー）
- Info: ブルー系（情報）

### 8.2 タイポグラフィ

**フォントファミリー**
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif
```

**フォントサイズ**
- タイトル: 24px-32px (1.5rem-2rem)
- 見出し: 18px-24px (1.125rem-1.5rem)
- 本文: 14px-16px (0.875rem-1rem)
- キャプション: 12px-14px (0.75rem-0.875rem)

### 8.3 スペーシング

**基準: 4px（0.25rem）**
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)

---

## 9. パフォーマンス最適化

### 9.1 実装されている最適化

**React最適化**
- `useMemo`: 重い計算結果のキャッシュ
- `useCallback`: 関数の再生成防止
- 条件付きレンダリング: 必要な時のみコンポーネント表示

**データ処理最適化**
- サンプリング: 大量データの一部のみを型推定に使用
- 遅延読み込み: 表示行数の段階的増加
- フィルタリング: 空行の事前除外

**バンドル最適化**
- Viteによるコード分割
- Tree shaking（未使用コードの除去）
- 圧縮とMinify

### 9.2 今後の最適化可能性

- Web Workerでのデータ処理の並列化
- 仮想スクロールでの大量データ表示
- 画像の遅延読み込み

---

## 10. アクセシビリティ

### 10.1 実装されている対応

**ARIA属性**
- Radix UIによる自動的なARIA属性の付与
- スクリーンリーダー対応

**キーボード操作**
- Tab/Shift+Tabでのフォーカス移動
- Enter/Spaceでのボタン操作
- Escapeでのダイアログクローズ

**視覚的配慮**
- 十分なコントラスト比
- フォーカスインジケーター
- ホバー/アクティブ状態の明確な表示

---

## 11. ブラウザ対応

### 11.1 対応ブラウザ

**デスクトップ**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**モバイル**
- iOS Safari 14+
- Chrome for Android 90+

### 11.2 必要な機能

- ES6+ サポート
- CSS Grid/Flexbox
- CSS Custom Properties
- Canvas API（グラフ描画）
- File API（ファイル読み込み）

---

## 12. 将来の拡張可能性

### 12.1 機能拡張

**グラフの種類追加**
- 散布図
- レーダーチャート
- ヒストグラム
- 複合グラフ

**データソース拡張**
- Google Sheets連携
- APIからのデータ取得
- データベース接続

**エクスポート形式追加**
- SVG形式
- PDF形式
- データテーブルとしてのエクスポート

### 12.2 UI/UX改善

**高度な編集機能**
- グラフの色のカスタマイズ
- フォントサイズの調整
- 軸の範囲の手動設定
- 凡例の位置調整

**コラボレーション機能**
- グラフの共有
- URLでの設定の保存
- テンプレート機能

### 12.3 技術的拡張

**TypeScript化**
- 型安全性の向上
- 開発体験の改善

**テスト実装**
- Jest/Vitest によるユニットテスト
- Playwright によるE2Eテスト

**PWA化**
- オフライン対応
- インストール可能なアプリ
- プッシュ通知

---

## 13. まとめ

Chart Generatorは、モダンなWeb技術スタックを活用して構築された、複雑な統計データのグラフ化に特化したウェブアプリケーションです。

**技術的な強み**
- Reactの最新バージョンによる高速なレンダリング
- Radix UIとshadcn/uiによる堅牢なUIコンポーネント
- Chart.jsによる美しく柔軟なグラフ描画
- Tailwind CSSによる保守性の高いスタイリング

**ユーザー体験の強み**
- 複雑なデータ構造にも対応する柔軟な設定
- ステップバイステップの直感的なガイド
- モノクロ基調の洗練されたデザイン
- 滑らかなアニメーションによる快適な操作感

このプロジェクトは、技術的な堅牢性とユーザー体験の両立を目指して設計されており、今後さらなる機能拡張と改善の余地を残しています。

