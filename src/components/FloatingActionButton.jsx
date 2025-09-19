import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Reusable component for the colored language tags
const LanguageTag = ({ bgColor, textColor, children }) => (
  <span
    className="mr-3 w-7 h-5 flex items-center justify-center rounded-sm text-sm"
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    {children}
  </span>
);

// --- SVG Icons ---
const SettingsIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

// --- NEW RELIEF-STYLE THEME ICONS ---
const StandardThemeIcon = () => <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.38 2.72 6.11 6.1 6.1h.8c3.38 0 6.1-2.72 6.1-6.1V5c0-1.1-.9-2-2-2zm-1.5 8.71c0 2.26-1.83 4.09-4.09 4.09h-.81c-2.26 0-4.09-1.83-4.09-4.09V5h9v6.71zM20 8v5c0 1.1-.9 2-2 2h-1v-2h1V8h2z"/></svg>;
const DaylightThemeIcon = () => <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.99 4.58zm12.02 12.02c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l1.06-1.06zM4.58 18.01c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l1.06-1.06z"/></svg>;
const DarkThemeIcon = () => <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.64-.11 2.41-.31-2.27-.98-4-3.15-4-5.69 0-3.41 2.79-6.2 6.2-6.2.39 0 .78.04 1.15.11C16.96 4.19 14.65 3 12 3z"/></svg>;


function FloatingActionButton({ theme, setTheme }) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fabRef.current && !fabRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fabRef]);

  return (
    <div ref={fabRef} className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
      {/* FAB Menu */}
      <div className={`absolute bottom-16 right-0 w-48 bg-bg-secondary border border-border-color rounded-lg shadow-xl py-2 mb-2 flex-col overflow-hidden ${isOpen ? 'flex' : 'hidden'}`}>
        <div className="px-4 py-2 text-sm text-text-secondary">{t('language', 'Language')}</div>
        <a href="#" className="flex items-center px-4 py-2 text-text-primary hover:bg-bg-primary" onClick={() => i18n.changeLanguage('en')}>
          <LanguageTag bgColor="#000000" textColor="#FFFFFF">🇬🇧</LanguageTag>English
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-text-primary hover:bg-bg-primary" onClick={() => i18n.changeLanguage('fr')}>
          <LanguageTag bgColor="#FDDA24" textColor="#000000">🇫🇷</LanguageTag>Français
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-text-primary hover:bg-bg-primary" onClick={() => i18n.changeLanguage('nl')}>
          <LanguageTag bgColor="#EF3340" textColor="#FFFFFF">🇳🇱</LanguageTag>Nederlands
        </a>
        
        <div className="border-t my-2 border-border-color"></div>
        
        <div className="px-4 py-2 text-sm text-text-secondary">{t('theme', 'Theme')}</div>
        <a href="#" className="flex items-center px-4 py-2 text-text-primary hover:bg-bg-primary" onClick={() => setTheme('standard')}>
          <StandardThemeIcon />
          {t('standardTheme', 'Standard')}
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-text-primary hover:bg-bg-primary" onClick={() => setTheme('daylight')}>
          <DaylightThemeIcon />
          {t('daylightTheme', 'Daylight')}
        </a>
        <a href="#" className="flex items-center px-4 py-2 text-text-primary hover:bg-bg-primary" onClick={() => setTheme('dark')}>
          <DarkThemeIcon />
          {t('darkTheme', 'Dark Night')}
        </a>
      </div>

      {/* FAB Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="bg-accent-primary w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg hover:opacity-90 transition-all transform hover:scale-105">
        {isOpen ? <CloseIcon /> : <SettingsIcon />}
      </button>
    </div>
  );
}

export default FloatingActionButton;