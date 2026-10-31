/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  TimerMode,
  Task,
  SessionRecord,
  DistractionNote,
  PomodoroSettings,
  ThemeMode,
  CustomSubject,
  CustomPreset,
  ClockStyle,
} from './types/pomodoro';
import {
  DEFAULT_SETTINGS,
  loadStoredTasks,
  saveStoredTasks,
  loadStoredSessions,
  saveStoredSessions,
  loadStoredNotes,
  saveStoredNotes,
  loadStoredSettings,
  saveStoredSettings,
  loadStoredSubjects,
  saveStoredSubjects,
  loadStoredPresets,
  saveStoredPresets,
  STUDY_QUOTES,
  getQuotesForSubject,
  STORAGE_KEYS,
} from './utils/storage';
import { soundEngine } from './utils/soundEngine';
import { Navbar } from './components/Navbar';
import { TimerDisplay } from './components/TimerDisplay';
import { TaskKanban } from './components/TaskKanban';
import { StudyStats } from './components/StudyStats';
import { DistractionNotepad } from './components/DistractionNotepad';
import { AmbientSoundMixer } from './components/AmbientSoundMixer';
import { ZenModeOverlay } from './components/ZenModeOverlay';
import { SettingsModal } from './components/SettingsModal';
import { CustomTimeModal } from './components/CustomTimeModal';
import { ThemeStyleModal } from './components/ThemeStyleModal';
import { Timer as TimerIcon, CheckSquare, BarChart2, MessageSquare } from 'lucide-react';

export default function App() {
  // Navigation & Modal states
  const [currentTab, setCurrentTab] = useState<'timer' | 'tasks' | 'stats' | 'notes'>('timer');
  const [isAmbientOpen, setIsAmbientOpen] = useState(false);
  const [isZenOpen, setIsZenOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomTimeOpen, setIsCustomTimeOpen] = useState(false);
  const [isThemeStyleOpen, setIsThemeStyleOpen] = useState(false);

  // Core Data
  const [tasks, setTasks] = useState<Task[]>(loadStoredTasks);
  const [sessions, setSessions] = useState<SessionRecord[]>(loadStoredSessions);
  const [notes, setNotes] = useState<DistractionNote[]>(loadStoredNotes);
  const [settings, setSettings] = useState<PomodoroSettings>(loadStoredSettings);
  const [subjects, setSubjects] = useState<CustomSubject[]>(loadStoredSubjects);
  const [presets, setPresets] = useState<CustomPreset[]>(loadStoredPresets);

  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_TASK_ID) || 'task-1';
  });

  // Theme
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode;
    return saved || 'dark';
  });

  // Timer states
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  // Calculate duration in seconds for current mode
  const getDurationForMode = useCallback(
    (m: TimerMode, customSettings = settings) => {
      switch (m) {
        case 'pomodoro':
          return customSettings.pomodoroSeconds ?? customSettings.pomodoroMinutes * 60;
        case 'shortBreak':
          return customSettings.shortBreakSeconds ?? customSettings.shortBreakMinutes * 60;
        case 'longBreak':
          return customSettings.longBreakSeconds ?? customSettings.longBreakMinutes * 60;
      }
    },
    [settings]
  );

  const [timeLeft, setTimeLeft] = useState<number>(() => settings.pomodoroSeconds ?? settings.pomodoroMinutes * 60);
  const [totalTime, setTotalTime] = useState<number>(() => settings.pomodoroSeconds ?? settings.pomodoroMinutes * 60);


  // Quote
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Track active ambients for badge
  const [activeAmbientsCount, setActiveAmbientsCount] = useState(0);

  // Sync tasks
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  // Sync sessions
  useEffect(() => {
    saveStoredSessions(sessions);
  }, [sessions]);

  // Sync notes
  useEffect(() => {
    saveStoredNotes(notes);
  }, [notes]);

  // Sync settings
  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  // Sync subjects
  useEffect(() => {
    saveStoredSubjects(subjects);
  }, [subjects]);

  // Sync presets
  useEffect(() => {
    saveStoredPresets(presets);
  }, [presets]);

  // Sync active task
  useEffect(() => {
    if (activeTaskId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_TASK_ID, activeTaskId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_TASK_ID);
    }
  }, [activeTaskId]);

  // Sync Theme classes across the document
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    const root = document.documentElement;
    // Remove all previous theme classes
    root.classList.remove('theme-dark', 'theme-light', 'theme-kyoto', 'theme-forest', 'theme-sunset', 'theme-retro');
    root.classList.add(`theme-${theme}`);

    // Manage standard dark mode variant
    if (['dark', 'forest', 'sunset', 'retro'].includes(theme)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Update ambients count
  useEffect(() => {
    const checkAmbients = () => {
      try {
        const raw = localStorage.getItem('focusdesk_ambient_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          const count = Object.values(parsed).filter((v: any) => v > 0).length;
          setActiveAmbientsCount(count);
        }
      } catch {
        // ignore
      }
    };
    checkAmbients();
    const interval = setInterval(checkAmbients, 1000);
    return () => clearInterval(interval);
  }, []);

  // Timer Tick implementation using accurate time delta
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const activeTaskIdRef = useRef(activeTaskId);
  activeTaskIdRef.current = activeTaskId;
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;
  const cycleCountRef = useRef(cycleCount);
  cycleCountRef.current = cycleCount;

  // Handle Session Completed
  const handleSessionComplete = useCallback(() => {
    const currentMode = modeRef.current;
    const currentSettings = settingsRef.current;
    const currentTaskId = activeTaskIdRef.current;
    const currentTasks = tasksRef.current;

    // 1. Play Alarm
    soundEngine.playAlarm(currentSettings.alarmSound, currentSettings.alarmVolume);

    // 2. Log Session Record
    const durationSeconds =
      currentMode === 'pomodoro'
        ? currentSettings.pomodoroSeconds ?? currentSettings.pomodoroMinutes * 60
        : currentMode === 'shortBreak'
        ? currentSettings.shortBreakSeconds ?? currentSettings.shortBreakMinutes * 60
        : currentSettings.longBreakSeconds ?? currentSettings.longBreakMinutes * 60;

    const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

    const matchedTask = currentTasks.find(t => t.id === currentTaskId);

    const newRecord: SessionRecord = {
      id: `session-${Date.now()}`,
      timestamp: Date.now(),
      durationMinutes,
      durationSeconds,
      mode: currentMode,
      taskId: matchedTask?.id,
      taskTitle: matchedTask?.title,
      subject: matchedTask?.subject,
    };

    setSessions(prev => [newRecord, ...prev]);


    // 3. Update task tomato count if in pomodoro mode
    if (currentMode === 'pomodoro' && matchedTask) {
      setTasks(prev =>
        prev.map(t => {
          if (t.id === matchedTask.id) {
            const newCompleted = t.completedTomatoes + 1;
            return {
              ...t,
              completedTomatoes: newCompleted,
              isCompleted: newCompleted >= t.estimatedTomatoes ? true : t.isCompleted,
            };
          }
          return t;
        })
      );
    }

    // 4. Determine next mode
    let nextMode: TimerMode = 'pomodoro';
    let shouldAutoStart = false;

    if (currentMode === 'pomodoro') {
      const nextCycle = cycleCountRef.current + 1;
      setCycleCount(nextCycle);

      if (nextCycle % currentSettings.longBreakInterval === 0) {
        nextMode = 'longBreak';
      } else {
        nextMode = 'shortBreak';
      }
      shouldAutoStart = currentSettings.autoStartBreaks;
    } else {
      nextMode = 'pomodoro';
      shouldAutoStart = currentSettings.autoStartPomodoros;
    }

    const nextDuration = getDurationForMode(nextMode, currentSettings);
    setMode(nextMode);
    setTimeLeft(nextDuration);
    setTotalTime(nextDuration);
    setIsRunning(shouldAutoStart);
  }, [getDurationForMode]);

  // Main timer effect
  useEffect(() => {
    if (!isRunning) return;

    let expected = Date.now() + 1000;
    const timer = setInterval(() => {
      const now = Date.now();
      const drift = now - expected;

      // Play soft tick if enabled and in pomodoro mode
      if (settingsRef.current.tickingSound && modeRef.current === 'pomodoro') {
        soundEngine.playTick(settingsRef.current.tickingVolume);
      }

      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });

      expected += 1000;
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, handleSessionComplete]);

  // Global Keyboard shortcuts: Space for start/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Timer controls
  const handleToggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    const duration = getDurationForMode(mode);
    setTimeLeft(duration);
    setTotalTime(duration);
  };

  const handleSkipTimer = () => {
    setIsRunning(false);
    let nextMode: TimerMode = 'pomodoro';
    if (mode === 'pomodoro') {
      nextMode = (cycleCount + 1) % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak';
    } else {
      nextMode = 'pomodoro';
    }
    const duration = getDurationForMode(nextMode);
    setMode(nextMode);
    setTimeLeft(duration);
    setTotalTime(duration);
  };

  const handleChangeMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    const duration = getDurationForMode(newMode);
    setTimeLeft(duration);
    setTotalTime(duration);
  };

  const handleAdjustTime = (seconds: number) => {
    setTimeLeft(prev => {
      const updated = Math.max(60, prev + seconds);
      setTotalTime(updated);
      return updated;
    });
  };

  const handleApplyPreset = (focusSec: number, shortSec: number, longSec: number) => {
    const updated: PomodoroSettings = {
      ...settings,
      pomodoroSeconds: focusSec,
      shortBreakSeconds: shortSec,
      longBreakSeconds: longSec,
      pomodoroMinutes: Math.floor(focusSec / 60),
      shortBreakMinutes: Math.floor(shortSec / 60),
      longBreakMinutes: Math.floor(longSec / 60),
    };
    setSettings(updated);
    setIsRunning(false);
    setMode('pomodoro');
    setTimeLeft(focusSec);
    setTotalTime(focusSec);
  };


  // Custom Preset Management
  const handleSaveNewPreset = (presetData: Omit<CustomPreset, 'id'>) => {
    const newPreset: CustomPreset = {
      ...presetData,
      id: `preset-${Date.now()}`,
    };
    setPresets(prev => [...prev, newPreset]);
  };

  const handleDeletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  // Custom Subject Management
  const handleAddCustomSubject = (subData: Omit<CustomSubject, 'id'>) => {
    const newSub: CustomSubject = {
      ...subData,
      id: `sub-${Date.now()}`,
    };
    setSubjects(prev => [...prev, newSub]);
  };

  // Task handlers
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'completedTomatoes'>) => {
    const task: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      completedTomatoes: 0,
      createdAt: Date.now(),
    };
    setTasks(prev => [task, ...prev]);
    if (!activeTaskId) {
      setActiveTaskId(task.id);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.isCompleted;
          if (nextState) {
            soundEngine.playAlarm('marimba', 0.5);
          }
          return {
            ...t,
            isCompleted: nextState,
            completedAt: nextState ? Date.now() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
  };

  const handleUpdateTomatoes = (taskId: string, delta: number) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const next = Math.max(0, t.completedTomatoes + delta);
          return { ...t, completedTomatoes: next };
        }
        return t;
      })
    );
  };

  // Distraction Notes handlers
  const handleAddNote = (content: string) => {
    const note: DistractionNote = {
      id: `note-${Date.now()}`,
      content,
      createdAt: Date.now(),
      isHandled: false,
    };
    setNotes(prev => [note, ...prev]);
  };

  const handleToggleNote = (id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isHandled: !n.isHandled } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleClearHandledNotes = () => {
    setNotes(prev => prev.filter(n => !n.isHandled));
  };

  const handleClearHistory = () => {
    if (window.confirm('確定要清除所有專注流水記錄嗎？（此動作無法復原）')) {
      setSessions([]);
    }
  };

  const handleSelectClockStyle = (clockStyle: ClockStyle) => {
    setSettings(prev => ({ ...prev, clockStyle }));
  };

  const activeTask = tasks.find(t => t.id === activeTaskId) || null;
  const pendingNotesCount = notes.filter(n => !n.isHandled).length;

  // Dynamic quotes based on current active task's subject
  const currentSubjectQuotes = useMemo(() => {
    return getQuotesForSubject(activeTask?.subject);
  }, [activeTask?.subject]);

  const currentQuote = currentSubjectQuotes[quoteIndex % currentSubjectQuotes.length] || STUDY_QUOTES[0];

  const handleNextQuote = useCallback(() => {
    setQuoteIndex(prev => prev + 1);
  }, []);

  // When active subject changes, select an appropriate quote from the subject's pool
  useEffect(() => {
    const pool = getQuotesForSubject(activeTask?.subject);
    setQuoteIndex(Math.floor(Math.random() * pool.length));
  }, [activeTask?.subject]);

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
      }}
      className="min-h-screen transition-colors duration-300 flex flex-col font-sans"
    >
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingNotesCount={pendingNotesCount}
        onOpenAmbient={() => setIsAmbientOpen(true)}
        onOpenZen={() => setIsZenOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenThemeStyle={() => setIsThemeStyleOpen(true)}
        theme={theme}
        activeAmbientsCount={activeAmbientsCount}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col justify-center">
        {currentTab === 'timer' && (
          <TimerDisplay
            mode={mode}
            timeLeft={timeLeft}
            totalTime={totalTime}
            isRunning={isRunning}
            cycleCount={cycleCount}
            activeTask={activeTask}
            settings={settings}
            presets={presets}
            quote={currentQuote}
            onNextQuote={handleNextQuote}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onSkipTimer={handleSkipTimer}
            onChangeMode={handleChangeMode}
            onAdjustTime={handleAdjustTime}
            onApplyPreset={handleApplyPreset}
            onOpenTasks={() => setCurrentTab('tasks')}
            onOpenZen={() => setIsZenOpen(true)}
            onOpenCustomTime={() => setIsCustomTimeOpen(true)}
            onOpenThemeStyle={() => setIsThemeStyleOpen(true)}
          />
        )}

        {currentTab === 'tasks' && (
          <TaskKanban
            tasks={tasks}
            subjects={subjects}
            activeTaskId={activeTaskId}
            onSelectActiveTask={setActiveTaskId}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTomatoes={handleUpdateTomatoes}
            onAddCustomSubject={handleAddCustomSubject}
          />
        )}

        {currentTab === 'stats' && (
          <StudyStats
            sessions={sessions}
            tasks={tasks}
            onClearHistory={handleClearHistory}
          />
        )}

        {currentTab === 'notes' && (
          <DistractionNotepad
            notes={notes}
            onAddNote={handleAddNote}
            onToggleNote={handleToggleNote}
            onDeleteNote={handleDeleteNote}
            onClearHandled={handleClearHandledNotes}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden sticky bottom-0 z-40 bg-neutral-950/95 border-t border-neutral-800 backdrop-blur-lg px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('timer')}
          className={`flex flex-col items-center gap-1 text-[11px] py-1 ${
            currentTab === 'timer' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <TimerIcon className="w-5 h-5" />
          <span>計時</span>
        </button>
        <button
          onClick={() => setCurrentTab('tasks')}
          className={`flex flex-col items-center gap-1 text-[11px] py-1 ${
            currentTab === 'tasks' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span>任務</span>
        </button>
        <button
          onClick={() => setCurrentTab('stats')}
          className={`flex flex-col items-center gap-1 text-[11px] py-1 ${
            currentTab === 'stats' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span>統計</span>
        </button>
        <button
          onClick={() => setCurrentTab('notes')}
          className={`flex flex-col items-center gap-1 text-[11px] py-1 relative ${
            currentTab === 'notes' ? 'text-amber-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>便籤</span>
          {pendingNotesCount > 0 && (
            <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-neutral-800 text-center text-xs text-neutral-500">
        <div className="flex items-center justify-center gap-3">
          <span>墨讀 FocusDesk</span>
          <span aria-hidden="true">·</span>
          <span>心流番茄鐘學習法</span>
          <span aria-hidden="true">·</span>
          <span>空白鍵快速暫停</span>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AmbientSoundMixer
        isOpen={isAmbientOpen}
        onClose={() => setIsAmbientOpen(false)}
      />

      <ZenModeOverlay
        isOpen={isZenOpen}
        onClose={() => setIsZenOpen(false)}
        timeLeft={timeLeft}
        isRunning={isRunning}
        onToggleTimer={handleToggleTimer}
        onSkipTimer={handleSkipTimer}
        onResetTimer={handleResetTimer}
        mode={mode}
        activeTask={activeTask}
        onOpenAmbient={() => setIsAmbientOpen(true)}
        clockStyle={settings.clockStyle}
        quote={currentQuote}
      />


      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      <CustomTimeModal
        isOpen={isCustomTimeOpen}
        onClose={() => setIsCustomTimeOpen(false)}
        currentFocusSeconds={settings.pomodoroSeconds ?? settings.pomodoroMinutes * 60}
        currentShortBreakSeconds={settings.shortBreakSeconds ?? settings.shortBreakMinutes * 60}
        currentLongBreakSeconds={settings.longBreakSeconds ?? settings.longBreakMinutes * 60}
        presets={presets}
        onApplySeconds={handleApplyPreset}
        onSaveNewPreset={handleSaveNewPreset}
        onDeletePreset={handleDeletePreset}
      />


      <ThemeStyleModal
        isOpen={isThemeStyleOpen}
        onClose={() => setIsThemeStyleOpen(false)}
        currentTheme={theme}
        onSelectTheme={setTheme}
        currentClockStyle={settings.clockStyle || 'ring'}
        onSelectClockStyle={handleSelectClockStyle}
      />
    </div>
  );
}
