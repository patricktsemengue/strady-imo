import React from 'react';
import { useTranslation } from 'react-i18next';
import BottomSheetDrawer from './BottomSheetDrawer';

const MetricExplanationDrawer = ({ isOpen, onClose, metric }) => {
    const { t } = useTranslation();

    const explanations = {
        rendementNet: {
            title: t('metric_rendementNet_title'),
            explanation: t('metric_rendementNet_explanation'),
            formula: t('metric_rendementNet_formula')
        },
        cashflow: {
            title: t('metric_cashflow_title'),
            explanation: t('metric_cashflow_explanation'),
            formula: t('metric_cashflow_formula')
        },
        cashOnCash: {
            title: t('metric_cashOnCash_title'),
            explanation: t('metric_cashOnCash_explanation'),
            formula: t('metric_cashOnCash_formula')
        },
        score: {
            title: t('metric_score_title'),
            explanation: t('metric_score_explanation'),
            formula: t('metric_score_formula')
        },
        mensualiteCredit: {
            title: t('metric_mensualiteCredit_title'),
            explanation: t('metric_mensualiteCredit_explanation'),
            formula: null
        },
        coutTotal: {
            title: t('metric_coutTotal_title'),
            explanation: t('metric_coutTotal_explanation'),
            formula: t('metric_coutTotal_formula')
        }
    };

    const content = explanations[metric] || { title: t('information'), explanation: t('no_explanation_available'), formula: null };

    if (!isOpen) return null;

    const footer = (
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">{t('close')}</button>
        </div>
    );

    return (
        <BottomSheetDrawer
            isOpen={isOpen}
            onClose={onClose}
            title={content.title}
            footer={footer}
        >
            <p className="text-gray-700 mb-4">{content.explanation}</p>
            {content.formula && (
                <div className="bg-gray-100 p-3 rounded-md text-center">
                    <p className="text-sm font-semibold">{t('formula')}</p>
                    <p className="text-sm font-mono">{content.formula}</p>
                </div>
            )}
        </BottomSheetDrawer>
    );
};

export default MetricExplanationDrawer;
