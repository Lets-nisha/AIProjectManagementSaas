import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Users, UserPlus, Trash2, Mail, X, ShieldCheck, Loader2 } from 'lucide-react';

const TeamPage = () => {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [role, setRole] = useState('Lead Developer');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const teamCollection = collection(db, "team");

        const unsubscribe = onSnapshot(teamCollection, (snapshot) => {
            const teamList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMembers(teamList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        const newMember = {
            name,
            role,
            email,
            status: 'Active',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
        };

        try {
            await addDoc(collection(db, "team"), newMember);
            setName('');
            setEmail('');
            setShowModal(false);
        } catch (error) {
            console.error("Error adding team member:", error);
            alert("Member add nahi ho saka!");
        }
    };

    const handleDeleteMember = async (id) => {
        if (window.confirm("Are you sure you want to remove this member?")) {
            try {
                await deleteDoc(doc(db, "team", id));
            } catch (error) {
                console.error("Error deleting member:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm font-medium">Loading Team Directory...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 text-white p-2 sm:p-4">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                        <Users size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">Project Team</h2>
                        <p className="text-xs text-slate-400">Manage workspace collaborators, avatars, and live roles</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <UserPlus size={16} /> Invite Member
                </button>
            </div>

            {/* Team Grid / Empty State */}
            {members.length === 0 ? (
                <div className="bg-slate-900/50 p-12 rounded-2xl text-center border border-slate-800/80 text-slate-500 space-y-3">
                    <Users size={32} className="mx-auto text-slate-600" />
                    <p className="text-sm font-medium">No team members added yet.</p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="text-xs text-indigo-400 hover:underline font-semibold"
                    >
                        Click here to invite your first collaborator
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col items-center text-center relative overflow-hidden group hover:border-slate-700 transition-all duration-200"
                        >
                            {/* Delete Button */}
                            <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
                                title="Delete Member"
                            >
                                <Trash2 size={16} />
                            </button>

                            {/* Avatar */}
                            <div className="relative">
                                <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-20 h-20 rounded-2xl bg-slate-950 p-2 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-200"
                                />
                            </div>

                            {/* Details */}
                            <h3 className="mt-4 font-bold text-slate-100 text-base">{member.name}</h3>
                            <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-0.5 rounded-full mt-1">
                                {member.role}
                            </span>

                            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3">
                                <Mail size={13} className="text-slate-500" />
                                <span className="truncate max-w-[200px]">{member.email}</span>
                            </div>

                            {/* Footer Status */}
                            <div className="w-full border-t border-slate-800/80 mt-5 pt-3.5 flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-mono">Status</span>
                                <span className="inline-flex items-center gap-1 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
                                    <ShieldCheck size={12} />
                                    {member.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Invite Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative space-y-5 animate-in fade-in zoom-in duration-150">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                                <UserPlus size={18} className="text-indigo-400" /> Add Team Member
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Nisha Turkey"
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. nisha@example.com"
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                                >
                                    <option value="Lead Developer">Lead Developer</option>
                                    <option value="Frontend Developer">Frontend Developer</option>
                                    <option value="Backend Developer">Backend Developer</option>
                                    <option value="UI/UX Designer">UI/UX Designer</option>
                                    <option value="MERN Stack Developer">MERN Stack Developer</option>
                                    <option value="Full Stack Developer">Full Stack Developer</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-95"
                                >
                                    Add Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default TeamPage;