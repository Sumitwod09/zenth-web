// ─── Settings Screen ─────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Timer, Trash2 } from '@zenth/ui';
import { Button } from '@zenth/ui';
import { useSettingsStore } from '@/store/settingsStore';
import { deleteAllData } from '@/lib/db';
import { cancelAllReminders } from '@/lib/notifications';
import { useDumpStore } from '@/store/dumpStore';
import { useTaskStore } from '@/store/taskStore';
import { colors, spacing, typography, radii, timer as timerConfig } from '@zenth/utils';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const focusDuration = useSettingsStore((s) => s.focusDuration);
  const setFocusDuration = useSettingsStore((s) => s.setFocusDuration);
  const loadDumps = useDumpStore((s) => s.loadDumps);
  const loadTasks = useTaskStore((s) => s.loadTasks);

  const durations = [10, 15, 20, 25];

  const handleResetData = () => {
    Alert.alert('Reset All Data', 'This will permanently delete all your tasks and brain dumps. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete Everything',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await cancelAllReminders();
          await deleteAllData();
          await loadDumps();
          await loadTasks();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>

        {/* Focus Duration */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Timer size={20} color={colors.accent} strokeWidth={1.8} />
            <Text style={styles.sectionTitle}>Focus Duration</Text>
          </View>
          <Text style={styles.sectionHint}>How long each focus session lasts</Text>
          <View style={styles.durationRow}>
            {durations.map((d) => (
              <TouchableOpacity key={d} style={[styles.durationChip, focusDuration === d && styles.durationChipActive]}
                onPress={() => { Haptics.selectionAsync(); setFocusDuration(d); }}>
                <Text style={[styles.durationText, focusDuration === d && styles.durationTextActive]}>{d}m</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Data Warning */}
        <View style={styles.section}>
          <View style={[styles.warningCard]}>
            <Text style={styles.warningTitle}>Your data is stored locally</Text>
            <Text style={styles.warningText}>All tasks and brain dumps are saved on this device only. If you uninstall the app or lose your device, your data cannot be recovered.</Text>
          </View>
        </View>

        {/* Reset */}
        <View style={styles.section}>
          <Button title="Reset All Data" variant="danger" onPress={handleResetData} fullWidth
            icon={<Trash2 size={18} color={colors.textPrimary} strokeWidth={2} />} />
        </View>

        {/* Version */}
        <Text style={styles.version}>Zenth v0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing['5xl'] },
  title: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.headingXl, color: colors.textPrimary, marginBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  sectionTitle: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.bodyLg, color: colors.textPrimary },
  sectionHint: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.caption, color: colors.textSecondary, marginBottom: spacing.md },
  durationRow: { flexDirection: 'row', gap: spacing.sm },
  durationChip: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.secondary },
  durationChipActive: { borderColor: colors.accent, backgroundColor: colors.accentGlow },
  durationText: { fontFamily: typography.fontFamily.bodyMedium, fontSize: typography.fontSize.bodyLg, color: colors.textSecondary },
  durationTextActive: { color: colors.accent },
  warningCard: { backgroundColor: colors.secondary, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  warningTitle: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.body, color: colors.textPrimary, marginBottom: spacing.xs },
  warningText: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.caption, color: colors.textSecondary, lineHeight: 18 },
  version: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
