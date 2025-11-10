// supabase/functions/request-restore/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Fonction "request-restore" initialisée.')

Deno.serve(async (req) => {
  // --- CORRECTION CORS ---
  // Gérer la requête CORS "preflight"
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  // --- FIN CORRECTION ---

  try {
    const { email } = await req.json()
    if (!email) {
      return new Response(JSON.stringify({ error: "L'adresse e-mail est manquante." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    console.log(`Demande de restauration pour l'e-mail: ${email}`)

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Étape 1 : Récupérer l'utilisateur par e-mail pour obtenir son ID
    const { data: { users }, error: userError } = await adminClient.auth.admin.listUsers({ email: email, page: 1, perPage: 1 });
    if (userError) throw userError;

    const user = users && users.length > 0 ? users[0] : null;

    if (!user) {
      console.log(`Aucun utilisateur trouvé pour l'e-mail: ${email}. Réponse générique envoyée.`);
      return new Response(JSON.stringify({ message: 'Si un compte correspondant existe, un e-mail a été envoyé.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Étape 2 : Envoyer un e-mail de récupération qui servira de lien de restauration
    // C'est une astuce sécurisée : l'utilisateur doit prouver son identité en changeant son mot de passe,
    // et nous utiliserons ce signal pour le restaurer via un trigger de base de données.
    const siteUrl = Deno.env.get('VITE_SITE_URL') || 'http://localhost:3000';
    const { error: resetError } = await adminClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth?type=recovery`
    });

    if (resetError) throw resetError

    return new Response(JSON.stringify({ message: 'Si un compte correspondant existe, un e-mail a été envoyé.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Erreur inattendue dans la fonction request-restore:', error.message)
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})