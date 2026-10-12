/** YYYY-MM-DD 形式（ローカル日付）。タイムゾーンずれを避けるため Date の ISO 変換は使わない */
const pad = (n: number) => String(n).padStart(2, '0');

export function toDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayString(now: Date = new Date()): string {
  return toDateString(now);
}

/** 実在する日付か（2/30 などを弾く） */
export function isValidDateString(s: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return false;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (y < 1990 || y > 2100) return false;
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
}

/** 全角数字・スラッシュ区切りも受け付けて YYYY-MM-DD にそろえる。不正なら null */
export function normalizeDateInput(raw: string): string | null {
  const s = raw
    .trim()
    .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/[/.]/g, '-');
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (!m) return null;
  const out = `${m[1]}-${pad(Number(m[2]))}-${pad(Number(m[3]))}`;
  return isValidDateString(out) ? out : null;
}

/** "2025-03-15" → "2025-03" */
export function monthKey(date: string): string {
  return date.slice(0, 7);
}

export function currentMonthKey(now: Date = new Date()): string {
  return monthKey(toDateString(now));
}

/** 月キーを n か月ずらす */
export function shiftMonth(key: string, delta: number): string {
  const [y, m] = key.split('-').map(Number);
  const idx = y * 12 + (m - 1) + delta;
  return `${Math.floor(idx / 12)}-${pad((idx % 12) + 1)}`;
}

export function formatMonthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return `${y}年${m}月`;
}

export function formatDateLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const w = ['日', '月', '火', '水', '木', '金', '土'][new Date(y, m - 1, d).getDay()];
  return `${m}月${d}日(${w})`;
}
