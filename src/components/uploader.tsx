
import React, { useState } from 'react';
import { StudyMaterial } from '../types';

interface UploaderProps {
  onProcess: (material: StudyMaterial) => void;
  isLoading: boolean;
}

const Uploader: React.FC<UploaderProps> = ({ onProcess, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string, data: string, mimeType: string } | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'text/plain' || file.name.endsWith('.md')) {
      const text = await file.text();
      setInputText(text);
      setSelectedFile(null); // Clear file data to favor text processing
    } else if (file.type === 'application/pdf') {
      const base64 = await fileToBase64(file);
      setSelectedFile({
        name: file.name,
        data: base64,
        mimeType: file.type
      });
      setInputText(''); // Clear text to favor document processing
    } else {
      alert("Unsupported file type. Please use .txt, .pdf, or .md");
    }
  };

  const handleSubmit = () => {
    if (!inputText && !selectedFile) {
      alert("Please provide study material (text or file).");
      return;
    }

    if (selectedFile) {
      onProcess({ file: { data: selectedFile.data, mimeType: selectedFile.mimeType } });
    } else {
      onProcess({ text: inputText });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-slate-100">
      <div className="text-center mb-8">
        <div className="bg-indigo-100 text-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-file-medical text-2xl"></i>
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Source Material</h2>
        <p className="text-slate-500 mt-2">Upload PDFs, Notes, or Markdown to start your adaptive journey.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Document</label>
          <div className="relative group">
            <input
              type="file"
              accept=".txt,.pdf,.md"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center ${
              selectedFile ? 'border-green-400 bg-green-50' : 'border-slate-200 group-hover:border-indigo-400 group-hover:bg-indigo-50'
            }`}>
              <i className={`fas ${selectedFile ? 'fa-file-pdf text-red-500' : 'fa-cloud-upload-alt text-slate-400 group-hover:text-indigo-500'} text-2xl mb-2`}></i>
              <span className={`font-medium ${selectedFile ? 'text-green-700' : 'text-slate-600'}`}>
                {selectedFile ? selectedFile.name : "Drop PDF, TXT or MD here"}
              </span>
              {selectedFile && <span className="text-xs text-green-600 mt-1">Ready for AI analysis</span>}
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center uppercase font-bold tracking-widest">Supports PDF (up to 20MB), TXT, and Markdown</p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-400 uppercase font-bold tracking-wider">OR PASTE TEXT</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Manual Notes</label>
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setSelectedFile(null); // Prioritize text if user starts typing
            }}
            placeholder="Paste your study materials here..."
            className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none font-sans text-slate-700 shadow-inner bg-slate-50"
          ></textarea>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || (!inputText && !selectedFile)}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
            isLoading || (!inputText && !selectedFile) 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Extracting Knowledge...
            </>
          ) : (
            <>
              <i className="fas fa-bolt"></i>
              Start Adaptive Quiz
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Uploader;
