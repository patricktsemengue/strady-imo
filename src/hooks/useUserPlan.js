import React from 'react';
import { supabase } from '../supabaseClient';

export const useUserPlan = (user) => {
    const [userPlan, setUserPlan] = React.useState(null);
    const [maxAnalyses, setMaxAnalyses] = React.useState(3);

    React.useEffect(() => {
        const fetchUserPlan = async () => {
            if (user) {
                const { data: planData, error } = await supabase
                    .from('user_profile_plans')
                    .select('current_ai_credits, profile_plans (plan_name, ai_credits, stored_analysis)')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') {
                    console.error("Error fetching user plan:", error);
                } else if (planData) {
                    setUserPlan(planData);
                    setMaxAnalyses(planData.profile_plans.stored_analysis);
                }
            } else {
                setUserPlan(null);
                setMaxAnalyses(3); // Default for non-logged-in users
            }
        };

        fetchUserPlan();
    }, [user]);

    return { userPlan, maxAnalyses, setUserPlan };
};
