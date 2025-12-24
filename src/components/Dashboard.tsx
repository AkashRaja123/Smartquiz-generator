
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { UserAttempt, Question, Difficulty } from '../types';

interface DashboardProps {
  attempts: UserAttempt[];
  questions: Question[];
  onRestart: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ attempts, questions, onRestart }) => {
  const correctCount = attempts.filter(a => a.isCorrect).length;
  const accuracy = (correctCount / attempts.length) * 100;
  
  const avgPace = attempts.reduce((sum, a) => sum + a.responseTime, 0) / attempts.length;

  const topicBreakdown = attempts.reduce((acc, curr) => {
    const q = questions.find(q => q.id === curr.questionId);
    if (!q) return acc;
    if (!acc[q.topic]) acc[q.topic] = { total: 0, correct: 0, avgTime: 0 };
    acc[q.topic].total += 1;
    acc[q.topic].avgTime += curr.responseTime;
    if (curr.isCorrect) acc[q.topic].correct += 1;
    return acc;
  }, {} as Record<string, { total: number; correct: number; avgTime: number }>);

  Object.keys(topicBreakdown).forEach(topic => {
    topicBreakdown[topic].avgTime /= topicBreakdown[topic].total;
  });

  const difficultyBreakdown = attempts.reduce((acc, curr) => {
    const q = questions.find(q => q.id === curr.questionId);
    if (!q) return acc;
    if (!acc[q.difficulty]) acc[q.difficulty] = { total: 0, correct: 0 };
    acc[q.difficulty].total += 1;
    if (curr.isCorrect) acc[q.difficulty].correct += 1;
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  const weakTopics = Object.entries(topicBreakdown)
    .filter(([_, stats]) => (stats.correct / stats.total) < 0.7)
    .map(([topic]) => topic);

  const timeAnalysis = {
    fast: attempts.filter(a => a.responseTime < avgPace * 0.8).length,
    slow: attempts.filter(a => a.responseTime > avgPace * 1.2).length,
    optimal: attempts.filter(a => a.responseTime >= avgPace * 0.8 && a.responseTime <= avgPace * 1.2).length
  };

  const pieData = [
    { name: 'Correct', value: correctCount, color: '#10b981' },
    { name: 'Incorrect', value: attempts.length - correctCount, color: '#f43f5e' }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row items-end justify-between gap-10 border-b border-slate-100 pb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Performance Summary</h2>
          <p className="text-slate-500 mt-4 text-lg font-medium">Empirical analysis of your conceptual retention and speed</p>
        </div>
        <button 
          onClick={onRestart}
          className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black transition-all shadow-2xl hover:bg-slate-800 flex items-center gap-4 active:scale-95 whitespace-nowrap"
        >
          <i className="fas fa-plus"></i> Initialize New Module
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Retention Rate', val: `${Math.round(accuracy)}%`, sub: 'Above average', color: 'text-indigo-600' },
          { label: 'Correct Responses', val: `${correctCount}/${attempts.length}`, sub: 'Raw metric', color: 'text-emerald-600' },
          { label: 'Avg Pace', val: `${avgPace.toFixed(1)}s`, sub: 'Per interaction', color: 'text-amber-600' },
          { label: 'Final Standing', val: accuracy > 85 ? 'Expert' : accuracy > 60 ? 'Skilled' : 'Emerging', sub: 'Adaptive rank', color: 'text-slate-900' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">{item.label}</p>
            <p className={`text-4xl font-black ${item.color} tracking-tighter`}>{item.val}</p>
            <p className="text-[10px] font-bold text-slate-300 uppercase mt-4">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-50">
        <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><i className="fas fa-chart-line text-indigo-500 text-sm"></i></div>
          Quiz Results Summary
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center py-4 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Total Questions</span>
            <span className="text-slate-900 font-black text-xl">{attempts.length}</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Correct Answers</span>
            <span className="text-emerald-600 font-black text-xl">{correctCount}</span>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-slate-100">
            <span className="text-slate-600 font-medium">Accuracy Rate</span>
            <span className="text-indigo-600 font-black text-xl">{Math.round(accuracy)}%</span>
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="text-slate-600 font-medium">Average Response Time</span>
            <span className="text-amber-600 font-black text-xl">{avgPace.toFixed(1)}s</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-50">
        <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><i className="fas fa-chart-pie text-emerald-500 text-sm"></i></div>
          Answer Distribution
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '25px', border: 'none', boxShadow: '0 25px 30px -5px rgb(0 0 0 / 0.1)', padding: '20px' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-50">
        <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><i className="fas fa-analytics text-purple-500 text-sm"></i></div>
          Advanced Performance Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-bold text-slate-700 mb-4">Topic Performance</h4>
            <div className="space-y-3">
              {Object.entries(topicBreakdown).map(([topic, stats]) => (
                <div key={topic} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">{topic}</span>
                  <div className="text-right">
                    <span className="text-slate-900 font-black">{stats.correct}/{stats.total}</span>
                    <span className="text-slate-400 text-sm ml-2">({Math.round((stats.correct / stats.total) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-700 mb-4">Difficulty Analysis</h4>
            <div className="space-y-3">
              {Object.entries(difficultyBreakdown).map(([difficulty, stats]) => (
                <div key={difficulty} className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-600 font-medium capitalize">{difficulty.toLowerCase()}</span>
                  <div className="text-right">
                    <span className="text-slate-900 font-black">{stats.correct}/{stats.total}</span>
                    <span className="text-slate-400 text-sm ml-2">({Math.round((stats.correct / stats.total) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h4 className="text-lg font-bold text-slate-700 mb-4">Response Time Distribution</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black text-green-600">{timeAnalysis.fast}</p>
              <p className="text-sm text-green-700 font-medium">Fast Responses</p>
              <p className="text-xs text-green-500">Under {Math.round(avgPace * 0.8)}s</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black text-blue-600">{timeAnalysis.optimal}</p>
              <p className="text-sm text-blue-700 font-medium">Optimal Pace</p>
              <p className="text-xs text-blue-500">{Math.round(avgPace * 0.8)}-{Math.round(avgPace * 1.2)}s</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black text-orange-600">{timeAnalysis.slow}</p>
              <p className="text-sm text-orange-700 font-medium">Slow Responses</p>
              <p className="text-xs text-orange-500">Over {Math.round(avgPace * 1.2)}s</p>
            </div>
          </div>
        </div>
        {weakTopics.length > 0 && (
          <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-200">
            <h4 className="text-lg font-bold text-amber-800 mb-2">Areas for Improvement</h4>
            <p className="text-amber-700">
              Focus on these topics: <span className="font-semibold">{weakTopics.join(', ')}</span>
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
