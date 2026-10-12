import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_ICON, CATEGORY_LABEL, Transaction } from '../logic/types';
import { formatYen } from '../logic/money';
import { formatDateLabel } from '../logic/date';
import { colors } from '../theme';

export function TxRow({ tx, onPress }: { tx: Transaction; onPress: () => void }) {
  const inc = tx.type === 'income';
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={s.row}>
      <Text style={s.icon}>{CATEGORY_ICON[tx.category]}</Text>
      <View style={{ flex: 1 }}>
        <Text style={s.cat}>{CATEGORY_LABEL[tx.category]}</Text>
        <Text style={s.sub} numberOfLines={1}>
          {formatDateLabel(tx.date)}
          {tx.memo ? `　${tx.memo}` : ''}
        </Text>
      </View>
      <Text style={[s.amount, { color: inc ? colors.income : colors.expense }]}>
        {inc ? '+' : '-'}
        {formatYen(tx.amount)}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, minHeight: 60, borderBottomWidth: 1, borderBottomColor: colors.line },
  icon: { fontSize: 28, width: 44 },
  cat: { fontSize: 16, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.sub, marginTop: 2 },
  amount: { fontSize: 17, fontWeight: '800', marginLeft: 8 },
});
