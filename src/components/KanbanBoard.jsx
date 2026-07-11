import React, { useState, useEffect } from "react";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, onSnapshot } from "firebase/firestore";



const KanbanBoard = () => {
    const [boardData, setBoardData] = useState({ todo: [], inProgress: [], done: [] });
    const [loading, setLoading] = useState(true);
    const [teamMembers, setTeamMembers] = useState([]);
    const [newComment, setNewComment] = useState("");

    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedColumnId, setSelectedColumnId] = useState(null);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");

    const [activeInputColumn, setActiveInputColumn] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState("");

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const docRef = doc(db, "boards", "main-board");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
                    const data = docSnap.data();
                    setBoardData({
                        todo: data.todo || [],
                        inProgress: data.inProgress || [],
                        done: data.done || []
                    });
                } else {
                    const initialSetup = {
                        todo: [
                            { id: "task-1", title: "Welcome to your Board!" },
                            { id: "task-2", title: "Testing Firebase Connection" }
                        ],
                        inProgress: [],
                        done: []
                    };

                    setBoardData(initialSetup);

                    await setDoc(docRef, initialSetup);
                }
            } catch (error) {
                console.error(" error:", error);
                setBoardData({
                    todo: [{ id: "error-task", title: "Local Test Card  " }],
                    inProgress: [],
                    done: []
                });
            } finally {
                setLoading(false);
            }
        };

        const unsubscribeTeam = onSnapshot(collection(db, "team"), (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeamMembers(list);
        });

        fetchBoardData();
        return () => unsubscribeTeam();
    }, []);

    const handleAddComment = async () => {
        if (!newComment.trim() || !selectedTask || !selectedColumnId) return;

        const commentObject = {
            id: `comment-${Date.now()}`,
            text: newComment.trim(),
            by: "Current User",
            createdAt: new Date().toLocaleDateString()
        };

        const updatedComments = [...(selectedTask.comments || []), commentObject];
        const updatedColumn = boardData[selectedColumnId].map((task) => {
            if (task.id === selectedTask.id) {
                return { ...task, comments: updatedComments };
            }
            return task;
        });

        const updatedData = { ...boardData, [selectedColumnId]: updatedColumn };

        setBoardData(updatedData);
        setSelectedTask({ ...selectedTask, comments: updatedComments });
        setNewComment("");

        try {
            await setDoc(doc(db, "boards", "main-board"), updatedData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateComment = async (commentId) => {
        if (!editingCommentText.trim() || !selectedTask || !selectedColumnId) return;

        const updatedComments = selectedTask.comments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, text: editingCommentText.trim() };
            }
            return comment;
        });

        const updatedColumn = boardData[selectedColumnId].map((task) => {
            if (task.id === selectedTask.id) {
                return { ...task, comments: updatedComments };
            }
            return task;
        });

        const updatedData = { ...boardData, [selectedColumnId]: updatedColumn };
        setBoardData(updatedData);
        setSelectedTask({ ...selectedTask, comments: updatedComments });
        setEditingCommentId(null);
        setEditingCommentText("");

        try {
            await setDoc(doc(db, "boards", "main-board"), updatedData);
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!selectedTask || !selectedColumnId) return;

        const confirmDelete = window.confirm("Are you sure delete ths comment?");
        if (!confirmDelete) return;

        const updatedComments = selectedTask.comments.filter((comment) => comment.id !== commentId);

        const updatedColumn = boardData[selectedColumnId].map((task) => {
            if (task.id === selectedTask.id) {
                return { ...task, comments: updatedComments };
            }
            return task;
        });

        const updatedData = { ...boardData, [selectedColumnId]: updatedColumn };
        setBoardData(updatedData);
        setSelectedTask({ ...selectedTask, comments: updatedComments });

        try {
            await setDoc(doc(db, "boards", "main-board"), updatedData);
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    // ➕ NAYA TASK BOARD ME ADD KARNA
    const handleAddTask = async (columnId) => {
        if (!newTaskTitle.trim()) return;

        const newTask = {
            id: `task-${Date.now()}`, // Drag and drop ke liye unique ID
            title: newTaskTitle.trim(),
            assignedTo: "",
            dueDate: "",
            comments: []
        };

        const updatedColumn = [...boardData[columnId], newTask];
        const updatedData = { ...boardData, [columnId]: updatedColumn };

        setBoardData(updatedData);
        setNewTaskTitle("");
        setActiveInputColumn(null); // Input field close karne ke liye

        try {
            await setDoc(doc(db, "boards", "main-board"), updatedData);
        } catch (error) {
            console.error("Error adding new task:", error);
        }
    };

    const renderNewTaskInput = (columnId) => {
        if (activeInputColumn === columnId) {
            return (
                <div className="mt-3 bg-white p-3 rounded shadow border border-indigo-300 space-y-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="What needs to be done?"
                        className="w-full text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask(columnId)}
                        autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => { setActiveInputColumn(null); setNewTaskTitle(""); }}
                            className="text-[11px] text-slate-500 hover:text-slate-700 px-2 py-1"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleAddTask(columnId)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium px-3 py-1 rounded shadow"
                        >
                            Add
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <button
                onClick={() => setActiveInputColumn(columnId)}
                className="mt-3 w-full border border-dashed border-slate-300 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 bg-slate-50/50 hover:bg-white text-xs font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-1"
            >
                ➕ Add Task
            </button>
        );
    };

    const handleAssignMember = async (columnId, taskId, memberName) => {
        const updatedColumn = boardData[columnId].map((task) => {
            if (task.id === taskId) {
                return { ...task, assignedTo: memberName || "" };
            }
            return task;
        });

        const updatedData = { ...boardData, [columnId]: updatedColumn };

        setBoardData(updatedData);

        try {
            await setDoc(doc(db, "boards", "main-board"), updatedData);
            console.log("Member assigned successfully! 🚀");
        } catch (error) {
            console.error("Error updating assignment:", error);
        }
    };

    const handleDateChange = async (columnId, taskId, newDate) => {
        const updatedColumn = boardData[columnId].map((task) => {
            if (task.id === taskId) {
                return { ...task, dueDate: newDate || "" };
            }
            return task;
        });

        const updatedData = { ...boardData, [columnId]: updatedColumn };

        setBoardData(updatedData);

        try {
            await setDoc(doc(db, "boards", "main-board"), updatedData);
            console.log("Due date updated in Firebase! 📅");
        } catch (error) {
            console.error("Error updating date:", error);
        }
    };



    const handleDragEnd = async (result) => {
        const { source, destination } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        let updatedData = { ...boardData };


        if (source.droppableId === destination.droppableId) {
            const currentColumn = Array.from(boardData[source.droppableId]);

            const [removedTask] = currentColumn.splice(source.index, 1);
            currentColumn.splice(destination.index, 0, removedTask);

            updatedData = {
                ...boardData,
                [source.droppableId]: currentColumn
            };
        } else {

            const startColumn = Array.from(boardData[source.droppableId]);
            const [movedTask] = startColumn.splice(source.index, 1);

            const finishColumn = Array.from(boardData[destination.droppableId]);
            finishColumn.splice(destination.index, 0, movedTask);

            updatedData = {
                ...boardData,
                [source.droppableId]: startColumn,
                [destination.droppableId]: finishColumn
            };
        }
        setBoardData(updatedData);

        try {
            await setDoc(doc(db, "boards", "main-board"), updatedData);
            console.log("Save data properly in Firebase ! 🚀");
        } catch (error) {
            console.error("Error conn`t save data in Firebase:", error);
        }
    };
    const renderTaskControls = (columnId, task) => (
        <div className="mt-3 pt-2 border-t border-slate-200 space-y-2"
            onClick={(e) => e.stopPropagation()}
        >

            <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Assignee:</span>
                <select
                    value={task.assignedTo || ""}
                    onChange={(e) => handleAssignMember(columnId, task.id, e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded px-1 py-0.5 text-slate-700 focus:outline-none max-w-[120px] cursor-pointer"
                >
                    <option value="">Unassigned</option>
                    {teamMembers.map((member) => (
                        <option key={member.id} value={member.name}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Due Date:</span>
                <input
                    type="date"
                    value={task.dueDate ? task.dueDate.substring(0, 10) : ""}
                    onChange={(e) => {
                        const selectedDate = e.target.value;
                        if (selectedDate) {
                            handleDateChange(columnId, task.id, selectedDate);
                        }
                    }}
                    className="text-xs bg-slate-50 border border-slate-300 rounded px-1 py-0.5 text-slate-700 focus:outline-none cursor-pointer"
                />
            </div>

        </div>

    );

    if (loading) {
        return <div className="p-4 text-slate-500 text-center mt-12">Loading...</div>;
    }

    return (
        <>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-6 p-4 flex-wrap justify-center md:justify-start">

                    {renderNewTaskInput("todo")}
                    <Droppable droppableId="todo">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-slate-100 p-4 rounded-lg w-64 min-h-[300px]"
                            >
                                <h3 className="font-bold mb-4 text-slate-700">To Do</h3>

                                {boardData.todo.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => { setSelectedTask(task); setSelectedColumnId("todo"); }}
                                                className="bg-white p-3 rounded shadow mb-2 border border-slate-400 cursor-grab flex flex-col justify-between"
                                            >
                                                <div className="text-slate-800 font-medium">{task.title}</div>
                                                {renderTaskControls("todo", task)}
                                            </div>
                                        )}

                                    </Draggable>
                                ))}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                    {renderNewTaskInput("inProgress")}

                    <Droppable droppableId="inProgress">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-orange-100 p-4 rounded-lg w-64 min-h-[300px]"
                            >
                                <h3 className="font-bold mb-4 text-orange-700">In Progress</h3>
                                {boardData.inProgress.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => { setSelectedTask(task); setSelectedColumnId("inProgress"); }}
                                                className="bg-white p-3 rounded shadow mb-2 border border-slate-400 cursor-grab flex flex-col justify-between"
                                            >
                                                <div className="text-slate-800 font-medium">{task.title}</div>
                                                {renderTaskControls("inProgress", task)}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    {renderNewTaskInput("done")}


                    <Droppable droppableId="done">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-green-100 p-4 rounded-lg w-64 min-h-[300px]"
                            >
                                <h3 className="font-bold mb-4 text-green-700">Done</h3>

                                {boardData.done.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                onClick={() => { setSelectedTask(task); setSelectedColumnId("done"); }}
                                                className="bg-green p-3 rounded shadow mb-2 border  border-slate-400 cursor-grab flex flex-col justify-between"
                                            >
                                                <div className="text-slate-800 font-medium">{task.title}</div>
                                                {renderTaskControls("done", task)}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                </div>
            </DragDropContext>


            {selectedTask && (
                <div
                    className="fixed top-0 left-0 right-0 bottom-0 w-full h-full min-h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[999999] !mt-0 p-4"
                    onClick={() => { setSelectedTask(null); setSelectedColumnId(null); }}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] !mt-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h4 className="font-semibold text-slate-800 text-sm truncate max-w-[80%]">
                                {selectedTask.title}
                            </h4>
                            <button
                                onClick={() => { setSelectedTask(null); setSelectedColumnId(null); }}
                                className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2 py-1"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 overflow-y-auto space-y-4 flex-1">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Task Context</span>
                                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                                    Assigned To: <strong className="text-slate-800">{selectedTask.assignedTo || "Unassigned"}</strong> <br />
                                    Due Date: <strong className="text-slate-800">{selectedTask.dueDate || "No deadline"}</strong>
                                </p>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                                    Activity Timeline ({selectedTask.comments?.length || 0})
                                </span>
                                <div className="space-y-2">
                                    {selectedTask.comments && selectedTask.comments.length > 0 ? (
                                        selectedTask.comments.map((comment) => (
                                            <div key={comment.id} className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 text-xs">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-semibold text-slate-700">{comment.by}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                                                        <button
                                                            onClick={() => { setEditingCommentId(comment.id); setEditingCommentText(comment.text); }}
                                                            className="text-slate-400 hover:text-indigo-600 text-[11px]"
                                                            title="Edit Comment"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="text-slate-400 hover:text-rose-600 text-[11px]"
                                                            title="Delete Comment"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                                {editingCommentId === comment.id ? (
                                                    <div className="mt-1 flex gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            value={editingCommentText}
                                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                                            className="flex-1 text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-indigo-500"
                                                        />
                                                        <button
                                                            onClick={() => handleUpdateComment(comment.id)}
                                                            className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded font-medium"
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => { setEditingCommentId(null); setEditingCommentText(""); }}
                                                            className="text-slate-500 text-[10px] px-1"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-600 whitespace-pre-wrap">{comment.text}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No activity yet. Type below to drop updates.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2 items-center">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment to this issue..."
                                className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                            />
                            <button
                                onClick={handleAddComment}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}



        </>
    )
}

export default KanbanBoard