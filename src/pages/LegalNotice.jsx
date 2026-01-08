import { Card } from '@/components/ui/card.jsx'

export function LegalNotice() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center gradient-text">
        特定商取引法に基づく表記
      </h1>

      <Card className="p-6 sm:p-8 space-y-6">
        {/* 販売事業者名 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            販売事業者名
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Tiny House Studio
          </p>
        </section>

        {/* 代表者名 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            代表者名
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            髙橋拓也
          </p>
        </section>

        {/* 所在地 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            所在地
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            193-0832<br />
            東京都八王子市散田町1-4-14 メゾンドフローレス２ 307
          </p>
        </section>

        {/* 連絡先 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            連絡先
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-medium">メールアドレス：</span>
              chenway0124.takuya@gmail.com
            </p>
            <p>
              <span className="font-medium">電話番号：</span>
              070-1346-8039
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ※お問い合わせはメールにて承っております。
            </p>
          </div>
        </section>

        {/* 販売価格 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            販売価格
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>各プランページに表示された価格（税込）</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>無料プラン：0円</li>
              <li>Standard プラン：月額980円（税込）</li>
              <li>Pro プラン：月額1,980円（税込）</li>
            </ul>
          </div>
        </section>

        {/* 支払方法 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            支払方法
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>クレジットカード決済（Stripe）</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>VISA</li>
              <li>Mastercard</li>
              <li>American Express</li>
              <li>JCB</li>
              <li>Diners Club</li>
              <li>Discover</li>
            </ul>
          </div>
        </section>

        {/* 支払時期 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            支払時期
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>サブスクリプション契約成立時に初回決済が行われます。</p>
            <p>以降、毎月同日に自動的に決済されます。</p>
          </div>
        </section>

        {/* サービスの提供時期 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            サービスの提供時期
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            決済完了後、直ちにサービスをご利用いただけます。
          </p>
        </section>

        {/* 返品・キャンセルについて */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            返品・キャンセルについて
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              本サービスはデジタルコンテンツの性質上、サービス提供後の返品・返金には応じられません。
            </p>
            <p>
              サブスクリプションの解約はいつでも可能です。解約後は次回更新日以降、課金が停止されます。
            </p>
            <p>
              解約手続きは、マイページの「プラン管理」から行えます。
            </p>
          </div>
        </section>

        {/* 解約について */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            解約について
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              サブスクリプションはいつでも解約できます。解約後、次回更新日までは現在のプランをご利用いただけます。
            </p>
            <p>
              解約後の返金は行っておりませんので、予めご了承ください。
            </p>
          </div>
        </section>

        {/* 特記事項 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            特記事項
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              本サービスのご利用には、インターネット接続環境が必要です。
            </p>
            <p>
              サービス内容は予告なく変更される場合があります。
            </p>
            <p>
              お客様の個人情報は、当社のプライバシーポリシーに基づき適切に管理いたします。
            </p>
          </div>
        </section>

        {/* 免責事項 */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
            免責事項
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              本サービスの利用により生じた損害について、当社は一切の責任を負いかねます。
            </p>
            <p>
              システムメンテナンスや障害により、一時的にサービスが利用できない場合があります。
            </p>
          </div>
        </section>
      </Card>

      {/* 最終更新日 */}
      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        最終更新日: 2026年1月8日
      </p>
    </div>
  )
}
