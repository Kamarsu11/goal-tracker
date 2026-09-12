# � Goal Tracker

A high-performance Progressive Web App (PWA) designed to track daily athletic routines for aspiring tennis pros and compare progress against dynamic **Future Tennis Pro Benchmarks (Ages 10–13+)**.

---

## 🌟 Key Features

# 🏆 Goal Tracker

A high-performance Progressive Web App (PWA) designed to track daily athletic routines for aspiring tennis pros and compare progress against dynamic **European Future Tennis Pro Benchmarks (Ages 10–16)**.

---

## 🌟 Key Features

### 1. iPhone-Optimized Mobile PWA
- **Standalone App Experience:** Safe-area insets, dark mode, fast touch targets, and 100% offline-first IndexedDB storage.
- **Golden Championship Goal Cup Icon:** Native iOS Safari bookmarking with high-resolution raster Apple Touch Icon.
- **Install on iOS:** Open in Safari $\rightarrow$ tap **Share** $\rightarrow$ **Add to Home Screen**.

### 2. Ultra-Fast Daily Logging (< 30 Seconds)
- **Weekly Term Defaults:** Mon–Sun recurring schedules with clean weekend study and intentional rest slots.
- **Pending vs Completed Checkboxes:** Activities start unchecked/pending by default upon loading and illuminate with full category color and points when completed.
- **Hold-and-Move Reordering & Auto-Sort:** Drag handle (`⋮⋮`), `▲`/`▼` reorder arrows, and a 1-tap `Auto-Sort by Time` button.
- **Direct Datepicker:** Tap the date banner to open the native calendar and jump directly to any date.
- **1-Tap Quick Adjustments:** `[+15m]` and `[-15m]` steppers to tweak durations without manual typing.
- **Scenario Presets:** Instant toggles for `[⚡ Load Default Schedule]`, `[🏖 School Holiday]`, `[🤒 Sick / Fever Rest]`, and `[🏆 Match Day]`.
- **Sibling Copy:** Copy today's log from Kid 1 to Kid 2 in 1 tap (handles school dismissal differences automatically).
- **Clear Day & Draft Toggle:** Reset any day or toggle between Confirmed and Draft state.

### 3. Intensity-Based Quality Weights & Scoring Model
Athletic points are strictly weighted by training quality and physiological return:
| Activity Category | Scope & Description | Quality Weight |
| :--- | :--- | :---: |
| **High-Intensity Tennis** | 1:1 intensive coach/Dad drills, basket feeding at high ball speed, tournament match sets | **$1.00\text{ pts/hr}$** |
| **Practice Match Play** | Competitive practice sets, club tiebreak match play, point simulations | **$0.80\text{ pts/hr}$** |
| **Multisport Athleticism** | MAG Gymnastics (core/spatial awareness), Taekwondo (footwork/hip mobility), Parkour | **$0.70\text{ pts/hr}$** |
| **Squad / Standard Practice** | Club group training (1:4 squad drills, continuous rallying) | **$0.60\text{ pts/hr}$** |
| **Tennis S&C & Footwork** | Agility speed ladders, split-step drills, lateral core resistance | **$0.60\text{ pts/hr}$** |
| **Pre-hab & Injury Prevention** | Shoulder rotator cuff bands, foam rolling, dynamic hip/ankle stretching | **$0.50\text{ pts/hr}$** |
| **Intentional Rest (Active Recovery)** | Screen-free physical/mental recovery: legs-up, breathwork, quiet reading, 20m power nap | **$0.50\text{ pts/hr}$** |
| **Tennis IQ & Video Analysis** | Match scouting/charting, studying ATP/WTA tactical breakdowns, stroke review | **$0.50\text{ pts/hr}$** |
| **Guilt-Free Free Play** | PlayStation, gaming, social relaxation with friends/family | **$0.00\text{ pts/hr}$** |
| **Mandatory Life Routine** | School, homework, transit driving time, night sleep | **$0.00\text{ pts/hr}$** |

---

## 🇪🇺 European Development Benchmarks (Alcaraz / Sinner Pathway)

The app models the weekly volume and athletic targets of elite European players across two pathways:

### Pathway A: Standard Schooling + High-Performance Club (Ages 10–13)
*Attends regular school (8:30–15:05) with morning drills, after-school club training, and weekend match play:*
* **Age 10 (Younger Kid Baseline):** **$17.60\text{ pts/week}$** ($2.51\text{ pts/day}$)  
  *(3.5h High-Int Tennis + 2.0h Match + 5.0h Squad + 8.0h Multisport + 1.5h S&C + 2.0h Prehab + 2.5h Intentional Rest + 1.5h Tennis IQ)*
* **Age 11 (Elder Kid Baseline):** **$19.45\text{ pts/week}$** ($2.78\text{ pts/day}$)  
  *(4.5h High-Int Tennis + 2.5h Match + 5.0h Squad + 7.5h Multisport + 2.0h S&C + 2.5h Prehab + 3.0h Intentional Rest + 1.5h Tennis IQ)*
* **Age 12:** **$20.95\text{ pts/week}$** ($2.99\text{ pts/day}$)
* **Age 13:** **$22.80\text{ pts/week}$** ($3.26\text{ pts/day}$)

### Pathway B: Full-Time Pro Academy / Distance School (Ages 12–16)
*Distance schooling with 2 on-court sessions daily + academy gym & recovery:*
* **Age 12:** **$22.20\text{ pts/week}$** ($3.17\text{ pts/day}$)
* **Age 13:** **$24.95\text{ pts/week}$** ($3.56\text{ pts/day}$)
* **Age 14:** **$27.45\text{ pts/week}$** ($3.92\text{ pts/day}$)
* **Age 15:** **$30.55\text{ pts/week}$** ($4.36\text{ pts/day}$)
* **Age 16:** **$33.05\text{ pts/week}$** ($4.72\text{ pts/day}$)

---

## 📊 Analytics Dashboard & Visualizations

1. **Cumulative Growth Trajectory (Pinch-to-Zoom & Fullscreen):**
   - **Mode 1 (Raw Points):** Plots actual cumulative scores against individual age targets.
   - **Mode 2 (% Normalized):** Normalizes both boys to a single $100\%$ age benchmark line for direct fair comparison.
   - **Interactive Day Inspector:** Tap any day to inspect the exact arithmetic formula and category breakdown for both boys and the ideal target.
   - **Future Day Isolation:** Unconfirmed draft and future days do not plot false points on actual lines.
2. **Training Balance & Pillar Distribution Radar:**
   - Visualizes athletic symmetry across 5 core pillars (*Tennis Volume*, *Multisport Power*, *S&C & Footwork*, *Pre-hab & Mobility*, *Rest & Tennis IQ*).
   - Dynamically scales targets to the selected timeframe (*Today*, *Yesterday*, *This Week*, or *Custom*).
   - Detects overuse injury risk if tennis volume is high while pre-hab/mobility is neglected.
3. **Target vs. Actual Period Comparison:** Bar comparisons for all athletic categories and sleep.
4. **24-Hour Stacked Daily Breakdown:** Color-coded 24-hour balance of productive training, transit, school, sleep, and leisure.
5. **The "Silent Killer" Wastage Monitor:** Tracks daily unrecorded dead time against the healthy recovery threshold ($1.5\text{h}$ to $2.0\text{h}$).

---

## 💾 Multi-Device Sync & CSV Export

- **100% Offline-First IndexedDB:** All day logs, term templates, and child profiles are stored securely in local browser storage.
- **JSON Backup & Restore:** Complete multi-table export to transfer data between iPhone, iPad, and PC.
- **Enriched CSV Download:** Export comprehensive spreadsheets with individual columns for High-Intensity Tennis, Practice Matches, Squad Tennis, Multisport, S&C Footwork, Pre-hab, Intentional Rest, and Tennis IQ formatted for Excel and Google Sheets.

---

## 🚀 Running Locally & Deployment

```bash
# Install dependencies
npm install

# Start local dev server (accessible on local network for iPhone preview)
npm run dev -- --host

# Build production bundle
npm run build
```

### GitHub Pages Deployment
The app is configured with GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) that automatically compiles and deploys updates to GitHub Pages on every push to `main`.
