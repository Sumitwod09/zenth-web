// ─── Do Now Screen ───────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@zenth/ui';
import { Timer, Check, SkipForward, Bell } from '@zenth/ui';
import { FocusMode } from '@/components/FocusMode';
import { ReminderPicker } from '@/components/ReminderPicker';
import { useTaskStore } from '@/store/taskStore';
import { colors, spacing, typography } from '@zenth/utils';
import * as Haptics from 'expo-haptics';

export default function DoNowScreen() {
  const currentTask = useTaskStore((s) => s.getCurrentDoNowTask());
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const skipDoNow = useTaskStore((s) => s.skipDoNow);
  const updateReminder = useTaskStore((s) => s.updateTaskReminder);
  const activeTasks = useTaskStore((s) => s.getActiveTasks());

  const [focusVisible, setFocusVisible] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);

  const handleDone = () => {
    if (!currentTask) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toggleTask(currentTask.id);
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipDoNow();
  };

  const handleFocusComplete = () => {
    if (currentTask) toggleTask(currentTask.id);
    setFocusVisible(false);
  };

  if (!currentTask) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Nothing to do</Text>
          <Text style={styles.emptyHint}>Add some tasks from the Brain Dump tab</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Task count */}
        <Text style={styles.counter}>{activeTasks.length} task{activeTasks.length !== 1 ? 's' : ''} remaining</Text>

        {/* Current task */}
        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>{currentTask.title}</Text>
          {currentTask.dueAt && (
            <Text style={styles.taskDue}>
              Due: {new Date(currentTask.dueAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
            </Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button title="Start Focus" onPress={() => setFocusVisible(true)} fullWidth
            icon={<Timer size={20} color={colors.textPrimary} strokeWidth={2} />} />
          <View style={styles.actionRow}>
            <Button title="Done" variant="secondary" onPress={handleDone} style={styles.halfButton}
              icon={<Check size={18} color={colors.success} strokeWidth={2.5} />} />
            <Button title="Skip" variant="ghost" onPress={handleSkip} style={styles.halfButton}
              icon={<SkipForward size={18} color={colors.accent} strokeWidth={2} />} />
          </View>
          <Button title="Set Reminder" variant="ghost" onPress={() => setReminderVisible(true)}
            icon={<Bell size={18} color={colors.accent} strokeWidth={1.8} />} />
        </View>
      </View>

      <FocusMode visible={focusVisible} taskTitle={currentTask.title} onClose={() => setFocusVisible(false)} onComplete={handleFocusComplete} />
      <ReminderPicker visible={reminderVisible} initialDueAt={currentTask.dueAt} initialRepeat={currentTask.reminderRepeat}
        onSave={(dueAt, repeat) => updateReminder(currentTask.id, dueAt, repeat)} onClose={() => setReminderVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl },
  counter: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.caption, color: colors.textSecondary, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.xl },
  taskCard: { backgroundColor: colors.secondary, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: spacing['3xl'], alignItems: 'center', marginBottom: spacing['3xl'] },
  taskTitle: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.headingLg, color: colors.textPrimary, textAlign: 'center', lineHeight: typography.lineHeight.headingLg },
  taskDue: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.caption, color: colors.textSecondary, marginTop: spacing.md },
  actions: { gap: spacing.md },
  actionRow: { flexDirection: 'row', gap: spacing.md },
  halfButton: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  emptyTitle: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.headingLg, color: colors.textSecondary },
  emptyHint: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.body, color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
});
