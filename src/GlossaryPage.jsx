import React, { useState, useMemo } from 'react';

const GlossaryPage = ({ onBack }) => {
    const terms = [
        {
            term: 'Revenu Cadastral (RC)',
            definition: "Le revenu cadastral est le revenu fictif que l'administration fiscale attribue à chaque bien immobilier. Il sert de base au calcul du précompte immobilier et à la taxation des revenus immobiliers en personne physique."
        },
        {
            term: 'Précompte Immobilier',
            definition: "C'est un impôt régional sur les biens immobiliers. Il est calculé sur base du revenu cadastral indexé et varie selon la commune."
        },
        {
            term: 'Droits d\'enregistrement',
            definition: "C'est la taxe que vous payez lors de l'achat d'un bien immobilier existant. En Wallonie et à Bruxelles, le taux est de 12,5%. En Flandre, il est de 12% (avec des taux réduits sous conditions)."
        },
        {
            term: 'Quotité',
            definition: "La quotité d'emprunt est le pourcentage du prix d'achat (et parfois des travaux) que la banque accepte de financer. Une quotité de 90% signifie que vous devez apporter 10% du montant en fonds propres, en plus des frais."
        },
        {
            term: 'PEB (Performance Énergétique des Bâtiments)',
            definition: "Le certificat PEB est un document qui évalue la performance énergétique d'un bâtiment sur une échelle allant de A+ (très économe) à G (très énergivore). Il est obligatoire pour la vente et la location."
        },
        {
            term: 'Cash-Flow',
            definition: "Le cash-flow est la différence entre les entrées (loyers) et les sorties d'argent (mensualité de crédit, charges, taxes) sur une période donnée. Un cash-flow positif signifie que l'investissement génère plus d'argent qu'il n'en coûte."
        },
        {
            term: 'Cash-on-Cash Return (CoC)',
            definition: "Le retour sur fonds propres. C'est un ratio qui mesure le cash-flow annuel par rapport au montant total des fonds propres investis (votre apport). C'est un excellent indicateur de la performance de votre argent."
        },
        {
            term: 'Acte authentique',
            definition: "C'est l'acte officiel de vente rédigé et signé par le notaire. Il rend la vente opposable à tous et assure la sécurité juridique de la transaction."
        },
    ];

    const [searchTerm, setSearchTerm] = useState('');

    const filteredTerms = useMemo(() => {
        if (!searchTerm) {
            return terms.sort((a, b) => a.term.localeCompare(b.term));
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return terms
            .filter(item =>
                item.term.toLowerCase().includes(lowercasedFilter) ||
                item.definition.toLowerCase().includes(lowercasedFilter)
            )
            .sort((a, b) => a.term.localeCompare(b.term));
    }, [searchTerm, terms]);

    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Glossaire Immobilier</h1>
            <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour</button>
            
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Rechercher un terme..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="space-y-6">
                {filteredTerms.length > 0 ? (
                    filteredTerms.map(item => (
                        <div key={item.term} className="border-b pb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{item.term}</h3>
                            <p className="text-gray-600 mt-1">{item.definition}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-8">Aucun terme trouvé pour "{searchTerm}".</p>
                )}
            </div>
        </div>
    );
};

export default GlossaryPage;
                    <div key={item.term} className="border-b pb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{item.term}</h3>
                        <p className="text-gray-600 mt-1">{item.definition}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlossaryPage;