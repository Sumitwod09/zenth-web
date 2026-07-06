// ─── Local Notification System ───────────────────────────────────────
// Powered by expo-notifications, local scheduling only.
// No push server required for MVP.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Task, NotificationPayload } from '@zenth/utils';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions.
 * Called on first reminder creation, not on app launch.
 */
export async function requestPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/**
 * Schedule a local notification for a task.
 * Uses the task ID as the notification identifier for easy cancellation.
 */
export async function scheduleTaskReminder(task: Task): Promise<string | null> {
  if (!task.dueAt) return null;

  const trigger = new Date(task.dueAt);

  // Don't schedule notifications in the past
  if (trigger.getTime() <= Date.now()) return null;

  const payload: NotificationPayload = {
    taskId: task.id,
    action: 'open_do_now',
  };

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Zenth — Time to act',
      body: task.title,
      data: payload as unknown as Record<string, unknown>,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: trigger,
    },
    identifier: `task-${task.id}`,
  });

  return identifier;
}

/**
 * Cancel a scheduled notification for a task.
 */
export async function cancelTaskReminder(taskId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(`task-${taskId}`);
}

/**
 * Reschedule a repeating task notification.
 * Called after a notification fires for a task with daily/weekly repeat.
 */
export async function rescheduleRepeatingTask(task: Task): Promise<void> {
  if (!task.dueAt || task.reminderRepeat === 'none') return;

  const msPerDay = 86_400_000;
  const msPerWeek = msPerDay * 7;

  let nextDue: number;

  if (task.reminderRepeat === 'daily') {
    nextDue = task.dueAt + msPerDay;
  } else {
    nextDue = task.dueAt + msPerWeek;
  }

  // Ensure we don't schedule in the past
  while (nextDue <= Date.now()) {
    nextDue += task.reminderRepeat === 'daily' ? msPerDay : msPerWeek;
  }

  const updatedTask: Task = { ...task, dueAt: nextDue };
  await scheduleTaskReminder(updatedTask);
}

/**
 * Cancel all scheduled notifications (used when clearing data).
 */
export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Configure the notification channel for Android.
 */
export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Task Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7c5cff',
    });
  }
}
