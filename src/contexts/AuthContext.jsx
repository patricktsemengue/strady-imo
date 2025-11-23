import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 
import { clearCache, clearRemoteCache } from '../services/aiCacheService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authPageInitialMode, setAuthPageInitialMode] = useState('signIn'); // Default mode

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          clearCache();
          if (session?.user) {
            clearRemoteCache(session.user.id, session.access_token);
          }
        }
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
    signOut: async () => {
        clearCache();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await clearRemoteCache(session.user.id, session.access_token);
        }
        await supabase.auth.signOut();
    },
    resetPassword: (email) => supabase.functions.invoke('custom-password-reset', { body: { email } }),
    
    // --- EXPOSER LES NOUVELLES FONCTIONS ---
    updatePassword,
    updateUserData,
    requestRestore: (email) => supabase.functions.invoke('request-restore', { body: { email } }),
    // --- AJOUT DE LA FONCTION DE RESTAURATION ---
    restoreUser: (token) => supabase.functions.invoke('restore-user', { body: { token } }),
    authPageInitialMode,
    setAuthPageInitialMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};