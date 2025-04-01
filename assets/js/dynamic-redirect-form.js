class DynamicRedirectForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.selectedStyles = new Set();
        this.selectedLicense = 'basic';
        this.priceList = {
            'full-family': 70,
            'regular': 25,
            'bold': 25,
            'black': 25
        };
        this.priceMultiplier = {
            'basic': 1,
            'small': 2,
            'medium': 5,
            'large': 8,
        }
        this.redirectMap = {
            'full-family': {
                'basic': 'https://www.example.com/fullfamily/basic',
                'small': 'https://www.example.com/fullfamily/small',
                'medium': 'https://www.example.com/fullfamily/medium',
                'large': 'https://www.example.com/fullfamily/large',
            },
            'regular': {
                'basic': 'https://www.example.com/regular/basic',
                'small': 'https://www.example.com/regular/small',
                'medium': 'https://www.example.com/regular/medium',
                'large': 'https://www.example.com/regular/large',
            },
            'bold': {
                'basic': 'https://www.example.com/bold/basic',
                'small': 'https://www.example.com/bold/small',
                'medium': 'https://www.example.com/bold/medium',
                'large': 'https://www.example.com/bold/large',
            },
            'black': {
                'basic': 'https://www.example.com/black/basic',
                'small': 'https://www.example.com/black/small',
                'medium': 'https://www.example.com/black/medium',
                'large': 'https://www.example.com/black/large',
            },
            'regular-bold': {
                'basic': 'https://www.example.com/regularbold/basic',
                'small': 'https://www.example.com/regularbold/small',
                'medium': 'https://www.example.com/regularbold/medium',
                'large': 'https://www.example.com/regularbold/large',
            },
            'bold-black': {
                'basic': 'https://www.example.com/boldblack/basic',
                'small': 'https://www.example.com/boldblack/small',
                'medium': 'https://www.example.com/boldblack/medium',
                'large': 'https://www.example.com/boldblack/large',
            },
            'regular-black': {
                'basic': 'https://www.example.com/regularblack/basic',
                'small': 'https://www.example.com/regularblack/small',
                'medium': 'https://www.example.com/regularblack/medium',
                'large': 'https://www.example.com/regularblack/large',
            }
        };
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .dynamic-redirect-form {
                    display: flex;
                    flex-direction: column;
                    color: var(--col-red);
                }

                .choose {
                    display: flex;
                    gap: 5rem;
                }

                .choose-block {
                    flex-grow: 1;

                    h2 {
                        font-size: 2rem;
                    }

                    h3 {
                        font-size: 1.4rem;
                        text-transform: uppercase;
                        color: var(--col-grey);
                    }

                    a {
                        color: var(--col-red);
                    }
                }

                .button-group {
                    display: flex;
                    flex-direction: column;
                    justify-content: left;
                    gap: var(--gap-button);
                    padding-bottom: 2rem;

                    button {
                        padding: 1rem 2rem;
                        display: flex;
                        justify-content: space-between;
                        border: none;
                        font-family: var(--font-body), sans-serif;
                        font-size: 1.6rem;
                        background: var(--col-light-red);
                        color: var(--col-black);
                        cursor: pointer;
                        transition: all 0.25s ease;

                        .button-title {
                            text-align: left;
                            min-width: 18rem;
                        }

                        .button-subtitle {
                            color: var(--col-grey);
                            font-size: 1.4rem;
                            margin-top: .5rem;
                            font-weight: 500;
                            transition: all 0.25s ease;
                            flex-grow: 1;
                            text-align: left;
                        }

                        &:hover {
                            box-shadow: 0 0 0 .1rem var(--col-red);
                        }

                        &.selected {
                            background-color: var(--col-red);
                            color: white;

                            .button-subtitle {
                                color: var(--col-light-red);
                            }
                        }

                        .style-price {
                            display: flex;
                            align-items: center;
                        }
                    }
                }

                .submit-btn {
                    width: 100%;
                    margin: 2rem 0;
                    padding: 1rem;
                    background-color: var(--col-red);
                    color: var(--col-white);
                    border: none;
                    cursor: pointer;
                    transition: all 0.25s ease;
                    font-weight: bold;

                    &:hover {
                        box-shadow: 0 0 0 .1rem var(--col-red);
                    }

                    &:disabled {
                        background-color: var(--col-grey);
                        cursor: not-allowed;

                        &:hover {
                            box-shadow: none;
                        }
                    }
                }

                .subtotal {
                    display: flex;
                    justify-content: space-between;
                    font-size: 3rem;
                    font-weight: bold;
                }
            </style>
            <div class="dynamic-redirect-form">
                <div class="choose">
                    <div class="choose-block">
                        <h2 class="choose-title" aria-label="Choose Styles">Choose Styles</h2>
                        <div class="button-group">
                            <h3 class="subtitle">Full Typeface Family</h3>
                            <button class="style-button" data-style="full-family">
                                <div>
                                    <div class="button-title">Fluidence Family</div>
                                    <div class="button-subtitle">3 styles + 1 variable font</div>
                                </div>
                                <div class="style-price">$${this.calculatePrice('full-family')}</div>
                            </button>
                            <h3 class="subtitle">Individual Styles</h3>
                            <button class="style-button" data-style="regular">
                                <div>Regular</div>
                                <div class="style-price">$${this.calculatePrice('regular')}</div>
                            </button>
                            <button class="style-button" data-style="bold">
                                <div>Bold</div>
                                <div class="style-price">$${this.calculatePrice('bold')}</div>
                            </button>
                            <button class="style-button" data-style="black">
                                <div>Black</div>
                                <div class="style-price">$${this.calculatePrice('black')}</div>
                            </button>
                        </div>
                    </div>
                    <div class="choose-block">
                        <h2 class="choose-title" aria-label="Choose License">Choose License</h2>
                        <div class="button-group">
                            <button class="license-button selected" data-license="basic">
                                <span class="button-title">Basic License</span>
                                <span class="button-subtitle">for use on up to 2 devices for print/desktop, up to 20K monthly page views for web</span>
                            </button>
                            <button class="license-button" data-license="small">
                                <span class="button-title">Small License</span>
                                <span class="button-subtitle">for use on up to 5 devices for print/desktop, up to 100K monthly page views for web</span>
                            </button>
                            <button class="license-button" data-license="medium">
                                <span class="button-title">Medium License</span>
                                <span class="button-subtitle">for use on up to 15 devices for print/desktop, up to 500K monthly page views for web, 1 app embed</span>
                            </button>
                            <button class="license-button" data-license="large">
                                <span class="button-title">Large License</span>
                                <span class="button-subtitle">for use on up to 30 devices for print/desktop, up to 1M monthly page views for web, up to 2 app embeds</span>
                            </button>
                        </div>
                        You can read the <a href="https://bonniezhou.com/license" target="_blank">Full License</a>  here.
                        If you need a larger or custom license, please feel free to <a href="mailto:hello@bonniezhou.com" target="_blank">get in touch!</a> 
                    </div>
                </div>
                <div class="subtotal">
                    <div class="selected-styles">Selected: <span id="selected-styles-list"></span></div>
                    <div>$<span id="total-price">0</span> USD</div>
                </div>
                <button class="submit-btn" disabled>Buy</button>
            </div>
        `;
        
        this.updateSelectedStyles();
        this.updateTotalPrice();
    }

    calculatePrice(style) {
        const multiplier = this.priceMultiplier[this.selectedLicense] || 1;
        return this.priceList[style] * multiplier;
    }

    updateStylePrices() {
        const styleButtons = this.shadowRoot.querySelectorAll('.style-button');
        styleButtons.forEach(button => {
            const style = button.dataset.style;
            const priceElement = button.querySelector('.style-price');
            priceElement.textContent = `$${this.calculatePrice(style)}`;
        });
    }

    updateSelectedStyles() {
        const selectedStylesList = this.shadowRoot.querySelector('#selected-styles-list');
        const stringMap = {
            'full-family': 'Fluidence Family (3 styles + 1 variable font)',
            'regular': 'Regular',
            'bold': 'Bold',
            'black': 'Black'
        };
        if (selectedStylesList) {
            selectedStylesList.textContent = Array.from(this.selectedStyles)
                .map(style => stringMap[style] || '')
                .join(', ') || 'None';
        }
    }

    updateTotalPrice() {
        const totalPriceElement = this.shadowRoot.querySelector('#total-price');
        if (totalPriceElement) {
            const total = Array.from(this.selectedStyles)
                .map(style => this.calculatePrice(style))
                .reduce((acc, num) => acc + num, 0);
            totalPriceElement.textContent = total;
        }
    }

    setupEventListeners() {
        const styleButtons = this.shadowRoot.querySelectorAll('.style-button');
        const licenseButtons = this.shadowRoot.querySelectorAll('.license-button');
        const submitBtn = this.shadowRoot.querySelector('.submit-btn');

        // Style button click handler
        const fullFamilyButton = styleButtons[0];
        const indivStyleButtons = Array.from(styleButtons).slice(1);
        styleButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.classList.toggle('selected');

                // Logic for full family vs individual styles
                this.checkStyleSelect(button, fullFamilyButton, indivStyleButtons);

                //Update selected styles
                this.selectedStyles.clear();
                styleButtons.forEach(button => {
                    if (button.classList.contains('selected')) this.selectedStyles.add(button.dataset.style);
                });

                this.updateSelectedStyles();
                this.updateTotalPrice();

                // Enable submit button if styles and license are selected
                submitBtn.disabled = this.selectedStyles.size === 0 || this.selectedLicense === null;
            });
        });

        // License button click handler
        licenseButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove selected class from all license buttons
                licenseButtons.forEach(btn => 
                    btn.classList.remove('selected')
                );
                
                // Add selected class to clicked button
                button.classList.add('selected');
                this.selectedLicense = button.dataset.license;
                
                // Update all prices based on new license
                this.updateStylePrices();
                this.updateTotalPrice();
                
                // Enable submit button if styles and license are selected
                submitBtn.disabled = this.selectedStyles.size === 0 || this.selectedLicense === null;
            });
        });

        // Submit button handler
        submitBtn.addEventListener('click', () => {
            // If no valid redirect found, show alert
            let redirectFound = false;

            const styleKey = Array.from(this.selectedStyles).join('-');
            const redirectUrl = this.redirectMap[styleKey]?.[this.selectedLicense];
            if (redirectUrl) {
                redirectFound = true;
                window.open(redirectUrl, '_blank', 'noopener,noreferrer');
            }

            if (!redirectFound) {
                alert('No redirect found for selected styles and license');
            }
        });
    }

    checkStyleSelect(button, fullFamilyButton, indivStyleButtons) {
        if (button == fullFamilyButton) {
            if (fullFamilyButton.classList.contains('selected')) {
                // Deselect all other buttons, if full family button is selected
                indivStyleButtons.forEach(button => 
                    button.classList.remove('selected')
                );
            }
        } else {
            if (fullFamilyButton.classList.contains('selected')) {
                // Deslect full family button, if any style button is selected
                fullFamilyButton.classList.remove('selected');
            } else if (indivStyleButtons.every(button => button.classList.contains('selected'))) {
                // Select full family button only, if all 3 style buttons are selected
                indivStyleButtons.forEach(button => 
                    button.classList.remove('selected')
                );
                fullFamilyButton.classList.add('selected');
            }
        }
    }
}

// Define the custom element
customElements.define('dynamic-redirect-form', DynamicRedirectForm);
