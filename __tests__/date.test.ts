import { formatDateLabel, formatMonthLabel, isValidDateString, monthKey, normalizeDateInput, shiftMonth, toDateString } from '../src/logic/date';

describe('日付処理', () => {
  test('実在チェック', () => {
    expect(isValidDateString('2024-02-29')).toBe(true);
    expect(isValidDateString('2025-02-29')).toBe(false);
    expect(isValidDateString('2025-13-01')).toBe(false);
    expect(isValidDateString('2025-4-1')).toBe(false);
    expect(isValidDateString('abcd-ef-gh')).toBe(false);
  });
  test('入力の正規化', () => {
    expect(normalizeDateInput('2025/4/1')).toBe('2025-04-01');
    expect(normalizeDateInput('２０２５-０４-０１')).toBe('2025-04-01');
    expect(normalizeDateInput('2025-02-30')).toBeNull();
    expect(normalizeDateInput('')).toBeNull();
  });
  test('ローカル日付文字列（UTCずれなし）', () => {
    expect(toDateString(new Date(2025, 0, 1, 0, 30))).toBe('2025-01-01');
    expect(toDateString(new Date(2025, 11, 31, 23, 59))).toBe('2025-12-31');
  });
  test('月キーと月移動（年またぎ）', () => {
    expect(monthKey('2025-03-15')).toBe('2025-03');
    expect(shiftMonth('2025-01', -1)).toBe('2024-12');
    expect(shiftMonth('2025-12', 1)).toBe('2026-01');
    expect(shiftMonth('2025-03', 0)).toBe('2025-03');
  });
  test('表示用ラベル', () => {
    expect(formatMonthLabel('2025-03')).toBe('2025年3月');
    expect(formatDateLabel('2025-04-01')).toBe('4月1日(火)');
  });
});
