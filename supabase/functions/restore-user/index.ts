// supabase/functions/restore-user/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Fonction "restore-user" initialisée.')

Deno.serve(async (req) => {
  // Gérer la requête CORS "preflight"
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // --- NOUVELLE LOGIQUE : RESTAURATION VIA TOKEN ---
    // La fonction reçoit maintenant un token de confirmation.
    const { token } = await req.json();
    if (!token) {
      return new Response(JSON.stringify({ error: "Token de restauration manquant." }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 1. Créer un client admin pour vérifier le token et effectuer les opérations
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 2. Échanger le token contre les informations de l'utilisateur (sans le connecter)
    const { data: { user }, error: tokenError } = await adminClient.auth.verifyOtp({ token_hash: token, type: 'signup' });
    if (tokenError || !user) {
      return new Response(JSON.stringify({ error: "Token invalide ou expiré." }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const userIdToRestore = user.id;

    console.log(`Demande de restauration pour l'utilisateur: ${userIdToRestore}`)

    // Étape 3 : Lever le bannissement de l'utilisateur dans Supabase Auth
    console.log(`Levée du bannissement pour ${userIdToRestore}...`)
    const { error: unbanError } = await adminClient.auth.admin.updateUserById(
      userIdToRestore,
      { ban_duration: 'none' } // 'none' est la valeur pour lever un bannissement
    )

    if (unbanError) {
      console.error('Erreur lors de la levée du bannissement:', unbanError.message)
      return new Response(JSON.stringify({ error: 'Erreur lors de la réactivation du compte.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Étape 4 : Supprimer l'utilisateur de la table 'deleted_users'
    console.log(`Suppression de ${userIdToRestore} de la table 'deleted_users'...`)
    const { error: deleteRecordError } = await adminClient
      .from('deleted_users')
      .delete()
      .eq('user_id', userIdToRestore)

    if (deleteRecordError) {
      console.error("Erreur lors de la suppression de l'enregistrement dans 'deleted_users':", deleteRecordError.message)
      // À ce stade, l'utilisateur peut se connecter mais ne verra pas ses données.
      // C'est une situation à gérer manuellement si elle se produit.
    }

    console.log(`Utilisateur ${userIdToRestore} restauré avec succès.`)

    return new Response(JSON.stringify({ message: 'Utilisateur restauré avec succès.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Erreur inattendue dans la fonction:', error.message)
    return new Response(JSON.stringify({ error: 'Erreur interne du serveur' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})