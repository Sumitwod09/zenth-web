import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Bell, Calendar, Repeat, X } from '@zenth/ui';
import { Button } from '@zenth/ui';
import { colors, radii, spacing, typography, formatDate, formatTime } from '@zenth/utils';
import { requestPermissions } from '@/lib/notifications';
import { useSettingsStore } from '@/store/settingsStore';

interface ReminderPickerProps {
  visible: boolean;
  initialDueAt?: number | null;
  initialRepeat?: 'none' | 'daily' | 'weekly';
  onSave: (dueAt: number | null, repeat: 'none' | 'daily' | 'weekly') => void;
  onClose: () => void;
}

export function ReminderPicker({ visible, initialDueAt, initialRepeat = 'none', onSave, onClose }: ReminderPickerProps) {
  const [date, setDate] = useState(initialDueAt ? new Date(initialDueAt) : new Date(Date.now() + 3600000));
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly'>(initialRepeat);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const markAsked = useSettingsStore((s) => s.markNotificationPermissionAsked);

  const handleSave = async () => {
    const granted = await requestPermissions();
    markAsked();
    if (granted) {
      onSave(date.getTime(), repeat);
    }
    onClose();
  };

  const handleRemove = () => {
    onSave(null, 'none');
    onClose();
  };

  const repeatOptions: Array<{ label: string; value: 'none' | 'daily' | 'weekly' }> = [
    { label: 'None', value: 'none' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Set Reminder</Text>
            <TouchableOpacity onPress={onClose}><X size={22} color={colors.textSecondary} strokeWidth={2} /></TouchableOpacity>
          </View>

          {/* Date */}
          <TouchableOpacity style={styles.row} onPress={() => setShowDatePicker(true)}>
            <Calendar size={20} color={colors.accent} strokeWidth={1.8} />
            <Text style={styles.rowText}>{formatDate(date.getTime())}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} minimumDate={new Date()}
              onChange={(_, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setDate(d); }}
              themeVariant="dark"
            />
          )}

          {/* Time */}
          <TouchableOpacity style={styles.row} onPress={() => setShowTimePicker(true)}>
            <Bell size={20} color={colors.accent} strokeWidth={1.8} />
            <Text style={styles.rowText}>{formatTime(date.getTime())}</Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker value={date} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, d) => { setShowTimePicker(Platform.OS === 'ios'); if (d) setDate(d); }}
              themeVariant="dark"
            />
          )}

          {/* Repeat */}
          <View style={styles.repeatSection}>
            <View style={styles.repeatHeader}>
              <Repeat size={20} color={colors.accent} strokeWidth={1.8} />
              <Text style={styles.rowText}>Repeat</Text>
            </View>
            <View style={styles.repeatOptions}>
              {repeatOptions.map((opt) => (
                <TouchableOpacity key={opt.value} style={[styles.repeatChip, repeat === opt.value && styles.repeatChipActive]} onPress={() => setRepeat(opt.value)}>
                  <Text style={[styles.repeatChipText, repeat === opt.value && styles.repeatChipTextActive]}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Button title="Set Reminder" onPress={handleSave} fullWidth />
            {initialDueAt && (
              <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
                <Text style={styles.removeText}>Remove Reminder</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: colors.secondary, borderTopLeftRadius: radii.xl, borderTopRightRadius: radii.xl, paddingTop: spacing.xl, paddingBottom: spacing['3xl'] },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, marginBottom: spacing.lg },
  title: { fontFamily: typography.fontFamily.headingSemiBold, fontSize: typography.fontSize.heading, color: colors.textPrimary },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, backgroundColor: colors.background, marginHorizontal: spacing.lg, marginBottom: spacing.sm, borderRadius: radii.md },
  rowText: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.bodyLg, color: colors.textPrimary },
  repeatSection: { paddingHorizontal: spacing.xl, marginTop: spacing.sm },
  repeatHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  repeatOptions: { flexDirection: 'row', gap: spacing.sm },
  repeatChip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radii.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  repeatChipActive: { borderColor: colors.accent, backgroundColor: colors.accentGlow },
  repeatChipText: { fontFamily: typography.fontFamily.bodyMedium, fontSize: typography.fontSize.body, color: colors.textSecondary },
  repeatChipTextActive: { color: colors.accent },
  footer: { paddingHorizontal: spacing.xl, marginTop: spacing.xl, gap: spacing.md },
  removeButton: { alignItems: 'center', paddingVertical: spacing.sm },
  removeText: { fontFamily: typography.fontFamily.body, fontSize: typography.fontSize.body, color: colors.danger },
});
