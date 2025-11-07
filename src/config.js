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
    rendementNet: [
        { threshold: 7, points: 40 },
        { threshold: 5, points: 30 },
        { threshold: 3, points: 15 }
    ],
    cashflowMensuel: [
        { threshold: 100, points: 40 },
        { threshold: 0, points: 30 },
        { threshold: -150, points: 10 }
    ],
    ratioApport: [
        { threshold: 20, points: 10 },
        { threshold: 30, points: 5 }
    ],
    grades: [
        { threshold: 75, grade: 'A', motivation: "Projet très favorable. Excellent potentiel !" },
        { threshold: 50, grade: 'B', motivation: "Projet mitigé. Analysez les possibilités d'optimisation." },
        { threshold: 0, grade: 'C', motivation: "Projet non favorable. Le risque est élevé." }
    ]
};