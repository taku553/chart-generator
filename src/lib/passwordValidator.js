/**
 * パスワードバリデーション
 * 英数字と記号を含む12文字以上のパスワードを必須とする
 */

/**
 * パスワードの強度を検証する
 * @param {string} password - 検証するパスワード
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = []

  // 12文字以上
  if (password.length < 12) {
    errors.push('12文字以上')
  }

  // 大文字を含む
  if (!/[A-Z]/.test(password)) {
    errors.push('大文字を1文字以上')
  }

  // 小文字を含む
  if (!/[a-z]/.test(password)) {
    errors.push('小文字を1文字以上')
  }

  // 数字を含む
  if (!/[0-9]/.test(password)) {
    errors.push('数字を1文字以上')
  }

  // 記号を含む
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(password)) {
    errors.push('記号を1文字以上(!@#$など)')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * パスワードの要件を取得する
 * @returns {string[]} パスワード要件のリスト
 */
export const getPasswordRequirements = () => {
  return [
    '12文字以上',
    '大文字を1文字以上含む',
    '小文字を1文字以上含む',
    '数字を1文字以上含む',
    '記号を1文字以上含む(!@#$%^&*など)',
  ]
}

/**
 * パスワードの強度を判定する
 * @param {string} password - 判定するパスワード
 * @returns {Object} { strength: 'weak'|'medium'|'strong', score: number }
 */
export const getPasswordStrength = (password) => {
  let score = 0

  if (password.length >= 12) score += 20
  if (password.length >= 16) score += 10
  if (password.length >= 20) score += 10

  if (/[A-Z]/.test(password)) score += 15
  if (/[a-z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 15
  if (/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/'`~;]/.test(password)) score += 15

  // 連続した文字のチェック（減点）
  if (/(.)\1{2,}/.test(password)) score -= 10

  // 強度の判定
  let strength = 'weak'
  if (score >= 80) {
    strength = 'strong'
  } else if (score >= 60) {
    strength = 'medium'
  }

  return { strength, score: Math.max(0, Math.min(100, score)) }
}
