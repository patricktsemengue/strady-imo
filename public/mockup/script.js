document.addEventListener('DOMContentLoaded', () => {

    // Get all necessary elements from the DOM
    const createNewStrategyBtn = document.getElementById('createNewStrategyBtn');
    const closeEditorBtn = document.getElementById('closeEditorBtn');
    const strategyEditor = document.getElementById('strategyEditor');
    const overlay = document.getElementById('overlay');
    const strategyForm = document.getElementById('strategyForm');

    // Function to open the slide-out editor
    const openEditor = () => {
        strategyEditor.classList.add('open');
        overlay.classList.add('visible');
    };

    // Function to close the slide-out editor
    const closeEditor = () => {
        strategyEditor.classList.remove('open');
        overlay.classList.remove('visible');
    };

    // Event Listeners
    createNewStrategyBtn.addEventListener('click', openEditor);
    closeEditorBtn.addEventListener('click', closeEditor);
    overlay.addEventListener('click', closeEditor);

    // Handle form submission (for now, just prevents default and closes)
    strategyForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from actually submitting
        
        // In a real app, we would collect data here and send to a server.
        // For this prototype, we'll just log it and close the editor.
        console.log('Form submitted. A real app would save this data.');
        
        alert('Strategy saved! (Prototype)'); // User feedback
        
        closeEditor();
        
        // Optional: Add a new card to the dashboard to simulate saving.
        // This is a simple mock and won't persist.
        const strategyGrid = document.getElementById('strategyGrid');
        const firstEmptySlot = document.querySelector('.strategy-card.empty');
        if (firstEmptySlot) {
            firstEmptySlot.classList.remove('empty');
            firstEmptySlot.innerHTML = `
                <h3>New Mock Strategy</h3>
                <p><strong>Cashflow:</strong> €---/month</p>
                <p><strong>CoC Return:</strong> --.-%</p>
            `;
        }
    });

});