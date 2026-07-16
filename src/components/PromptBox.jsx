import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

const PromptBox = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      await onGenerate(prompt.trim());
      setPrompt('');
    } catch (error) {
      console.error("AI execution failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-800 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="text-indigo-400" size={20} />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">AI Project Planner</h2>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        Write your project idea in Hinglish, Hindi, or English. The AI will automatically create tasks for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your project idea here... (e.g., Build a simple login page using React)"
          disabled={loading}
          className="w-full h-28 bg-slate-950 text-slate-100 rounded-lg p-4 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600 resize-none text-sm leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate Project Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptBox;