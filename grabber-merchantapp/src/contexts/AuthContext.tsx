import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from './FirebaseContext';
import toast from 'react-hot-toast';

interface AuthUser extends User {
  role?: 'merchant' | 'admin';
  merchantId?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'merchant' | 'admin') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { auth, db } = useFirebase();

  const login = async (email: string, password: string) => {
    try {
      // Mock authentication - bypass Firebase for demo
      if (email && password) {
        // Create a mock user object
        const mockUser = {
          uid: `mock_${Date.now()}`,
          email: email,
          emailVerified: true,
          displayName: email.split('@')[0],
          photoURL: null,
          phoneNumber: null,
          providerId: 'mock',
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString()
          }
        } as User;

        // Determine role based on email
        const role = email.includes('admin') ? 'admin' : 'merchant';
        const merchantId = role === 'merchant' ? `M${Date.now()}` : null;

        const userWithRole = {
          ...mockUser,
          role: role,
          merchantId: merchantId
        } as AuthUser;

        setCurrentUser(userWithRole);
        toast.success('Successfully logged in! (Mock Authentication)');
        return;
      }

      // Fallback to Firebase auth if needed
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user profile exists, if not create a default one
      let userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create default user profile for demo purposes
        const defaultRole = email.includes('admin') ? 'admin' : 'merchant';
        const userData = {
          email: result.user.email,
          role: defaultRole,
          merchantId: defaultRole === 'merchant' ? `M${Date.now()}` : null,
          createdAt: new Date().toISOString(),
          emailVerified: true // Skip email verification
        };
        
        await setDoc(doc(db, 'users', result.user.uid), userData);
        userDoc = await getDoc(doc(db, 'users', result.user.uid));
      }
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userWithRole = {
          ...result.user,
          role: userData.role,
          merchantId: userData.merchantId
        } as AuthUser;
        setCurrentUser(userWithRole);
        toast.success('Successfully logged in!');
      } else {
        throw new Error('User profile not found');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (email: string, password: string, role: 'merchant' | 'admin') => {
    try {
      // Mock registration - bypass Firebase for demo
      if (email && password) {
        // Create a mock user object
        const mockUser = {
          uid: `mock_${Date.now()}`,
          email: email,
          emailVerified: true,
          displayName: email.split('@')[0],
          photoURL: null,
          phoneNumber: null,
          providerId: 'mock',
          metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString()
          }
        } as User;

        const userWithRole = {
          ...mockUser,
          role: role,
          merchantId: role === 'merchant' ? `M${Date.now()}` : null
        } as AuthUser;

        setCurrentUser(userWithRole);
        toast.success('Account created successfully! (Mock Authentication - No OTP required)');
        return;
      }

      // Fallback to Firebase auth if needed
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile immediately without email verification
      const userData = {
        email: result.user.email,
        role: role,
        merchantId: role === 'merchant' ? `M${Date.now()}` : null,
        createdAt: new Date().toISOString(),
        emailVerified: true // Skip email verification
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData);
      
      const userWithRole = {
        ...result.user,
        role: userData.role,
        merchantId: userData.merchantId
      } as AuthUser;
      
      setCurrentUser(userWithRole);
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // For mock users, just clear the state
      if (currentUser?.providerId === 'mock') {
        setCurrentUser(null);
        toast.success('Successfully logged out!');
        return;
      }

      // For Firebase users, sign out normally
      await signOut(auth);
      setCurrentUser(null);
      toast.success('Successfully logged out!');
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          let userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (!userDoc.exists()) {
            // Create default profile if it doesn't exist
            const defaultRole = user.email?.includes('admin') ? 'admin' : 'merchant';
            const userData = {
              email: user.email,
              role: defaultRole,
              merchantId: defaultRole === 'merchant' ? `M${Date.now()}` : null,
              createdAt: new Date().toISOString(),
              emailVerified: true
            };
            
            await setDoc(doc(db, 'users', user.uid), userData);
            userDoc = await getDoc(doc(db, 'users', user.uid));
          }
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              ...user,
              role: userData.role,
              merchantId: userData.merchantId
            } as AuthUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // Only clear if it's not a mock user
        if (!currentUser?.providerId || currentUser.providerId !== 'mock') {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, db, currentUser?.providerId]);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};