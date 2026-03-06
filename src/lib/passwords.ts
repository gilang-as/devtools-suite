/**
 * Utility for password generation, strength checking, and comparison.
 */

export interface PasswordOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
  avoidSimilar: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  const { length, upper, lower, number, special, avoidSimilar } = options;
  
  let charset = '';
  if (lower) charset += avoidSimilar ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
  if (upper) charset += avoidSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (number) charset += avoidSimilar ? '23456789' : '0123456789';
  if (special) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  if (!charset) return '';

  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += charset.charAt(array[i] % charset.length);
  }

  return password;
}

export interface StrengthResult {
  score: number; // 0-4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  feedback: string[];
  entropy: number;
}

export function checkPasswordStrength(password: string): StrengthResult {
  let score = 0;
  const feedback: string[] = [];

  if (!password) {
    return { score: 0, label: 'Very Weak', feedback: [], entropy: 0 };
  }

  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  else feedback.push('strength_feedback.length');

  // Variety checks
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let varietyCount = 0;
  if (hasLower) varietyCount++;
  if (hasUpper) varietyCount++;
  if (hasNumber) varietyCount++;
  if (hasSpecial) varietyCount++;

  if (varietyCount >= 3) score++;
  if (varietyCount >= 4 && password.length >= 10) score++;

  if (!hasUpper) feedback.push('strength_feedback.upper');
  if (!hasNumber) feedback.push('strength_feedback.number');
  if (!hasSpecial) feedback.push('strength_feedback.special');

  // Entropy calculation (Bits of entropy)
  // E = log2(R^L) where R is pool size, L is length
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 32;
  
  const entropy = poolSize > 0 ? Math.floor(password.length * Math.log2(poolSize)) : 0;

  const labels: StrengthResult['label'][] = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  
  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)],
    feedback,
    entropy
  };
}
