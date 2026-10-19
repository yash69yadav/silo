# ⚙️ SUBTERRANEAN SILO 18

> **Interactive Vertical Cutaway & Telemetry HUD**  
> A cinematic, scroll-driven subterranean exploration experience inspired by Apple TV's *Silo*. Descend 26 subterranean tiers down to the geothermal core with dynamic real-time telemetry, procedural Web Audio soundscapes, and atmospheric depth visual effects.

---

## 🚀 Features

- **Vertical Descent System**: Fluid, scroll-synchronized exploration spanning from Level 01 (Surface Airlock) down through Mechanical, Hydroponics, IT Central, and deep Geothermal Core depths (-1,200m).
- **Procedural Web Audio Engine**: Custom real-time audio synthesis that shifts tone, drone frequencies, and acoustic reverberation as depth increases.
- **Cyberpunk / Sci-Fi HUD**: Real-time telemetry indicators (atmospheric pressure, radiation levels, oxygen saturation, structural integrity, seismic monitoring).
- **Interactive Cutaway Modules**: Clickable facility stations with detailed lore, schematics, and personnel quotas.
- **Atmospheric Visuals**: Toggleable CRT scanline overlays, blueprint grid, and dust particle simulation.

---

## 🛠️ Tech Stack

- **HTML5** (Semantic structure & accessible HUD)
- **Vanilla CSS3** (Custom properties, grid systems, glowing neon aesthetics, responsive layout)
- **JavaScript (ES6+)** (Custom Web Audio API synthesizer, intersection observer, telemetry physics engine)
- **Node.js** (Lightweight local static server)

---

## 💻 Getting Started Locally

### Option 1: Direct in Browser
Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local Node Server
Run the included lightweight server:
```bash
node server.js
```
Then visit: `http://localhost:8085`

---

## 📂 Project Structure

```
├── assets/
│   └── silo_concept.jpg   # Concept cross-section artwork
├── index.html              # Main application markup & HUD layout
├── style.css               # Design system, styling & visual effects
├── script.js               # Web Audio API, scroll physics & telemetry logic
├── server.js               # Node.js development server
└── README.md
```

---

## 👤 Author

- **Yash Yadav** - [@yash69yadav](https://github.com/yash69yadav)
