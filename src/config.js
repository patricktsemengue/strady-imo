export const prePromptConfig = [
  {
      category: '👋 Détail du bien',
      prompts: [
        'Extraire les informations (type de bien, surface, PEB, commune... de l\'annonce suivante : [INSÉRER ICI L\'URL ou LE TEXTE DE L\'ANNONCE\]' 
      ]
    },
    {
      category: '🏛️ Fiscalité & Taxes',
      prompts: [
        'Conditions TVA 6% rénovation',
        'Calcul droits d\'enregistrement (Wallonie vs. Bruxelles)',
        //"Qu'est-ce que le précompte immobilier ?"
      ]
    },
    {
      category: '📜 Location & Bail',
      prompts: [
        'Obligations du bailleur (bail 9 ans)',
        'Comment indexer un loyer cette année ?',
        'Tension locative dans la commune ... ?'
      ]
    },
    {
      category: '🏗️ Travaux & Réglementation',
      prompts: [
        'Quelles sont les obligations liées au score PEB ?',
        "Faut-il un permis d'urbanisme pour... ?",
        //"Plan urbanistique communal de Namur"
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