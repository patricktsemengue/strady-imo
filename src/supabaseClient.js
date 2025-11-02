import { createClient } from '@supabase/supabase-js'

// Récupère les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérification pour s'assurer qu'elles sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Les variables d'environnement Supabase (SUPABASE_URL et SUPABASE_ANON_KEY) ne sont pas définies. Veuillez les ajouter à votre fichier .env.local");
}

// Initialise et exporte le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)