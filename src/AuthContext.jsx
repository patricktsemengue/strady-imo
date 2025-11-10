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
    signIn: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // Intercepter l'erreur de bannissement pour afficher un message personnalisé
      if (error && error.message === 'User is banned') {
        // Créer une nouvelle erreur avec un message plus clair pour l'utilisateur
        const customError = new Error("ACCOUNT_DELETED");
        return { data, error: customError };
      }
      return { data, error };
    },
    signUp: (email, password, displayName) => supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          prenom: displayName,
          displayName: displayName
        }
      }
    }),
    signOut: () => supabase.auth.signOut(),
    resetPassword: (email) => supabase.functions.invoke('custom-password-reset', { body: { email } }),
    
    // --- EXPOSER LES NOUVELLES FONCTIONS ---
    updatePassword,
    updateUserData,
    requestRestore: (email) => supabase.functions.invoke('request-restore', { body: { email } }),
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