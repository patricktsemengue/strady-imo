Backlog des Besoins
Voici une décomposition des fonctionnalités en un backlog actionnable :

Épopée 1 : Refonte de l'Interaction avec l'IA

User Story 1.1 : En tant qu'utilisateur, je veux un bouton d'action flottant (FAB) pour accéder rapidement à l'assistant IA depuis n'importe où dans l'application.
User Story 1.2 : En tant qu'utilisateur, lorsque je clique sur le FAB, je veux qu'une modale s'ouvre avec une zone de texte centrale pour que je puisse coller une annonce, une URL, ou dicter une description.
User Story 1.3 : En tant qu'utilisateur, je veux des boutons d'action rapide dans la modale pour lancer une analyse automatique du contenu que j'ai fourni.


Épopée 2 : Analyse Immobilière Intelligente

User Story 2.1 : En tant qu'utilisateur, je veux que l'IA extraie automatiquement les informations clés d'une annonce (prix, type de bien, surface, etc.) pour pré-remplir le formulaire d'analyse.
User Story 2.2 : En tant qu'utilisateur, je veux que l'IA estime les coûts de travaux et les charges d'exploitation sur base de la description du bien et les ajoute au formulaire.
User Story 2.3 : En tant qu'utilisateur, après avoir ajusté les données, je veux pouvoir générer un rapport d'analyse financier complet en un clic.
User Story 2.4 : En tant qu'utilisateur, je veux que le rapport inclue des scénarios de prix d'achat alternatifs (prix demandé, -10%, -20%) pour évaluer mon potentiel de négociation.
Épopée 3 : Profil Utilisateur et Personnalisation

User Story 3.1 : En tant qu'utilisateur, je veux créer un profil financier (privé ou société) pour que l'application puisse évaluer la faisabilité de mes projets en fonction de ma situation réelle (revenus, charges, épargne, etc.).
User Story 3.2 : En tant qu'utilisateur, je veux que mon profil soit utilisé pour personnaliser les calculs de financement dans les rapports.
User Story 3.3 : En tant qu'utilisateur, je veux pouvoir gérer mon abonnement (voir mon plan, mes crédits restants, etc.) depuis mon compte.
Épopée 4 : Rapports et Recommandations Avancés

/*User Story 4.1 : En tant qu'utilisateur, je veux un rapport qui compare l'achat en nom propre versus via une société pour optimiser ma fiscalité.*/
User Story 4.2 : En tant qu'utilisateur, je veux que l'application me suggère des optimisations (cashflow, fiscales, travaux, division) sans réaliser une analyse de faisabilité complète.
User Story 4.3 : En tant qu'utilisateur, je veux pouvoir dicter les optimisations que j'envisage pour que l'application en calcule le rendement potentiel.
User Story 4.4 : En tant qu'utilisateur, je veux être invité à renseigner les points forts/faibles du bien et sa localisation pour que ces éléments soient intégrés au rapport final, le rendant plus robuste.
Épopée 5 : Support et Feedback

User Story 5.1 : En tant qu'utilisateur, je veux un moyen simple de donner mon feedback sur l'application.
User Story 5.2 : En tant qu'utilisateur, je veux pouvoir contacter le support en cas de problème.

En tant qu'utilisateur, je veux que la réponse IA génère automatiquement de bouton pré-prompt m'invitant à rendre mon projet plus rentable et plus financiable. Je veux pouvoir cliquer sur ces pré-prompt et mettre à jour automatiquement le formulaire (exemple: mettre à jour le champs louer sur la base du loyer estimé par l'IA).

En tant qu'utilisateur, je veux une aide/modal pour découper les loyers perçus en plusieurs unités (chambre 1, chambre 2, studio RDC, duplex  2e étage, etc.).


Épopée 6 : Refactorisation Technique et Maintenabilité

User Story 6.1 : En tant que développeur, je veux extraire la logique du formulaire d'analyse (état `data`, calculs, etc.) dans un hook personnalisé `useAnalysis` pour simplifier le composant `App.jsx` et faciliter les tests unitaires de la logique métier.

User Story 6.2 : En tant que développeur, je veux centraliser toutes les interactions avec l'API Gemini (états de chargement, erreurs, réponses) dans un hook `useAI` pour découpler complètement la logique de l'IA de l'interface.

User Story 6.3 : En tant que développeur, je veux isoler tous les appels à la base de données Supabase (CRUD des analyses) dans une couche de service (ex: `src/services/analysisService.js`) pour séparer la gestion des données du reste de l'application.

User Story 6.4 : En tant que développeur, je veux remplacer le système de routage manuel (basé sur un `switch`) par une bibliothèque standard comme `React Router` pour une gestion des URL plus propre, déclarative et maintenable.

User Story 6.5 : En tant que développeur, je veux créer un composant `Layout` qui contiendra les éléments communs (header, footer, barre de navigation) pour éviter la duplication et clarifier la structure de rendu de `App.jsx`.

User Story 6.6 : En tant que développeur, je veux gérer l'état d'ouverture de toutes les modales via un `ModalProvider` (Contexte React) pour supprimer la multitude d'états `is...Open` du composant `App.jsx` et permettre à n'importe quel composant d'ouvrir une modale de manière centralisée.

User Story 6.7 : En tant que développeur, je veux déplacer les fonctions de calcul pures (comme `calculateFinances` et `generatePriceScenarios`) dans un dossier `src/utils` pour les tester de manière isolée et garantir leur fiabilité.
