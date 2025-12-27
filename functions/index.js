/**
 * Stripe Subscription同期Cloud Function
 * customers/{userId}/subscriptions/{subId}の変更を監視し、
 * users/{userId}のplanフィールドを自動更新
 */

import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

/**
 * サブスクリプションステータスに基づいてプラン名を決定
 */
function getPlanFromSubscription(subscription) {
  if (!subscription || subscription.status !== 'active') {
    return 'free';
  }

  // metadata.firebaseRoleまたはitems配列からロールを取得
  const firebaseRole = 
    subscription.items?.[0]?.price?.metadata?.firebaseRole ||
    subscription.items?.[0]?.plan?.metadata?.firebaseRole ||
    subscription.role;

  // firebaseRoleに基づいてプラン名を決定
  switch (firebaseRole) {
    case 'standard':
      return 'premium'; // 既存のAIインサイトロジックと互換性のため
    case 'pro':
      return 'premium'; // Proプランもpremiumとして扱う
    default:
      return 'free';
  }
}

/**
 * サブスクリプション変更時のトリガー
 */
export const syncUserPlanOnSubscriptionChange = onDocumentWritten(
  {
    document: 'customers/{userId}/subscriptions/{subscriptionId}',
    region: 'asia-northeast1',
  },
  async (event) => {
    const userId = event.params.userId;
    const subscriptionData = event.data?.after?.data();

    console.log(`🔄 Subscription変更検知: User=${userId}`);
    console.log('Subscription Data:', JSON.stringify(subscriptionData, null, 2));

    try {
      // サブスクリプションデータからプランを決定
      const newPlan = getPlanFromSubscription(subscriptionData);
      
      console.log(`✅ 決定されたプラン: ${newPlan}`);

      // usersコレクションを更新
      const userRef = db.collection('users').doc(userId);
      await userRef.set(
        {
          plan: newPlan,
          subscriptionStatus: subscriptionData?.status || null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      console.log(`✅ User ${userId} のプランを ${newPlan} に更新しました`);
    } catch (error) {
      console.error('❌ プラン更新エラー:', error);
      throw error;
    }
  }
);
