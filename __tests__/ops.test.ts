import { addTransaction, deleteTransaction, updateTransaction } from '../src/logic/ops';
import { sanitizeData, EMPTY_DATA, newId } from '../src/logic/validate';
import { calcBalance } from '../src/logic/calc';
import { AppData } from '../src/logic/types';

const base: AppData = { ...EMPTY_DATA, initialBalance: 1000, transactions: [] };

describe('登録・編集・削除', () => {
  test('収入の登録→編集→削除と残高', () => {
    let d = addTransaction(base, { type: 'income', category: 'allowance', amount: 3000, date: '2025-04-01', memo: '' }, 'a');
    expect(calcBalance(d.initialBalance, d.transactions)).toBe(4000);
    d = updateTransaction(d, 'a', { type: 'income', category: 'otoshidama', amount: 5000, date: '2025-04-02', memo: 'x' });
    expect(d.transactions).toHaveLength(1);
    expect(d.transactions[0]).toMatchObject({ id: 'a', category: 'otoshidama', amount: 5000 });
    expect(calcBalance(d.initialBalance, d.transactions)).toBe(6000);
    d = deleteTransaction(d, 'a');
    expect(d.transactions).toHaveLength(0);
    expect(calcBalance(d.initialBalance, d.transactions)).toBe(1000);
  });
  test('支出の登録→編集（収入から支出へ種別変更）→削除', () => {
    let d = addTransaction(base, { type: 'expense', category: 'food', amount: 300, date: '2025-04-01', memo: '' }, 'b');
    expect(calcBalance(d.initialBalance, d.transactions)).toBe(700);
    d = updateTransaction(d, 'b', { type: 'income', category: 'allowance', amount: 300, date: '2025-04-01', memo: '' });
    expect(calcBalance(d.initialBalance, d.transactions)).toBe(1300);
    d = deleteTransaction(d, 'b');
    expect(calcBalance(d.initialBalance, d.transactions)).toBe(1000);
  });
  test('元のデータは変更されない（イミュータブル）', () => {
    addTransaction(base, { type: 'income', category: 'allowance', amount: 1, date: '2025-04-01', memo: '' }, 'c');
    expect(base.transactions).toHaveLength(0);
  });
  test('IDは重複せず時刻順', () => {
    const ids = Array.from({ length: 200 }, () => newId(1000));
    expect(new Set(ids).size).toBe(200);
    expect(newId(2000) > newId(1000)).toBe(true);
  });
});

describe('保存データの検証（再読み込み）', () => {
  test('JSON往復で同じ内容に戻る', () => {
    const d = addTransaction(base, { type: 'expense', category: 'hobby', amount: 980, date: '2025-04-01', memo: 'ゲーム' }, 'x');
    expect(sanitizeData(JSON.parse(JSON.stringify(d)))).toEqual(d);
  });
  test('壊れた・不正な記録は捨てる', () => {
    const r = sanitizeData({
      initialBalance: -5,
      transactions: [
        { id: '1', type: 'expense', category: 'food', amount: 100, date: '2025-04-01', memo: '' },
        { id: '2', type: 'expense', category: 'allowance', amount: 100, date: '2025-04-01', memo: '' },
        { id: '3', type: 'income', category: 'allowance', amount: -1, date: '2025-04-01', memo: '' },
        { id: '4', type: 'income', category: 'allowance', amount: 1.5, date: '2025-04-01', memo: '' },
        { id: '5', type: 'income', category: 'allowance', amount: 10, date: '2025-02-30', memo: '' },
        null,
        'x',
      ],
    });
    expect(r.initialBalance).toBe(0);
    expect(r.transactions.map((t) => t.id)).toEqual(['1']);
  });
  test('null・不正な型でも空データを返す', () => {
    expect(sanitizeData(null).transactions).toEqual([]);
    expect(sanitizeData({ transactions: 'x' }).transactions).toEqual([]);
  });
});
