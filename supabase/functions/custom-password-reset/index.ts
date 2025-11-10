// supabase/functions/custom-password-reset/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Fonction "custom-password-reset" initialisée.')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    if (!email) {
      return new Response(JSON.stringify({ error: "L'adresse e-mail est manquante." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Étape 1 : Vérifier si l'utilisateur existe
    const { data: { users }, error: userError } = await adminClient.auth.admin.listUsers({ email: email, page: 1, perPage: 1 });
    if (userError) throw userError;

    const user = users && users.length > 0 ? users[0] : null;

    if (!user) {
      // Si l'utilisateur n'existe pas, on renvoie une réponse générique pour des raisons de sécurité.
      console.log(`Tentative de réinitialisation pour un e-mail inexistant: ${email}.`);
      return new Response(JSON.stringify({ message: 'Si un compte existe avec cet e-mail, un lien a été envoyé.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // L'utilisateur existe, on peut continuer les vérifications.
      // Étape 2 : Vérifier si l'utilisateur est dans la table 'deleted_users'
      const { data: deletedData, error: deletedError } = await adminClient
        .from('deleted_users')
        .select('user_id')
        .eq('user_id', user.id)
        .single();
  
      // Si l'utilisateur est trouvé dans deleted_users, il est considéré comme banni.
      if (deletedData) {
        console.log(`Tentative de réinitialisation pour un compte banni: ${email}.`);
        return new Response(JSON.stringify({ status: "ACCOUNT_DELETED" }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
  
      // Étape 3 : Si l'utilisateur existe et n'est pas banni, on envoie l'e-mail.
      const siteUrl = Deno.env.get('VITE_SITE_URL') || 'http://localhost:8888';
  
      console.log(`Tentative de réinitialisation de mot de passe pour l'e-mail: ${email}`);
      const { error: resetError } = await adminClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth?type=recovery`
      });
  
      if (resetError) throw resetError;
    }

    // On renvoie toujours une réponse de succès générique au client.
    return new Response(JSON.stringify({ message: 'Si un compte existe avec cet e-mail, un lien a été envoyé.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Erreur inattendue dans la fonction custom-password-reset:', error.message)
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})