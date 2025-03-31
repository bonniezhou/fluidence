class MultiSelectButtons extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .button-group {
                    display: flex;
                    gap: 10px;
                    padding: 20px;
                    background-color: #f0f0f0;
                    border-radius: 8px;
                }
                .select-button {
                    padding: 10px 15px;
                    border: 2px solid #3498db;
                    background-color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-radius: 4px;
                }
                .select-button.selected {
                    background-color: #3498db;
                    color: white;
                }
            </style>
            <div class="button-group">
                <button class="select-button" data-index="0">Button 1</button>
                <button class="select-button" data-index="1">Button 2</button>
                <button class="select-button" data-index="2">Button 3</button>
                <button class="select-button" data-index="3">Button 4</button>
            </div>
        `;
    }

    setupEventListeners() {
        const buttons = this.shadowRoot.querySelectorAll('.select-button');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.toggle('selected');
                this.checkAutoSelect(button);
            });
        });
    }

    checkAutoSelect(button) {
        const buttons = this.shadowRoot.querySelectorAll('.select-button');
        const firstButton = buttons[0];
        const otherButtons = Array.from(buttons).slice(1);

        if (button == firstButton) {
            if (firstButton.classList.contains('selected')) {
                // Deselect all other buttons, if 1st button is selected
                otherButtons.forEach(button => 
                    button.classList.remove('selected')
                );
            }
        } else {
            if (firstButton.classList.contains('selected')) {
                // Deslect 1st button, if any other button is selected
                firstButton.classList.remove('selected');
            } else if (otherButtons.every(button => button.classList.contains('selected'))) {
                // Select 1st button only, if all 3 other buttons are selected
                otherButtons.forEach(button => 
                    button.classList.remove('selected')
                );
                firstButton.classList.add('selected');
            }
        }
    }
}

// Define the custom element
customElements.define('multi-select-buttons', MultiSelectButtons);

// Optional: Export the class if using module imports
export default MultiSelectButtons;