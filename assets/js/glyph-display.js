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

        .inspector {
          grid-column: 1 / 4;
          display: flex;
          flex-direction: column;
          padding: 2rem;
          margin: .2rem 0;
          background-color: var(--col-light-red);
          aspect-ratio: 1/1;
          font-family: var(--font-body);

          .slider {
            padding: 0 .5rem 2rem;
            display: flex;
            gap: 1rem;

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
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: white;
            font-family: ${font}, sans-serif;
          }
          .unicode {
            text-align: center;
            padding-top: 2rem;
            color: #666;
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
        <div class="inspector">
          <div class="slider">
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
          <div class="preview" id="glyph-preview"></div>
          <div class="unicode" id="glyph-unicode"></div>
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

    // Initial selection of first character
    const firstChar = characters[0];
    this.selectCharacter(firstChar, 
      firstChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')
    );

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
    const unicodeEl = this.shadowRoot.getElementById('glyph-unicode');
    const previewEl = this.shadowRoot.getElementById('glyph-preview');

    unicodeEl.textContent = `U+${unicode}`;
    previewEl.textContent = char;
  }
}

// Define the custom element
customElements.define('glyph-display', GlyphDisplay);

// Example usage in HTML:
// <glyph-display characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"></glyph-display>
