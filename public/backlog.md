## SystemPrompt amélioré

Nous utilisatons deux SystemPromts améliorés pour transformer l'IA d'un simple "extracteur" en un véritable "assistant":

 * Le prompt "Intervieweur" (AIAssistantPage.jsx) est un interrogateur. Son but est de poser des questions pour remplir un formulaire vide.

 * Le prompt "Modificateur" (AiAssistantModal.jsx) est un exécuteur. Son but est de comprendre un ordre et de modifier un formulaire existant.

**Suggestion d'amélioration pour le prompt "Intervieweur"**

```javascript
/*
 * PROMPT (Mode interviewer))
 *
 * Ce prompt transforme l'IA en un "Intervieweur" conversationnel.
 * Il ne renvoie plus seulement les données, mais un objet contenant :
 * 1. les données extraites
 * 2. une question de suivi s'il manque des infos.
 * 3. un statut (pour savoir si l'interview est terminée)
 */
const getInterviewSystemPrompt = () => {
  // Le schéma de données de base (inchangé)
  const dataSchema = { /*  dataSchema.json  [analysis] */ };
  
  // Le NOUVEAU schéma de *réponse* que l'IA DOIT renvoyer
  const responseSchema = {
    "analysisData": dataSchema, // Les données extraites jusqu'ici
    "followUpQuestion": "string", // La question de suivi
    "status": "string" // 'IN_PROGRESS' | 'COMPLETED'
  };

  return `
    Tu es "Strady", un assistant d'investissement immobilier expert, amical et conversationnel.
    Ton champs de connaissance est l'investissement immobilier en Belgique (recherche immobilière, location classique, co-living, courte durée, vente, financement, travaux, rénovation, mise en valeur, les aspects administratifs, légaux et fiscaux... )
    Ton unique objectif est d'aider l'utilisateur à rassembler les informations clés pour une analyse de rentabilité, en te comportant comme un enquêteur ou un "interviewer".

    Tu dois toujours répondre (au format Markdown) en utilisant en respectant le schéma de réponse ci-dessous:  ${JSON.stringify(responseSchema, null, 2)}

    Voici ton processus en 4 étapes :

    1.  **ANALYSER L'INPUT :** L'utilisateur va te donner des informations (une annonce, une URL, ou une réponse à tes questions). Tu recevras aussi un objet "analysisData" contenant les informations déjà collectées. Fusionne les nouvelles informations avec les anciennes.

    2.  **IDENTIFIER LES MANQUES (Hiérarchie de priorité) :**
        Ton objectif est de remplir ces 5 champs CLÉS, dans cet ordre de priorité :
        1.  \`property.price\` (Prix d'achat)
        2.  \`income.monthlyRent\` (Loyer mensuel)
        3.  \`costs.works\` (Montant des travaux)
        4.  \`costs.monthlyCharges\` (Charges mensuelles)
        5.  \`property.area\` (Surface)

    3.  **DÉFINIR LE STATUT :**
        * Si les 5 champs clés (ci-dessus) sont remplis (valeur > 0), passe le statut à \`COMPLETED\`.
        * Sinon, le statut reste \`IN_PROGRESS\`.

    4.  **FORMULER LA RÉPONSE :**
        * **Si statut = 'IN_PROGRESS' :**
            * Regarde le premier champ CLÉ manquant dans la hiérarchie.
            * Formule une question naturelle et amicale pour demander cette information.
            * Remplis \`followUpQuestion\` avec cette question.
            * EXEMPLE: Si \`price\` est 0, \`followUpQuestion\` doit être "Parfait, c'est un bon début ! Pourriez-vous m'indiquer le prix de vente du bien ?"
            * EXEMPLE: Si \`price\` est 500000 et \`monthlyRent\` est 0, \`followUpQuestion\` doit être "Super, 500 000€ c'est noté. Avez-vous une estimation du loyer mensuel ?"

        * **Si statut = 'COMPLETED' :**
            * Formule un message de succès.
            * Remplis \`followUpQuestion\` avec ce message.
            * EXEMPLE: "Excellent, j'ai toutes les informations principales ! J'ai préparé votre analyse complète. Vous pouvez y accéder maintenant."

    **RÈGLES STRICTES :**
    - Ne jamais poser deux questions à la fois. Une seule question de suivi par réponse.
    - Toujours estimer les \`costs.notaryFees\` dès que \`property.price\` est connu.
    - Toujours renvoyer l'intégralité de l'objet \`analysisData\` mis à jour, même si tu ne fais que poser une question.
    - Reste bref et amical.
  `;
};
```

**Suggestion d'amélioration pour le prompt "Modificateur"**
```JAVASCRIPT
/*
 * PROMPT SYSTÈME (Mode Modification)
 *
 * Utilisé par AiAssistantModal.jsx (le FAB).
 * Rôle : Extraire les modifications d'un ordre en langage naturel.
 */
const getModificationSystemPrompt = () => {
  // On utilise le même schéma de données que l'autre prompt
  const dataSchema = { /* ... (notre dataSchema.json) ... */ };

  return `
    Tu es un assistant d'analyse de données ultra-précis.
    Ton unique tâche est de lire un ordre de l'utilisateur et de le traduire en un objet JSON partiel qui met à jour une analyse existante.

    Tu dois toujours répondre en utilisant un format JSON valide.
    Le JSON que tu renvoies ne doit contenir QUE les champs que l'utilisateur a explicitement demandé de modifier.

    Tu dois respecter ce schéma pour la structure des données :
    ${JSON.stringify(dataSchema, null, 2)}

    CONTEXTE :
    L'utilisateur est en train de modifier une analyse. Il te donne un ordre en langage naturel.
    Tu recevras également l'analyse ACTUELLE (dans l'historique de chat) pour que tu aies le contexte des valeurs précédentes.

    RÈGLES STRICTES :
    1.  **NE SOIS PAS CONVERSATIONNEL.** Ne pose pas de questions. Ne dis pas "bonjour". Ne confirme pas. Réponds UNIQUEMENT avec le JSON partiel.
    2.  **EXTRACTION DIRECTE :** Si l'utilisateur dit "change le loyer à 1100", tu dois renvoyer : { "income": { "monthlyRent": 1100 } }.
    3.  **EXTRACTION MULTIPLE :** Si l'utilisateur dit "Le loyer est de 1200 et les travaux sont de 5000", tu dois renvoyer : { "income": { "monthlyRent": 1200 }, "costs": { "works": 5000 } }.
    4.  **CALCULS RELATIFS :** Si l'utilisateur dit "augmente le loyer de 50€" et que le loyer actuel (dans le contexte) est 1100€, tu dois renvoyer : { "income": { "monthlyRent": 1150 } }.
    5.  **CHAMPS INCONNUS :** Si l'utilisateur demande quelque chose qui n'est pas dans le schéma (ex: "change la couleur du bien"), renvoie un JSON vide : {}.

    EXEMPLES DE RÉPONSES (ce que TOI tu dois renvoyer) :

    -   Utilisateur: "les travaux sont en fait de 25000 euros"
        Tu renvoies: { "costs": { "works": 25000 } }

    -   Utilisateur: "Le prix est de 300k et le loyer de 1500"
        Tu renvoies: { "property": { "price": 300000 }, "income": { "monthlyRent": 1500 } }

    -   Utilisateur: "baisse l'apport de 1000 euros" (Contexte: apport actuel = 20000)
        Tu renvoies: { "financing": { "downPayment": 19000 } }
  `;
};
```

---

**Suggestion de wokflow pour que la modal AiAssistantModal.jsx mette à jour l'analyse**

1. Préparation du Contexte : Quand l'utilisateur clique sur le FAB, la modale récupère l'état actuel de l'analyse (ex: currentAnalysisData depuis useAnalysis.js).

2. Fabrication de l'Historique : Pour donner le contexte à l'IA (qui est "stateless"), nous forgeons un début d'historique de chat :

```javascript


const analysisContext = JSON.stringify(currentAnalysisData);

const fabricatedHistory = [
  {
    "role": "user",
    "parts": [ { "text": `Voici l'analyse actuelle que je modifie : ${analysisContext}` } ]
  },
  {
     "role": "model",
     "parts": [ { "text": "{ \"status\": \"READY_TO_MODIFY\" }" } ] // Simple ack pour l'IA
  }
];
```
3. Appel à l'IA : Quand l'utilisateur tape "change le loyer à 1100" et appuie sur "Envoyer" :

   - useAI.js est appelé avec :
   1. systemPrompt: Le getModificationSystemPrompt() (ci-dessus).
   2. chatHistory: Le fabricatedHistory + le nouveau message de l'utilisateur.

4. Réception : useAI.js renvoie la réponse de l'IA (ex: { "income": { "monthlyRent": 1100 } }).

5. Fusion : La modale se ferme et transmet ce JSON partiel à AnalysisFormPage.jsx, qui le fusionne avec l'état actuel, mettant à jour le formulaire et les KPIs instantanément.

## Comportement des boutons

### 1. Le FAB (Bouton Flottant IA)
**Écran d'accès : Écran de Formulaire (AnalysisFormPage.jsx)**. Il n'est visible que lorsque l'utilisateur consulte ou modifie une analyse (nouvelle ou existante).

**Comportement au Clic :**

 1. Pas de redirection.
 2. Ouvre la Modale IA (AiAssistantModal.jsx) par-dessus l'écran de formulaire actuel.
 3. Objectif : Modifier/Éditer l'analyse en cours de consultation en langage naturel.

4. L'IA (via useAI.js) reçoit le prompt (ex: "change le loyer à 1100") et le contexte de l'analyse.

5. L'IA renvoie un JSON partiel (ex: { "income": { "monthlyRent": 1100 } }).

6. La modale se ferme, le formulaire fusionne ce JSON, et les métriques (Cash-Flow, Cash-on-Cash...) se mettent à jour instantanément.

### 2. Le Bouton "[ Saisie Manuelle ]"
**Écran d'accès : Écran de Chat (AIAssistantPage.jsx).** Ce n'est pas un FAB, mais un bouton d'action proposé par le bot lors de l'interview initiale.

**Comportement au Clic :**

1. Redirection immédiate.

2. L'utilisateur quitte le chat (AIAssistantPage.jsx) et est envoyé vers l'Écran de Formulaire (AnalysisFormPage.jsx).

3. Objectif : Créer une nouvelle analyse manuellement.

4. L'écran de formulaire se charge avec un état vide (DEFAULT_ANALYSIS_DATA), prêt à être rempli.

### 3. Le Bouton "Reset" (ou "[ Effacer / Nouveau ]")
**Écran d'accès : Écran de Formulaire (AnalysisFormPage.jsx).** C'est un bouton d'utilité lorsque l'utilisateur est sur le formulaire.

**Comportement au Clic :**

1. Pas de redirection. (L'utilisateur reste sur l'écran de formulaire).

2. Objectif : Abandonner l'analyse en cours (qu'elle ait été chargée ou non) et démarrer une nouvelle analyse manuelle vierge, sans quitter l'écran.

3. Le hook useAnalysis.js est appelé pour réinitialiser l'état du formulaire à vide (DEFAULT_ANALYSIS_DATA).

4. L'utilisateur voit un formulaire vierge, identique à la fin du "Workflow 2 : Création Manuelle".


## Workflows améliorés

### Workflow 1 : Création (IA) - "L'Interview" ##
C'est le flux "plug-and-play" pour un nouvel utilisateur.

1. **Écran de Départ** : Écran de Chat (AIAssistantPage.jsx)

2. **Action :** L'utilisateur colle une URL, une annonce, ou dicte les informations.

3. **Logique :**

Le Chat (AIAssistantPage.jsx) initie "l'interview" (via useAI.js et le systemPrompt amélioré).

L'IA pose des questions de suivi (ex: "Quel est le loyer ?") pour combler les manques.

Ce va-et-vient se poursuit jusqu'à ce que l'IA ait les données clés (statut: COMPLETED).

4. Action Finale : Le bot affiche "J'ai tout ce qu'il me faut !" et propose un bouton "[ Accéder à l'analyse ]" dans le chat.

5. Redirection : OUI.

6. Écran d'Arrivée : Écran de Formulaire (AnalysisFormPage.jsx)

7. Contexte à l'Arrivée : Le formulaire est entièrement pré-rempli avec les données de l'interview. Les KPIs (Cash-Flow, Verdict) sont déjà calculés. L'analyse est en mémoire, prête à être sauvegardée.

### Workflow 2 : Création (Manuelle) ##
1. **Écran de Départ** : Écran de Chat (AIAssistantPage.jsx)

2. **Action :** L'utilisateur clique sur le bouton "[ Saisie Manuelle ]" (proposé par le bot).

3. Redirection : OUI.

4. Écran d'Arrivée : Écran de Formulaire (AnalysisFormPage.jsx)

5. Contexte à l'Arrivée : Le formulaire est entièrement vide (chargé avec DEFAULT_ANALYSIS_DATA). Le premier accordéon ("Projet") est ouvert pour le guider.

### Workflow 3 : Modification (Manuelle) ##
C'est le flux standard pour éditer un projet sauvegardé.

1. **Écran de Départ** : Écran de Dashboard (DashboardPage.jsx)

2. **Action :** L'utilisateur clique sur la carte d'un projet (ex: "Projet Rue de la Paix").

3. Redirection : OUI.

4. Écran d'Arrivée : Écran de Formulaire (AnalysisFormPage.jsx)

5. Contexte à l'Arrivée : Le formulaire est pré-rempli avec les données de ce projet (chargées depuis Supabase).

6. Action d'Édition :

L'utilisateur clique sur un accordéon (ex: "Financement").

Il modifie un champ (ex: "Apport").

7. **Logique :** Les KPIs ("Cash-Flow", etc.) se mettent à jour instantanément en haut de la page.

8. Action Finale : L'utilisateur clique sur le bouton "[ Mettre à jour ]" (dans le header) pour sauvegarder les changements.

### Workflow 4 : Modification (IA) - "L'Édition Contextuelle"
C'est le flux "Hub d'Édition Unifié" : l'IA aide à modifier un projet existant.

1. **Écran de Départ** : Écran de Formulaire (AnalysisFormPage.jsx) (l'utilisateur est déjà en train de modifier, comme dans le Workflow 3).

2. **Action :** L'utilisateur clique sur le bouton flottant FAB IA (l'icône IA).

3. **Logique :** La Modale IA (AiAssistantModal.jsx) s'ouvre par-dessus le formulaire.

4. Action d'Édition :

L'utilisateur tape dans la modale : "Le loyer est en fait de 1200€ et les travaux de 15000€".

useAI.js est appelé avec le contexte du projet. L'IA renvoie un JSON partiel : { "income": { "monthlyRent": 1200 }, "costs": { "works": 15000 } }.

5. Logique (Fusion) :

La modale se ferme.

Le AnalysisFormPage.jsx reçoit ce JSON et le fusionne avec l'état actuel.

6. Redirection : AUCUNE.

7. Écran d'Arrivée : Écran de Formulaire (AnalysisFormPage.jsx) (le même écran).

8. Contexte à l'Arrivée : Les champs "Loyer" et "Travaux" dans les accordéons sont mis à jour. Les KPIs se sont recalculés instantanément.

9. Action Finale : L'utilisateur clique sur le bouton "[ Mettre à jour ]".

### Workflow 5 : Reset (Manuel) - "Recommencer (Formulaire)"
1. **Écran de Départ** : Écran de Formulaire (AnalysisFormPage.jsx)

2. **Action :** L'utilisateur clique sur un bouton "[ Effacer / Nouveau ]" (à placer dans le header de la page).

3. **Logique :** useAnalysis.js réinitialise l'état à DEFAULT_ANALYSIS_DATA.

4. Redirection : AUCUNE.

5. Écran d'Arrivée : Écran de Formulaire (AnalysisFormPage.jsx) (le même écran).

6. Contexte à l'Arrivée : Le formulaire est entièrement vide. Identique à la fin du Workflow 2.

### Workflow 6 : Reset (IA) - "Recommencer (Interview)"
Ce flux sert à abandonner l'analyse en cours pour en démarrer une toute nouvelle avec l'IA.

1. **Écran de Départ** : Écran de Formulaire (AnalysisFormPage.jsx)

2. **Action :** L'utilisateur clique sur le bouton "[ Retour au Chat ]" (dans le header de la page).

3. **Logique :** L'état non sauvegardé du AnalysisFormPage.jsx est perdu.

4. Redirection : OUI.

5. Écran d'Arrivée : Écran de Chat (AIAssistantPage.jsx)

6. Contexte à l'Arrivée : L'utilisateur est de retour au point de départ, prêt pour une nouvelle interview (Workflow 1).


### Réoganisation du footer
1. les taches les plus courante (IA, analyse, Dashboard) sont des boutons(icones) distinctes dans le footer.

2. les tâches les moins courante (Aide, compte) sont regroupés dans le même menu.