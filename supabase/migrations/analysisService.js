import { supabase } from '../supabaseClient';

/**
 * Loads all analyses for a given user.
 * @param {string} userId The user's ID.
 * @returns {Promise<Array|null>} An array of analyses or null on error.
 */
const loadAnalyses = async (userId) => {
    const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading analyses:', error);
        return null;
    }
    return data;
};

/**
 * Deletes a specific analysis by its ID.
 * @param {string} analysisId The ID of the analysis to delete.
 * @returns {Promise<boolean>} True on success, false on error.
 */
const deleteAnalysis = async (analysisId) => {
    const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', analysisId);

    if (error) {
        console.error('Error deleting analysis:', error);
        return false;
    }
    return true;
};

/**
 * Creates or updates an analysis in the database.
 * If an 'id' is provided in the payload, it updates; otherwise, it inserts.
 * @param {object} analysisData The analysis data to upsert.
 * @returns {Promise<object|null>} The upserted analysis data or null on error.
 */
const upsertAnalysis = async (analysisData) => {
    const { data, error } = await supabase
        .from('analyses')
        .upsert(analysisData, { onConflict: 'id' })
        .select()
        .single(); // .single() is crucial to get the upserted row back as an object

    if (error) {
        console.error('Error upserting analysis:', error);
        return null;
    }
    return data;
};


export const analysisService = {
    loadAnalyses,
    deleteAnalysis,
    upsertAnalysis,
    // The old functions can be deprecated or removed
    // saveAnalysis: upsertAnalysis, 
    // updateAnalysis: (id, data) => upsertAnalysis({ ...data, id }),
};