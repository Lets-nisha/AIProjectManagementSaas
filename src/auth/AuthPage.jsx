import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                console.log("Login Successful! 🎉");
                alert("Login Successful! 🎉");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                console.log("Signup Successful! 🎉");
                setIsLogin(true)

            }

            navigate('/dashboard');
        } catch (err) {
            console.error("Auth Error Code:", err.code);


            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
                if (isLogin) {
                    setError("Please Create Your Account!");
                    setIsLogin(false);
                } else {
                    setError('Wrong email OR password. Try Again.');
                }
            } else if (err.code === 'auth/weak-password') {
                setError('Password Atlest 6 characters.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Your email Already registered . Please Sign In .');
                setIsLogin(true);
            } else {
                setError('Somthing Worng. Try Again!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isLogin ? 'Welcome Back!' : 'Create Account'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isLogin ? 'Log in to continue' : 'Get started with collaborative boards'}
                    </p>
                </div>

                {/* Error & Info Banner */}
                {error && (
                    <div className="mb-6 p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm rounded-lg text-center font-medium animate-pulse">
                        💡 {error}
                    </div>
                )}

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                {/* Toggle between Login / Sign Up */}
                <div className="text-center mt-6">
                    <p className="text-slate-400 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setError('');
                                setIsLogin(!isLogin);
                            }}
                            className="text-blue-400 hover:text-blue-300 font-semibold focus:outline-none"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>

            </div>
        </div>
    );
}