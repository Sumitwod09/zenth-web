// ─── Dump Card ───────────────────────────────────────────────────────
// Displays a brain dump entry in the inbox list.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight, ListTodo, Trash2 } from '@zenth/ui';
import { colors, radii, spacing, typography, formatRelative } from '@zenth/utils';
import type { Dump } from '@zenth/utils';

interface DumpCardProps {
  dump: Dump;
  onConvert: (dump: Dump) => void;
  onDelete: (id: string) => void;
}

export function DumpCard({ dump, onConvert, onDelete }: DumpCardProps) {
  const isConverted = dump.convertedToTaskIds.length > 0;

  return (
    <View style={[styles.card, isConverted && styles.cardConverted]}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => !isConverted && onConvert(dump)}
        activeOpacity={isConverted ? 1 : 0.7}
      >
        <Text
          style={[styles.text, isConverted && styles.textConverted]}
          numberOfLines={3}
        >
          {dump.text}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.timestamp}>
            {formatRelative(dump.createdAt)}
          </Text>
          {isConverted ? (
            <View style={styles.badge}>
              <ListTodo size={12} color={colors.success} strokeWidth={2} />
              <Text style={styles.badgeText}>
                {dump.convertedToTaskIds.length} task
                {dump.convertedToTaskIds.length !== 1 ? 's' : ''}
              </Text>
            </View>
          ) : (
            <View style={styles.convertHint}>
              <Text style={styles.convertText}>Convert</Text>
              <ChevronRight size={14} color={colors.accent} strokeWidth={2} />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(dump.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Trash2 size={16} color={colors.textSecondary} strokeWidth={1.8} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  cardConverted: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  text: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.body,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.body,
  },
  textConverted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  timestamp: {
    fontFamily: typography.fontFamily.body,
    fontSize: typography.fontSize.caption,
    color: colors.textSecondary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.caption,
    color: colors.success,
  },
  convertHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  convertText: {
    fontFamily: typography.fontFamily.bodyMedium,
    fontSize: typography.fontSize.caption,
    color: colors.accent,
  },
  deleteButton: {
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
