import React, { useState } from 'react';
import { Sparkles, Loader2, Plus, ArrowUp } from 'lucide-react';

const PromptBox = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      await onGenerate(prompt.trim());
    } catch (error) {
      console.error("AI execution failed:", error);
    } finally {
      setLoading(false);
    }
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center bg-slate-900 border border-slate-800 hover:border-slate-700 focus-within:border-indigo-500/80 rounded-full px-4 py-2.5 shadow-xl transition-all duration-200">

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder=" AI Project Planner..."
          disabled={loading}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm px-3 focus:outline-none disabled:opacity-50"
        />

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white transition-all shadow-md active:scale-95 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <ArrowUp size={16} />
            )}
          </button>
        </div>

      </div>
    </form>
  );
};

export default PromptBox;