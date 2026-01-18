import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext.jsx'
import { useLanguage } from '@/contexts/LanguageContext'
import { db } from '@/lib/firebase'
import { collection, addDoc, onSnapshot, doc, setDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Check, Sparkles, Zap, Crown, Loader2 } from 'lucide-react'

export function Pricing() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [billingPeriod, setBillingPeriod] = useState('monthly') // 'monthly' or 'yearly'
  const [loading, setLoading] = useState(false)
  const [loadingPlanId, setLoadingPlanId] = useState(null)

  const plans = [
    {
      id: 'free',
      name: t('pricing.planFree'),
      price: 0,
      yearlyPrice: 0,
      priceId: {
        monthly: null,
        yearly: null,
      },
      description: t('pricing.descFree'),
      icon: Sparkles,
      iconColor: 'text-gray-500',
      features: [
        { text: t('pricing.feature.filesFree'), included: true },
        { text: t('pricing.feature.aiFree'), included: true },
        { text: t('pricing.feature.basicCharts'), included: true },
        { text: t('pricing.feature.communitySupport'), included: true },
        { text: t('pricing.feature.prioritySupport'), included: false },
        { text: t('pricing.feature.apiAccess'), included: false },
      ],
      cta: user ? t('pricing.currentPlan') : t('pricing.getStartedFree'),
      popular: false,
      buttonVariant: 'outline',
    },
    {
      id: 'standard',
      name: t('pricing.planStandard'),
      price: 980,
      yearlyPrice: 9800, // 2ヶ月分お得
      priceId: {
        monthly: 'price_1SfP14CY4jOV83AypPkVT1Rg',
        yearly: 'price_1SfPGBCY4jOV83AyafyHSftj',
      },
      description: t('pricing.descStandard'),
      icon: Zap,
      iconColor: 'text-blue-500',
      badge: t('pricing.badgePopular'),
      features: [
        { text: t('pricing.feature.filesStandard'), included: true },
        { text: t('pricing.feature.aiStandard'), included: true },
        { text: t('pricing.feature.allCharts'), included: true },
        { text: t('pricing.feature.prioritySupport'), included: true },
        { text: t('pricing.feature.dataExport'), included: true },
        { text: t('pricing.feature.apiAccess'), included: false },
      ],
      cta: t('pricing.upgrade'),
      popular: true,
      buttonVariant: 'default',
      savingsText: t('pricing.popularChoice').replace('{percent}', '75'),
    },
    {
      id: 'pro',
      name: t('pricing.planPro'),
      price: 1980,
      yearlyPrice: 19800,
      priceId: {
        monthly: 'price_1SfPBXCY4jOV83AyuleCcsKe',
        yearly: 'price_1SfPHJCY4jOV83AyK9JTwjaR',
      },
      description: t('pricing.descPro'),
      icon: Crown,
      iconColor: 'text-amber-500',
      features: [
        { text: t('pricing.feature.filesPro'), included: true },
        { text: t('pricing.feature.aiPro'), included: true },
        { text: t('pricing.feature.allCharts'), included: true },
        { text: t('pricing.feature.prioritySupport'), included: true },
        { text: t('pricing.feature.dataExport'), included: true },
        { text: t('pricing.feature.apiAccessSoon'), included: true },
      ],
      cta: t('pricing.upgrade'),
      popular: false,
      buttonVariant: 'outline',
    },
  ]

  const handlePlanSelect = async (plan) => {
    // Freeプランの場合
    if (plan.id === 'free') {
      if (!user) {
        navigate('/')
      }
      return
    }

    // 未ログインユーザー
    if (!user) {
      alert(t('pricing.error.loginRequired'))
      navigate('/')
      return
    }

    try {
      setLoading(true)
      setLoadingPlanId(plan.id)

      // 選択された価格IDを取得
      const priceId = plan.priceId[billingPeriod]

      if (!priceId) {
        throw new Error(t('pricing.error.priceIdNotFound'))
      }

      console.log('🔵 決済開始:', {
        userId: user.uid,
        planId: plan.id,
        priceId,
        billingPeriod,
      })

      // Stripe Checkout Sessionを作成
      const checkoutSessionRef = collection(
        db,
        'customers',
        user.uid,
        'checkout_sessions'
      )

      const docRef = await addDoc(checkoutSessionRef, {
        price: priceId,
        success_url: window.location.origin + '/mypage?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: window.location.origin + '/pricing',
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        locale: 'ja',
      })

      console.log('✅ Checkout Session作成成功:', docRef.id)

      // Checkout URLが生成されるまで待つ
      const unsubscribe = onSnapshot(docRef, async (snap) => {
        const data = snap.data()
        
        console.log('📡 Snapshot受信:', data)
        
        if (!data) return

        const { error, url } = data

        if (error) {
          console.error('❌ Stripeエラー:', error)
          unsubscribe()
          setLoading(false)
          setLoadingPlanId(null)
          alert(t('pricing.error.checkoutFailed').replace('{message}', error.message))
        }

        if (url) {
          console.log('🚀 リダイレクト:', url)
          
          // ✅ usersコレクションのplanを選択されたプランに更新
          try {
            const userRef = doc(db, 'users', user.uid)
            await setDoc(userRef, {
              plan: plan.id, // 'standard' または 'pro'
              subscriptionPending: true, // 決済処理中フラグ
              updatedAt: new Date().toISOString(),
            }, { merge: true })
            console.log(`✅ User plan更新: ${plan.id} (決済処理中)`)
          } catch (updateError) {
            console.error('❌ Plan更新エラー:', updateError)
            // エラーでも決済ページには遷移させる
          }
          
          unsubscribe()
          // Stripeの決済ページにリダイレクト
          window.location.assign(url)
        }
      })
    } catch (error) {
      console.error('決済エラー:', error)
      alert(t('pricing.error.paymentFailed'))
      setLoading(false)
      setLoadingPlanId(null)
    }
  }

  const calculateYearlySavings = (monthlyPrice, yearlyPrice) => {
    const monthlyCost = monthlyPrice * 12
    const savings = monthlyCost - yearlyPrice
    return Math.round((savings / monthlyCost) * 100)
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* ヘッダーセクション */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {t('pricing.pageTitle')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {t('pricing.pageSubtitle')}
        </p>

        {/* 料金切り替えトグル */}
        <div className="inline-flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-md transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-gray-700 shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {t('pricing.monthly')}
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-md transition-all relative ${
              billingPeriod === 'yearly'
                ? 'bg-white dark:bg-gray-700 shadow-sm font-semibold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {t('pricing.yearly')}
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              {t('pricing.yearlyBadge')}
            </span>
          </button>
        </div>
      </div>

      {/* プランカード */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => {
          const Icon = plan.icon
          const displayPrice = billingPeriod === 'yearly' ? plan.yearlyPrice : plan.price
          const monthlyEquivalent = billingPeriod === 'yearly' ? Math.round(plan.yearlyPrice / 12) : plan.price
          const savings = billingPeriod === 'yearly' && plan.yearlyPrice > 0 
            ? calculateYearlySavings(plan.price, plan.yearlyPrice) 
            : 0

          return (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? 'border-blue-500 border-2 shadow-xl scale-105 md:scale-110'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 ${plan.iconColor}`} />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="text-center pb-6">
                <div className="mb-6">
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl md:text-5xl font-bold">
                      ¥{monthlyEquivalent.toLocaleString()}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 mb-2">{t('pricing.perMonth')}</span>
                  </div>
                  {billingPeriod === 'yearly' && plan.price > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                        {t('pricing.yearlyTotal').replace('{price}', displayPrice.toLocaleString()).replace('{savings}', savings)}
                      </p>
                    </div>
                  )}
                  {plan.savingsText && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {plan.savingsText}
                    </p>
                  )}
                  {plan.id !== 'free' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t('pricing.perDay').replace('{price}', Math.round(monthlyEquivalent / 30))}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 text-left mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          feature.included
                            ? 'text-green-500'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                      <span
                        className={
                          feature.included
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-500 line-through'
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={plan.buttonVariant}
                  className="w-full"
                  size="lg"
                  onClick={() => handlePlanSelect(plan)}
                  disabled={(plan.id === 'free' && user) || (loading && loadingPlanId === plan.id)}
                >
                  {loading && loadingPlanId === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('pricing.processing')}
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* FAQ セクション */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">{t('pricing.faqTitle')}</h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t('pricing.faq1.question')}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('pricing.faq1.answer')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t('pricing.faq2.question')}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('pricing.faq2.answer')}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">{t('pricing.faq3.question')}</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t('pricing.faq3.answer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
