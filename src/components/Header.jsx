import { Menu } from 'lucide-react'
import React from 'react'

const Header = ({ setIsSidebarOpen, activeTab }) => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10">
            <div className="flex items-center gap-3">

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
    )
}

export default Header