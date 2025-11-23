import React, { useState, useMemo, useEffect } from 'react';
import { generateUniqueId } from '../utils/generateUniqueId';
import { TrashIcon, PlusCircleIcon } from '../Icons';
import BottomSheetDrawer from './BottomSheetDrawer';
import FormattedInput from './FormattedInput';

const ChargesEstimatorDrawer = ({ isOpen, onClose, onApply, data }) => {
    const [charges, setCharges] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (data.rental?.chargesAnnuelles?.details && data.rental.chargesAnnuelles.details.length > 0) {
                setCharges(data.rental.chargesAnnuelles.details);
            } else {
                const estimatedInsurance = (data.prixAchat > 0) ? Math.round(data.prixAchat * 0.0012) : 250;
                const estimatedPrecompte = (data.revenuCadastral > 0) ? Math.round(data.revenuCadastral * 1.8) : 950;
                const estimatedVacancy = (data.loyerEstime > 0) ? Math.round(data.loyerEstime * 0.0833) : 125;

                const defaultCharges = [
                    { id: generateUniqueId(), object: 'Assurance PNO (Propriétaire Non-Occupant)', price: estimatedInsurance, periodicity: 'An' },
                    { id: generateUniqueId(), object: 'Précompte immobilier', price: estimatedPrecompte, periodicity: 'An' },
                    { id: generateUniqueId(), object: 'Provision pour vacance locative', price: estimatedVacancy, periodicity: 'Mois' },
                ];
                setCharges(defaultCharges);
            }
        }
    }, [isOpen, data]);

    const addCharge = () => {
        setCharges([...charges, { id: generateUniqueId(), object: '', price: 0, periodicity: 'Mois' }]);
    };

    const removeCharge = (id) => {
        setCharges(charges.filter(charge => charge.id !== id));
    };

    const updateCharge = (id, field, value) => {
        setCharges(charges.map(charge => {
            if (charge.id !== id) return charge;
            const processedValue = field === 'price' ? parseFloat(value) || 0 : value;
            return { ...charge, [field]: processedValue };
        }));
    };

    const totalCharges = useMemo(() => {
        return charges.reduce((total, charge) => {
            const monthlyPrice = charge.periodicity === 'An' ? charge.price / 12 : charge.price;
            return total + monthlyPrice;
        }, 0);
    }, [charges]);

    const modalFooter = (
        <>
            <div className="text-right mb-4">
                <span className="text-lg font-medium">Total Charges Mensuelles:</span>
                <span className="text-2xl font-bold text-red-600 ml-2">{totalCharges.toFixed(2)} €</span>
            </div>
            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button>
                <button onClick={() => onApply(totalCharges, charges)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Appliquer</button>
            </div>
        </>
    );

    return (
        <BottomSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            title="Estimateur de Charges"
            footer={modalFooter}
        >
            <div className="space-y-3">
                {charges.map((charge, index) => (
                    <div key={charge.id} className="p-3 border rounded-lg grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
                        <div className="md:col-span-3">
                            <label className="text-sm font-medium">Charge {index + 1}</label>
                            <input
                                type="text"
                                placeholder="Ex: Assurance PNO"
                                value={charge.object}
                                onChange={(e) => updateCharge(charge.id, 'object', e.target.value)}
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium">Montant (€)</label>
                            <FormattedInput
                                name="price"
                                placeholder="Montant"
                                value={charge.price}
                                onChange={(e) => updateCharge(charge.id, 'price', e.target.value)}
                                unit="€"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-sm font-medium">Période</label>
                            <select
                                value={charge.periodicity}
                                onChange={(e) => updateCharge(charge.id, 'periodicity', e.target.value)}
                                className="mt-1 w-full p-2 border rounded-md"
                            >
                                <option>Mois</option>
                                <option>An</option>
                            </select>
                        </div>
                        <div className="text-right md:pt-6">
                            <button onClick={() => removeCharge(charge.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full" title="Supprimer la charge">
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={addCharge} className="w-full flex items-center justify-center gap-2 mt-4 py-2 px-4 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50 border-blue-400">
                    <PlusCircleIcon /> Ajouter une charge
                </button>
            </div>
        </BottomSheetDrawer>
    );
};

export default ChargesEstimatorDrawer;
