import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Category, CATEGORY_ICON, CATEGORY_LABEL, Transaction, TxType, categoriesFor } from '../logic/types';
import { parseAmount } from '../logic/money';
import { normalizeDateInput, todayString } from '../logic/date';
import { TxInput } from '../logic/ops';
import { BigButton, Card, Chip } from '../components/ui';
import { colors } from '../theme';

interface Props {
  editing?: Transaction;
  onSave: (input: TxInput) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

function shiftDay(date: string, delta: number): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, m - 1, d + delta);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${p(dt.getMonth() + 1)}-${p(dt.getDate())}`;
}

export function FormScreen({ editing, onSave, onDelete, onCancel }: Props) {
  const [type, setType] = useState<TxType>(editing?.type ?? 'expense');
  const [category, setCategory] = useState<Category>(editing?.category ?? 'food');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [date, setDate] = useState(editing?.date ?? todayString());
  const [memo, setMemo] = useState(editing?.memo ?? '');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const changeType = (t: TxType) => {
    setType(t);
    setCategory(categoriesFor(t)[0]);
  };

  const submit = () => {
    const a = parseAmount(amount);
    if (!a.ok) return setError(a.error);
    const d = normalizeDateInput(date);
    if (!d) return setError('日付は 2025-04-01 のように入力してね');
    setError('');
    onSave({ type, category, amount: a.value, date: d, memo: memo.trim().slice(0, 40) });
  };

  const tint = type === 'income' ? colors.income : colors.expense;

  return (
    <View>
      <Card>
        <Text style={s.label}>{editing ? '記録を直す' : '新しく記録する'}</Text>
        <View style={s.row}>
          <Chip label="💰 収入" active={type === 'income'} onPress={() => changeType('income')} tint={colors.income} />
          <Chip label="🛍️ 支出" active={type === 'expense'} onPress={() => changeType('expense')} tint={colors.expense} />
        </View>

        <Text style={s.label}>カテゴリ</Text>
        <View style={s.row}>
          {categoriesFor(type).map((c) => (
            <Chip key={c} label={`${CATEGORY_ICON[c]} ${CATEGORY_LABEL[c]}`} active={category === c} onPress={() => setCategory(c)} tint={tint} />
          ))}
        </View>

        <Text style={s.label}>金額（円）</Text>
        <TextInput
          style={s.input}
          value={amount}
          onChangeText={(t) => { setAmount(t); setError(''); }}
          keyboardType="number-pad"
          inputMode="numeric"
          placeholder="例：500"
          maxLength={14}
          accessibilityLabel="金額"
          testID="amount-input"
        />

        <Text style={s.label}>日付</Text>
        <TextInput
          style={s.input}
          value={date}
          onChangeText={(t) => { setDate(t); setError(''); }}
          placeholder="2025-04-01"
          accessibilityLabel="日付"
          testID="date-input"
        />
        <View style={s.row}>
          <Chip label="◀ 前の日" active={false} onPress={() => setDate(shiftDay(normalizeDateInput(date) ?? todayString(), -1))} />
          <Chip label="今日" active={false} onPress={() => setDate(todayString())} />
          <Chip label="次の日 ▶" active={false} onPress={() => setDate(shiftDay(normalizeDateInput(date) ?? todayString(), 1))} />
        </View>

        <Text style={s.label}>メモ（なくてもOK）</Text>
        <TextInput
          style={s.input}
          value={memo}
          onChangeText={setMemo}
          placeholder="例：友だちとジュース"
          maxLength={40}
          accessibilityLabel="メモ"
        />

        {!!error && <Text style={s.error} testID="form-error">{error}</Text>}
        <BigButton label={editing ? '変更を保存する' : '記録する'} onPress={submit} testID="save-btn" />
        <View style={{ height: 8 }} />
        <BigButton label="やめる" kind="ghost" onPress={onCancel} />
      </Card>

      {editing && onDelete && (
        <Card>
          {confirmDelete ? (
            <View>
              <Text style={s.confirm}>この記録を削除します。もとに戻せないけど、いいかな？</Text>
              <BigButton label="削除する" kind="danger" onPress={onDelete} testID="confirm-delete" />
              <View style={{ height: 8 }} />
              <BigButton label="やめておく" kind="ghost" onPress={() => setConfirmDelete(false)} />
            </View>
          ) : (
            <BigButton label="🗑 この記録を削除" kind="ghost" onPress={() => setConfirmDelete(true)} testID="delete-btn" />
          )}
        </Card>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 6, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  input: { borderWidth: 2, borderColor: colors.line, borderRadius: 14, padding: 12, fontSize: 18, minHeight: 52, marginBottom: 8, backgroundColor: colors.ivory },
  error: { color: colors.danger, marginVertical: 8, fontWeight: '700', lineHeight: 20 },
  confirm: { fontSize: 15, color: colors.text, marginBottom: 12, lineHeight: 22 },
});
