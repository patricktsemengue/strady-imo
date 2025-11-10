export const prePromptConfig = [
  {
    category: '👋 Analyse de l\'annonce',
    prompts: [
      'Extraire la description du bien',
      'Estimer les travaux à prévoir',
      'Estimer les loyers potentiels',
      'Identifier les points forts et faibles du bien',
      'Analyser le quartier et ses commodités'
    ]
  },
  {
    category: '🏦 Financement & Marché',
    prompts: [
      'Vérifier les taux d\'intérêts sur 15, 20, 25, 30 ans',
    ]
  },
  {
    category: '🏛️ Fiscalité & Légalité',
    prompts: [
      'Conditions TVA 6% rénovation',
      'Calcul droits d\'enregistrement (Wallonie vs. Bruxelles)',
      'Obligations du bailleur (bail 9 ans)',
      'Aides et subventions disponibles'
    ]
  }
];

export const scoreConfig = {
    cashflowScore: [
        { grade: 'A', minYears: 0, maxYears: 5, cashOnCash: 20, comment: "Rendement exceptionnel, équivalent à des placements de type startups ou cryptomonnaies." },
        { grade: 'B', minYears: 5, maxYears: 10, cashOnCash: 10, comment: "Très bon rendement, comparable à des actions ou ETF dynamiques." },
        { grade: 'C', minYears: 10, maxYears: 15, cashOnCash: 7, comment: "Rendement courant pour l’immobilier résidentiel bien situé." },
        { grade: 'D', minYears: 15, maxYears: 20, cashOnCash: 5, comment: "Rendement conservateur typique de biens patrimoniaux." },
        { grade: 'E', minYears: 20, maxYears: Infinity, cashOnCash: 4, comment: "Rendement faible (voire négatif), comparable à des produits d’assurance-vie ou comptes épargne." }
    ]
};