import React from 'react';
import { LayoutDashboard, Users, Calendar, BarChart3, X } from 'lucide-react';
import Setting from '../pages/SettingsPage';

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
    return (
        <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0 md:z-0
    `}>
            <div>

                <div className="flex items-center justify-between px-2 py-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold text-xl shadow-md shadow-indigo-200">
                            AI
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">AIProject</span>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                    >
                        <X size={20} />
                    </button>
                </div>


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
                                    setIsSidebarOpen(false);
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


            <Setting />
        </aside>
    );
}

export default Sidebar 