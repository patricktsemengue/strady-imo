import React from 'react';

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle h-5 w-5 flex-shrink-0">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
    </svg>
);

const KnowledgePage = ({ onBack }) => (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Base de Connaissances sur l'Investissement Locatif</h1>
        <button onClick={onBack} className="mb-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">&larr; Retour</button>

        <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 mb-6">
            <AlertTriangleIcon />
            <p className="text-sm text-yellow-800"><strong>Avertissement :</strong> Les informations présentées ici sont à but éducatif uniquement et ne constituent en aucun cas un conseil financier, juridique ou fiscal. Consultez toujours un professionnel qualifié avant de prendre une décision d'investissement.</p>
        </div>

        <div className="prose max-w-none text-gray-700 space-y-6">

            {/* --- PHASE 1 : LE MARCHÉ --- */}
            <h2 className="text-xl font-semibold">Chapitre 1 : Étude du Marché</h2>
            <p>L'objectif de cette phase est de comprendre les tendances générales, le cadre légal et les zones porteuses en Belgique avant même de chercher des biens.</p>
            <h3 className="text-lg font-semibold">1.1. Étude Démographique et Économique</h3>
            <p>Comprendre qui sont les locataires potentiels et quelle est leur santé financière. Sources : Statbel, IWEPS. Indicateurs : croissance démographique, structure de la population, pôles d'attractivité, revenu médian.</p>
            <p className="text-sm"><strong>Sources :</strong> <a href="https://statbel.fgov.be" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Statbel (Office belge de statistique)</a>, <a href="https://www.iweps.be" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">IWEPS (Institut wallon de l'évaluation)</a>.</p>
            <h3 className="text-lg font-semibold">1.2. Tendances du Marché Immobilier</h3>
            <p>Sources : Baromètre des notaires, Statbel. Indicateurs : prix de vente moyen au m², prix de location moyen, taux de vacance locative.</p>
            <p className="text-sm"><strong>Source :</strong> <a href="https://www.notaire.be/immobilier/barometre-des-notaires" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Baromètre des Notaires de Belgique</a>.</p>
            <h3 className="text-lg font-semibold">1.3. Emplacement : Analyse Micro (Ville/Quartier)</h3>
            <p>Une fois une ou plusieurs villes cibles identifiées, il faut zoomer sur les quartiers. Analysez la proximité des services (transports, commerces, écoles), la qualité de vie et le profil des locataires.</p>
            <p className="text-sm"><strong>Outil :</strong> Pour explorer les quartiers, des portails comme <a href="https://www.immoweb.be" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Immoweb</a> ou <a href="https://immo.vlan.be" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ImmoVlan</a> peuvent être un bon point de départ.</p>

            {/* --- PHASE 2 : LE PROJET --- */}
            <h2 className="text-xl font-semibold">Chapitre 2 : Le Projet et sa Visite</h2>
            <h3 className="text-lg font-semibold">2.1. Type de projet : Achat, Rénovation, Construction</h3>
            <p>Chaque projet a ses spécificités. L'achat d'un bien "clé sur porte" offre une tranquillité d'esprit mais un rendement souvent plus faible. La rénovation permet de créer de la valeur ("forced equity") mais nécessite une bonne estimation des coûts et du temps. La construction neuve élimine les gros travaux imprévus mais implique des coûts initiaux plus élevés et une gestion de projet complexe.</p>
            <h3 className="text-lg font-semibold">2.2. La Visite du bien</h3>
            <p>La visite est une étape critique. Ne vous laissez pas séduire par la décoration. Inspectez les points structurels : la toiture, les façades, les châssis, les signes d'humidité (taches, odeurs), l'état de l'installation électrique et de la plomberie. Pour un appartement, renseignez-vous sur l'état de la copropriété et consultez les derniers rapports d'assemblée générale.</p>
            <h3 className="text-lg font-semibold">2.3. Check-list des Travaux</h3>
            <p>Établissez une liste précise des travaux à réaliser et faites-les chiffrer par des professionnels. Les postes les plus coûteux sont souvent : la toiture, la mise en conformité de l'électricité, le remplacement du système de chauffage, les châssis, la cuisine et la salle de bain. Un budget bien préparé évite les mauvaises surprises.</p>
            <h3 className="text-lg font-semibold">2.4. Conformité Urbanistique</h3>
            <p>Il est impératif de vérifier que la situation de fait du bien correspond à sa situation de droit (permis d'urbanisme). Un bien vendu comme un immeuble de 3 appartements est-il bien reconnu comme tel par la commune ? Une non-conformité peut bloquer votre financement et entraîner des coûts importants.</p>
            <p className="text-sm"><strong>Sources :</strong> Renseignez-vous auprès du service urbanisme de la commune concernée. Portails régionaux : <a href="https://urban.brussels/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">urban.brussels</a>, <a href="https://www.omgeving.vlaanderen.be" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Omgeving Vlaanderen</a>.</p>
            <h3 className="text-lg font-semibold">2.5. Le PEB et la Conformité pour la Location</h3>
            <p>Le certificat PEB (Performance Énergétique des Bâtiments) est obligatoire. Un mauvais score peut vous obliger à réaliser des travaux d'isolation coûteux à l'avenir, au vu des réglementations régionales de plus en plus strictes. Assurez-vous également de la présence de détecteurs de fumée et de la conformité électrique.</p>
            <p className="text-sm"><strong>Sources :</strong> <a href="https://energie.wallonie.be/fr/certificat-peb.html?IDC=6350" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PEB en Wallonie</a>, <a href="https://environnement.brussels/thematiques/batiment/obligations-en-cas-de-vente-ou-location/le-certificat-peb" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">PEB à Bruxelles</a>, <a href="https://www.vlaanderen.be/epc-voor-een-wooneenheid" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">EPC en Flandre</a>.</p>

            {/* --- PHASE 3 : LE FINANCEMENT --- */}
            <h2 className="text-xl font-semibold">Chapitre 3 : Le Financement</h2>
            <h3 className="text-lg font-semibold">3.1. Montage du dossier de crédit</h3>
            <p>Un dossier de crédit solide est la clé. Les banques analysent votre capacité de remboursement (revenus stables, taux d'endettement raisonnable) et votre apport personnel. Préparez vos fiches de paie, avertissements-extraits de rôle et preuves de fonds propres pour accélérer le processus.</p>
            <p className="text-sm"><strong>Source :</strong> <a href="https://www.wikifin.be/fr/thematiques/emprunter/credit-hypothecaire" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikifin.be (par la FSMA)</a>.</p>
            <h3 className="text-lg font-semibold">3.2. Rôle du Notaire et Visite</h3>
            <p>Le notaire est un officier public qui garantit la sécurité juridique de la transaction. Il effectue les recherches urbanistiques, vérifie l'absence de dettes sur le bien et rédige l'acte authentique de vente. Il est votre meilleur allié pour toutes les questions légales et fiscales.</p>
            <p className="text-sm"><strong>Source :</strong> <a href="https://www.notaire.be" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Notaire.be</a>.</p>

            {/* --- PHASE 4 : L'EXPLOITATION --- */}
            <h2 className="text-xl font-semibold">Chapitre 4 : L'Exploitation Locative</h2>
            <h3 className="text-lg font-semibold">4.1. Type de location : Classique, Co-living, Courte durée</h3>
            <p>La location classique (bail de 9 ans) offre stabilité et simplicité de gestion. Le co-living (colocation) peut augmenter significativement les revenus mais implique une gestion plus active. La location courte durée (type Airbnb) offre le plus haut potentiel de revenus mais est soumise à une réglementation stricte et une forte implication personnelle.</p>
            <h3 className="text-lg font-semibold">4.2. Choix de la mise en location</h3>
            <p>Gérer soi-même sa location permet d'économiser les frais d'agence (généralement un mois de loyer) mais demande du temps et des connaissances (rédaction du bail, état des lieux, gestion des problèmes). Une agence immobilière peut prendre en charge tout le processus, de la recherche du locataire à la gestion quotidienne.</p>
            <h3 className="text-lg font-semibold">4.3. Choix des locataires</h3>
            <p>Le choix du locataire est l'un des aspects les plus critiques de l'investissement. Un bon locataire est plus précieux qu'un loyer légèrement plus élevé. Vérifiez systématiquement sa solvabilité (fiches de paie, contrat de travail) et n'hésitez pas à demander des références. Un bon feeling est important, mais il doit être soutenu par des preuves tangibles.</p>
            <h3 className="text-lg font-semibold">4.4. Charges d'Exploitation</h3>
            <p>Ce sont toutes les dépenses que vous devrez supporter en tant que propriétaire. Elles incluent le précompte immobilier, l'assurance propriétaire non-occupant (PNO), les frais de syndic pour les copropriétés, les provisions pour l'entretien et les réparations, et la vacance locative (périodes où le bien n'est pas loué).</p>
            <h3 className="text-lg font-semibold">4.5. Les Types de Baux en Belgique</h3>
            <p>Le choix du bail dépend de votre stratégie et de la législation régionale. Voici les principaux :</p>
            <ul className="list-disc list-inside space-y-2">
                <li><strong>Le bail de résidence principale (9 ans) :</strong> C'est le contrat standard. Il offre une grande stabilité au locataire, qui peut y mettre fin à tout moment avec un préavis de 3 mois (et une indemnité durant les 3 premières années). Pour le propriétaire, les possibilités de résiliation sont plus limitées (occupation personnelle, travaux importants).</li>
                <li><strong>Le bail de courte durée (3 ans ou moins) :</strong> Idéal pour la flexibilité. Il ne peut être prorogé qu'une seule fois par écrit, sans que la durée totale ne dépasse 3 ans. S'il se poursuit au-delà, il est automatiquement requalifié en bail de 9 ans.</li>
                <li><strong>Le bail étudiant :</strong> D'une durée de 10 ou 12 mois, il est adapté au rythme de l'année académique et offre des conditions de résiliation anticipée plus souples pour l'étudiant.</li>
                <li><strong>Le bail de colocation :</strong> De plus en plus encadré, notamment à Bruxelles et en Wallonie, il lie plusieurs locataires par un "pacte de colocation". Cela simplifie grandement la gestion des départs et arrivées au sein du groupe.</li>
            </ul>
            <p className="text-sm"><strong>Sources :</strong> La matière du bail étant régionalisée, consultez les portails officiels : <a href="https://logement.brussels/louer/le-bail-en-pratique/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Logement.brussels</a>, <a href="https://logement.wallonie.be/fr/bail-dhabitation" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Logement Wallonie</a>, <a href="https://www.wonenvlaanderen.be/huren" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wonen in Vlaanderen</a>.</p>

            <h3 className="text-lg font-semibold">4.6. L'Assurance Loyer Impayé (ALI)</h3>
            <p>L'Assurance Loyer Impayé est une protection pour le propriétaire contre le risque de non-paiement des loyers. Elle peut également couvrir les frais de procédure judiciaire et parfois les dégradations immobilières. Le coût de cette assurance représente généralement un pourcentage du loyer annuel (entre 2% et 5%) et est déductible fiscalement des revenus immobiliers.</p>
            <p>Pour y souscrire, les assureurs exigent que le locataire présente un dossier solide (revenus stables, taux d'effort raisonnable), ce qui constitue en soi un filtre de sélection supplémentaire. C'est un arbitrage entre la sécurité totale et un rendement légèrement inférieur.</p>
            <p className="text-sm"><strong>Source :</strong> <a href="https://www.wikifin.be/fr/thematiques/construire-acheter-ou-louer/mettre-en-location/comment-vous-proteger-contre-les-loyers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Wikifin.be - Protection contre les loyers impayés</a>.</p>


            {/* --- PHASE 5 : LA FISCALITÉ --- */}
            <h2 className="text-xl font-semibold">Chapitre 5 : La Fiscalité</h2>
            <h3 className="text-lg font-semibold">5.1. Fiscalité en personne physique</h3>
            <p>Pour une location non meublée à un particulier, vous n'êtes pas taxé sur les loyers réels, mais sur le Revenu Cadastral (RC) indexé, majoré de 40%. Ce montant s'ajoute à vos autres revenus et est taxé à votre taux marginal d'imposition. C'est un système très avantageux en Belgique.</p>
            <p className="text-sm"><strong>Source :</strong> <a href="https://finances.belgium.be/fr/particuliers/habitation/revenus-immobiliers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SPF Finances - Revenus immobiliers</a>.</p>
            <h3 className="text-lg font-semibold">5.2. Fiscalité en société</h3>
            <p>Si le bien est détenu par une société (SCI, SRL), l'imposition se fait sur les loyers réels perçus, après déduction de toutes les charges (intérêts d'emprunt, travaux, assurances, amortissements...). Le bénéfice est soumis à l'impôt des sociétés (ISOC), dont le taux est généralement de 20% ou 25%.</p>
            <p className="text-sm"><strong>Source :</strong> <a href="https://finances.belgium.be/fr/societes/impot-des-societes" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SPF Finances - Impôt des sociétés</a>.</p>
            <h3 className="text-lg font-semibold">5.3. Risque de requalification en revenu professionnel</h3>
            <p>Si l'administration fiscale considère que votre activité de location dépasse la "gestion normale d'un patrimoine privé" (par exemple, si vous avez de nombreux biens, si vous avez emprunté pour acheter, ou si vous effectuez des opérations rapides d'achat-revente), les revenus locatifs pourraient être requalifiés en revenus professionnels, soumis aux cotisations sociales et à des taux d'imposition plus élevés.</p>

            {/* --- PHASE 6 : LA SORTIE --- */}
            <h2 className="text-xl font-semibold">Chapitre 6 : La Revente</h2>
            <h3 className="text-lg font-semibold">6.1. Stratégie de revente et plus-value</h3>
            <p>La revente peut être une stratégie pour réaliser une plus-value et réinvestir dans un projet plus grand. La plus-value est la différence entre le prix de vente et le prix d'achat (majoré des frais et du coût des travaux). Le timing de la revente est crucial et dépend des conditions du marché et de votre situation personnelle.</p>
            <h3 className="text-lg font-semibold">6.2. Taxes à la revente</h3>
            <p>En Belgique, si vous revendez un bien bâti (autre que votre habitation propre) dans les 5 ans suivant son acquisition, la plus-value sera taxée à 16,5% en tant que revenu divers. Après 5 ans, la plus-value est totalement exonérée d'impôt pour un particulier gérant son patrimoine normalement.</p>
            <p className="text-sm"><strong>Source :</strong> <a href="https://finances.belgium.be/fr/particuliers/habitation/vente/plus-value" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">SPF Finances - Plus-value sur immeuble</a>.</p>

            {/* --- PHASE 7 : LES INDICATEURS --- */}
            <h2 className="text-xl font-semibold">Chapitre 7 : Indicateurs Clés</h2>
            <h3 className="text-lg font-semibold">7.1. Rendement et Effort de trésorerie</h3>
            <p>Le rendement (brut ou net) permet de comparer la performance intrinsèque de différents biens, indépendamment de leur financement. Le cash-flow (effort de trésorerie) est l'indicateur le plus important pour l'investisseur : c'est l'argent qu'il reste (ou qu'il faut ajouter) chaque mois. Un projet à cash-flow positif s'autofinance et génère un surplus.</p>
            <ul className="list-disc list-inside">
                <li><strong>Rendement Brut (%)</strong> = (Loyer Annuel Brut / Coût Total) x 100</li>
                <li><strong>Rendement Net (%)</strong> = ((Loyer Annuel Brut - Charges Annuelles) / Coût Total) x 100</li>
                <li><strong>Cash-Flow Mensuel (€)</strong> = (Loyer Mensuel - Charges Mensuelles) - Mensualité du Crédit</li>
            </ul>

            {/* --- Guide Tension Locative --- */}
            <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold text-blue-700">Annexe : Comment évaluer objectivement la tension locative ?</h3>
                <p className="mt-2">C'est un travail de détective qui repose sur des données concrètes. Voici une méthodologie en 3 étapes :</p>
                <h4 className="font-semibold mt-3">Étape 1 : Analyse des Annonces en Ligne</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Vitesse de location :</strong> Le critère le plus important. Combien de temps une annonce reste-t-elle en ligne ?
                        <ul className="list-circle list-inside pl-4 mt-1 text-sm">
                            <li>&lt; 7 jours : Tension Extrêmement Haute (Score 9-10/10)</li>
                            <li>7-15 jours : Tension Forte (Score 7-8/10)</li>
                            <li>15-30 jours : Tension Correcte (Score 5-6/10)</li>
                            <li>&gt; 1 mois : Tension Faible (Score 3-4/10)</li>
                        </ul>
                    </li>
                    <li><strong>Volume de la concurrence :</strong> Combien de biens similaires sont disponibles ?</li>
                </ul>
                <h4 className="font-semibold mt-3">Étape 2 : Validation sur le Terrain et Humaine</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Questionnez les agents immobiliers.</strong></li>
                    <li><strong>Observez lors des visites.</strong></li>
                </ul>
                <h4 className="font-semibold mt-3">Étape 3 : Analyse du Contexte</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                    <li><strong>Pôles d'attraction, démographie, projets d'urbanisme.</strong></li>
                </ul>
            </div>
        </div>
    </div>
);

export default KnowledgePage;