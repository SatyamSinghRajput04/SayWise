import React, { useEffect, useState } from 'react';
import { X, Clock, ChevronRight, Calendar } from 'lucide-react';
import { EvaluationResult } from '../../types/index.js';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.js';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvaluation: (evaluation: EvaluationResult) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectEvaluation,
}) => {
  const { token } = useAuth();
  const [history, setHistory] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    api.getEvaluationHistory(token || undefined)
      .then((data) => setHistory(data))
      .catch((err) => console.error('Failed to fetch history:', err))
      .finally(() => setLoading(false));
  }, [isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-extrabold text-slate-900 font-display">
              Practice History
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5 my-2">
          {loading ? (
            <div className="py-8 text-center text-xs font-semibold text-slate-400">
              Loading past attempts...
            </div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="text-3xl">🎙️</div>
              <p className="text-xs font-semibold text-slate-500">No evaluations yet.</p>
              <p className="text-[11px] text-slate-400">Complete your first speaking practice today!</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectEvaluation(item);
                  onClose();
                }}
                className="w-full bg-slate-50 hover:bg-purple-50/60 rounded-2xl p-3.5 border border-slate-100 hover:border-purple-200 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-extrabold">
                      {item.scores.overall}/100 ({item.scores.cefrLevel})
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-purple-700 transition-colors line-clamp-1">
                    {item.topicTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                    "{item.transcript}"
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 transition-colors" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
