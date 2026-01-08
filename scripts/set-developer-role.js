// 開発者アカウントにProプランを直接付与するスクリプト
import admin from 'firebase-admin';

admin.initializeApp({
  projectId: 'grafico-4dea6',
});

const db = admin.firestore();

// 🔧 ここに開発者のメールアドレスを追加
const DEVELOPER_EMAILS = [
  // 'your-primary@gmail.com',
  // 'your-secondary@gmail.com',
];

async function setDeveloperRole() {
  console.log('🔧 開発者ロールを設定中...\n');

  if (DEVELOPER_EMAILS.length === 0) {
    console.log('⚠️  開発者メールアドレスが設定されていません。');
    console.log('スクリプト内の DEVELOPER_EMAILS 配列にメールアドレスを追加してください。\n');
    process.exit(1);
  }

  for (const email of DEVELOPER_EMAILS) {
    try {
      console.log(`\n📧 処理中: ${email}`);

      // メールアドレスからユーザーを検索
      const usersSnapshot = await db
        .collection('users')
        .where('email', '==', email)
        .get();

      if (usersSnapshot.empty) {
        console.log(`  ⚠️  Firestoreにユーザーが見つかりません`);
        console.log(`  💡 このメールアドレスで一度アプリにログインしてください`);
        continue;
      }

      // ユーザードキュメントを更新
      const userDoc = usersSnapshot.docs[0];
      const currentData = userDoc.data();
      
      console.log(`  📋 現在のプラン: ${currentData.plan || 'なし'}`);

      await userDoc.ref.update({
        plan: 'pro',
        isDeveloper: true,
        updatedAt: new Date().toISOString(),
      });

      console.log(`  ✅ Proプランを設定しました！`);
      console.log(`  🎉 AIインサイトなどの機能が無制限で使用できます`);

    } catch (error) {
      console.error(`  ❌ エラー: ${error.message}`);
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ 処理完了！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 Firebaseコンソールで確認:');
  console.log('https://console.firebase.google.com/project/grafico-4dea6/firestore/data/~2Fusers\n');

  process.exit(0);
}

setDeveloperRole();
