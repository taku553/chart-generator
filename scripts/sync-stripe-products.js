// Stripe商品を手動でFirestoreに同期するスクリプト
// 一時的な開発用 - 本番ではWebhookを使用すること

import admin from 'firebase-admin';
import dotenv from 'dotenv';

// .env.local から環境変数を読み込む
dotenv.config({ path: '.env.local' });

// Firebase Admin SDK初期化
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = admin.firestore();

async function syncProducts() {
  console.log('Stripe商品をFirestoreに同期中...\n');

  const products = [
    {
      id: 'prod_TjuJKUTwDIbXcn', // Standard Plan
      name: 'Standard Plan',
      description: 'グラフ化済みファイルを10個まで保存可能、AIインサイト50回/月',
      active: true,
      role: 'standard',
      metadata: {
        firebaseRole: 'standard',
      },
      prices: [
        {
          id: 'price_1SmQV8EAvqOB6oQP46mevNgM', // Standard Monthly
          active: true,
          currency: 'jpy',
          unit_amount: 980, // ¥980（JPYは整数値）
          type: 'recurring',
          interval: 'month',
          interval_count: 1,
          metadata: {
            firebaseRole: 'standard',
          },
        },
        {
          id: 'price_1SmQV7EAvqOB6oQPx4obgeQ8', // Standard Yearly
          active: true,
          currency: 'jpy',
          unit_amount: 9800, // ¥9,800（JPYは整数値）
          type: 'recurring',
          interval: 'year',
          interval_count: 1,
          metadata: {
            firebaseRole: 'standard',
          },
        },
      ],
    },
    {
      id: 'prod_TjuJyxyxfbuzPX', // Pro Plan
      name: 'Pro Plan',
      description: '無制限のファイル保存とAIインサイト、優先サポート',
      active: true,
      role: 'pro',
      metadata: {
        firebaseRole: 'pro',
      },
      prices: [
        {
          id: 'price_1SmQV6EAvqOB6oQP7gePYfMM', // Pro Monthly
          active: true,
          currency: 'jpy',
          unit_amount: 1980, // ¥1,980（JPYは整数値）
          type: 'recurring',
          interval: 'month',
          interval_count: 1,
          metadata: {
            firebaseRole: 'pro',
          },
        },
        {
          id: 'price_1SmQV6EAvqOB6oQPvTV6xrSK', // Pro Yearly
          active: true,
          currency: 'jpy',
          unit_amount: 19800, // ¥19,800（JPYは整数値）
          type: 'recurring',
          interval: 'year',
          interval_count: 1,
          metadata: {
            firebaseRole: 'pro',
          },
        },
      ],
    },
  ];

  try {
    for (const product of products) {
      const { id, prices, ...productData } = product;

      // 商品を作成
      console.log(`商品を作成中: ${productData.name} (${id})`);
      await db.collection('products').doc(id).set(productData);
      console.log(`✓ 商品作成完了: ${productData.name}\n`);

      // 価格を作成
      for (const price of prices) {
        const { id: priceId, ...priceData } = price;
        console.log(`  価格を作成中: ${priceData.interval}ly (${priceId})`);
        await db
          .collection('products')
          .doc(id)
          .collection('prices')
          .doc(priceId)
          .set(priceData);
        console.log(`  ✓ 価格作成完了: ¥${priceData.unit_amount.toLocaleString()}\n`);
      }
    }

    console.log('\n✓ すべての商品の同期が完了しました！');
    console.log('\nFirebaseコンソールで確認:');
    console.log('https://console.firebase.google.com/project/grafico-4dea6/firestore/data');
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    process.exit();
  }
}

syncProducts();
