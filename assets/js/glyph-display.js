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
          font-family: ${font}, sans-serif;
        }
        .glyph-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-auto-rows: minmax(100px, auto);
        }
        .inspector {
          grid-column: 1 / 4;
          display: flex;
          flex-direction: column;
          padding: 20px;
          background-color: var(--col-light-red);
        }
        .toolbar {
          font-family: var(--font-body);
          display: flex;
          flex-direction: column;
        }
        .preview {
          font-size: 40rem;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
          background-color: white;
        }
        .identification {
          text-align: center;
          margin: 10px 0;
        }
        .unicode {
          color: #666;
        }
        .glyph-list {
          grid-column: 4 / -1;
          background-color: #f9f9f9;
          overflow-x: auto;
          position: relative;
        }
        .glyph-list .content {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          padding: 10px;
        }
        .glyph-list a {
          text-decoration: none;
          color: black;
          text-align: center;
          cursor: pointer;
          aspect-ratio: 1 / 1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 4rem;
          padding: 0;
        }
        .glyph-list a:hover,
        .glyph-list a.selected {
          background-color: #e0e0e0;
        }
        .slider {
          display: flex;
          flex-direction: column;
        }
      </style>
      <div class="glyph-grid">
        <div class="inspector">
          <div class="toolbar">
            <div class="slider opsz-slider">
              <input type="range" name="wght" value="32" min="14" max="32" step="0.1">
              Weight
            </div>
            <div class="identification">
              <div class="name" id="glyph-name">Select a Glyph</div>
              <div class="unicode" id="glyph-unicode"></div>
            </div>
          </div>
          <div class="preview" id="glyph-preview"></div>
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
    const nameEl = this.shadowRoot.getElementById('glyph-name');
    const unicodeEl = this.shadowRoot.getElementById('glyph-unicode');
    const previewEl = this.shadowRoot.getElementById('glyph-preview');

    nameEl.textContent = char;
    unicodeEl.textContent = `U+${unicode}`;
    previewEl.textContent = char;
  }
}

// Define the custom element
customElements.define('glyph-display', GlyphDisplay);

// Example usage in HTML:
// <glyph-display characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"></glyph-display>
