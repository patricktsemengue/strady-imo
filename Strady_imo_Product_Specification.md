
# Product Specification Document: Strady . imo

## 1. Purpose
Strady . imo is a multilingual (EN, FR, NL), desktop and mobile-friendly web application designed to guide Belgian property investors and homeowners through the complete real estate journey. It provides data-driven tools to estimate acquisition costs, renovation/build expenses, financing options, rental income, and long-term cashflow, with educational insights and exportable summaries.

## 2. Features
- Multilingual support: English, French, Dutch
- Responsive design for desktop and mobile
- Step-by-step journey: Acquisition → Renovation/Build → Financing → Rental → Return
- Property acquisition options: land or property, build, renovate, or no change
- Renovation module with selectable areas and intensity levels (light, medium, heavy)
- Cost estimation based on surface and renovation type
- Financing calculator: personal contribution, notary fees, loan estimation (Belgian context)
- Rental income estimator: rent type, duration, expenses, market-based suggestions
- Cashflow and ROI calculator with breakdowns
- Summary view with export options (email, PDF)
- User feedback system: written comments and star ratings
- Theme options: Standard, Daylight, Dark
- Educational content: calculation breakdowns, references, professional advice prompts

## 3. User Flow
- User selects language (EN, FR, NL)
- User begins journey with property acquisition
- Chooses build/renovation options and inputs surface area
- Receives cost estimates for selected changes
- Proceeds to financing: inputs contribution, views notary and loan estimates
- Moves to rental: inputs rent, type of stay, expenses
- Receives rental suggestions and cashflow analysis
- Views summary and exports project
- Provides feedback or resets journey

## 4. Technical Requirements
- Web-based application compatible with desktop and mobile browsers
- Frontend: HTML5, CSS3, JavaScript (React or Vue.js recommended)
- Backend: Python (Django or Flask), Node.js
- Database: PostgreSQL or MySQL
- PDF and email export functionality
- Multilingual content management
- Secure user data handling and GDPR compliance
- Integration with Belgian market data sources (e.g. notary.be)
