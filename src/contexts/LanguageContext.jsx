import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // ローカルストレージから言語設定を取得
    const savedLanguage = localStorage.getItem('app-language')
    if (savedLanguage) {
      return savedLanguage
    }
    
    // ブラウザの言語設定を取得
    const browserLanguage = navigator.language || navigator.userLanguage
    return browserLanguage.startsWith('ja') ? 'ja' : 'en'
  })

  useEffect(() => {
    // 言語設定をローカルストレージに保存
    localStorage.setItem('app-language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ja' ? 'en' : 'ja')
  }

  const t = (key) => {
    return translations[language]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

// 翻訳データ
const translations = {
  ja: {
    // ヘッダー
    'menu.open': 'メニューを開く',
    'menu.title': 'メニュー',
    'menu.updates': '更新情報',
    'menu.pricing': '料金プラン',
    'menu.howToUse': '使い方',
    'menu.faq': 'FAQ',
    'menu.comingSoon': '準備中',
    'menu.myPage': 'マイページ',
    'menu.logout': 'ログアウト',
    'menu.login': 'ログイン',
    'menu.signup': '新規登録',
    'menu.plan': 'プラン',
    
    // ホームページ
    'home.title': 'データからグラフを簡単作成',
    'home.subtitle': 'CSVファイルをアップロードして、美しいグラフを数秒で生成',
    'home.uploadButton': 'CSVファイルをアップロード',
    'home.orDragDrop': 'またはドラッグ&ドロップ',
    'home.reset': 'リセット',
    'home.download': 'ダウンロード',
    'home.analyzing': '分析中...',
    'home.resetDialog.title': '設定を破棄しますか？',
    'home.resetDialog.description': '現在の設定をすべて破棄して最初に戻ります。この操作は取り消せません。',
    'home.resetDialog.cancel': 'キャンセル',
    'home.resetDialog.ok': 'OK',
    
    // FileUpload
    'upload.title': 'ファイルをアップロード',
    'upload.description': 'CSV形式のファイルまたはExcelファイルをアップロードしてください',
    'upload.dropzone': 'ここにファイルをドロップ',
    'upload.or': 'または',
    'upload.selectFile': 'ファイルを選択',
    'upload.loading': '読み込み中...',
    'upload.error': 'エラー',
    'upload.sampleData': 'サンプルデータを使用',
    'upload.backToHome': 'ホームに戻る',
    'upload.supportedFormats': '対応形式: CSV, Excel (.xlsx, .xls)',
    'upload.maxSize': '最大サイズ: 10MB',
    'upload.sampleDataTitle': 'グラフ作成に最適なデータ構成の例',
    'upload.sampleDataDescription': 'どのような形式のファイルをアップロードすればスムーズにグラフが作成できるか、以下の例でご確認ください。',
    'upload.showSampleData': 'サンプルデータを表示',
    'upload.hideSampleData': 'サンプルデータを非表示',
    'upload.recommendedFormat': '推奨されるデータ構成例',
    'upload.sheetsFound': '個のシートが見つかりました',
    'upload.sheet': 'シート',
    'upload.rowsOfData': '行のデータ',
    'upload.delete': '削除',
    'upload.processing': 'ファイルを処理中...',
    
    // ChartDisplay
    'chart.title': 'グラフ',
    'chart.barChart': '棒グラフ',
    'chart.lineChart': '折れ線グラフ',
    'chart.pieChart': '円グラフ',
    'chart.downloadImage': 'グラフをダウンロード',
    'chart.reconfigure': '条件を変えて再生成',
    'chart.reset': 'リセット',
    'chart.showDataLabels': 'グラフにデータ値を表示',
    'chart.labelSize': 'ラベルサイズ',
    'chart.smaller': '小',
    'chart.larger': '大',
    'chart.settings': '設定',
    'chart.display': '表示',
    'chart.selectType': 'グラフの種類を選択',
    'chart.selectDescription': 'データに最適なグラフ形式を選んでください',
    'chart.dataLabels': 'データ値の表示',
    'chart.dataLabelsDescription': 'グラフ上にデータ値を表示します。ダウンロード時にも反映されます。',
    'chart.generatedChart': '生成されたグラフ',
    'chart.dataPoints': 'データポイント',
    'chart.dataSummary': 'データサマリー',
    'chart.dataCount': 'データ数',
    'chart.maximum': '最大値',
    'chart.minimum': '最小値',
    'chart.average': '平均値',
    'chart.median': '中央値',
    'chart.backToHome': 'ホームに戻る',
    'chart.auto': '自動',
    'chart.labelOverlapWarning': '💡 データ数が多い場合、ラベルが重なることがあります',
    
    // ChartInsights (AI解説)
    'insights.title': 'AI解説機能',
    'insights.description': 'グラフデータの傾向や特徴についてAIに質問できます',
    'insights.freeLimit': '（無料プラン: 5回/日）',
    'insights.standardLimit': '（50回/日）',
    'insights.proLimit': '（無制限）',
    'insights.proUnlimited': 'Pro - 無制限',
    'insights.upgradeTitle': 'アップグレードで回数制限を大幅拡張',
    'insights.currentLimit': '現在の利用制限: 5回/日',
    'insights.upgradeDescription': 'Standardプランなら50回/日、Proプランなら無制限で利用できます。',
    'insights.viewPlans': 'プランを見る',
    'insights.remainingUsage': '本日の残り利用回数',
    'insights.unlimited': '無制限でご利用いただけます',
    'insights.questionLabel': 'グラフについて質問してください',
    'insights.questionPlaceholder': '例：このデータの傾向を教えてください。最大値と最小値の差が大きい理由は何ですか？',
    'insights.submitHint': 'Enterキーで送信、Shift+Enterで改行',
    'insights.characterCount': '文字',
    'insights.analyzing': '分析中...',
    'insights.getInsights': 'AI解説を取得',
    'insights.error': 'エラー',
    'insights.resultTitle': 'AI解説結果',
    'insights.notesTitle': '💡 ご利用上の注意',
    'insights.noteUnlimited': 'Pro会員は無制限でご利用いただけます',
    'insights.noteDailyLimit': '1日あたり{limit}回まで利用可能です',
    'insights.noteReset': '利用回数は毎日0時（日本時間）にリセットされます',
    'insights.noteAccuracy': 'AIの回答は参考情報であり、完全な正確性を保証するものではありません',
    
    // 認証 (AuthModal)
    'auth.title': 'アカウント',
    'auth.description': 'ログインまたは新規登録してください',
    'auth.loginTab': 'ログイン',
    'auth.signupTab': '新規登録',
    'auth.email': 'メールアドレス',
    'auth.password': 'パスワード',
    'auth.name': '名前(任意)',
    'auth.namePlaceholder': '山田太郎',
    'auth.passwordConfirm': 'パスワード(確認)',
    'auth.passwordPlaceholder': '英数字と記号を含む12文字以上',
    'auth.passwordConfirmPlaceholder': 'パスワードを再入力',
    'auth.passwordRequirements': '大文字、小文字、数字、記号(!@#$など)を含む12文字以上',
    'auth.loggingIn': 'ログイン中...',
    'auth.loginButton': 'ログイン',
    'auth.registering': '登録中...',
    'auth.signupButton': '新規登録',
    'auth.forgotPassword': 'パスワードを忘れた場合',
    'auth.or': 'または',
    'auth.googleLogin': 'Googleでログイン',
    'auth.googleSignup': 'Googleで登録',
    'auth.error.emailInUse': 'このメールアドレスは既に登録されています',
    'auth.error.invalidEmail': 'メールアドレスの形式が正しくありません',
    'auth.error.userNotFound': 'ユーザーが見つかりません',
    'auth.error.wrongPassword': 'パスワードが間違っています',
    'auth.error.weakPassword': 'パスワードは英数字と記号を含む12文字以上で入力してください',
    'auth.error.popupClosed': 'ログインがキャンセルされました',
    'auth.error.recentLoginRequired': '再ログインが必要です',
    'auth.error.invalidCredential': '現在のパスワードが正しくありません',
    'auth.error.userDisabled': 'このアカウントは無効化されています',
    'auth.error.tooManyRequests': 'リクエストが多すぎます。しばらく待ってから再度お試しください',
    'auth.error.default': 'エラーが発生しました。もう一度お試しください',
    'auth.error.passwordMismatch': 'パスワードが一致しません',
    'auth.error.passwordInvalid': 'パスワードは以下を満たす必要があります: {errors}',
    
    // 料金プラン (Pricing)
    'pricing.pageTitle': 'グラフ作成がもっと快適に',
    'pricing.pageSubtitle': 'あなたに最適なプランを選んでください',
    'pricing.monthly': '月額',
    'pricing.yearly': '年額',
    'pricing.yearlyBadge': 'お得',
    'pricing.perMonth': '/月',
    'pricing.yearlyTotal': '年間 ¥{price} ({savings}%お得)',
    'pricing.popularChoice': '{percent}%のユーザーが選択',
    'pricing.perDay': '≈ 1日たった¥{price}',
    'pricing.processing': '処理中...',
    'pricing.currentPlan': '現在のプラン',
    'pricing.getStartedFree': '無料で始める',
    'pricing.upgrade': 'アップグレード',
    'pricing.planFree': 'Free',
    'pricing.planStandard': 'Standard',
    'pricing.planPro': 'Pro',
    'pricing.descFree': 'グラフ作成を始める',
    'pricing.descStandard': '本格的にグラフ分析',
    'pricing.descPro': 'プロフェッショナル向け',
    'pricing.badgePopular': '人気No.1',
    'pricing.feature.filesFree': 'ファイル保存：3個まで',
    'pricing.feature.filesStandard': 'ファイル保存：10個まで',
    'pricing.feature.filesPro': 'ファイル保存：無制限',
    'pricing.feature.aiFree': 'AIインサイト：月5回',
    'pricing.feature.aiStandard': 'AIインサイト：月50回',
    'pricing.feature.aiPro': 'AIインサイト：無制限',
    'pricing.feature.basicCharts': '基本的なグラフ作成機能',
    'pricing.feature.allCharts': '全グラフ作成機能',
    'pricing.feature.communitySupport': 'コミュニティサポート',
    'pricing.feature.prioritySupport': '優先サポート',
    'pricing.feature.dataExport': 'データエクスポート機能',
    'pricing.feature.apiAccess': 'API アクセス',
    'pricing.feature.apiAccessSoon': 'API アクセス（準備中）',
    'pricing.faqTitle': 'よくある質問',
    'pricing.faq1.question': 'プランの変更はいつでもできますか？',
    'pricing.faq1.answer': 'はい、いつでもプランの変更やキャンセルが可能です。プラン変更は即座に反映されます。',
    'pricing.faq2.question': 'AIインサイトとは何ですか？',
    'pricing.faq2.answer': 'AIがあなたのグラフデータを分析し、トレンドや特徴、改善点を自動的に提案する機能です。',
    'pricing.faq3.question': '無料プランから始められますか？',
    'pricing.faq3.answer': 'もちろんです！まずは無料プランでサービスをお試しいただき、必要に応じてアップグレードしてください。',
    'pricing.error.loginRequired': 'まずはアカウント登録が必要です',
    'pricing.error.priceIdNotFound': '価格IDが見つかりません',
    'pricing.error.checkoutFailed': 'エラーが発生しました: {message}',
    'pricing.error.paymentFailed': '決済ページの作成に失敗しました。もう一度お試しください。',
    
    // プライシング
    'pricing.title': '料金プラン',
    
    // フッター
    'footer.terms': '利用規約',
    'footer.privacy': 'プライバシーポリシー',
    'footer.legal': '特定商取引法に基づく表記',
    'footer.copyright': '© 2025 Grafico. All rights reserved.',
    
    // エラーメッセージ
    'error.fileType': 'CSVファイルを選択してください',
    'error.network': 'ネットワークエラーが発生しました',
  },
  
  en: {
    // Header
    'menu.open': 'Open menu',
    'menu.title': 'Menu',
    'menu.updates': 'Updates',
    'menu.pricing': 'Pricing',
    'menu.howToUse': 'How to Use',
    'menu.faq': 'FAQ',
    'menu.comingSoon': 'Coming Soon',
    'menu.myPage': 'My Page',
    'menu.logout': 'Logout',
    'menu.login': 'Login',
    'menu.signup': 'Sign Up',
    'menu.plan': 'Plan',
    
    // Home Page
    'home.title': 'Create Charts from Data Easily',
    'home.subtitle': 'Upload a CSV file and generate beautiful charts in seconds',
    'home.uploadButton': 'Upload CSV File',
    'home.orDragDrop': 'or drag and drop',
    'home.reset': 'Reset',
    'home.download': 'Download',
    'home.analyzing': 'Analyzing...',
    'home.resetDialog.title': 'Discard Settings?',
    'home.resetDialog.description': 'This will discard all current settings and return to the beginning. This action cannot be undone.',
    'home.resetDialog.cancel': 'Cancel',
    'home.resetDialog.ok': 'OK',
    
    // FileUpload
    'upload.title': 'Upload File',
    'upload.description': 'Upload a CSV or Excel file',
    'upload.dropzone': 'Drop file here',
    'upload.or': 'or',
    'upload.selectFile': 'Select File',
    'upload.loading': 'Loading...',
    'upload.error': 'Error',
    'upload.sampleData': 'Use Sample Data',
    'upload.backToHome': 'Back to Home',
    'upload.supportedFormats': 'Supported formats: CSV, Excel (.xlsx, .xls)',
    'upload.maxSize': 'Max size: 10MB',
    'upload.sampleDataTitle': 'Example of Optimal Data Structure for Charts',
    'upload.sampleDataDescription': 'See the example below to understand what file format works best for smooth chart creation.',
    'upload.showSampleData': 'Show Sample Data',
    'upload.hideSampleData': 'Hide Sample Data',
    'upload.recommendedFormat': 'Recommended Data Structure Example',
    'upload.sheetsFound': 'sheets found',
    'upload.sheet': 'Sheet',
    'upload.rowsOfData': 'rows of data',
    'upload.delete': 'Delete',
    'upload.processing': 'Processing file...',
    
    // ChartDisplay
    'chart.title': 'Chart',
    'chart.barChart': 'Bar Chart',
    'chart.lineChart': 'Line Chart',
    'chart.pieChart': 'Pie Chart',
    'chart.downloadImage': 'Download Chart',
    'chart.reconfigure': 'Reconfigure',
    'chart.reset': 'Reset',
    'chart.showDataLabels': 'Show data values on chart',
    'chart.labelSize': 'Label Size',
    'chart.smaller': 'Smaller',
    'chart.larger': 'Larger',
    'chart.settings': 'Settings',
    'chart.display': 'Display',
    'chart.selectType': 'Select Chart Type',
    'chart.selectDescription': 'Choose the best chart format for your data',
    'chart.dataLabels': 'Data Value Display',
    'chart.dataLabelsDescription': 'Display data values on the chart. This will also be reflected when downloading.',
    'chart.generatedChart': 'Generated Chart',
    'chart.dataPoints': 'data points',
    'chart.dataSummary': 'Data Summary',
    'chart.dataCount': 'Count',
    'chart.maximum': 'Maximum',
    'chart.minimum': 'Minimum',
    'chart.average': 'Average',
    'chart.median': 'Median',
    'chart.backToHome': 'Back to Home',
    'chart.auto': 'Auto',
    'chart.labelOverlapWarning': '💡 Labels may overlap when there are many data points',
    
    // ChartInsights (AI解説)
    'insights.title': 'AI Insights',
    'insights.description': 'Ask AI about trends and characteristics in your chart data',
    'insights.freeLimit': '(Free Plan: 5 times/day)',
    'insights.standardLimit': '(50 times/day)',
    'insights.proLimit': '(Unlimited)',
    'insights.proUnlimited': 'Pro - Unlimited',
    'insights.upgradeTitle': 'Expand Usage Limits with Upgrade',
    'insights.currentLimit': 'Current limit: 5 times/day',
    'insights.upgradeDescription': 'Standard plan: 50 times/day, Pro plan: unlimited usage.',
    'insights.viewPlans': 'View Plans',
    'insights.remainingUsage': 'Today\'s remaining usage',
    'insights.unlimited': 'Unlimited usage available',
    'insights.questionLabel': 'Ask a question about your chart',
    'insights.questionPlaceholder': 'Example: Tell me about the trends in this data. Why is the difference between maximum and minimum values so large?',
    'insights.submitHint': 'Press Enter to submit, Shift+Enter for new line',
    'insights.characterCount': 'characters',
    'insights.analyzing': 'Analyzing...',
    'insights.getInsights': 'Get AI Insights',
    'insights.error': 'Error',
    'insights.resultTitle': 'AI Insights Result',
    'insights.notesTitle': '💡 Usage Notes',
    'insights.noteUnlimited': 'Pro members can use this feature unlimited times',
    'insights.noteDailyLimit': 'Up to {limit} uses per day',
    'insights.noteReset': 'Usage count resets daily at midnight (JST)',
    'insights.noteAccuracy': 'AI responses are for reference only and complete accuracy is not guaranteed',
    
    // Authentication (AuthModal)
    'auth.title': 'Account',
    'auth.description': 'Login or sign up',
    'auth.loginTab': 'Login',
    'auth.signupTab': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name (Optional)',
    'auth.namePlaceholder': 'John Doe',
    'auth.passwordConfirm': 'Confirm Password',
    'auth.passwordPlaceholder': '12+ characters with letters, numbers & symbols',
    'auth.passwordConfirmPlaceholder': 'Re-enter password',
    'auth.passwordRequirements': '12+ characters including uppercase, lowercase, numbers, and symbols (!@#$, etc.)',
    'auth.loggingIn': 'Logging in...',
    'auth.loginButton': 'Login',
    'auth.registering': 'Registering...',
    'auth.signupButton': 'Sign Up',
    'auth.forgotPassword': 'Forgot password?',
    'auth.or': 'or',
    'auth.googleLogin': 'Login with Google',
    'auth.googleSignup': 'Sign up with Google',
    'auth.error.emailInUse': 'This email address is already registered',
    'auth.error.invalidEmail': 'Invalid email format',
    'auth.error.userNotFound': 'User not found',
    'auth.error.wrongPassword': 'Incorrect password',
    'auth.error.weakPassword': 'Password must be 12+ characters with letters, numbers and symbols',
    'auth.error.popupClosed': 'Login was cancelled',
    'auth.error.recentLoginRequired': 'Re-login required',
    'auth.error.invalidCredential': 'Current password is incorrect',
    'auth.error.userDisabled': 'This account has been disabled',
    'auth.error.tooManyRequests': 'Too many requests. Please try again later',
    'auth.error.default': 'An error occurred. Please try again',
    'auth.error.passwordMismatch': 'Passwords do not match',
    'auth.error.passwordInvalid': 'Password must meet the following requirements: {errors}',
    
    // Pricing
    'pricing.pageTitle': 'Make Chart Creation More Comfortable',
    'pricing.pageSubtitle': 'Choose the plan that\'s right for you',
    'pricing.monthly': 'Monthly',
    'pricing.yearly': 'Yearly',
    'pricing.yearlyBadge': 'Save',
    'pricing.perMonth': '/month',
    'pricing.yearlyTotal': 'Annual ¥{price} ({savings}% off)',
    'pricing.popularChoice': '{percent}% of users choose this',
    'pricing.perDay': '≈ Only ¥{price}/day',
    'pricing.processing': 'Processing...',
    'pricing.currentPlan': 'Current Plan',
    'pricing.getStartedFree': 'Get Started Free',
    'pricing.upgrade': 'Upgrade',
    'pricing.planFree': 'Free',
    'pricing.planStandard': 'Standard',
    'pricing.planPro': 'Pro',
    'pricing.descFree': 'Start creating charts',
    'pricing.descStandard': 'Serious chart analysis',
    'pricing.descPro': 'For professionals',
    'pricing.badgePopular': 'Most Popular',
    'pricing.feature.filesFree': 'File storage: Up to 3',
    'pricing.feature.filesStandard': 'File storage: Up to 10',
    'pricing.feature.filesPro': 'File storage: Unlimited',
    'pricing.feature.aiFree': 'AI Insights: 5/month',
    'pricing.feature.aiStandard': 'AI Insights: 50/month',
    'pricing.feature.aiPro': 'AI Insights: Unlimited',
    'pricing.feature.basicCharts': 'Basic chart creation',
    'pricing.feature.allCharts': 'All chart features',
    'pricing.feature.communitySupport': 'Community support',
    'pricing.feature.prioritySupport': 'Priority support',
    'pricing.feature.dataExport': 'Data export',
    'pricing.feature.apiAccess': 'API Access',
    'pricing.feature.apiAccessSoon': 'API Access (Coming Soon)',
    'pricing.faqTitle': 'Frequently Asked Questions',
    'pricing.faq1.question': 'Can I change my plan anytime?',
    'pricing.faq1.answer': 'Yes, you can change or cancel your plan at any time. Plan changes take effect immediately.',
    'pricing.faq2.question': 'What are AI Insights?',
    'pricing.faq2.answer': 'AI analyzes your chart data and automatically suggests trends, characteristics, and improvements.',
    'pricing.faq3.question': 'Can I start with the free plan?',
    'pricing.faq3.answer': 'Of course! Try our service with the free plan first, and upgrade when you need to.',
    'pricing.error.loginRequired': 'Please register for an account first',
    'pricing.error.priceIdNotFound': 'Price ID not found',
    'pricing.error.checkoutFailed': 'An error occurred: {message}',
    'pricing.error.paymentFailed': 'Failed to create payment page. Please try again.',
    
    // Pricing
    'pricing.title': 'Pricing Plans',
    
    // Footer
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.legal': 'Legal Notice',
    'footer.copyright': '© 2025 Grafico. All rights reserved.',
    
    // Error messages
    'error.fileType': 'Please select a CSV file',
    'error.network': 'A network error occurred',
  }
}
