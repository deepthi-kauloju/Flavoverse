
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { User } from '../types';
import { apiLogin, apiRegister, updateUser as apiUpdateUser, saveRecipeForUser, unsaveRecipeForUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<Omit<User, 'id' | 'email'>>) => Promise<void>;
  saveRecipe: (recipeId: string) => Promise<void>;
  unsaveRecipe: (recipeId: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string) => {
    const { user: loggedInUser } = await apiLogin({ email });
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  }, []);

  const register = useCallback(async (name: string, email: string) => {
    const { user: newUser } = await apiRegister({ name, email });
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);
  
  const updateProfile = useCallback(async (userData: Partial<Omit<User, 'id' | 'email'>>) => {
    if (!user) throw new Error("Not authenticated");
    const updatedUser = await apiUpdateUser(user.id, userData);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const saveRecipe = useCallback(async (recipeId: string) => {
    if (!user) throw new Error("Not authenticated");
    const updatedUser = await saveRecipeForUser(user.id, recipeId);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const unsaveRecipe = useCallback(async (recipeId: string) => {
    if (!user) throw new Error("Not authenticated");
    const updatedUser = await unsaveRecipeForUser(user.id, recipeId);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    saveRecipe,
    unsaveRecipe,
  }), [user, loading, login, register, logout, updateProfile, saveRecipe, unsaveRecipe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};