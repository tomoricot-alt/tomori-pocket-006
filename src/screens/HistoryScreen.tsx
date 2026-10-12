import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppData, TxType } from '../logic/types';
import { calcTotals, filterByMonth, sortTransactions } from '../logic/calc';
import { currentMonthKey } from '../logic/date';
import { formatYen } from '../logic/money';
import { Card, Chip } from '../components/ui';
import { MonthPicker } from '../components/MonthPicker';
import { TxRow } from '../components/TxRow';
import { colors } from '../theme';

export function HistoryScreen({ data, onEdit }: { data: AppData; onEdit: (id: string) => void }) {
  const [month, setMonth] = useState(currentMonthKey());
  const [filter, setFilter] = useState<'all' | TxType>('all');
  const monthTxs = filterByMonth(data.transactions, month);
  const totals = calcTotals(monthTxs);
  const list = sortTransactions(monthTxs).filter((t) => filter === 'all' || t.type === filter);

  return (
    <View>
      <MonthPicker month={month} onChange={setMonth} />
      <View style={s.row}>
        <Chip label="すべて" active={filter === 'all'} onPress={() => setFilter('all')} />
        <Chip label="収入" active={filter === 'income'} onPress={() => setFilter('income')} tint={colors.income} />
        <Chip label="支出" active={filter === 'expense'} onPress={() => setFilter('expense')} tint={colors.expense} />
      </View>
      <Card>
        <Text style={s.sum}>
          収入 {formatYen(totals.income)}　支出 {formatYen(totals.expense)}
        </Text>
        {list.length === 0 ? (
          <Text style={s.empty}>この月の記録はないよ。</Text>
        ) : (
          list.map((t) => <TxRow key={t.id} tx={t} onPress={() => onEdit(t.id)} />)
        )}
        <Text style={s.hint}>記録をタップすると、直したり削除したりできるよ。</Text>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  sum: { fontSize: 14, fontWeight: '700', color: colors.sub, marginBottom: 6 },
  empty: { color: colors.sub, paddingVertical: 16 },
  hint: { color: colors.sub, fontSize: 12, marginTop: 10 },
});
