import React, { useState, useMemo, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Edit3Icon, MessageSquarePlusIcon, HomeIcon, BedDoubleIcon, EuroIcon, LeafIcon, WrenchIcon, CarIcon } from '../Icons';
import './AIResponse.css';

/**
 * Affiche la réponse conversationnelle de l'IA et des actions lisibles par l'utilisateur.
 * Le composant masque les blocs JSON (fenced code blocks) dans le texte et
 * affiche des résumés textuels des actions proposées. Les objets JSON complets
 * restent disponibles dans `response.actions` pour être traités côté backend.
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
    let fullText = '';
    if (response?.analysisSummary?.narrative) {
      fullText += response.analysisSummary.narrative + '\n\n';
    }
    if (response?.text) {
      fullText += response.text;
    }
    setDisplayedText(fullText);
    setIsTyping(false); // L'animation est désactivée
  }, [response.text, response.analysisSummary?.narrative]); // Se déclenche quand le texte de la réponse change

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


  const actionSummaries = useMemo(() => {
    const all = (actions || response?.actions || []);
    const summaries = all.map(a => {
      if (!a) return null;
      // Ne pas inclure les chaînes simples ici, elles sont gérées par promptActions
      if (typeof a === 'string') return null;

      if (a.type === 'UPDATE_FIELD' && a.payload) {
        return `Mettre à jour ${formatLabel(a.payload.field)} → ${formatValue(a.payload.value)}`;
      }
      if (a.type === 'NEW_PROMPT') {
        return a.label || (a.payload ? String(a.payload) : 'Nouvelle question');
      }
      // Fallback: show a readable type or label but avoid dumping payload JSON
      return a.label || a.type || 'Action suggérée';
    }).filter(Boolean);

    // Add recommendations from the response object
    if (response?.data?.Recommendations && Array.isArray(response.data.Recommendations)) {
      response.data.Recommendations.forEach(rec => {
        if (rec.optimisationLocation) {
          summaries.push(`Recommandation: ${rec.optimisationLocation}`);
        }
      });
    }

    return summaries;
  }, [actions, response?.actions, response?.data?.Recommendations]);

  // Conditional rendering check moved here to respect Rules of Hooks
  if (!response || !response.text) {
    return null;
  }

  // Remove any fenced code blocks that look like JSON so raw JSON isn't shown to users.
  const stripJsonCodeBlocks = (text) => {
    if (!text) return text;
    // Remove ```json ... ``` and any ``` ... ``` blocks that contain a JSON object
    let cleaned = text.replace(/```json[\s\S]*?```/gi, '');
    cleaned = cleaned.replace(/```[\s\S]*?\{[\s\S]*?\}[\s\S]*?```/g, '');
    // Also remove inline JSON-looking blocks between markers like "JSON UPDATED" that might have leaked
    cleaned = cleaned.replace(/JSON UPDATED[\s\S]*?\{[\s\S]*?\}/g, '');
    return cleaned.trim();
  };

  const textForDisplay = stripJsonCodeBlocks(displayedText);

  // 1. Conversion du Markdown en HTML brut
  const rawHtml = marked.parse(textForDisplay);

  // 2. Sanitisation du HTML pour supprimer tout code potentiellement dangereux
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);


  return (
    <div className="ai-response-container space-y-4">
      <div
        className="ai-response-content"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />

      {actionSummaries.length > 0 && !promptActions.some(a => typeof a === 'string') && (
        <div className="ai-action-summary-container">
          <h5 className="ai-action-summary-header">Actions (texte)</h5>
          <div className="flex flex-wrap gap-2">
            {actionSummaries.map((txt, i) => (
              <button key={i} onClick={() => {
                const rawAction = (actions || response?.actions || [])[i];
                if (rawAction) handleActionClick(rawAction);
              }} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-gray-200">
                {txt}
              </button>
            ))}
          </div>
        </div>
      )}

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
                    {typeof action === 'string' ? action : action.label}
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
                <span>{typeof action === 'string' ? action : action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResponse;