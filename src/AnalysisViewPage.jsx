import React from 'react';
import { Logo } from './App';

const PrintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer h-5 w-5"><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v8H6z" /></svg>
);

const AlertTriangleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle h-5 w-5 flex-shrink-0">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
    </svg>
);

const Section = ({ title, icon, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-3">
            {icon}
            <span>{title}</span>
        </h2>
        <div className="space-y-2">{children}</div>
    </div>
);

const EuroIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-euro h-6 w-6 text-gray-500"><path d="M4 10h12" /><path d="M4 14h9" /><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-briefcase h-6 w-6 text-gray-500"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 h-6 w-6 text-gray-500"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text h-6 w-6 text-gray-500"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>;

const DataRow = ({ label, value, unit = '', isHighlighted = false }) => (
    <div className="flex justify-between items-center py-2 border-b">
        <span className="text-gray-600">{label}</span>
        <span className={`font-semibold ${isHighlighted ? 'text-blue-600' : 'text-gray-800'}`}>
            {typeof value === 'number' ? value.toLocaleString('fr-BE') : value} {unit}
        </span>
    </div>
);

const getArcPath = (x, y, radius, startAngle, endAngle) => {
    const start = { x: x + radius * Math.cos(startAngle), y: y + radius * Math.sin(startAngle) };
    const end = { x: x + radius * Math.cos(endAngle), y: y + radius * Math.sin(endAngle) };
    const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
    return [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
        "Z"
    ].join(" ");
};

const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
        return <div className="text-center text-gray-500 p-4">Aucune donnée de coût à afficher.</div>;
    }

    let cumulativeAngle = -Math.PI / 2; // Start at the top

    return (
        <div className="flex flex-col md:flex-row items-center gap-6 my-4 p-4 bg-gray-50 rounded-lg">
            <svg width="150" height="150" viewBox="0 0 100 100" className="flex-shrink-0">
                {data.map(item => {
                    if (item.value <= 0) return null;
                    const angle = (item.value / total) * 2 * Math.PI;
                    const path = getArcPath(50, 50, 50, cumulativeAngle, cumulativeAngle + angle);
                    cumulativeAngle += angle;
                    return <path key={item.label} d={path} fill={item.color} />;
                })}
            </svg>
            <ul className="space-y-2 text-sm w-full">
                {data.map(item => {
                    if (item.value <= 0) return null;
                    const percentage = ((item.value / total) * 100).toFixed(1);
                    return (
                        <li key={item.label} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                <span>{item.label} ({percentage}%)</span>
                            </div>
                            <span className="font-semibold">{item.value.toLocaleString('fr-BE')} €</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const RevenueExpenseChart = ({ revenue, expenses }) => {
    const total = Math.max(revenue, expenses, 1); // Avoid division by zero
    const revenuePercentage = (revenue / total) * 100;
    const expensePercentage = (expenses / total) * 100;

    return (
        <div className="space-y-3">
            {/* Barre des Revenus */}
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-green-700">Revenus Mensuels</span>
                    <span className="font-bold text-green-700">{revenue.toLocaleString('fr-BE')} €</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                    <div
                        className="bg-green-500 h-5 rounded-full"
                        style={{ width: `${revenuePercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Barre des Dépenses */}
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-amber-700">Dépenses Mensuelles Totales</span>
                    <span className="font-bold text-amber-700">{expenses.toLocaleString('fr-BE')} €</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                    <div
                        className="bg-amber-500 h-5 rounded-full"
                        style={{ width: `${expensePercentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};


const ResultCard = ({ label, value, unit = '', grade = 'C' }) => {
    const gradeColor =
        grade.startsWith('A') ? 'bg-green-100 text-green-800' :
            grade.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
                grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                    grade.startsWith('D') ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800';


    return (
        <div className={`p-4 rounded-lg text-center ${gradeColor}`}>
            <div className="text-sm font-medium">{label}</div>
            <div className="text-2xl font-bold">{value}{unit}</div>
        </div>
    );
};


const AnalysisViewPage = ({ analysis, onBack }) => {
    if (!analysis) {
        return (
            <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg text-center">
                <p className="text-red-600">Analyse non trouvée.</p>
                <button onClick={onBack} className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                    &larr; Retour au tableau de bord
                </button>
            </div>
        );
    }

    const { data, result } = analysis;

    // Mettre à jour le titre du document
    React.useEffect(() => {
        const originalTitle = document.title;
        document.title = `Rapport: ${data.projectName}`;

        // Revenir au titre original quand le composant est démonté
        return () => {
            document.title = originalTitle;
        };
    }, [data.projectName]);
    const handlePrint = () => {
        window.print();
    };
    const coutTotal = (data.prixAchat || 0) + (data.coutTravaux || 0) + (data.fraisAcquisition || 0) + (data.fraisAnnexe || 0);
    const finances = {
        coutTotal: coutTotal,
        montantAFinancer: coutTotal - (data.apport || 0),
        mensualiteCredit: result?.mensualiteCredit ? parseFloat(result.mensualiteCredit) : 0,
    };
    const costBreakdownData = [
        { label: "Prix d'achat", value: data.prixAchat || 0, color: '#2c5282' }, // Hiver: Bleu Profond
        { label: "Coût des travaux", value: data.coutTravaux || 0, color: '#dd6b20' }, // Automne: Orange Terreux
        { label: "Frais d'acquisition", value: data.fraisAcquisition || 0, color: '#38a169' }, // Printemps: Vert Forêt
        { label: "Frais annexes", value: data.fraisAnnexe || 0, color: '#d69e2e' }, // Été: Jaune Doré
    ];


    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in printable-area">
            {/* --- En-tête --- */}
            <div className="flex justify-between items-start mb-6 print-hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{data.projectName}</h1>
                    <p className="text-gray-500">{data.ville}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={onBack} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">&larr; Retour</button>
                    <button onClick={handlePrint} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <PrintIcon /> Imprimer
                    </button>
                </div>
            </div>
            <div className="hidden print-block mb-6 border-b pb-4">
                <Logo />
                <h1 className="text-3xl font-bold text-gray-800 mt-6">{data.projectName}</h1>
                <p className="text-xl text-blue-600 font-semibold mt-1">Rapport d'Analyse - {data.ville}</p>
                <p className="text-sm text-gray-500 mt-2">Rapport généré le {new Date().toLocaleDateString('fr-BE')}</p>
            </div>

            {/* --- Avertissement --- */}
            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 mb-6 print-hidden">
                <AlertTriangleIcon />
                <p className="text-sm text-yellow-800">
                    <strong>Avertissement :</strong> Les chiffres et indicateurs présentés dans ce rapport sont des estimations basées sur les données que vous avez fournies. Ils sont destinés à des fins d'information et ne constituent pas un conseil financier.
                </p>
            </div>

            {/* --- Section Résultats --- */}
            {result && (
                <Section title="Synthèse Financière" icon={<BriefcaseIcon />}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ResultCard label="Score Strady" value={result.grade} grade={result.grade} />
                        <ResultCard label="Rendement Net" value={result.rendementNet} unit=" %" grade={result.grade} />
                        <ResultCard label="Cash-Flow /mois" value={result.cashflowMensuel} unit=" €" grade={result.grade} />
                        <ResultCard label="CoC Return" value={isFinite(result.cashOnCash) ? result.cashOnCash.toFixed(1) : 'N/A'} unit=" %" grade={result.grade} />
                    </div>
                </Section>
            )}

            {result && (
                <Section title="Visualisation du Cash-Flow Mensuel" icon={<BriefcaseIcon />}>
                    <RevenueExpenseChart
                        revenue={data.loyerEstime || 0}
                        expenses={(parseFloat(result.mensualiteCredit) || 0) + (data.chargesMensuelles || 0)}
                    />
                </Section>
            )}

            <Section title="Structure de l'Investissement et du Financement" icon={<EuroIcon />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="md:col-span-2"><PieChart data={costBreakdownData} /></div>
                    {/* --- Détail de l'investissement --- */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold text-lg mb-3">Structure des Coûts</h3>
                        <DataRow label="Prix d'achat" value={data.prixAchat} unit="€" />
                        <DataRow label="Coût des travaux" value={data.coutTravaux} unit="€" />
                        <DataRow label="Frais d'acquisition" value={data.fraisAcquisition} unit="€" />
                        <DataRow label="Frais annexes" value={data.fraisAnnexe} unit="€" />
                        {data.travauxDetail && data.travauxDetail.length > 0 && (
                            <div className="pl-4 mt-2 text-sm text-gray-600 space-y-1 border-t pt-2">
                                {data.travauxDetail.map(travau => (
                                    <div key={travau.id} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                                        <span>
                                            - {travau.object}
                                            {travau.type && <span className="text-gray-500 italic"> ({travau.type})</span>}
                                        </span>
                                        <span className="font-mono">{travau.cost?.toLocaleString('fr-BE')} €</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex justify-between items-center py-2 border-t-2 mt-2 font-bold">
                            <span>Coût Total du Projet</span>
                            <span>{finances.coutTotal.toLocaleString('fr-BE')} €</span>
                        </div>
                    </div>

                    {/* --- Structure du Financement --- */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold text-lg mb-3">Montage Financier</h3>
                        <DataRow label="Coût Total du Projet" value={finances.coutTotal} unit="€" />
                        <DataRow label="Apport personnel" value={data.apport} unit="€" />
                        <div className="flex justify-between items-center py-2 border-t-2 mt-2 font-bold text-blue-600">
                            <span>Besoin de Financement</span>
                            <span>{finances.montantAFinancer.toLocaleString('fr-BE')} €</span>
                        </div>
                        <DataRow label="Taux / Durée" value={`${data.tauxCredit}% / ${data.dureeCredit} ans`} />
                        <DataRow label="Mensualité du crédit" value={finances.mensualiteCredit?.toFixed(2)} unit="€" isHighlighted />
                    </div>
                </div>
            </Section>

            <Section title="Prévisions d'Exploitation" icon={<BuildingIcon />}>
                <DataRow label="Loyer estimé Hors Charges" value={data.loyerEstime} unit="€/mois" />
                <DataRow label="Charges d'exploitation estimées" value={data.chargesMensuelles} unit="€/mois" />
                {data.chargesDetail && data.chargesDetail.length > 0 && (
                    <div className="pl-4 mt-2 text-sm text-gray-600 space-y-1">
                        {data.chargesDetail.map(charge => {
                            const monthlyPrice = charge.periodicity === 'An' ? charge.price / 12 : charge.price;
                            return (
                                <div key={charge.id} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                                    <span>- {charge.object}</span>
                                    <span className="font-mono">{monthlyPrice.toFixed(2)} €/mois</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Section>

            <Section title="Caractéristiques du Bien" icon={<FileTextIcon />}>
                <DataRow label="Type de bien" value={data.typeBien} />
                <DataRow label="Surface" value={data.surface} unit="m²" />
                <DataRow label="Score PEB" value={data.peb} />
                <DataRow label="Revenu Cadastral" value={data.revenuCadastral} unit="€" />
                <DataRow label="Électricité conforme" value={data.electriciteConforme ? 'Oui' : 'Non'} />
                <DataRow label="En ordre urbanistique" value={data.enOrdreUrbanistique ? 'Oui' : 'Non'} />
            </Section>

            {/* --- Section Notes --- */}
            {data.descriptionBien && (
                <Section title="Notes et Commentaires" icon={<FileTextIcon />}>
                    <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border">
                        <p className="whitespace-pre-wrap">{data.descriptionBien}</p>
                    </div>
                </Section>
            )}

            {/* --- Notes de bas de page --- */}
            <div className="mt-12 pt-6 border-t-2 border-dashed text-xs text-gray-600 space-y-3">
                <h4 className="font-semibold text-sm text-gray-700">Définitions des indicateurs clés :</h4>
                <p><strong>Score Strady :</strong> Évalue la rapidité à laquelle le cash-flow net généré permet de reconstituer l'apport personnel. Un score 'A' indique un retour sur apport en moins de 5 ans, tandis qu'un score 'E' indique un retour supérieur à 20 ans.</p>
                <p>
                    <strong>CoC Return (Cash-on-Cash) :</strong> Mesure le rendement de vos fonds propres investis (votre apport). C'est le ratio entre le cash-flow annuel et votre apport personnel.
                    <br />
                    <em className="font-mono text-gray-500">Formule : (Cash-Flow Annuel / Apport Personnel) x 100</em>
                </p>
                <p>
                    <strong>Rendement Net :</strong> Mesure la rentabilité intrinsèque du bien avant financement. Il prend en compte les loyers et les charges d'exploitation, mais exclut le coût du crédit.
                    <br />
                    <em className="font-mono text-gray-500">Formule : ((Loyer Annuel - Charges Annuelles) / Coût Total) x 100</em>
                </p>
            </div>
        </div>
    );
};

export default AnalysisViewPage;
