import React, { useState } from 'react';
import { SessionRecord, Task, SubjectTag } from '../types/pomodoro';
import { Flame, Clock, Award, BarChart3, Calendar, Download, Copy, Check, Trash2 } from 'lucide-react';

interface StudyStatsProps {
  sessions: SessionRecord[];
  tasks: Task[];
  onClearHistory: () => void;
}

export const StudyStats: React.FC<StudyStatsProps> = ({ sessions, tasks, onClearHistory }) => {
  const [copied, setCopied] = useState(false);

  // Helper calculations
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime();

  const todaySessions = sessions.filter(s => s.timestamp >= startOfToday && s.mode === 'pomodoro');
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const todayTomatoes = todaySessions.length;

  const totalMinutes = sessions.filter(s => s.mode === 'pomodoro').reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalTomatoes = sessions.filter(s => s.mode === 'pomodoro').length;

  // Streak calculation (days with at least 1 session)
  const sessionDays = new Set(
    sessions
      .filter(s => s.mode === 'pomodoro')
      .map(s => {
        const d = new Date(s.timestamp);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      })
  );

  let streak = 0;
  const checkDate = new Date();
  while (true) {
    const key = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
    if (sessionDays.has(key)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // If today has no sessions yet, check yesterday
      if (streak === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
        const yKey = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
        if (sessionDays.has(yKey)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
      }
      break;
    }
  }

  // 7-day focus chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 3600 * 1000;

    const dayMins = sessions
      .filter(s => s.mode === 'pomodoro' && s.timestamp >= dayStart && s.timestamp < dayEnd)
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    const weekdayNames = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const isToday = i === 6;

    return {
      label: weekdayNames[d.getDay()],
      dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
      minutes: dayMins,
      isToday,
    };
  });

  const maxChartMin = Math.max(...last7Days.map(d => d.minutes), 120);

  // Subject distribution
  const subjectMap: Record<string, number> = {};
  sessions
    .filter(s => s.mode === 'pomodoro' && s.subject)
    .forEach(s => {
      const sub = s.subject || '其他';
      subjectMap[sub] = (subjectMap[sub] || 0) + s.durationMinutes;
    });

  const subjectList = Object.entries(subjectMap).sort((a, b) => b[1] - a[1]);

  // 30-day heatmap grid
  const heatmapDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 3600 * 1000;

    const dayMins = sessions
      .filter(s => s.mode === 'pomodoro' && s.timestamp >= dayStart && s.timestamp < dayEnd)
      .reduce((acc, s) => acc + s.durationMinutes, 0);

    return {
      date: `${d.getMonth() + 1}月${d.getDate()}日`,
      minutes: dayMins,
    };
  });

  const getHeatmapColor = (minutes: number) => {
    if (minutes === 0) return 'bg-neutral-800/60';
    if (minutes < 30) return 'bg-amber-900/60 border border-amber-700/40';
    if (minutes < 60) return 'bg-amber-600/70 border border-amber-500/50';
    if (minutes < 120) return 'bg-amber-500 border border-amber-400';
    return 'bg-amber-400 text-neutral-950 font-bold';
  };

  const handleCopySummary = () => {
    const text = `📚 墨讀 FocusDesk · 今日讀書打卡總結
📅 日期：${new Date().toLocaleDateString()}
⏱️ 今日專注時長：${Math.floor(todayMinutes / 60)} 小時 ${todayMinutes % 60} 分鐘
🍅 今日收穫番茄：${todayTomatoes} 個
🔥 連續學習天數：${streak} 天
🎯 已完成學習目標：${tasks.filter(t => t.isCompleted).map(t => t.title).join('、') || '持續推進中'}

「心流不息，積微成著。」`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const data = {
      exportTime: new Date().toISOString(),
      stats: {
        totalMinutes,
        totalTomatoes,
        streak,
      },
      tasks,
      sessions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `focusdesk-study-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 4 Primary KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Today Focus */}
        <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>今日專注</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-100">
            {Math.floor(todayMinutes / 60)}<span className="text-sm font-sans font-normal text-neutral-400 ml-1">時</span> {todayMinutes % 60}<span className="text-sm font-sans font-normal text-neutral-400 ml-0.5">分</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            約 {todayTomatoes} 個番茄鐘
          </div>
        </div>

        {/* Tomatoes */}
        <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
            <span className="text-base">🍅</span>
            <span>今日收穫</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-100">
            {todayTomatoes} <span className="text-sm font-sans font-normal text-neutral-400">顆</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            歷史累計 {totalTomatoes} 顆
          </div>
        </div>

        {/* Streak */}
        <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>連續專注</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-100">
            {streak} <span className="text-sm font-sans font-normal text-neutral-400">天</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            保持學術心流
          </div>
        </div>

        {/* Total Time */}
        <div className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>累計總專注</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-neutral-100">
            {(totalMinutes / 60).toFixed(1)} <span className="text-sm font-sans font-normal text-neutral-400">小時</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            共 {sessions.length} 次學習時鐘
          </div>
        </div>
      </div>

      {/* 7-day Bar Chart */}
      <div className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-neutral-100">近 7 日每日專注時長 (分鐘)</h3>
          </div>
          <div className="text-xs text-neutral-400">
            本週最高單日：<span className="font-mono text-amber-300 font-semibold">{Math.max(...last7Days.map(d => d.minutes))} 分鐘</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 items-end h-44 pt-4 border-b border-neutral-800">
          {last7Days.map((day, idx) => {
            const heightPercent = maxChartMin > 0 ? (day.minutes / maxChartMin) * 100 : 0;
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-mono text-neutral-400 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.minutes}m
                </div>
                <div className="w-full max-w-[42px] bg-neutral-800/80 rounded-t-lg relative flex items-end overflow-hidden h-32">
                  <div
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      day.isToday
                        ? 'bg-amber-400 shadow-lg shadow-amber-500/20'
                        : day.minutes > 0
                        ? 'bg-amber-600/60 hover:bg-amber-500/80'
                        : 'bg-neutral-800'
                    }`}
                  />
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-xs font-medium ${day.isToday ? 'text-amber-400 font-semibold' : 'text-neutral-400'}`}>
                    {day.label}
                  </div>
                  <div className="text-[10px] text-neutral-600 font-mono">
                    {day.dateStr}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Distribution & 30-Day Heatmap row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Breakdown */}
        <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
          <h3 className="text-sm font-semibold text-neutral-100 mb-4">科目學習時間分佈</h3>
          {subjectList.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              尚無各科目時鐘記錄，請在計時器連結任務！
            </div>
          ) : (
            <div className="space-y-3">
              {subjectList.map(([subject, mins]) => {
                const percent = totalMinutes > 0 ? Math.round((mins / totalMinutes) * 100) : 0;
                return (
                  <div key={subject} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-300 font-medium">{subject}</span>
                      <span className="font-mono text-neutral-400 tabular-nums">
                        {mins} 分鐘 · {percent}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 30-Day Heatmap */}
        <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-100">近 30 日專注熱力圖</h3>
            <div className="flex items-center gap-1.5 text-[10px] text-neutral-400">
              <span>少</span>
              <span className="w-2.5 h-2.5 rounded-sm bg-neutral-800" />
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-900/70" />
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-600" />
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              <span>多</span>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 pt-2">
            {heatmapDays.map((d, i) => (
              <div
                key={i}
                className={`h-7 rounded-md flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-110 ${getHeatmapColor(
                  d.minutes
                )}`}
                title={`${d.date}：專注 ${d.minutes} 分鐘`}
              >
                <span className="text-[9px] font-mono leading-none text-neutral-300">
                  {d.minutes > 0 ? `${d.minutes}m` : ''}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-neutral-500 mt-4 text-center">
            綠蔭成林，日積月累。將鼠標懸停小方塊即可檢視該日專注時長。
          </p>
        </div>
      </div>

      {/* Session History Log Table */}
      <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-neutral-100">近期專注流水記錄</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已複製打卡' : '複製今日總結'}</span>
            </button>
            <button
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出 JSON</span>
            </button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            尚未有專注紀錄，完成第一個番茄鐘後會在此呈現！
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500 font-medium">
                  <th className="py-2.5 px-3">時間</th>
                  <th className="py-2.5 px-3">類別</th>
                  <th className="py-2.5 px-3">關聯學習任務</th>
                  <th className="py-2.5 px-3">科目</th>
                  <th className="py-2.5 px-3 text-right">時長</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono tabular-nums">
                {sessions.slice(0, 10).map(s => {
                  const d = new Date(s.timestamp);
                  const timeStr = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(
                    d.getMinutes()
                  ).padStart(2, '0')}`;
                  return (
                    <tr key={s.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-2.5 px-3 text-neutral-400">{timeStr}</td>
                      <td className="py-2.5 px-3 font-sans">
                        <span className={s.mode === 'pomodoro' ? 'text-amber-400' : 'text-sky-400'}>
                          {s.mode === 'pomodoro' ? '🍅 專注' : '☕ 休息'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-200 font-sans truncate max-w-[200px]">
                        {s.taskTitle || '自由深度專注'}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-400 font-sans">
                        {s.subject || '一般'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-neutral-100">
                        {s.durationMinutes} min
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
