import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, BarChart3, Settings, Menu, X } from 'lucide-react';
import PromptBox from './components/PromptBox';
import KanbanBoard from './components/KanbanBoard';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAIQuery = (promptText) => {
    console.log("User Input for AI:", promptText);
    alert(`your prompt here: "${promptText}"`);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">


      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:z-0
      `}>
        <div>
          {/* Logo Section */}
          <div className="flex items-center justify-between px-2 py-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl shadow-md shadow-indigo-200">
                AI
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">AIProject</span>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'boards', label: 'My Boards', icon: BarChart3 },
              { id: 'team', label: 'Team', icon: Users },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false); // Mobile par click karte hi side-bar close ho jaye
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <Icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Settings Button */}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 w-full">
          <Settings size={18} className="text-slate-400" />
          Settings
        </button>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">

        {/* TOP HEADER (Responsive Hamburger Menu Added) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10">
          <div className="flex items-center gap-3">
            {/* Hamburger Button  */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-semibold text-base md:text-lg text-slate-800 capitalize">{activeTab}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs md:text-sm font-medium text-slate-600 hidden sm:inline">Welcome, Developer!</span>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
              D
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
          {activeTab === 'dashboard' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* AI Prompt Component */}
              <PromptBox onGenerate={handleAIQuery} />

              {/* Kanban Board */}
              <KanbanBoard />
            </div>
          )}
          {activeTab !== 'dashboard' && (
            <div className="text-center text-slate-500 mt-12">This section is coming soon...</div>
          )}
        </div>

      </main>

    </div>
  );
}