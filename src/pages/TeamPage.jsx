import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

const TeamPage = () => {
    const [members, setMembers] = useState([]);
    const [showModal, setShowModal] = useState(false);

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
        });

        return () => unsubscribe();
    }, []);

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        const randomId = Math.floor(Math.random() * 100);
        const newMember = {
            name,
            role,
            email,
            status: 'Active',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`
        };

        try {
            await addDoc(collection(db, "team"), newMember);
            setName('');
            setEmail('');
            setShowModal(false);
        } catch (error) {
            console.error("Error adding team member:", error);
            alert(" can not addi!");
        }
    };


    const handleDeleteMember = async (id) => {
        if (window.confirm("Are You Sure To Delete?")) {
            try {
                await deleteDoc(doc(db, "team", id));
            } catch (error) {
                console.error("Error deleting member:", error);
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">

            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Project Team</h2>
                    <p className="text-sm text-slate-500">Manage your workspace collaborators and roles live.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl transition shadow-sm text-sm"
                >
                    + Invite Member
                </button>
            </div>

            {members.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl text-center border text-slate-400">
                    Invite Member !
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
                    {members.map((member) => (
                        <div key={member.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition">

                            <button
                                onClick={() => handleDeleteMember(member.id)}
                                className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 transition opacity-0 group-hover:opacity-100"
                                title="Delete Member"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>

                            <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 group-hover:scale-105 transition" />

                            <h3 className="mt-4 font-semibold text-slate-800 text-lg">{member.name}</h3>
                            <p className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mt-1">{member.role}</p>
                            <p className="text-sm text-slate-500 mt-2">{member.email}</p>

                            <div className="w-full border-t border-slate-50 mt-4 pt-4 flex justify-between items-center">
                                <span className="text-xs text-slate-400">Status</span>
                                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">
                                    {member.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-xl border m-4">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Add Team Member</h3>

                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</label>
                                <input
                                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Nisha Turkey"
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
                                <input
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. nisha@example.com"
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Role</label>
                                <select
                                    value={role} onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-indigo-600 bg-white"
                                >
                                    <option value="Lead Developer">Lead Developer</option>
                                    <option value="Frontend Engineer">Frontend Developer</option>
                                    <option value="Backend Developer ">Backend Developer </option>
                                    <option value="UI/UX Designer">UI/UX Designer</option>
                                    <option value="MERN Stack Developer">MERN Stack Developer</option>
                                    <option value="Full Stack Developer">Full Stack Developer</option>

                                </select>
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button" onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-sm transition"
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