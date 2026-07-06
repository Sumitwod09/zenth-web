import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Check, Bell, Calendar } from '@zenth/ui';
import { colors, radii, spacing, typography, formatRelative } from '@zenth/utils';
import type { Task } from '@zenth/utils';
import * as Haptics from 'expo-haptics';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress?: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onPress }: TaskItemProps) {
  const isDone = task.status === 'done';
  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle(task.id);
  };

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} layout={Layout.springify()}>
      <TouchableOpacity style={[styles.container, isDone && styles.containerDone]} onPress={() => onPress?.(task)} activeOpacity={onPress ? 0.7 : 1}>
        <TouchableOpacity style={[styles.checkbox, isDone && styles.checkboxDone]} onPress={handleToggle} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          {isDone && <Check size={14} color={colors.background} strokeWidth={3} />}
        </TouchableOpacity>
        <View style={styles.content}>
          <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={2}>{task.title}</Text>
          {task.dueAt && (
            <View style={styles.metaRow}>
              <Calendar size={12} color={colors.textSecondary} strokeWidth={1.8} />
              <Text style={styles.meta}>{formatRelative(task.dueAt)}</Text>
              {task.reminderRepeat !== 'none' && (
                <>
                  <Bell size={12} color={colors.textSecondary} strokeWidth={1.8} />
                  <Text style={styles.meta}>{task.reminderRepeat}</Text>
                </>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.secondary, borderRadius: radii.md, borderWidth: 1, borderColor: colors.border, paddingVertical: spacing.md, paddingHorizontal: spacing.lg, marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  containerDone: { opacity: 0.5 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  checkboxDone: { backgroundColor: colors.success, borderColor: colors.success },
  content: { flex: 1 },
  title: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.body, color: colors.textPrimary, lineHeight: typography.lineHeight.body },
  titleDone: { textDecorationLine: 'line-through', color: colors.textSecondary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  meta: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.caption, color: colors.textSecondary, marginRight: spacing.sm },
});
