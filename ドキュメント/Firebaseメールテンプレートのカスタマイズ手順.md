# Firebaseメールテンプレートのカスタマイズ手順

このドキュメントでは、Firebaseのパスワードリセットメールをカスタマイズする方法を説明します。

## 📧 メールテンプレートのカスタマイズ（無料）

### 手順

1. **Firebase Consoleにアクセス**
   - https://console.firebase.google.com/
   - プロジェクト「chart-generator」を選択

2. **Authentication → Templates に移動**
   - 左メニューから「Authentication」をクリック
   - 上部タブの「Templates」をクリック

3. **パスワードリセットのテンプレートを選択**
   - テンプレート一覧から「Password reset」を選択
   - 右側の鉛筆アイコン（編集）をクリック

4. **テンプレートをカスタマイズ**

---

## ✉️ 推奨日本語テンプレート

### 件名（Subject）
```
Grafico - パスワードリセットのお知らせ
```

### 本文（Email body）

**重要**: メールクライアントでは`<style>`タグが無視されることがあるため、すべてのスタイルをインラインで記述しています。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); background-color: #2c3e50; color: #ffffff; padding: 30px 20px; text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <img src="https://chart-generator-eight.vercel.app/logo.svg" alt="Grafico Logo" style="height: 24px; width: auto; vertical-align: middle; margin-right: 8px;">
                    <span style="font-size: 24px; font-weight: 300; letter-spacing: 2px; vertical-align: middle; color: #ffffff;">GRAFICO</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #555; font-size: 16px;">こんにちは、</p>
              
              <p style="margin: 0 0 20px 0; color: #555; font-size: 16px;">Graficoアカウントのパスワードリセットをリクエストされました。</p>
              
              <p style="margin: 0 0 20px 0; color: #555; font-size: 16px;">以下のボタンをクリックして、新しいパスワードを設定してください。</p>
              
              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="%LINK%" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); background-color: #2c3e50; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 500; letter-spacing: 1px; font-size: 16px;">パスワードを再設定</a>
                  </td>
                </tr>
              </table>
              
              <!-- Info Box 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8f9fa; border-left: 4px solid #2c3e50; margin: 20px 0; border-radius: 4px;">
                <tr>
                  <td style="padding: 15px 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>⏰ このリンクは1時間有効です</strong></p>
                    <p style="margin: 0; font-size: 14px; color: #666;">セキュリティのため、リンクの有効期限が切れた場合は、もう一度パスワードリセットをリクエストしてください。</p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 10px 0; color: #555; font-size: 16px;">ボタンが機能しない場合は、以下のリンクをブラウザにコピー&ペーストしてください：</p>
              <p style="margin: 0 0 20px 0; color: #2c3e50; word-break: break-all; font-size: 13px;">%LINK%</p>
              
              <!-- Info Box 2 -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8f9fa; border-left: 4px solid #e74c3c; margin: 30px 0 0 0; border-radius: 4px;">
                <tr>
                  <td style="padding: 15px 20px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;"><strong>🔒 重要なセキュリティ情報</strong></p>
                    <p style="margin: 0; font-size: 14px; color: #666;">このメールに心当たりがない場合は、このメールを無視してください。第三者がパスワードリセットを行うことはできません。</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 5px 0; font-size: 12px; color: #888;">このメールは Grafico から自動送信されています。</p>
              <p style="margin: 5px 0; font-size: 12px; color: #888;">&copy; 2025 Grafico. All rights reserved.</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 🎨 カスタマイズのポイント

### 1. **インラインスタイルの重要性**
メールHTMLでは`<style>`タグが多くのメールクライアント（Gmail、Outlook等）で無視されるため、すべてのスタイルを`style`属性として直接記述しています。

### 2. **テーブルレイアウトの使用**
`<div>`や`<span>`よりも`<table>`の方がメールクライアント間の互換性が高いため、レイアウトに`<table>`を使用しています。

### 3. **カラースキーム**
現在のテンプレートは、Chart Generatorのモノクロ基調に合わせて設定されています：
- メインカラー: `#2c3e50` (ダークグレー)
- セカンダリ: `#34495e` (グレー)
- 警告色: `#e74c3c` (レッド)

### 2. **ボタンのカスタマイズ**
```css
.button {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  /* お好みの色に変更可能 */
}
```

### 3. **ロゴの追加（オプション）**
ロゴ画像を使用する場合：
```html
<div class="header">
  <img src="YOUR_LOGO_URL" alt="Grafico" style="max-width: 150px;">
</div>
```

**注意**: 画像は公開URLである必要があります（Firebase Storage、Cloudinary等）

---

## 🌐 送信ドメインの設定

### デフォルトの送信元
```
noreply@YOUR-PROJECT-ID.firebaseapp.com
```

### カスタムドメインの設定（オプション・無料）

1. **Firebase Console → Authentication → Templates**
2. 右上の「カスタマイズ」→「SMTPサーバーの設定」
3. 独自ドメインのSMTP情報を入力

**推奨サービス（無料枠あり）**:
- SendGrid（月間100通まで無料）
- Mailgun（月間5,000通まで無料）
- AWS SES（月間62,000通まで無料）

---

## 📱 他のテンプレートもカスタマイズ

同じ手順で以下もカスタマイズできます：

### 1. **メールアドレス確認**
- ユーザー登録時の確認メール
- 同じデザインで統一感を出す

### 2. **メールアドレス変更**
- メールアドレス変更時の確認メール

### 3. **SMSテンプレート**
- 電話番号認証を追加する場合

---

## 🔧 テスト方法

1. **テンプレート保存後**
   - Firebase Consoleで「保存」をクリック

2. **実際にテストメールを送信**
   - アプリでパスワードリセットを実行
   - メールが届くか確認
   - リンクをクリックして動作確認

3. **各メールクライアントでの表示確認**
   - Gmail
   - Outlook
   - Apple Mail
   - スマートフォン

---

## 💡 Tips

### メールが届かない場合

1. **迷惑メールフォルダを確認**
2. **Firebase Consoleでステータス確認**
   - Authentication → Users → 該当ユーザー
3. **送信制限の確認**
   - Firebaseの無料プランは1日100通まで
   - Blazeプランにアップグレードで制限解除

### デザインの調整

- **モバイル対応**: `max-width: 600px`で最適化済み
- **ダークモード**: 必要に応じてメディアクエリを追加
- **多言語対応**: 言語ごとにテンプレートを作成可能

---

## ✅ チェックリスト

カスタマイズ完了後、以下を確認してください：

- [ ] 件名が日本語になっている
- [ ] 本文が読みやすいレイアウトになっている
- [ ] ボタンのリンクが正しく機能する
- [ ] モバイルでも見やすい
- [ ] 会社/サービス名が正しく表示されている
- [ ] セキュリティに関する注意書きがある
- [ ] 有効期限が明記されている
- [ ] 問い合わせ先が記載されている（オプション）

---

## 📚 参考リンク

- [Firebase Authentication メールテンプレート公式ドキュメント](https://firebase.google.com/docs/auth/custom-email-handler)
- [HTML メールのベストプラクティス](https://www.campaignmonitor.com/dev-resources/guides/coding-html-emails/)

---

## 🎉 完了！

これでChart Generatorのパスワードリセットメールが、サイトのデザインに統一された美しいメールになりました！

ユーザーエクスペリエンスが大幅に向上します 🚀
