import { calcBalance, calcCategoryTotals, calcMonthlySummaries, calcTotals, filterByMonth, sortTransactions } from '../src/logic/calc';
import { Transaction } from '../src/logic/types';

let n = 0;
const tx = (type: 'income' | 'expense', category: any, amount: number, date: string): Transaction => ({
  id: `id${String(++n).padStart(3, '0')}`, type, category, amount, date, memo: '',
});

const data: Transaction[] = [
  tx('income', 'allowance', 3000, '2025-03-01'),
  tx('expense', 'food', 500, '2025-03-05'),
  tx('expense', 'hobby', 1200, '2025-03-31'),
  tx('income', 'otoshidama', 10000, '2025-01-02'),
  tx('expense', 'food', 300, '2025-04-01'),
  tx('expense', 'transport', 200, '2025-04-01'),
];

describe('残高計算', () => {
  test('初期残高＋収入−支出', () => {
    expect(calcBalance(1000, data)).toBe(1000 + 13000 - 2200);
  });
  test('記録なしは初期残高', () => expect(calcBalance(500, [])).toBe(500));
  test('支出が多いと残高はマイナスになりうる', () => {
    expect(calcBalance(0, [tx('expense', 'food', 100, '2025-01-01')])).toBe(-100);
  });
});

describe('月別集計', () => {
  test('月ごとに絞り込み（月末・月初の境界）', () => {
    expect(filterByMonth(data, '2025-03')).toHaveLength(3);
    expect(filterByMonth(data, '2025-04')).toHaveLength(2);
  });
  test('今月の収入・支出', () => {
    expect(calcTotals(filterByMonth(data, '2025-03'))).toEqual({ income: 3000, expense: 1700, net: 1300 });
  });
  test('月別サマリーは新しい月が先、月末残高が累積される', () => {
    const s = calcMonthlySummaries(1000, data);
    expect(s.map((m) => m.month)).toEqual(['2025-04', '2025-03', '2025-01']);
    expect(s.map((m) => m.endBalance)).toEqual([1000 + 13000 - 2200, 1000 + 13000 - 1700, 1000 + 10000]);
  });
  test('整合性：月別の合計の総和 = 全体の合計、最新月末残高 = 現在残高', () => {
    const s = calcMonthlySummaries(700, data);
    const all = calcTotals(data);
    expect(s.reduce((a, m) => a + m.income, 0)).toBe(all.income);
    expect(s.reduce((a, m) => a + m.expense, 0)).toBe(all.expense);
    expect(s[0].endBalance).toBe(calcBalance(700, data));
  });
});

describe('カテゴリ別集計', () => {
  test('同カテゴリを合算し、金額の大きい順', () => {
    const c = calcCategoryTotals(filterByMonth(data, '2025-03'), 'expense');
    expect(c.map((x) => [x.category, x.amount])).toEqual([['hobby', 1200], ['food', 500]]);
  });
  test('整合性：カテゴリ合計 = その月の支出合計', () => {
    for (const m of ['2025-01', '2025-03', '2025-04']) {
      const txs = filterByMonth(data, m);
      const sum = calcCategoryTotals(txs, 'expense').reduce((a, x) => a + x.amount, 0);
      expect(sum).toBe(calcTotals(txs).expense);
    }
  });
  test('収入側のカテゴリ集計、割合', () => {
    const c = calcCategoryTotals(data, 'income');
    expect(c[0]).toMatchObject({ category: 'otoshidama', percent: 77 });
  });
  test('支出なしなら空', () => expect(calcCategoryTotals([], 'expense')).toEqual([]));
});

test('履歴の並び：日付の新しい順、同日は登録の新しい順', () => {
  const s = sortTransactions(data);
  expect(s[0].date).toBe('2025-04-01');
  expect(s[0].category).toBe('transport');
  expect(s[s.length - 1].date).toBe('2025-01-02');
});
