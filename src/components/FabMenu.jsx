import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, SparklesIcon, XIcon } from '../Icons';

const FabMenu = ({ handleNewProject }) => {
    const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
    const fabRef = useRef(null);
    const navigate = useNavigate();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragInfo = useRef({
        startX: 0,
        startY: 0,
        isDrag: false,
    });

    // Charger la position depuis le localStorage au montage initial
    useEffect(() => {
        try {
            const savedPosition = localStorage.getItem('fabMenuPosition');
            if (savedPosition) {
                setPosition(JSON.parse(savedPosition));
            }
        } catch (error) {
            console.error("Erreur lors du chargement de la position du FAB :", error);
        }
    }, []); // Le tableau vide assure que cela ne s'exécute qu'une fois

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (fabRef.current && !fabRef.current.contains(event.target)) {
                setIsFabMenuOpen(false);
            }
        };

        const handlePointerMove = (event) => {
            if (!isDragging || !fabRef.current) return;
            event.preventDefault();

            let dx = event.clientX - dragInfo.current.startX;
            let dy = event.clientY - dragInfo.current.startY;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                dragInfo.current.isDrag = true;
            }

            // --- Logique de confinement ---
            const fabRect = fabRef.current.getBoundingClientRect();
            const viewport = { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };

            // Calculer les nouvelles positions potentielles
            const newLeft = fabRect.left + dx;
            const newTop = fabRect.top + dy;

            // Ajuster dx et dy pour rester dans les limites du parent (la fenêtre)
            if (newLeft < viewport.left) dx = viewport.left - fabRect.left;
            if (newTop < viewport.top) dy = viewport.top - fabRect.top;
            if (newLeft + fabRect.width > viewport.right) dx = viewport.right - (fabRect.left + fabRect.width);
            if (newTop + fabRect.height > viewport.bottom) dy = viewport.bottom - (fabRect.top + fabRect.height);

            setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            dragInfo.current.startX = event.clientX;
            dragInfo.current.startY = event.clientY;
        };

        const handlePointerUp = () => {
            setIsDragging(false);
            // Sauvegarder la position si un déplacement a eu lieu
            if (dragInfo.current.isDrag) {
                localStorage.setItem('fabMenuPosition', JSON.stringify(position));
            }
            // Réinitialiser l'état de déplacement pour le prochain clic
            dragInfo.current.isDrag = false;
        };

        document.addEventListener('mousedown', handleOutsideClick);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [isDragging, position]);

    const handlePointerDown = (event) => {
        setIsDragging(true);
        dragInfo.current = {
            startX: event.clientX,
            startY: event.clientY,
            isDrag: false,
        };
    };

    return (
        <div ref={fabRef} className="fixed bottom-24 sm:bottom-6 right-6 z-30" style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
            <div className="flex flex-col items-center gap-3 mb-3">
                {/* Bouton Assistant IA */}
                <div
                    className={`relative group transition-all duration-300 ease-out ${isFabMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                    style={{ transitionDelay: isFabMenuOpen ? '100ms' : '0ms' }}
                >
                    <span className="absolute right-full mr-3 px-2 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Assistant IA</span>
                    <button
                        onClick={() => { navigate('/ai-assistant'); setIsFabMenuOpen(false); }}
                        className="w-9 h-9 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-all duration-300 transform hover:scale-110"
                        tabIndex={isFabMenuOpen ? 0 : -1}
                    >
                        <SparklesIcon />
                    </button>
                </div>
                {/* Bouton Nouvelle Analyse */}
                <div
                    className={`relative group transition-all duration-300 ease-out ${isFabMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                    style={{ transitionDelay: isFabMenuOpen ? '50ms' : '0ms' }}
                >
                    <span className="absolute right-full mr-3 px-2 py-1 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Nouvelle Analyse</span>
                    <button
                        onClick={() => { handleNewProject(); setIsFabMenuOpen(false); }}
                        className="w-9 h-9 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-all duration-300 transform hover:scale-110"
                        tabIndex={isFabMenuOpen ? 0 : -1}
                    >
                        <PlusIcon />
                    </button>
                </div>
            </div>
            <button
                onPointerDown={handlePointerDown}
                onClick={() => {
                    if (!dragInfo.current.isDrag) {
                        setIsFabMenuOpen(prev => !prev);
                    }
                }}
                className={`w-12 h-12 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-40 transform hover:scale-110 hover:shadow-xl cursor-grab active:cursor-grabbing ${isFabMenuOpen ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
                {isFabMenuOpen ? <XIcon /> : <SparklesIcon />}
            </button>
        </div>
    );
};

export default FabMenu;