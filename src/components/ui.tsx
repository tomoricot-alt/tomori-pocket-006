import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.card, style]}>{children}</View>;
}

export function BigButton({
  label,
  onPress,
  kind = 'primary',
  testID,
}: {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'ghost' | 'danger';
  testID?: string;
}) {
  const bg = kind === 'primary' ? colors.mint : kind === 'danger' ? colors.danger : colors.white;
  const fg = kind === 'ghost' ? colors.mintDark : colors.white;
  return (
    <Pressable
      accessibilityRole="button"
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg, opacity: pressed ? 0.8 : 1 },
        kind === 'ghost' && { borderWidth: 2, borderColor: colors.mint },
      ]}
    >
      <Text style={[s.btnText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
  tint = colors.mint,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  tint?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[s.chip, active && { backgroundColor: tint, borderColor: tint }]}
    >
      <Text style={[s.chipText, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

export function Heading({ children }: { children: React.ReactNode }) {
  return <Text style={s.h}>{children}</Text>;
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 14,
  },
  btn: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  btnText: { fontSize: 17, fontWeight: '700' },
  chip: {
    minHeight: 46,
    paddingHorizontal: 14,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontSize: 15, fontWeight: '600', color: colors.text },
  h: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 12 },
});
