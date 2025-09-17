import React from 'react';
import { useTranslation } from 'react-i18next';

function ThemeSwitcher({ theme, toggleTheme }) {
  const { t } = useTranslation();
  
  const buttonStyle = {
    background: 'var(--button-secondary-bg)',
    color: 'var(--text-color)',
    border: '1px solid var(--border-color)',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px'
  };

  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <button style={buttonStyle} onClick={toggleTheme}>
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
    </div>
  );
}

export default ThemeSwitcher;