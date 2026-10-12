import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { formatMonthLabel, shiftMonth } from '../logic/date';
import { colors } from '../theme';

export function MonthPicker({ month, onChange }: { month: string; onChange: (m: string) => void }) {
  return (
    <View style={s.row}>
      <Pressable accessibilityLabel="前の月" style={s.arrow} onPress={() => onChange(shiftMonth(month, -1))}>
        <Text style={s.arrowText}>◀</Text>
      </Pressable>
      <Text style={s.label}>{formatMonthLabel(month)}</Text>
      <Pressable accessibilityLabel="次の月" style={s.arrow} onPress={() => onChange(shiftMonth(month, 1))}>
        <Text style={s.arrowText}>▶</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  arrow: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.mintLight, alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: colors.mintDark, fontSize: 18 },
  label: { fontSize: 22, fontWeight: '800', color: colors.text },
});
