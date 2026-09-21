import React, { useState } from 'react';
import { X, Target, Flame, Trash2, Edit2, Check, BookOpen, Clock } from 'lucide-react';
import { useReader } from '../context/ReaderContext';
import { formatMinutes } from '../data/catalog';

interface DailyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyGoalModal: React.FC<DailyGoalModalProps> = ({ isOpen, onClose }) => {
  const { profile, library, readingLogs, updateProfile, recordReading, updateReadingLog, deleteReadingLog } = useReader();
  const [goalInput, setGoalInput] = useState(String(profile?.dailyGoal || 20));
  const [logPages, setLogPages] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editingPages, setEditingPages] = useState('');

  if (!isOpen || !profile) return null;

  const todayPages = profile.todayPages || 0;
  const dailyGoal = profile.dailyGoal || 20;
  const percentage = Math.min(100, Math.round((todayPages / Math.max(dailyGoal, 1)) * 100));
  const remaining = Math.max(0, dailyGoal - todayPages);
  const activeBooks = library.filter((b) => b.status === 'reading');

  const handleUpdateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal = parseInt(goalInput, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      updateProfile({ dailyGoal: newGoal });
    }
  };

  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(logPages, 10);
    if (!isNaN(p) && p > 0) {
      recordReading(p, selectedBookId || (activeBooks[0]?.id));
      setLogPages('');
    }
  };

  const startEditLog = (id: string, currentPages: number) => {
    setEditingLogId(id);
    setEditingPages(String(currentPages));
  };

  const saveEditLog = (id: string) => {
    const p = parseInt(editingPages, 10);
    if (!isNaN(p) && p >= 0) {
      updateReadingLog(id, p);
    }
    setEditingLogId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Günlük Okuma Hedefi</h2>
              <p className="text-xs text-neutral-400">Hedefini belirle ve okuma geçmişini yönet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Goal Progress Banner */}
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-800/60 border border-neutral-700/60 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs text-neutral-400 font-medium">Bugünkü Durum</span>
                <div className="text-2xl font-bold text-white flex items-baseline gap-1 mt-0.5">
                  <span>{todayPages}</span>
                  <span className="text-sm font-normal text-neutral-400">/ {dailyGoal} sayfa</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl text-sm font-semibold">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{profile.streak} gün seri</span>
              </div>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-neutral-900 rounded-full h-3 overflow-hidden p-0.5 border border-neutral-700/60 mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
              <span>%{percentage} tamamlandı</span>
              <span>
                {todayPages >= dailyGoal ? (
                  <span className="text-emerald-400 font-semibold">Tebrikler, hedef tamamlandı! 🎉</span>
                ) : (
                  <span>{remaining} sayfa kaldı</span>
                )}
              </span>
            </div>
          </div>

          {/* Goal Setting Input */}
          <div className="bg-neutral-800/50 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              Hedefini Değiştir
            </h3>
            <form onSubmit={handleUpdateGoal} className="flex gap-2">
              <input
                type="number"
                min="1"
                max="500"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="Ör. 25"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold rounded-xl text-sm transition-all"
              >
                Güncelle
              </button>
            </form>
          </div>

          {/* Quick Log In Modal */}
          <div className="bg-neutral-800/50 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-neutral-200 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Yeni Okuma Kaydı Ekle
            </h3>
            <form onSubmit={handleAddReading} className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={logPages}
                  onChange={(e) => setLogPages(e.target.value)}
                  placeholder="Okunan sayfa"
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!logPages || parseInt(logPages, 10) <= 0}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-neutral-950 font-semibold rounded-xl text-sm transition-all"
                >
                  Ekle
                </button>
              </div>

              {activeBooks.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <span>Kitap seç:</span>
                  <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 text-neutral-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Otomatik ({activeBooks[0]?.title})</option>
                    {activeBooks.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </form>
          </div>

          {/* Reading Log History */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 mb-2.5 flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-400" />
              Okuma Kayıtları Geçmişi ({readingLogs.length})
            </h3>

            {readingLogs.length === 0 ? (
              <div className="text-center py-6 text-neutral-500 text-xs">Henüz kayıt bulunmuyor.</div>
            ) : (
              <div className="space-y-2">
                {readingLogs.slice(0, 10).map((log) => {
                  const associatedBook = library.find((b) => b.id === log.bookId);
                  const isEditing = editingLogId === log.id;

                  return (
                    <div
                      key={log.id}
                      className="bg-neutral-800/40 border border-neutral-800 rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-amber-400">
                          {log.pages}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-200">
                            {associatedBook ? associatedBook.title : 'Genel Okuma'}
                          </div>
                          <div className="text-neutral-500 text-[11px] flex items-center gap-2">
                            <span>{log.date}</span>
                            {log.minutes > 0 && <span>· {formatMinutes(log.minutes)}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editingPages}
                              onChange={(e) => setEditingPages(e.target.value)}
                              className="w-14 bg-neutral-900 border border-neutral-600 rounded px-1.5 py-0.5 text-xs text-white"
                            />
                            <button
                              onClick={() => saveEditLog(log.id)}
                              className="p-1 text-emerald-400 hover:bg-neutral-800 rounded"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditLog(log.id, log.pages)}
                              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                              title="Düzenle"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteReadingLog(log.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
