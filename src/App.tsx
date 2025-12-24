import React, { useState } from 'react';
import Auth from './components/Auth';
import Setup from './components/Setup';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import { generateAssessment } from './geminiService';
import { Question, UserAttempt, StudyMaterial, QuizConfig, UserAccount } from './types';

enum ViewState {
  IDENTIFY,
  CONFIGURE,
  ASSESS,
  ANALYZE
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.IDENTIFY);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [items, setItems] = useState<Question[]>([]);
  const [results, setResults] = useState<UserAttempt[]>([]);

  const onLogin = (account: UserAccount) => {
    setCurrentUser(account);
    setView(ViewState.CONFIGURE);
  };

  const onInitialize = async (material: StudyMaterial, config: QuizConfig) => {
    setIsAnalyzing(true);
    try {
      const questions = await generateAssessment(material, config.count, config.initialDifficulty);
      if (questions && questions.length > 0) {
        setItems(questions);
        setView(ViewState.ASSESS);
      } else {
        alert("Extraction failed. Please ensure the content is substantial.");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "System error. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onComplete = (history: UserAttempt[]) => {
    setResults(history);
    setView(ViewState.ANALYZE);
  };

  const onRestart = () => {
    setView(ViewState.CONFIGURE);
    setItems([]);
    setResults([]);
  };

  const onExit = () => {
    setCurrentUser(null);
    setView(ViewState.IDENTIFY);
    onRestart();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 antialiased">
      <header className="py-8 px-12 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-2xl z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl">
            <i className="fas fa-microchip text-white text-xl"></i>
          </div>
          <div className="leading-none">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              SMART<span className="text-indigo-600">QUIZZER</span>
            </span>
            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mt-1">Adaptive Intelligence</p>
          </div>
        </div>
        
        {currentUser && (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 pr-8 border-r border-slate-200">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-sm shadow-lg">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left leading-tight">
                <p className="text-sm font-black text-slate-800">{currentUser.name}</p>
                <p className="text-[10px] font-bold text-slate-400">Standard Plan</p>
              </div>
            </div>
            <button 
              onClick={onExit}
              className="text-[10px] font-black text-slate-400 hover:text-rose-600 transition-colors uppercase tracking-[0.2em]"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="container mx-auto mt-12">
        {view === ViewState.IDENTIFY && <Auth onLogin={onLogin} />}
        
        {view === ViewState.CONFIGURE && (
          <Setup onInitialize={onInitialize} isGenerating={isAnalyzing} />
        )}

        {view === ViewState.ASSESS && (
          <Quiz questions={items} onComplete={onComplete} />
        )}

        {view === ViewState.ANALYZE && (
          <Dashboard attempts={results} questions={items} onRestart={onRestart} />
        )}
      </main>
    </div>
  );
};

export default App;
