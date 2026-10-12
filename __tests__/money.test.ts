import { MAX_AMOUNT, formatYen, parseAmount } from '../src/logic/money';

describe('金額の入力検証', () => {
  test('正常な整数', () => expect(parseAmount('500')).toEqual({ ok: true, value: 500 }));
  test('全角・カンマ・円記号を許容', () => {
    expect(parseAmount('１，２３４')).toEqual({ ok: true, value: 1234 });
    expect(parseAmount('¥1,000円')).toEqual({ ok: true, value: 1000 });
  });
  test.each(['', '   ', '0', '-100', '12.5', '1e3', 'abc', '１２a', '+5', '0x10'])('不正値を拒否: %j', (s) => {
    expect(parseAmount(s).ok).toBe(false);
  });
  test('0は初期残高のみ許可', () => {
    expect(parseAmount('0', true)).toEqual({ ok: true, value: 0 });
    expect(parseAmount('0').ok).toBe(false);
  });
  test('上限', () => {
    expect(parseAmount(String(MAX_AMOUNT)).ok).toBe(true);
    expect(parseAmount(String(MAX_AMOUNT + 1)).ok).toBe(false);
    expect(parseAmount('99999999999999999999').ok).toBe(false);
  });
  test('円表示', () => {
    expect(formatYen(1234567)).toBe('1,234,567円');
    expect(formatYen(0)).toBe('0円');
    expect(formatYen(-500)).toBe('-500円');
  });
});
