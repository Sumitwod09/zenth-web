import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@zenth/utils';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export function Card({ children, style, noPadding = false }: CardProps) {
  return (
    <View style={[styles.card, noPadding ? undefined : styles.padding, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.secondary,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  padding: {
    padding: spacing.lg,
  },
});
