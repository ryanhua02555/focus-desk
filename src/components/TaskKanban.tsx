import React, { useState } from 'react';
import { Task, CustomSubject } from '../types/pomodoro';
import { Plus, Check, Trash2, Target, Tags, X, CheckCircle2 } from 'lucide-react';

interface TaskKanbanProps {
  tasks: Task[];
  subjects: CustomSubject[];
  activeTaskId: string | null;
  onSelectActiveTask: (taskId: string | null) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedTomatoes'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTomatoes: (taskId: string, delta: number) => void;
  onAddCustomSubject: (subject: Omit<CustomSubject, 'id'>) => void;
}

const COLOR_OPTIONS = [
  { name: '藍色', value: 'blue', dot: 'bg-blue-400', text: 'text-blue-300' },
  { name: '綠色', value: 'emerald', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  { name: '琥珀', value: 'amber', dot: 'bg-amber-400', text: 'text-amber-300' },
  { name: '玫瑰', value: 'rose', dot: 'bg-rose-400', text: 'text-rose-300' },
  { name: '紫色', value: 'purple', dot: 'bg-purple-400', text: 'text-purple-300' },
  { name: '青色', value: 'cyan', dot: 'bg-cyan-400', text: 'text-cyan-300' },
  { name: '橘色', value: 'orange', dot: 'bg-orange-400', text: 'text-orange-300' },
  { name: '洋紅', value: 'fuchsia', dot: 'bg-fuchsia-400', text: 'text-fuchsia-300' },
  { name: '靛藍', value: 'indigo', dot: 'bg-indigo-400', text: 'text-indigo-300' },
];

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  subjects,
  activeTaskId,
  onSelectActiveTask,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTomatoes,
  onAddCustomSubject,
}) => {
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [isManagingSubjects, setIsManagingSubjects] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<string>(subjects[0]?.name || '數學');
  const [newEstimated, setNewEstimated] = useState(3);
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // New custom subject state
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [customSubjectColor, setCustomSubjectColor] = useState(COLOR_OPTIONS[0]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      subject: newSubject,
      estimatedTomatoes: newEstimated,
      isCompleted: false,
      priority: newPriority,
    });

    setNewTitle('');
    setNewEstimated(3);
    setIsAdding(false);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubjectName.trim()) return;

    onAddCustomSubject({
      name: customSubjectName.trim(),
      color: customSubjectColor.value,
      dotClass: customSubjectColor.dot,
      textClass: customSubjectColor.text,
    });

    setNewSubject(customSubjectName.trim());
    setCustomSubjectName('');
    setIsManagingSubjects(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (filterStatus === 'pending' && t.isCompleted) return false;
    if (filterStatus === 'completed' && !t.isCompleted) return false;
    if (filterSubject !== 'all' && t.subject !== filterSubject) return false;
    return true;
  });

  const totalTomatoesDone = tasks.reduce((acc, t) => acc + t.completedTomatoes, 0);
  const totalTomatoesEst = tasks.reduce((acc, t) => acc + t.estimatedTomatoes, 0);

  const getSubjectStyle = (name: string) => {
    const found = subjects.find(s => s.name === name);
    if (found) {
      return { dot: found.dotClass, text: found.textClass };
    }
    return { dot: 'bg-neutral-400', text: 'text-neutral-300' };
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">讀書任務看板</h2>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
            <span>科目庫：<strong className="text-neutral-200">{subjects.length}</strong> 種</span>
            <span aria-hidden="true">·</span>
            <span>已完成番茄：<strong className="text-amber-400 font-mono">{totalTomatoesDone}</strong> / {totalTomatoesEst} 🍅</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManagingSubjects(!isManagingSubjects)}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Tags className="w-4 h-4 text-amber-400" />
            <span>自訂科目</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>新增讀書任務</span>
          </button>
        </div>
      </div>

      {/* Add Custom Subject Drawer */}
      {isManagingSubjects && (
        <form
          onSubmit={handleCreateSubject}
          className="p-5 bg-neutral-900 border border-amber-500/30 rounded-2xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <Tags className="w-4 h-4 text-amber-400" />
              <span>新增自訂研讀科目標籤</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsManagingSubjects(false)}
              className="text-xs text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                科目名稱
              </label>
              <input
                type="text"
                required
                value={customSubjectName}
                onChange={e => setCustomSubjectName(e.target.value)}
                placeholder="例如：日文檢定 N2、有機化學、經濟學學測..."
                className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                顏色標籤
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCustomSubjectColor(c)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${c.dot} ${
                      customSubjectColor.value === c.value
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {customSubjectColor.value === c.value && <Check className="w-3.5 h-3.5 text-neutral-950 font-bold" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-xl transition-colors"
            >
              確認儲存科目
            </button>
          </div>
        </form>
      )}

      {/* Add Task Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreateTask}
          className="p-5 bg-neutral-900 border border-amber-500/30 rounded-2xl space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-200">建立新讀書科目與進度目標</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-neutral-400 hover:text-neutral-200"
            >
              取消
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">
              任務名稱（具體可執行的學習目標）
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="例如：微積分第五章練習題 1-20、文獻閱讀 Review..."
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-400">科目類別</label>
                <button
                  type="button"
                  onClick={() => setIsManagingSubjects(true)}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  + 新增科目
                </button>
              </div>
              <select
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-amber-500/50"
              >
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                預估番茄數：<span className="text-amber-400 font-mono font-semibold">{newEstimated} 🍅</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={newEstimated}
                onChange={e => setNewEstimated(parseInt(e.target.value))}
                className="w-full accent-amber-500 mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">優先級</label>
              <div className="flex gap-1.5">
                {(['low', 'medium', 'high'] as const).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewPriority(p)}
                    className={`flex-1 py-1.5 text-xs rounded-lg transition-colors capitalize ${
                      newPriority === p
                        ? p === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : p === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-neutral-950 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              確認建立任務
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs & Segmented Control */}
      <div className="flex flex-col gap-3 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Status buttons */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              全部 ({tasks.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'pending'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              進行中 ({tasks.filter(t => !t.isCompleted).length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterStatus === 'completed'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              已完成 ({tasks.filter(t => t.isCompleted).length})
            </button>
          </div>
        </div>

        {/* Subject filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-thin">
          <button
            onClick={() => setFilterSubject('all')}
            className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap ${
              filterSubject === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium'
                : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900/40'
            }`}
          >
            全部科目
          </button>
          {subjects.map(sub => (
            <button
              key={sub.id}
              onClick={() => setFilterSubject(sub.name)}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                filterSubject === sub.name
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900/40'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sub.dotClass}`} />
              <span>{sub.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="py-16 text-center bg-neutral-900/30 border border-neutral-800/80 rounded-2xl">
          <p className="text-sm text-neutral-400">目前沒有符合條件的讀書任務</p>
          <p className="text-xs text-neutral-600 mt-1">點擊上方「新增讀書任務」開始規劃今日學業</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => {
            const isActive = activeTaskId === task.id;
            const subStyle = getSubjectStyle(task.subject);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-neutral-900 border-amber-500/50 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                    : task.isCompleted
                    ? 'bg-neutral-900/30 border-neutral-800/50 opacity-60'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Checkbox + Title + Metadata */}
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                        task.isCompleted
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                          : 'border-neutral-700 hover:border-amber-400 text-transparent'
                      }`}
                      title={task.isCompleted ? '設為未完成' : '標記為已完成'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-sm font-medium break-words ${
                            task.isCompleted ? 'line-through text-neutral-400' : 'text-neutral-100'
                          }`}
                        >
                          {task.title}
                        </h4>
                        {isActive && (
                          <span className="text-[11px] font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            正在專注中
                          </span>
                        )}
                      </div>

                      {/* Quiet metadata line with typographic separators */}
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${subStyle.dot}`} />
                          <span className={subStyle.text}>{task.subject}</span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          優先級：
                          <span className={
                            task.priority === 'high' ? 'text-rose-400' : task.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                          }>
                            {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                          </span>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          進度 {task.completedTomatoes} / {task.estimatedTomatoes} 個番茄
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Tomato counters & Active action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/80 shrink-0">
                    {/* Visual Tomatoes */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateTomatoes(task.id, -1)}
                        disabled={task.completedTomatoes <= 0}
                        className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-300 text-xs flex items-center justify-center transition-colors"
                        title="減少 1 個番茄"
                      >
                        -
                      </button>
                      <div className="flex items-center gap-0.5 px-2 py-1 bg-neutral-950 rounded-lg border border-neutral-800 font-mono text-xs tabular-nums text-neutral-200">
                        <span className="text-amber-400">🍅 {task.completedTomatoes}</span>
                        <span className="text-neutral-500">/{task.estimatedTomatoes}</span>
                      </div>
                      <button
                        onClick={() => onUpdateTomatoes(task.id, 1)}
                        className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center justify-center transition-colors"
                        title="增加 1 個番茄"
                      >
                        +
                      </button>
                    </div>

                    {/* Set Active / Unbind Active */}
                    {!task.isCompleted && (
                      <button
                        onClick={() => onSelectActiveTask(isActive ? null : task.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                          isActive
                            ? 'bg-amber-400 text-neutral-950 shadow-sm'
                            : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                        }`}
                      >
                        <Target className="w-3.5 h-3.5" />
                        <span>{isActive ? '專注中' : '開始此任務'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-800 transition-colors"
                      title="刪除任務"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
