import React, { useState, useMemo, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Edit3Icon, MessageSquarePlusIcon, HomeIcon, BedDoubleIcon, EuroIcon, LeafIcon, WrenchIcon, CarIcon } from '../Icons';
import './AIResponse.css';

/**
 * Affiche la réponse JSON complète de l'IA (texte + actions).
 * @param {object} props
 * @param {object} props.response - L'objet JSON complet de l'IA.
 * @param {function} props.onUpdateField - Callback pour les actions 'UPDATE_FIELD'.
 * @param {function} props.onNewPrompt - Callback pour les actions 'NEW_PROMPT'.
 */
const AIResponse = ({ response, actions = [], onActionClick, onUpdateField, onNewPrompt }) => {
  const [copyButtonText, setCopyButtonText] = useState('Copier');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = useRef(null);

  // --- EFFET "MACHINE À ÉCRIRE" ---
  useEffect(() => {
    if (response?.text) {
      setDisplayedText(response.text);
    } else {
      setDisplayedText('');
    }
    setIsTyping(false); // L'animation est désactivée
  }, [response.text]); // Se déclenche quand le texte de la réponse change

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    } else {
      // Fallback to old method if onActionClick is not provided
      switch (action.type) {
        case 'UPDATE_FIELD': if (onUpdateField) onUpdateField(action.payload); break;
        case 'NEW_PROMPT': if (onNewPrompt) onNewPrompt(action.payload); break;
        default: console.warn('Type d\'action inconnu:', action.type);
      }
    }
  };

  const handleCopy = () => {
    if (response && response.text) {
      navigator.clipboard.writeText(response.text).then(() => {
        setCopyButtonText('Copié !');
        setTimeout(() => {
          setCopyButtonText('Copier');
        }, 2000); // Réinitialise après 2s
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };

  const handleSkipTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setDisplayedText(response.text);
    setIsTyping(false);
  };

  const updateActions = useMemo(() => 
    (actions || response?.actions || []).filter(a => a.type === 'UPDATE_FIELD'), 
    [actions, response?.actions]
  );
  const promptActions = useMemo(() => 
    (actions || response?.actions || []).filter(a => a.type === 'NEW_PROMPT' || typeof a === 'string'), 
    [actions, response?.actions]
  );

  const formatLabel = (field) => {
    switch (field) {
      case 'typeDeBien': return 'Type de bien';
      case 'nombreDeChambres': return 'Nombre de chambres';
      case 'prixDeVenteIndicatif': return 'Prix indicatif';
      case 'peb': return 'PEB';
      case 'anneeRenovation': return 'Rénovation';
      case 'garage': return 'Garage';
      default:
        return field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
    }
  };

  const formatValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }
    if (typeof value === 'number' && value >= 1000) {
      return `${value.toLocaleString('fr-BE')} €`;
    }
    return value;
  };

  const getIconForField = (field) => {
    switch (field) {
      case 'typeDeBien': return <HomeIcon className="ai-data-key-item-icon" />;
      case 'nombreDeChambres': return <BedDoubleIcon className="ai-data-key-item-icon" />;
      case 'prixDeVenteIndicatif': return <EuroIcon className="ai-data-key-item-icon" />;
      case 'peb': return <LeafIcon className="ai-data-key-item-icon" />;
      case 'anneeRenovation': return <WrenchIcon className="ai-data-key-item-icon" />;
      case 'garage': return <CarIcon className="ai-data-key-item-icon" />;
      default:
        return null;
    }
  };


  if (!response || !response.text) {
    return null;
  }

  // 1. Conversion du Markdown en HTML brut
  const rawHtml = marked.parse(displayedText);

  // 2. Sanitisation du HTML pour supprimer tout code potentiellement dangereux
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);

  return (
    <div className="ai-response-container space-y-4">
      <div
        className="ai-response-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />

      {updateActions.length > 0 && (
        <div className="ai-data-key-container">
          <h5 className="ai-data-key-header">Données Clés</h5>
          <div className="ai-data-key-grid">
            {updateActions.map((action, index) => (
              <div key={index} className="ai-data-key-item" onClick={() => handleActionClick(action)} title={`Mettre à jour le champ à '${formatValue(action.payload.value)}'`}>
                <div className="ai-data-key-item-icon-wrapper">
                  {getIconForField(action.payload.field)}
                </div>
                <div className="ai-data-key-item-text">
                  <span className="ai-data-key-item-label">{formatLabel(action.payload.field)}</span>
                  <span className="ai-data-key-item-value">{formatValue(action.payload.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {promptActions.length > 0 && onActionClick ? (
        <div className="mt-3 flex flex-wrap gap-2">
            {promptActions.map((action, index) => (
                <button
                    key={index}
                    onClick={() => onActionClick(action)}
                    className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
                >
                    {action}
                </button>
            ))}
        </div>
      ) : promptActions.length > 0 && (
        <div className="ai-actions-container">
          <h5 className="ai-actions-header">Actions Suggérées :</h5>
          <div className="ai-actions-list">
            {promptActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleActionClick(action)}
                className="ai-action-button"
              >
                <MessageSquarePlusIcon className="ai-action-icon" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResponse;