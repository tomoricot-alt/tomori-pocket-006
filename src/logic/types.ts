export type TxType = 'income' | 'expense';

export type IncomeCategory = 'allowance' | 'otoshidama' | 'otherIncome';
export type ExpenseCategory = 'food' | 'stationery' | 'hobby' | 'transport' | 'otherExpense';
export type Category = IncomeCategory | ExpenseCategory;

export interface Transaction {
  id: string;
  type: TxType;
  category: Category;
  /** 日本円の正の整数 */
  amount: number;
  /** YYYY-MM-DD */
  date: string;
  memo: string;
}

export interface AppData {
  version: 1;
  /** 初期残高（円・0以上の整数） */
  initialBalance: number;
  transactions: Transaction[];
}

export const INCOME_CATEGORIES: IncomeCategory[] = ['allowance', 'otoshidama', 'otherIncome'];
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'food',
  'stationery',
  'hobby',
  'transport',
  'otherExpense',
];

export const CATEGORY_LABEL: Record<Category, string> = {
  allowance: 'おこづかい',
  otoshidama: 'お年玉',
  otherIncome: 'その他の収入',
  food: '飲食',
  stationery: '文房具',
  hobby: '趣味・ゲーム',
  transport: '交通費',
  otherExpense: 'その他',
};

export const CATEGORY_ICON: Record<Category, string> = {
  allowance: '👛',
  otoshidama: '🧧',
  otherIncome: '✨',
  food: '🍙',
  stationery: '✏️',
  hobby: '🎮',
  transport: '🚃',
  otherExpense: '📦',
};

export function categoriesFor(type: TxType): Category[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function isCategoryOf(type: TxType, category: string): category is Category {
  return (categoriesFor(type) as string[]).includes(category);
}
