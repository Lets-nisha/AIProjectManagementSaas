import React from 'react';

// Demo ke liye initial data  ..
const initialTasks = {
    todo: [
        { id: '1', title: 'Setup Razorpay API & Keys', priority: 'High', days: '2 days' },
        { id: '2', title: 'Create Push Notification Service', priority: 'Medium', days: '3 days' },
    ],
    inProgress: [
        { id: '3', title: 'Design User Login & Auth Screen', priority: 'High', days: '1 day' },
    ],
    done: [
        { id: '4', title: 'Project Initialization & Vite Setup', priority: 'Low', days: 'Completed' },
    ],
};

export default function KanbanBoard() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Generated Sprint Plan</h2>
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full">8 Weeks Timeline</span>
            </div>

            {/* 3 Columns Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* TO DO COLUMN */}
                <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/60 min-h-[400px]">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <span className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span> To Do
                        </span>
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium">{initialTasks.todo.length}</span>
                    </div>
                    <div className="space-y-3">
                        {initialTasks.todo.map(task => <TaskCard key={task.id} task={task} color="border-l-slate-400" />)}
                    </div>
                </div>

                {/* IN PROGRESS COLUMN */}
                <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/60 min-h-[400px]">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <span className="font-semibold text-amber-700 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span> In Progress
                        </span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-medium">{initialTasks.inProgress.length}</span>
                    </div>
                    <div className="space-y-3">
                        {initialTasks.inProgress.map(task => <TaskCard key={task.id} task={task} color="border-l-amber-500" />)}
                    </div>
                </div>

                {/* DONE COLUMN */}
                <div className="bg-slate-100/70 p-4 rounded-xl border border-slate-200/60 min-h-[400px]">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <span className="font-semibold text-emerald-700 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Done
                        </span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-medium">{initialTasks.done.length}</span>
                    </div>
                    <div className="space-y-3">
                        {initialTasks.done.map(task => <TaskCard key={task.id} task={task} color="border-l-emerald-500" />)}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Chhota Sub-component har ek Task Card ke liye
function TaskCard({ task, color }) {
    const priorityColor = task.priority === 'High' ? 'text-rose-600 bg-rose-50' : task.priority === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-50';

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 border-l-4 ${color} hover:shadow-md transition-all cursor-grab active:cursor-grabbing`}>
            <h4 className="font-medium text-slate-900 text-sm mb-3 leading-snug">{task.title}</h4>
            <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded font-medium ${priorityColor}`}>
                    {task.priority}
                </span>
                <span className="text-slate-400 font-medium">⏳ {task.days}</span>
            </div>
        </div>
    );
}