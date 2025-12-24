
import React, { useState } from 'react';
import { Question, UserAttempt } from '../types';

interface QuizProps {
  questions: Question[];
  onComplete: (history: UserAttempt[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<UserAttempt[]>([]);
  const [selection, setSelection] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const current = questions[index];
  const isFinal = index === questions.length - 1;

  const handleConfirm = () => {
    if (!selection) return;

    const correct = selection === current.correctAnswer;
    const duration = Math.floor((Date.now() - startTime) / 1000);

    const record: UserAttempt = {
      questionId: current.id,
      selectedAnswer: selection,
      isCorrect: correct,
      responseTime: duration,
      difficulty: current.difficulty,
      timestamp: Date.now()
    };

    setHistory([...history, record]);
    setConfirmed(true);
  };

  const handleNext = () => {
    if (isFinal) {
      onComplete(history);
    } else {
      setIndex(index + 1);
      setSelection('');
      setConfirmed(false);
      setStartTime(Date.now());
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-10 flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Knowledge Progress</p>
          <div className="w-56 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-slate-900 transition-all duration-1000"
              style={{ width: `${((index + (confirmed ? 1 : 0)) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="px-5 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-xs font-black text-slate-500 capitalize tracking-widest">
          {current.difficulty}
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-50 relative">
        <div className="p-12">
          <span className="inline-block px-4 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            {current.topic}
          </span>
          <h2 className="text-3xl font-black text-slate-900 leading-[1.2] mb-12">
            {current.text}
          </h2>

          <div className="space-y-4">
            {current.options.map((opt, i) => (
              <button
                key={i}
                disabled={confirmed}
                onClick={() => setSelection(opt)}
                className={`w-full text-left p-6 rounded-[1.5rem] border-2 transition-all flex items-center justify-between group ${
                  selection === opt 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-2xl scale-[1.02]' 
                    : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 text-slate-700'
                } ${
                  confirmed && opt === current.correctAnswer 
                    ? '!border-emerald-500 !bg-emerald-50 !text-emerald-900 shadow-none scale-100' 
                    : ''
                } ${
                  confirmed && selection === opt && opt !== current.correctAnswer 
                    ? '!border-rose-500 !bg-rose-50 !text-rose-900 shadow-none scale-100' 
                    : ''
                }`}
              >
                <span className="font-bold text-lg">{opt}</span>
                {confirmed && opt === current.correctAnswer && <i className="fas fa-check-circle text-emerald-600 text-xl"></i>}
                {confirmed && selection === opt && opt !== current.correctAnswer && <i className="fas fa-times-circle text-rose-600 text-xl"></i>}
              </button>
            ))}
          </div>
        </div>

        {confirmed && (
          <div className="px-12 py-10 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-bottom-4 duration-500">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Detailed Explanation</h4>
            <p className="text-slate-600 leading-relaxed font-medium text-lg mb-8 italic">
              "{current.explanation}"
            </p>
            <button
              onClick={handleNext}
              className={`w-full py-5 rounded-2xl font-black text-white transition-all shadow-xl ${
                isFinal ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {isFinal ? 'Finalize & View Analysis' : 'Next Question'}
            </button>
          </div>
        )}

        {!confirmed && (
          <div className="px-12 py-10 bg-slate-50 border-t border-slate-100 flex justify-center">
            <button
              onClick={handleConfirm}
              disabled={!selection}
              className="px-16 py-5 rounded-2xl font-black text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 transition-all shadow-2xl active:scale-95 text-lg"
            >
              Confirm Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
