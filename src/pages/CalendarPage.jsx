import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "boards", "main-board"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const allTasks = [...(data.todo || []), ...(data.inProgress || []), ...(data.done || [])];
                const tasksWithDates = allTasks.filter(task => task.dueDate && task.dueDate.trim() !== "");

                const calendarEvents = tasksWithDates.map(task => {
                    const parts = task.dueDate.split('-');
                    const localDate = new Date(parts[0], parts[1] - 1, parts[2]);
                    return {
                        title: `${task.title} (${task.assignedTo || 'Unassigned'})`,
                        start: localDate,
                        end: localDate,
                        allDay: true,
                    };
                });
                setEvents(calendarEvents);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm font-medium">Loading Scheduled Tasks...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 text-white p-2 sm:p-4">
            <style>{`
                /* Dark Theme Styles for React Big Calendar */
                .rbc-calendar { 
                    font-family: inherit; 
                    color: #cbd5e1;
                }
                .rbc-month-view, .rbc-time-view {
                    border: 1px solid rgba(51, 65, 85, 0.8) !important;
                    border-radius: 12px;
                    background: rgba(15, 23, 42, 0.6);
                    overflow: hidden;
                }
                .rbc-header {
                    padding: 10px 0 !important;
                    font-weight: 700 !important;
                    color: #94a3b8 !important;
                    font-size: 12px !important;
                    border-bottom: 1px solid rgba(51, 65, 85, 0.8) !important;
                    background: rgba(30, 41, 59, 0.5);
                }
                .rbc-day-bg {
                    background: transparent;
                    border-left: 1px solid rgba(51, 65, 85, 0.4) !important;
                }
                .rbc-day-bg + .rbc-day-bg {
                    border-left: 1px solid rgba(51, 65, 85, 0.4) !important;
                }
                .rbc-month-row {
                    border-top: 1px solid rgba(51, 65, 85, 0.4) !important;
                    min-height: 80px !important;
                }
                .rbc-today {
                    background-color: rgba(99, 102, 241, 0.1) !important;
                }
                .rbc-off-range-bg {
                    background: rgba(15, 23, 42, 0.9) !important;
                }
                .rbc-date-cell {
                    padding: 6px 8px !important;
                    font-size: 12px;
                    font-weight: 600;
                    color: #94a3b8;
                }
                .rbc-now .rbc-button-link {
                    color: #818cf8 !important;
                    font-weight: 800;
                }
                .rbc-event {
                    background-color: rgba(99, 102, 241, 0.2) !important;
                    color: #c7d2fe !important;
                    border: 1px solid rgba(99, 102, 241, 0.4) !important;
                    border-radius: 6px !important;
                    padding: 2px 6px !important;
                    font-size: 11px !important;
                    font-weight: 600 !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
                .rbc-toolbar button {
                    color: #94a3b8 !important;
                    border: 1px solid rgba(51, 65, 85, 0.8) !important;
                    background: rgba(30, 41, 59, 0.8) !important;
                    border-radius: 8px !important;
                    font-size: 12px !important;
                    font-weight: 600 !important;
                    padding: 6px 12px !important;
                    transition: all 0.2s ease;
                }
                .rbc-toolbar button:hover {
                    background: rgba(51, 65, 85, 1) !important;
                    color: #f8fafc !important;
                }
                .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
                    background-color: #4f46e5 !important;
                    color: white !important;
                    border-color: #4f46e5 !important;
                    box-shadow: 0 0 10px rgba(79, 70, 229, 0.4);
                }
                .rbc-toolbar-label {
                    font-size: 15px !important;
                    font-weight: 700 !important;
                    color: #f1f5f9 !important;
                }
            `}</style>

            {/* Header */}
            <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <CalendarIcon size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Calendar Schedule</h2>
                        <p className="text-xs text-slate-400">Track task timelines and deadlines</p>
                    </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold text-indigo-300">
                    <span>{events.length} Scheduled Tasks</span>
                </div>
            </div>

            {/* Calendar Container */}
            <div className="bg-slate-900/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl" style={{ height: "550px" }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    views={['month', 'week']}
                />
            </div>
        </div>
    );
};

export default CalendarPage;