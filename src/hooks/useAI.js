import React from 'react';
import { supabase } from '../supabaseClient';
import { getFromCache, setInCache } from '../services/aiCacheService';

export const useAI = ({ user, userPlan, setUserPlan, data, setData, setNotification, typeBienOptions, setTypeBienOptions, setIsCreditModalOpen }) => {
    const [aiInput, setAiInput] = React.useState('');
    const [aiPrompt, setAiPrompt] = React.useState('');
    const [showAiResponseActions, setShowAiResponseActions] = React.useState(false);
    const [aiActions, setAiActions] = React.useState([]);
    const [isApplyingAi, setIsApplyingAi] = React.useState(false);
    const [hasSavedNote, setHasSavedNote] = React.useState(false);
    const [hasApplied, setHasApplied] = React.useState(false);
    const [isAiAssistantModalOpen, setIsAiAssistantModalOpen] = React.useState(false);
    const [geminiResponse, setGeminiResponse] = React.useState('');
    const [isGeminiLoading, setIsGeminiLoading] = React.useState(false);
    const [geminiError, setGeminiError] = React.useState('');

    const checkAiCredits = () => {
        if (!user) {
            // setNotification("Connectez-vous pour utiliser l'assistant IA", 'error'); // Optionally show a notification or open auth modal if user is not logged in
            return false;
        }
        if (userPlan && userPlan.current_ai_credits === -1) return true; // Unlimited credits
        if (userPlan && userPlan.current_ai_credits > 0) return true;
        
        // If user has 0 credits and is logged in, open the credit modal
        if (user && userPlan && userPlan.current_ai_credits === 0) {
            setIsCreditModalOpen(true);
        }
        return false;
    };

    const getAiButtonTooltip = () => {
        if (!user) return "Connectez-vous pour utiliser l'assistant IA";
        if (userPlan && userPlan.current_ai_credits === 0) return "Crédits IA épuisés. Rechargez vos crédits.";
        return "Interroger l'IA";
    };

    const callGeminiAPI = async (systemPrompt, userPrompt, taskType, setLoading, setError, setResponse) => {
        setLoading(true);
        setError('');
        setResponse('');

        try {
            const response = await fetch('/.netlify/functions/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ systemPrompt, userPrompt, taskType })
            });

            const resultData = await response.json();

            if (!response.ok) {
                throw new Error(resultData.error || `Error: ${response.statusText}`);
            }

            const text = resultData.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setResponse(text);
            } else {
                setError("La réponse de l'API était vide ou malformée.");
            }
        } catch (error) {
            setError(`Une erreur est survenue: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneralQuery = async () => {
        const systemPrompt = 
`Tu es "Strady", un assistant expert de l'immobilier en Belgique. Analyse les annonces et aide les investisseurs.
**Format OBLIGATOIRE :** Réponds en Markdown, JAMAIS en JSON. Utilise les titres et listes à puces ci-dessous.

## 1. Détails du Bien
* **Adresse :** [Déduis si possible]
* **Type de bien :** [Appartement, Maison...]
* **Surface :** [X m²]
* **Chambres :** [X]
* **PEB :** [Classe]
* **Conformité urbanistique :** [Oui/Non/N/A]
* **Conformité électrique :** [Oui/Non/N/A]

## 2. Données Financières
* **Prix d'achat :** [X €]
* **Travaux à prévoir :** [Liste au format "- Nom : XXXX €". Si aucun, écris "Aucun".]
* **Taux moyen de financement :** [Estime si possible, ex: 3.5% sur 20 ans]

## 3. Loyers et charges
* **Loyer mensuel estimé :** [Si plusieurs unités, liste au format "- Unité : XXXX €". Sinon, donne le total.]
* **Charges annuelles :** [Liste au format "- Charge : XXXX €".]
* **Précompte immobilier annuel:** [Estime au format "- Précompte : XXXX €"]
* **Assurance PNO annuelle:** [Estime au format "- Assurance PNO : XXXX €"]

## 4. Analyse & Recommandations
* **Points forts :** [Atouts]
* **Points faibles :** [Défauts]
* **Risques potentiels :** [Risques]
* **Optimisations & Suggestions :** [Recommandations claires. Ex: "Suggère loyer de **1050€**." ou "Prévoir budget isolation (8000€) pour PEB 'F'."]
* **Profil de locataire cible :** [Profil adapté]

Si hors-sujet, réponds : "Je suis désolé, cela sort de mon cadre d'expertise immobilier."`

        const finalPrompt = `${aiPrompt}\n\nVoici le contexte à analyser (texte ou URL) :\n\n${aiInput}`;

        const processResponse = (responsePayload) => {
            setGeminiResponse(responsePayload);
            setAiActions([]); // Les actions sont maintenant dans le texte, plus besoin de ce state.
            const isOutOfScopeResponse = /désolé|sort de mon cadre/i.test(responsePayload);
            setShowAiResponseActions(!isOutOfScopeResponse);
        };

        const requestPayload = {
            systemPrompt: String(systemPrompt),
            userPrompt: String(finalPrompt),
            taskType: 'QA'
        };

        // Set loading state and clear previous results
        setIsGeminiLoading(true);
        setGeminiError('');
        setGeminiResponse('');
        setHasApplied(false); // Reset applied state for new query
        setHasSavedNote(false);

        // Step 1 & 2: Try to get the answer from localStorage, then the ai_cache table.
        const cachedResponse = await getFromCache(requestPayload);

        if (cachedResponse) {
            // If a response is found in the cache, process and display it immediately.
            processResponse(cachedResponse);
            setIsGeminiLoading(false);
            return;
        }

        // Step 3: If no response is found in the cache, call the Gemini API.
        callGeminiAPI(requestPayload.systemPrompt, requestPayload.userPrompt, requestPayload.taskType, setIsGeminiLoading, setGeminiError, (apiResponseText) => {
            if (apiResponseText) {
                // Process and display the new response from the API.
                processResponse(apiResponseText);

                // Step 4: Store the new prompt and response in the cache.
                if (user?.id) {
                    setInCache(requestPayload, apiResponseText, user.id);
                }

                // Decrement user credits only on a successful, non-cached, in-scope API call.
                const isOutOfScope = /désolé|sort de mon cadre/i.test(apiResponseText);
                if (!isOutOfScope && user && userPlan && userPlan.current_ai_credits !== -1) {
                    const newCreditCount = Math.max(0, userPlan.current_ai_credits - 1);
                    setUserPlan(prev => ({ ...prev, current_ai_credits: newCreditCount }));
                    // Update credits in the database.
                    supabase.from('user_profile_plans').update({ current_ai_credits: newCreditCount }).eq('user_id', user.id).then(({ error }) => {
                        if (error) console.error("Erreur lors de la mise à jour des crédits :", error);
                    });
                }
            }
        });
    };

    const handleAiActionClick = (action) => {
        if (action.type === 'UPDATE_FIELD') {
            setData(prevData => ({ ...prevData, [action.payload.field]: action.payload.value }));
            setNotification(`Champ '${action.payload.field}' mis à jour !`, 'success');
        }
    };

    const handleNewPrompt = (payload) => {
        // This function can be expanded to automatically re-trigger the AI
        // For now, it can set the input and prompt for the user to trigger manually
        setAiInput(prev => `${prev}\n\n${payload.prompt}`);
        setAiPrompt(payload.prompt);
        showNotification('Nouveau prompt ajouté à la zone de texte.', 'info');
    };



    const handleSaveAiResponse = () => {
        // Extrait uniquement les sections pertinentes de la réponse de l'IA
        const startIndex = geminiResponse.indexOf('## 1.');
        let relevantText = geminiResponse;
        if (startIndex !== -1) {
            relevantText = geminiResponse.substring(startIndex);
        }

        setData(prev => ({ ...prev, descriptionBien: (prev.descriptionBien || '') + '\n\n--- Réponse IA ---\n' + relevantText.trim() }));
        setNotification('La réponse a été ajoutée à vos notes.', 'success');
        setHasSavedNote(true);
        setTimeout(() => setHasSavedNote(false), 3000);
    };

    const handleIgnoreAiResponse = () => {
        setShowAiResponseActions(false);
    };

    const handleApplyAiResponse = () => {
        setIsApplyingAi(true);
        setHasApplied(false);

        setTimeout(() => {
            const responseText = geminiResponse;
            let updatedData = {};

            const extract = (regex) => {
                const match = responseText.match(new RegExp(regex, 'im'));
                return match ? match[1].trim() : null;
            };

            const extractListItems = (sectionRegex, itemRegex, isWorkItem = false) => {
                const sectionMatch = responseText.match(sectionRegex);
                if (!sectionMatch || !sectionMatch[1]) return [];
    
                const items = [];
                const lines = sectionMatch[1].split('\n');
                for (const line of lines) {
                    const itemMatch = line.match(itemRegex);
                    if (itemMatch && itemMatch[1] && itemMatch[2]) {
                        const name = itemMatch[1].trim();
                        let cost = 0;
                        // Si une deuxième valeur (fourchette haute) est trouvée, on la prend. Sinon, on prend la première.
                        if (isWorkItem && itemMatch[3]) {
                            const cost1 = parseInt(itemMatch[2].replace(/[.€\s]/g, ''), 10);
                            const cost2 = parseInt(itemMatch[3].replace(/[.€\s]/g, ''), 10);
                            cost = !isNaN(cost2) ? cost2 : (!isNaN(cost1) ? cost1 : 0); // Prioritize the higher value
                        } else {
                            cost = parseInt(itemMatch[2].replace(/[.€\s]/g, ''), 10);
                        }
    
                        if (name && !isNaN(cost) && cost > 0) {
                            items.push({ name, cost });
                        }
                    }
                }
                return items;
            };

            const validateAndSet = (field, value, validationFn, transformFn) => {
                if (value !== null && validationFn(value)) {
                    updatedData[field] = transformFn ? transformFn(value) : value;
                }
            };

            const typeBien = extract("^\\*\\s*\\*\\*Type de bien\\s*:\\*\\*\\s*([^\n\r]*)");
            validateAndSet('typeBien', typeBien, val => val.length > 0, val => {
                if (!typeBienOptions.includes(val)) {
                    setTypeBienOptions(prev => [...prev, val]);
                }
                return val;
            });

            const peb = extract("^\\*\\s*\\*\\*PEB\\s*:\\*\\*\\s*([A-G][\\+]{0,2})");
            validateAndSet('peb', peb, val => val.length > 0);

            const surface = extract("^\\*\\s*\\*\\*Surface\\s*:\\*\\*\\s*(\\d+)");
            validateAndSet('surface', surface, val => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, val => parseInt(val, 10));
            
            const chambres = extract("^\\*\\s*\\*\\*Chambres\\s*:\\*\\*\\s*(\\d+)");
            validateAndSet('nombreChambres', chambres, val => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, val => parseInt(val, 10));

            const anneeConstruction = extract("^\\*\\s*\\*\\*Année de construction\\s*:\\*\\*\\s*(\\d{4})");
            validateAndSet('anneeConstruction', anneeConstruction, val => {
                const year = parseInt(val, 10);
                return !isNaN(year) && year > 1000 && year <= new Date().getFullYear() + 1;
            }, val => parseInt(val, 10));

            const prixAchatMatch = extract("^\\*\\s*\\*\\*Prix d'achat\\s*:\\*\\*\\s*(?:.*?)?([\\d.,\\s]+?)(?=\\s*€|$)");
            validateAndSet('prixAchat', prixAchatMatch, val => !isNaN(parseInt(val.replace(/[.€\s]/g, ''), 10)), val => parseInt(val.replace(/[.€\s]/g, ''), 10));

            const adresse = extract("^\\*\\s*\\*\\*Adresse\\s*:\\*\\*\\s*([^\n\r]*)");
            validateAndSet('ville', adresse, val => val.length > 0 && val.toLowerCase() !== '[ce que tu as trouvé ou déduit]');

            // --- Travaux ---
            const workItems = extractListItems(
                /##\s*2\..*?Travaux à prévoir\s*\n([\s\S]*?)(?=\n##|$)/im,
                /^\s*(?:-|\*)\s*(.*?)\s*:\s*([\d.,\s]+€)(?:\s*-\s*([\d.,\s]+€))?/i,
                true // Flag to indicate this is for work items with potential ranges
            );
            if (workItems.length > 0) {
                updatedData.travauxDetail = workItems.map(item => ({ ...item, id: Date.now() + Math.random() }));
                updatedData.coutTravaux = workItems.reduce((sum, item) => sum + item.cost, 0);
            }

            // --- Loyers ---
            const rentItems = extractListItems(/##\s*3\..*?Loyer mensuel estimé\s*\n([\s\S]*?)(?=\n##|$)/im, /-\s*(.*?)\s*:\s*([\d.,\s]+€)/i);
            if (rentItems.length > 0) {
                updatedData.rentUnits = rentItems.map(item => ({ name: item.name, rent: item.cost, id: Date.now() + Math.random() }));
                updatedData.loyerEstime = rentItems.reduce((sum, item) => sum + item.cost, 0);
            } else {
                const totalLoyer = extract("^\\*\\s*\\*\\*Loyer mensuel estimé\\s*:\\*\\*\\s*([\\d.,\\s]+?)(?=\\s*€|$)");
                validateAndSet('loyerEstime', totalLoyer, val => !isNaN(parseInt(val.replace(/[.€,\s]/g, ''), 10)), val => parseInt(val.replace(/[.€,\s]/g, ''), 10));
            }

            // --- Charges ---
            const chargeItems = extractListItems(/##\s*3\..*?Charges annuelles\s*\n([\s\S]*?)(?=\n##|$)/im, /-\s*(.*?)\s*:\s*([\d.,\s]+€)/i);
            if (chargeItems.length > 0) {
                updatedData.chargesDetail = chargeItems.map(item => ({ object: item.name, price: item.cost, periodicity: 'An', id: Date.now() + Math.random() }));
                const totalAnnualCharges = chargeItems.reduce((sum, item) => sum + item.cost, 0);
                updatedData.chargesMensuelles = Math.round(totalAnnualCharges / 12);
            }

            const conformiteElec = extract("^\\*\\s*\\*\\*Conformité électrique\\s*:\\*\\*\\s*([^\n\r]*)");
            validateAndSet('electriciteConforme', conformiteElec, val => /oui|non/i.test(val), val => /oui/i.test(val));

            const conformiteUrba = extract("^\\*\\s*\\*\\*Conformité urbanistique\\s*:\\*\\*\\s*([^\n\r]*)");
            validateAndSet('enOrdreUrbanistique', conformiteUrba, val => /oui|non/i.test(val), val => /oui/i.test(val));

            const analyseMatch = responseText.match(/##\s*4\.\s*Analyse\s*&\s*Recommandations([\s\S]*)/im);
            if (analyseMatch && analyseMatch[1]) {
                updatedData.descriptionBien = ((data && data.descriptionBien) ? data.descriptionBien + '\n\n' : '') + '--- Analyse IA ---\n' + analyseMatch[1].trim();
            }

            if (Object.keys(updatedData).length > 0) {
                // Reset relevant fields before applying new data
                const fieldsToReset = {
                    typeBien: '',
                    peb: '',
                    surface: '',
                    nombreChambres: '',
                    anneeConstruction: '',
                    prixAchat: '',
                    ville: '',
                    loyerEstime: '',
                    chargesMensuelles: '',
                    coutTravaux: '',
                };
                setData(prev => ({ ...prev, ...fieldsToReset, ...updatedData }));
                setNotification('Les informations ont été appliquées au formulaire !', 'success');
                setHasApplied(true);
                setTimeout(() => setHasApplied(false), 3000); // Réactive le bouton après 3 secondes
            } else {
                setNotification("Aucune information n'a pu être extraite de la réponse.", 'error');
            }

            setTimeout(() => setNotification('', ''), 3000); // Masque la notification après 3 secondes
            setIsApplyingAi(false);
        }, 100);
    };

    const resetAI = () => {
        setAiInput('');
        setAiPrompt('');
        setGeminiResponse('');
        setGeminiError('');
        setShowAiResponseActions(false);
    };

    return {
        aiInput,
        setAiInput,
        aiPrompt,
        setAiPrompt,
        showAiResponseActions,
        aiActions,
        isApplyingAi,
        hasSavedNote,
        hasApplied,
        isAiAssistantModalOpen,
        setIsAiAssistantModalOpen,
        geminiResponse,
        isGeminiLoading,
        geminiError,
        handleGeneralQuery,
        handleAiActionClick,
        handleNewPrompt, // Exporting the new handler
        handleSaveAiResponse,
        handleIgnoreAiResponse,
        handleApplyAiResponse,
        resetAI,
        checkAiCredits,
        getAiButtonTooltip,
    };
};
