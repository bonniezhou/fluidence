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
                    grid-column: 1 / -1;
                }

                .type-tester {
                    padding: 2rem 0 6rem;
                }

                .controls {
                    display: flex;
                    align-items: center;
                    gap: 2rem;
                    flex-wrap: wrap;
                    padding: 1rem 0;
                }

                .control-group {
                    font-size: 16px;
                    font-family: var(--font-body);
                    display: flex;
                    gap: 1rem;
                }

                .control-group.select {
                    padding: .5em;
                    background: var(--col-light-red);
                    border: .1rem solid var(--col-light-red);

                    &:hover {
                        border: .1rem solid var(--col-red);
                    }

                    select {
                        font-size: 1.6rem;
                        font-family: var(--font-body);
                        border: none;
                        background: var(--col-light-red);
                        cursor: pointer;
                        padding-right: .5rem;
                        outline: 0;
                    }
                }

                .control-group.slider {
                    min-width: 250px;
		            padding-right: 0;
                }
                
                .range-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    border: none;
                    background: transparent;

                    &::-webkit-slider-runnable-track {
                        height: .1rem;
                        background: var(--col-red);
                    }
                    &::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        cursor: pointer;
                        border-radius: 50%;
                        margin-top: -0.75rem;
                        height: 1.5rem;
                        width: 1.5rem;
                        background: var(--col-red);
                    }

                    &::-moz-range-track {
                        height: .1rem;
                        background: var(--col-red);
                    }
                    &::-moz-range-thumb {
                        border: none;
                        cursor: pointer;
                        border-radius: 50%;
                        margin-top: -0.75rem;
                        height: 1.5rem;
                        width: 1.5rem;
                        background: var(--col-red);
                    }
                }

                .align-buttons {
                    display: flex;
                    gap: var(--gap-button);

                    button {
                        font-size: 1.6rem;
                        font-family: var(--font-body);
                        padding: 10px;
                        background: var(--col-light-red);
                        border: none;
                        cursor: pointer;
                        transition: all 0.25s ease;

                        &:hover {
                            box-shadow: 0 0 0 .1rem var(--col-red);
                        }
                    }

                    .active {
                        background: var(--col-red);
                        color: white;
                    }
                }

                .type-demo {
                    font-family: 'Fluidence';
                    line-height: 1.1;

                    &:focus {
                        outline: none;
                    }
                }
            </style>

            <div class="type-tester" aria-label="Type Tester">
                <div class="controls">
                    <div class="control-group select">
                        <select id="fontStyleSelect" selected="${this.defaultStyle || "regular"}">
                            <option value="regular" ${this.defaultStyle === 'regular' ? 'selected' : ''}>Fluidence Regular</option>
                            <option value="bold" ${this.defaultStyle === 'bold' ? 'selected' : ''}>Fluidence Bold</option>
                            <option value="black" ${this.defaultStyle === 'black' ? 'selected' : ''}>Fluidence Black</option>
                        </select>
                    </div>

                    <div class="control-group slider">
                        <label>Weight</label>
                        <input class="range-slider"
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
                        <input class="range-slider"
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

            const options = this.fontStyleSelect.options;
            switch (true) {
                case weight >= 800:
                    if (!options[2].selected) options[2].selected = true;
                    break;
                case weight >= 600:
                    if (!options[1].selected) options[1].selected = true;
                    break;
                default:
                    if (!options[0].selected) options[0].selected = true;
                    break;
            }
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