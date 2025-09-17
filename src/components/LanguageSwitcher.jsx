import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const buttonStyle = {
    background: 'transparent',
    color: 'var(--text-muted-color)',
    border: 'none',
    padding: '5px 10px',
    margin: '0 5px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: 'bold'
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <button style={buttonStyle} onClick={() => changeLanguage('en')}>EN</button>
      <button style={buttonStyle} onClick={() => changeLanguage('fr')}>FR</button>
      <button style={buttonStyle} onClick={() => changeLanguage('nl')}>NL</button>
    </div>
  );
}

export default LanguageSwitcher;