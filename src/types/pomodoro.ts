export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export type SubjectTag = string;

export interface CustomSubject {
  id: string;
  name: string;
  color: string; // Tailwind color name like 'amber', 'emerald', 'sky', etc.
  dotClass: string;
  textClass: string;
}

export interface CustomPreset {
  id: string;
  name: string;
  focusSeconds: number;
  shortBreakSeconds: number;
  longBreakSeconds: number;
  // legacy compatibility
  focusMinutes?: number;
  shortBreakMinutes?: number;
  longBreakMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  subject: SubjectTag;
  estimatedTomatoes: number;
  completedTomatoes: number;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
  completedAt?: number;
}

export interface SessionRecord {
  id: string;
  timestamp: number;
  durationMinutes: number;
  durationSeconds?: number;
  mode: TimerMode;
  taskId?: string;
  taskTitle?: string;
  subject?: SubjectTag;
}

export interface DistractionNote {
  id: string;
  content: string;
  createdAt: number;
  isHandled: boolean;
}

export interface PomodoroSettings {
  pomodoroSeconds: number;
  shortBreakSeconds: number;
  longBreakSeconds: number;
  // legacy compatibility
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number; // e.g. every 4 pomodoros
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  alarmSound: 'tibetan-bell' | 'marimba' | 'zen-gong' | 'soft-beep';
  alarmVolume: number; // 0 to 1
  tickingSound: boolean;
  tickingVolume: number;
  clockStyle: ClockStyle;
}


export type ThemeMode = 'dark' | 'light' | 'kyoto' | 'forest' | 'sunset' | 'retro';
export type ClockStyle = 'ring' | 'flip' | 'minimal';

export interface StudyQuote {
  id: string;
  original: string;
  translation: string;
  author: string;
  subject: string;
}


