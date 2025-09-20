diff --git a/script.js b/script.js
index 199bcb9558de14424bcab1c73933b71f88b860ca..260367d4ec950b08882958e908006368fed698ed 100644
--- a/script.js
+++ b/script.js
@@ -91,69 +91,77 @@ class MaterialCalculatorApp {
             <div class="tile" onclick="app.loadView('${tile.id}')" role="button" tabindex="0" 
                  onkeydown="if(event.key==='Enter'||event.key===' '){app.loadView('${tile.id}')}"
                  aria-label="Otevřít kalkulačku ${tile.title}">
                 <div class="tile-image">
                     <img src="${tile.image}" alt="${tile.title}" />
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
     }
 
     renderCalculatorView(type) {
         const config = this.getCalculatorConfig(type);
         
         this.container.innerHTML = `
             <div class="calculator-view">
                 <div class="calculator-header">
-                    <button class="back-btn" onclick="app.loadView('home')" aria-label="Zpět na hlavní stránku">← Zpět</button>
+                    <button class="btn btn-secondary back-btn" onclick="app.loadView('home')" aria-label="Zpět na hlavní stránku">← Zpět</button>
                     <h2>${config.title}</h2>
-                    <button class="reset-btn" onclick="app.resetCalculator()" aria-label="Resetovat hodnoty">Reset hodnot</button>
+                    <button class="btn btn-primary reset-btn" onclick="app.resetCalculator()" aria-label="Resetovat hodnoty">Resetovat</button>
                 </div>
-                
+
                 ${this.renderMaterialSelector(type)}
-                
-                <div class="inputs-container">
+
+                <div class="calculator-form">
                     ${config.inputs.map(input => this.renderInput(input)).join('')}
                 </div>
-                
-                <div class="result-container">
-                    <div class="result-label">Hmotnost:</div>
-                    <div class="result-value" id="result-weight">0.00 kg</div>
+
+                <div class="calculator-results">
+                    <div class="result-item">
+                        <label>Hmotnost:</label>
+                        <span id="result-weight">0.000 kg</span>
+                    </div>
                 </div>
-                
-                <div class="action-buttons">
-                    <button class="screenshot-btn" onclick="app.takeScreenshot()" aria-label="Pořídit snímek obrazovky">📷 Snímek obrazovky</button>
-                    <button class="export-btn" onclick="app.exportToEmail()" aria-label="Uložit výsledky do e-mailu">📧 Uložit do e-mailu</button>
+
+                <div class="calculator-actions">
+                    <button class="btn btn-primary screenshot-btn" onclick="app.takeScreenshot()" aria-label="Pořídit snímek obrazovky">
+                        <span aria-hidden="true">📷</span>
+                        <span>Snímek obrazovky</span>
+                    </button>
+                    <button class="btn btn-primary export-btn" onclick="app.exportToEmail()" aria-label="Uložit výsledky do e-mailu">
+                        <span aria-hidden="true">📧</span>
+                        <span>Uložit do e-mailu</span>
+                    </button>
                 </div>
             </div>
         `;
         
         // Show initial material density if material selector exists
         const materialSelect = document.getElementById('material-select');
         if (materialSelect) {
             this.showMaterialDensity('material-select', materialSelect.value);
         }
         
         // Initial calculation
         this.calculate();
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
diff --git a/script.js b/script.js
index 199bcb9558de14424bcab1c73933b71f88b860ca..260367d4ec950b08882958e908006368fed698ed 100644
--- a/script.js
+++ b/script.js
@@ -217,55 +225,55 @@ class MaterialCalculatorApp {
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
-        
-        const materialOptions = Object.keys(MATERIAL_LABELS).map(key => 
+
+        const materialOptions = Object.keys(MATERIAL_LABELS).map(key =>
             `<option value="${key}">${MATERIAL_LABELS[key]}</option>`
         ).join('');
-        
+
         return `
             <div class="material-selector">
                 <label for="material-select">Materiál:</label>
                 <select id="material-select" onchange="app.showMaterialDensity('material-select', this.value); app.calculate()">
                     ${materialOptions}
                 </select>
                 <div id="material-density" class="material-density"></div>
             </div>
         `;
     }
 
     showMaterialDensity(selectId, materialValue) {
         const densityDiv = document.getElementById('material-density');
         if (densityDiv && materialValue && MATERIAL_DENSITIES[materialValue]) {
             const density = MATERIAL_DENSITIES[materialValue];
             densityDiv.innerHTML = `<span class="density-label">Hustota:</span> <span class="density-value">${density} kg/m³</span>`;
         }
     }
 
     renderInput(input) {
         if (input.type === 'select') {
             const options = input.options.map(option => 
                 `<option value="${option}">${option}</option>`
             ).join('');
             
diff --git a/script.js b/script.js
index 199bcb9558de14424bcab1c73933b71f88b860ca..260367d4ec950b08882958e908006368fed698ed 100644
--- a/script.js
+++ b/script.js
@@ -478,80 +486,112 @@ class MaterialCalculatorApp {
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
-        
-        if (spoolDiameter <= 0 || turnsCount <= 0) return 0;
-        
+
+        if (spoolDiameter <= 0 || turnsCount <= 0) {
+            document.getElementById('result-weight').textContent = `0.000 m`;
+            return 0;
+        }
+
         const length = (spoolDiameter * Math.PI * turnsCount) / 1000; // Convert to meters
-        
+
         // Update result display to show length instead of weight for cables
         document.getElementById('result-weight').textContent = `${length.toFixed(3)} m`;
         return 0; // Return 0 as we're showing length, not weight
     }
 
     calculateFolie() {
         const rollDiameter = parseFloat(document.getElementById('roll-diameter').value) || 0; // B6
         const spoolDiameter = parseFloat(document.getElementById('spool-diameter').value) || 0; // B7
         const rollLength = parseFloat(document.getElementById('roll-length').value) || 0; // B8
         const materialThickness = parseFloat(document.getElementById('material-thickness').value) || 0; // B9
-        
-        if (rollDiameter <= 0 || spoolDiameter <= 0 || rollLength <= 0 || materialThickness <= 0) return 0;
-        if (spoolDiameter >= rollDiameter) return 0;
-        
+
+        if (rollDiameter <= 0 || spoolDiameter <= 0 || rollLength <= 0 || materialThickness <= 0 || spoolDiameter >= rollDiameter) {
+            document.getElementById('result-weight').textContent = `0.000 m²`;
+            return 0;
+        }
+
         // Formula from specification: ( (B6 - ((B6 - B7) / 2) ) * 3.14 * ( (B6 - B7) / (2 * B9) ) * B8 ) / 1 000 000 000
         const area = ((rollDiameter - ((rollDiameter - spoolDiameter) / 2)) * Math.PI * ((rollDiameter - spoolDiameter) / (2 * materialThickness)) * rollLength) / 1000000000;
-        
+
         // Update result display to show area instead of weight for foil
         document.getElementById('result-weight').textContent = `${area.toFixed(3)} m²`;
         return 0; // Return 0 as we're showing area, not weight
     }
 
     resetCalculator() {
-        const inputs = document.querySelectorAll('.calculator-form input, .calculator-form select');
-        inputs.forEach(input => input.value = '');
+        const inputs = document.querySelectorAll('.calculator-form input');
+        inputs.forEach(input => {
+            if (input.type === 'number') {
+                input.value = '0';
+            } else {
+                input.value = '';
+            }
+        });
+
+        const selects = document.querySelectorAll('.calculator-form select');
+        selects.forEach(select => select.selectedIndex = 0);
+
+        const materialSelect = document.getElementById('material-select');
+        if (materialSelect) {
+            materialSelect.selectedIndex = 0;
+            this.showMaterialDensity('material-select', materialSelect.value);
+        }
+
+        const resultElement = document.getElementById('result-weight');
+        if (resultElement) {
+            if (this.currentView === 'kabely') {
+                resultElement.textContent = '0.000 m';
+            } else if (this.currentView === 'folie') {
+                resultElement.textContent = '0.000 m²';
+            } else {
+                resultElement.textContent = '0.000 kg';
+            }
+        }
+
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
