import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from './Icons';
import BottomDrawerModal from './BottomDrawerModal';
import FormattedInput from './components/FormattedInput';
 
const WorkEstimatorModal = ({ isOpen, onClose, onSave, initialValue }) => {
    const defaultWorkItem = { name: '', cost: '' };
    const exampleWorkItems = [
        { name: 'Mise en conformité électrique', cost: 2500 },
        { name: 'Peinture', cost: 1500 },
        { name: 'Salle de bain', cost: 2500 },
    ];
 
    const [workItems, setWorkItems] = useState(initialValue > 0 ? [{ name: 'Travaux existants', cost: initialValue }] : exampleWorkItems);
    const [errors, setErrors] = useState([]);
 
    useEffect(() => {
        if (isOpen) {
            setWorkItems(initialValue > 0 ? [{ name: 'Travaux existants', cost: initialValue }] : exampleWorkItems);
            setErrors([]); // Reset errors when modal opens
        }
    }, [isOpen, initialValue]);
 
    const handleItemChange = (index, field, value) => {
        const newItems = [...workItems];
        newItems[index][field] = value;
        setWorkItems(newItems);
    };
 
    const addNewItem = () => {
        setWorkItems([...workItems, { ...defaultWorkItem }]);
    };
 
    const removeItem = (index) => {
        const newItems = workItems.filter((_, i) => i !== index);
        setWorkItems(newItems);
    };
 
    const totalCost = workItems.reduce((total, item) => total + (parseFloat(item.cost) || 0), 0);
 
    const validateItems = () => {
        const newErrors = workItems.map(item => {
            const itemErrors = {};
            if (!item.name.trim()) {
                itemErrors.name = 'Le nom est requis.';
            }
            if (!item.cost || parseFloat(item.cost) <= 0) {
                itemErrors.cost = 'Le coût doit être positif.';
            }
            return itemErrors;
        });
 
        setErrors(newErrors);
        return !newErrors.some(itemErrors => Object.keys(itemErrors).length > 0);
    };
 
    const handleSave = () => {
        if (validateItems()) {
            onSave(totalCost, workItems);
            onClose();
        }
    };
 
    const modalFooter = (
        <>
            <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Coût Total Estimé:</span>
                <span className="text-2xl font-bold text-blue-700">{totalCost.toLocaleString('fr-BE')} €</span>
            </div>
            <button 
                onClick={handleSave} 
                className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
                Appliquer ce montant
            </button>
        </>
    );
 
    return (
        <BottomDrawerModal
            isOpen={isOpen}
            onClose={onClose}
            title="Estimation du Coût des Travaux"
            footer={modalFooter}
        >
            <div className="space-y-3">
                {workItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 animate-fade-in">
                        <div className="flex-grow">
                            <input
                                type="text"
                                placeholder="Type de travaux (ex: Cuisine)"
                                value={item.name}
                                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                className={`w-full p-2 border rounded-md ${errors[index]?.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors[index]?.name && <p className="text-red-500 text-xs mt-1">{errors[index].name}</p>}
                        </div>
                        <div className="w-48">
                            <FormattedInput
                                name="cost"
                                placeholder="Coût"
                                value={item.cost}
                                onChange={(e) => handleItemChange(index, 'cost', e.target.value)}
                                unit="€"
                                className={errors[index]?.cost ? 'border-red-500' : ''}
                            />
                            {errors[index]?.cost && <p className="text-red-500 text-xs mt-1">{errors[index].cost}</p>}
                        </div>
                        <button onClick={() => removeItem(index)} className="p-2 text-red-500 hover:text-red-700 mt-1">
                            <TrashIcon />
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={addNewItem} className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
                <PlusIcon />
                Ajouter une ligne
            </button>
        </BottomDrawerModal>
    );
};

export default WorkEstimatorModal;