# Kalkulátor hmotnosti materiálů

Webová aplikace pro výpočet hmotnosti různých materiálů a profilů. Aplikace je navržena jako Single Page Application (SPA) s důrazem na výkon, responzivní design a přístupnost.

## Funkce

### Kalkulačky
- **Mezikruží** - výpočet hmotnosti mezikruží na základě vnějšího a vnitřního průměru
- **Trubka** - výpočet hmotnosti trubky na základě průměru a tloušťky stěny
- **Hranol** - výpočet hmotnosti hranolu na základě rozměrů
- **Válec** - výpočet hmotnosti válce na základě průměru a délky
- **Jakl** - výpočet hmotnosti čtvercového/obdélníkového profilu
- **Profil L** - výpočet hmotnosti L profilu
- **Plocháče** - výpočet hmotnosti plochých materiálů
- **Profil I+U** - výpočet hmotnosti standardních profilů (HEA, IPE, U atd.)
- **Kabely** - výpočet délky kabelu na špule
- **Fólie** - výpočet plochy fólie na roli

### Materiály
Aplikace podporuje výpočty pro následující materiály:
- Ocel tažená válcovaná (7850 kg/m³)
- Litina šedá (7200 kg/m³)
- Litina temperovaná (7200 kg/m³)
- Dynamoplech různých typů (7850 kg/m³)
- Ocel rychlořezná (7850 kg/m³)
- Mosaz (8500 kg/m³)
- Měď (8960 kg/m³)
- Bronz (8800 kg/m³)
- Hliník (2700 kg/m³)
- PVC (1400 kg/m³)
- Voda (1000 kg/m³)

### Funkce
- **Real-time výpočty** - výsledky se aktualizují při zadávání hodnot
- **Export výsledků** - možnost exportu do JSON a otevření e-mailového klienta
- **Snímek obrazovky** - vytvoření snímku aktuálního stavu kalkulačky
- **Responzivní design** - optimalizováno pro PC i mobilní zařízení
- **Přístupnost** - podpora pro čtečky obrazovky a klávesovou navigaci

## Technologie

- **HTML5** - sémantické značkování
- **CSS3** - moderní styling s CSS proměnnými a flexbox/grid
- **JavaScript (ES6+)** - čistý JavaScript bez externích závislostí
- **SPA architektura** - rychlá navigace bez obnovování stránky

## Instalace a spuštění

1. Stáhněte nebo naklonujte projekt
2. Otevřete `index.html` v prohlížeči nebo spusťte lokální HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
3. Otevřete `http://localhost:8000` v prohlížeči

## Struktura projektu

```
material-weight-calculator/
├── index.html          # Hlavní HTML soubor
├── style.css           # Styly aplikace
├── script.js           # JavaScript logika
├── profil-data.json    # Databáze profilů I+U
└── README.md           # Dokumentace
```

## Použití

1. Na hlavní stránce vyberte požadovanou kalkulačku kliknutím na dlaždici
2. Vyberte materiál (pokud je to relevantní)
3. Zadejte rozměry ve specifikovaných jednotkách (obvykle mm)
4. Výsledek se zobrazí automaticky
5. Použijte tlačítka pro export nebo snímek obrazovky podle potřeby
6. Pro návrat na hlavní stránku použijte tlačítko "Zpět"

## Licence

Tento projekt je vytvořen pro společnost TES.

