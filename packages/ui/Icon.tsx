import React from 'react';
import { colors } from '@zenth/utils';

// Re-export all icons from lucide-react-native.
// The mobile app imports from this wrapper, and the web app can use lucide-react directly.
// This keeps the icon interface consistent across platforms.

export { default as Brain } from 'lucide-react-native/src/icons/brain';
export { default as ListTodo } from 'lucide-react-native/src/icons/list-todo';
export { default as Check } from 'lucide-react-native/src/icons/check';
export { default as Bell } from 'lucide-react-native/src/icons/bell';
export { default as Timer } from 'lucide-react-native/src/icons/timer';
export { default as BarChart3 } from 'lucide-react-native/src/icons/bar-chart-3';
export { default as Settings } from 'lucide-react-native/src/icons/settings';
export { default as Mic } from 'lucide-react-native/src/icons/mic';
export { default as Send } from 'lucide-react-native/src/icons/send';
export { default as ChevronRight } from 'lucide-react-native/src/icons/chevron-right';
export { default as X } from 'lucide-react-native/src/icons/x';
export { default as Pause } from 'lucide-react-native/src/icons/pause';
export { default as Play } from 'lucide-react-native/src/icons/play';
export { default as SkipForward } from 'lucide-react-native/src/icons/skip-forward';
export { default as Square } from 'lucide-react-native/src/icons/square';
export { default as Trash2 } from 'lucide-react-native/src/icons/trash-2';
export { default as Calendar } from 'lucide-react-native/src/icons/calendar';
export { default as Repeat } from 'lucide-react-native/src/icons/repeat';
export { default as Zap } from 'lucide-react-native/src/icons/zap';
export { default as Sparkles } from 'lucide-react-native/src/icons/sparkles';

export const iconDefaults = {
  size: 22,
  color: colors.textPrimary,
  strokeWidth: 1.8,
} as const;
