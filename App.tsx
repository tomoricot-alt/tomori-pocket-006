import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAppData } from './src/useAppData';
import { addTransaction, deleteTransaction, updateTransaction } from './src/logic/ops';
import { newId } from './src/logic/validate';
import { HomeScreen } from './src/screens/HomeScreen';
import { FormScreen } from './src/screens/FormScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { colors, MAX_WIDTH } from './src/theme';

type Tab = 'home' | 'add' | 'history' | 'stats';
const TABS: { key: Tab; icon: string; label: string }[] = [
  { key: 'home', icon: '🏠', label: 'ホーム' },
  { key: 'add', icon: '✏️', label: '記録' },
  { key: 'history', icon: '📒', label: '履歴' },
  { key: 'stats', icon: '📊', label: '集計' },
];

export default function App() {
  const { data, loaded, saveError, update } = useAppData();
  const [tab, setTab] = useState<Tab>('home');
  const [editId, setEditId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const editing = editId ? data.transactions.find((t) => t.id === editId) : undefined;

  const goTab = (t: Tab) => {
    setEditId(null);
    setFormKey((k) => k + 1);
    setTab(t);
  };
  const startEdit = (id: string) => {
    setEditId(id);
    setFormKey((k) => k + 1);
    setTab('add');
  };

  return (
    <View style={s.root}>
      <StatusBar style="dark" />
      <View style={s.header}>
        <Text style={s.title}>👛 TOMORI POCKET</Text>
      </View>
      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        <View style={s.col}>
          {!loaded ? (
            <Text style={s.loading}>読み込み中…</Text>
          ) : (
            <>
              {saveError && <Text style={s.warn}>⚠️ 保存できませんでした。ブラウザの設定（プライベートモードなど）を確認してね。</Text>}
              {tab === 'home' && (
                <HomeScreen
                  data={data}
                  onAdd={() => goTab('add')}
                  onEdit={startEdit}
                  onSetInitial={(n) => update((d) => ({ ...d, initialBalance: n }))}
                />
              )}
              {tab === 'add' && (
                <FormScreen
                  key={formKey}
                  editing={editing}
                  onCancel={() => goTab(editing ? 'history' : 'home')}
                  onSave={(input) => {
                    update((d) => (editing ? updateTransaction(d, editing.id, input) : addTransaction(d, input, newId())));
                    goTab('history');
                  }}
                  onDelete={editing ? () => { update((d) => deleteTransaction(d, editing.id)); goTab('history'); } : undefined}
                />
              )}
              {tab === 'history' && <HistoryScreen data={data} onEdit={startEdit} />}
              {tab === 'stats' && <StatsScreen data={data} />}
              <Text style={s.notice}>
                記録はこの端末のブラウザの中だけに保存され、外には送信されません。ブラウザのデータ（サイトデータ・履歴）を削除すると、記録が消えることがあります。
              </Text>
            </>
          )}
        </View>
      </ScrollView>
      <View style={s.tabbar}>
        <View style={s.tabInner}>
          {TABS.map((t) => (
            <Pressable key={t.key} accessibilityRole="tab" accessibilityLabel={t.label} onPress={() => goTab(t.key)} style={[s.tab, tab === t.key && s.tabActive]} testID={`tab-${t.key}`}>
              <Text style={s.tabIcon}>{t.icon}</Text>
              <Text style={[s.tabLabel, tab === t.key && { color: colors.mintDark }]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ivory },
  header: { backgroundColor: colors.white, paddingTop: 14, paddingBottom: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.line },
  title: { fontSize: 20, fontWeight: '900', color: colors.mintDark },
  body: { padding: 16, alignItems: 'center' },
  col: { width: '100%', maxWidth: MAX_WIDTH },
  loading: { textAlign: 'center', color: colors.sub, marginTop: 40 },
  warn: { backgroundColor: colors.expenseLight, color: colors.danger, padding: 10, borderRadius: 12, marginBottom: 12, fontWeight: '700' },
  notice: { color: colors.sub, fontSize: 12, lineHeight: 18, marginTop: 4, marginBottom: 20 },
  tabbar: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, alignItems: 'center' },
  tabInner: { flexDirection: 'row', width: '100%', maxWidth: MAX_WIDTH },
  tab: { flex: 1, minHeight: 64, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: colors.mintLight },
  tabIcon: { fontSize: 22 },
  tabLabel: { fontSize: 12, fontWeight: '700', color: colors.sub, marginTop: 2 },
});
