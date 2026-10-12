import { useCallback, useEffect, useRef, useState } from 'react';
import { AppData } from './logic/types';
import { EMPTY_DATA } from './logic/validate';
import { loadData, saveData } from './storage';

/** 起動時に読み込み、変更のたびに端末内へ自動保存する */
export function useAppData() {
  const [data, setData] = useState<AppData>({ ...EMPTY_DATA, transactions: [] });
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const latest = useRef(data);

  useEffect(() => {
    loadData().then((d) => {
      latest.current = d;
      setData(d);
      setLoaded(true);
    });
  }, []);

  const update = useCallback((fn: (d: AppData) => AppData) => {
    const next = fn(latest.current);
    latest.current = next;
    setData(next);
    saveData(next).then(
      () => setSaveError(false),
      () => setSaveError(true),
    );
  }, []);

  return { data, loaded, saveError, update };
}
