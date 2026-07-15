import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

const PromptBox = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    toast.info("AI is planning your tasks... 🧠");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || ""
            }`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "Kanban Board AI"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free",
          messages: [
            {
              role: "system",
              content: `You are an expert project manager. Your job is to break down the user's project request into actionable, clear, and distinct tasks. 
              
              CRITICAL INSTRUCTION: You must respond ONLY with a valid JSON array of objects. Do not write any conversational text, explanations, or markdown blocks (like \`\`\`json). Just return the raw JSON array.
              
              Each object in the array MUST have this exact structure:
              {
                  "title": "Task name/action",
                  "assignee": "Optional team member name, or leave empty \"\""
              }`
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      let rawContent = data.choices[0].message.content.trim();

      if (rawContent.startsWith("```")) {
        rawContent = rawContent.replace(/^```json|```$/g, "").trim();
      }

      const generatedTasks = JSON.parse(rawContent);

      if (Array.isArray(generatedTasks)) {
        onGenerate(generatedTasks);
        setPrompt('');
        toast.success("✨ Project Plan successfully generated!");
      } else {
        throw new Error("Response was not a valid array");
      }

    } catch (error) {
      console.error("OpenRouter API Error:", error);
      toast.error("Oops! AI couldn't generate tasks. Please try again.");
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
        Write your project idea in Hinglish, Hindi, or English. The AI will automatically create tasks and a timeline for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Write your project idea here..."
          disabled={loading}
          className="w-full h-28 bg-slate-950 text-slate-100 rounded-lg p-4 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600 resize-none text-sm leading-relaxed"
        />

        <div className="flex justify-end">
          <button

            type="submit"
            disabled={loading || !prompt.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 active:scale-95"
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
}

export default PromptBox