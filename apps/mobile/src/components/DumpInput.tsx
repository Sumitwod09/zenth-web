// ─── Brain Dump Input ────────────────────────────────────────────────
// Always-visible text input on the Home screen for frictionless thought capture.

import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Send, Mic } from '@zenth/ui';
import { colors, radii, spacing, typography } from '@zenth/utils';
import * as Haptics from 'expo-haptics';

interface DumpInputProps {
  onSubmit: (text: string) => void;
  autoFocus?: boolean;
}

export function DumpInput({ onSubmit, autoFocus = true }: DumpInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSubmit(trimmed);
    setText('');
    // Keep keyboard open for rapid capture
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          placeholder="What's on your mind?"
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.accent}
          multiline
          maxLength={500}
          autoFocus={autoFocus}
          style={styles.input}
          onSubmitEditing={handleSubmit}
          blurOnSubmit={false}
        />
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!text.trim()}
            style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
            activeOpacity={0.7}
          >
            <Send
              size={20}
              color={text.trim() ? colors.accent : colors.textSecondary}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.secondary,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: spacing.sm,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.bodyLg,
    color: colors.textPrimary,
    maxHeight: 100,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.sm,
    paddingBottom: 2,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentGlow,
  },
  sendButtonDisabled: {
    backgroundColor: colors.transparent,
  },
});
