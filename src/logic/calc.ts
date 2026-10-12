import { Category, Transaction, TxType, CATEGORY_LABEL } from './types';
import { monthKey } from './date';

export interface Totals {
  income: number;
  expense: number;
  /** income - expense */
  net: number;
}

/** 現在の残高 = 初期残高 + 全収入 − 全支出 */
export function calcBalance(initialBalance: number, txs: Transaction[]): number {
  let b = initialBalance;
  for (const t of txs) b += t.type === 'income' ? t.amount : -t.amount;
  return b;
}

export function filterByMonth(txs: Transaction[], key: string): Transaction[] {
  return txs.filter((t) => monthKey(t.date) === key);
}

export function calcTotals(txs: Transaction[]): Totals {
  let income = 0;
  let expense = 0;
  for (const t of txs) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, net: income - expense };
}

export interface CategoryTotal {
  category: Category;
  label: string;
  amount: number;
  /** 0〜100 の整数（合計に対する割合） */
  percent: number;
}

/** カテゴリ別集計（金額の大きい順）。合計は calcTotals の該当 type と一致する */
export function calcCategoryTotals(txs: Transaction[], type: TxType): CategoryTotal[] {
  const map = new Map<Category, number>();
  let sum = 0;
  for (const t of txs) {
    if (t.type !== type) continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    sum += t.amount;
  }
  return [...map.entries()]
    .map(([category, amount]) => ({
      category,
      label: CATEGORY_LABEL[category],
      amount,
      percent: sum === 0 ? 0 : Math.round((amount / sum) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);
}

export interface MonthSummary extends Totals {
  month: string;
  /** その月末時点の残高 */
  endBalance: number;
}

/** 月別集計（新しい月が先）。月末残高も累積で計算する */
export function calcMonthlySummaries(initialBalance: number, txs: Transaction[]): MonthSummary[] {
  const keys = [...new Set(txs.map((t) => monthKey(t.date)))].sort();
  let running = initialBalance;
  const out: MonthSummary[] = [];
  for (const k of keys) {
    const totals = calcTotals(filterByMonth(txs, k));
    running += totals.net;
    out.push({ month: k, ...totals, endBalance: running });
  }
  return out.reverse();
}

/** 日付の新しい順（同日は登録の新しい順 = id 降順） */
export function sortTransactions(txs: Transaction[]): Transaction[] {
  return [...txs].sort((a, b) =>
    a.date === b.date ? (a.id < b.id ? 1 : a.id > b.id ? -1 : 0) : a.date < b.date ? 1 : -1,
  );
}
