import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, onSnapshot, collection } from "firebase/firestore";

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

    if (loading) return <div className="p-4 text-center mt-12 text-slate-500">Loading Analytics...</div>;

    const todoCount = boardData.todo.length;
    const inProgressCount = boardData.inProgress.length;
    const doneCount = boardData.done.length;
    const totalTasks = todoCount + inProgressCount + doneCount;

    const progressPercentage = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

    return (
        <div className=" max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">📊 Project Analytics Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-500 font-medium">Total Tasks</p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">{totalTasks}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-600 font-medium">To Do</p>
                    <p className="text-3xl font-bold text-blue-800 mt-1">{todoCount}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <p className="text-sm text-orange-600 font-medium">In Progress</p>
                    <p className="text-3xl font-bold text-orange-800 mt-1">{inProgressCount}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <p className="text-sm text-green-600 font-medium">Completed</p>
                    <p className="text-3xl font-bold text-green-800 mt-1">{doneCount}</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-slate-700">Overall Project Progress</h3>
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {progressPercentage}% Done
                    </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-500 h-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-semibold text-slate-700 mb-4">👥 Team Work Distribution</h3>
                {teamMembers.length === 0 ? (
                    <p className="text-sm text-slate-400">No team members added yet.</p>
                ) : (
                    <div className="space-y-4">
                        {teamMembers.map((member) => {
                            const allTasks = [...boardData.todo, ...boardData.inProgress, ...boardData.done];
                            const memberTasksCount = allTasks.filter(t => t.assignedTo === member.name).length;

                            return (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full bg-slate-200" />
                                        <div>
                                            <p className="font-medium text-slate-800">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-1 rounded-full">
                                            {memberTasksCount} Tasks Assigned
                                        </span>
                                    </div>
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