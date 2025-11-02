import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --- NOUVELLES FONCTIONS DE MISE À JOUR ---
  const updatePassword = async (password) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    // Mettre à jour l'état local 'user' si la mise à jour réussit
    if (!error) setUser(data.user);
    return { error };
  };

  const updateUserData = async (userData) => {
    // 'userData' doit être un objet, ex: { prenom: "NouveauPrénom" }
    const { data, error } = await supabase.auth.updateUser({ data: userData });
    // Mettre à jour l'état local 'user' si la mise à jour réussit
    if (!error) setUser(data.user);
    return { error };
  };
  // ----------------------------------------

  const value = {
    user,
    loading,
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signUp: (email, password, prenom) => supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          prenom: prenom 
        }
      }
    }),
    signOut: () => supabase.auth.signOut(),
    resetPassword: (email) => supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin, 
    }),
    
    // --- EXPOSER LES NOUVELLES FONCTIONS ---
    updatePassword,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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