import hash from 'object-hash';
import { supabase } from '../supabaseClient';

const CACHE_PREFIX = 'ai_cache_';

/**
 * Génère une clé de cache unique pour une requête IA.
 * @param {{ systemPrompt: string, userPrompt: string, taskType: string }} request - La requête à hacher.
 * @returns {string} La clé de cache.
 */
const getCacheKey = (request) => {
  // Nous hachons les prompts et le type de tâche pour assurer l'unicité.
  const key = hash({
    systemPrompt: request.systemPrompt,
    userPrompt: request.userPrompt,
    taskType: request.taskType,
  });
  return `${CACHE_PREFIX}${key}`;
};

/**
 * Récupère une réponse depuis le cache.
 * @param {{ systemPrompt: string, userPrompt: string, taskType: string }} request - La requête IA.
 * @returns {Promise<object | null>} La réponse cachée ou null si elle n'est pas trouvée.
 */
export const getFromCache = async (request) => {
  const cacheKey = getCacheKey(request);

  // --- NIVEAU 1 : Vérification du cache local (rapide) ---
  const localCachedItem = localStorage.getItem(cacheKey);
  if (localCachedItem) {
    const item = JSON.parse(localCachedItem);
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000; // Durée d'un mois en millisecondes
    const isExpired = (new Date().getTime() - item.timestamp) > oneMonthInMs;

    if (!isExpired) {
      console.log('[CACHE] HIT on localStorage (valid)');
      return item.payload;
    } else {
      console.log('[CACHE] HIT on localStorage (expired), removing...');
      localStorage.removeItem(cacheKey); // Nettoyer l'entrée expirée
    }
  }
  console.log('[CACHE] MISS on localStorage, checking Supabase...');

  // --- NIVEAU 2 : Vérification du cache distant (Supabase) ---
  const { data: supabaseData, error } = await supabase
    .from('ai_cache')
    .select('response_payload')
    .eq('request_hash', cacheKey)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = 'single row not found'
    console.error('[CACHE] Error fetching from Supabase cache:', error);
    return null;
  }

  if (supabaseData) {
    console.log('[CACHE] HIT on Supabase');
    const responsePayload = supabaseData.response_payload;

    // --- Réchauffement du cache local ---
    try {
      const itemToStore = {
        payload: responsePayload,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(itemToStore));
      console.log('[CACHE] Warmed up localStorage');
    } catch (e) {
      console.warn('[CACHE] Could not warm up localStorage:', e);
    }

    return responsePayload;
  } else {
    console.log('[CACHE] MISS on Supabase');
    return null;
  }
};

/**
 * Sauvegarde une réponse dans le cache.
 * @param {{ systemPrompt: string, userPrompt: string, taskType: string }} request - La requête IA.
 * @param {object} response - La réponse de l'API à mettre en cache.
 * @param {string} userId - L'ID de l'utilisateur authentifié.
 */
export const setInCache = async (request, response, userId) => {
  const cacheKey = getCacheKey(request);
  console.log('[CACHE] Setting cache in localStorage and Supabase...');
 
  // Lancer les deux écritures en parallèle pour une meilleure performance perçue
  await Promise.all([
    // Tâche 1: Écriture dans le cache distant (Supabase)
    (async () => {
      const { error } = await supabase
        .from('ai_cache')
        .upsert({
            user_id: userId,
            request_hash: cacheKey,
            request_payload: request,
            response_payload: response,
        }, { onConflict: 'request_hash' }); // Specify the column that causes the conflict

      if (error) {
        console.error('[CACHE] Erreur lors de la sauvegarde dans Supabase:', error);
      }
    })(),

    // Tâche 2: Écriture dans le cache local
    (() => {
      try {
        const itemToStore = {
          payload: response,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(itemToStore));
      } catch (e) {
        console.warn('[CACHE] Impossible de sauvegarder dans localStorage:', e);
      }
    })()
  ]);
};

export const clearCache = () => {
    console.log('[CACHE] Clearing local cache...');
    for (const key in localStorage) {
        if (key.startsWith(CACHE_PREFIX)) {
            localStorage.removeItem(key);
        }
    }
};

export const clearRemoteCache = async (userId, accessToken) => {
    console.log('[CACHE] Clearing remote cache...');
    const { error } = await supabase.functions.invoke('clear-ai-cache', {
        body: { user_id: userId },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (error) {
        console.error('[CACHE] Error clearing remote cache:', error);
    }
};