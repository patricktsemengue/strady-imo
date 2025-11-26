import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Logo } from './Logo';
import { useModal } from './contexts/useModal'; // Import useModal
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import FiscalComparison from './FiscalComparison';
import { PrintIcon, AlertTriangleIcon, EuroIcon, BriefcaseIcon, BuildingIcon, FileTextIcon, TrendingUpIcon, ThumbsUpIcon, ThumbsDownIcon, TargetIcon, HelpIcon, PencilIcon } from './Icons';

const Section = ({ title, icon, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-3">
            {icon}
            <span>{title}</span>
        </h2>
        <div className="space-y-2">{children}</div>
    </div>
);

const DataRow = ({ label, value, unit = '', isHighlighted = false }) => (
    <div className={`flex justify-between items-center py-1.5 ${isHighlighted ? 'font-bold' : ''}`}>
        <span className="text-gray-600">{label}</span>
        <span>{typeof value === 'number' ? value.toLocaleString('fr-BE') : value} {unit}</span>
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
    const { t } = useTranslation();
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) {
        return <div className="text-center text-gray-500 p-4">{t('no_cost_data')}</div>;
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
                                <span>{t(item.label)} ({percentage}%)</span>
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
    const { t } = useTranslation();
    const total = Math.max(revenue, expenses, 1); // Avoid division by zero
    const revenuePercentage = (revenue / total) * 100;
    const expensePercentage = (expenses / total) * 100;

    return (
        <div className="space-y-3">
            {/* Barre des Revenus */}
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-green-700">{t('monthly_revenue')}</span>
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
                    <span className="font-medium text-amber-700">{t('total_monthly_expenses')}</span>
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

const InfoBubble = ({ metricId }) => {
    const { setIsMetricModalOpen, setSelectedMetric } = useModal();

    const handleClick = () => {
        setSelectedMetric(metricId);
        setIsMetricModalOpen(true);
    };

    return (
        <div onClick={handleClick} className="cursor-pointer">
            <InfoIcon className="w-4 h-4 text-gray-500" />
        </div>
    );
};




const metricInfos = (t) => ({
    score: {
        title: t('strady_score'),
        description: t('metric_score_description'),
        formula: t('metric_score_formula')
    },
    rendementNet: {
        title: t('net_yield'),
        description: t('metric_rendementNet_description'),
        formula: "((Loyer Annuel - Charges) / Coût Total) x 100"
    },
    cashflow: {
        title: t('cash_flow_month'),
        description: t('metric_cashflow_description'),
        formula: "Loyer Mensuel - Charges - Mensualité Crédit"
    },
    coc: {
        title: t('cash_on_cash'),
        description: t('metric_coc_description'),
        formula: "(Cash-Flow Annuel / Apport) x 100"
    }
});

const ResultCard = ({ label, value, unit = '', grade = 'C', info }) => {
    const { t } = useTranslation();
    const gradeColor =
        grade.startsWith('A') ? 'bg-green-100 text-green-800' :
            grade.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
                grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                    grade.startsWith('D') ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800';


    return (
        <div className={`p-4 rounded-lg text-center ${gradeColor}`}>
            <div className="text-sm font-medium flex justify-center items-center gap-1">
                <span>{t(label)}</span>
                {info && <InfoBubble metricId={info} />}
            </div>
            <div className="text-2xl font-bold">{value}{unit}</div>
        </div>
    );
};


// A basic Info icon component.
const InfoIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);
const FeasibilityAnalysis = ({ user, newMonthlyPayment }) => {
    const { t } = useTranslation();
    const profile = user?.user_metadata?.financial_profile;

    if (!profile || profile.profileType !== 'INDIVIDUAL') {
        return null; // Only for individual profiles for now
    }

    const { monthlyNetIncome, currentLoansMonthlyPayment } = profile.individualFinances;

    if (!monthlyNetIncome || monthlyNetIncome <= 0) {
        return null;
    }

    const totalLoansBefore = currentLoansMonthlyPayment || 0;
    const totalLoansAfter = totalLoansBefore + newMonthlyPayment;

    const debtRatioBefore = (totalLoansBefore / monthlyNetIncome) * 100;
    const debtRatioAfter = (totalLoansAfter / monthlyNetIncome) * 100;

    const getRatioColor = (ratio) => {
        if (ratio <= 35) return 'text-green-600';
        if (ratio <= 40) return 'text-orange-500';
        return 'text-red-600';
    };

    return (
        <Section title={t('feasibility_of_the_project')} icon={<TargetIcon />}>
            <p className="text-sm text-gray-500 mb-4">{t('feasibility_estimation_note')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DataRow label={t('current_debt_ratio')} value={`${debtRatioBefore.toFixed(1)} %`} />
                <DataRow label={t('debt_ratio_after_project')} value={<span className={`font-bold ${getRatioColor(debtRatioAfter)}`}>{debtRatioAfter.toFixed(1)} %</span>} />
            </div>
        </Section>
    );
};

const AnalysisViewPage = ({ analysis, onBack, scenarios }) => {    
    const { t } = useTranslation();
    React.useEffect(() => {
        if (analysis) {
            const originalTitle = document.title;
            return () => {
                document.title = originalTitle;
            };
        }
    }, [analysis]);

    if (!analysis) {
        return (
            <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg text-center">
                <p className="text-red-600">{t('analysis_not_found')}</p>
                <button onClick={onBack} className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
                    {t('back_to_dashboard')}
                </button>
            </div>
        );
    }

    const { data, result, user } = analysis;

    const coutTotal = (data.prixAchat || 0) + (data.coutTravaux || 0) + (data.fraisAcquisition || 0) + (data.fraisAnnexe || 0);
    const finances = {
        coutTotal: coutTotal,
        montantAFinancer: coutTotal - (data.apport || 0),
        mensualiteCredit: result?.mensualiteCredit ? parseFloat(result.mensualiteCredit) : 0,
    };
    const costBreakdownData = [
        { label: "purchase_price", value: data.prixAchat || 0, color: '#2c5282' }, // Hiver: Bleu Profond
        { label: "work_cost", value: data.coutTravaux || 0, color: '#dd6b20' }, // Automne: Orange Terreux
        { label: "acquisition_fees", value: data.fraisAcquisition || 0, color: '#38a169' }, // Printemps: Vert Forêt
        { label: "additional_fees", value: data.fraisAnnexe || 0, color: '#d69e2e' }, // Été: Jaune Doré
    ];


    return (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg animate-fade-in printable-area">
            {/* --- En-tête --- */}
            <div className="flex justify-between items-start mb-6 print-hidden">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{data.projectName}</h1>
                    <p className="text-gray-500">{data.ville}</p>
                </div>
                <button onClick={onBack} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 print-hidden">{t('back')}</button>
            </div>
            <div className="hidden print-block mb-6 border-b pb-4">
                <Logo />
                <h1 className="text-3xl font-bold text-gray-800 mt-6">{data.projectName}</h1>
                <p className="text-xl text-blue-600 font-semibold mt-1">{t('analysis_report')}{data.ville}</p>
                <p className="text-sm text-gray-500 mt-2">{t('report_generated_on')}{new Date().toLocaleDateString('fr-BE')}</p>
            </div>

            {/* --- Avertissement --- */}
            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 mb-6 print-hidden">
                <AlertTriangleIcon />
                <p className="text-sm text-yellow-800">
                    <Trans i18nKey="warning_text" components={{ strong: <strong /> }} />
                </p>
            </div>

            {/* --- Section Résultats --- */}
            {result && (
                <Section title={t('financial_summary')} icon={<BriefcaseIcon />}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ResultCard label="strady_score" value={result.grade} grade={result.grade} info="score" />
                        <ResultCard label="net_yield" value={result.rendementNet} unit=" %" grade={result.grade} info="rendementNet" />
                        <ResultCard label="cash_flow_month" value={result.cashflowMensuel} unit=" €" grade={result.grade} info="cashflow" />
                        <ResultCard 
                            label="cash_on_cash"
                            value={result.cashOnCash === Infinity ? '∞' : (isFinite(result.cashOnCash) ? result.cashOnCash.toFixed(1) : 'N/A')} 
                            unit={result.cashOnCash !== null && isFinite(result.cashOnCash) ? " %" : ""} 
                            grade={result.grade}
                            info="cashOnCash"
                        />
                    </div>
                </Section>
            )}

            {/* US 3.2: Feasibility Analysis */}
            {user && result && (
                <FeasibilityAnalysis user={user} newMonthlyPayment={parseFloat(result.mensualiteCredit)} />
            )}


            {/* US 2.4: Negotiation Scenarios Table */}
            {scenarios && scenarios.length > 0 && (
                <Section title={t('negotiation_potential')} icon={<TrendingUpIcon />}>
                    <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">{t('scenario')}</th>
                                    <th scope="col" className="px-6 py-3 text-right">{t('purchase_price')}</th>
                                    <th scope="col" className="px-6 py-3 text-right">{t('cash_flow_month')}</th>
                                    <th scope="col" className="px-6 py-3 text-right">{t('net_yield')}</th>
                                    <th scope="col" className="px-6 py-3 text-right">{t('cash_on_cash')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scenarios.map((scenario, index) => (
                                    <tr key={scenario.label} className={`border-b ${index === 0 ? 'bg-blue-50 font-semibold' : 'bg-white'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">{scenario.label}</td>
                                        <td className="px-6 py-4 text-right">{scenario.prixAchat.toLocaleString('fr-BE')} €</td>
                                        <td className={`px-6 py-4 text-right font-bold ${scenario.cashflowMensuel >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {scenario.cashflowMensuel.toFixed(2)} €
                                        </td>
                                        <td className="px-6 py-4 text-right">{scenario.rendementNet.toFixed(2)} %</td>
                                        <td className="px-6 py-4 text-right">
                                            {scenario.cashOnCash === Infinity ? '∞' : (isFinite(scenario.cashOnCash) ? `${scenario.cashOnCash.toFixed(1)} %` : 'N/A')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Section>
            )}

            {/* US 4.1: Fiscal Comparison */}
            <Section title={t('comparative_fiscal_analysis')} icon={<BriefcaseIcon />}>
                <FiscalComparison data={data} result={result} />
            </Section>

            {result && (
                <Section title={t('monthly_cash_flow_visualization')} icon={<BriefcaseIcon />}>
                    <RevenueExpenseChart
                        revenue={data.loyerEstime || 0}
                        expenses={(parseFloat(result.mensualiteCredit) || 0) + (data.chargesMensuelles || 0)}
                    />
                </Section>
            )}

            <Section title={t('investment_and_financing_structure')} icon={<EuroIcon />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="md:col-span-2"><PieChart data={costBreakdownData} /></div>
                    {/* --- Détail de l'investissement --- */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold text-lg mb-3">{t('cost_structure')}</h3>
                        <DataRow label={t('purchase_price')} value={data.prixAchat} unit="€" />
                        <DataRow label={t('work_cost')} value={data.coutTravaux} unit="€" />
                        {data.travauxDetail && data.travauxDetail.length > 0 && (
                            <div className="pl-4 ml-2 my-2 text-sm text-gray-600 space-y-1 border-l-2 border-gray-200">
                                {data.travauxDetail.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center py-1 pl-2">
                                        <span>- {item.name}</span>
                                        <span className="font-mono">{parseFloat(item.cost).toLocaleString('fr-BE')} €</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <DataRow label={t('acquisition_fees')} value={data.fraisAcquisition} unit="€" />
                        <DataRow label={t('additional_fees')} value={data.fraisAnnexe} unit="€" />
                        <div className="flex justify-between items-center py-2 border-t-2 mt-2 font-bold">
                            <span>{t('total_project_cost')}</span>
                            <span>{finances.coutTotal.toLocaleString('fr-BE')} €</span>
                        </div>
                    </div>

                    {/* --- Structure du Financement --- */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold text-lg mb-3">{t('financing_structure')}</h3>
                        <DataRow label={t('total_project_cost')} value={finances.coutTotal} unit="€" />
                        <DataRow label={t('personal_contribution')} value={data.apport} unit="€" />
                        <div className="flex justify-between items-center py-2 border-t-2 mt-2 font-bold text-blue-600">
                            <span>{t('financing_need')}</span>
                            <span>{finances.montantAFinancer.toLocaleString('fr-BE')} €</span>
                        </div>
                        <DataRow label={t('rate_duration')} value={`${data.tauxCredit}% / ${data.dureeCredit} ans`} />
                        <DataRow label={t('monthly_credit_payment')} value={finances.mensualiteCredit?.toFixed(2)} unit="€" isHighlighted />
                    </div>
                </div>
            </Section>

            <Section title={t('operating_forecasts')} icon={<BuildingIcon />}>
                <DataRow label={t('estimated_rent_excluding_charges')} value={data.loyerEstime} unit="€/mois" />
                <DataRow label={t('estimated_operating_charges')} value={data.chargesMensuelles} unit="€/mois" />
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

            <Section title={t('property_characteristics')} icon={<FileTextIcon />}>
                <DataRow label={t('property_type')} value={data.typeBien} />
                <DataRow label={t('surface')} value={data.surface} unit="m²" />
                <DataRow label={t('peb_score')} value={data.peb} />
                <DataRow label={t('cadastral_income')} value={data.revenuCadastral} unit="€" />
                <DataRow label={t('electricity_compliant')} value={data.electriciteConforme ? t('yes') : t('no')} />
                <DataRow label={t('urbanistic_order')} value={data.enOrdreUrbanistique ? t('yes') : t('no')} />
            </Section>

            {/* US 4.4: Strengths and Weaknesses */}
            {(data.strengths?.some(s => s.trim() !== '') || data.weaknesses?.some(w => w.trim() !== '')) && (
                <Section title={t('qualitative_analysis')} icon={<FileTextIcon />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.strengths?.some(s => s.trim() !== '') && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><ThumbsUpIcon /> {t('strengths')}</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {data.strengths.filter(s => s.trim() !== '').map((strength, index) => <li key={index}>{strength}</li>)}
                                </ul>
                            </div>
                        )}
                        {data.weaknesses?.some(w => w.trim() !== '') && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><ThumbsDownIcon /> {t('weaknesses')}</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {data.weaknesses.filter(w => w.trim() !== '').map((weakness, index) => <li key={index}>{weakness}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </Section>
            )}

            {/* --- Section Notes --- */}
            {data.descriptionBien && (
                <Section title={t('notes_and_comments')} icon={<FileTextIcon />}>
                    <div className="relative group">
                        <div
                            className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg border max-h-72 overflow-y-auto custom-scrollbar"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(data.descriptionBien)) }}
                        />
                        <button
                            onClick={onBack}
                            title={t('edit_notes')}
                            className="absolute top-3 right-3 flex items-center gap-1 bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-gray-200 hover:text-gray-800 px-2 py-1 rounded-lg text-xs font-semibold border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <PencilIcon className="h-3 w-3" /> {t('edit')}
                        </button>
                    </div>
                </Section>
            )}

        </div>
    );
};

export default AnalysisViewPage;
