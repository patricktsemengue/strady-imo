import React from 'react';
import { ModalProvider } from './contexts/ModalContext.jsx';
import AppContent from './AppContent.jsx';
import './logo.css';
import 'highlight.js/styles/github-dark.css';

export default function App() {
    return (
        <ModalProvider>
            <AppContent />
        </ModalProvider>
    );
}
