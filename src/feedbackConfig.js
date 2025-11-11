export const feedbackQuestionsConfig = {
    // Questions génériques si aucune zone spécifique n'est choisie
    generic: {
        bug: [
            { id: 'bug_reproduce', question: 'Comment pouvons-nous reproduire ce bug ?', placeholder: 'Ex: 1. Je vais sur la page X. 2. Je clique sur Y. 3. L\'application se bloque.', type: 'textarea' },
            { id: 'bug_expected', question: 'Quel était le comportement attendu ?', placeholder: 'Ex: La fenêtre Z aurait dû s\'ouvrir.', type: 'text' },
        ],
        suggestion: [
            { id: 'suggestion_problem', question: 'Quel problème ou besoin cette suggestion résoudrait-elle pour vous ?', placeholder: 'Ex: Cela m\'éviterait de devoir calculer manuellement X.', type: 'textarea' },
            { id: 'suggestion_importance', question: 'Sur une échelle de 1 (peu important) à 5 (très important), quelle est l\'importance de cette suggestion pour vous ?', type: 'select', options: [1, 2, 3, 4, 5] },
        ],
    },
    // Questions spécifiques par fonctionnalité
    analyse_bien: {
        suggestion: [
            { id: 'analyse_bien_add', question: 'Quels champs ou informations supplémentaires sur le bien seraient utiles ?', placeholder: 'Ex: Le nombre de places de parking, la présence d\'un jardin...', type: 'textarea' },
        ],
    },
    analyse_financement: {
        suggestion: [
            { id: 'analyse_financement_add', question: 'Quels autres paramètres de financement aimeriez-vous pouvoir simuler ?', placeholder: 'Ex: Un prêt à taux variable, la durée de l\'assurance emprunteur...', type: 'textarea' },
        ],
    },
    analyse_loyer: {
        suggestion: [
            { id: 'analyse_loyer_add', question: 'Quels autres types de revenus ou charges locatives souhaiteriez-vous inclure ?', placeholder: 'Ex: La location de garages, des charges de copropriété spécifiques...', type: 'textarea' },
        ],
    },
    analyse_resultats: {
        suggestion: [
            { id: 'analyse_resultats_kpi', question: 'Quel autre indicateur de performance (KPI) serait pertinent pour vous ?', placeholder: 'Ex: Le Taux de Rendement Interne (TRI), la Valeur Actuelle Nette (VAN)...', type: 'textarea' },
        ],
    },
    dashboard: {
        suggestion: [
            { id: 'dashboard_feature', question: 'Quelle fonctionnalité vous manque-t-il pour mieux comparer ou gérer vos analyses ?', placeholder: 'Ex: Un outil de tri par rentabilité, la possibilité de mettre des étiquettes...', type: 'textarea' },
        ],
    },
    ia_assistant: {
        bug: [
            { id: 'ia_bug_prompt', question: 'Quel était le texte ou l\'URL que vous avez analysé ?', placeholder: 'Collez ici le texte ou l\'URL qui a causé le problème.', type: 'textarea' },
            { id: 'ia_bug_expected', question: 'Quel type d\'information attendiez-vous que l\'IA extraie ?', placeholder: 'Ex: Je m\'attendais à ce qu\'elle trouve le revenu cadastral.', type: 'text' },
        ],
        suggestion: [
            { id: 'ia_suggestion_prompt', question: 'Quelle nouvelle "action rapide" (prompt) serait la plus utile pour vous ?', placeholder: 'Ex: "Analyser les risques liés à l\'urbanisme" ou "Estimer le budget de rafraîchissement".', type: 'textarea' },
        ],
    },
    rapport: {
        suggestion: [
            { id: 'rapport_add', question: 'Quelle information ou quel graphique supplémentaire aimeriez-vous voir dans le rapport final ?', placeholder: 'Ex: Un tableau d\'amortissement du prêt, une projection sur 10 ans...', type: 'textarea' },
        ],
    },
    account: {
        suggestion: [
            { id: 'account_feature', question: 'Quelle fonctionnalité ou information manque-t-il à votre espace personnel ?', placeholder: 'Ex: Un historique de facturation, des statistiques d\'utilisation...', type: 'textarea' },
        ],
    },
};