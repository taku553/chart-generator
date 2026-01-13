export function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          プライバシーポリシー
        </h1>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          最終更新日: 2026年1月13日
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            1. はじめに
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Tiny House Studio(以下「当社」といいます)は、Chart Generator(以下「本サービス」といいます)の提供にあたり、ユーザーの個人情報の保護に最大限の注意を払っています。本プライバシーポリシーは、当社が収集、利用、管理する個人情報について説明するものです。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            2. 収集する情報
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            当社は、本サービスの提供にあたり、以下の情報を収集します：
          </p>
          
          <div className="space-y-4 ml-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2.1 アカウント情報
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>メールアドレス</li>
                <li>パスワード（暗号化されて保存）</li>
                <li>ユーザーID</li>
                <li>アカウント作成日時</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2.2 決済情報
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>有料プラン購入時のクレジットカード情報（Stripeが管理）</li>
                <li>購入履歴</li>
                <li>請求先情報</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ※ クレジットカード情報は当社のサーバーには保存されず、Stripe Inc.によって安全に管理されます。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2.3 アップロードされたファイル
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>CSVファイルまたはExcelファイル</li>
                <li>ファイルに含まれるデータ</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ※ これらのファイルは、ユーザーが削除ボタンをクリックするか、ホーム画面に戻った際に削除されます。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                2.4 利用情報
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>IPアドレス</li>
                <li>ブラウザの種類とバージョン</li>
                <li>アクセス日時</li>
                <li>利用したページ</li>
                <li>生成したグラフの種類と数</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            3. 情報の利用目的
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            当社は、収集した情報を以下の目的で利用します：
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>本サービスの提供、運営、維持</li>
            <li>ユーザー認証とアカウント管理</li>
            <li>有料プランの決済処理</li>
            <li>グラフ生成機能の提供</li>
            <li>AI分析機能の提供（有料プランのみ）</li>
            <li>ユーザーサポートとお問い合わせ対応</li>
            <li>本サービスの改善と新機能の開発</li>
            <li>利用統計の分析</li>
            <li>不正利用の検出と防止</li>
            <li>法令遵守と権利保護</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            4. 情報の第三者提供
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            当社は、以下の場合を除き、ユーザーの個人情報を第三者に提供することはありません：
          </p>
          
          <div className="space-y-4 ml-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                4.1 ユーザーの同意がある場合
              </h3>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                4.2 法令に基づく場合
              </h3>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                4.3 サービス提供に必要な第三者サービス
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                本サービスの提供には、以下の第三者サービスを利用しています：
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li><strong>Firebase (Google LLC)</strong> - 認証、データベース、ホスティング</li>
                <li><strong>Stripe Inc.</strong> - 決済処理</li>
                <li><strong>Vercel Inc.</strong> - ホスティングとサーバーレス関数</li>
                <li><strong>OpenAI</strong> - AI分析機能（有料プランのみ）</li>
                <li><strong>Google Analytics (Google LLC)</strong> - アクセス解析</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                これらのサービスは、それぞれのプライバシーポリシーに従って情報を管理します。
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            5. Cookieと類似技術
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            本サービスでは、以下の目的でCookieおよび類似技術を使用します：
          </p>
          
          <div className="space-y-4 ml-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                5.1 必須Cookie
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                Firebase Authenticationによって自動的に設定されるCookieで、以下の目的で使用されます：
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>ログイン状態の維持</li>
                <li>セキュアな認証セッションの管理</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                5.2 分析Cookie
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                Google Analyticsを使用して、サービスの利用状況を分析します：
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                <li>ページビュー数とユーザー数の計測</li>
                <li>ユーザーの行動パターンの分析</li>
                <li>サービス改善のための統計情報の収集</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                ※ Google Analyticsは匿名化されたデータを収集し、個人を特定する情報は含まれません。
              </p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            ブラウザの設定でCookieを無効にすることができますが、その場合、本サービスの一部機能が正常に動作しない可能性があります。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            6. データの保管と削除
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              <strong>アカウント情報:</strong> Firestoreに保管され、アカウントが削除されるまで保持されます。
            </p>
            <p className="leading-relaxed">
              <strong>アップロードされたファイル:</strong> ユーザーが削除ボタンをクリックするか、ホーム画面に戻った時点で削除されます。将来的には、有料会員向けにファイル保存機能を提供する予定です。
            </p>
            <p className="leading-relaxed">
              <strong>決済情報：</strong> 法令に基づく保管期間（通常7年間）保管されます。
            </p>
            <p className="leading-relaxed">
              <strong>利用ログ：</strong> 最大1年間保管され、その後削除されます。
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            7. セキュリティ対策
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            当社は、個人情報の漏洩、滅失、毀損を防止するため、以下のセキュリティ対策を実施しています：
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>SSL/TLS暗号化通信の使用</li>
            <li>Firebase Authentication による安全な認証</li>
            <li>パスワードのハッシュ化</li>
            <li>アクセス制御とファイアウォール</li>
            <li>定期的なセキュリティ監査</li>
          </ul>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            ただし、インターネット上の完全なセキュリティは保証できないため、ユーザー自身もパスワードの適切な管理など、セキュリティ対策を講じてください。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            8. ユーザーの権利
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            ユーザーは、自身の個人情報について、以下の権利を有します：
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li><strong>アクセス権：</strong> 自身の個人情報の開示を請求する権利</li>
            <li><strong>訂正権：</strong> 不正確な個人情報の訂正を請求する権利</li>
            <li><strong>削除権：</strong> 個人情報の削除を請求する権利（アカウント削除により実行可能）</li>
            <li><strong>利用停止権：</strong> 個人情報の利用停止を請求する権利</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
            これらの権利を行使する場合は、マイページからアカウント削除を行うか、または本ポリシー末尾の連絡先までお問い合わせください。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            9. 国際的なデータ転送
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            本サービスは、Firebase、Stripe、Vercel等の国際的なサービスを利用しているため、ユーザーの情報が日本国外のサーバーに保管される可能性があります。これらのサービスプロバイダーは、適切なセキュリティ対策を実施しています。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            10. プライバシーポリシーの変更
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            当社は、法令の変更やサービスの改善に伴い、本プライバシーポリシーを変更することがあります。重要な変更がある場合は、本サービス上で通知いたします。変更後のプライバシーポリシーは、本サービス上に掲載された時点で効力を生じます。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            11. お問い合わせ
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            本プライバシーポリシーまたは個人情報の取り扱いに関するお問い合わせは、以下の連絡先までお願いいたします。
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>サービス名：</strong> Chart Generator (Grafico)
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>運営者：</strong> Tiny House Studio
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Email：</strong> chenway0124.takuya@gmail.com
            </p>
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            以上
          </p>
        </div>
      </div>
    </div>
  )
}
