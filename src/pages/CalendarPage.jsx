import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

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
            <div className="flex flex-col items-center justify-center h-[300px] bg-[#FAFBFC]">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0052CC] border-t-transparent mb-2"></div>
                <p className="text-xs text-[#5E6C84]">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-2 bg-white font-sans text-[#172B4D]  ">
            {/* JIRA CUSTOM STYLE INJECTION (COMPACT SIZE) */}
            <style>{`
                .rbc-calendar { font-family: inherit; }
                .rbc-event {
                    background-color: #DEEBFF !important;
                    color: #0747A6 !important;
                    border: none !important;
                    border-radius: 3px !important;
                    // padding: 1px 4px !important;
                    font-size: 11px !important;
                    font-weight: 600 !important;
                }
                .rbc-today { background-color: #EAE6FF !important; }
                .rbc-header {
                    padding: 6px 0 !important;
                    font-weight: 600 !important;
                    color: #5E6C84 !important;
                    font-size: 11px !important;
                }
                /* Compact rows */
                .rbc-month-row { min-height: 70px !important; } 
                .rbc-month-view {
                    border: 1px solid #DFE1E6 !important;
                    border-radius: 4px !important;
                    background: #FAFBFC;
                }
                .rbc-day-bg { background: #FFFFFF; }
                .rbc-toolbar button {
                    color: #42526E !important;
                    border: 1px solid #DFE1E6 !important;
                    background: #F4F5F7 !important;
                    border-radius: 3px !important;
                    font-size: 12px !important;
                    padding: 3px 8px !important;
                }
                .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
                    background-color: #0052CC !important;
                    color: white !important;
                    border-color: #0052CC !important;
                }
                .rbc-toolbar-label {
                    font-size: 14px !important;
                    font-weight: 600 !important;
                }
            `}</style>

            {/* JIRA MINI HEADER */}
            <div className="flex p-2 justify-between items-center border-b border-[#DFE1E6] pb-2 mb-3">
                <div >
                    <h1 className="text-base  font-semibold text-[#172B4D]">📅 Calendar View</h1>
                </div>
                <div className="bg-[#F4F5F7] border border-[#DFE1E6] rounded px-2 py-0.5 text-[11px] font-medium text-[#42526E]">
                    <span>{events.length} Tasks</span>
                </div>
            </div>

            {/* FIXED COMPACT HEIGHT */}
            <div className="bg-white" style={{ height: "460px" }}>
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