import React from 'react';

const TermsOfServicePage = ({ onBack }) => (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Conditions Générales d'Utilisation</h1>
        <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour</button>
        <div className="prose max-w-none text-gray-700 space-y-4">
            <p>Dernière mise à jour : 3 novembre 2025</p>

            <h2 className="text-xl font-semibold">1. Objet</h2>
            <p>Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les modalités de mise à disposition de l'application Strady.imo et ses conditions d'utilisation par l'Utilisateur.</p>

            <h2 className="text-xl font-semibold">2. Avertissement</h2>
            <p>Strady.imo est un outil d'aide à la décision et de simulation. Les calculs (rendement, cash-flow, mensualités, etc.) sont des estimations basées sur les données que vous fournissez. Ils ne sauraient en aucun cas être considérés comme des conseils financiers, fiscaux ou juridiques.</p>
            <p>Les résultats fournis par l'application sont à titre informatif et ne remplacent pas l'avis d'un professionnel (notaire, agent immobilier, comptable, etc.). L'éditeur de Strady.imo ne pourra être tenu responsable des décisions d'investissement prises par l'Utilisateur.</p>

            <h2 className="text-xl font-semibold">3. Accès au service</h2>
            <p>L'accès à l'application est gratuit. La création d'un compte est nécessaire pour sauvegarder les analyses.</p>

            <h2 className="text-xl font-semibold">4. Propriété intellectuelle</h2>
            <p>Le contenu de l'application (structure, design, code, textes) est la propriété exclusive de l'éditeur. Toute reproduction, même partielle, est interdite sans autorisation.</p>
            <p>Copyright © 2025 Strady.imo - Tous droits réservés.</p>

            <h2 className="text-xl font-semibold">5. Responsabilité de l'Utilisateur</h2>
            <p>L'Utilisateur est seul responsable des données qu'il saisit dans l'application et des décisions qu'il prend sur la base des simulations fournies.</p>

            <h2 className="text-xl font-semibold">6. Modification des CGU</h2>
            <p>L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle.</p>
        </div>
    </div>
);

export default TermsOfServicePage;
