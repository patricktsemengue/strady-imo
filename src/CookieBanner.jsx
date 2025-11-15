import React from 'react';

const CookieBanner = () => {
    const [showCookieBanner, setShowCookieBanner] = React.useState(() => !localStorage.getItem('cookie_consent'));

    const handleCookieConsent = () => {
        localStorage.setItem('cookie_consent', 'true');
        setShowCookieBanner(false);
    };

    if (!showCookieBanner) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col md:flex-row justify-between items-center z-50 animate-fade-in-up">
            <p className="text-sm mb-2 md:mb-0">Ce site utilise des cookies et le stockage local essentiels à son bon fonctionnement. En continuant, vous acceptez leur utilisation.</p>
            <button onClick={handleCookieConsent} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex-shrink-0">J'ai compris</button>
        </div>
    );
};

export default CookieBanner;
