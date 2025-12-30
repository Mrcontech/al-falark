
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
    isAdmin: boolean;
    loginAsAdmin: (email: string, pass: string) => Promise<void>;
    loginAsUser: (encryptedId: string, privateKey: string) => Promise<void>;
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
