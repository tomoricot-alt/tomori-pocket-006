import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppData } from '../logic/types';
import { calcCategoryTotals, calcMonthlySummaries, calcTotals, filterByMonth } from '../logic/calc';
import { currentMonthKey, formatMonthLabel } from '../logic/date';
import { formatYen } from '../logic/money';
import { Card, Heading } from '../components/ui';
import { MonthPicker } from '../components/MonthPicker';
import { colors } from '../theme';

function Bar({ ratio, color }: { ratio: number; color: string }) {
  return (
    <View style={s.track}>
      <View style={{ width: `${Math.max(0, Math.min(100, ratio * 100))}%`, height: '100%', backgroundColor: color, borderRadius: 7 }} />
    </View>
  );
}

export function StatsScreen({ data }: { data: AppData }) {
  const [month, setMonth] = useState(currentMonthKey());
  const monthTxs = filterByMonth(data.transactions, month);
  const totals = calcTotals(monthTxs);
  const cats = calcCategoryTotals(monthTxs, 'expense');
  const months = calcMonthlySummaries(data.initialBalance, data.transactions);
  const maxMonth = Math.max(1, ...months.map((m) => Math.max(m.income, m.expense)));

  return (
    <View>
      <MonthPicker month={month} onChange={setMonth} />
      <Card>
        <Text style={s.line}>収入　<Text style={{ color: colors.income, fontWeight: '900' }}>{formatYen(totals.income)}</Text></Text>
        <Text style={s.line}>支出　<Text style={{ color: colors.expense, fontWeight: '900' }}>{formatYen(totals.expense)}</Text></Text>
        <Text style={s.line}>差し引き　<Text style={{ fontWeight: '900' }}>{formatYen(totals.net)}</Text></Text>
      </Card>

      <Card>
        <Heading>カテゴリ別の支出</Heading>
        {cats.length === 0 ? (
          <Text style={s.empty}>この月の支出はまだないよ。</Text>
        ) : (
          cats.map((c) => (
            <View key={c.category} style={{ marginBottom: 12 }}>
              <View style={s.between}>
                <Text style={s.name}>{c.label}</Text>
                <Text style={s.name}>{formatYen(c.amount)}（{c.percent}%）</Text>
              </View>
              <Bar ratio={totals.expense ? c.amount / totals.expense : 0} color={colors.mint} />
            </View>
          ))
        )}
      </Card>

      <Card>
        <Heading>月ごとの収支</Heading>
        {months.length === 0 ? (
          <Text style={s.empty}>記録がたまるとここに表示されるよ。</Text>
        ) : (
          months.map((m) => (
            <View key={m.month} style={{ marginBottom: 14 }}>
              <Text style={s.name}>{formatMonthLabel(m.month)}　月末の残高 {formatYen(m.endBalance)}</Text>
              <Text style={s.small}>収入 {formatYen(m.income)}</Text>
              <Bar ratio={m.income / maxMonth} color={colors.income} />
              <Text style={s.small}>支出 {formatYen(m.expense)}</Text>
              <Bar ratio={m.expense / maxMonth} color={colors.expense} />
            </View>
          ))
        )}
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  line: { fontSize: 16, color: colors.text, marginBottom: 6 },
  between: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap' },
  name: { fontSize: 15, fontWeight: '700', color: colors.text },
  small: { fontSize: 12, color: colors.sub, marginTop: 4, marginBottom: 2 },
  track: { height: 14, borderRadius: 7, backgroundColor: colors.ivory, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  empty: { color: colors.sub },
});
