# � Goal Tracker

A high-performance Progressive Web App (PWA) designed to track daily athletic routines for aspiring tennis pros and compare progress against dynamic **Future Tennis Pro Benchmarks (Ages 10–13+)**.

---

## 🌟 Key Features

### 1. iPhone-Optimized Mobile PWA
- **Standalone App Experience:** Safe-area insets, dark mode, fast touch targets, and 100% offline-first IndexedDB storage.
- **Install on iOS:** Open in Safari $\rightarrow$ tap **Share** $\rightarrow$ **Add to Home Screen**.

### 2. Ultra-Fast Daily Logging (< 30 Seconds)
- **Weekly Term Defaults:** Mon–Sun recurring schedules auto-load on date navigation.
- **Direct Datepicker:** Tap the date banner to open the native calendar and jump directly to any date.
- **1-Tap Quick Adjustments:** `[+15m]` and `[-15m]` steppers to tweak durations without typing.
- **Scenario Presets:** Instant toggles for `[⚡ Load Preset]`, `[🏖 School Holiday]`, `[🤒 Sick / Fever Rest]`, and `[🎾 Match Day]`.
- **Sibling Copy:** Copy today's log from Kid 1 to Kid 2 in 1 tap (handles school dismissal differences automatically).
- **Clear Day:** Reset any day for completely custom logging.

### 3. Smart Handling of Missed Logging vs. Real Dead Time
- **Unconfirmed Drafts:** Days that haven't been reviewed start as *Unconfirmed Drafts* with unrecorded gaps flagged in gray without score penalties.
- **Confirmed Days:** Once confirmed, idle gaps between activities are calculated and highlighted as **🔴 Unnoticed Dead Time (The Silent Killer)**.

### 4. Intensity-Based Quality Weights & Scoring Model
Athletic points are weighted by training intensity and density:
| Activity Category | Scope / Description | Quality Weight |
| :--- | :--- | :--- |
| **High-Intensity Tennis** | Match play, intensive 1:1 drills with Dad/Coach, serve target reps | **$1.0\times$** |
| **Standard Practice Tennis** | Group training, club squad practice, light rallying | **$0.4\times$** |
| **Tactical & Agility Training** | Match charting, agility footwork drills, video analysis | **$0.7\times$** |
| **Multisport Athleticism** | Gymnastics, Taekwondo, Parkour classes | **$0.4\times$** |
| **Mobility & Pre-hab** | Foam rolling, shoulder band rotations, stretching, core | **$0.5\times$** |
| **Mandatory Routine** | School, transit, homework, sleep | **$0.0\times$** |

### 5. Dynamic Ideal Pro Adjustment Engine
Target curves dynamically recalculate on the fly:
- **School Holiday:** Replaces school with $+1.0\text{h}$ court time and expanded guilt-free leisure.
- **Activity Cancelled:** Converts $45\text{m}$ to home agility/wall drills and shifts remainder to rest.
- **Sick Day:** Pauses athletic target deficits and prioritizes $12\text{h}$ recovery sleep.
- **Match Day:** Dynamically applies tournament match load.

### 6. Interactive Analytics & Zoomable Curves
- **Filter Presets:** Instant toggling for `Today`, `Yesterday`, and `Custom` ranges.
- **Dual-Athlete Comparison:** Toggle `Compare Both Boys` to view Kid 1 (Neon Lime), Kid 2 (Cyan), and the Ideal Benchmark (Sky Blue) side-by-side.
- **Cumulative Growth Trajectory:** 
  - Pinch-to-zoom on mobile or drag horizontally.
  - Interactive **Day Inspector**: Tap any day on the chart to view the full arithmetic calculation equation for both boys and the ideal benchmark.
  - Quick range jump presets (`14D`, `30D`, `90D`, `All`) for long historical date ranges.
  - Fullscreen chart modal.
- **Target vs. Actual Breakdown:** Direct net hour differences (e.g. `+0.75h above target`).
- **24-Hour Stacked Daily Breakdown:** Productive vs Transit vs Sleep vs Unnoticed Time.
- **The "Silent Killer" Monitor:** Daily idle time against healthy recovery limits.

### 7. Settings & Customization
- **Editable Day Names:** Rename default weekly templates (e.g., customize `Monday (Gymnastics)` to any activity title).
- **Cross-Kid Schedule Copying:** Copy a single day's template or all 7 days from one child to another.
- **Athlete Profiles:** Edit names, ages, and target sports.
- **Quality Weights Reference Card:** Built-in in-app reference guide.

### 8. Multi-Device Sync & CSV Export
- **JSON Backup & Restore:** Complete multi-table export to transfer data between iPhone, iPad, and PC.
- **CSV Download:** Export complete datasets formatted with detailed intensity breakdowns for Excel and Google Sheets.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start local dev server (accessible across local network for iPhone preview)
npm run dev -- --host

# Build for production
npm run build
```

---

## 🌐 Deploying to GitHub Pages

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. The [dist](dist) folder is built with relative base paths (`./`) and includes the service worker and manifest ready for GitHub Pages hosting.
3. Push to your GitHub repository and enable **GitHub Pages** (Settings $\rightarrow$ Pages $\rightarrow$ select your deployment branch / `/dist` folder or use GitHub Actions).
