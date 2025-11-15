import React, { useState, useMemo, useEffect } from 'react';
import { TrashIcon, PlusCircleIcon } from './Icons';
import { generateUniqueId } from './utils/generateUniqueId';
import BottomDrawerModal from './BottomDrawerModal';

const RentSplitterModal = ({ isOpen, onClose, onApply, initialUnits = [] }) => {
    const [units, setUnits] = useState(initialUnits.length > 0 ? initialUnits : [{ id: generateUniqueId(), name: 'Garage', rent: 100 }, { id: generateUniqueId(), name: 'Studio', rent: 325 }]);
    
    useEffect(() => {
        // Assure que les unités initiales ont des IDs uniques pour la session
        const unitsWithIds = initialUnits.map(u => ({ ...u, id: u.id || generateUniqueId() }));
        if (unitsWithIds.length > 0) {
            setUnits(unitsWithIds);
        }
    }, [initialUnits, isOpen]);
    
    const addUnit = () => {
        setUnits([...units, { id: generateUniqueId(), name: `Unité ${units.length + 1}`, rent: 0 }]);
    };

    const removeUnit = (id) => {
        setUnits(units.filter(unit => unit.id !== id));
    };

    const updateUnit = (id, field, value) => {
        setUnits(units.map(unit => {
            if (unit.id !== id) return unit;
            const processedValue = field === 'rent' ? parseFloat(value) || 0 : value;
            return { ...unit, [field]: processedValue };
        }));
    };

    const totalRent = useMemo(() => units.reduce((total, unit) => total + (unit.rent || 0), 0), [units]);

    const modalFooter = (
        <>
            <div className="text-right mb-4"><span className="text-lg font-medium">Loyer Total Estimé:</span><span className="text-2xl font-bold text-green-600 ml-2">{totalRent.toLocaleString('fr-BE')} € / mois</span></div>
            <div className="flex justify-end gap-3"><button onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Annuler</button><button onClick={() => onApply(totalRent, units)} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">Appliquer</button></div>
        </>
    );

    return (
        <BottomDrawerModal
            isOpen={isOpen}
            onClose={onClose}
            title="Répartition des Loyers par Unité"
            footer={modalFooter}
        >
            <p className="text-sm text-gray-500 mb-4">Détaillez les loyers pour chaque unité (chambre, studio, appartement...). Le total sera appliqué au champ "Loyer estimé".</p>
            <div className="space-y-3">
                {units.map((unit, index) => (
                    <div key={unit.id} className="p-3 border rounded-lg grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                        <div className="md:col-span-3">
                            <label className="text-sm font-medium">Nom de l'unité {index + 1}</label>
                            <input
                                type="text"
                                placeholder="Ex: Chambre 1, Studio RDC"
                                value={unit.name}
                                onChange={(e) => updateUnit(unit.id, 'name', e.target.value)}
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium">Loyer HC (€)</label>
                            <input
                                type="number"
                                placeholder="500"
                                value={unit.rent}
                                onChange={(e) => updateUnit(unit.id, 'rent', e.target.value)}
                                className="mt-1 w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="text-right md:pt-6">
                            <button onClick={() => removeUnit(unit.id)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full" title="Supprimer l'unité">
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={addUnit} className="w-full flex items-center justify-center gap-2 mt-4 py-2 px-4 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50 border-blue-400">
                    <PlusCircleIcon /> Ajouter une unité
                </button>
            </div>
        </BottomDrawerModal>
    );
};

export default RentSplitterModal;