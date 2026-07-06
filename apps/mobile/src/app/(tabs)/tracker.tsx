// ─── Tracker Screen ──────────────────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskItem } from '@/components/TaskItem';
import { ProgressHeader } from '@/components/ProgressHeader';
import { ReminderPicker } from '@/components/ReminderPicker';
import { useTaskStore } from '@/store/taskStore';
import { colors, spacing, typography, radii } from '@zenth/utils';
import type { Task, TrackerFilter } from '@zenth/utils';

const FILTERS: { label: string; value: TrackerFilter }[] = [
  { label: 'Today', value: 'today' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
];

export default function TrackerScreen() {
  const filteredTasks = useTaskStore((s) => s.getFilteredTasks());
  const activeFilter = useTaskStore((s) => s.activeFilter);
  const setFilter = useTaskStore((s) => s.setFilter);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const updateReminder = useTaskStore((s) => s.updateTaskReminder);
  const { done, total } = useTaskStore((s) => s.getTodayProgress());

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [reminderVisible, setReminderVisible] = useState(false);

  const handleTaskPress = (task: Task) => {
    if (task.status === 'done') return;
    setSelectedTask(task);
    setReminderVisible(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressHeader done={done} total={total} />

      {/* Filters */}
      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f.value} style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]} onPress={() => setFilter(f.value)}>
            <Text style={[styles.filterText, activeFilter === f.value && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskItem task={item} onToggle={toggleTask} onPress={handleTaskPress} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {activeFilter === 'completed' ? 'No completed tasks yet' : activeFilter === 'upcoming' ? 'No upcoming tasks' : 'All clear for today'}
            </Text>
          </View>
        }
      />

      {selectedTask && (
        <ReminderPicker visible={reminderVisible} initialDueAt={selectedTask.dueAt} initialRepeat={selectedTask.reminderRepeat}
          onSave={(dueAt, repeat) => updateReminder(selectedTask.id, dueAt, repeat)} onClose={() => { setReminderVisible(false); setSelectedTask(null); }} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filters: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.md, gap: spacing.sm },
  filterChip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.secondary },
  filterChipActive: { borderColor: colors.accent, backgroundColor: colors.accentGlow },
  filterText: { fontFamily: typography.fontFamily.bodyMedium, fontSize: typography.fontSize.body, color: colors.textSecondary },
  filterTextActive: { color: colors.accent },
  list: { paddingTop: spacing.sm, paddingBottom: spacing['5xl'] },
  empty: { alignItems: 'center', paddingTop: spacing['5xl'] },
  emptyText: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.body, color: colors.textSecondary },
});
