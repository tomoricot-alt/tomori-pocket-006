import { AppData, Transaction, isCategoryOf } from './types';
import { MAX_AMOUNT } from './money';
import { isValidDateString } from './date';

export const EMPTY_DATA: AppData = { version: 1, initialBalance: 0, transactions: [] };

function isValidTransaction(t: unknown): t is Transaction {
  if (typeof t !== 'object' || t === null) return false;
  const x = t as Record<string, unknown>;
  return (
    typeof x.id === 'string' &&
    (x.type === 'income' || x.type === 'expense') &&
    typeof x.category === 'string' &&
    isCategoryOf(x.type, x.category) &&
    typeof x.amount === 'number' &&
    Number.isInteger(x.amount) &&
    x.amount > 0 &&
    x.amount <= MAX_AMOUNT &&
    typeof x.date === 'string' &&
    isValidDateString(x.date) &&
    typeof x.memo === 'string'
  );
}

/** 保存データを読み込むときの検証。壊れた記録は捨て、安全な形に直す */
export function sanitizeData(raw: unknown): AppData {
  if (typeof raw !== 'object' || raw === null) return { ...EMPTY_DATA, transactions: [] };
  const r = raw as Record<string, unknown>;
  const ib = r.initialBalance;
  const initialBalance =
    typeof ib === 'number' && Number.isInteger(ib) && ib >= 0 && ib <= MAX_AMOUNT ? ib : 0;
  const transactions = Array.isArray(r.transactions) ? r.transactions.filter(isValidTransaction) : [];
  return { version: 1, initialBalance, transactions };
}

let counter = 0;
/** 時刻順に並べられるID（同一ミリ秒でも重複しない） */
export function newId(now: number = Date.now()): string {
  counter = (counter + 1) % 1_000_000;
  return `${String(now).padStart(14, '0')}-${String(counter).padStart(6, '0')}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}
