import { Menu } from 'lucide-react'
import React from 'react'
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Header = ({ setIsSidebarOpen, activeTab }) => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
            alert("Are You Sure Logout")
        } catch (error) {
            alert("can not Logout :", error);
        }
    };

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



            <button
                onClick={handleLogout}
                className="flex items-center gap-2  p-2   hover:bg-slate-100 text-blue-400    rounded-lg  font-semibold transition duration-200"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
            </button>
        </header>
    )
}

export default Header