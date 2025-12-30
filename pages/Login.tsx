
import React, { useState } from 'react';
import { useAuth } from '../lib/auth';

const Login: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { loginAsUser, loginAsAdmin } = useAuth();
    const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
    const [encryptedId, setEncryptedId] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (loginMode === 'user') {
                await loginAsUser(encryptedId, privateKey);
            } else {
                await loginAsAdmin(email, password);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-novarc-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-novarc-accent/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-novarc-blue/20 rounded-full blur-[100px] -ml-24 -mb-24"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-12">
                    <div
                        className="flex items-center justify-center gap-3 mb-8 cursor-pointer"
                        onClick={() => onNavigate('landing')}
                    >
                        <svg viewBox="0 0 100 100" className="w-12 h-12 fill-novarc-accent">
                            <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                            <circle cx="50" cy="50" r="15" />
                        </svg>
                        <span className="text-2xl font-bold tracking-[0.4em] text-white">AL-FALAK</span>
                    </div>
                    <h1 className="text-white text-3xl font-light tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Secure Access to Your Royal Mandate</p>
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setLoginMode('user')}
                        className={`flex-1 py-2 text-[10px] uppercase tracking-widest border-b-2 transition-colors ${loginMode === 'user' ? 'text-novarc-accent border-novarc-accent' : 'text-white/40 border-white/5 hover:text-white'}`}
                    >
                        User Access
                    </button>
                    <button
                        onClick={() => setLoginMode('admin')}
                        className={`flex-1 py-2 text-[10px] uppercase tracking-widest border-b-2 transition-colors ${loginMode === 'admin' ? 'text-novarc-accent border-novarc-accent' : 'text-white/40 border-white/5 hover:text-white'}`}
                    >
                        Admin Portal
                    </button>
                </div>

                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-4 mb-6 text-rose-400 text-[10px] uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleLogin}>
                    {loginMode === 'user' ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Encrypted ID</label>
                                <input
                                    type="text"
                                    required
                                    value={encryptedId}
                                    onChange={(e) => setEncryptedId(e.target.value)}
                                    placeholder="SOVEREIGN-ID-XXXX"
                                    className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none transition-colors rounded-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Private Key</label>
                                <input
                                    type="password"
                                    required
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none transition-colors rounded-sm"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@alfalak.capital"
                                    className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none transition-colors rounded-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-novarc-accent font-bold">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm focus:border-novarc-accent outline-none transition-colors rounded-sm"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-white/40">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="accent-novarc-accent" />
                            Remember Terminal
                        </label>
                        <a href="#" className="hover:text-novarc-accent">Forgot {loginMode === 'user' ? 'Key' : 'Password'}?</a>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-novarc-accent text-white py-4 text-[11px] uppercase tracking-[0.4em] font-bold hover:brightness-110 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Initiate Session'}
                    </button>
                </form>

                <p className="mt-12 text-center text-[10px] uppercase tracking-[0.2em] text-white/30">
                    New institutional partner? <button onClick={() => onNavigate('signup')} className="text-novarc-accent font-bold hover:underline">Apply for Mandate</button>
                </p>
            </div>
        </div>
    );
};

export default Login;
