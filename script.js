const MATERIAL_DENSITIES = {
    'ocel-tazena': 7850,
    'litina-seda': 7250,
    'litina-temperovana': 7400,
    'dynamoplech-m350': 7650,
    'dynamoplech-m400-530': 7700,
    'dynamoplech-m600-800': 7800,
    'ocel-rychlorezna': 8500,
    'mosaz': 8600,
    'med': 8900,
    'bronz': 8700,
    'hlinik': 2700,
    'pvc': 1700,
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
            const volume = area * L;
            const volumeM3 = volume / 1_000_000_000;

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

            if (
                width <= 0 ||
                height <= 0 ||
                thickness <= 0 ||
                length <= 0 ||
                thickness >= Math.min(width, height)
            ) {
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
        dataSource: 'plochace-data.json',
        customRender: async (app, config) => app.renderFlatBarCalculatorsFromData(config)
    },
    'profil-iu': {
        title: 'Profil I+U',
        resultLabel: 'Hmotnost:',
        resultUnit: 'kg',
        showMaterialSelector: false,
        inputs: [
            {
                id: 'profile-type',
                label: 'Typ profilu',
                type: 'select',
                options: []
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
            { id: 'roll-width', label: 'Šířka role b [mm]', type: 'number' },
            { id: 'material-thickness', label: 'Síla materiálu [mm]', type: 'number' }
        ],
        compute: (app) => {
            const rollDiameter = app.readNumber('roll-diameter');
            const spoolDiameter = app.readNumber('spool-diameter');
            const rollWidth = app.readNumber('roll-width');
            const thickness = app.readNumber('material-thickness');

            if (
                rollDiameter <= 0 ||
                spoolDiameter <= 0 ||
                rollWidth <= 0 ||
                thickness <= 0 ||
                spoolDiameter >= rollDiameter
            ) {
                return 0;
            }

            const crossSectionArea = (Math.PI * (rollDiameter ** 2 - spoolDiameter ** 2)) / 4;
            const stripLengthMm = crossSectionArea / thickness;
            const stripLengthM = stripLengthMm / 1000;
            const stripWidthM = rollWidth / 1000;

            return stripLengthM * stripWidthM;
        }
    }
};

const FLATBAR_LENGTH_PI = 3.14;

class MaterialCalculatorApp {
    constructor() {
        this.container = document.getElementById('app-container');
        this.currentView = 'home';
        this.profileData = null;
        this.flatbarConfigCache = new Map();

        this.calculate = this.calculate.bind(this);
        this.resetCalculator = this.resetCalculator.bind(this);
        this.takeScreenshot = this.takeScreenshot.bind(this);
        this.exportToEmail = this.exportToEmail.bind(this);

        this.setupRouter();
        this.loadInitialView();
    }

    setupRouter() {
        window.addEventListener('popstate', (event) => {
            const state = event.state;
            const view = state && state.view ? state.view : 'home';
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
        if (typeof document !== 'undefined' && document.body && document.body.classList) {
            document.body.classList.add('home-background');
        }

        const logoHTML = `
            <figure class="home-logo">
                <img
                    alt="TES logo"
                    class="app-logo"
                    decoding="async"
                    data-logo-src="images/mainlogo.svg"
                    data-logo-fallbacks="images/mainlogo.png, images/mainlogo.webp, images/mainlogo.jpg, images/mainlogo.jpeg"
                >
            </figure>
        `;

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
                ${logoHTML}
                <div class="tiles-grid">
                    ${tilesHTML}
                </div>
            </div>
        `;

        initializeAppLogo(this.container.querySelector('.app-logo'));

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
        if (typeof document !== 'undefined' && document.body && document.body.classList) {
            document.body.classList.remove('home-background');
        }

        const config = CALCULATORS[type];

        if (!config) {
            this.renderHome();
            return;
        }

        if (typeof config.customRender === 'function') {
            config.customRender(this, config);
            return;
        }

        const materialSelectorHTML = config.showMaterialSelector !== false
            ? this.renderMaterialSelector()
            : '';

        const inputsHTML = config.inputs.map((input) => this.renderInput(input)).join('');
        const notesFieldHTML = this.renderNotesField();
        const initialResult = this.formatResult(0, config);

        this.container.innerHTML = `
            <div class="calculator-view" data-calculator="${type}">
                <div class="calculator-header">
                    <button type="button" class="btn btn-secondary back-btn">← Zpět</button>
                    <h2>${config.title}</h2>
                    <button type="button" class="btn btn-danger reset-btn">Resetovat</button>
                </div>
                ${materialSelectorHTML}
                <form class="calculator-form" novalidate>
                    ${inputsHTML}
                </form>
                ${notesFieldHTML}
                <div class="calculator-results" role="status" aria-live="polite">
                    <div class="result-item">
                        <label>${config.resultLabel || 'Hmotnost:'}</label>
                        <span id="result-weight">${initialResult}</span>
                    </div>
                </div>
                <div class="calculator-actions">
                    <button type="button" class="btn btn-primary calculate-btn">
                        <span class="btn-icon" aria-hidden="true">🧮</span>
                        <span>Vypočítej</span>
                    </button>
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

        if (type === 'profil-iu') {
            this.populateProfileTypeOptions().catch((error) => {
                console.error('Nepodařilo se připravit nabídku typů profilů:', error);
            });
        }
    }

    async renderFlatBarCalculatorsFromData(config) {
        if (!this.container) {
            return;
        }

        const title = config && typeof config.title === 'string' ? config.title : 'Plocháče';
        this.renderFlatbarStateView(title, 'Načítání konfigurace…', { stateClass: 'is-loading' });

        try {
            const data = await this.loadFlatbarConfig(config ? config.dataSource : null);
            const calculators = data.calculators;

            if (!Array.isArray(calculators) || calculators.length === 0) {
                this.renderFlatbarStateView(title, 'Konfiguraci kalkulaček se nepodařilo načíst.', {
                    stateClass: 'is-error',
                    onRetry: () => this.renderFlatBarCalculatorsFromData(config)
                });
                return;
            }

            this.renderFlatBarLengthCalculators({
                ...config,
                title: data.title || title,
                description: data.description,
                calculators
            });
        } catch (error) {
            console.error('Nepodařilo se načíst konfiguraci plocháčů:', error);
            this.renderFlatbarStateView(title, 'Nepodařilo se načíst konfiguraci plocháčů.', {
                stateClass: 'is-error',
                onRetry: () => this.renderFlatBarCalculatorsFromData(config)
            });
        }
    }

    async loadFlatbarConfig(source) {
        const cacheKey = typeof source === 'string' && source.trim() !== '' ? source.trim() : null;
        if (cacheKey && this.flatbarConfigCache.has(cacheKey)) {
            return this.flatbarConfigCache.get(cacheKey);
        }

        if (!cacheKey) {
            const emptyConfig = { title: '', description: '', calculators: [] };
            return emptyConfig;
        }

        const response = await fetch(cacheKey, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const normalized = this.normalizeFlatbarConfig(data);
        this.flatbarConfigCache.set(cacheKey, normalized);
        return normalized;
    }

    normalizeFlatbarConfig(data) {
        if (!data) {
            return { title: '', description: '', calculators: [] };
        }

        const calculators = Array.isArray(data.calculators)
            ? data.calculators
            : Array.isArray(data.sections)
                ? data.sections
                : Array.isArray(data)
                    ? data
                    : [];

        return {
            title: typeof data.title === 'string' ? data.title : '',
            description: typeof data.description === 'string' ? data.description : '',
            calculators
        };
    }

    renderFlatbarStateView(title, message, options = {}) {
        if (!this.container) {
            return;
        }

        const { stateClass = '', onRetry = null } = options;
        const retryButtonHTML = typeof onRetry === 'function'
            ? `<button type="button" class="btn btn-primary retry-btn">Zkusit znovu</button>`
            : '';

        this.container.innerHTML = `
            <div class="calculator-view calculator-view--flatbar" data-calculator="plochace">
                <div class="calculator-header">
                    <button type="button" class="btn btn-secondary back-btn">← Zpět</button>
                    <h2>${title}</h2>
                    <button type="button" class="btn btn-danger reset-btn" disabled>Resetovat</button>
                </div>
                <div class="flatbar-state ${stateClass}" role="status">
                    <p>${message}</p>
                    ${retryButtonHTML}
                </div>
            </div>
        `;

        const backButton = this.container.querySelector('.back-btn');
        if (backButton) {
            backButton.addEventListener('click', () => this.loadView('home'));
        }

        const retryButton = this.container.querySelector('.retry-btn');
        if (retryButton && typeof onRetry === 'function') {
            retryButton.addEventListener('click', () => onRetry());
        }
    }

    renderFlatBarLengthCalculators(config) {
        if (!this.container) {
            return;
        }

        const calculators = Array.isArray(config.calculators) ? config.calculators : [];
        const description = typeof config.description === 'string' && config.description.trim() !== ''
            ? `<p class="flatbar-description">${config.description}</p>`
            : '';
        const sectionsHTML = calculators.length > 0
            ? calculators.map((calculator) => this.buildFlatBarCalculatorMarkup(calculator)).join('')
            : '<p class="flatbar-empty">Konfigurace kalkulaček se nepodařilo načíst.</p>';
        const notesFieldHTML = this.renderNotesField();
        this.container.innerHTML = `
            <div class="calculator-view calculator-view--flatbar" data-calculator="plochace">
                <div class="calculator-header">
                    <button type="button" class="btn btn-secondary back-btn">← Zpět</button>
                    <h2>${config.title}</h2>
                    <button type="button" class="btn btn-danger reset-btn">Resetovat</button>
                </div>
                ${notesFieldHTML}
                <div class="flatbar-content">
                    ${description}
                    <div class="flatbar-calculators">
                        ${sectionsHTML}
                    </div>
                </div>
                <div class="calculator-actions">
                    <button type="button" class="btn btn-primary calculate-btn">
                        <span class="btn-icon" aria-hidden="true">🧮</span>
                        <span>Vypočítej</span>
                    </button>
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

        const backButton = this.container.querySelector('.back-btn');
        if (backButton) {
            backButton.addEventListener('click', () => this.loadView('home'));
        }

        const resetButton = this.container.querySelector('.reset-btn');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetFlatBarCalculators(calculators));
        }

        const recalculateCallbacks = this.setupFlatBarCalculatorEvents(calculators);

        const calculateButton = this.container.querySelector('.calculate-btn');
        if (calculateButton) {
            calculateButton.addEventListener('click', () => {
                recalculateCallbacks.forEach((callback) => {
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            });
        }

        const screenshotButton = this.container.querySelector('.screenshot-btn');
        if (screenshotButton) {
            screenshotButton.addEventListener('click', this.takeScreenshot);
        }

        const exportButton = this.container.querySelector('.export-btn');
        if (exportButton) {
            exportButton.addEventListener('click', this.exportToEmail);
        }
    }

    buildFlatBarCalculatorMarkup(calculator) {
        if (!calculator || !calculator.id) {
            return '';
        }

        const innerDiameterId = this.getFlatBarFieldId(calculator, 'inner-diameter');
        const thicknessId = this.getFlatBarFieldId(calculator, 'sheet-thickness');
        const resultId = this.getFlatBarFieldId(calculator, 'result');
        const diameterLabel = typeof calculator.diameterLabel === 'string'
            ? calculator.diameterLabel
            : 'Vnitřní průměr (mm)';
        const thicknessLabel = typeof calculator.thicknessLabel === 'string'
            ? calculator.thicknessLabel
            : 'Síla plechu (mm)';
        const diameterPlaceholder = typeof calculator.diameterPlaceholder === 'string'
            ? calculator.diameterPlaceholder
            : 'Zadejte hodnotu';
        const thicknessPlaceholder = typeof calculator.thicknessPlaceholder === 'string'
            ? calculator.thicknessPlaceholder
            : 'Zadejte hodnotu';
        const resultLabel = typeof calculator.resultLabel === 'string'
            ? calculator.resultLabel
            : 'Rozvinutá délka';
        const resultUnit = typeof calculator.resultUnit === 'string' && calculator.resultUnit.trim() !== ''
            ? calculator.resultUnit.trim()
            : 'mm';
        const description = typeof calculator.description === 'string' && calculator.description.trim() !== ''
            ? `<p class="flatbar-calculator__description">${calculator.description}</p>`
            : '';
        const diameterStep = this.getFlatbarNumericAttribute(calculator.innerDiameterStep, 0.01);
        const thicknessStep = this.getFlatbarNumericAttribute(calculator.thicknessStep, 0.01);
        const diameterMin = this.getFlatbarNumericAttribute(calculator.innerDiameterMin, 0);
        const thicknessMin = this.getFlatbarNumericAttribute(calculator.thicknessMin, 0);

        return `
            <section class="flatbar-calculator" data-flatbar="${calculator.id}">
                <header class="flatbar-calculator__header">
                    <h3>${calculator.title}</h3>
                    ${description}
                </header>
                <div class="flatbar-calculator__body">
                    <div class="flatbar-field">
                        <label class="flatbar-field__label" for="${innerDiameterId}">${diameterLabel}</label>
                        <input
                            id="${innerDiameterId}"
                            name="${innerDiameterId}"
                            class="flatbar-field__input"
                            type="number"
                            inputmode="decimal"
                            min="${diameterMin}"
                            step="${diameterStep}"
                            autocomplete="off"
                            placeholder="${diameterPlaceholder}"
                        />
                    </div>
                    <div class="flatbar-field">
                        <label class="flatbar-field__label" for="${thicknessId}">${thicknessLabel}</label>
                        <input
                            id="${thicknessId}"
                            name="${thicknessId}"
                            class="flatbar-field__input"
                            type="number"
                            inputmode="decimal"
                            min="${thicknessMin}"
                            step="${thicknessStep}"
                            autocomplete="off"
                            placeholder="${thicknessPlaceholder}"
                        />
                    </div>
                </div>
                <footer class="flatbar-calculator__result flatbar-result-card" role="status" aria-live="polite">
                    <span class="flatbar-result-label">${resultLabel}</span>
                    <span id="${resultId}" class="flatbar-result-value">— ${resultUnit}</span>
                </footer>
            </section>
        `;
    }

    setupFlatBarCalculatorEvents(calculators) {
        if (!Array.isArray(calculators)) {
            return [];
        }

        const recalculateCallbacks = [];

        calculators.forEach((calculator) => {
            const innerDiameterId = this.getFlatBarFieldId(calculator, 'inner-diameter');
            const thicknessId = this.getFlatBarFieldId(calculator, 'sheet-thickness');
            const resultId = this.getFlatBarFieldId(calculator, 'result');

            const diameterInput = document.getElementById(innerDiameterId);
            const thicknessInput = document.getElementById(thicknessId);
            const resultElement = document.getElementById(resultId);

            if (!diameterInput || !thicknessInput || !resultElement) {
                return;
            }

            const resultUnit = typeof calculator.resultUnit === 'string' && calculator.resultUnit.trim() !== ''
                ? calculator.resultUnit.trim()
                : 'mm';
            const pendingText = `— ${resultUnit}`;
            resultElement.textContent = pendingText;
            resultElement.dataset.pending = 'true';

            const markPending = () => {
                resultElement.textContent = pendingText;
                resultElement.dataset.pending = 'true';
            };

            const computeLength = () => {
                const diameterRaw = diameterInput.value;
                const thicknessRaw = thicknessInput.value;

                if (!this.hasInputValue(diameterRaw) || !this.hasInputValue(thicknessRaw)) {
                    resultElement.textContent = `0 ${resultUnit}`;
                    resultElement.dataset.pending = 'false';
                    return;
                }

                const diameterValue = this.parseDecimalValue(diameterRaw);
                const thicknessValue = this.parseDecimalValue(thicknessRaw);

                if (!Number.isFinite(diameterValue) || !Number.isFinite(thicknessValue)) {
                    resultElement.textContent = `0 ${resultUnit}`;
                    resultElement.dataset.pending = 'false';
                    return;
                }

                const piFactor = this.getFlatbarNumber(calculator.piFactor, FLATBAR_LENGTH_PI);
                const thicknessMultiplier = this.getFlatbarNumber(calculator.thicknessMultiplier, 3);
                const adjustment = this.getFlatbarNumber(calculator.adjustment, 0);
                const decimals = Math.max(0, this.getFlatbarInteger(calculator.decimals, 0));
                const roundingMode = typeof calculator.rounding === 'string'
                    ? calculator.rounding.toLowerCase()
                    : 'round';
                const roundingFunction = roundingMode === 'floor'
                    ? Math.floor
                    : roundingMode === 'ceil'
                        ? Math.ceil
                        : Math.round;

                const computed = (diameterValue * piFactor) + (thicknessValue * thicknessMultiplier) + adjustment;
                const factor = 10 ** decimals;
                const rounded = Number.isFinite(computed)
                    ? roundingFunction(computed * factor) / factor
                    : Number.NaN;
                const formatted = Number.isFinite(rounded)
                    ? new Intl.NumberFormat('cs-CZ', {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals
                    }).format(rounded)
                    : '0';

                resultElement.textContent = `${formatted} ${resultUnit}`;
                resultElement.dataset.pending = 'false';
            };

            const autoCalculate = calculator.autoCalculate === true || calculator.calculateOnInput === true;
            const inputHandler = autoCalculate ? computeLength : markPending;

            ['input', 'change'].forEach((eventName) => {
                diameterInput.addEventListener(eventName, inputHandler);
                thicknessInput.addEventListener(eventName, inputHandler);
            });

            recalculateCallbacks.push(computeLength);
        });

        return recalculateCallbacks;
    }

    resetFlatBarCalculators(calculators) {
        if (!Array.isArray(calculators)) {
            return;
        }

        const notesField = this.container ? this.container.querySelector('#calculator-notes') : null;
        if (notesField) {
            notesField.value = '';
        }

        calculators.forEach((calculator) => {
            const innerDiameterId = this.getFlatBarFieldId(calculator, 'inner-diameter');
            const thicknessId = this.getFlatBarFieldId(calculator, 'sheet-thickness');
            const resultId = this.getFlatBarFieldId(calculator, 'result');

            const diameterInput = document.getElementById(innerDiameterId);
            const thicknessInput = document.getElementById(thicknessId);
            const resultElement = document.getElementById(resultId);

            if (diameterInput) {
                diameterInput.value = '';
                this.emitInputEvent(diameterInput);
            }

            if (thicknessInput) {
                thicknessInput.value = '';
                this.emitInputEvent(thicknessInput);
            }

            if (resultElement) {
                const resultUnit = typeof calculator.resultUnit === 'string' && calculator.resultUnit.trim() !== ''
                    ? calculator.resultUnit.trim()
                    : 'mm';
                resultElement.textContent = `— ${resultUnit}`;
                resultElement.dataset.pending = 'true';
            }
        });
    }

    getFlatbarNumericAttribute(value, fallback) {
        const resolvedFallback = typeof fallback === 'number' ? fallback : 0;
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value.toString();
        }

        if (typeof value === 'string') {
            const normalized = value.trim().replace(',', '.');
            if (normalized !== '') {
                const parsed = Number.parseFloat(normalized);
                if (Number.isFinite(parsed)) {
                    return parsed.toString();
                }
            }
        }

        return resolvedFallback.toString();
    }

    getFlatbarNumber(value, fallback = 0) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }

        if (typeof value === 'string') {
            const normalized = value.trim().replace(',', '.');
            if (normalized !== '') {
                const parsed = Number.parseFloat(normalized);
                if (Number.isFinite(parsed)) {
                    return parsed;
                }
            }
        }

        return fallback;
    }

    getFlatbarInteger(value, fallback = 0) {
        if (Number.isInteger(value)) {
            return value;
        }

        if (typeof value === 'string') {
            const normalized = value.trim();
            if (normalized !== '') {
                const parsed = Number.parseInt(normalized, 10);
                if (Number.isFinite(parsed)) {
                    return parsed;
                }
            }
        }

        return fallback;
    }

    parseDecimalValue(value) {
        if (typeof value !== 'string') {
            return NaN;
        }

        const normalizedValue = value.trim().replace(',', '.');
        if (normalizedValue === '') {
            return NaN;
        }

        const parsed = Number.parseFloat(normalizedValue);
        return Number.isFinite(parsed) ? parsed : NaN;
    }

    hasInputValue(value) {
        return typeof value === 'string' && value.trim() !== '';
    }

    getFlatBarFieldId(calculator, field) {
        const baseId = calculator && calculator.id ? calculator.id : 'flatbar';
        return `${baseId}-${field}`;
    }

    emitInputEvent(element) {
        if (!element || typeof element.dispatchEvent !== 'function') {
            return;
        }

        try {
            if (typeof Event === 'function') {
                element.dispatchEvent(new Event('input', { bubbles: true }));
                return;
            }

            if (typeof document !== 'undefined' && typeof document.createEvent === 'function') {
                const event = document.createEvent('Event');
                event.initEvent('input', true, true);
                element.dispatchEvent(event);
            }
        } catch (error) {
            console.warn('Chyba při odeslání události input:', error);
        }
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

    renderNotesField() {
        return `
            <section class="calculator-notes">
                <label for="calculator-notes">Poznámky</label>
                <textarea
                    id="calculator-notes"
                    name="calculator-notes"
                    rows="4"
                    placeholder="Zapište si, co právě počítáte, poznámky k zakázce apod."
                ></textarea>
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
                    autocomplete="off"
                />
            </div>
        `;
    }

    attachCalculatorEvents(config) {
        const backButton = this.container.querySelector('.back-btn');
        const calculateButton = this.container.querySelector('.calculate-btn');
        const resetButton = this.container.querySelector('.reset-btn');
        const screenshotButton = this.container.querySelector('.screenshot-btn');
        const exportButton = this.container.querySelector('.export-btn');
        const form = this.container.querySelector('.calculator-form');

        if (backButton) {
            backButton.addEventListener('click', () => this.loadView('home'));
        }

        if (calculateButton) {
            calculateButton.addEventListener('click', this.calculate);
        }

        if (resetButton) {
            resetButton.addEventListener('click', this.resetCalculator);
        }

        if (screenshotButton) {
            screenshotButton.addEventListener('click', this.takeScreenshot);
        }

        if (exportButton) {
            exportButton.addEventListener('click', this.exportToEmail);
        }

        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                this.calculate();
            });
        }

        if (config.showMaterialSelector !== false) {
            const materialSelect = this.container.querySelector('#material-select');
            if (materialSelect) {
                materialSelect.addEventListener('change', (event) => {
                    const value = event.target.value || DEFAULT_MATERIAL;
                    this.updateMaterialDensity(value, false);
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
        const value = select && select.value ? select.value : DEFAULT_MATERIAL;
        return MATERIAL_DENSITIES[value] ? value : DEFAULT_MATERIAL;
    }

    updateMaterialDensity(materialKey, shouldRecalculate = false) {
        const densityElement = document.getElementById('material-density');
        const safeKey = MATERIAL_DENSITIES[materialKey] ? materialKey : DEFAULT_MATERIAL;
        const density = MATERIAL_DENSITIES[safeKey];

        if (densityElement) {
            const formattedDensity = new Intl.NumberFormat('cs-CZ').format(density);
            densityElement.innerHTML = `<strong>Hustota:</strong> ${formattedDensity} kg/m³`;
        }

        const materialSelect = document.getElementById('material-select');
        if (materialSelect) {
            materialSelect.value = safeKey;
        }

        if (shouldRecalculate) {
            this.calculate();
        }
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

            resultElement.textContent = this.formatResult(safeValue, config);
        } catch (error) {
            console.error('Chyba při výpočtu:', error);
            resultElement.textContent = this.formatResult(0, config);
        }
    }

    resetCalculator() {
        const form = this.container.querySelector('.calculator-form');
        const config = CALCULATORS[this.currentView];
        if (!form || !config) {
            return;
        }

        form.querySelectorAll('input').forEach((input) => {
            if (input.type === 'number' || input.getAttribute('type') === 'number') {
                input.value = '';
            } else {
                input.value = '';
            }
        });

        form.querySelectorAll('select').forEach((select) => {
            select.selectedIndex = 0;
        });
        const notesField = this.container.querySelector('#calculator-notes');
        if (notesField) {
            notesField.value = '';
        }

        const materialSelect = this.container.querySelector('#material-select');
        if (materialSelect) {
            materialSelect.value = DEFAULT_MATERIAL;
            this.updateMaterialDensity(DEFAULT_MATERIAL, false);
        }

        const resultElement = document.getElementById('result-weight');
        if (resultElement) {
            resultElement.textContent = this.formatResult(0, config);
        }
    }

    formatResult(value, config) {
        if (config && typeof config.format === 'function') {
            try {
                return config.format(value, this);
            } catch (error) {
                console.error('Chyba formátování výsledku:', error);
            }
        }

        const unit = config && config.resultUnit ? config.resultUnit : 'kg';
        return this.formatNumber(value, unit);
    }

    formatNumber(value, unit) {
        const absValue = Math.abs(value);

        if (unit === 'kg' && absValue > 0 && absValue < 0.001) {
            const grams = absValue * 1000;
            const precision = grams >= 1 ? 3 : 4;
            const formattedGrams = this.formatWithPrecision(grams, precision);
            return `${formattedGrams} g`;
        }

        const formatted = this.formatWithPrecision(absValue, 3);
        return `${formatted} ${unit}`;
    }

    formatWithPrecision(value, initialPrecision) {
        if (!Number.isFinite(value)) {
            return '0,000';
        }

        const basePrecision = Math.max(0, Number(initialPrecision) || 0);
        const maxPrecision = Math.max(basePrecision, 6);

        let decimals = basePrecision;
        let formattedNumber = Number(value.toFixed(decimals));

        while (value !== 0 && formattedNumber === 0 && decimals < maxPrecision) {
            decimals += 1;
            formattedNumber = Number(value.toFixed(decimals));
        }

        return new Intl.NumberFormat('cs-CZ', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(formattedNumber);
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

    async getAvailableProfileTypes() {
        const profiles = await this.loadProfileData();
        if (!Array.isArray(profiles) || profiles.length === 0) {
            return [];
        }

        const typeSet = new Set();
        profiles.forEach((profile) => {
            if (profile && typeof profile.Typ === 'string') {
                const trimmed = profile.Typ.trim();
                if (trimmed !== '') {
                    typeSet.add(trimmed);
                }
            }
        });

        return Array.from(typeSet).sort((a, b) => a.localeCompare(b, 'cs'));
    }

    async populateProfileTypeOptions() {
        const select = this.container ? this.container.querySelector('#profile-type') : null;
        if (!select) {
            return;
        }

        const placeholderOption = '<option value="">Vyberte...</option>';
        select.innerHTML = `${placeholderOption}<option value="" disabled>Načítání…</option>`;

        try {
            const types = await this.getAvailableProfileTypes();

            if (this.currentView !== 'profil-iu') {
                return;
            }

            if (!Array.isArray(types) || types.length === 0) {
                select.innerHTML = `${placeholderOption}<option value="" disabled>Data nejsou k dispozici</option>`;
                return;
            }

            const optionsHTML = types.map((type) => `<option value="${type}">${type}</option>`).join('');
            select.innerHTML = `${placeholderOption}${optionsHTML}`;
        } catch (error) {
            select.innerHTML = `${placeholderOption}<option value="" disabled>Nepodařilo se načíst</option>`;
            throw error;
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

            const titleElement = calculatorView.querySelector('h2');
            const title = titleElement && titleElement.textContent ? titleElement.textContent : '';
            ctx.font = '20px Segoe UI';
            ctx.fillText(title, 24, 90);
            const isFlatbarView = this.currentView === 'plochace';
            let y = 130;
                        if (isFlatbarView) {
                calculatorView.querySelectorAll('.flatbar-calculator').forEach((section) => {
                    const titleElement = section.querySelector('.flatbar-calculator__header h3');
                    const titleText = titleElement && titleElement.textContent ? titleElement.textContent.trim() : '';
                    const resultLabelElement = section.querySelector('.flatbar-result-label');
                    const resultLabelText = resultLabelElement && resultLabelElement.textContent
                        ? resultLabelElement.textContent.trim()
                        : 'Výsledek';

                    if (titleText) {
                        ctx.font = '18px Segoe UI';
                        ctx.fillStyle = '#000000';
                        ctx.fillText(titleText, 24, y);
                        y += 28;
                    }

                    section.querySelectorAll('.flatbar-field').forEach((field) => {
                        const labelElement = field.querySelector('.flatbar-field__label');
                        const label = labelElement && labelElement.textContent ? labelElement.textContent.trim() : '';
                        const input = field.querySelector('.flatbar-field__input');
                        const value = input && typeof input.value !== 'undefined' ? String(input.value) : '';

                        if (label) {
                            ctx.font = '16px Segoe UI';
                            ctx.fillStyle = '#000000';
                            ctx.fillText(`${label}: ${value}`, 24, y);
                            y += 24;
                        }
                    });

                    const resultElement = section.querySelector('.flatbar-result-value');
                    const resultText = resultElement && resultElement.textContent ? resultElement.textContent.trim() : '';

                    if (resultText) {
                        ctx.font = '16px Segoe UI';
                        ctx.fillStyle = '#5f8f11';
                        ctx.fillText(`${resultLabelText}: ${resultText}`, 24, y);
                        y += 32;
                    }

                    y += 10;
                });
            } else {
                calculatorView.querySelectorAll('.input-group').forEach((group) => {
                    const labelElement = group.querySelector('label');
                    const label = labelElement && labelElement.textContent ? labelElement.textContent : '';
                    const input = group.querySelector('input, select');
                    const value = input && typeof input.value !== 'undefined' ? input.value : '';
                    ctx.font = '16px Segoe UI';
                    ctx.fillStyle = '#000000';
                    ctx.fillText(`${label}: ${value}`, 24, y);
                    y += 30;
                });
            }

            const notesElement = document.getElementById('calculator-notes');

            const notes = notesElement && notesElement.value ? notesElement.value.trim() : '';

            if (notes) {
                ctx.font = '16px Segoe UI';
                ctx.fillStyle = '#000000';
                ctx.fillText('Poznámky:', 24, y);
                y += 24;

                notes.split(/\r?\n/).forEach((line) => {
                    if (line.trim() === '') {
                        y += 22;
                        return;
                    }

                    ctx.fillText(line, 24, y);
                    y += 22;
                });
            }
            
            if (!isFlatbarView) {
                const resultElement = calculatorView.querySelector('#result-weight');
                const result = resultElement && resultElement.textContent ? resultElement.textContent : '';
                ctx.font = '18px Segoe UI';
                ctx.fillStyle = '#5f8f11';
                ctx.fillText(`Výsledek: ${result}`, 24, y + 20);
            }

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
            const isFlatbarView = this.currentView === 'plochace';
            let resultLabelText = (config.resultLabel || 'Výsledek').replace(/\s*[:：]\s*$/, '');
            let resultText = '';
            

            const calculatorData = {
                type: this.currentView,
                title: config.title,
                timestamp: new Date().toISOString(),
                inputs: {},
                result: '',
                resultLabel: resultLabelText,
                resultUnit: config.resultUnit || '',
                notes: ''
            };
            if (isFlatbarView) {
                const flatbarSections = Array.from(this.container.querySelectorAll('.flatbar-calculator'));
                const flatbarData = flatbarSections.map((section) => {
                    const sectionId = section.getAttribute('data-flatbar') || '';
                    const titleElement = section.querySelector('.flatbar-calculator__header h3');
                    const title = titleElement && titleElement.textContent ? titleElement.textContent.trim() : sectionId;
                    const resultLabelElement = section.querySelector('.flatbar-result-label');
                    const resultLabel = resultLabelElement && resultLabelElement.textContent
                        ? resultLabelElement.textContent.trim()
                        : 'Výsledek';

                    const fields = Array.from(section.querySelectorAll('.flatbar-field')).map((field) => {
                        const inputElement = field.querySelector('.flatbar-field__input');
                        const id = inputElement && inputElement.id ? inputElement.id : '';
                        const labelElement = field.querySelector('.flatbar-field__label');
                        const label = labelElement && labelElement.textContent ? labelElement.textContent.trim() : id;
                        const value = inputElement && typeof inputElement.value !== 'undefined'
                            ? String(inputElement.value)
                            : '';

                        if (id) {
                            calculatorData.inputs[id] = { label, value };
                        }

                        return { id, label, value };
                    });

                    const resultElement = section.querySelector('.flatbar-result-value');
                    const sectionResult = resultElement && resultElement.textContent
                        ? resultElement.textContent.trim()
                        : '';
                    const resultValue = sectionResult && sectionResult !== '' ? sectionResult : '— mm';

                    if (sectionId) {
                        calculatorData.inputs[`${sectionId}-result`] = {
                            label: `${title}: ${resultLabel}`,
                            value: resultValue
                        };
                    }

                    return {
                        id: sectionId,
                        title,
                        fields,
                        result: resultValue,
                        resultLabel
                    };
                });

                if (flatbarData.length > 0) {
                    calculatorData.flatbarCalculators = flatbarData;
                    calculatorData.resultUnit = 'mm';

                    const flatbarResults = flatbarData
                        .map((item) => ({
                            title: item.title || 'Výpočet',
                            label: item.resultLabel || 'Výsledek',
                            result: item.result && item.result.trim() !== '' ? item.result : '— mm'
                        }))
                        .filter((item) => item.title.trim() !== '' || item.result.trim() !== '');

                    if (flatbarResults.length > 0) {
                        resultLabelText = 'Rozvinuté délky';
                        resultText = flatbarResults
                            .map((item) => `${item.title} – ${item.label}: ${item.result}`)
                            .join('\n');
                    }
                }
            } else {
                const resultElement = document.getElementById('result-weight');
                resultText = resultElement && resultElement.textContent ? resultElement.textContent : '';
            }

            const notesElement = document.getElementById('calculator-notes');
            if (notesElement) {
                calculatorData.notes = notesElement.value;
            }

            const form = this.container.querySelector('.calculator-form');
            if (form) {
                form.querySelectorAll('input, select').forEach((field) => {
                    const labelElement = field.previousElementSibling;
                    const label = labelElement && labelElement.textContent ? labelElement.textContent : field.id;
                    calculatorData.inputs[field.id] = {
                        label,
                        value: field.value
                    };
                });
            }

            const materialSelect = document.getElementById('material-select');
            let materialLabelText = '';
            let materialDensityText = '';
            let includeMaterialInfo = false;
            if (materialSelect) {
                const materialValue = materialSelect.value;
                const materialDensity = MATERIAL_DENSITIES[materialValue];
                const materialLabel = MATERIAL_LABELS[materialValue] || materialValue;
                calculatorData.material = {
                    value: materialValue,
                    label: materialLabel
                };
                calculatorData.materialDensity = materialDensity;
                materialLabelText = materialLabel;
                materialDensityText = typeof materialDensity === 'number'
                    ? `${new Intl.NumberFormat('cs-CZ').format(materialDensity)} kg/m³`
                    : '(neuvedeno)';
                includeMaterialInfo = config.showMaterialSelector !== false;
            }
            if (isFlatbarView && resultText.trim() === '') {
                resultLabelText = 'Rozvinuté délky';
                resultText = '— mm';
            }

            calculatorData.resultLabel = resultLabelText;
            calculatorData.result = resultText;
            

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
            const formattedDate = new Date().toLocaleDateString('cs-CZ');
            const inputValues = Object.values(calculatorData.inputs || {})
                .map((field) => {
                    const label = field && field.label ? String(field.label).trim() : '';
                    const rawValue = field && typeof field.value !== 'undefined' && field.value !== null
                        ? String(field.value).trim()
                        : '';
                    const valueText = rawValue !== '' ? rawValue : '(neuvedeno)';
                    return label ? `${label}: ${valueText}` : valueText;
                })
                .filter((line) => line && line !== '(neuvedeno)');

            const materialLabel = calculatorData.material && calculatorData.material.label
                ? calculatorData.material.label
                : '(neuvedeno)';
            const materialDensity = typeof calculatorData.materialDensity === 'number'
                ? `${new Intl.NumberFormat('cs-CZ').format(calculatorData.materialDensity)} kg/m³`
                : '(neuvedeno)';

            const notesText = calculatorData.notes && calculatorData.notes.trim() !== ''
                ? calculatorData.notes.trim()
                : '(neuvedeno)';

            const bodyLines = [
                'Dobrý den,',
                '',
                'přikládám výsledky výpočtu z aplikace Kalkulátor hmotnosti materiálů.',
                '',
                `Typ výpočtu: ${config.title}`,
                `${calculatorData.resultLabel}: ${calculatorData.result}`,
                `Datum: ${formattedDate}`,
                '',
                'Naměřené hodnoty:',
                inputValues.length > 0 ? inputValues.join('\n') : '(neuvedeno)'
            ];

                        if (includeMaterialInfo) {
                bodyLines.push('');
                bodyLines.push(`Materiál: ${materialLabelText}`);
                bodyLines.push(`Hustota materiálu: ${materialDensityText}`);
            }

            bodyLines.push('');
            bodyLines.push('Poznámky:');
            bodyLines.push(notesText);
            bodyLines.push('');
            bodyLines.push('S pozdravem');


            const body = encodeURIComponent(bodyLines.join('\n'));

            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        } catch (error) {
            console.error('Chyba při exportu dat:', error);
            alert('Chyba při exportu dat.');
        }
    }
}

function initializeAppLogo(providedLogo) {
    const logo = providedLogo || (typeof document !== 'undefined' ? document.querySelector('.app-logo') : null);
    if (!logo || logo.dataset.logoInitialized === 'true') {
        return;
    }

    logo.dataset.logoInitialized = 'true';

    const primarySource = (logo.dataset.logoSrc || '').trim();
    const fallbackSources = (logo.dataset.logoFallbacks || '')
        .split(',')
        .map((value) => value.trim())
        .filter((value, index, array) => value && array.indexOf(value) === index);

    const markLogoLoaded = () => {
        logo.classList.add('app-logo--loaded');
    };

    if (logo.complete && logo.naturalWidth > 0) {
        markLogoLoaded();
    } else {
        logo.addEventListener('load', markLogoLoaded, { once: true });
    }

    let fallbackIndex = 0;

    if (fallbackSources.length > 0) {
        logo.addEventListener('error', function handleLogoError() {
            if (fallbackIndex >= fallbackSources.length) {
                logo.removeEventListener('error', handleLogoError);
                return;
            }

            const nextSource = fallbackSources[fallbackIndex++];
            if (!nextSource) {
                return;
            }

            requestAnimationFrame(() => {
                logo.src = nextSource;
            });
        });
    }

    if (primarySource) {
        logo.src = primarySource;
    } else if (fallbackSources.length > 0) {
        const firstFallback = fallbackSources[fallbackIndex++] || '';
        if (firstFallback) {
            logo.src = firstFallback;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeAppLogo();
    window.app = new MaterialCalculatorApp();
});
