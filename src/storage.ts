import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData } from './logic/types';
import { EMPTY_DATA, sanitizeData } from './logic/validate';

/** GitHub Pages では同じドメインを他アプリと共有するため、固有のキーを使う */
export const STORAGE_KEY = 'tomori-pocket-006:data:v1';

export async function loadData(): Promise<AppData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_DATA, transactions: [] };
    return sanitizeData(JSON.parse(raw));
  } catch {
    return { ...EMPTY_DATA, transactions: [] };
  }
}

export async function saveData(data: AppData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
