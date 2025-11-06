import React from 'react';

const PrivacyPolicyPage = ({ onBack }) => (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Politique de Confidentialité</h1>
        <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour</button>
        <div className="prose max-w-none text-gray-700 space-y-4">
            <p>Dernière mise à jour : 3 novembre 2025</p>
            
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p>Bienvenue sur Strady.imo. Nous nous engageons à protéger votre vie privée. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations.</p>

            <h2 className="text-xl font-semibold">2. Informations que nous collectons</h2>
            <p>Nous pouvons collecter les informations suivantes :</p>
            <ul className="list-disc list-inside">
                <li><strong>Informations personnelles :</strong> Nom, prénom, adresse e-mail que vous fournissez lors de la création de votre compte.</li>
                <li><strong>Données d'analyse :</strong> Les données que vous entrez dans le simulateur (prix d'achat, loyers, etc.). Ces données sont associées à votre compte pour que vous puissiez les retrouver.</li>
                <li><strong>Données de feedback :</strong> Les notes et commentaires que vous choisissez de nous envoyer.</li>
            </ul>

            <h2 className="text-xl font-semibold">3. Comment nous utilisons vos informations</h2>
            <p>Vos informations sont utilisées pour :</p>
            <ul className="list-disc list-inside">
                <li>Fournir, opérer et maintenir le service.</li>
                <li>Vous permettre de sauvegarder et de retrouver vos analyses.</li>
                <li>Améliorer l'application grâce à vos feedbacks.</li>
                <li>Communiquer avec vous, si nécessaire.</li>
            </ul>

            <h2 className="text-xl font-semibold">4. Stockage des données</h2>
            <p>Vos données sont stockées de manière sécurisée chez notre fournisseur de base de données, Supabase. Nous utilisons le stockage local de votre navigateur (LocalStorage) uniquement pour des fonctionnalités essentielles, comme le maintien de votre session de connexion ou la gestion de l'affichage de messages d'information (comme la bannière de cookies).</p>

            <h2 className="text-xl font-semibold">5. Vos droits (GDPR)</h2>
            <p>Conformément au GDPR, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside">
                <li><strong>Droit d'accès :</strong> Vous pouvez demander une copie des données que nous détenons sur vous.</li>
                <li><strong>Droit de rectification :</strong> Vous pouvez modifier les informations de votre compte à tout moment.</li>
                <li><strong>Droit à l'oubli :</strong> Vous pouvez supprimer votre compte et toutes les données associées depuis la page "Mon profil". Cette action est irréversible.</li>
            </ul>

            <h2 className="text-xl font-semibold">6. Cookies et Stockage Local</h2>
            <p>Nous n'utilisons pas de cookies de suivi ou de publicité. Nous utilisons uniquement le stockage local (LocalStorage) qui est essentiel au bon fonctionnement de l'application (par exemple, pour gérer votre authentification). Aucune information personnelle n'est stockée de manière non sécurisée.</p>

            <h2 className="text-xl font-semibold">7. Contact</h2>
            <p>Pour toute question relative à cette politique, veuillez nous contacter à [VOTRE ADRESSE EMAIL].</p>
        </div>
    </div>
);

export default PrivacyPolicyPage;
