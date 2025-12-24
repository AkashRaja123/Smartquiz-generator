
import React, { useState } from 'react';
import { StudyMaterial, Difficulty, QuizConfig } from '../types';

interface SetupProps {
  onInitialize: (material: StudyMaterial, config: QuizConfig) => void;
  isGenerating: boolean;
}

const Setup: React.FC<SetupProps> = ({ onInitialize, isGenerating }) => {
  const [content, setContent] = useState('');
  const [fileData, setFileData] = useState<{ name: string, data: string, mimeType: string } | null>(null);
  const [questionCount, setQuestionCount] = useState(10);
  const [baseLevel, setBaseLevel] = useState<Difficulty>(Difficulty.MEDIUM);

  const processFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (file.type === 'application/pdf') {
        // Extract text from PDF
        const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
        GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        setContent(text);
        setFileData(null);
      } else {
        const text = await file.text();
        setContent(text);
        setFileData(null);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing the file. Please try a different file or paste the content as text.');
    }
  };

  const startSession = () => {
    if (!content && !fileData) {
      alert("Please upload or paste your study material.");
      return;
    }
    const material = fileData 
      ? { file: { data: fileData.data, mimeType: fileData.mimeType } }
      : { text: content };
    
    onInitialize(material, { count: questionCount, initialDifficulty: baseLevel });
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Initialize Assessment</h1>
        <p className="text-slate-500 mt-2 font-medium">Specify your parameters and provide source material</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
              <i className="fas fa-file-import text-slate-300"></i>
              Knowledge Source
            </h3>
            
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={processFile}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
                  fileData ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-300 bg-slate-50/50'
                }`}>
                  <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    fileData ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm'
                  }`}>
                    <i className={`fas ${fileData ? 'fa-check' : 'fa-upload'}`}></i>
                  </div>
                  <p className="font-bold text-slate-700">
                    {fileData ? fileData.name : "Upload Study PDF or Text"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Supports PDF up to 20MB</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center"><span className="px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">Alternatively</span></div>
              </div>

              <textarea
                value={content}
                onChange={(e) => { setContent(e.target.value); setFileData(null); }}
                placeholder="Paste your study notes or article content here..."
                className="w-full h-48 p-6 rounded-3xl border border-slate-100 bg-slate-50/30 focus:bg-white focus:ring-4 focus:ring-slate-900/5 outline-none transition-all resize-none font-medium text-slate-600"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50">
            <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-3">
              <i className="fas fa-sliders-h text-slate-300"></i>
              Parameters
            </h3>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Total Questions</label>
                <div className="grid grid-cols-2 gap-3">
                  {[5, 10, 15, 20].map(val => (
                    <button
                      key={val}
                      onClick={() => setQuestionCount(val)}
                      className={`py-3 rounded-2xl font-bold transition-all border ${
                        questionCount === val ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Complexity Level</label>
                <div className="space-y-2">
                  {Object.values(Difficulty).map(level => (
                    <button
                      key={level}
                      onClick={() => setBaseLevel(level)}
                      className={`w-full py-4 rounded-2xl font-bold capitalize transition-all border flex items-center justify-between px-6 ${
                        baseLevel === level ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
                      }`}
                    >
                      {level}
                      {baseLevel === level && <i className="fas fa-dot-circle text-[10px]"></i>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={startSession}
            disabled={isGenerating || (!content && !fileData)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 text-white py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 active:scale-95"
          >
            {isGenerating ? (
              <><i className="fas fa-sync fa-spin"></i> Generating...</>
            ) : (
              <><i className="fas fa-bolt"></i> Begin Assessment</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setup;
