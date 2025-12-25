
import React, { useState, useEffect } from 'react';
import { GeneratedSolution } from '../types';

interface SavedSolutionsProps {
  userId: string;
}

const SavedSolutions: React.FC<SavedSolutionsProps> = ({ userId }) => {
  const [solutions, setSolutions] = useState<GeneratedSolution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<GeneratedSolution | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`solutions_${userId}`) || '[]');
    setSolutions(data);
  }, [userId]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = solutions.filter(s => s.id !== id);
    setSolutions(filtered);
    localStorage.setItem(`solutions_${userId}`, JSON.stringify(filtered));
    if (selectedSolution?.id === id) setSelectedSolution(null);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
      {/* Sidebar List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-700">Recent Projects</h2>
          <span className="text-xs text-gray-400">{solutions.length} saved</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {solutions.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              No solutions saved yet.
            </div>
          ) : (
            solutions.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSolution(s)}
                className={`p-4 border-b cursor-pointer transition-colors hover:bg-indigo-50/50 ${
                  selectedSolution?.id === s.id ? 'bg-indigo-50 border-r-4 border-r-indigo-600' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{s.title}</h3>
                  <button 
                    onClick={(e) => handleDelete(s.id, e)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(s.timestamp).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 mt-2 line-clamp-2 italic">
                  "{s.challenge}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main View */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
        {selectedSolution ? (
          <div className="p-8 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedSolution.title}</h2>
              <p className="text-sm text-gray-400 mt-1">Architecture details</p>
            </div>

            <div className="space-y-6">
               <div className="bg-amber-50 p-4 rounded border border-amber-100">
                 <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Original Challenge</h4>
                 <p className="text-sm text-amber-900 italic">"{selectedSolution.challenge}"</p>
               </div>

               <div>
                 <h4 className="font-bold text-gray-700 mb-2">Summary</h4>
                 <p className="text-gray-600 leading-relaxed">{selectedSolution.summary}</p>
               </div>

               <div className="grid md:grid-cols-2 gap-6">
                 <div>
                   <h4 className="font-bold text-gray-700 mb-2">GCP Services</h4>
                   <div className="flex flex-wrap gap-2">
                     {selectedSolution.services.map((svc, i) => (
                       <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs border border-indigo-100">
                         {svc}
                       </span>
                     ))}
                   </div>
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-700 mb-2">Best Practices</h4>
                   <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                     {selectedSolution.bestPractices.map((bp, i) => <li key={i}>{bp}</li>)}
                   </ul>
                 </div>
               </div>

               <div className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
                 <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Architecture Manifest</h4>
                 <pre className="text-indigo-300 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                   {selectedSolution.architecture}
                 </pre>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <div className="text-6xl mb-4">📁</div>
            <p>Select a solution from the list to view its architecture details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSolutions;
