import React, { useState, useEffect } from 'react';
import PromptBox from '../components/PromptBox';
import KanbanBoard from '../components/KanbanBoard';
import Header from '../components/Header';
import SidebarPage from '../components/Sidebar';
import TeamPage from '../pages/TeamPage';
import MyBoard from "../pages/MyBoard";
import CalendarPage from '../pages/CalendarPage';

import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { generateProjectBacklog } from '../utils/gemini';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [boardData, setBoardData] = useState({ todo: [], inProgress: [], done: [] });

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const docRef = doc(db, "boards", "main-board");
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setBoardData(docSnap.data());
            }
        });
        return () => unsubscribe();
    }, []);

    const handleAIQuery = async (promptText, isEditMode = false) => {
        if (!promptText || !promptText.trim()) return;

        try {
            toast.info(isEditMode ? "AI is modifying your board... 🛠️" : "AI is creating structured plan... 🧠");

            const aiTasks = await generateProjectBacklog(promptText, isEditMode ? boardData : null);

            const todoList = [];
            const inProgressList = [];

            aiTasks.forEach((task, index) => {
                const formattedTask = {
                    id: task.code || `task-${Date.now()}-${index}`,
                    title: task.title || "Untitled Task",
                    assignedTo: task.assignee || "",
                    dueDate: "",
                    comments: []
                };

                if (task.status === 'progress' || task.status === 'inProgress') {
                    inProgressList.push(formattedTask);
                } else {
                    todoList.push(formattedTask);
                }
            });

            const finalBacklog = isEditMode
                ? {
                    ...boardData,
                    todo: [...(boardData?.todo || []), ...todoList],
                    inProgress: [...(boardData?.inProgress || []), ...inProgressList]
                }
                : {
                    todo: todoList,
                    inProgress: inProgressList,
                    done: []
                };

            const docRef = doc(db, "boards", "main-board");
            await setDoc(docRef, finalBacklog);

            toast.success(isEditMode ? "✨ Board updated by AI!" : "✨ Structured Plan Generated!");

        } catch (error) {
            console.error("Error saving AI Backlog:", error);
            toast.error("Failed to generate plan.");
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 font-sans text-slate-100 overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <SidebarPage
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <main className="flex-1 flex flex-col h-full overflow-hidden w-full bg-slate-950">
                {/* Header me Search Query and Setter pass karein */}
                <Header
                    setIsSidebarOpen={setIsSidebarOpen}
                    activeTab={activeTab}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 w-full">
                    {activeTab === 'dashboard' && (
                        <div className="w-full space-y-4">
                            <PromptBox onGenerate={handleAIQuery} />
                            <KanbanBoard searchQuery={searchQuery} />
                        </div>
                    )}
                    {activeTab === 'team' && <TeamPage />}
                    {activeTab === 'boards' && <MyBoard />}
                    {activeTab === 'calendar' && <CalendarPage />}

                    {activeTab !== 'dashboard' && activeTab !== 'team' && activeTab !== 'boards' && activeTab !== 'calendar' && (
                        <div className="text-center text-slate-500 mt-12 text-sm font-medium">This section is coming soon...</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;