// Core SPA Application
class MaterialCalculatorApp {
    constructor() {
        this.container = document.getElementById('app-container');
        this.currentView = null;
        this.init();
    }

    init() {
        // Initialize router
        this.setupRouter();
        // Load initial view
        this.loadView('home');
    }

    setupRouter() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            const view = event.state?.view || 'home';
            this.loadView(view, false);
        });
    }

    loadView(viewName, pushState = true) {
        if (pushState) {
            history.pushState({ view: viewName }, '', `#${viewName}`);
        }
        
        this.currentView = viewName;
        this.renderView(viewName);
    }

    renderView(viewName) {
        // Clear container
        this.container.innerHTML = '';
        
        switch (viewName) {
            case 'home':
                this.renderHomeView();
                break;
            case 'mezikruzi':
                this.renderCalculatorView('mezikruzi');
                break;
            case 'trubka':
                this.renderCalculatorView('trubka');
                break;
            case 'hranol':
                this.renderCalculatorView('hranol');
                break;
            case 'valec':
                this.renderCalculatorView('valec');
                break;
            case 'jakl':
                this.renderCalculatorView('jakl');
                break;
            case 'profil-l':
                this.renderCalculatorView('profil-l');
                break;
            case 'plochace':
                this.renderCalculatorView('plochace');
                break;
            case 'profil-iu':
                this.renderCalculatorView('profil-iu');
                break;
            case 'kabely':
                this.renderCalculatorView('kabely');
                break;
            case 'folie':
                this.renderCalculatorView('folie');
                break;
            default:
                this.renderHomeView();
        }
    }

    renderHomeView() {
        const tiles = [
            { id: 'mezikruzi', title: 'Mezikruží', icon: '⭕' },
            { id: 'trubka', title: 'Trubka', icon: '🔧' },
            { id: 'hranol', title: 'Hranol', icon: '📦' },
            { id: 'valec', title: 'Válec', icon: '🔴' },
            { id: 'jakl', title: 'Jakl', icon: '⬜' },
            { id: 'profil-l', title: 'Profil L', icon: '📐' },
            { id: 'plochace', title: 'Plocháče', icon: '📏' },
            { id: 'profil-iu', title: 'Profil I+U', icon: '🏗️' },
            { id: 'kabely', title: 'Kabely', icon: '🔌' },
            { id: 'folie', title: 'Fólie', icon: '📜' }
        ];

        const tilesHTML = tiles.map(tile => `
            <div class="tile" onclick="app.loadView('${tile.id}')" 
                 onkeydown="if(event.key==='Enter'||event.key===' ') app.loadView('${tile.id}')"
                 tabindex="0" role="button" aria-label="Otevřít kalkulačku ${tile.title}">
                <div class="tile-icon" aria-hidden="true">${tile.icon}</div>
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
    }

    renderCalculatorView(type) {
        const calculatorConfig = this.getCalculatorConfig(type);
        
        this.container.innerHTML = `
            <div class="calculator-view">
                <div class="calculator-header">
                    <button class="back-btn" onclick="app.loadView('home')" aria-label="Zpět na hlavní stránku">← Zpět</button>
                    <h2>${calculatorConfig.title}</h2>
                    <button class="reset-btn" onclick="app.resetCalculator()" aria-label="Vymazat všechny hodnoty">Reset hodnot</button>
                </div>
                
                ${this.renderMaterialSelector(type)}
                
                <div class="calculator-form" role="form" aria-label="Vstupní hodnoty pro výpočet">
                    ${calculatorConfig.inputs.map(input => this.renderInput(input)).join('')}
                </div>
                
                <div class="calculator-results" role="region" aria-label="Výsledky výpočtu">
                    <div class="result-item">
                        <label>Hmotnost:</label>
                        <span id="result-weight" aria-live="polite">0.00 kg</span>
                    </div>
                </div>
                
                <div class="calculator-actions" role="group" aria-label="Akce s výsledky">
                    <button onclick="app.takeScreenshot()" aria-label="Vytvořit snímek obrazovky">📷 Snímek obrazovky</button>
                    <button onclick="app.exportToEmail()" aria-label="Exportovat výsledky do e-mailu">📧 Uložit do e-mailu</button>
                </div>
            </div>
        `;
        
        // Add event listeners for real-time calculation
        this.setupCalculatorListeners(type);
    }

    getCalculatorConfig(type) {
        const configs = {
            'mezikruzi': {
                title: 'Mezikruží',
                inputs: [
                    { id: 'outer-diameter', label: 'Vnější průměr D [mm]', type: 'number', required: true },
                    { id: 'inner-diameter', label: 'Vnitřní průměr d [mm]', type: 'number', required: true },
                    { id: 'length', label: 'Délka L [mm]', type: 'number', required: true }
                ]
            },
            'trubka': {
                title: 'Trubka',
                inputs: [
                    { id: 'outer-diameter', label: 'Vnější průměr D [mm]', type: 'number', required: true },
                    { id: 'wall-thickness', label: 'Tloušťka stěny S [mm]', type: 'number', required: true },
                    { id: 'length', label: 'Délka L [mm]', type: 'number', required: true }
                ]
            },
            'hranol': {
                title: 'Hranol',
                inputs: [
                    { id: 'width', label: 'Šířka S [mm]', type: 'number', required: true },
                    { id: 'height', label: 'Výška V [mm]', type: 'number', required: true },
                    { id: 'length', label: 'Délka L [mm]', type: 'number', required: true }
                ]
            },
            'valec': {
                title: 'Válec',
                inputs: [
                    { id: 'diameter', label: 'Průměr D [mm]', type: 'number', required: true },
                    { id: 'length', label: 'Délka L [mm]', type: 'number', required: true }
                ]
            },
            'jakl': {
                title: 'Jakl (čtvercový/obdélníkový profil)',
                inputs: [
                    { id: 'width', label: 'Šířka A [mm]', type: 'number', required: true },
                    { id: 'height', label: 'Výška B [mm]', type: 'number', required: true },
                    { id: 'wall-thickness', label: 'Tloušťka stěny T [mm]', type: 'number', required: true },
                    { id: 'length', label: 'Délka L [mm]', type: 'number', required: true }
                ]
            },
            'profil-l': {
                title: 'Profil L',
                inputs: [
                    { id: 'width', label: 'Šířka A [mm]', type: 'number', required: true },
                    { id: 'height', label: 'Výška B [mm]', type: 'number', required: true },
                    { id: 'wall-thickness', label: 'Tloušťka stěny T [mm]', type: 'number', required: true },
                    { id: 'length', label: 'Délka L [mm]', type: 'number', required: true }
                ]
            },
            'plochace': {
                title: 'Plocháče',
                inputs: [
                    { id: 'width', label: 'Šířka [mm]', type: 'number', required: true },
                    { id: 'thickness', label: 'Tloušťka [mm]', type: 'number', required: true },
                    { id: 'length', label: 'Délka [mm]', type: 'number', required: true }
                ]
            },
            'profil-iu': {
                title: 'Profil I+U',
                inputs: [
                    { id: 'profile-type', label: 'Typ profilu', type: 'select', required: true, options: ['HEA', 'HEA-S', 'IPE', 'IPE-S', 'U', 'U-S'] },
                    { id: 'profile-height', label: 'Výška H [mm]', type: 'number', required: true },
                    { id: 'length', label: 'Délka L [mm]', type: 'number', required: true }
                ]
            },
            'kabely': {
                title: 'Kabely',
                inputs: [
                    { id: 'spool-diameter', label: 'Průměr špule D [mm]', type: 'number', required: true },
                    { id: 'turns-count', label: 'Počet závitů kabelu', type: 'number', required: true }
                ]
            },
            'folie': {
                title: 'Fólie',
                inputs: [
                    { id: 'roll-diameter', label: 'Průměr role D [mm]', type: 'number', required: true },
                    { id: 'spool-diameter', label: 'Průměr špule d [mm]', type: 'number', required: true },
                    { id: 'roll-length', label: 'Délka role l [mm]', type: 'number', required: true },
                    { id: 'material-thickness', label: 'Síla materiálu [mm]', type: 'number', required: true }
                ]
            }
        };
        
        return configs[type] || { title: 'Neznámá kalkulačka', inputs: [] };
    }

    renderMaterialSelector(type) {
        // Some calculators don't need material selector
        if (['kabely', 'folie'].includes(type)) {
            return '';
        }
        
        const materialOptions = Object.keys(MATERIAL_LABELS).map(key => 
            `<option value="${key}">${MATERIAL_LABELS[key]}</option>`
        ).join('');
        
        return `
            <div class="material-selector">
                <label for="material-select">Materiál:</label>
                <select id="material-select" onchange="app.calculate()">
                    ${materialOptions}
                </select>
            </div>
        `;
    }

    renderInput(input) {
        if (input.type === 'select') {
            const options = input.options.map(option => 
                `<option value="${option}">${option}</option>`
            ).join('');
            
            return `
                <div class="input-group">
                    <label for="${input.id}">${input.label}</label>
                    <select 
                        id="${input.id}" 
                        ${input.required ? 'required' : ''}
                        onchange="app.calculate()"
                    >
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
                    type="${input.type}" 
                    id="${input.id}" 
                    ${input.required ? 'required' : ''}
                    oninput="app.calculate()"
                    step="0.01"
                    min="0"
                />
            </div>
        `;
    }

    setupCalculatorListeners(type) {
        // Initial calculation
        setTimeout(() => this.calculate(), 100);
    }

    async calculate() {
        const type = this.currentView;
        let result = 0;
        
        try {
            switch (type) {
                case 'mezikruzi':
                    result = this.calculateMezikruzi();
                    break;
                case 'trubka':
                    result = this.calculateTrubka();
                    break;
                case 'hranol':
                    result = this.calculateHranol();
                    break;
                case 'valec':
                    result = this.calculateValec();
                    break;
                case 'jakl':
                    result = this.calculateJakl();
                    break;
                case 'profil-l':
                    result = this.calculateProfilL();
                    break;
                case 'plochace':
                    result = this.calculatePlochace();
                    break;
                case 'profil-iu':
                    result = await this.calculateProfilIU();
                    break;
                case 'kabely':
                    result = this.calculateKabely();
                    return; // Early return as kabely handles its own display
                case 'folie':
                    result = this.calculateFolie();
                    return; // Early return as folie handles its own display
            }
        } catch (error) {
            console.error('Calculation error:', error);
            result = 0;
        }
        
        document.getElementById('result-weight').textContent = `${result.toFixed(3)} kg`;
    }

    calculateMezikruzi() {
        const D = parseFloat(document.getElementById('outer-diameter').value) || 0;
        const d = parseFloat(document.getElementById('inner-diameter').value) || 0;
        const L = parseFloat(document.getElementById('length').value) || 0;
        const material = document.getElementById('material-select').value;
        
        if (D <= 0 || d <= 0 || L <= 0 || d >= D) return 0;
        
        const area = Math.PI * ((D/2)**2 - (d/2)**2); // mm²
        const volume = area * L; // mm³
        const volumeM3 = volume / 1000000000; // m³
        const density = MATERIAL_DENSITIES[material] || 7850;
        
        return volumeM3 * density;
    }

    calculateTrubka() {
        const D = parseFloat(document.getElementById('outer-diameter').value) || 0;
        const S = parseFloat(document.getElementById('wall-thickness').value) || 0;
        const L = parseFloat(document.getElementById('length').value) || 0;
        const material = document.getElementById('material-select').value;
        
        if (D <= 0 || S <= 0 || L <= 0 || S >= D/2) return 0;
        
        const d = D - (2 * S);
        const area = Math.PI * ((D/2)**2 - (d/2)**2); // mm²
        const volume = area * L; // mm³
        const volumeM3 = volume / 1000000000; // m³
        const density = MATERIAL_DENSITIES[material] || 7850;
        
        return volumeM3 * density;
    }

    calculateHranol() {
        const S = parseFloat(document.getElementById('width').value) || 0;
        const V = parseFloat(document.getElementById('height').value) || 0;
        const L = parseFloat(document.getElementById('length').value) || 0;
        const material = document.getElementById('material-select').value;
        
        if (S <= 0 || V <= 0 || L <= 0) return 0;
        
        const area = S * V; // mm²
        const volume = area * L; // mm³
        const volumeM3 = volume / 1000000000; // m³
        const density = MATERIAL_DENSITIES[material] || 7850;
        
        return volumeM3 * density;
    }

    calculateValec() {
        const D = parseFloat(document.getElementById('diameter').value) || 0;
        const L = parseFloat(document.getElementById('length').value) || 0;
        const material = document.getElementById('material-select').value;
        
        if (D <= 0 || L <= 0) return 0;
        
        const area = Math.PI * (D/2)**2; // mm²
        const volume = area * L; // mm³
        const volumeM3 = volume / 1000000000; // m³
        const density = MATERIAL_DENSITIES[material] || 7850;
        
        return volumeM3 * density;
    }

    calculateJakl() {
        const A = parseFloat(document.getElementById('width').value) || 0;
        const B = parseFloat(document.getElementById('height').value) || 0;
        const T = parseFloat(document.getElementById('wall-thickness').value) || 0;
        const L = parseFloat(document.getElementById('length').value) || 0;
        const material = document.getElementById('material-select').value;
        
        if (A <= 0 || B <= 0 || T <= 0 || L <= 0 || T >= A/2 || T >= B/2) return 0;
        
        const outerArea = A * B;
        const innerArea = (A - 2*T) * (B - 2*T);
        const materialArea = outerArea - innerArea; // mm²
        const volume = materialArea * L; // mm³
        const volumeM3 = volume / 1000000000; // m³
        const density = MATERIAL_DENSITIES[material] || 7850;
        
        return volumeM3 * density;
    }

    calculateProfilL() {
        const A = parseFloat(document.getElementById('width').value) || 0;
        const B = parseFloat(document.getElementById('height').value) || 0;
        const T = parseFloat(document.getElementById('wall-thickness').value) || 0;
        const L = parseFloat(document.getElementById('length').value) || 0;
        const material = document.getElementById('material-select').value;
        
        if (A <= 0 || B <= 0 || T <= 0 || L <= 0) return 0;
        
        const area = (A * T) + ((B - T) * T); // mm²
        const volume = area * L; // mm³
        const volumeM3 = volume / 1000000000; // m³
        const density = MATERIAL_DENSITIES[material] || 7850;
        
        return volumeM3 * density;
    }

    calculatePlochace() {
        const width = parseFloat(document.getElementById('width').value) || 0;
        const thickness = parseFloat(document.getElementById('thickness').value) || 0;
        const length = parseFloat(document.getElementById('length').value) || 0;
        const material = document.getElementById('material-select').value;
        
        if (width <= 0 || thickness <= 0 || length <= 0) return 0;
        
        const area = width * thickness; // mm²
        const volume = area * length; // mm³
        const volumeM3 = volume / 1000000000; // m³
        const density = MATERIAL_DENSITIES[material] || 7850;
        
        return volumeM3 * density;
    }

    async calculateProfilIU() {
        const profileType = document.getElementById('profile-type').value;
        const height = parseFloat(document.getElementById('profile-height').value) || 0;
        const length = parseFloat(document.getElementById('length').value) || 0;
        
        if (!profileType || height <= 0 || length <= 0) return 0;
        
        // Load profile data if not already loaded
        if (!this.profileData) {
            try {
                const response = await fetch('./profil-data.json');
                this.profileData = await response.json();
            } catch (error) {
                console.error('Error loading profile data:', error);
                return 0;
            }
        }
        
        // Find matching profile
        const profile = this.profileData.find(p => 
            p.Typ === profileType && p.Rozmer === height
        );
        
        if (!profile) {
            console.warn(`Profile not found: ${profileType} ${height}`);
            return 0;
        }
        
        const lengthM = length / 1000; // Convert mm to m
        return profile.Hmotnost_m * lengthM;
    }

    calculateKabely() {
        const spoolDiameter = parseFloat(document.getElementById('spool-diameter').value) || 0;
        const turnsCount = parseFloat(document.getElementById('turns-count').value) || 0;
        
        if (spoolDiameter <= 0 || turnsCount <= 0) return 0;
        
        const length = (spoolDiameter * Math.PI * turnsCount) / 1000; // Convert to meters
        
        // Update result display to show length instead of weight for cables
        document.getElementById('result-weight').textContent = `${length.toFixed(3)} m`;
        return 0; // Return 0 as we're showing length, not weight
    }

    calculateFolie() {
        const rollDiameter = parseFloat(document.getElementById('roll-diameter').value) || 0; // B6
        const spoolDiameter = parseFloat(document.getElementById('spool-diameter').value) || 0; // B7
        const rollLength = parseFloat(document.getElementById('roll-length').value) || 0; // B8
        const materialThickness = parseFloat(document.getElementById('material-thickness').value) || 0; // B9
        
        if (rollDiameter <= 0 || spoolDiameter <= 0 || rollLength <= 0 || materialThickness <= 0) return 0;
        if (spoolDiameter >= rollDiameter) return 0;
        
        // Formula from specification: ( (B6 - ((B6 - B7) / 2) ) * 3.14 * ( (B6 - B7) / (2 * B9) ) * B8 ) / 1 000 000 000
        const area = ((rollDiameter - ((rollDiameter - spoolDiameter) / 2)) * Math.PI * ((rollDiameter - spoolDiameter) / (2 * materialThickness)) * rollLength) / 1000000000;
        
        // Update result display to show area instead of weight for foil
        document.getElementById('result-weight').textContent = `${area.toFixed(3)} m²`;
        return 0; // Return 0 as we're showing area, not weight
    }

    resetCalculator() {
        const inputs = document.querySelectorAll('.calculator-form input, .calculator-form select');
        inputs.forEach(input => input.value = '');
        this.calculate();
    }

    async takeScreenshot() {
        try {
            // Simple implementation using html2canvas-like functionality
            // For now, we'll create a simple text-based screenshot
            const calculatorView = document.querySelector('.calculator-view');
            if (!calculatorView) return;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 800;
            canvas.height = 600;
            
            // Fill background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add title
            ctx.fillStyle = 'black';
            ctx.font = '24px Arial';
            ctx.fillText('Kalkulátor hmotnosti materiálů', 20, 40);
            
            // Add calculator title
            const title = calculatorView.querySelector('h2').textContent;
            ctx.font = '20px Arial';
            ctx.fillText(title, 20, 80);
            
            // Add inputs and values
            const inputs = calculatorView.querySelectorAll('.input-group');
            let y = 120;
            inputs.forEach(inputGroup => {
                const label = inputGroup.querySelector('label').textContent;
                const input = inputGroup.querySelector('input, select');
                const value = input.value || 'N/A';
                
                ctx.font = '16px Arial';
                ctx.fillText(`${label}: ${value}`, 20, y);
                y += 30;
            });
            
            // Add result
            const result = document.getElementById('result-weight').textContent;
            ctx.font = '18px Arial';
            ctx.fillStyle = 'green';
            ctx.fillText(`Výsledek: ${result}`, 20, y + 20);
            
            // Convert to blob and download
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `kalkulator-${this.currentView}-${new Date().toISOString().slice(0, 10)}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
            
        } catch (error) {
            console.error('Screenshot error:', error);
            alert('Chyba při vytváření snímku obrazovky.');
        }
    }

    exportToEmail() {
        try {
            // Collect current calculator data
            const calculatorData = {
                type: this.currentView,
                timestamp: new Date().toISOString(),
                inputs: {},
                result: document.getElementById('result-weight').textContent
            };
            
            // Collect input values
            const inputs = document.querySelectorAll('.calculator-form input, .calculator-form select');
            inputs.forEach(input => {
                const label = input.previousElementSibling?.textContent || input.id;
                calculatorData.inputs[input.id] = {
                    label: label,
                    value: input.value
                };
            });
            
            // Add material if present
            const materialSelect = document.getElementById('material-select');
            if (materialSelect) {
                calculatorData.material = {
                    value: materialSelect.value,
                    label: MATERIAL_LABELS[materialSelect.value] || materialSelect.value
                };
            }
            
            // Create JSON blob
            const jsonData = JSON.stringify(calculatorData, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `kalkulator-vysledky-${this.currentView}-${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Open email client
            const subject = encodeURIComponent('Výsledky výpočtu z aplikace Kalkulátor hmotnosti materiálů');
            const body = encodeURIComponent(`Dobrý den,

přikládám výsledky výpočtu z aplikace Kalkulátor hmotnosti materiálů.

Typ výpočtu: ${this.currentView}
Výsledek: ${calculatorData.result}
Datum: ${new Date().toLocaleDateString('cs-CZ')}

S pozdravem`);
            
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
            
        } catch (error) {
            console.error('Export error:', error);
            alert('Chyba při exportu dat.');
        }
    }
}

// Material densities in kg/m³
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

// Material labels for UI
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

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MaterialCalculatorApp();
});

