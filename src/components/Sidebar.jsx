import React from 'react';
import { LayoutDashboard, Users, Calendar, BarChart3, Settings, X, Sparkles, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'boards', label: 'My Boards', icon: BarChart3 },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
    ];

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 
                flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out text-white
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0 md:z-0
            `}
        >
            <div>
                {/* Brand Logo & Close Button */}
                <div className="flex items-center justify-between px-2 py-3 mb-6 border-b border-slate-800/60 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-500/20">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                                KanbanFlow
                            </span>
                            <span className="block text-[10px] font-mono text-indigo-400 leading-none">Workspace v1.0</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>


        </aside>
    );
};

export default Sidebar;