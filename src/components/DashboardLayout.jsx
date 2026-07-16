import React, { useState } from 'react';
import PromptBox from '../components/PromptBox';
import KanbanBoard from '../components/KanbanBoard';
import Header from '../components/Header';
import SidebarPage from '../components/Sidebar';
import TeamPage from '../pages/TeamPage';
import MyBoard from "../pages/MyBoard";
import CalendarPage from '../pages/CalendarPage';

import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { generateProjectBacklog } from '../utils/gemini';
import { toast } from 'react-toastify';

const DashboardLayout = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleAIQuery = async (promptText) => {
        console.log("User Input for AI:", promptText);
        if (!promptText || !promptText.trim()) return;

        try {
            const aiTasks = await generateProjectBacklog(promptText);

            const todoList = [];
            const inProgressList = [];

            aiTasks.forEach((task, index) => {
                const formattedTask = {
                    id: task.code || `task-${Date.now()}-${index}`,
                    title: `${task.title} [${task.priority.toUpperCase()}]${task.assignee ? `(${task.assignee})` : ''}`
                };

                if (task.status === 'progress' || task.status === 'inProgress') {
                    inProgressList.push(formattedTask);
                } else {
                    todoList.push(formattedTask);
                }
            });

            const finalBacklog = {
                todo: todoList,
                inProgress: inProgressList,
                done: []
            };

            const docRef = doc(db, "boards", "main-board");
            await setDoc(docRef, finalBacklog);

            console.log("Real AI tasks successfully saved in Firebase! 🎉");
            toast.success("✨ AI Project Plan Loaded!");

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error("Error generating/saving AI Backlog:", error);
            toast.error("Failed to generate or save tasks.");
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <SidebarPage
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
                <Header setIsSidebarOpen={setIsSidebarOpen} activeTab={activeTab} />

                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">
                    {activeTab === 'dashboard' && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <PromptBox onGenerate={handleAIQuery} />
                            <KanbanBoard />
                        </div>
                    )}
                    {activeTab === 'team' && <TeamPage />}
                    {activeTab === 'boards' && <MyBoard />}
                    {activeTab === 'calendar' && <CalendarPage />}

                    {activeTab !== 'dashboard' && activeTab !== 'team' && activeTab !== 'boards' && activeTab !== 'calendar' && (
                        <div className="text-center text-slate-500 mt-12">This section is coming soon...</div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;