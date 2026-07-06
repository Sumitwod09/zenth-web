// ─── Focus Mode ──────────────────────────────────────────────────────
// Full-screen overlay with a large circular countdown timer.

import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ProgressRing } from '@zenth/ui';
import { Play, Pause, Square, Check } from '@zenth/ui';
import { colors, spacing, typography, formatTimerDisplay } from '@zenth/utils';
import { useTimer } from '@/hooks/useTimer';
import { useSettingsStore } from '@/store/settingsStore';
import * as Haptics from 'expo-haptics';

interface FocusModeProps {
  visible: boolean;
  taskTitle: string;
  onClose: () => void;
  onComplete: () => void;
}

export function FocusMode({ visible, taskTitle, onClose, onComplete }: FocusModeProps) {
  const focusDuration = useSettingsStore((s) => s.focusDuration);
  const { secondsRemaining, status, progress, start, pause, resume, stop } =
    useTimer(focusDuration);

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    stop();
    onComplete();
  };

  const handleStop = () => {
    stop();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        {/* Task title */}
        <Text style={styles.taskTitle} numberOfLines={2}>
          {taskTitle}
        </Text>

        {/* Timer ring */}
        <View style={styles.timerContainer}>
          <ProgressRing
            progress={progress}
            size={240}
            strokeWidth={10}
            color={status === 'completed' ? colors.success : colors.accent}
          >
            <Text style={styles.timerText}>
              {status === 'completed'
                ? 'Done!'
                : formatTimerDisplay(secondsRemaining)}
            </Text>
            <Text style={styles.timerLabel}>
              {status === 'idle'
                ? 'Ready'
                : status === 'running'
                ? 'Focusing'
                : status === 'paused'
                ? 'Paused'
                : 'Complete'}
            </Text>
          </ProgressRing>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {status === 'idle' && (
            <TouchableOpacity style={styles.primaryButton} onPress={start}>
              <Play size={28} color={colors.textPrimary} strokeWidth={2} />
              <Text style={styles.buttonText}>Start Focus</Text>
            </TouchableOpacity>
          )}

          {status === 'running' && (
            <View style={styles.controlRow}>
              <TouchableOpacity style={styles.controlButton} onPress={pause}>
                <Pause size={24} color={colors.textPrimary} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, styles.stopButton]}
                onPress={handleStop}
              >
                <Square size={24} color={colors.danger} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}

          {status === 'paused' && (
            <View style={styles.controlRow}>
              <TouchableOpacity style={styles.primaryButton} onPress={resume}>
                <Play size={24} color={colors.textPrimary} strokeWidth={2} />
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.controlButton, styles.stopButton]}
                onPress={handleStop}
              >
                <Square size={24} color={colors.danger} strokeWidth={2} />
              </TouchableOpacity>
            </View>
          )}

          {status === 'completed' && (
            <View style={styles.completedActions}>
              <TouchableOpacity
                style={[styles.primaryButton, styles.successButton]}
                onPress={handleComplete}
              >
                <Check size={24} color={colors.textPrimary} strokeWidth={2.5} />
                <Text style={styles.buttonText}>Mark Done</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleStop}>
                <Text style={styles.skipText}>Back to Do Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Exit */}
        {status === 'idle' && (
          <TouchableOpacity style={styles.exitButton} onPress={onClose}>
            <Text style={styles.exitText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing['3xl'],
  },
  taskTitle: {
    fontFamily: typography.fontFamily.headingSemiBold,
    fontSize: typography.fontSize.headingLg,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing['4xl'],
    paddingHorizontal: spacing.lg,
  },
  timerContainer: {
    marginBottom: spacing['5xl'],
  },
  timerText: {
    fontFamily: typography.fontFamily.headingSemiBold,
    fontSize: typography.fontSize.display,
    color: colors.textPrimary,
  },
  timerLabel: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  controls: {
    alignItems: 'center',
    width: '100%',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['3xl'],
    borderRadius: 100,
    gap: spacing.sm,
    minWidth: 180,
  },
  successButton: {
    backgroundColor: colors.success,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stopButton: {
    borderColor: colors.danger,
  },
  buttonText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.bodyLg,
    color: colors.textPrimary,
  },
  completedActions: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  skipText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
  },
  exitButton: {
    position: 'absolute',
    bottom: 60,
  },
  exitText: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    color: colors.textSecondary,
  },
});
