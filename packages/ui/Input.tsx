import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { colors, radii, spacing, typography } from '@zenth/utils';

interface InputProps extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
}

export function Input({
  label,
  containerStyle,
  rightElement,
  style,
  ...props
}: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          selectionColor={colors.accent}
          style={[styles.input, rightElement ? styles.inputWithRight : undefined, style]}
          {...props}
        />
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.bodyLg,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  inputWithRight: {
    paddingRight: spacing.xs,
  },
  rightElement: {
    paddingRight: spacing.sm,
  },
});
