import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc, collection } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const KanbanBoard = ({ searchQuery = "" }) => {
    const [boardData, setBoardData] = useState({ todo: [], inProgress: [], done: [] });
    const [loading, setLoading] = useState(true);
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        const docRef = doc(db, "boards", "main-board");
        const unsubscribeBoard = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
                const data = docSnap.data();
                setBoardData({
                    todo: data.todo || [],
                    inProgress: data.inProgress || [],
                    done: data.done || []
                });
            } else {
                const initialSetup = { todo: [], inProgress: [], done: [] };
                setBoardData(initialSetup);
                setDoc(docRef, initialSetup);
            }
            setLoading(false);
        });

        const unsubscribeTeam = onSnapshot(collection(db, "team"), (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setTeamMembers(list);
        });

        return () => {
            unsubscribeBoard();
            unsubscribeTeam();
        };
    }, []);

    // Search Query ke basis par task filter karne ka function
    const filterTasks = (tasks = []) => {
        if (!searchQuery || !searchQuery.trim()) return tasks;
        const query = searchQuery.toLowerCase().trim();
        return tasks.filter(task =>
            (task.title && task.title.toLowerCase().includes(query)) ||
            (task.assignedTo && task.assignedTo.toLowerCase().includes(query))
        );
    };

    const handleDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        let updatedData = { ...boardData };
        if (source.droppableId === destination.droppableId) {
            const currentColumn = Array.from(boardData[source.droppableId] || []);
            const [removedTask] = currentColumn.splice(source.index, 1);
            currentColumn.splice(destination.index, 0, removedTask);
            updatedData = { ...boardData, [source.droppableId]: currentColumn };
        } else {
            const startColumn = Array.from(boardData[source.droppableId] || []);
            const [movedTask] = startColumn.splice(source.index, 1);
            const finishColumn = Array.from(boardData[destination.droppableId] || []);
            finishColumn.splice(destination.index, 0, movedTask);
            updatedData = {
                ...boardData,
                [source.droppableId]: startColumn,
                [destination.droppableId]: finishColumn
            };
        }
        setBoardData(updatedData);
        await setDoc(doc(db, "boards", "main-board"), updatedData);
    };

    const handleAssignMember = async (columnId, taskId, memberName) => {
        const updatedColumn = (boardData[columnId] || []).map((t) => t.id === taskId ? { ...t, assignedTo: memberName || "" } : t);
        const updatedData = { ...boardData, [columnId]: updatedColumn };
        setBoardData(updatedData);
        await setDoc(doc(db, "boards", "main-board"), updatedData);
    };

    const handleDateChange = async (columnId, taskId, newDate) => {
        const updatedColumn = (boardData[columnId] || []).map((t) => t.id === taskId ? { ...t, dueDate: newDate || "" } : t);
        const updatedData = { ...boardData, [columnId]: updatedColumn };
        setBoardData(updatedData);
        await setDoc(doc(db, "boards", "main-board"), updatedData);
    };

    const handleDeleteTask = async (colId, taskId, e) => {
        e.stopPropagation();
        if (!window.confirm("Delete this task?")) return;
        const updatedColumn = (boardData[colId] || []).filter((t) => t.id !== taskId);
        const updatedData = { ...boardData, [colId]: updatedColumn };
        setBoardData(updatedData);
        await setDoc(doc(db, "boards", "main-board"), updatedData);
        toast.error("Task deleted");
    };

    const columns = [
        { id: "todo", title: "To Do", bg: "bg-slate-900/90", border: "border-indigo-500/30", badge: "bg-indigo-500/20 text-indigo-300" },
        { id: "inProgress", title: "In Progress", bg: "bg-slate-900/90", border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300" },
        { id: "done", title: "Completed", bg: "bg-slate-900/90", border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300" }
    ];

    if (loading) return <div className="text-center text-slate-400 py-12">Loading Kanban Board...</div>;

    return (
        <div className="p-2 md:p-4 bg-slate-950 w-full min-h-screen text-slate-100 overflow-hidden">
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {columns.map((col) => {
                        const filteredColumnTasks = filterTasks(boardData[col.id]);
                        return (
                            <div
                                key={col.id}
                                className={`w-full ${col.bg} border ${col.border} p-4 rounded-2xl flex flex-col h-[78vh] min-h-[500px] shadow-2xl`}
                            >
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                                    <h3 className="font-bold text-sm tracking-wide text-slate-200">{col.title}</h3>
                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${col.badge}`}>
                                        {filteredColumnTasks.length}
                                    </span>
                                </div>

                                <Droppable droppableId={col.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex-1 overflow-y-auto space-y-3 pr-1 rounded-xl transition-colors ${snapshot.isDraggingOver ? 'bg-slate-800/40 ring-2 ring-indigo-500/40' : ''}`}
                                        >
                                            {filteredColumnTasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-slate-950 border border-slate-800 hover:border-indigo-500/50 p-3.5 rounded-xl shadow-md transition-all duration-150 ${snapshot.isDragging ? 'rotate-1 scale-105 border-indigo-500 shadow-2xl bg-slate-900' : ''}`}
                                                        >
                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                <span className="text-xs font-medium text-slate-300 leading-relaxed flex-1">
                                                                    {task.title}
                                                                </span>
                                                                <button
                                                                    onClick={(e) => handleDeleteTask(col.id, task.id, e)}
                                                                    className="text-slate-500 hover:text-rose-400 text-xs p-1"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>

                                                            <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-slate-800/60 text-slate-400" onClick={(e) => e.stopPropagation()}>
                                                                <select
                                                                    value={task.assignedTo || ""}
                                                                    onChange={(e) => handleAssignMember(col.id, task.id, e.target.value)}
                                                                    className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer text-[11px]"
                                                                >
                                                                    <option value="">Unassigned</option>
                                                                    {teamMembers.map((m) => (
                                                                        <option key={m.id} value={m.name}>{m.name}</option>
                                                                    ))}
                                                                </select>

                                                                <input
                                                                    type="date"
                                                                    value={task.dueDate ? task.dueDate.substring(0, 10) : ""}
                                                                    onChange={(e) => handleDateChange(col.id, task.id, e.target.value)}
                                                                    className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer text-[10px]"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
            <ToastContainer position="bottom-right" theme="dark" />
        </div>
    );
};

export default KanbanBoard;