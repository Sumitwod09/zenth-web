// ─── Home / Brain Dump Screen ────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DumpInput } from '@/components/DumpInput';
import { DumpCard } from '@/components/DumpCard';
import { ConvertSheet } from '@/components/ConvertSheet';
import { useDumpStore } from '@/store/dumpStore';
import { useTaskStore } from '@/store/taskStore';
import { colors, spacing, typography } from '@zenth/utils';
import type { Dump } from '@zenth/utils';

export default function HomeScreen() {
  const dumps = useDumpStore((s) => s.dumps);
  const addDump = useDumpStore((s) => s.addDump);
  const removeDump = useDumpStore((s) => s.removeDump);
  const markConverted = useDumpStore((s) => s.markConverted);
  const addTask = useTaskStore((s) => s.addTask);

  const [selectedDump, setSelectedDump] = useState<Dump | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  const handleConvertOpen = (dump: Dump) => {
    setSelectedDump(dump);
    setSheetVisible(true);
  };

  const handleConvert = async (dumpId: string, taskTitles: string[]) => {
    const taskIds: string[] = [];
    for (const title of taskTitles) {
      const task = await addTask(title, dumpId);
      taskIds.push(task.id);
    }
    await markConverted(dumpId, taskIds);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Brain Dump</Text>
        <Text style={styles.subtitle}>Capture what's on your mind</Text>
      </View>

      {/* Input */}
      <DumpInput onSubmit={addDump} />

      {/* Inbox */}
      <FlatList
        data={dumps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DumpCard dump={item} onConvert={handleConvertOpen} onDelete={removeDump} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Your inbox is empty</Text>
            <Text style={styles.emptyHint}>Type a thought above to get started</Text>
          </View>
        }
      />

      {/* Convert Sheet */}
      <ConvertSheet dump={selectedDump} visible={sheetVisible} onClose={() => setSheetVisible(false)} onConvert={handleConvert} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  greeting: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.headingXl, color: colors.textPrimary },
  subtitle: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.body, color: colors.textSecondary, marginTop: 4 },
  list: { paddingTop: spacing.sm, paddingBottom: spacing['5xl'] },
  empty: { alignItems: 'center', paddingTop: spacing['5xl'] },
  emptyText: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.bodyLg, color: colors.textSecondary },
  emptyHint: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.caption, color: colors.textSecondary, marginTop: 4 },
});
