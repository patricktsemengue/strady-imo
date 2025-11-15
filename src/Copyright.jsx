import React from 'react';

const Copyright = ({ className = '' }) => (
    <p className={`text-xs text-gray-400 ${className}`}>
        © {new Date().getFullYear()} Strady.imo - Tous droits réservés.
    </p>
);

export default Copyright;