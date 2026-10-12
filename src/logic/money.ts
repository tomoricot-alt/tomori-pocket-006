/** 金額の上限（1回の登録・初期残高）。入力ミス防止のため 1億円未満 */
export const MAX_AMOUNT = 99_999_999;

export type AmountResult = { ok: true; value: number } | { ok: false; error: string };

/** 全角数字を半角にし、カンマ・空白・「円」を取り除く */
export function normalizeAmountInput(raw: string): string {
  return raw
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[,，\s円¥￥]/g, '');
}

/**
 * 金額文字列を検証して整数にする。
 * @param allowZero 初期残高など 0 を許す場合 true
 */
export function parseAmount(raw: string, allowZero = false): AmountResult {
  const s = normalizeAmountInput(raw);
  if (s === '') return { ok: false, error: '金額を入力してね' };
  if (!/^\d+$/.test(s)) return { ok: false, error: '金額は数字だけで入力してね（小数やマイナスは使えないよ）' };
  if (s.length > 9) return { ok: false, error: `金額は${formatYen(MAX_AMOUNT)}までだよ` };
  const value = Number(s);
  if (!Number.isSafeInteger(value)) return { ok: false, error: '金額が大きすぎるよ' };
  if (value > MAX_AMOUNT) return { ok: false, error: `金額は${formatYen(MAX_AMOUNT)}までだよ` };
  if (value === 0 && !allowZero) return { ok: false, error: '1円以上の金額を入力してね' };
  return { ok: true, value };
}

/** 例: 1234 → "1,234円" / -500 → "-500円" */
export function formatYen(n: number): string {
  const sign = n < 0 ? '-' : '';
  return `${sign}${Math.abs(Math.trunc(n)).toLocaleString('en-US')}円`;
}
