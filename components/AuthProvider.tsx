import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  role: 'owner' | 'operator';
  name: string;
  business_type?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, role: 'owner' | 'operator', businessType?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const DEMO_USERS = [
  {
    id: '1',
    email: 'owner@rentalbiz.com',
    password: 'demo123',
    name: 'John Owner',
    role: 'owner' as const,
    business_type: 'Rental Management System'
  },
  {
    id: '2',
    email: 'operator@demo.com',
    password: 'demo123',
    name: 'Jane Operator',
    role: 'operator' as const,
    business_type: 'Rental Management System'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('rentalbiz_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('rentalbiz_user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        // Find user in demo users
        const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const userData: User = {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
            business_type: foundUser.business_type
          };
          
          setUser(userData);
          localStorage.setItem('rentalbiz_user', JSON.stringify(userData));
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Email atau password salah' });
        }
      }, 1000); // Simulate network delay
    });
  };

  const signUp = async (email: string, password: string, name: string, role: 'owner' | 'operator', businessType?: string) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = DEMO_USERS.find(u => u.email === email);
        if (existingUser) {
          resolve({ success: false, error: 'Email sudah terdaftar' });
          return;
        }

        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          email,
          name,
          role,
          business_type: businessType
        };

        // In a real app, this would be saved to database
        // For demo, we'll just log the user in
        setUser(newUser);
        localStorage.setItem('rentalbiz_user', JSON.stringify(newUser));
        resolve({ success: true });
      }, 1000); // Simulate network delay
    });
  };

  const signOut = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(null);
        localStorage.removeItem('rentalbiz_user');
        resolve();
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}