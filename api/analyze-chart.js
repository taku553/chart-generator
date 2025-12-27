// api/analyze-chart.js
import admin from 'firebase-admin';
import OpenAI from 'openai';

// Firebase Admin初期化（シングルトン）
if (!admin.apps.length) {
  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // 引用符で囲まれている場合は削除
    if (privateKey?.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }
    if (privateKey?.startsWith("'") && privateKey.endsWith("'")) {
      privateKey = privateKey.slice(1, -1);
    }
    
    // エスケープされた改行文字を実際の改行に変換
    privateKey = privateKey?.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
}

const db = admin.firestore();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// データ要約関数（トークン節約）- 元データとの関係性も含める
function summarizeChartData(chartData, sourceData) {
  try {
    const parsed = typeof chartData === 'string' ? JSON.parse(chartData) : chartData;
    
    // 基本情報
    const summary = {
      chartInfo: {
        type: parsed.type || 'unknown',
        title: parsed.chartTitle || parsed.yColumn || '未設定',
        xAxis: parsed.xColumn || 'X軸',
        yAxis: parsed.yColumn || 'Y軸',
        unitSettings: parsed.unitSettings || null,
      }
    };

    // 単位設定の詳細を明示（特に重要な基準値情報）
    if (parsed.unitSettings) {
      const yUnit = parsed.unitSettings.y || {};
      const xUnit = parsed.unitSettings.x || {};
      
      summary.unitInfo = {
        yAxis: {
          unitType: yUnit.unitType || 'なし',
          unit: yUnit.unit || '',
          scale: yUnit.scale || 1,
          scaleLabel: yUnit.scaleLabel || '',
          prefix: yUnit.prefix || '',
          suffix: yUnit.suffix || '',
          description: yUnit.scaleLabel 
            ? `グラフの数値は「${yUnit.scaleLabel}」単位です。実際の値は表示値×${yUnit.scale}です。`
            : '基準値設定なし'
        },
        xAxis: {
          unitType: xUnit.unitType || 'なし',
          unit: xUnit.unit || '',
          scale: xUnit.scale || 1,
          scaleLabel: xUnit.scaleLabel || '',
          prefix: xUnit.prefix || '',
          suffix: xUnit.suffix || ''
        }
      };
    }

    // グラフデータの統計情報
    if (parsed.values && Array.isArray(parsed.values) && parsed.values.length > 0) {
      const values = parsed.values.filter(v => typeof v === 'number');
      
      if (values.length > 0) {
        const sum = values.reduce((a, b) => a + b, 0);
        const sorted = [...values].sort((a, b) => a - b);
        const median = sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];
        
        summary.statistics = {
          dataPoints: values.length,
          max: Math.max(...values),
          min: Math.min(...values),
          average: sum / values.length,
          median: median,
        };
        
        // データ量が多い場合はサンプルのみ
        if (values.length > 20) {
          summary.labels = parsed.labels?.slice(0, 10) || [];
          summary.sampleValues = values.slice(0, 10);
          summary.note = `${values.length}件中、最初の10件のみ表示`;
        } else {
          summary.labels = parsed.labels || [];
          summary.values = values;
        }
      }
    }

    // 元データ情報（利用可能な場合）
    if (sourceData && sourceData.rawRows && Array.isArray(sourceData.rawRows)) {
      const rawRows = sourceData.rawRows;
      
      summary.sourceInfo = {
        fileName: sourceData.fileName || 'アップロードファイル',
        totalRows: rawRows.length,
        totalColumns: rawRows[0]?.length || 0,
        selectedRange: sourceData.selectedRange || '全体',
        headerRange: sourceData.headerRange || 'なし',
      };

      // 元データの完全なヘッダー情報（1行目を想定）
      if (rawRows.length > 0) {
        summary.sourceInfo.allColumnHeaders = rawRows[0].map((h, idx) => ({
          index: idx,
          name: String(h || `列${idx + 1}`).trim()
        }));
        
        // データサンプル（先頭から最大20行）
        summary.sourceInfo.dataSample = rawRows.slice(1, Math.min(21, rawRows.length)).map(row => {
          const rowObj = {};
          rawRows[0].forEach((header, idx) => {
            rowObj[String(header || `列${idx + 1}`).trim()] = row[idx];
          });
          return rowObj;
        });
        
        summary.sourceInfo.sampleNote = `全${rawRows.length}行のうち、先頭${Math.min(20, rawRows.length - 1)}行のデータを表示`;
      }

      // 名称変更の情報
      if (sourceData.originalXColumn || sourceData.originalYColumn) {
        summary.nameMapping = {
          xAxis: {
            original: sourceData.originalXColumn,
            renamed: parsed.xColumn || sourceData.originalXColumn,
          },
          yAxis: {
            original: sourceData.originalYColumn,
            renamed: parsed.yColumn || sourceData.originalYColumn,
          },
          title: sourceData.renamedTitle || parsed.chartTitle,
        };
      }
    }
    
    return summary;
  } catch (e) {
    console.error('Data summarization error:', e);
    return chartData;
  }
}

// プラン別の回数制限を取得する関数
function getDailyLimit(plan) {
  switch(plan) {
    case 'free':
      return 5;  // 無料プラン: 5回/日
    case 'standard':
      return 50; // Standardプラン: 50回/日
    case 'pro':
      return -1; // Proプラン: 無制限
    default:
      return 5;
  }
}

export default async function handler(req, res) {
  // CORS設定（本番では自ドメインのみに制限）
  const allowedOrigins = [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    'http://localhost:5173',
    'http://localhost:4173',
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. 認証トークンの検証
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: '認証が必要です',
        code: 'AUTH_REQUIRED'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        error: '認証に失敗しました。再度ログインしてください',
        code: 'AUTH_INVALID'
      });
    }

    const uid = decodedToken.uid;

    // 2. ユーザープランの確認
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ 
        error: 'ユーザー情報が見つかりません',
        code: 'USER_NOT_FOUND'
      });
    }

    const userData = userDoc.data();
    const userPlan = userData.plan || 'free';

    // 3. プラン別のレート制限チェック
    const today = new Date().toISOString().split('T')[0];
    const usageKey = `aiUsage_${today}`;
    const currentUsage = userData[usageKey] || 0;
    const dailyLimit = getDailyLimit(userPlan);

    // Proプラン（無制限）以外は回数制限をチェック
    if (dailyLimit !== -1 && currentUsage >= dailyLimit) {
      return res.status(429).json({ 
        error: '本日の利用上限に達しました',
        code: 'RATE_LIMIT_EXCEEDED',
        limit: dailyLimit,
        usage: currentUsage,
        currentPlan: userPlan,
        resetTime: '明日の0時（日本時間）にリセットされます'
      });
    }

    // 4. リクエストデータの検証
    const { chartData, sourceData, question } = req.body;
    
    if (!chartData) {
      return res.status(400).json({ 
        error: 'chartDataは必須です',
        code: 'MISSING_CHART_DATA'
      });
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ 
        error: '質問内容を入力してください',
        code: 'MISSING_QUESTION'
      });
    }

    if (question.length > 500) {
      return res.status(400).json({ 
        error: '質問は500文字以内で入力してください',
        code: 'QUESTION_TOO_LONG'
      });
    }

    // 5. APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return res.status(500).json({ 
        error: 'サービスの設定に問題があります。管理者にお問い合わせください',
        code: 'API_KEY_MISSING'
      });
    }

    // 6. データ要約（トークン節約）
    const summarizedData = summarizeChartData(chartData, sourceData);

    // 7. OpenAI API呼び出し
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `あなたは統計データの分析専門家です。提供された**グラフデータと元の表データ全体**を総合的に分析し、わかりやすく説明してください。

【最重要】数値の基準値（スケール）について
- データには「unitInfo」に基準値設定が含まれています
- **グラフの数値は基準値単位で表示されています**（例：「千円」「百万円」など）
- 実際の値は「表示値 × scale」で計算してください
- 例：グラフに「111,212,889」と表示され、基準値が「千円(scale=1000)」の場合
  → 実際の金額は 111,212,889 × 1,000 = 111,212,889,000円（約1,112億円）
- **必ず unitInfo.yAxis.scale の値を確認し、正しい実際の値を計算して言及してください**
- scaleLabel（「千円」「百万円」など）が設定されている場合は、それを明記してください

【重要】元データの活用について
- グラフに使われているデータは、元の表データの一部を抽出したものです
- 元データには、グラフ化されていない他の列や行も含まれています
- **これらの関連データも積極的に参照**し、グラフデータの背景や意味を深く考察してください
- 元データの他の列との相関や、全体の文脈からグラフの意味を解釈してください

【利用可能な情報】
1. **グラフデータ**: ユーザーが選択してグラフ化したデータ（統計値、選択範囲）
2. **単位設定(unitInfo)**: 基準値（スケール）や単位の情報 - **必ず参照**
3. **元の表データ全体**: 
   - 全ての列のヘッダー名
   - データサンプル（複数行）
   - グラフ化されていない他の列のデータも含む
4. **名称変更情報**: ユーザーがカスタマイズした表示名

【分析の観点】
1. **グラフデータの特徴**: 傾向、最大値・最小値、平均値、パターン
2. **元データとの関連性**: 
   - グラフ化された列と他の列との関係
   - 選択範囲外のデータから読み取れる全体像
   - グラフに表れていないが重要な背景情報
3. **考えられる背景・要因**: 元データ全体から推測できる理由や文脈
4. **注目ポイント**: 発見、気づき、提案

【回答の作成方法】
- **まず unitInfo.yAxis を確認**し、scale値で実際の数値を計算してください
- 金額などを言及する際は、必ず実際の値（表示値×scale）を使用してください
- 基準値が設定されている場合は「〜千円」「〜百万円」のように明記してください
- ユーザーが変更した名称を使用
- **元データの他の列も参照して分析**（グラフだけでなく表全体を見る）
- 専門用語を避け、わかりやすく
- 3〜5段落（400〜600文字）
- 推測は「〜と考えられます」等の表現
- データに基づく客観的な分析`
          },
          {
            role: 'user',
            content: `以下のデータについて、グラフと元の表データの両方を参照して総合的に分析してください：

【データ】
${JSON.stringify(summarizedData, null, 2)}

【ユーザーの質問】
${question.trim()}

**最重要**: 
1. 必ず「unitInfo.yAxis」を確認し、scale値（基準値）で実際の数値を計算してください
2. 例：表示値が111,212,889でscaleが1000（千円）の場合、実際は111,212,889,000円です
3. 金額を言及する際は「111,212,889千円（約1,112億円）」のように正確に表記してください
4. 上記データには「sourceInfo」に元の表データ全体の情報が含まれています
5. グラフに使われたデータだけでなく、元データの他の列も参照して分析してください`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      if (error.status === 429) {
        return res.status(429).json({ 
          error: 'APIの利用上限に達しました。しばらく待ってから再試行してください',
          code: 'OPENAI_RATE_LIMIT'
        });
      }
      
      if (error.status === 401) {
        return res.status(500).json({ 
          error: 'APIキーの設定に問題があります。管理者にお問い合わせください',
          code: 'OPENAI_AUTH_ERROR'
        });
      }
      
      return res.status(500).json({ 
        error: 'AI分析サービスでエラーが発生しました',
        code: 'OPENAI_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    // 8. 使用回数を更新
    try {
      await db.collection('users').doc(uid).update({
        [usageKey]: currentUsage + 1,
        lastAiUsage: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.error('Usage update error:', error);
      // 使用回数の更新に失敗してもレスポンスは返す
    }

    // 9. 成功レスポンス
    return res.status(200).json({
      success: true,
      answer: completion.choices[0].message.content,
      usage: {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      },
      remainingUsage: dailyLimit === -1 ? -1 : dailyLimit - currentUsage - 1,
      dailyLimit: dailyLimit,
      currentPlan: userPlan
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'サーバーエラーが発生しました',
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
