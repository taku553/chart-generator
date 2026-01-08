# Stripe商品移行ガイド

Stripeのテスト環境（サンドボックス）から本番環境に商品カタログを移行する方法

## なぜCSVインポートできないのか？

Stripeダッシュボードには商品をCSV形式でエクスポートする機能はありますが、**インポート機能は提供されていません**。これは、Stripe APIを使用してプログラムで管理することを推奨しているためです。

## 移行方法

### 方法1: スクリプトを使用した自動移行（推奨）

`scripts/migrate-stripe-products.js` を使用して、テスト環境から本番環境に商品を自動移行できます。

#### 手順

1. **Stripe APIキーの取得**

   **テスト環境のシークレットキー:**
   - https://dashboard.stripe.com/test/apikeys
   - 「シークレットキー」をクリックして表示し、コピー

   **本番環境のシークレットキー:**
   - https://dashboard.stripe.com/apikeys
   - 「シークレットキー」をクリックして表示し、コピー
   - ⚠️ 本番キーは機密情報です！慎重に扱ってください

2. **環境変数の設定**

   プロジェクトルートに `.env.local` ファイルを作成（または既存ファイルに追加）:

   ```bash
   # テスト環境のシークレットキー
   STRIPE_TEST_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   
   # 本番環境のシークレットキー
   STRIPE_LIVE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
   ```

3. **Stripeパッケージのインストール**

   ```bash
   npm install stripe
   # または
   pnpm install stripe
   ```

4. **移行スクリプトの実行**

   ```bash
   node scripts/migrate-stripe-products.js
   ```

#### スクリプトが行うこと

✅ テスト環境から全ての有効な商品を取得  
✅ 各商品を本番環境に作成（既存の場合は更新）  
✅ 各商品の価格プランを本番環境に作成  
✅ 重複チェック（同じ価格が既に存在する場合はスキップ）  
✅ メタデータも含めて完全にコピー  

---

### 方法2: Stripeダッシュボードで手動作成

商品数が少ない場合は、手動で作成するのも一つの方法です。

#### 手順

1. **テスト環境で商品情報を確認**
   - https://dashboard.stripe.com/test/products
   - 各商品の詳細（名前、説明、価格、メタデータ）をメモ

2. **本番環境で商品を作成**
   - https://dashboard.stripe.com/products
   - 「+ 商品を作成」ボタンをクリック
   - テスト環境と同じ情報を入力

3. **メタデータの設定を忘れずに**
   - 特に `firebaseRole` などのカスタムメタデータは重要です
   - これがないとFirebase Extensionが正しく動作しません

---

### 方法3: Stripe CLIを使用（上級者向け）

```bash
# Stripe CLIのインストール
brew install stripe/stripe-cli/stripe

# テスト環境にログイン
stripe login --project-name test

# 商品をエクスポート（JSON形式）
stripe products list > test-products.json
stripe prices list > test-prices.json

# 本番環境にログイン
stripe login --project-name live

# JSONファイルを参照して手動で作成
# （Stripe CLIには直接インポート機能はありません）
```

---

## 移行後の確認事項

### 1. Stripeダッシュボードで確認

- [ ] 全ての商品が作成されている
- [ ] 価格プランが正しく設定されている
- [ ] メタデータ（`firebaseRole`など）が設定されている
- [ ] 商品がアクティブになっている

### 2. Firebase Extensionの更新

本番環境のStripe商品IDが変わるため、Firebase Extensionの設定も更新が必要です。

#### 商品IDの確認

テスト環境と本番環境で商品IDは異なります：

```javascript
// テスト環境
prod_TceJ0POTNmJDOX  // Standard Plan

// 本番環境（移行後に新しいIDが付与される）
prod_xxxxxxxxxxxxxxx  // Standard Plan
```

#### Firestoreへの同期

`scripts/sync-stripe-products.js` を更新して、新しい本番環境の商品IDを反映：

```javascript
const products = [
  {
    id: 'prod_LIVE_ID_HERE', // ← 本番環境の商品ID
    name: 'Standard Plan',
    // ...
    prices: [
      {
        id: 'price_LIVE_ID_HERE', // ← 本番環境の価格ID
        // ...
      }
    ]
  }
];
```

その後、同期スクリプトを実行：

```bash
node scripts/sync-stripe-products.js
```

### 3. アプリケーションコードの確認

ハードコードされた商品IDや価格IDがないか確認してください：

```bash
# 商品IDの検索
grep -r "prod_" src/
grep -r "price_" src/
```

---

## トラブルシューティング

### エラー: `Authentication failed`

APIキーが正しく設定されていません。

- `.env.local` ファイルが存在するか確認
- APIキーが `sk_test_` または `sk_live_` で始まっているか確認
- コピー時に余分なスペースが入っていないか確認

### エラー: `Product already exists`

すでに本番環境に商品が存在します。

- スクリプトは自動的に更新しますが、エラーが出る場合は手動で確認
- 既存の商品を削除してから再実行するか、手動で更新

### 商品は作成されたが、Firebase Extensionで使えない

メタデータが設定されていない可能性があります。

1. Stripeダッシュボードで商品を開く
2. 「メタデータ」セクションを確認
3. `firebaseRole: standard` のようなメタデータを追加

---

## ベストプラクティス

### 📋 移行前のチェックリスト

- [ ] テスト環境で全ての商品が正しく動作することを確認
- [ ] メタデータが正しく設定されていることを確認
- [ ] 価格設定が最終版であることを確認
- [ ] バックアップとして商品情報をスプレッドシートにメモ

### 🔒 セキュリティ

- 本番環境のシークレットキーは絶対にGitにコミットしない
- `.env.local` は `.gitignore` に追加されていることを確認
- 使用後は不要な場合はAPIキーを削除

### 🔄 将来の更新

- 商品/価格の更新は両環境で行う
- または、テスト環境で確認後、再度移行スクリプトを実行
- Webhook設定も忘れずに（テスト環境と本番環境で別々）

---

## 参考リンク

- [Stripe API - Products](https://stripe.com/docs/api/products)
- [Stripe API - Prices](https://stripe.com/docs/api/prices)
- [Firebase Extension - Stripe Payments](https://github.com/stripe/stripe-firebase-extensions)
