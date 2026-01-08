// 開発者判定ユーティリティ

/**
 * 開発者のメールアドレスリスト
 * 本番環境では環境変数で管理することを推奨
 */
export const DEVELOPER_EMAILS = 
  import.meta.env.VITE_DEVELOPER_EMAILS?.split(',').filter(Boolean) || [];

/**
 * 指定されたメールアドレスが開発者かどうかを判定
 * @param {string} email - チェックするメールアドレス
 * @returns {boolean} 開発者の場合true
 */
export const isDeveloper = (email) => {
  if (!email) return false;
  if (DEVELOPER_EMAILS.length === 0) return false;
  return DEVELOPER_EMAILS.includes(email);
};

/**
 * 開発者の場合はproプランを返す
 * @param {string} email - チェックするメールアドレス
 * @returns {string|null} 開発者の場合'pro'、それ以外null
 */
export const getDeveloperPlan = (email) => {
  return isDeveloper(email) ? 'pro' : null;
};

/**
 * 開発者モードが有効かどうか
 * @returns {boolean} 開発者モードが有効な場合true
 */
export const isDeveloperModeEnabled = () => {
  return import.meta.env.VITE_DEVELOPER_MODE === 'true';
};

/**
 * 開発者として機能を使用できるかチェック
 * @param {string} email - チェックするメールアドレス
 * @returns {boolean} 開発者機能が使用可能な場合true
 */
export const canUseDeveloperFeatures = (email) => {
  return isDeveloperModeEnabled() && isDeveloper(email);
};
