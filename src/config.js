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
