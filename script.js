const MATERIAL_DENSITIES = {
    'ocel-tazena': 7850,
    'litina-seda': 7200,
    'litina-temperovana': 7200,
    'dynamoplech-m350': 7850,
    'dynamoplech-m400-530': 7850,
    'dynamoplech-m600-800': 7850,
    'ocel-rychlorezna': 7850,
    'mosaz': 8500,
    'med': 8960,
    'bronz': 8800,
    'hlinik': 2700,
    'pvc': 1400,
    'voda': 1000
};

const MATERIAL_LABELS = {
    'ocel-tazena': 'Ocel tažená válcovaná',
    'litina-seda': 'Litina šedá',
    'litina-temperovana': 'Litina temperovaná',
    'dynamoplech-m350': 'Dynamoplech do M350',
    'dynamoplech-m400-530': 'Dynamoplech M400-M530',
    'dynamoplech-m600-800': 'Dynamoplech M600-M800',
    'ocel-rychlorezna': 'Ocel rychlořezná',
    'mosaz': 'Mosaz',
    'med': 'Měď',
    'bronz': 'Bronz',
    'hlinik': 'Hliník',
    'pvc': 'PVC',
    'voda': 'Voda'
};

const DEFAULT_MATERIAL = 'ocel-tazena';

const CALCULATOR_TILES = [
    { id: 'mezikruzi', title: 'Mezikruží', image: 'images/mezikruzi.png' },
    { id: 'trubka', title: 'Trubka', image: 'images/trubka.png' },
    { id: 'hranol', title: 'Hranol', image: 'images/hranol.png' },
    { id: 'valec', title: 'Válec', image: 'images/valec.png' },
    { id: 'jakl', title: 'Jakl', image: 'images/jakl.png' },
    { id: 'profil-l', title: 'Profil L', image: 'images/profil-l.png' },
    { id: 'plochace', title: 'Plocháče', image: 'images/plochace.png' },
    { id: 'profil-iu', title: 'Profil I+U', image: 'images/profil-iu.png' },
    { id: 'kabely', title: 'Kabely', image: 'images/kabely.png' },
    { id: 'folie', title: 'Fólie', image: 'images/folie.png' }
];

const CALCULATORS = {
    'mezikruzi': {
        title: 'Mezikruží',
        resultLabel: 'Hmotnost:',
        resultUnit: 'kg',
        showMaterialSelector: true,
        inputs: [
            { id: 'outer-diameter', label: 'Vnější průměr D [mm]', type: 'number' },
            { id: 'inner-diameter', label: 'Vnitřní průměr d [mm]', type: 'number' },
            { id: 'length', label: 'Délka L [mm]', type: 'number' }
        ],
        compute: (app) => {
            const D = app.readNumber('outer-diameter');
            const d = app.readNumber('inner-diameter');
            const L = app.readNumber('length');
            const density = app.getMaterialDensity();

            if (D <= 0 || d <= 0 || L <= 0 || d >= D) {
                return 0;
            }

            const area = (Math.PI * (D ** 2 - d ** 2)) / 4;
            const volume = area * L; // mm³
            const volumeM3 = volume / 1_000_000_000; // m³

            return volumeM3 * density;
        }
    },
    'trubka': {
        title: 'Trubka',
        resultLabel: 'Hmotnost:',
        resultUnit: 'kg',
        showMaterialSelector: true,
        inputs: [
            { id: 'outer-diameter', label: 'Vnější průměr D [mm]', type: 'number' },
            { id: 'wall-thickness', label: 'Tloušťka stěny S [mm]', type: 'number' },
            { id: 'length', label: 'Délka L [mm]', type: 'number' }
        ],
        compute: (app) => {
            const D = app.readNumber('outer-diameter');
            const S = app.readNumber('wall-thickness');
            const L = app.readNumber('length');
            const density = app.getMaterialDensity();

            if (D <= 0 || S <= 0 || L <= 0 || S >= D / 2) {
                return 0;
            }

            const outerArea = Math.PI * (D / 2) ** 2;
            const innerArea = Math.PI * ((D - 2 * S) / 2) ** 2;
            const materialArea = outerArea - innerArea;
            const volume = materialArea * L;
            const volumeM3 = volume / 1_000_000_000;

            return volumeM3 * density;
        }
    },
    'hranol': {
        title: 'Hranol',
        resultLabel: 'Hmotnost:',
        resultUnit: 'kg',
        showMaterialSelector: true,
        inputs: [
            { id: 'width', label: 'Šířka S [mm]', type: 'number' },
            { id: 'height', label: 'Výška V [mm]', type: 'number' },
            { id: 'length', label: 'Délka L [mm]', type: 'number' }
        ],
        compute: (app) => {
            const width = app.readNumber('width');
            const height = app.readNumber('height');
            const length = app.readNumber('length');
            const density = app.getMaterialDensity();

            if (width <= 0 || height <= 0 || length <= 0) {
                return 0;
            }

            const area = width * height;
            const volume = area * length;
            const volumeM3 = volume / 1_000_000_000;

            return volumeM3 * density;
        }
    },
    'valec': {
        title: 'Válec',
        resultLabel: 'Hmotnost:',
        resultUnit: 'kg',
        showMaterialSelector: true,
        inputs: [
            { id: 'diameter', label: 'Průměr D [mm]', type: 'number' },
            { id: 'length', label: 'Délka L [mm]', type: 'number' }
        ],
        compute: (app) => {
            const diameter = app.readNumber('diameter');
            const length = app.readNumber('length');
            const density = app.getMaterialDensity();

            if (diameter <= 0 || length <= 0) {
                return 0;
            }

            const area = Math.PI * (diameter / 2) ** 2;
            const volume = area * length;
            const volumeM3 = volume / 1_000_000_000;

            return volumeM3 * density;
        }
    },
    'jakl': {
        title: 'Jakl (čtvercový/obdélníkový profil)',
        resultLabel: 'Hmotnost:',
        resultUnit: 'kg',
        showMaterialSelector: true,
        inputs: [
            { id: 'width', label: 'Šířka A [mm]', type: 'number' },
            { id: 'height', label: 'Výška B [mm]', type: 'number' },
            { id: 'wall-thickness', label: 'Tloušťka stěny T [mm]', type: 'number' },
            { id: 'length', label: 'Délka L [mm]', type: 'number' }
        ],
        compute: (app) => {
            const width = app.readNumber('width');
            const height = app.readNumber('height');
            const thickness = app.readNumber('wall-thickness');
            const length = app.readNumber('length');
            const density = app.getMaterialDensity();

            if (
                width <= 0 ||
                height <= 0 ||
                thickness <= 0 ||
                length <= 0 ||
                thickness >= width / 2 ||
                thickness >= height / 2
            ) {
                return 0;
            }

            const outerArea = width * height;
            const innerArea = (width - 2 * thickness) * (height - 2 * thickness);
            const materialArea = outerArea - innerArea;
            const volume = materialArea * length;
            const volumeM3 = volume / 1_000_000_000;

            return volumeM3 * density;
        }
    },
    'profil-l': {
        title: 'Profil L',
        resultLabel: 'Hmotnost:',
        resultUnit: 'kg',
        showMaterialSelector: true,
        inputs: [
            { id: 'width', label: 'Šířka A [mm]', type: 'number' },
            { id: 'height', label: 'Výška B [mm]', type: 'number' },
            { id: 'wall-thickness', label: 'Tloušťka stěny T [mm]', type: 'number' },
            { id: 'length', label: 'Délka L [mm]', type: 'number' }
        ],
        compute: (app) => {
            const width = app.readNumber('width');
            const height = app.readNumber('height');
            const thickness = app.readNumber('wall-thickness');
            const length = app.readNumber('length');
            const density = app.getMaterialDensity();

            if (width <= 0 || height <= 0 || thickness <= 0 || length <= 0) {
                return 0;
            }

            const area = width * thickness + (height - thickness) * thickness;
            const volume = area * length;
            const volumeM3 = volume / 1_000_000_000;

            return volumeM3 * density;
        }
    },
    'plochace': {
        title: 'Plocháče',
        resultLabel: 'Hmotnost:',
        resultUnit: 'kg',
        showMaterialSelector: true,
        inputs: [
            { id: 'width', label: 'Šířka [mm]', type: 'number' },
            { id: 'thickness', label: 'Tloušťka [mm]', type: 'number' },
            { id: 'length', label: 'Délka [mm]', type: 'number' }
        ],
        compute: (app) => {
            const width = app.readNumber('width');
            const thickness = app.readNumber('thickness');
            const length = app.readNumber('length');
            const density = app.getMaterialDensity();

            if (width <= 0 || thickness <= 0 || length <= 0) {
                return 0;
            }

            const area = width * thickness;
            const volume = area * length;
            const volumeM3 = volume / 1_000_000_000;

            return volumeM3 * density;
        }
    },
    'profil-iu': {
        title: 'Profil I+U',
        resultLabel: 'Hmotnost:',
        resultUnit: 'kg',
        showMaterialSelector: true,
        inputs: [
            {
                id: 'profile-type',
                label: 'Typ profilu',
                type: 'select',
                options: ['HEA', 'HEA-S', 'IPE', 'IPE-S', 'U', 'U-S']
            },
            { id: 'profile-height', label: 'Výška H [mm]', type: 'number' },
            { id: 'length', label: 'Délka L [mm]', type: 'number' }
        ],
        compute: async (app) => {
            const profileType = app.readValue('profile-type');
            const height = app.readNumber('profile-height');
            const length = app.readNumber('length');

            if (!profileType || height <= 0 || length <= 0) {
                return 0;
            }

            const profiles = await app.loadProfileData();
            const profile = profiles.find((item) => item.Typ === profileType && Number(item.Rozmer) === Number(height));

            if (!profile) {
                console.warn(`Nenalezen profil: ${profileType} ${height}`);
                return 0;
            }

            const lengthM = length / 1000;
            return profile.Hmotnost_m * lengthM;
        }
    },
    'kabely': {
        title: 'Kabely',
        resultLabel: 'Délka:',
        resultUnit: 'm',
        showMaterialSelector: false,
        inputs: [
            { id: 'spool-diameter', label: 'Průměr špule D [mm]', type: 'number' },
            { id: 'turns-count', label: 'Počet závitů kabelu', type: 'number' }
        ],
        format: (value) => `${value.toFixed(3)} m`,
        compute: (app) => {
            const spoolDiameter = app.readNumber('spool-diameter');
            const turns = app.readNumber('turns-count');

            if (spoolDiameter <= 0 || turns <= 0) {
                return 0;
            }

            return (spoolDiameter * Math.PI * turns) / 1000;
        }
    },
    'folie': {
        title: 'Fólie',
        resultLabel: 'Plocha:',
        resultUnit: 'm²',
        showMaterialSelector: false,
        inputs: [
            { id: 'roll-diameter', label: 'Průměr role D [mm]', type: 'number' },
            { id: 'spool-diameter', label: 'Průměr špule d [mm]', type: 'number' },
            { id: 'roll-length', label: 'Délka role l [mm]', type: 'number' },
            { id: 'material-thickness', label: 'Síla materiálu [mm]', type: 'number' }
        ],
        format: (value) => `${value.toFixed(3)} m²`,
        compute: (app) => {
            const rollDiameter = app.readNumber('roll-diameter');
            const spoolDiameter = app.readNumber('spool-diameter');
            const rollLength = app.readNumber('roll-length');
            const thickness = app.readNumber('material-thickness');

            if (
                rollDiameter <= 0 ||
                spoolDiameter <= 0 ||
                rollLength <= 0 ||
                thickness <= 0 ||
                spoolDiameter >= rollDiameter
            ) {
                return 0;
            }

            const area = (
                (rollDiameter - (rollDiameter - spoolDiameter) / 2) *
                Math.PI *
                ((rollDiameter - spoolDiameter) / (2 * thickness)) *
                rollLength
            ) / 1_000_000_000;

            return area;
        }
    }
};

class MaterialCalculatorApp {
    constructor() {
        this.container = document.getElementById('app-container');
        this.currentView = 'home';
        this.profileData = null;

        this.calculate = this.calculate.bind(this);
        this.resetCalculator = this.resetCalculator.bind(this);
        this.takeScreenshot = this.takeScreenshot.bind(this);
        this.exportToEmail = this.exportToEmail.bind(this);

        this.setupRouter();
        this.loadInitialView();
    }

    setupRouter() {
        window.addEventListener('popstate', (event) => {
            const view = event.state?.view || 'home';
            this.loadView(view, false);
        });
    }

    loadInitialView() {
        const initialHash = window.location.hash.replace('#', '');
        if (initialHash && CALCULATORS[initialHash]) {
            this.loadView(initialHash, false);
        } else {
            this.loadView('home', false);
        }
    }

    loadView(viewName, pushState = true) {
        const view = CALCULATORS[viewName] ? viewName : 'home';
        if (pushState) {
            history.pushState({ view }, '', `#${view}`);
        }

        this.currentView = view;
        this.renderView(view);
    }

    renderView(viewName) {
        if (!this.container) {
            return;
        }

        if (viewName === 'home') {
            this.renderHome();
        } else {
            this.renderCalculator(viewName);
        }
    }

    renderHome() {
        const tilesHTML = CALCULATOR_TILES.map((tile) => `
            <div class="tile" role="button" tabindex="0" data-target="${tile.id}"
                 aria-label="Otevřít kalkulačku ${tile.title}">
                <div class="tile-image">
                    <img src="${tile.image}" alt="${tile.title}">
                </div>
                <div class="tile-title">${tile.title}</div>
            </div>
        `).join('');

        this.container.innerHTML = `
            <div class="home-view">
                <div class="tiles-grid">
                    ${tilesHTML}
                </div>
            </div>
        `;

        this.container.querySelectorAll('.tile').forEach((tileElement) => {
            tileElement.addEventListener('click', () => {
                const target = tileElement.getAttribute('data-target');
                this.loadView(target);
            });

            tileElement.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar' || event.key === 'Space') {
                    event.preventDefault();
                    const target = tileElement.getAttribute('data-target');
                    this.loadView(target);
                }
            });
        });
    }

    renderCalculator(type) {
        const config = CALCULATORS[type];

        if (!config) {
            this.renderHome();
            return;
        }

        const materialSelectorHTML = config.showMaterialSelector !== false
            ? this.renderMaterialSelector()
            : '';

        const inputsHTML = config.inputs.map((input) => this.renderInput(input)).join('');
        const initialResult = typeof config.format === 'function'
            ? config.format(0)
            : this.formatNumber(0, config.resultUnit || 'kg');

        this.container.innerHTML = `
            <div class="calculator-view" data-calculator="${type}">
                <div class="calculator-header">
                    <button type="button" class="btn btn-secondary back-btn">← Zpět</button>
                    <h2>${config.title}</h2>
                    <button type="button" class="btn btn-primary reset-btn">Resetovat</button>
                </div>
                ${materialSelectorHTML}
                <form class="calculator-form" novalidate>
                    ${inputsHTML}
                </form>
                <div class="calculator-results" role="status" aria-live="polite">
                    <div class="result-item">
                        <label>${config.resultLabel || 'Hmotnost:'}</label>
                        <span id="result-weight">${initialResult}</span>
                    </div>
                </div>
                <div class="calculator-actions">
                    <button type="button" class="btn btn-primary screenshot-btn">
                        <span class="btn-icon" aria-hidden="true">📷</span>
                        <span>Snímek obrazovky</span>
                    </button>
                    <button type="button" class="btn btn-primary export-btn">
                        <span class="btn-icon" aria-hidden="true">📧</span>
                        <span>Uložit do e-mailu</span>
                    </button>
                </div>
            </div>
        `;

        this.attachCalculatorEvents(config);
        this.calculate();
    }

    renderMaterialSelector() {
        const options = Object.entries(MATERIAL_LABELS).map(([value, label]) => `
            <option value="${value}" ${value === DEFAULT_MATERIAL ? 'selected' : ''}>${label}</option>
        `).join('');

        return `
            <section class="material-selector">
                <label for="material-select">Materiál:</label>
                <select id="material-select" name="material-select">
                    ${options}
                </select>
                <div id="material-density" class="material-density"></div>
            </section>
        `;
    }

    renderInput(input) {
        if (input.type === 'select') {
            const options = (input.options || []).map((option) => `
                <option value="${option}">${option}</option>
            `).join('');

            return `
                <div class="input-group">
                    <label for="${input.id}">${input.label}</label>
                    <select id="${input.id}" name="${input.id}">
                        <option value="">Vyberte...</option>
                        ${options}
                    </select>
                </div>
            `;
        }

        return `
            <div class="input-group">
                <label for="${input.id}">${input.label}</label>
                <input
                    id="${input.id}"
                    name="${input.id}"
                    type="${input.type || 'number'}"
                    inputmode="decimal"
                    min="0"
                    step="0.01"
                    value="0"
                    autocomplete="off"
                />
            </div>
        `;
    }

    attachCalculatorEvents(config) {
        const backButton = this.container.querySelector('.back-btn');
        const resetButton = this.container.querySelector('.reset-btn');
        const screenshotButton = this.container.querySelector('.screenshot-btn');
        const exportButton = this.container.querySelector('.export-btn');
        const form = this.container.querySelector('.calculator-form');

        backButton?.addEventListener('click', () => this.loadView('home'));
        resetButton?.addEventListener('click', this.resetCalculator);
        screenshotButton?.addEventListener('click', this.takeScreenshot);
        exportButton?.addEventListener('click', this.exportToEmail);

        form?.querySelectorAll('input').forEach((input) => {
            input.addEventListener('input', this.calculate);
        });

        form?.querySelectorAll('select').forEach((select) => {
            select.addEventListener('change', this.calculate);
        });

        if (config.showMaterialSelector !== false) {
            const materialSelect = this.container.querySelector('#material-select');
            if (materialSelect) {
                materialSelect.addEventListener('change', (event) => {
                    const value = event.target.value || DEFAULT_MATERIAL;
                    this.updateMaterialDensity(value, false);
                    this.calculate();
                });
                this.updateMaterialDensity(materialSelect.value || DEFAULT_MATERIAL, false);
            }
        }
    }

    readNumber(id) {
        const element = document.getElementById(id);
        if (!element) {
            return 0;
        }

        const normalizedValue = element.value.replace(',', '.');
        const number = parseFloat(normalizedValue);
        return Number.isFinite(number) ? number : 0;
    }

    readValue(id) {
        const element = document.getElementById(id);
        return element ? element.value : '';
    }

    getMaterialDensity() {
        const material = this.getSelectedMaterial();
        return MATERIAL_DENSITIES[material] || MATERIAL_DENSITIES[DEFAULT_MATERIAL];
    }

    getSelectedMaterial() {
        const select = document.getElementById('material-select');
        const value = select?.value || DEFAULT_MATERIAL;
        return MATERIAL_DENSITIES[value] ? value : DEFAULT_MATERIAL;
    }

    updateMaterialDensity(materialKey, shouldRecalculate = true) {
        const densityElement = document.getElementById('material-density');
        const safeKey = MATERIAL_DENSITIES[materialKey] ? materialKey : DEFAULT_MATERIAL;
        const density = MATERIAL_DENSITIES[safeKey];

        if (densityElement) {
            densityElement.innerHTML = `<strong>Hustota:</strong> ${density} kg/m³`;
        }

        const materialSelect = document.getElementById('material-select');
        if (materialSelect) {
            materialSelect.value = safeKey;
        }

        if (shouldRecalculate) {
            this.calculate();
        }
    }

    formatNumber(value, unit) {
        return `${value.toFixed(3)} ${unit}`;
    }

    async calculate() {
        const config = CALCULATORS[this.currentView];
        const resultElement = document.getElementById('result-weight');

        if (!config || !resultElement) {
            return;
        }

        try {
            const rawValue = await Promise.resolve(config.compute(this));
            const numericValue = Number.isFinite(rawValue) ? rawValue : 0;
            const safeValue = Math.max(0, numericValue);

            resultElement.textContent = typeof config.format === 'function'
                ? config.format(safeValue)
                : this.formatNumber(safeValue, config.resultUnit || 'kg');
        } catch (error) {
            console.error('Chyba při výpočtu:', error);
            resultElement.textContent = typeof config.format === 'function'
                ? config.format(0)
                : this.formatNumber(0, config.resultUnit || 'kg');
        }
    }

    resetCalculator() {
        const form = this.container.querySelector('.calculator-form');
        if (!form) {
            return;
        }

        form.querySelectorAll('input').forEach((input) => {
            if (input.type === 'number' || input.getAttribute('type') === 'number') {
                input.value = '0';
            } else {
                input.value = '';
            }
        });

        form.querySelectorAll('select').forEach((select) => {
            select.selectedIndex = 0;
        });

        const materialSelect = this.container.querySelector('#material-select');
        if (materialSelect) {
            materialSelect.value = DEFAULT_MATERIAL;
            this.updateMaterialDensity(DEFAULT_MATERIAL, false);
            this.calculate();
        } else {
            this.calculate();
        }
    }

    async loadProfileData() {
        if (this.profileData) {
            return this.profileData;
        }

        try {
            const response = await fetch('./profil-data.json');
            if (!response.ok) {
                throw new Error('Nepodařilo se načíst data profilu.');
            }

            this.profileData = await response.json();
            return this.profileData;
        } catch (error) {
            console.error('Chyba při načítání dat profilů:', error);
            return [];
        }
    }

    async takeScreenshot() {
        try {
            const calculatorView = this.container.querySelector('.calculator-view');
            if (!calculatorView) {
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 860;
            canvas.height = 620;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#000000';
            ctx.font = '24px Segoe UI';
            ctx.fillText('Kalkulátor hmotnosti materiálů', 24, 48);

            const title = calculatorView.querySelector('h2')?.textContent || '';
            ctx.font = '20px Segoe UI';
            ctx.fillText(title, 24, 90);

            let y = 130;
            calculatorView.querySelectorAll('.input-group').forEach((group) => {
                const label = group.querySelector('label')?.textContent ?? '';
                const input = group.querySelector('input, select');
                const value = input?.value ?? '';
                ctx.font = '16px Segoe UI';
                ctx.fillText(`${label}: ${value}`, 24, y);
                y += 30;
            });

            const result = calculatorView.querySelector('#result-weight')?.textContent ?? '';
            ctx.font = '18px Segoe UI';
            ctx.fillStyle = '#5f8f11';
            ctx.fillText(`Výsledek: ${result}`, 24, y + 20);

            canvas.toBlob((blob) => {
                if (!blob) {
                    return;
                }

                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `kalkulator-${this.currentView}-${new Date().toISOString().slice(0, 10)}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
        } catch (error) {
            console.error('Chyba při vytváření snímku obrazovky:', error);
            alert('Chyba při vytváření snímku obrazovky.');
        }
    }

    exportToEmail() {
        try {
            const config = CALCULATORS[this.currentView];
            if (!config) {
                return;
            }

            const calculatorData = {
                type: this.currentView,
                title: config.title,
                timestamp: new Date().toISOString(),
                inputs: {},
                result: document.getElementById('result-weight')?.textContent ?? ''
            };

            const form = this.container.querySelector('.calculator-form');
            form?.querySelectorAll('input, select').forEach((field) => {
                const label = field.previousElementSibling?.textContent || field.id;
                calculatorData.inputs[field.id] = {
                    label,
                    value: field.value
                };
            });

            const materialSelect = document.getElementById('material-select');
            if (materialSelect) {
                calculatorData.material = {
                    value: materialSelect.value,
                    label: MATERIAL_LABELS[materialSelect.value] || materialSelect.value
                };
            }

            const jsonData = JSON.stringify(calculatorData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `kalkulator-vysledky-${this.currentView}-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            const subject = encodeURIComponent('Výsledky výpočtu z aplikace Kalkulátor hmotnosti materiálů');
            const body = encodeURIComponent(`Dobrý den,

přikládám výsledky výpočtu z aplikace Kalkulátor hmotnosti materiálů.

Typ výpočtu: ${config.title}
Výsledek: ${calculatorData.result}
Datum: ${new Date().toLocaleDateString('cs-CZ')}

S pozdravem`);

            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        } catch (error) {
            console.error('Chyba při exportu dat:', error);
            alert('Chyba při exportu dat.');
        }
    }
}

