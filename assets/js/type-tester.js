class FluidenceTypeTester extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return [
            'default-text', 
            'default-weight', 
            'default-size', 
            'default-align', 
            'default-style'
        ];
    }

    connectedCallback() {
        this.render();
        this.cacheElements();
        this.setupEventListeners();
    }

    cacheElements() {
        this.textPreview = this.shadowRoot.getElementById('textPreview');
        this.fontStyleSelect = this.shadowRoot.getElementById('fontStyleSelect');
        this.fontWeightSlider = this.shadowRoot.getElementById('fontWeightSlider');
        this.fontWeightValue = this.shadowRoot.getElementById('fontWeightValue');
        this.fontSizeSlider = this.shadowRoot.getElementById('fontSizeSlider');
        this.fontSizeValue = this.shadowRoot.getElementById('fontSizeValue');
        this.alignButtons = this.shadowRoot.querySelectorAll('.align-buttons button');
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    font-family: 'Red Hat Text';
                }

                .type-tester {
                    margin: 3rem auto;
                    padding: 3rem;
                    min-height: 250px;
                }

                .controls {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                    padding: 1em 0;
                }

                .control-group,
                .control-group button,
                .control-group select {
                    font-size: 16px;
                    font-family: 'Red Hat Text';
                    display: flex;
                    gap: 8px;
                    padding-right: 1em;
	                outline: 0;
                    transition: border .2s ease-in-out;
                }

                .style-select {
                    font-size: 16px;
                    padding: .5em;
                    border: 1px solid var(--col-white);

                    &:hover {
                        border: 1px solid var(--col-red);
                    }
                }
                
                .slider {
                    min-width: 250px;
		            padding-right: 0;
                }

                .align-buttons {
                    display: flex;
                    gap: 0;

                    button {
                        padding: 10px;
                        border: 1px solid var(--col-white);

                        &:hover {
                            border: 1px solid var(--col-red);
                        }
                    }

                    .active {
                        background: var(--col-red);
                        border: 1px solid var(--col-red);
                        color: white;
                    }
                }

                .type-demo {
                    font-family: 'Fluidence', sans-serif;
                    line-height: normal;

                    &:focus {
                        outline: none;
                    }
                }
            </style>

            <div class="type-tester" aria-label="Type Tester">
                <div class="controls">
                    <div class="control-group">
                        <select class="style-select" id="fontStyleSelect" selected="${this.defaultStyle || "regular"}">
                            <option value="regular">Fluidence Regular</option>
                            <option value="bold">Fluidence Bold</option>
                            <option value="black">Fluidence Black</option>
                        </select>
                    </div>

                    <div class="control-group slider">
                        <label>Weight</label>
                        <input 
                            type="range" 
                            id="fontWeightSlider" 
                            min="400" 
                            max="900" 
                            value="${this.defaultWeight || 400}"
                        >
                        <label><span id="fontWeightValue">${this.defaultWeight || 400}</span></label>
                    </div>

                    <div class="control-group slider">
                        <label>Size</label>
                        <input 
                            type="range" 
                            id="fontSizeSlider" 
                            min="20" 
                            max="300" 
                            value="${this.defaultSize || 60}"
                        >
                        <label><span id="fontSizeValue">${this.defaultSize || 60}</span>px</label>
                    </div>

                    <div class="control-group align-buttons">
                        <button data-align="left">Left</button>
                        <button data-align="center">Center</button>
                        <button data-align="right">Right</button>
                    </div>
                </div>
                
                <div 
                    class="type-demo" 
                    id="textPreview" 
                    contenteditable="true"
                >
                    ${this.defaultText || 'Type something here!'}
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Initial state setup
        this.textPreview.style.fontVariationSettings = `'wght' ${this.defaultWeight || 400}`;
        this.textPreview.style.fontSize = `${this.defaultSize || 100}px`;
        this.textPreview.style.textAlign = this.defaultAlign || 'left';

        // Mark initial align button as active
        const initialAlignButton = Array.from(this.alignButtons).find(
            btn => btn.dataset.align === (this.defaultAlign || 'left')
        );
        if (initialAlignButton) {
            initialAlignButton.classList.add('active');
        }

        // Size slider listener
        this.fontSizeSlider.addEventListener('input', () => {
            const size = this.fontSizeSlider.value;
            this.textPreview.style.fontSize = `${size}px`;
            this.fontSizeValue.textContent = size;
        });

        // Weight slider listener
        this.fontWeightSlider.addEventListener('input', () => {
            const weight = this.fontWeightSlider.value;
            this.textPreview.style.fontVariationSettings = `'wght' ${weight}`;
            this.fontWeightValue.textContent = weight;
        });

        // Style select listener
        this.fontStyleSelect.addEventListener('change', () => {
            let weight;
            switch(this.fontStyleSelect.value) {
                case 'regular':
                    weight = 400;
                    break;
                case 'bold':
                    weight = 700;
                    break;
                case 'black':
                    weight = 900;
                    break;
            }
            
            this.fontWeightSlider.value = weight;
            this.fontWeightValue.textContent = weight;
            this.textPreview.style.fontVariationSettings = `'wght' ${weight}`;
        });

        // Alignment buttons listener
        this.alignButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.alignButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.textPreview.style.textAlign = button.dataset.align;
            });
        });
    }

    // Getters for attributes
    get defaultText() {
        return this.getAttribute('default-text');
    }

    get defaultWeight() {
        return parseInt(this.getAttribute('default-weight') || '400');
    }

    get defaultSize() {
        return parseInt(this.getAttribute('default-size') || '100');
    }

    get defaultAlign() {
        return this.getAttribute('default-align');
    }

    get defaultStyle() {
        return this.getAttribute('default-style');
    }
}

// Define the custom element
customElements.define('fluidence-type-tester', FluidenceTypeTester);