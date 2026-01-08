// テスト環境の商品を本番環境に移行するスクリプト
import Stripe from 'stripe';
import dotenv from 'dotenv';

// .env.local から環境変数を読み込む
dotenv.config({ path: '.env.local' });

// テスト環境と本番環境のAPIキー
const testStripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);
const liveStripe = new Stripe(process.env.STRIPE_LIVE_SECRET_KEY);

async function migrateProducts() {
  console.log('🔄 Stripe商品をテスト環境から本番環境に移行中...\n');

  try {
    // テスト環境から全商品を取得
    console.log('📥 テスト環境から商品を取得中...');
    const testProducts = await testStripe.products.list({
      limit: 100,
      active: true,
    });

    console.log(`見つかった商品: ${testProducts.data.length}件\n`);

    for (const testProduct of testProducts.data) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📦 商品: ${testProduct.name}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      // 本番環境に同じ商品が存在するかチェック
      const existingProducts = await liveStripe.products.search({
        query: `name:'${testProduct.name}'`,
      });

      let liveProduct;
      if (existingProducts.data.length > 0) {
        console.log(`⚠️  既存の商品が見つかりました。更新します...`);
        liveProduct = await liveStripe.products.update(
          existingProducts.data[0].id,
          {
            name: testProduct.name,
            description: testProduct.description,
            metadata: testProduct.metadata,
            active: testProduct.active,
          }
        );
        console.log(`✅ 商品を更新しました (ID: ${liveProduct.id})`);
      } else {
        console.log(`➕ 新規商品を作成します...`);
        liveProduct = await liveStripe.products.create({
          name: testProduct.name,
          description: testProduct.description,
          metadata: testProduct.metadata,
          active: testProduct.active,
        });
        console.log(`✅ 商品を作成しました (ID: ${liveProduct.id})`);
      }

      // テスト環境からこの商品の価格を取得
      console.log(`\n💰 価格情報を取得中...`);
      const testPrices = await testStripe.prices.list({
        product: testProduct.id,
        limit: 100,
      });

      console.log(`見つかった価格: ${testPrices.data.length}件`);

      // 価格を本番環境に作成
      for (const testPrice of testPrices.data) {
        if (!testPrice.active) {
          console.log(`  ⏭️  非アクティブな価格をスキップ: ${testPrice.id}`);
          continue;
        }

        // 本番環境に同じ価格が存在するかチェック
        const existingPrices = await liveStripe.prices.list({
          product: liveProduct.id,
          active: true,
        });

        const priceExists = existingPrices.data.some(
          (p) =>
            p.unit_amount === testPrice.unit_amount &&
            p.currency === testPrice.currency &&
            p.recurring?.interval === testPrice.recurring?.interval
        );

        if (priceExists) {
          console.log(
            `  ⏭️  同じ価格が既に存在: ${testPrice.unit_amount} ${testPrice.currency} (${testPrice.recurring?.interval || '単発'})`
          );
          continue;
        }

        // 価格を作成
        const priceData = {
          product: liveProduct.id,
          currency: testPrice.currency,
          unit_amount: testPrice.unit_amount,
          metadata: testPrice.metadata,
          active: testPrice.active,
        };

        if (testPrice.type === 'recurring') {
          priceData.recurring = {
            interval: testPrice.recurring.interval,
            interval_count: testPrice.recurring.interval_count,
          };
        }

        const livePrice = await liveStripe.prices.create(priceData);
        
        const amountDisplay = testPrice.unit_amount 
          ? `¥${testPrice.unit_amount.toLocaleString()}` 
          : '無料';
        const intervalDisplay = testPrice.recurring 
          ? ` / ${testPrice.recurring.interval === 'month' ? '月' : '年'}` 
          : '';
        
        console.log(`  ✅ 価格を作成: ${amountDisplay}${intervalDisplay} (ID: ${livePrice.id})`);
      }
    }

    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✨ 移行が完了しました！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Stripeダッシュボードで確認:');
    console.log('https://dashboard.stripe.com/products');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('\n⚠️  APIキーが正しく設定されているか確認してください。');
    }
    process.exit(1);
  }
}

migrateProducts();
