import { useContext } from 'react';
import { AuthContext } from '../components/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Add wrapper functions for compatibility
  const login = (userData: any) => {
    return context.signIn(userData.email, userData.password);
  };

  const logout = () => {
    return context.signOut();
  };

  const register = (userData: any) => {
    return context.signUp(userData.email, userData.password, userData.name, userData.role);
  };

  return {
    ...context,
    login,
    logout,
    register
  };
}