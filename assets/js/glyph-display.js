class GlyphDisplay extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.selectedCharacter = null;
  }

  static get observedAttributes() {
    return ['characters', 'font'];
  }

  connectedCallback() {
    this.render();
    this.cacheElements();
    this.setupEventListeners();
  }

  cacheElements() {
    this.glyphPreview = this.shadowRoot.getElementById('glyphPreview');
    this.glyphUnicode = this.shadowRoot.getElementById('glyphUnicode');
    this.fontStyleSelect = this.shadowRoot.getElementById('fontStyleSelect');
    this.fontWeightSlider = this.shadowRoot.getElementById('fontWeightSlider');
    this.fontWeightValue = this.shadowRoot.getElementById('fontWeightValue');
}

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const font = this.getAttribute('font') || 'Inter';
    const characters = this.getAttribute('characters') || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          grid-column: 1 / -1;
          font-family: ${font}, sans-serif;
        }

        .glyph-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
        }

        .inspector-wrapper {
          grid-column: 1 / 4;
        }

        .inspector {
          position: sticky;
          top: 0;
          height: 100vh;

          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 2rem;
          margin: .2rem 0;

          background-color: var(--col-light-red);
          font-family: var(--font-body);

          .controls {
            display: flex;
            align-items: center;
            gap: 2rem;
            flex-wrap: wrap;
            padding: 3rem 0 2rem;
          }

          .control-group {
            font-family: var(--font-body);
            display: flex;
            gap: 8px;
            transition: border .2s ease-in-out;
          }

          .control-group.select {
            padding: .5rem;
            background: var(--col-light-red);
            border: .1rem solid var(--col-light-red);

            &:hover {
              border: .1rem solid var(--col-red);
            }

            select {
              font-family: var(--font-body);
              font-size: 1.8rem;
              border: none;
              background: var(--col-light-red);
              cursor: pointer;
              padding-right: .5rem;
              outline: 0;
            }
          }

          .control-group.slider {
            flex-grow: 1;
          
            .range-slider {
              flex-grow: 1;
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
          }

          .preview {
            font-size: 40rem;
            flex-grow: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            font-family: ${font}, sans-serif;
          }

          .unicode {
            text-align: center;
            padding: 2rem 0 3rem;
          }
        }

        .glyph-list {
          grid-column: 4 / -1;

          .content {
            display: grid;
            grid-template-columns: repeat(10, 1fr);
            gap: .2rem;
            padding: .2rem;
          }

          a {
            text-decoration: none;
            color: black;
            text-align: center;
            cursor: pointer;
            aspect-ratio: 1 / 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 4rem;
            background: var(--col-light-red);

            &:hover {
              box-shadow: 0 0 0 .1rem var(--col-red);
            }

            &.selected {
              background: var(--col-red);
              color: var(--col-white);
            }
          }
        }
      </style>
      <div class="glyph-grid">
        <div class="inspector-wrapper">
          <div class="inspector">
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
            </div>
            <div class="preview" id="glyphPreview"></div>
            <div class="unicode" id="glyphUnicode"></div>
          </div>
        </div>
        <div class="glyph-list">
          <div class="content">
            ${characters.split('').map((char, index) => `
              <a href="#" 
                data-name="${char}" 
                data-cp="${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}"
                title="${char}\nU+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}"
                ${index === 0 ? 'class="selected"' : ''}
              >${char}</a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Initial state setup
    this.glyphPreview.style.fontVariationSettings = `'wght' ${this.defaultWeight || 400}`;
    this.selectCharacter(this.characters[0], 
      this.characters[0].charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
    );

    // Weight slider listener
    this.fontWeightSlider.addEventListener('input', () => {
        const weight = this.fontWeightSlider.value;
        this.glyphPreview.style.fontVariationSettings = `'wght' ${weight}`;
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
        this.glyphPreview.style.fontVariationSettings = `'wght' ${weight}`;
    });

    // Event listeners for character selection
    this.shadowRoot.querySelectorAll('.glyph-list a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove selected class from all links
        this.shadowRoot.querySelectorAll('.glyph-list a').forEach(l => 
          l.classList.remove('selected')
        );
        
        // Add selected class to clicked link
        e.target.classList.add('selected');
        
        // Update preview and details
        const char = e.target.dataset.name;
        const unicode = e.target.dataset.cp;
        this.selectCharacter(char, unicode);
      });
    });
  }

  selectCharacter(char, unicode) {
    this.glyphUnicode.textContent = `U+${unicode}`;
    this.glyphPreview.textContent = char;
  };

  // Getters for attributes
  get characters() {
    return this.getAttribute('characters');
  }
}

// Define the custom element
customElements.define('glyph-display', GlyphDisplay);

// Example usage in HTML:
// <glyph-display characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"></glyph-display>
