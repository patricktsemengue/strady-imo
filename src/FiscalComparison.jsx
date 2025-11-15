import React from 'react';
import { InfoIcon } from './Icons';

const FiscalComparison = ({ data, result }) => {
    if (!result) return null;

    // --- Paramètres de simulation (pourraient être dans les settings plus tard) ---
    const RC_INDEX_COEFF = 2.1763; // Index pour l'exercice d'imposition 2024 (revenus 2023)
    const MARGINAL_TAX_RATE = 0.50; // Taux marginal d'imposition (personne physique), 50% est une estimation haute et prudente.
    const CORPORATE_TAX_RATE = 0.20; // Taux réduit de l'ISOC

    // --- Calculs pour Personne Physique ---
    const revenuCadastralIndexe = (data.revenuCadastral || 0) * RC_INDEX_COEFF;
    const revenuImmobilierImposable = revenuCadastralIndexe * 1.40;
    const impotPersonnePhysiqueAnnuel = revenuImmobilierImposable * MARGINAL_TAX_RATE;
    const cashflowAnnuelAvantImpot = parseFloat(result.cashflowMensuel) * 12;
    const cashflowNetPersonnePhysique = cashflowAnnuelAvantImpot - impotPersonnePhysiqueAnnuel;

    // --- Calculs pour Société ---
    const loyerAnnuelReel = (data.loyerEstime || 0) * 12;
    
    // Estimation simplifiée des intérêts de la première année
    const montantEmprunte = (data.prixAchat + data.coutTravaux) - data.apport;
    const interetsAnnuelsEstimes = montantEmprunte * (data.tauxCredit / 100);

    // Amortissement (simplifié, ex: sur 33 ans pour la valeur de construction)
    const valeurConstruction = (data.prixAchat || 0) * 0.7; // Hypothèse que la construction vaut 70% du prix
    const amortissementAnnuel = valeurConstruction / 33;

    const chargesAnnuellesSociete = 
        ((data.chargesMensuelles || 0) * 12) + 
        interetsAnnuelsEstimes +
        amortissementAnnuel;

    const beneficeImposableSociete = loyerAnnuelReel - chargesAnnuellesSociete;
    const impotSocieteAnnuel = beneficeImposableSociete > 0 ? beneficeImposableSociete * CORPORATE_TAX_RATE : 0;
    const cashflowNetSociete = cashflowAnnuelAvantImpot - impotSocieteAnnuel;

    const renderRow = (label, valuePP, valueSoc, isHighlighted = false) => (
        <tr className={isHighlighted ? "font-bold bg-blue-50" : ""}>
            <td className="px-4 py-3 text-sm text-gray-600">{label}</td>
            <td className="px-4 py-3 text-right">{valuePP.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}</td>
            <td className="px-4 py-3 text-right">{valueSoc.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}</td>
        </tr>
    );

    return (
        <div className="mt-6">
            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Indicateur Fiscal (Estimation Annuelle)</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">En Nom Propre</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">En Société (SRL)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                Base imposable
                                <span title="Nom propre: (RC indexé x 1.4). Société: Loyers réels - charges déductibles (intérêts, amortissements...).">
                                    <InfoIcon />
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right">{revenuImmobilierImposable.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}</td>
                            <td className="px-4 py-3 text-right">{beneficeImposableSociete.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })}</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                Impôt estimé
                                <span title={`Nom propre: Taux marginal supposé de ${MARGINAL_TAX_RATE * 100}%. Société: Taux ISOC de ${CORPORATE_TAX_RATE * 100}%.`}>
                                    <InfoIcon />
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right text-red-600">
                                (-{impotPersonnePhysiqueAnnuel.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })})
                            </td>
                            <td className="px-4 py-3 text-right text-red-600">
                                (-{impotSocieteAnnuel.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' })})
                            </td>
                        </tr>
                        {renderRow(
                            "Cash-flow avant impôt",
                            cashflowAnnuelAvantImpot,
                            cashflowAnnuelAvantImpot
                        )}
                        {renderRow(
                            "Cash-flow net après impôt",
                            cashflowNetPersonnePhysique,
                            cashflowNetSociete,
                            true
                        )}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
                <strong>Avertissement :</strong> Ceci est une simulation simplifiée à but informatif. Les calculs ne tiennent pas compte des cotisations sociales, de la taxation sur la sortie de dividendes (précompte mobilier), ni de votre situation fiscale personnelle. Consultez un comptable pour une analyse précise.
            </p>
        </div>
    );
};

export default FiscalComparison;