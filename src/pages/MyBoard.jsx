import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { BarChart3, CheckCircle2, Clock, ListTodo, Users, Loader2 } from "lucide-react";

const MyBoard = () => {
    const [boardData, setBoardData] = useState({ todo: [], inProgress: [], done: [] });
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeBoard = onSnapshot(doc(db, "boards", "main-board"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBoardData({
                    todo: data.todo || [],
                    inProgress: data.inProgress || [],
                    done: data.done || []
                });
            }
            setLoading(false);
        });

        const unsubscribeTeam = onSnapshot(collection(db, "team"), (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeamMembers(list);
        });

        return () => {
            unsubscribeBoard();
            unsubscribeTeam();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm font-medium">Loading Analytics Dashboard...</p>
            </div>
        );
    }

    const todoCount = boardData.todo.length;
    const inProgressCount = boardData.inProgress.length;
    const doneCount = boardData.done.length;
    const totalTasks = todoCount + inProgressCount + doneCount;
    const progressPercentage = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-6 text-white p-2 sm:p-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <BarChart3 size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight text-slate-100">Analytics Dashboard</h2>
                        <p className="text-xs text-slate-400">Real-time overview of tasks and team workload</p>
                    </div>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
                        <ListTodo size={18} className="text-indigo-400" />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-100">{totalTasks}</p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                    <div className="flex items-center justify-between text-rose-400">
                        <span className="text-xs font-semibold uppercase tracking-wider">To Do</span>
                        <Clock size={18} />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-100">{todoCount}</p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                    <div className="flex items-center justify-between text-amber-400">
                        <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
                        <Clock size={18} />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-100">{inProgressCount}</p>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
                    <div className="flex items-center justify-between text-emerald-400">
                        <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
                        <CheckCircle2 size={18} />
                    </div>
                    <p className="text-3xl font-extrabold text-slate-100">{doneCount}</p>
                </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-200 text-sm">Overall Project Progress</h3>
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                        {progressPercentage}% Done
                    </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                    <div
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Team Distribution */}
            <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                    <Users size={18} className="text-indigo-400" />
                    <h3 className="font-bold text-slate-200 text-sm">Team Work Distribution</h3>
                </div>

                {teamMembers.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2">No team members added yet.</p>
                ) : (
                    <div className="grid gap-3">
                        {teamMembers.map((member) => {
                            const allTasks = [...boardData.todo, ...boardData.inProgress, ...boardData.done];
                            const memberTasksCount = allTasks.filter(t => t.assignedTo === member.name).length;

                            return (
                                <div key={member.id} className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 object-cover" />
                                        <div>
                                            <p className="font-semibold text-xs text-slate-200">{member.name}</p>
                                            <p className="text-[11px] text-slate-500">{member.role}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono font-semibold bg-slate-900 text-indigo-300 border border-slate-800 px-3 py-1 rounded-lg">
                                        {memberTasksCount} Tasks
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBoard;