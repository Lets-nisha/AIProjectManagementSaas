import { Menu, Search, LogOut } from 'lucide-react';
import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Header = ({ setIsSidebarOpen, activeTab, searchQuery, setSearchQuery }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;

        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            alert("Cannot Logout: " + error.message);
        }
    };

    return (
        <header
            style={{ backgroundColor: '#090d16', borderColor: '#1e293b' }}
            className="h-14 border-b flex items-center justify-between px-4 md:px-6 z-10 text-slate-100 shrink-0 w-full"
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center space-x-2">
                    <h1 className="font-bold text-sm md:text-base text-slate-100 capitalize tracking-wide">
                        {activeTab}
                    </h1>

                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
                <div className="relative hidden sm:block">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery || ""}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search tasks..."
                        style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                        className="text-xs text-slate-200 border rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-indigo-500 w-36 md:w-48 placeholder-slate-500"
                    />
                </div>

                <button
                    onClick={handleLogout}
                    style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                    className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border rounded-md text-xs font-medium transition duration-200 cursor-pointer"
                >
                    <LogOut size={14} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;