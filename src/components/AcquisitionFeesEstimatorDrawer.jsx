import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangleIcon, ClipboardListIcon, HelpIcon, ChevronDownIcon } from '../Icons';
import BottomSheetDrawer from './BottomSheetDrawer';

const AcquisitionFeesEstimatorDrawer = ({ isOpen, onClose, onApply, prixAchat, revenuCadastral }) => {
    const { t } = useTranslation();
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
                if (base <= 430000) {
                    abattement = Math.min(base, 40000);
                }
                if (revenuCadastral > 0 && revenuCadastral <= 745 && base <= 267737) {
                    rate = 0.06;
                    description = "Taux réduit (6%)";
                }
            } else if (region === 'Bruxelles') {
                rate = 0.125;
                if (base <= 600000) {
                    abattement = Math.min(base, 200000);
                }
            } else if (region === 'Flandre') {
                rate = 0.03;
                description = "Taux unique (3%)";
            }
        } else {
            if (region === 'Flandre') rate = 0.12;
            else rate = 0.125;
        }

        const baseImposable = Math.max(0, base - abattement);
        const droitsEnregistrement = baseImposable * rate;

        const fraisNotaire = 1500 + (base * 0.005);
        const fraisDivers = 1200;
        const tvaSurFrais = (fraisNotaire + fraisDivers) * 0.21;
        const totalFees = droitsEnregistrement + fraisNotaire + fraisDivers + tvaSurFrais;

        return { totalFees, rate, abattement, baseImposable, droitsEnregistrement, fraisNotaire, fraisDivers, tvaSurFrais, description };

    }, [prixAchat, region, isSolePrimaryResidence, revenuCadastral]);

    const modalFooter = (
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">{t('cancel')}</button>
            <button onClick={() => onApply(Math.round(totalFees))} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">{t('apply_amount')}</button>
        </div>
    );

    return (
        <BottomSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={t('acquisition_fees_estimator')}
            footer={modalFooter}
        >
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-700">
                        <HelpIcon />
                        <span>{t('questions_to_refine_calculation')}</span>
                    </h3>
                    <label className="block text-sm font-medium text-gray-700">{t('region')}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setRegion('Wallonie')} className={`px-4 py-2 text-sm rounded-lg border-2 ${region === 'Wallonie' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>{t('wallonia')}</button>
                        <button onClick={() => setRegion('Bruxelles')} className={`px-4 py-2 text-sm rounded-lg border-2 ${region === 'Bruxelles' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>{t('brussels')}</button>
                        <button onClick={() => setRegion('Flandre')} className={`px-4 py-2 text-sm rounded-lg border-2 ${region === 'Flandre' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>{t('flanders')}</button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('is_sole_primary_residence')}</label>
                    <div className="flex gap-2">
                        <button onClick={() => setIsSolePrimaryResidence(true)} className={`px-4 py-2 text-sm rounded-lg border-2 ${isSolePrimaryResidence ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>{t('yes')}</button>
                        <button onClick={() => setIsSolePrimaryResidence(false)} className={`px-4 py-2 text-sm rounded-lg border-2 ${!isSolePrimaryResidence ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-500'}`}>{t('no_investment_second_residence')}</button>
                    </div>
                </div>
                {region === 'Wallonie' && isSolePrimaryResidence && (
                    <div className="p-3 bg-gray-50 border rounded-lg text-sm">
                        <p className="text-gray-600">{t('cadastral_income_note')}</p>
                        <p className="font-bold text-lg text-center text-blue-700 my-1">{(revenuCadastral || 0).toLocaleString('fr-BE')} €</p>
                        <p className="text-xs text-gray-500 text-center">{t('eligibility_note')}</p>
                    </div>
                )}

                <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                    <AlertTriangleIcon />
                    <p className="text-xs text-yellow-800">
                        <strong>{t('warning')}:</strong> {t('estimation_warning')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="bg-gray-50 border rounded-lg order-2 md:order-1">
                        <button onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="w-full p-4 flex justify-between items-center text-left">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <ClipboardListIcon />
                                <span>{t('estimation_details')}</span>
                            </h3>
                            <ChevronDownIcon className={`transition-transform duration-300 ${isDetailsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDetailsOpen && (
                            <div className="p-4 border-t space-y-2 animate-fade-in">
                                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('purchase_price')}</span><span>{prixAchat.toLocaleString('fr-BE')} €</span></div>
                                {abattement > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">{t('fiscal_abatement')}</span><span className="text-green-600">-{abattement.toLocaleString('fr-BE')} €</span></div>}
                                <div className="flex justify-between text-sm border-t pt-1"><span className="text-gray-600">{t('taxable_base')}</span><span>{baseImposable.toLocaleString('fr-BE')} €</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('registration_fees')} ({(rate * 100).toFixed(2)}%)</span><span>{droitsEnregistrement.toLocaleString('fr-BE')} €</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('notary_fees_estimate')}</span><span>{fraisNotaire.toLocaleString('fr-BE')} €</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('administrative_fees_estimate')}</span><span>{fraisDivers.toLocaleString('fr-BE')} €</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-600">{t('vat_on_fees')}</span><span>{tvaSurFrais.toLocaleString('fr-BE')} €</span></div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg space-y-2 text-center order-1 md:order-2">
                        <h3 className="text-lg font-semibold text-blue-800">{t('total_estimated_acquisition_fees')}</h3>
                        <p className="text-4xl font-bold text-blue-700 py-4">{totalFees.toLocaleString('fr-BE')} €</p>
                    </div>
                </div>
            </div>
        </BottomSheetDrawer>
    );
};

export default AcquisitionFeesEstimatorDrawer;
