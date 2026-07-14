import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
            <header className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r      text-white bg-clip-text text-transparent">
                    KanbanFlow
                </h1>
                <Link to="/auth" className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-lg font-medium transition duration-200">
                    Sign in
                </Link>
            </header>

            <main className="container mx-auto px-6 py-12 md:py-20 flex flex-col gap-16 md:gap-24">

                <section className=" md:pt-20 grid lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto w-full">

                    <div className="lg:col-span-6 text-left space-y-6">


                        <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                            Great outcomes start with KanbanFlow
                            .

                        </h1>

                        <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
                            AI-powered project management that removes the work around work. Keep teams in sync and on track.
                        </p>

                        <div className="pt-4">
                            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md">

                                <Link to="/auth" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 text-center transition duration-200 whitespace-nowrap">
                                    Get Start
                                </Link>
                            </form>
                        </div>
                    </div>

                    {/* Right Card*/}
                    <div className="lg:col-span-6 w-full hidden lg:block relative">

                        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    <span className="text-slate-500 text-xs ml-2 font-mono">project-board.json</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">To Do (2)</h4>
                                    <div className="bg-slate-800/80 border border-slate-700/50 p-3 rounded-xl space-y-2">
                                        <span className="text-[10px] bg-red-500/10 text-red-400 font-semibold px-2 py-0.5 rounded">High</span>
                                        <p className="text-xs text-slate-200 font-medium">Design Auth flow screens</p>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                                            <span className="text-[10px] text-slate-500 font-mono">KF-104</span>
                                            <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">JD</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Progress (1)</h4>
                                    <div className="bg-slate-800/80 border border-blue-500/50 p-3 rounded-xl space-y-2 relative ring-1 ring-blue-500/20">
                                        <span className="text-[10px] bg-blue-500/10 text-blue-400 font-semibold px-2 py-0.5 rounded">Medium</span>
                                        <p className="text-xs text-slate-200 font-medium">Setup Firebase Firestore Rules</p>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                                            <span className="text-[10px] text-slate-500 font-mono">KF-102</span>
                                            <span className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white">AK</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Done (3)</h4>
                                    <div className="bg-slate-800/40 border border-slate-700/30 p-3 rounded-xl space-y-2 opacity-60">
                                        <span className="text-[10px] bg-green-500/10 text-green-400 font-semibold px-2 py-0.5 rounded">Low</span>
                                        <p className="text-xs text-slate-400 line-through font-medium">Create landing page structure</p>
                                        <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                                            <span className="text-[10px] text-slate-500 font-mono">KF-101</span>
                                            <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">U</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto w-full border-t border-slate-800/60 pt-16">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h3 className="text-3xl font-bold text-white mb-4">Discover features that power high-performing teams</h3>
                        <p className="text-slate-400">Everything you need to move issues forward, from plan to production.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-slate-900/40 border border-slate-800/80 hover:border-blue-500/30 p-8 rounded-2xl text-left transition duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl font-bold mb-6 group-hover:scale-110 transition-transform">
                                📋
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Interactive Backlogs</h4>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Plan user stories, build them out in epics, and organize your sprint backlogs with absolutely zero manual effort or configuration overhead.
                            </p>
                            <Link to="/auth" className="text-blue-400 hover:text-blue-300 text-sm font-semibold inline-flex items-center gap-1 group-hover:underline">
                                Explore boards &rarr;
                            </Link>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-900/40 border border-slate-800/80 hover:border-purple-500/30 p-8 rounded-2xl text-left transition duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl font-bold mb-6 group-hover:scale-110 transition-transform">
                                ⚡
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Instant Firestore Sync</h4>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                No matter where your team is located, every card drag, new comment, or priority update reflects across everyone's screen instantly with real-time push events.
                            </p>
                            <Link to="/auth" className="text-purple-400 hover:text-purple-300 text-sm font-semibold inline-flex items-center gap-1 group-hover:underline">
                                Check real-time sync &rarr;
                            </Link>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 p-8 rounded-2xl text-left transition duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl font-bold mb-6 group-hover:scale-110 transition-transform">
                                👥
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">Flexible Workflows</h4>
                            <p className="text-slate-400 leading-relaxed mb-4">
                                Collaborate dynamically. Leave inline comments directly inside tasks, assign team members, and track complex progress tailored to your team's custom style.
                            </p>
                            <Link to="/auth" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold inline-flex items-center gap-1 group-hover:underline">
                                Learn about collaboration &rarr;
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
                &copy; 2026 KanbanFlow. Made with ❤️ for Nisha.
            </footer>
        </div>
    );
}   