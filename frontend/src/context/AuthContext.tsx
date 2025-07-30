import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onIdTokenChanged, User } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path to your firebase.ts file

interface AuthContextType {
  currentUser: User | null;
  currentToken: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const token = await user.getIdToken();
        setCurrentToken(token);
      } else {
        setCurrentToken(null);
        // Optionally clear token from storage if user signs out
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
      setLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // You might want to add logic here to check for a token in localStorage/sessionStorage on initial load
  // and potentially sign in the user silently if a valid token is found.

  return (
    <AuthContext.Provider value={{ currentUser, currentToken, loading }}>
      {!loading && children}
      {/* Optionally show a loading spinner while authentication state is being determined */}
      {loading}
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