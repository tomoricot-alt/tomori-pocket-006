import { AppData, Transaction } from './types';

export type TxInput = Omit<Transaction, 'id'>;

export function addTransaction(data: AppData, input: TxInput, id: string): AppData {
  return { ...data, transactions: [...data.transactions, { ...input, id }] };
}

export function updateTransaction(data: AppData, id: string, input: TxInput): AppData {
  return {
    ...data,
    transactions: data.transactions.map((t) => (t.id === id ? { ...input, id } : t)),
  };
}

export function deleteTransaction(data: AppData, id: string): AppData {
  return { ...data, transactions: data.transactions.filter((t) => t.id !== id) };
}
