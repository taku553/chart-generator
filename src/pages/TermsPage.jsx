export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          利用規約
        </h1>
        
        <p className="text-sm text-gray-600 dark:text-gray-400">
          最終更新日: 2026年1月13日
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第1条（適用）
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            本規約は、Tiny House Studio(以下「当社」といいます)が提供するChart Generator(以下「本サービス」といいます)の利用に関する条件を定めるものです。本サービスをご利用いただくことで、本規約に同意したものとみなされます。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第2条（サービスの内容）
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            本サービスは、ユーザーがアップロードしたCSVファイルまたはExcelファイルから、グラフを自動生成するウェブアプリケーションです。主な機能は以下のとおりです：
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>CSV/Excelファイルのアップロードと解析</li>
            <li>棒グラフ、折れ線グラフ、円グラフの生成</li>
            <li>グラフのカスタマイズ（単位、スケール、タイトル設定）</li>
            <li>生成されたグラフのPNG形式でのダウンロード</li>
            <li>AI分析によるグラフの洞察機能（有料プランのみ）</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第3条（アカウント登録）
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              1. 本サービスの一部機能を利用するには、アカウント登録が必要です。
            </p>
            <p className="leading-relaxed">
              2. ユーザーは、登録情報として正確かつ最新の情報を提供する必要があります。
            </p>
            <p className="leading-relaxed">
              3. ユーザーは、自身のアカウント情報を適切に管理し、第三者に使用させてはなりません。
            </p>
            <p className="leading-relaxed">
              4. アカウントの不正使用により生じた損害について、当社は一切の責任を負いません。
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第4条（有料プランと決済）
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              1. 本サービスは、無料プランと有料プランを提供しています。
            </p>
            <p className="leading-relaxed">
              2. 有料プランの料金、内容、決済方法は、本サービスのPricingページに記載されています。
            </p>
            <p className="leading-relaxed">
              3. 決済処理は、Stripe Inc.の決済システムを利用します。
            </p>
            <p className="leading-relaxed">
              4. 有料プランの購入後、原則として返金はできません。ただし、当社に重大な過失がある場合を除きます。
            </p>
            <p className="leading-relaxed">
              5. 有料プランは、月額プランの場合は1ヶ月ごと、年額プランの場合は1年ごとに自動更新されます。解約はいつでもマイページから可能です。
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第5条（アップロードされたデータの取り扱い）
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              1. ユーザーがアップロードしたファイルは、グラフ生成の目的でのみ使用されます。
            </p>
            <p className="leading-relaxed">
              2. アップロードされたデータは、ユーザーが削除ボタンをクリックした時、またはホーム画面に戻った時に削除されます。将来的には、有料会員が過去にアップロードしたファイルを保存できる機能を提供する予定です。
            </p>
            <p className="leading-relaxed">
              3. 当社は、ユーザーのデータを第三者に提供、販売、または共有することはありません（法令に基づく場合を除く）。
            </p>
            <p className="leading-relaxed">
              4. ユーザーは、機密情報や個人情報を含むファイルをアップロードする際は、自己の責任において行うものとします。
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第6条（知的財産権）
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              1. 本サービスおよび本サービスに関連するすべてのコンテンツ（デザイン、ロゴ、テキスト、プログラムなど）の知的財産権は、当社または正当な権利者に帰属します。
            </p>
            <p className="leading-relaxed">
              2. ユーザーが本サービスを使用して生成したグラフの著作権は、ユーザーに帰属します。
            </p>
            <p className="leading-relaxed">
              3. ユーザーは、本サービスから生成されたグラフを、商用・非商用を問わず自由に使用できます。ただし、使用の際はウェブアプリケーション「Grafico」から提供されたものであることを明記することを推奨します。
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第7条（禁止事項）
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません：
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>他者の知的財産権、プライバシー権、名誉その他の権利を侵害する行為</li>
            <li>本サービスのサーバーまたはネットワークに過度な負荷をかける行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>不正アクセス、ハッキング、クラッキング等の行為</li>
            <li>本サービスの脆弱性を探索する行為</li>
            <li>第三者になりすます行為</li>
            <li>違法なデータや有害なデータをアップロードする行為</li>
            <li>その他、当社が不適切と判断する行為</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第8条（サービスの変更・停止）
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              1. 当社は、ユーザーへの事前通知なく、本サービスの内容を変更または追加することができます。
            </p>
            <p className="leading-relaxed">
              2. 当社は、以下の場合、ユーザーへの事前通知なく本サービスの提供を一時的に停止することができます：
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>システムの保守、点検、修理を行う場合</li>
              <li>地震、火災、停電などの不可抗力により本サービスの提供が困難な場合</li>
              <li>その他、運用上または技術上、停止が必要と当社が判断した場合</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第9条（免責事項）
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              1. 当社は、本サービスが常に利用可能であること、エラーやバグが発生しないこと、セキュリティ上の欠陥がないことを保証しません。
            </p>
            <p className="leading-relaxed">
              2. 当社は、本サービスによって生成されるグラフの正確性、完全性、有用性について保証しません。ユーザーは、生成されたグラフを自己の責任で確認し使用するものとします。
            </p>
            <p className="leading-relaxed">
              3. 本サービスの利用によりユーザーまたは第三者に生じた損害について、当社の故意または重過失による場合を除き、当社は一切の責任を負いません。
            </p>
            <p className="leading-relaxed">
              4. 当社が責任を負う場合でも、その損害賠償の範囲は、ユーザーが当社に支払った直近1ヶ月分の利用料金を上限とします。
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第10条（利用規約の変更）
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            当社は、必要に応じて本規約を変更することができます。変更後の規約は、本サービス上に掲載された時点で効力を生じるものとします。変更後もユーザーが本サービスを継続して利用した場合、変更後の規約に同意したものとみなされます。
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第11条（準拠法および管轄裁判所）
          </h2>
          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <p className="leading-relaxed">
              1. 本規約の解釈および適用は、日本法に準拠します。
            </p>
            <p className="leading-relaxed">
              2. 本サービスに関して生じた紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            第12条（お問い合わせ）
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            本規約に関するお問い合わせは、以下の連絡先までお願いいたします。
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-700 dark:text-gray-300">
              Email: chenway0124.takuya@gmail.com
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
