import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressRing } from '@zenth/ui';
import { colors, spacing, typography } from '@zenth/utils';

interface ProgressHeaderProps {
  done: number;
  total: number;
}

export function ProgressHeader({ done, total }: ProgressHeaderProps) {
  const progress = total > 0 ? done / total : 0;
  return (
    <View style={styles.container}>
      <ProgressRing progress={progress} size={80} strokeWidth={6} color={progress >= 1 ? colors.success : colors.accent}>
        <Text style={styles.percentage}>{total > 0 ? Math.round(progress * 100) : 0}%</Text>
      </ProgressRing>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Today's Progress</Text>
        <Text style={styles.subtitle}>{done} of {total} tasks done</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.xl, gap: spacing.xl },
  textContainer: { flex: 1 },
  title: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.heading, color: colors.textPrimary },
  subtitle: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.body, color: colors.textSecondary, marginTop: 4 },
  percentage: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.bodyLg, color: colors.textPrimary },
});
