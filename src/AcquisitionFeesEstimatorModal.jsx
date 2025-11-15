import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangleIcon, ClipboardListIcon, HelpIcon, ChevronDownIcon } from './Icons';
import BottomDrawerModal from './BottomDrawerModal';

const AcquisitionFeesEstimatorModal = ({ isOpen, onClose, onApply, prixAchat, revenuCadastral }) => {
    const [region, setRegion] = useState('Wallonie');
    const [isSolePrimaryResidence, setIsSolePrimaryResidence] = useState(true);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
 
    useEffect(() => {
        if (!isOpen) {
            setIsDetailsOpen(false); // Reset on close
        }
    }, [isOpen]);

    const { totalFees, rate, abattement, baseImposable, droitsEnregistrement, fraisNotaire, fraisDivers, tvaSurFrais } = useMemo(() => {
        const base = parseFloat(prixAchat) || 0;
        let rate = 0.125;
        let abattement = 0;
        let description = "Taux standard";

        if (isSolePrimaryResidence) {
            if (region === 'Wallonie') {
                // Abattement de 40.000€ pour les premiers 430.000€ (depuis 1er juillet 2023)
                if (base <= 430000) {
                    abattement = Math.min(base, 40000);
                }
                // Taux réduit pour habitation modeste
                if (revenuCadastral > 0 && revenuCadastral <= 745 && base <= 267737) { // Plafond 2024
                    rate = 0.06;
                    description = "Taux réduit (6%)";
                }
            } else if (region === 'Bruxelles') {
                rate = 0.125;
                // Abattement de 200.000€ pour les biens jusqu'à 600.000€ (depuis 1er avril 2023)
                if (base <= 600000) {
                    abattement = Math.min(base, 200000);
                }
            } else if (region === 'Flandre') {
                rate = 0.03; // Taux pour résidence principale unique
                description = "Taux unique (3%)";
                // Pas d'abattement en Flandre, mais droits réduits ("meeneembaarheid" a été supprimé)
            }
        } else {
            // Taux pour résidence secondaire / investissement
            if (region === 'Flandre') rate = 0.12;
            else rate = 0.125;
        }

        const baseImposable = Math.max(0, base - abattement);
        const droitsEnregistrement = baseImposable * rate;

        // Estimation très simplifiée des frais de notaire et autres
        const fraisNotaire = 1500 + (base * 0.005); // Formule très approximative
        const fraisDivers = 1200; // Transcription, recherches, etc.
        const tvaSurFrais = (fraisNotaire + fraisDivers) * 0.21;
        const totalFees = droitsEnregistrement + fraisNotaire + fraisDivers + tvaSurFrais;

        return { totalFees, rate, abattement, baseImposable, droitsEnregistrement, fraisNotaire, fraisDivers, tvaSurFrais, description };

    }, [prixAchat, region, isSolePrimaryResidence, revenuCadastral]);

    const modalFooter = (
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button>
            <button onClick={() => onApply(Math.round(totalFees))} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Appliquer ce montant</button>
        </div>
    );

    return (
        <BottomDrawerModal
            isOpen={isOpen}
            onClose={onClose}
            title="Estimateur des Frais d'Acquisition"
            footer={modalFooter}
        >
            <div className="space-y-6">
                {/* --- Questions --- */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-700">
                        <HelpIcon />
                        <span>Quelques questions pour affiner le calcul</span>
                    </h3>
                    <label className="block text-sm font-medium text-gray-700">Région</label>
                    <div className="flex gap-2">
                        <button onClick={() => setRegion('Wallonie')} className={`px-4 py-2 text-sm rounded-lg border-2 ${region === 'Wallonie' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>Wallonie</button>
                        <button onClick={() => setRegion('Bruxelles')} className={`px-4 py-2 text-sm rounded-lg border-2 ${region === 'Bruxelles' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>Bruxelles</button>
                        <button onClick={() => setRegion('Flandre')} className={`px-4 py-2 text-sm rounded-lg border-2 ${region === 'Flandre' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>Flandre</button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">S'agit-il de votre seule et unique habitation propre ?</label>
                    <div className="flex gap-2">
                        <button onClick={() => setIsSolePrimaryResidence(true)} className={`px-4 py-2 text-sm rounded-lg border-2 ${isSolePrimaryResidence ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>Oui</button>
                        <button onClick={() => setIsSolePrimaryResidence(false)} className={`px-4 py-2 text-sm rounded-lg border-2 ${!isSolePrimaryResidence ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>Non (Investissement / 2e résidence)</button>
                    </div>
                </div>
                {region === 'Wallonie' && isSolePrimaryResidence && (
                    <div className="p-3 bg-gray-50 border rounded-lg text-sm">
                        <p className="text-gray-600">Le calcul utilise le Revenu Cadastral de votre analyse :</p>
                        <p className="font-bold text-lg text-center text-blue-700 my-1">{revenuCadastral.toLocaleString('fr-BE')} €</p>
                        <p className="text-xs text-gray-500 text-center">Cette valeur est utilisée pour évaluer l'éligibilité au taux réduit de 6% en Wallonie.</p>
                    </div>
                )}

                {/* --- Disclaimer --- */}
                <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                    <AlertTriangleIcon />
                    <p className="text-xs text-yellow-800">
                        <strong>Avertissement :</strong> Cet outil fournit une estimation. Les frais réels peuvent varier. Seul le décompte officiel de votre notaire fait foi.
                    </p>
                </div>

                {/* --- Results --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="bg-gray-50 border rounded-lg order-2 md:order-1">
                        <button onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="w-full p-4 flex justify-between items-center text-left">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <ClipboardListIcon />
                                <span>Détail de l'estimation</span>
                            </h3>
                            <ChevronDownIcon className={`transition-transform duration-300 ${isDetailsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDetailsOpen && (
                            <div className="p-4 border-t space-y-2 animate-fade-in">
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Prix d'achat</span><span>{prixAchat.toLocaleString('fr-BE')} €</span></div>
                                {abattement > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Abattement fiscal</span><span className="text-green-600">-{abattement.toLocaleString('fr-BE')} €</span></div>}
                                <div className="flex justify-between text-sm border-t pt-1"><span className="text-gray-600">Base imposable</span><span>{baseImposable.toLocaleString('fr-BE')} €</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Droits d'enregistrement ({(rate * 100).toFixed(2)}%)</span><span>{droitsEnregistrement.toLocaleString('fr-BE')} €</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Honoraires notaire (estim.)</span><span>{fraisNotaire.toLocaleString('fr-BE')} €</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">Frais administratifs (estim.)</span><span>{fraisDivers.toLocaleString('fr-BE')} €</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">TVA (21%) sur honoraires & frais</span><span>{tvaSurFrais.toLocaleString('fr-BE')} €</span></div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-2 text-center order-1 md:order-2">
                        <h3 className="text-lg font-semibold text-blue-800">Total Frais d'Acquisition Estimés</h3>
                        <p className="text-4xl font-bold text-blue-700 py-4">{totalFees.toLocaleString('fr-BE')} €</p>
                    </div>
                </div>
            </div>
        </BottomDrawerModal>
    );
};

export default AcquisitionFeesEstimatorModal;
