
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User as FirebaseUser
} from 'firebase/auth';
import {
    getDoc,
    doc
} from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
    user: FirebaseUser | null;
    userData: any | null;
    loading: boolean;
    loginAsAdmin: (email: string, pass: string) => Promise<void>;
    loginAsUser: (encryptedId: string, privateKey: string) => Promise<void>;
    signupAsUser: (institution: string, email: string) => Promise<{ encryptedId: string, privateKey: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setUser(fbUser);
            if (fbUser) {
                // If logged in via Firebase Auth, they are an admin
                setIsAdmin(true);
                setUserData({ email: fbUser.email, role: 'admin' });
            } else {
                // Check for custom session in localStorage if needed, 
                // but for now we'll stick to Firebase Auth for Admins 
                // and a custom flow for users.
                const sessionUser = localStorage.getItem('al_falak_user');
                if (sessionUser) {
                    const parsed = JSON.parse(sessionUser);
                    setUserData(parsed);
                    setIsAdmin(false);
                } else {
                    setUserData(null);
                    setIsAdmin(false);
                }
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const loginAsAdmin = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const loginAsUser = async (encryptedId: string, privateKey: string) => {
        const docId = `${encryptedId}_${privateKey}`;
        const userDocRef = doc(db, 'users', docId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            throw new Error('Invalid ID or Private Key');
        }

        const data = { id: userDoc.id, ...userDoc.data() };
        setUserData(data);
        setIsAdmin(false);
        localStorage.setItem('al_falak_user', JSON.stringify(data));
    };

    const signupAsUser = async (institution: string, email: string) => {
        // Generate credentials
        const encryptedId = 'SOVEREIGN-ID-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const privateKey = Math.random().toString(36).substring(2, 12).toUpperCase();
        const docId = `${encryptedId}_${privateKey}`;

        const data = {
            institution,
            email,
            encryptedId,
            privateKey,
            balances: {
                energy: 0,
                transition: 0,
                frontierTech: 0,
                realEstate: 0,
                orbitalEconomy: 0
            },
            cashBalance: 0,
            totalAssetValue: 0,
            monthlyGrowth: 24.5,
            createdAt: new Date().toISOString()
        };

        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'users', docId), data);

        setUserData({ id: docId, ...data });
        setIsAdmin(false);
        localStorage.setItem('al_falak_user', JSON.stringify({ id: docId, ...data }));

        return { encryptedId, privateKey };
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem('al_falak_user');
        setUserData(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            userData,
            loading,
            isAdmin,
            loginAsAdmin,
            loginAsUser,
            signupAsUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
