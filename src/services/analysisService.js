import { supabase } from '../supabaseClient';

const loadAnalyses = async (userId) => {
    const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erreur lors du chargement des analyses cloud:", error);
        return [];
    }
    return data;
};

const updateAnalysis = async (id, analysis) => {
    const { data, error } = await supabase
        .from('analyses')
        .update(analysis)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error("Erreur de mise à jour cloud:", error);
        return null;
    }
    return data;
};

const saveAnalysis = async (analysis) => {
    const { data, error } = await supabase
        .from('analyses')
        .insert(analysis)
        .select()
        .single();

    if (error) {
        console.error("Erreur de sauvegarde cloud:", error);
        return null;
    }
    return data;
};

const deleteAnalysis = async (id) => {
    const { error } = await supabase.from('analyses').delete().eq('id', id);
    if (error) {
        console.error("Erreur de suppression cloud:", error);
        return false;
    }
    return true;
};

export const analysisService = {
    loadAnalyses,
    updateAnalysis,
    saveAnalysis,
    deleteAnalysis,
};
