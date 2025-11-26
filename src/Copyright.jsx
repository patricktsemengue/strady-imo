import React from 'react';
import { useTranslation } from 'react-i18next';

const Copyright = ({ className = '' }) => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <p className={`text-xs text-gray-400 ${className}`}>
            {t('copyright', { year })}
        </p>
    );
};

export default Copyright;