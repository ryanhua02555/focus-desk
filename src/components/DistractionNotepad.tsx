import React, { useState } from 'react';
import { DistractionNote } from '../types/pomodoro';
import { Plus, Check, Trash2, Lightbulb, Clock, CheckCircle2 } from 'lucide-react';

interface DistractionNotepadProps {
  notes: DistractionNote[];
  onAddNote: (content: string) => void;
  onToggleNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onClearHandled: () => void;
}

export const DistractionNotepad: React.FC<DistractionNotepadProps> = ({
  notes,
  onAddNote,
  onToggleNote,
  onDeleteNote,
  onClearHandled,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onAddNote(inputValue.trim());
    setInputValue('');
  };

  const pendingNotes = notes.filter(n => !n.isHandled);
  const handledNotes = notes.filter(n => n.isHandled);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Intro Header */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">閃念速記箱 (Distraction Park)</h2>
            <p className="text-sm text-neutral-400 mt-1 leading-relaxed">
              讀書時腦海突然浮現雜念（如「等下要寄信」、「突然想查某個東西」）？<br />
              <strong className="text-amber-300 font-medium">不要立刻打斷讀書去處理</strong>。先快速寫在這裡，把大腦記憶體清空，等番茄鐘進入休息時再處理。
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="紀錄突發雜念、臨時想法或待辦事項（按 Enter 立即存檔）..."
            className="flex-1 px-4 py-3 bg-neutral-950 border border-neutral-800 focus:border-amber-500/50 rounded-xl text-neutral-100 text-sm placeholder:text-neutral-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 font-medium text-sm rounded-xl transition-colors flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>暫存想法</span>
          </button>
        </form>
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending notes */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h3 className="font-medium text-sm text-neutral-200">待休息時處理</h3>
              <span className="text-xs text-neutral-500">· {pendingNotes.length} 項</span>
            </div>
          </div>

          {pendingNotes.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-sm">
              <p>目前沒有暫存的雜念</p>
              <p className="text-xs text-neutral-600 mt-1">讀書心流很純淨，保持專注！</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingNotes.map(note => (
                <div
                  key={note.id}
                  className="p-3 bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 rounded-xl flex items-start justify-between gap-3 group transition-colors"
                >
                  <button
                    onClick={() => onToggleNote(note.id)}
                    className="w-5 h-5 mt-0.5 rounded-md border border-neutral-700 hover:border-amber-400 flex items-center justify-center shrink-0 transition-colors"
                    title="標記為已處理"
                  >
                    <Check className="w-3.5 h-3.5 text-transparent group-hover:text-amber-400/50" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-200 break-words">{note.content}</p>
                    <span className="text-[11px] text-neutral-500 block mt-1">
                      {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="刪除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Handled notes */}
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="font-medium text-sm text-neutral-200">已處理完畢</h3>
              <span className="text-xs text-neutral-500">· {handledNotes.length} 項</span>
            </div>
            {handledNotes.length > 0 && (
              <button
                onClick={onClearHandled}
                className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                清除已處理
              </button>
            )}
          </div>

          {handledNotes.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-sm">
              <p>尚無已處理項目</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {handledNotes.map(note => (
                <div
                  key={note.id}
                  className="p-3 bg-neutral-900/40 border border-neutral-800/50 rounded-xl flex items-start justify-between gap-3 group opacity-75"
                >
                  <button
                    onClick={() => onToggleNote(note.id)}
                    className="w-5 h-5 mt-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0"
                    title="取消完成"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-400 line-through break-words">{note.content}</p>
                  </div>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="刪除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
