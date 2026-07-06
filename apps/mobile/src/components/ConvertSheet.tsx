// ─── Convert Sheet ───────────────────────────────────────────────────
// Bottom sheet for converting a brain dump into one or more tasks.
// User edits the raw text into task lines (one per line).

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X } from '@zenth/ui';
import { Button } from '@zenth/ui';
import { colors, radii, spacing, typography } from '@zenth/utils';
import type { Dump } from '@zenth/utils';
import * as Haptics from 'expo-haptics';

interface ConvertSheetProps {
  dump: Dump | null;
  visible: boolean;
  onClose: () => void;
  onConvert: (dumpId: string, taskTitles: string[]) => void;
}

export function ConvertSheet({
  dump,
  visible,
  onClose,
  onConvert,
}: ConvertSheetProps) {
  const [text, setText] = useState('');

  // Reset text when a new dump is shown
  React.useEffect(() => {
    if (dump) {
      setText(dump.text);
    }
  }, [dump]);

  const handleConvert = () => {
    if (!dump) return;

    const lines = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConvert(dump.id, lines);
    onClose();
  };

  const lineCount = text
    .split('\n')
    .filter((l) => l.trim().length > 0).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Convert to Tasks</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <X size={22} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Instructions */}
          <Text style={styles.hint}>
            Edit the text below. Each line becomes a separate task.
          </Text>

          {/* Text editor */}
          <ScrollView style={styles.editorScroll} keyboardShouldPersistTaps="handled">
            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              autoFocus
              style={styles.editor}
              selectionColor={colors.accent}
              placeholderTextColor={colors.textSecondary}
              placeholder="Type one task per line..."
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.lineCount}>
              {lineCount} task{lineCount !== 1 ? 's' : ''} will be created
            </Text>
            <Button
              title="Create Tasks"
              onPress={handleConvert}
              disabled={lineCount === 0}
              fullWidth
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing['3xl'],
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.headingSemiBold,
    fontSize: typography.fontSize.heading,
    color: colors.textPrimary,
  },
  hint: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  editorScroll: {
    maxHeight: 200,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  editor: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.bodyLg,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  lineCount: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
