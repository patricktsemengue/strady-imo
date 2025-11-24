import React from 'react';
import { scoreConfig } from '../config.js';
import { calculateFinances, generatePriceScenarios } from '../utils/calculations';
import { supabase } from '../supabaseClient';

export const initialDataState = {
    projectName: 'Nouveau Projet',
    property: {
        uuid: null, // To track saved analyses
        typeBien: 'Appartement',
        ville: '',
        surface: 85,
        nombreChambres: 2,
        peb: 'C',
        revenuCadastral: 1000,
        anneeConstruction: 0,
        description: '',
        enOrdreUrbanistique: true,
        electriciteConforme: false,
    },
    acquisition: {
        prixAchat: 180000,
        coutTravaux: {
            total: 15000,
            details: []
        },
        fraisNotaire: 3600,
        droitsEnregistrement: 22500,
    },
    financing: {
        apport: 40000,
        tauxCredit: 3.5,
        dureeCredit: 25,
        quotite: 80, // Added from old structure
    },
    rental: {
        loyerEstime: {
            total: 900,
            units: []
        },
        chargesAnnuelles: {
            total: 1200, // 100/month * 12
            details: []
        },
        vacanceLocative: 8, // Added from old structure
    }
};

export const newInitialDataState = {
    projectName: '',
    property: {
        uuid: null, 
        typeBien: '',
        ville: '',
        surface: 0,
        nombreChambres: 0,
        peb: '',
        revenuCadastral: 0,
        anneeConstruction: 0,
        description: '',
        enOrdreUrbanistique: false,
        electriciteConforme: false,
    },
    acquisition: {
        prixAchat: 0,
        coutTravaux: {
            total: 0,
            details: [
                { label: 'Travail 1', montant: 0 },
                { label: 'Travail 2', montant: 0 },
                
            ]
        },
        fraisNotaire: 0,
        droitsEnregistrement: 0,
    },
    financing: {
        apport: 0,
        tauxCredit: 0,
        dureeCredit: 0,
        quotite: 0, // Added from old structure
    },
    rental: {
        loyerEstime: {
            total: 0,
            units: [
                { label: 'Unité 1', montant: 0 },
                { label: 'Unité 2', montant: 0 },
                { label: 'Unité 3', montant: 0 },
            ]
        },
        chargesAnnuelles: {
            total: 0, // 100/month * 12
            details: [
                { label: 'Charges communes', montant: 0 },
                { label: 'Assurances', montant: 0 },
                { label: 'Autres', montant: 0 },
            ]
        },
        vacanceLocative: 8, // Added from old structure
    }
};



export const useAnalysis = ({ user, setNotification } = {}) => {
    const [data, setData] = React.useState(initialDataState);
    const [result, setResult] = React.useState(null);
    const [finances, setFinances] = React.useState(() => calculateFinances(initialDataState));
    const [tempNumericValue, setTempNumericValue] = React.useState(null);
    const [validationErrors, setValidationErrors] = React.useState({});
    const [typeBienOptions] = React.useState(['Appartement', 'Maison', 'Immeuble', 'Commerce', 'Autre']);
    const [pebOptions] = React.useState(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'N/C']);

    // Recalcul automatique de l'apport basé sur la quotité
    React.useEffect(() => {
        if (data.quotite === 'custom') return;

        const baseEmpruntable = (data.acquisition.prixAchat || 0) + (data.acquisition.coutTravaux.total || 0);
        const frais = (data.acquisition.droitsEnregistrement || 0) + (data.acquisition.fraisNotaire || 0);
        const selectedQuotite = Number(data.financing.quotite) || 0;

        let nouvelApport = 0;

        if (selectedQuotite <= 100) {
            const partNonEmpruntee = baseEmpruntable * (1 - (selectedQuotite / 100));
            nouvelApport = frais + partNonEmpruntee;
        } else {
            const montantEmprunte = baseEmpruntable * (selectedQuotite / 100);
            const fraisFinances = montantEmprunte - baseEmpruntable;
            nouvelApport = Math.max(0, frais - fraisFinances);
        }

        setData(d => ({ ...d, financing: { ...d.financing, apport: Math.round(nouvelApport) } }));

    }, [data.acquisition.prixAchat, data.acquisition.coutTravaux.total, data.acquisition.droitsEnregistrement, data.acquisition.fraisNotaire, data.financing.quotite]);

    // Utiliser useEffect pour mettre à jour les calculs
    React.useEffect(() => {
        setFinances(calculateFinances(data));
    }, [data]);

    const handleDataChange = (path, value) => {
        const keys = path.split('.');
        setData(prevData => {
            let current = { ...prevData };
            let newRef = current;
    
            for (let i = 0; i < keys.length - 1; i++) {
                newRef[keys[i]] = { ...newRef[keys[i]] };
                newRef = newRef[keys[i]];
            }
    
            newRef[keys[keys.length - 1]] = value;
    
            // Special business logic
            if (path === 'acquisition.prixAchat') {
                current.acquisition.droitsEnregistrement = Math.round((parseFloat(value) || 0) * 0.125);
            }
            if (path === 'financing.apport') {
                current.financing.quotite = 'custom';
            }

            // Clear validation error when user types in the field
            if (validationErrors[path]) {
                const newErrors = { ...validationErrors };
                delete newErrors[path];
                setValidationErrors(newErrors);
            }
    
            return current;
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const cleanedValue = String(value).replace(/\s/g, '');
        const processedValue = type === 'number' ? parseFloat(cleanedValue) || 0 : value;
        handleDataChange(name, processedValue); // name now corresponds to the path, e.g., "property.ville"
    };

    const handleTravauxUpdate = (total, items) => {
        handleDataChange('acquisition.coutTravaux', { total, details: items });
    };
    const handleTensionUpdate = (newValue) => { handleDataChange('tensionLocative', newValue); };
    const handleVacancyUpdate = (newValue) => { handleDataChange('rental.vacanceLocative', newValue); };
    const handleChargesUpdate = (total, items) => {
        const annualTotal = total * 12;
        handleDataChange('rental.chargesAnnuelles', { total: annualTotal, details: items });
    };
    
    const handleRentSplitUpdate = (total, units) => {
        handleDataChange('rental.loyerEstime', { total, units });
    };

    const isAnalysisComplete = React.useCallback(() => {
        const requiredPaths = [
            'acquisition.prixAchat',
            'financing.tauxCredit',
            'financing.dureeCredit',
            'rental.loyerEstime.total'
        ];

        return requiredPaths.every(path => {
            const value = path.split('.').reduce((obj, key) => obj && obj[key], data);
            return value !== null && value !== undefined && value > 0;
        });
    }, [data]);

    const calculateScore = () => {
        const loyerAnnuelBrut = (data.rental.loyerEstime.total || 0) * 12;
        const chargesAnnuelles = data.rental.chargesAnnuelles.total || 0;
        const coutVacance = loyerAnnuelBrut * ((data.rental.vacanceLocative || 0) / 100);

        const rendementNet = finances.coutTotalProjet > 0 ? ((loyerAnnuelBrut - chargesAnnuelles - coutVacance) / finances.coutTotalProjet) * 100 : 0;
        
        const cashflowMensuel = (data.rental.loyerEstime.total || 0) - (chargesAnnuelles / 12) - finances.mensualiteEstimee;
        const cashflowAnnuel = cashflowMensuel * 12;

        let grade = 'E';
        let motivation = "Rendement faible ou négatif.";
        let score = 0;
        let yearsToRecover = null;
        let cashOnCash = null;

        if ((data.financing.apport || 0) <= 0) {
            if (cashflowAnnuel > 0) { // Infinite return
                const bestScore = scoreConfig.cashflowScore[0];
                grade = bestScore.grade;
                motivation = bestScore.comment;
                score = 100;
                yearsToRecover = 0;
                cashOnCash = Infinity;
            } else { // No investment, no return
                const worstScore = scoreConfig.cashflowScore[scoreConfig.cashflowScore.length - 1];
                grade = worstScore.grade;
                motivation = worstScore.comment;
                score = 10;
            }
        } else if (cashflowAnnuel <= 0) {
            const worstScore = scoreConfig.cashflowScore[scoreConfig.cashflowScore.length - 1];
            grade = worstScore.grade;
            motivation = worstScore.comment;
            score = 10;
            cashOnCash = (cashflowAnnuel / data.financing.apport) * 100;
        } else {
            yearsToRecover = (data.financing.apport || 0) / cashflowAnnuel;
            cashOnCash = (cashflowAnnuel / data.financing.apport) * 100;
            
            const foundTier = scoreConfig.cashflowScore.find(tier => yearsToRecover >= tier.minYears && yearsToRecover < tier.maxYears);

            if (foundTier) {
                grade = foundTier.grade;
                motivation = foundTier.comment;
            } else {
                const worstScore = scoreConfig.cashflowScore[scoreConfig.cashflowScore.length - 1];
                grade = worstScore.grade;
                motivation = worstScore.comment;
            }
            
            switch(grade) {
                case 'A': score = 95; break;
                case 'B': score = 80; break;
                case 'C': score = 60; break;
                case 'D': score = 40; break;
                case 'E': score = 20; break;
                default: score = 0;
            }
        }

        const newResult = {
            rendementNet: isFinite(rendementNet) ? rendementNet.toFixed(2) : '0.00',
            cashflowMensuel: cashflowMensuel.toFixed(2),
            mensualiteCredit: finances.mensualiteEstimee.toFixed(2),
            coutTotal: finances.coutTotalProjet.toFixed(0),
            grade,
            motivation,
            score: Math.round(score),
            yearsToRecover,
            cashOnCash
        };

        setResult(newResult);
    };

    const calculateAndShowResult = () => {
        console.log("Triggering calculation from AI action...");
        calculateScore();
    };

    const saveAnalysis = async (isUpdate = false, dataToSave = null) => {
        if (!user) {
            if (setNotification) {
                setNotification("Veuillez vous connecter pour sauvegarder votre analyse.", "error");
            }
            return null;
        }

        const analysisData = dataToSave || data;

        // --- Validation Check ---
        if (!analysisData.property.ville || analysisData.property.ville.trim() === '') {
            const errorField = 'property.ville';
            setValidationErrors({ [errorField]: true });

            if (setNotification) {
                setNotification("Veuillez renseigner une adresse pour l'analyse avant de sauvegarder.", "warning");
            }
            // Scroll to the invalid field
            const element = document.querySelector(`[name="${errorField}"]`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });

            return null;
        }

        try {
            // Construct the payload to match the database table structure
            const analysisToSave = {
                user_id: user.id,
                project_name: analysisData.projectName,
                ville: analysisData.property.ville,
                data: analysisData, // The entire state object goes into the 'data' JSONB column
                result: result, // The result object goes into the 'result' JSONB column
                ...(analysisData.property.uuid && { id: analysisData.property.uuid }) // Map the local uuid to the database 'id' column
            };

            const { data: savedData, error } = await supabase
                .from('analyses')
                .upsert(analysisToSave, { onConflict: 'id' }) // Use 'id' for conflict resolution
                .select()
                .single();

            if (error) throw error;

            setData(prev => ({ ...prev, ...analysisData, property: { ...prev.property, uuid: savedData.id } })); // Use savedData.id
            if (setNotification) setNotification(isUpdate ? "Analyse mise à jour avec succès !" : "Analyse sauvegardée avec succès !", "success");
            return savedData;
        } catch (error) {
            console.error("Erreur lors de la sauvegarde de l'analyse:", error);
            if (setNotification) setNotification(`Erreur: ${error.message}`, "error");
            return null;
        }
    };

    const handleNumericFocus = (e) => {
        const { name, value } = e.target;
        setTempNumericValue({ name, value });
        handleDataChange(name, ''); // Use the correct function for nested updates
    };

    const handleNumericBlur = (e) => {
        const { name } = e.target;
        const currentValue = name.split('.').reduce((obj, key) => obj && obj[key], data);

        if (currentValue === '' && tempNumericValue && tempNumericValue.name === name) {
            handleDataChange(name, parseFloat(String(tempNumericValue.value).replace(/\s/g, '')) || 0);
        }

        setTempNumericValue(null);
    };
    
    return {
        data,
        setData,
        result,
        setResult,
        finances,
        setFinances,
        validationErrors,
        handleDataChange,
        handleInputChange,
        handleTravauxUpdate,
        handleTensionUpdate,
        handleVacancyUpdate,
        handleChargesUpdate,
        handleRentSplitUpdate,
        calculateScore,
        isAnalysisComplete,
        calculateAndShowResult,
        saveAnalysis,
        handleNumericFocus,
        handleNumericBlur,
        generatePriceScenarios,
        initialDataState,
        newInitialDataState,
        typeBienOptions,
        pebOptions
    };
};
