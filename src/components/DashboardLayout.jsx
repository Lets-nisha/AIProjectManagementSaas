import React, { useState } from 'react';
import PromptBox from './PromptBox';
import KanbanBoard from './KanbanBoard';
import Header from './Header';
import SidebarPage from './Sidebar';
import TeamPage from '../pages/TeamPage'; // Path check kar lein
import MyBoard from "../pages/MyBoard";
import CalendarPage from '../pages/CalendarPage';

import { db } from '../firebase'; // Path check kar lein
import { doc, setDoc } from 'firebase/firestore';

const DashboardLayout = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleAIQuery = async (promptText) => {
        console.log("User Input for AI:", promptText);
        if (!promptText.trim()) return;

        const generatedTasks = {
            todo: [
                { id: `task-${Date.now()}-1`, title: `Setup: ${promptText.substring(0, 30)}...` },
                { id: `task-${Date.now()}-2`, title: "Develop Core Features & UI Components" },
                { id: `task-${Date.now()}-3`, title: "Testing, Bug Fixes & Deployment" }
            ],
            inProgress: [],
            done: []
        };

        try {
            const docRef = doc(db, "boards", "main-board");
            await setDoc(docRef, generatedTasks);
            console.log("New tasks successfully saved in Firebase! 🎉");
            window.location.reload();
        } catch (error) {
            console.error("Error saving data in Firebase:", error);
            alert("Database not saved. Check Rules!");
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <SidebarPage
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Main Content Area */}
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

export default DashboardLayout; // 👈 Ise export karna zaroori hai