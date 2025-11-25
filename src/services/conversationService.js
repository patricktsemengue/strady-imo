import { supabase } from '../supabaseClient';

// Get the most recent conversation for a user, or create a new one if none exists
export const getOrCreateConversation = async (userId, title = 'Nouvelle Conversation') => {
    // First, try to get the most recent conversation
    let { data: conversations, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

    if (fetchError) {
        console.error('Error fetching conversation:', fetchError);
        throw fetchError;
    }

    if (conversations && conversations.length > 0) {
        return conversations[0];
    }

    // If no conversation exists, create a new one
    const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({ user_id: userId, title: title })
        .select()
        .single();

    if (createError) {
        console.error('Error creating conversation:', createError);
        throw createError;
    }

    return newConversation;
};

// Get all messages for a conversation
export const getMessages = async (conversationId) => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }

    return data;
};

// Add a new message to a conversation
export const addMessage = async (message) => {
    const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();
    
    if (error) {
        console.error('Error adding message:', error);
        throw error;
    }

    return data;
};

// Log token usage for an AI interaction
export const logTokenUsage = async (usageData) => {
    const { error } = await supabase
        .from('token_usage_logs')
        .insert(usageData);

    if (error) {
        console.error('Error logging token usage:', error);
        // We don't throw here because logging failure should not break the user flow.
    }
};

export const conversationService = {
    getOrCreateConversation,
    getMessages,
    addMessage,
    logTokenUsage,
};
