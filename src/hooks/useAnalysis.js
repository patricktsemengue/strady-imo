import React from 'react';
import { scoreConfig } from '../config.js';
import { calculateFinances, generatePriceScenarios } from '../utils/calculations';

export const initialDataState = {
    projectName: 'Nouveau Projet', prixAchat: 180000, coutTravaux: 15000, fraisAcquisition: 26100, fraisAnnexe: 2000, apport: 40000, tauxCredit: 3.5, dureeCredit: 25,
    ville: '',
    descriptionBien: '',// 'Appartement 2 chambres, bon état',
    typeBien: 'Appartement',
    surface: 85,
    peb: 'C',
    revenuCadastral: 1000,
    tensionLocative: 7, loyerEstime: 900, chargesMensuelles: 100, vacanceLocative: 8,
    quotite: 80,
    chargesDetail: [], travauxDetail: [], enOrdreUrbanistique: false,
    electriciteConforme: false,
    rentUnits: [], // Champ pour sauvegarder la répartition des loyers
    strengths: [], // New field for US 4.4
    weaknesses: [], // New field for US 4.4
};

export const useAnalysis = () => {
    const [data, setData] = React.useState(initialDataState);
    const [result, setResult] = React.useState(null);
    const [finances, setFinances] = React.useState(() => calculateFinances(initialDataState));
    const [tempNumericValue, setTempNumericValue] = React.useState(null);
    const [typeBienOptions] = React.useState(['Appartement', 'Maison', 'Immeuble', 'Commerce', 'Autre']);
    const [pebOptions] = React.useState(['A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'N/C']);

    // Recalcul automatique de l'apport basé sur la quotité
    React.useEffect(() => {
        if (data.quotite === 'custom') return;

        const baseEmpruntable = (data.prixAchat || 0) + (data.coutTravaux || 0);
        const frais = (data.fraisAcquisition || 0) + (data.fraisAnnexe || 0);
        const selectedQuotite = Number(data.quotite) || 0;

        let nouvelApport = 0;

        if (selectedQuotite <= 100) {
            const partNonEmpruntee = baseEmpruntable * (1 - (selectedQuotite / 100));
            nouvelApport = frais + partNonEmpruntee;
        } else {
            const montantEmprunte = baseEmpruntable * (selectedQuotite / 100);
            const fraisFinances = montantEmprunte - baseEmpruntable;
            nouvelApport = Math.max(0, frais - fraisFinances);
        }

        setData(d => ({ ...d, apport: Math.round(nouvelApport) }));

    }, [data.prixAchat, data.coutTravaux, data.fraisAcquisition, data.fraisAnnexe, data.quotite]);

    // Utiliser useEffect pour mettre à jour les calculs
    React.useEffect(() => {
        const requiredFields = [
            'prixAchat', 'coutTravaux', 'fraisAcquisition', 'fraisAnnexe',
            'apport', 'tauxCredit', 'dureeCredit'
        ];

        const isAFieldEmpty = requiredFields.some(field => data[field] === '');

        if (isAFieldEmpty) {
            return;
        }

        setFinances(calculateFinances(data));

    }, [data]);

    const handleDataChange = (name, value) => {
        setData(prevData => {
            const newData = { ...prevData, [name]: value };

            if (name === 'prixAchat') {
                newData.fraisAcquisition = Math.round((parseFloat(value) || 0) * 0.145);
            }

            if (name === 'apport') {
                newData.quotite = 'custom';
            }

            return newData;
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const cleanedValue = String(value).replace(/\s/g, '');
        const processedValue = type === 'number' ? parseFloat(cleanedValue) || 0 : value;
        handleDataChange(name, processedValue);
    };

    const handleTravauxUpdate = (total, items) => {
        setData(d => ({ ...d, coutTravaux: total, travauxDetail: items }));
    };
    const handleTensionUpdate = (newValue) => { setData(d => ({ ...d, tensionLocative: newValue })); };
    const handleVacancyUpdate = (newValue) => { setData(d => ({ ...d, vacanceLocative: newValue })); };
    const handleChargesUpdate = (total, items) => {
        setData(d => ({ ...d, chargesMensuelles: total, chargesDetail: items }));
    };
    
    const handleRentSplitUpdate = (total, units) => {
        setData(d => ({ ...d, loyerEstime: total, rentUnits: units }));
    };

    const handleAcquisitionFeesUpdate = (newValue) => {
        setData(d => ({ ...d, fraisAcquisition: newValue }));
    };

    const calculateScore = () => {
        const loyerAnnuelBrut = (data.loyerEstime || 0) * 12;
        const chargesAnnuelles = (data.chargesMensuelles || 0) * 12;
        const coutVacance = loyerAnnuelBrut * ((data.vacanceLocative || 0) / 100);

        const rendementNet = finances.coutTotalProjet > 0 ? ((loyerAnnuelBrut - chargesAnnuelles - coutVacance) / finances.coutTotalProjet) * 100 : 0;
        
        const cashflowMensuel = (data.loyerEstime || 0) - (data.chargesMensuelles || 0) - finances.mensualiteEstimee;
        const cashflowAnnuel = cashflowMensuel * 12;

        let grade = 'E';
        let motivation = "Rendement faible ou négatif.";
        let score = 0;
        let yearsToRecover = null;
        let cashOnCash = null;

        if ((data.apport || 0) <= 0) {
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
            cashOnCash = (cashflowAnnuel / data.apport) * 100;
        } else {
            yearsToRecover = (data.apport || 0) / cashflowAnnuel;
            cashOnCash = (cashflowAnnuel / data.apport) * 100;
            
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

    const handleNumericFocus = (e) => {
        const { name, value } = e.target;
        setTempNumericValue({ name, value });
        setData(prevData => ({ ...prevData, [name]: '' }));
    };

    const handleNumericBlur = (e) => {
        const { name } = e.target;
        const currentValue = data[name];

        if (currentValue === '' && tempNumericValue && tempNumericValue.name === name) {
            const cleanedValue = String(tempNumericValue.value).replace(/\s/g, '');
            setData(prevData => ({ ...prevData, [name]: parseFloat(cleanedValue) || 0 }));
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
        handleDataChange,
        handleInputChange,
        handleTravauxUpdate,
        handleTensionUpdate,
        handleVacancyUpdate,
        handleChargesUpdate,
        handleRentSplitUpdate,
        handleAcquisitionFeesUpdate,
        calculateScore,
        handleNumericFocus,
        handleNumericBlur,
        generatePriceScenarios,
        initialDataState,
        typeBienOptions,
        pebOptions
    };
};
