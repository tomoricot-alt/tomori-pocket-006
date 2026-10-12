import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppData } from '../logic/types';
import { calcBalance, calcTotals, filterByMonth, sortTransactions } from '../logic/calc';
import { currentMonthKey, formatMonthLabel } from '../logic/date';
import { formatYen, parseAmount } from '../logic/money';
import { BigButton, Card, Heading } from '../components/ui';
import { TxRow } from '../components/TxRow';
import { colors } from '../theme';

interface Props {
  data: AppData;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onSetInitial: (n: number) => void;
}

export function HomeScreen({ data, onAdd, onEdit, onSetInitial }: Props) {
  const month = currentMonthKey();
  const monthTxs = filterByMonth(data.transactions, month);
  const totals = calcTotals(monthTxs);
  const balance = calcBalance(data.initialBalance, data.transactions);
  const recent = sortTransactions(data.transactions).slice(0, 5);
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const saveInitial = () => {
    const r = parseAmount(text, true);
    if (!r.ok) return setError(r.error);
    onSetInitial(r.value);
    setEditing(false);
    setError('');
  };

  return (
    <View>
      <Card style={{ backgroundColor: colors.mint, borderColor: colors.mint }}>
        <Text style={s.balLabel}>いまの残高</Text>
        <Text style={s.balance} testID="balance">{formatYen(balance)}</Text>
      </Card>

      <Card>
        <Text style={s.monthTitle}>{formatMonthLabel(month)}のようす</Text>
        <View style={s.two}>
          <View style={[s.box, { backgroundColor: colors.mintLight }]}>
            <Text style={s.boxLabel}>収入</Text>
            <Text style={[s.boxValue, { color: colors.income }]} testID="month-income">{formatYen(totals.income)}</Text>
          </View>
          <View style={[s.box, { backgroundColor: colors.expenseLight }]}>
            <Text style={s.boxLabel}>支出</Text>
            <Text style={[s.boxValue, { color: colors.expense }]} testID="month-expense">{formatYen(totals.expense)}</Text>
          </View>
        </View>
      </Card>

      <BigButton label="＋ 収入・支出を記録する" onPress={onAdd} testID="home-add" />
      <View style={{ height: 14 }} />

      <Card>
        <Heading>最近の記録</Heading>
        {recent.length === 0 ? (
          <Text style={s.empty}>まだ記録がないよ。さいしょの1件を登録してみよう！</Text>
        ) : (
          recent.map((t) => <TxRow key={t.id} tx={t} onPress={() => onEdit(t.id)} />)
        )}
      </Card>

      <Card>
        <Heading>はじめの残高</Heading>
        <Text style={s.note}>アプリを使いはじめる時点で持っていた金額です。いまは {formatYen(data.initialBalance)}。</Text>
        {editing ? (
          <View>
            <TextInput
              style={s.input}
              value={text}
              onChangeText={setText}
              keyboardType="number-pad"
              inputMode="numeric"
              placeholder="例：3000"
              accessibilityLabel="はじめの残高"
            />
            {!!error && <Text style={s.error}>{error}</Text>}
            <BigButton label="保存する" onPress={saveInitial} />
            <View style={{ height: 8 }} />
            <BigButton label="やめる" kind="ghost" onPress={() => { setEditing(false); setError(''); }} />
          </View>
        ) : (
          <BigButton label="はじめの残高を変更" kind="ghost" onPress={() => { setText(String(data.initialBalance)); setEditing(true); }} />
        )}
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  balLabel: { color: colors.white, fontSize: 15, fontWeight: '700' },
  balance: { color: colors.white, fontSize: 40, fontWeight: '900', marginTop: 4 },
  monthTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 10 },
  two: { flexDirection: 'row', gap: 10 },
  box: { flex: 1, borderRadius: 14, padding: 12 },
  boxLabel: { fontSize: 13, color: colors.sub, fontWeight: '700' },
  boxValue: { fontSize: 20, fontWeight: '900', marginTop: 4 },
  empty: { color: colors.sub, fontSize: 15, lineHeight: 22 },
  note: { color: colors.sub, fontSize: 14, marginBottom: 10, lineHeight: 20 },
  input: { borderWidth: 2, borderColor: colors.line, borderRadius: 14, padding: 12, fontSize: 18, minHeight: 52, marginBottom: 8, backgroundColor: colors.ivory },
  error: { color: colors.danger, marginBottom: 8, fontWeight: '600' },
});
