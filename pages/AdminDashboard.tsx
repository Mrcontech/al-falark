import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { collection, setDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AdminDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
    const { logout, isAdmin, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('User Management');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Create User States
    const [newUserId, setNewUserId] = useState('');
    const [newUserKey, setNewUserKey] = useState('');

    // Fund States
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [amountToAdd, setAmountToAdd] = useState('');

    useEffect(() => {
        if (!authLoading) {
            if (isAdmin) {
                fetchUsers();
            } else {
                // If not an admin, redirect back to landing
                onNavigate('landing');
            }
        }
    }, [authLoading, isAdmin]);

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
        } catch (err) {
            console.error("Error fetching users:", err);
            setMessage({ text: 'Access Denied: You must be an administrator to view user data.', type: 'error' });
        }
    };

    const generateCredentials = () => {
        const id = 'SOVEREIGN-ID-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const key = Math.random().toString(36).substring(2, 12).toUpperCase();
        setNewUserId(id);
        setNewUserKey(key);
    };

    const handleCreateUser = async () => {
        if (!newUserId || !newUserKey) return;
        setLoading(true);
        try {
            const docId = `${newUserId}_${newUserKey}`;
            await setDoc(doc(db, 'users', docId), {
                encryptedId: newUserId,
                privateKey: newUserKey,
                balances: {
                    energy: 0,
                    transition: 0,
                    frontierTech: 0,
                    realEstate: 0,
                    orbitalEconomy: 0
                },
                totalAssetValue: 0,
                createdAt: new Date().toISOString()
            });
            setMessage({ text: 'User created successfully', type: 'success' });
            fetchUsers();
        } catch (err) {
            setMessage({ text: 'Error creating user', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddFunds = async () => {
        if (!selectedUser || !amountToAdd) return;
        setLoading(true);
        try {
            const amount = parseFloat(amountToAdd);

            // Randomly distribute across 5 sectors
            const sectors = ['energy', 'transition', 'frontierTech', 'realEstate', 'orbitalEconomy'];
            const weights = sectors.map(() => Math.random());
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            const distribution = weights.map(w => (w / totalWeight) * amount);

            const userDoc = users.find(u => u.id === selectedUser);
            if (!userDoc) throw new Error("User not found");

            const newBalances = { ...userDoc.balances };

            sectors.forEach((sector, i) => {
                newBalances[sector] = (newBalances[sector] || 0) + distribution[i];
            });

            const newTotal = Object.values(newBalances).reduce((a: any, b: any) => a + b, 0) as number;

            await updateDoc(doc(db, 'users', selectedUser), {
                balances: newBalances,
                totalAssetValue: newTotal
            });

            setMessage({ text: `Successfully distributed $${amount.toLocaleString()} to user`, type: 'success' });
            setAmountToAdd('');
            fetchUsers();
        } catch (err) {
            setMessage({ text: 'Error adding funds', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-novarc-dark text-white flex">
            {/* Sidebar */}
            <aside className="w-72 border-r border-white/5 bg-novarc-dark flex flex-col p-8">
                <div className="flex items-center gap-3 mb-16">
                    <svg viewBox="0 0 100 100" className="w-8 h-8 fill-novarc-accent">
                        <path d="M50 5 L90 50 L50 95 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                        <circle cx="50" cy="50" r="15" />
                    </svg>
                    <span className="text-lg font-bold tracking-[0.3em]">ADMIN PORTAL</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {['User Management', 'Fund Distribution'].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item)}
                            className={`w-full text-left block px-4 py-4 text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${activeTab === item ? 'text-novarc-accent bg-white/5 border-r-2 border-novarc-accent' : 'text-white/40 hover:text-white'}`}
                        >
                            {item}
                        </button>
                    ))}
                </nav>

                <button onClick={logout} className="mt-auto text-[10px] uppercase tracking-[0.3em] text-rose-400 py-3 border border-rose-400/20 hover:bg-rose-400/10 transition-colors">
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12">
                <header className="mb-12">
                    <span className="text-novarc-accent text-[11px] font-bold uppercase tracking-[0.5em] block mb-2">Administrative Control</span>
                    <h1 className="text-4xl font-light tracking-tighter">{activeTab}</h1>
                </header>

                {message.text && (
                    <div className={`p-4 mb-8 text-[11px] uppercase tracking-widest border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                        {message.text}
                    </div>
                )}

                {activeTab === 'User Management' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                            <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Generate New Access</h3>
                            <div className="space-y-6">
                                <button
                                    onClick={generateCredentials}
                                    className="w-full bg-white/5 border border-white/10 py-4 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors"
                                >
                                    Generate New ID & Key
                                </button>

                                {newUserId && (
                                    <div className="space-y-4 p-4 bg-black/20 border border-white/5">
                                        <div>
                                            <label className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">Encrypted ID</label>
                                            <div className="text-novarc-accent font-mono text-sm">{newUserId}</div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] uppercase tracking-widest text-white/30 block mb-1">Private Key</label>
                                            <div className="text-novarc-accent font-mono text-sm">{newUserKey}</div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    disabled={!newUserId || loading}
                                    onClick={handleCreateUser}
                                    className="w-full bg-novarc-accent text-white py-4 text-[11px] uppercase tracking-[0.4em] font-bold hover:brightness-110 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Registering...' : 'Create User Mandate'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                            <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Active Mandates</h3>
                            <div className="overflow-y-auto max-h-[400px] space-y-4">
                                {users.map(user => (
                                    <div key={user.id} className="p-4 border border-white/5 hover:bg-white/5 transition-colors">
                                        <div className="text-[11px] font-bold text-white">{user.encryptedId}</div>
                                        <div className="text-[9px] text-white/40 uppercase tracking-widest mt-1">
                                            Assets: ${user.totalAssetValue?.toLocaleString() || 0}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Fund Distribution' && (
                    <div className="max-w-2xl bg-white/5 border border-white/10 p-8 rounded-sm">
                        <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-white/60 mb-8">Allocate Capital</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Select Target User</label>
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm outline-none focus:border-novarc-accent transition-colors"
                                >
                                    <option value="" className="bg-novarc-dark">Select a Mandate</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id} className="bg-novarc-dark">{u.encryptedId}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Allocation Amount (USD)</label>
                                <input
                                    type="number"
                                    value={amountToAdd}
                                    onChange={(e) => setAmountToAdd(e.target.value)}
                                    placeholder="e.g. 100000"
                                    className="w-full bg-white/5 border border-white/10 p-4 text-white text-sm outline-none focus:border-novarc-accent transition-colors"
                                />
                            </div>

                            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20">
                                <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-widest italic">
                                    Note: Funds will be distributed randomly across Energy, Transition, Frontier Tech, Real Estate, and Orbital Economy sectors to ensure diversified sovereign exposure.
                                </p>
                            </div>

                            <button
                                disabled={!selectedUser || !amountToAdd || loading}
                                onClick={handleAddFunds}
                                className="w-full bg-novarc-accent text-white py-4 text-[11px] uppercase tracking-[0.4em] font-bold hover:brightness-110 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Transferring...' : 'Execute Distribution'}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
