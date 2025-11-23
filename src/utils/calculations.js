import { deepCopy } from './deepCopy';
export const calculateFinances = (data) => {
    // Corrected paths to match the nested data structure
    const coutTotal = 
        (data.acquisition?.prixAchat || 0) + 
        (data.acquisition?.coutTravaux?.total || 0) + 
        (data.acquisition?.droitsEnregistrement || 0) + 
        (data.acquisition?.fraisNotaire || 0);

    const aFinancer = coutTotal - (data.financing?.apport || 0);
    const tauxMensuel = (data.financing?.tauxCredit || 0) / 100 / 12;
    const nbMensualites = (data.financing?.dureeCredit || 0) * 12;
    const mensualite = aFinancer > 0 && nbMensualites > 0 ? (aFinancer * tauxMensuel * Math.pow(1 + tauxMensuel, nbMensualites)) / (Math.pow(1 + tauxMensuel, nbMensualites) - 1) : 0;
    
    return {
        coutTotalProjet: coutTotal,
        montantAFinancer: aFinancer,
        mensualiteEstimee: mensualite
    };
};

export const generatePriceScenarios = (analysis) => {
    if (!analysis || !analysis.data) return [];

    const originalData = analysis.data;
    const scenarios = [
        { label: "Prix demandé", discount: 0 },
        { label: "Négo. -10%", discount: -10 },
        { label: "Négo. -20%", discount: -20 }
    ];

    return scenarios.map(scenarioInfo => {
        const discountFactor = 1 + (scenarioInfo.discount / 100);
        const newPrixAchat = (originalData.acquisition?.prixAchat || 0) * discountFactor;

        // Create a deep copy to avoid modifying the original data object
        const scenarioData = deepCopy(originalData);
        scenarioData.acquisition.prixAchat = newPrixAchat;
        scenarioData.acquisition.droitsEnregistrement = Math.round(newPrixAchat * 0.125);
        
        const scenarioFinances = calculateFinances(scenarioData);

        const loyerAnnuelBrut = (scenarioData.rental?.loyerEstime?.total || 0) * 12;
        const chargesAnnuelles = scenarioData.rental?.chargesAnnuelles?.total || 0;
        const coutVacance = loyerAnnuelBrut * ((scenarioData.rental?.vacanceLocative || 0) / 100);
        const rendementNet = scenarioFinances.coutTotalProjet > 0 ? ((loyerAnnuelBrut - chargesAnnuelles - coutVacance) / scenarioFinances.coutTotalProjet) * 100 : 0;
        const cashflowMensuel = (scenarioData.rental?.loyerEstime?.total || 0) - (chargesAnnuelles / 12) - scenarioFinances.mensualiteEstimee;
        const cashflowAnnuel = cashflowMensuel * 12;
        let cashOnCash = null;
        if ((scenarioData.financing?.apport || 0) > 0 && cashflowAnnuel > 0) {
            cashOnCash = (cashflowAnnuel / scenarioData.financing.apport) * 100;
        } else if ((scenarioData.apport || 0) <= 0 && cashflowAnnuel > 0) {
            cashOnCash = Infinity;
        }

        return {
            label: scenarioInfo.label,
            prixAchat: newPrixAchat,
            cashflowMensuel: cashflowMensuel,
            rendementNet: rendementNet,
            cashOnCash: cashOnCash,
        };
    });
};
