import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";



const KanbanBoard = () => {
    const [boardData, setBoardData] = useState({ todo: [], inProgress: [], done: [] });
    const [loading, setLoading] = useState(true);

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
                    console.log("Initial dummy data created in Firebase!");
                }
            } catch (error) {
                console.error(" error:", error);
                setBoardData({
                    todo: [{ id: "error-task", title: "Local Test Card (Firebase Offline)" }],
                    inProgress: [],
                    done: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchBoardData();
    }, []);

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

    if (loading) {
        return <div className="p-4 text-slate-500 text-center mt-12">Load board data...</div>;
    }

    return (
        <>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-6 p-4 m-5 flex-wrap">

                    <Droppable droppableId="todo">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-slate-100 p-4 rounded-lg w-64 min-h-[300px]"
                            >
                                <h3 className="font-bold mb-4">To Do</h3>

                                {boardData.todo.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-3 rounded shadow mb-2 border border-slate-400 cursor-grab"
                                            >
                                                {task.title}
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
                                <h3 className="font-bold mb-4">In Progress</h3>
                                {boardData.inProgress.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-orange p-3 rounded shadow mb-2 border border-slate-400 cursor-grab"
                                            >
                                                {task.title}
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
                                <h3 className="font-bold mb-4">Done</h3>

                                {boardData.done.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-green p-3 rounded shadow mb-2 border  border-slate-400 cursor-grab"
                                            >
                                                {task.title}
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