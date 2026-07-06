// ─── Notification Handler Hook ───────────────────────────────────────
// Registers listeners for notification taps and routes to Do Now Mode.

import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import type { NotificationPayload } from '@zenth/utils';
import { useTaskStore } from '@/store/taskStore';

export function useNotifications() {
  const router = useRouter();
  const setDoNowTask = useTaskStore((s) => s.setDoNowTask);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Handle notification tapped while app is running or in background
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content
          .data as unknown as NotificationPayload;

        if (data?.action === 'open_do_now' && data?.taskId) {
          setDoNowTask(data.taskId);
          router.push('/(tabs)/do-now');
        }
      });

    // Check if app was opened from a notification (cold start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content
          .data as unknown as NotificationPayload;

        if (data?.action === 'open_do_now' && data?.taskId) {
          setDoNowTask(data.taskId);
          router.push('/(tabs)/do-now');
        }
      }
    });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [router, setDoNowTask]);
}
