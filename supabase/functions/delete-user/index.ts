// supabase/functions/delete-user/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.2'
// On importe les en-têtes CORS depuis le fichier partagé
import { corsHeaders } from '../_shared/cors.ts'

console.log('Fonction "delete-user" (Soft Delete) initialisée')

Deno.serve(async (req) => {
  // Gérer la requête CORS "preflight"
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Client utilisateur pour s'authentifier
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 2. Récupérer l'ID de l'utilisateur
    const { data: { user }, error: userError } = await userClient.auth.getUser()
    if (userError || !user) {
      console.error('Erreur d\'authentification:', userError?.message)
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }
    const userId = user.id
    console.log(`Demande de SOFT DELETE pour l'utilisateur: ${userId}`)

    // 3. Client Admin pour les actions
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 4. INSCRIRE l'utilisateur dans la table deleted_users
    // (Le 'deleted_at' est géré par la table 'DEFAULT now()')
    console.log(`Insertion dans 'public.deleted_users' pour ${userId}...`)
    const { error: deleteError } = await adminClient
      .from('deleted_users')
      .insert({ user_id: userId })

    // Gérer le cas où l'utilisateur clique plusieurs fois (conflit de clé primaire)
    if (deleteError && deleteError.code !== '23505') { // '23505' est 'unique_violation'
      console.error('Erreur insertion deleted_users:', deleteError.message)
      return new Response(JSON.stringify({ error: 'Erreur lors de la désactivation du compte' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }
    if (deleteError && deleteError.code === '23505') {
       console.log(`L'utilisateur ${userId} est déjà dans la table deleted_users. Continuation...`)
    }

    // 5. BANNNIR l'utilisateur (empêche la ré-authentification)
    console.log(`Bannissement du compte auth pour ${userId}...`)
    const { error: authError } = await adminClient.auth.admin.updateUserById(
      userId,
      { ban_duration: '876000h' } // Bannissement pour ~100 ans
    )

    if (authError) {
      console.error('Erreur de bannissement du compte auth:', authError.message)
      return new Response(JSON.stringify({ error: 'Erreur lors de la finalisation de la désactivation' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    console.log(`Utilisateur ${userId} désactivé et banni (soft delete) avec succès.`)
    
    // 6. Répondre au client
    return new Response(JSON.stringify({ message: 'Compte désactivé avec succès' }), {
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