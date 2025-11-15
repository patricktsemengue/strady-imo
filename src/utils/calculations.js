export const calculateFinances = (data) => {
    const coutTotal = (data.prixAchat || 0) + (data.coutTravaux || 0) + (data.fraisAcquisition || 0) + (data.fraisAnnexe || 0);
    const aFinancer = coutTotal - (data.apport || 0);
    const tauxMensuel = (data.tauxCredit || 0) / 100 / 12;
    const nbMensualites = (data.dureeCredit || 0) * 12;
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
        const newPrixAchat = originalData.prixAchat * discountFactor;

        const scenarioData = { ...originalData, prixAchat: newPrixAchat };
        scenarioData.fraisAcquisition = Math.round(newPrixAchat * 0.145);
        
        const scenarioFinances = calculateFinances(scenarioData);

        const loyerAnnuelBrut = (scenarioData.loyerEstime || 0) * 12;
        const chargesAnnuelles = (scenarioData.chargesMensuelles || 0) * 12;
        const coutVacance = loyerAnnuelBrut * ((scenarioData.vacanceLocative || 0) / 100);
        const rendementNet = scenarioFinances.coutTotalProjet > 0 ? ((loyerAnnuelBrut - chargesAnnuelles - coutVacance) / scenarioFinances.coutTotalProjet) * 100 : 0;
        const cashflowMensuel = (scenarioData.loyerEstime || 0) - (scenarioData.chargesMensuelles || 0) - scenarioFinances.mensualiteEstimee;
        const cashflowAnnuel = cashflowMensuel * 12;
        let cashOnCash = null;
        if ((scenarioData.apport || 0) > 0 && cashflowAnnuel > 0) {
            cashOnCash = (cashflowAnnuel / scenarioData.apport) * 100;
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
