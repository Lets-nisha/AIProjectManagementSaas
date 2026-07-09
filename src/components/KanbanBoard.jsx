import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, onSnapshot } from "firebase/firestore";



const KanbanBoard = () => {
    const [boardData, setBoardData] = useState({ todo: [], inProgress: [], done: [] });
    const [loading, setLoading] = useState(true);
    const [teamMembers, setTeamMembers] = useState([]);

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

    const handleAssignMember = async (columnId, taskId, memberName) => {
        const updatedColumn = boardData[columnId].map((task) => {
            if (task.id === taskId) {
                return { ...task, assignedTo: memberName };
            }
            return task;
        });
        const updatedData = {
            ...boardData,
            [columnId]: updatedColumn
        };

        setBoardData(updatedData);

        try {
            await setDoc(doc(db, "boards", "main-board"), updatedData);
            console.log("Member assigned successfully! 🚀");
        } catch (error) {
            console.error("Error updating assignment:", error);
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
    const renderAssigneeDropdown = (columnId, task) => (
        <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
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
    );

    if (loading) {
        return <div className="p-4 text-slate-500 text-center mt-12">Loading...</div>;
    }

    return (
        <>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-6 p-4 m-5 flex-wrap justify-center md:justify-start">

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
                                                className="bg-white p-3 rounded shadow mb-2 border border-slate-400 cursor-grab flex flex-col justify-between"
                                            >
                                                <div className="text-slate-800 font-medium">{task.title}</div>
                                                {renderAssigneeDropdown("todo", task)}
                                            </div>
                                        )}

                                    </Draggable>
                                ))}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>

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
                                                className="bg-white p-3 rounded shadow mb-2 border border-slate-400 cursor-grab flex flex-col justify-between"
                                            >
                                                <div className="text-slate-800 font-medium">{task.title}</div>
                                                {renderAssigneeDropdown("inProgress", task)}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

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
                                                className="bg-green p-3 rounded shadow mb-2 border  border-slate-400 cursor-grab flex flex-col justify-between"
                                            >
                                                <div className="text-slate-800 font-medium">{task.title}</div>
                                                {renderAssigneeDropdown("done", task)}
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



        </>
    )
}

export default KanbanBoard