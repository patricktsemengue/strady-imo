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

    // 4. MARQUER les données comme supprimées
    const now = new Date().toISOString()
    
    // 4a. Marquer les 'analyses'
    console.log(`Marquage des 'analyses' pour ${userId}...`)
    const { error: dataError } = await adminClient
      .from('analyses')
      .update({ deleted_at: now })
      .eq('user_id', userId)
      .is('deleted_at', null)

    if (dataError) {
      console.error('Erreur soft-delete analyses:', dataError.message)
      return new Response(JSON.stringify({ error: 'Erreur lors de la suppression des analyses' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // 4b. Marquer les 'feedbacks'
    console.log(`Marquage des 'feedbacks' pour ${userId}...`)
    const { error: feedbackError } = await adminClient
      .from('feedbacks')
      .update({ deleted_at: now })
      .eq('user_id', userId)
      .is('deleted_at', null)

    if (feedbackError) {
      console.error('Erreur soft-delete feedbacks:', feedbackError.message)
      return new Response(JSON.stringify({ error: 'Erreur lors de la suppression des feedbacks' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // 5. BANNNIR l'utilisateur
    console.log(`Bannissement du compte auth pour ${userId}...`)
    const { error: authError } = await adminClient.auth.admin.updateUserById(
      userId,
      { ban_duration: '100y' }
    )

    if (authError) {
      console.error('Erreur de bannissement du compte auth:', authError.message)
      throw authError
    }

    console.log(`Utilisateur ${userId} banni (soft delete) avec succès.`)
    
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