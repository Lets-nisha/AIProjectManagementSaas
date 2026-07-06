import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialData = {
    todo: [
        { id: 'task-1', title: 'HTML Layout Banana' },
        { id: 'task-2', title: 'CSS Tailwind Setup' }
    ],
    inProgress: [
        { id: 'task-3', title: 'React Learn Karna' }
    ],
    done: []
};

const KanbanBoard = () => {
    const [boardData, setBoardData] = useState(initialData);

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const currentColumn = Array.from(boardData[source.droppableId]);

            const [removedTask] = currentColumn.splice(source.index, 1);
            currentColumn.splice(destination.index, 0, removedTask);

            setBoardData({
                ...boardData,
                [source.droppableId]: currentColumn
            })
            return;
        }

        const startColumn = Array.from(boardData[source.droppableId]);
        const [movedTask] = startColumn.splice(source.index, 1);

        const finishColumn = Array.from(boardData[destination.droppableId]);
        finishColumn.splice(destination.index, 0, movedTask);

        setBoardData({
            ...boardData,
            [source.droppableId]: startColumn,
            [destination.droppableId]: finishColumn
        });

    }


    // if (!ready) return <div className="p-4 text-slate-500">Loading Kanban Board...</div>;

    return (
        <>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="flex gap-6 p-4">



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
                                                className="bg-white p-3 rounded shadow mb-2 border border-slate-200 cursor-grab"
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
                                className="bg-slate-100 p-4 rounded-lg w-64 min-h-[300px]"
                            >
                                <h3 className="font-bold mb-4">In Progress</h3>
                                {boardData.inProgress.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-3 rounded shadow mb-2 border border-slate-200 cursor-grab"
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
                                className="bg-slate-100 p-4 rounded-lg w-64 min-h-[300px]"
                            >
                                <h3 className="font-bold mb-4">Done</h3>

                                {boardData.done.map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-3 rounded shadow mb-2 border border-slate-200 cursor-grab"
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