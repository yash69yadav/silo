/**
 * SUBTERRANEAN SILO 18 // INTERACTIVE VERTICAL CUTAWAY & SCROLL ENGINE
 * Pure Vanilla HTML5 / CSS3 / JavaScript
 * Features:
 *  - Inertial scroll scrubbing & camera translation
 *  - Real-time multi-metric HUD telemetry
 *  - Procedural Web Audio API soundscape & crossfading
 *  - Depth-reactive atmospheric canvas particle physics
 *  - Contextual glassmorphic cards with tabs
 *  - Elevator jump rail & interactive hotspot inspection
 */

(function () {
  'use strict';

  // =========================================================================
  // SECTOR METADATA & CONFIGURATION
  // =========================================================================
  const SECTORS = [
    {
      id: 0,
      name: "SURFACE HATCH & AIRLOCK",
      levels: "L0",
      levelsFull: "LEVEL 00",
      depthStart: 0,
      depthEnd: -60,
      scrollRange: [0.00, 0.12],
      themeClass: "theme-surface",
      accent: "#94a3b8",
      accentGlow: "rgba(148, 163, 184, 0.4)",
      baseTemp: -14,
      o2Purity: 18.5,
      pressure: 1.01,
      radiation: "4.2 µSv/h",
      audioTone: "wind"
    },
    {
      id: 1,
      name: "RESIDENTIAL HABITATION",
      levels: "L1–L4",
      levelsFull: "LEVEL 01–04",
      depthStart: -60,
      depthEnd: -280,
      scrollRange: [0.12, 0.32],
      themeClass: "theme-residential",
      accent: "#f59e0b",
      accentGlow: "rgba(245, 158, 11, 0.45)",
      baseTemp: 21,
      o2Purity: 21.0,
      pressure: 1.08,
      radiation: "0.08 µSv/h",
      audioTone: "ventilation"
    },
    {
      id: 2,
      name: "BIOSPHERIC AGRICULTURE",
      levels: "L5–L10",
      levelsFull: "LEVEL 05–10",
      depthStart: -280,
      depthEnd: -580,
      scrollRange: [0.32, 0.52],
      themeClass: "theme-agriculture",
      accent: "#10b981",
      accentGlow: "rgba(16, 185, 129, 0.45)",
      baseTemp: 24,
      o2Purity: 21.4,
      pressure: 1.15,
      radiation: "0.05 µSv/h",
      audioTone: "mist"
    },
    {
      id: 3,
      name: "DATA VAULTS & CENTRAL IT",
      levels: "L11–L16",
      levelsFull: "LEVEL 11–16",
      depthStart: -580,
      depthEnd: -950,
      scrollRange: [0.52, 0.72],
      themeClass: "theme-datavaults",
      accent: "#06b6d4",
      accentGlow: "rgba(6, 182, 212, 0.45)",
      baseTemp: -5,
      o2Purity: 20.8,
      pressure: 1.28,
      radiation: "0.14 µSv/h",
      audioTone: "servers"
    },
    {
      id: 4,
      name: "HEAVY INDUSTRY & MANUFACTURING",
      levels: "L17–L21",
      levelsFull: "LEVEL 17–21",
      depthStart: -950,
      depthEnd: -1280,
      scrollRange: [0.72, 0.88],
      themeClass: "theme-industry",
      accent: "#f97316",
      accentGlow: "rgba(249, 115, 22, 0.5)",
      baseTemp: 58,
      o2Purity: 20.2,
      pressure: 1.45,
      radiation: "0.22 µSv/h",
      audioTone: "factory"
    },
    {
      id: 5,
      name: "GEOTHERMAL REACTOR CORE",
      levels: "L22–L26",
      levelsFull: "LEVEL 22–26",
      depthStart: -1280,
      depthEnd: -1440,
      scrollRange: [0.88, 1.00],
      themeClass: "theme-reactor",
      accent: "#ef4444",
      accentGlow: "rgba(239, 68, 68, 0.55)",
      baseTemp: 240,
      o2Purity: 19.1,
      pressure: 1.62,
      radiation: "0.85 µSv/h",
      audioTone: "magma"
    }
  ];

  // DOM Elements
  const siloTrack = document.getElementById('silo-track');
  const siloArtWrapper = document.getElementById('silo-art-wrapper');
  const siloImage = document.getElementById('silo-image');
  const elevatorCabin = document.getElementById('elevator-cabin');
  const atmosphereCanvas = document.getElementById('atmosphere-canvas');

  // HUD Elements
  const hudDepth = document.getElementById('hud-depth');
  const hudLevel = document.getElementById('hud-level');
  const hudTemp = document.getElementById('hud-temp');
  const hudO2 = document.getElementById('hud-o2');
  const hudProgressFill = document.getElementById('hud-progress-fill');
  const sectorPill = document.getElementById('sector-pill');
  const sectorPillLabel = document.getElementById('sector-pill-label');
  const reticleDepth = document.getElementById('reticle-depth');
  const hudClock = document.getElementById('hud-clock');

  // Rail & Controls
  const jumpRail = document.getElementById('jump-rail');
  const railCursor = document.getElementById('rail-cursor');
  const railPips = document.querySelectorAll('.rail-pip');
  const railDescentPercent = document.getElementById('rail-descent-percent');

  // Sector Cards
  const sectorCards = document.querySelectorAll('.sector-card');

  // Footer Indicators
  const footerStatusName = document.getElementById('footer-status-name');
  const footerPressure = document.getElementById('footer-pressure');
  const footerGeiger = document.getElementById('footer-geiger');
  const footerVent = document.getElementById('footer-vent');

  // Action Buttons
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const audioBtnLabel = document.getElementById('audio-btn-label');
  const eqBars = document.getElementById('eq-bars');
  const btnPatrol = document.getElementById('btn-patrol');
  const btnEmergency = document.getElementById('btn-emergency');
  const emergencyBanner = document.getElementById('emergency-banner');

  // Audio Banner
  const audioBanner = document.getElementById('audio-banner');
  const btnEnableAudio = document.getElementById('btn-enable-audio');
  const btnDismissAudio = document.getElementById('btn-dismiss-audio');

  // Viewport Tools
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomReset = document.getElementById('btn-zoom-reset');
  const btnGridToggle = document.getElementById('btn-grid-toggle');
  const btnScanlinesToggle = document.getElementById('btn-scanlines-toggle');
  const blueprintGrid = document.getElementById('blueprint-grid');
  const crtOverlay = document.getElementById('crt-overlay');

  // Hotspot Modal
  const hotspotModal = document.getElementById('hotspot-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // State Variables
  let currentScrollProgress = 0;
  let targetScrollProgress = 0;
  let activeSectorIndex = -1;
  let zoomLevel = 1.0;
  let isPatrolling = false;
  let patrolDirection = 1;
  let patrolSpeed = 0.0006;
  let isEmergencyMode = false;

  // =========================================================================
  // SOUND ENGINE (Web Audio API Synthesizer)
  // =========================================================================
  class SoundscapeEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = true;
      this.isInitialized = false;

      // Audio Nodes
      this.masterGain = null;
      this.windGain = null;
      this.subDroneGain = null;
      this.techDroneGain = null;
      this.magmaGain = null;
      this.alarmOsc = null;
      this.alarmGain = null;

      // Procedural Noise Sources
      this.noiseBuffer = null;
    }

    init() {
      if (this.isInitialized) return;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Build white noise buffer for atmospheric wind / mist
        const bufferSize = this.ctx.sampleRate * 4;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        // 1. Surface Wind Generator
        const windSource = this.ctx.createBufferSource();
        windSource.buffer = this.noiseBuffer;
        windSource.loop = true;
        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 380;
        windFilter.Q.value = 3.5;
        this.windGain = this.ctx.createGain();
        this.windGain.gain.value = 0.4;
        windSource.connect(windFilter);
        windFilter.connect(this.windGain);
        this.windGain.connect(this.masterGain);
        windSource.start();

        // 2. Subterranean Ventilation & Reactor Low Drone (Sub 55Hz)
        const subOsc = this.ctx.createOscillator();
        subOsc.type = 'sawtooth';
        subOsc.frequency.value = 52;
        const subFilter = this.ctx.createBiquadFilter();
        subFilter.type = 'lowpass';
        subFilter.frequency.value = 110;
        this.subDroneGain = this.ctx.createGain();
        this.subDroneGain.gain.value = 0.25;
        subOsc.connect(subFilter);
        subFilter.connect(this.subDroneGain);
        this.subDroneGain.connect(this.masterGain);
        subOsc.start();

        // 3. Data Vault Server High-Frequency Chime / Beep Drone
        const techOsc = this.ctx.createOscillator();
        techOsc.type = 'triangle';
        techOsc.frequency.value = 440;
        const techFilter = this.ctx.createBiquadFilter();
        techFilter.type = 'bandpass';
        techFilter.frequency.value = 1200;
        techFilter.Q.value = 4.0;
        this.techDroneGain = this.ctx.createGain();
        this.techDroneGain.gain.value = 0.05;
        techOsc.connect(techFilter);
        techFilter.connect(this.techDroneGain);
        this.techDroneGain.connect(this.masterGain);
        techOsc.start();

        // 4. Geothermal Magma Boiling Low Resonance (35Hz)
        const magmaOsc = this.ctx.createOscillator();
        magmaOsc.type = 'sine';
        magmaOsc.frequency.value = 38;
        this.magmaGain = this.ctx.createGain();
        this.magmaGain.gain.value = 0.01;
        magmaOsc.connect(this.magmaGain);
        this.magmaGain.connect(this.masterGain);
        magmaOsc.start();

        this.isInitialized = true;
      } catch (err) {
        console.warn("Web Audio API not supported or blocked:", err);
      }
    }

    start() {
      if (!this.isInitialized) this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isMuted = false;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.55, this.ctx.currentTime + 0.8);
      eqBars.classList.add('playing');
      audioBtnLabel.textContent = "ACTIVE";
      btnAudioToggle.classList.add('active');
    }

    mute() {
      if (!this.ctx || !this.isInitialized) return;
      this.isMuted = true;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      eqBars.classList.remove('playing');
      audioBtnLabel.textContent = "MUTED";
      btnAudioToggle.classList.remove('active');
    }

    toggle() {
      if (this.isMuted) {
        this.start();
      } else {
        this.mute();
      }
    }

    // Adapt atmospheric sound layers dynamically to depth progress (0.0 to 1.0)
    updateAtmosphere(progress) {
      if (!this.ctx || !this.isInitialized || this.isMuted) return;
      const now = this.ctx.currentTime;

      // Surface Wind loudest near 0.0, zero below 0.35
      const windVol = Math.max(0, 0.45 * (1 - progress * 3.2));
      this.windGain.gain.setTargetAtTime(windVol, now, 0.2);

      // Low Subterranean Hum rises mid silo
      const subVol = 0.2 + progress * 0.4;
      this.subDroneGain.gain.setTargetAtTime(subVol, now, 0.2);

      // Tech Server Drone peaks around progress ~0.6 (IT data vaults)
      const distFromIT = Math.abs(progress - 0.62);
      const techVol = Math.max(0, 0.25 * (1 - distFromIT * 4.5));
      this.techDroneGain.gain.setTargetAtTime(techVol, now, 0.2);

      // Magma sub-bass rumble peaks at the very bottom (0.85 to 1.0)
      const magmaVol = Math.max(0, (progress - 0.75) * 2.8);
      this.magmaGain.gain.setTargetAtTime(magmaVol, now, 0.2);
    }

    // Play tactile mechanical UI click beep
    playClick(pitch = 800) {
      if (!this.ctx || !this.isInitialized || this.isMuted) return;
      try {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(pitch / 2, this.ctx.currentTime + 0.05);
        g.gain.setValueAtTime(0.12, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch (e) {}
    }

    // Play elevator deck transition chime
    playSectorChime(sectorIndex) {
      if (!this.ctx || !this.isInitialized || this.isMuted) return;
      try {
        const frequencies = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        const freq = frequencies[sectorIndex] || 520;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        g.gain.setValueAtTime(0.18, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.36);
      } catch (e) {}
    }

    // Emergency siren loop
    setEmergencyAlarm(active) {
      if (!this.ctx || !this.isInitialized) return;
      if (active) {
        if (!this.alarmOsc) {
          this.alarmOsc = this.ctx.createOscillator();
          this.alarmGain = this.ctx.createGain();
          this.alarmOsc.type = 'sawtooth';
          this.alarmOsc.frequency.setValueAtTime(400, this.ctx.currentTime);
          
          // LFO for wailing siren
          const lfo = this.ctx.createOscillator();
          lfo.frequency.value = 1.2;
          const lfoGain = this.ctx.createGain();
          lfoGain.gain.value = 250;
          lfo.connect(lfoGain);
          lfoGain.connect(this.alarmOsc.frequency);
          lfo.start();

          this.alarmGain.gain.value = this.isMuted ? 0 : 0.2;
          this.alarmOsc.connect(this.alarmGain);
          this.alarmGain.connect(this.ctx.destination);
          this.alarmOsc.start();
        } else if (this.alarmGain) {
          this.alarmGain.gain.value = this.isMuted ? 0 : 0.2;
        }
      } else {
        if (this.alarmOsc) {
          try {
            this.alarmOsc.stop();
            this.alarmOsc.disconnect();
          } catch (e) {}
          this.alarmOsc = null;
        }
      }
    }
  }

  const soundscape = new SoundscapeEngine();

  // =========================================================================
  // ATMOSPHERIC PARTICLE SIMULATION (Canvas Layer)
  // =========================================================================
  class ParticleEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.count = 130;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.currentSector = 0;

      this.resize();
      this.initParticles();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const dpr = window.devicePixelRatio || 1;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.round(this.width * dpr);
      this.canvas.height = Math.round(this.height * dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    initParticles() {
      this.particles = [];
      for (let i = 0; i < this.count; i++) {
        this.particles.push(this.createParticle());
      }
    }

    createParticle() {
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.7 + 0.2,
        life: Math.random() * 100,
        maxLife: Math.random() * 150 + 100
      };
    }

    setSector(sectorIndex) {
      this.currentSector = sectorIndex;
    }

    updateAndRender() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        p.life++;

        // Physics behavior customized per sector:
        if (this.currentSector === 0) {
          // Sector 0 (Surface): Toxic ash swirling sideways with gusty wind
          p.vx = -1.2 + Math.sin(p.life * 0.04) * 0.8;
          p.vy = 0.6 + Math.cos(p.life * 0.03) * 0.4;
          this.ctx.fillStyle = `rgba(180, 195, 215, ${p.alpha * 0.6})`;
        } else if (this.currentSector === 1) {
          // Sector 1 (Residential): Warm incandescent dust motes drifting gently
          p.vx = Math.sin(p.life * 0.02) * 0.4;
          p.vy = -0.3 + Math.cos(p.life * 0.02) * 0.2;
          this.ctx.fillStyle = `rgba(245, 185, 60, ${p.alpha * 0.75})`;
        } else if (this.currentSector === 2) {
          // Sector 2 (Agriculture): Bioluminescent green spores & aeroponic mist rising
          p.vx = Math.cos(p.life * 0.03) * 0.5;
          p.vy = -0.8 - Math.random() * 0.3;
          this.ctx.fillStyle = `rgba(34, 197, 94, ${p.alpha * 0.85})`;
        } else if (this.currentSector === 3) {
          // Sector 3 (Data Vaults): Neon cyan data packets and digital streams
          p.vx = 0;
          p.vy = (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 1.5);
          this.ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.9})`;
        } else if (this.currentSector === 4) {
          // Sector 4 (Industry): Hot orange welding sparks arching down
          p.vx = (Math.random() - 0.5) * 2.2;
          p.vy = 1.4 + Math.random() * 1.8;
          this.ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha * 0.95})`;
        } else {
          // Sector 5 (Reactor): Rising fiery molten embers floating upward rapidly
          p.vx = (Math.random() - 0.5) * 1.2;
          p.vy = -2.2 - Math.random() * 1.5;
          this.ctx.fillStyle = `rgba(239, 68, 68, ${p.alpha * 0.95})`;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;

        // Render particle
        this.ctx.beginPath();
        if (this.currentSector === 3) {
          // Square pixel data bit for servers
          this.ctx.fillRect(p.x, p.y, p.size * 1.5, p.size * 1.5);
        } else {
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  const particleEngine = new ParticleEngine(atmosphereCanvas);

  // =========================================================================
  // SCROLL & CAMERA ENGINE
  // =========================================================================

  function calculateTargetScrollProgress() {
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScrollable <= 0) return 0;
    const progress = window.scrollY / totalScrollable;
    return Math.max(0, Math.min(1, progress));
  }

  // Linear Interpolation helper
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // Update Telemetry & Camera on each frame
  function updateSiloEngine() {
    // Smooth inertial lerp towards target scroll
    currentScrollProgress = lerp(currentScrollProgress, targetScrollProgress, 0.12);

    // 1. SILO CUTAWAY ARTWORK TRANSLATION
    const windowH = window.innerHeight;
    const artHeight = siloArtWrapper.offsetHeight || (windowH * 3.2);
    const footerH = 54;
    const maxTranslateY = Math.max(0, artHeight - windowH + footerH + 20);
    const translateY = -currentScrollProgress * maxTranslateY;

    // Apply transform with zoom scale
    siloArtWrapper.style.transform = `translateY(${translateY}px) scale(${zoomLevel})`;

    // 2. ELEVATOR CAR POSITION
    // Elevator travels down central shaft along the artwork (2% to 94%)
    const cabinTopPercent = 3 + currentScrollProgress * 91;
    elevatorCabin.style.top = `${cabinTopPercent}%`;

    // 3. REAL-TIME DEPTH & LEVEL CALCULATIONS
    const depthMeters = Math.round(currentScrollProgress * 1440);
    const currentLevelNum = Math.min(26, Math.floor(currentScrollProgress * 27));
    const levelPadded = String(currentLevelNum).padStart(2, '0');

    // Telemetry readouts
    hudDepth.textContent = `-${depthMeters}m`;
    hudLevel.textContent = `LEVEL ${levelPadded}`;
    reticleDepth.textContent = `-${depthMeters}m`;

    // 4. TEMPERATURE INTERPOLATION ACCORDING TO SECTOR
    let calculatedTemp = -14;
    if (currentScrollProgress < 0.12) {
      // Surface: -14 to 12
      calculatedTemp = Math.round(-14 + (currentScrollProgress / 0.12) * 26);
    } else if (currentScrollProgress < 0.32) {
      // Residential: 18 to 22
      calculatedTemp = Math.round(18 + ((currentScrollProgress - 0.12) / 0.20) * 4);
    } else if (currentScrollProgress < 0.52) {
      // Bio Farms: 22 to 25
      calculatedTemp = Math.round(22 + ((currentScrollProgress - 0.32) / 0.20) * 3);
    } else if (currentScrollProgress < 0.72) {
      // Data Vaults: -5 to 10
      calculatedTemp = Math.round(-5 + ((currentScrollProgress - 0.52) / 0.20) * 15);
    } else if (currentScrollProgress < 0.88) {
      // Heavy Industry: 45 to 85
      calculatedTemp = Math.round(45 + ((currentScrollProgress - 0.72) / 0.16) * 40);
    } else {
      // Core: 120 to 240
      calculatedTemp = Math.round(120 + ((currentScrollProgress - 0.88) / 0.12) * 120);
    }
    hudTemp.textContent = `${calculatedTemp}°C`;

    // 5. O2 PURITY & SECTOR TELEMETRY
    let calculatedO2 = "21.0%";
    if (currentScrollProgress < 0.12) calculatedO2 = "18.5%";
    else if (currentScrollProgress < 0.32) calculatedO2 = "21.0%";
    else if (currentScrollProgress < 0.52) calculatedO2 = "21.4%";
    else if (currentScrollProgress < 0.72) calculatedO2 = "20.8%";
    else if (currentScrollProgress < 0.88) calculatedO2 = "20.2%";
    else calculatedO2 = "19.1%";
    hudO2.textContent = calculatedO2;

    // Elevation Progress bar
    hudProgressFill.style.width = `${currentScrollProgress * 100}%`;

    // Rail Cursor positioning along right elevator track
    const railPercent = currentScrollProgress * 100;
    railCursor.style.top = `calc(${currentScrollProgress * 88}% + 12px)`;
    railDescentPercent.textContent = `${Math.round(currentScrollProgress * 100)}% DESCENDED`;

    // 6. SECTOR DETECTION & ACTIVATION
    updateActiveSector(currentScrollProgress);

    // 7. DYNAMIC SOUNDSCAPE CROSSFADING
    soundscape.updateAtmosphere(currentScrollProgress);

    // 8. PARTICLE ENGINE RENDER LOOP
    particleEngine.updateAndRender();

    // Loop
    requestAnimationFrame(updateSiloEngine);
  }

  // Detect which sector the camera is traversing through
  function updateActiveSector(progress) {
    let foundSectorIndex = 0;
    for (let i = 0; i < SECTORS.length; i++) {
      const [start, end] = SECTORS[i].scrollRange;
      if (progress >= start && progress <= end) {
        foundSectorIndex = i;
        break;
      }
    }
    if (progress >= 0.99) foundSectorIndex = 5;

    if (foundSectorIndex !== activeSectorIndex) {
      // Sector switched!
      const previousIndex = activeSectorIndex;
      activeSectorIndex = foundSectorIndex;
      onSectorChanged(activeSectorIndex, previousIndex);
    }
  }

  // Sector Change Trigger
  function onSectorChanged(newIndex, prevIndex) {
    const sec = SECTORS[newIndex];
    if (!sec) return;

    // Play chime only when transitioning between sectors, not on initial load
    if (prevIndex !== -1) {
      soundscape.playSectorChime(newIndex);
    }

    // Update body theme
    document.body.className = `${sec.themeClass} ${isEmergencyMode ? 'emergency-active' : ''}`;

    // Update Sector Pill Label
    sectorPillLabel.textContent = `${sec.levels} • ${sec.name}`;

    // Update active Glassmorphic Card
    sectorCards.forEach((card, idx) => {
      if (idx === newIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update Jump Rail Pips
    railPips.forEach((pip, idx) => {
      if (idx === newIndex) {
        pip.classList.add('active');
      } else {
        pip.classList.remove('active');
      }
    });

    // Update footer indicators
    footerStatusName.textContent = `SECTOR: ${sec.name} // PRESSURIZED`;
    footerPressure.textContent = `${sec.pressure.toFixed(2)} ATM`;
    footerGeiger.textContent = sec.radiation;

    // Update particle emitter profile
    particleEngine.setSector(newIndex);
  }

  // Scroll & Wheel Event Listeners
  const syncScroll = () => {
    targetScrollProgress = calculateTargetScrollProgress();
  };
  window.addEventListener('scroll', syncScroll, { passive: true });
  window.addEventListener('wheel', syncScroll, { passive: true });
  window.addEventListener('touchmove', syncScroll, { passive: true });

  // =========================================================================
  // RAPID ELEVATOR SECTOR JUMP RAIL
  // =========================================================================
  railPips.forEach(pip => {
    pip.addEventListener('click', (e) => {
      e.preventDefault();
      const sectorIdx = parseInt(pip.getAttribute('data-sector'), 10);
      jumpToSector(sectorIdx);
    });
  });

  // Jump to Sector by index
  function jumpToSector(sectorIdx) {
    const sec = SECTORS[sectorIdx];
    if (!sec) return;

    soundscape.playClick(920);

    // Calculate middle of sector's range
    const targetP = (sec.scrollRange[0] + sec.scrollRange[1]) / 2;
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = targetP * totalScrollable;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  }

  // "Descend to Next Sector" buttons on cards
  document.querySelectorAll('.btn-jump-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSec = parseInt(btn.getAttribute('data-jump'), 10);
      jumpToSector(targetSec);
    });
  });

  // =========================================================================
  // GLASSMORPHIC CARD TABS
  // =========================================================================
  document.querySelectorAll('.sector-card').forEach(card => {
    const tabs = card.querySelectorAll('.tab-btn');
    const panes = card.querySelectorAll('.tab-pane');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        soundscape.playClick(650);
        const targetTab = tab.getAttribute('data-tab');

        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const activePane = card.querySelector(`.tab-pane[data-pane="${targetTab}"]`);
        if (activePane) activePane.classList.add('active');
      });
    });
  });

  // =========================================================================
  // INTERACTIVE HOTSPOT PINS & INSPECTION MODAL
  // =========================================================================
  document.querySelectorAll('.hotspot-pin').forEach(pin => {
    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = pin.getAttribute('data-title');
      const desc = pin.getAttribute('data-desc');
      const sector = pin.getAttribute('data-sector');

      soundscape.playClick(1100);
      openHotspotModal(title, desc, sector);
    });
  });

  function openHotspotModal(title, desc, sector) {
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    hotspotModal.classList.add('active');
    hotspotModal.setAttribute('aria-hidden', 'false');
  }

  function closeHotspotModal() {
    hotspotModal.classList.remove('active');
    hotspotModal.setAttribute('aria-hidden', 'true');
    soundscape.playClick(500);
  }

  modalCloseBtn.addEventListener('click', closeHotspotModal);
  hotspotModal.addEventListener('click', (e) => {
    if (e.target === hotspotModal) closeHotspotModal();
  });

  // =========================================================================
  // CAMERA VIEWPORT TOOLS (ZOOM, RESET, GRID, SCANLINES)
  // =========================================================================
  btnZoomIn.addEventListener('click', () => {
    zoomLevel = Math.min(2.0, zoomLevel + 0.2);
    soundscape.playClick(850);
  });

  btnZoomOut.addEventListener('click', () => {
    zoomLevel = Math.max(0.8, zoomLevel - 0.2);
    soundscape.playClick(650);
  });

  btnZoomReset.addEventListener('click', () => {
    zoomLevel = 1.0;
    soundscape.playClick(750);
  });

  btnGridToggle.addEventListener('click', () => {
    blueprintGrid.classList.toggle('disabled');
    btnGridToggle.classList.toggle('active');
    soundscape.playClick(800);
  });

  btnScanlinesToggle.addEventListener('click', () => {
    crtOverlay.classList.toggle('disabled');
    btnScanlinesToggle.classList.toggle('active');
    soundscape.playClick(800);
  });

  // =========================================================================
  // AUTO PATROL MODE (Automatic descent glide)
  // =========================================================================
  function togglePatrol() {
    isPatrolling = !isPatrolling;
    soundscape.playClick(isPatrolling ? 900 : 450);

    if (isPatrolling) {
      btnPatrol.classList.add('active');
      btnPatrol.querySelector('.btn-text').textContent = "PATROLLING...";
      runPatrolLoop();
    } else {
      btnPatrol.classList.remove('active');
      btnPatrol.querySelector('.btn-text').textContent = "AUTO PATROL";
    }
  }

  function runPatrolLoop() {
    if (!isPatrolling) return;
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    let nextScrollY = window.scrollY + patrolDirection * (patrolSpeed * totalScrollable);

    if (nextScrollY >= totalScrollable) {
      nextScrollY = totalScrollable;
      patrolDirection = -1; // Reverse upwards
    } else if (nextScrollY <= 0) {
      nextScrollY = 0;
      patrolDirection = 1; // Reverse downwards
    }

    window.scrollTo(0, nextScrollY);
    targetScrollProgress = calculateTargetScrollProgress();
    requestAnimationFrame(runPatrolLoop);
  }

  btnPatrol.addEventListener('click', togglePatrol);

  // =========================================================================
  // EMERGENCY LOCKDOWN PROTOCOL
  // =========================================================================
  function toggleEmergency() {
    isEmergencyMode = !isEmergencyMode;
    soundscape.playClick(isEmergencyMode ? 350 : 700);

    if (isEmergencyMode) {
      btnEmergency.classList.add('active');
      emergencyBanner.classList.add('active');
      document.body.classList.add('emergency-active');
      document.querySelector('.beacon-pulse').classList.add('alarm');
      footerStatusName.textContent = "⚠️ EMERGENCY LOCKDOWN ACTIVE // AIRLOCKS SEALED";
      soundscape.setEmergencyAlarm(true);
    } else {
      btnEmergency.classList.remove('active');
      emergencyBanner.classList.remove('active');
      document.body.classList.remove('emergency-active');
      document.querySelector('.beacon-pulse').classList.remove('alarm');
      const sec = SECTORS[activeSectorIndex];
      footerStatusName.textContent = `SECTOR: ${sec.name} // PRESSURIZED`;
      soundscape.setEmergencyAlarm(false);
    }
  }

  btnEmergency.addEventListener('click', toggleEmergency);

  // =========================================================================
  // AUDIO TOGGLE & FIRST VISIT BANNER
  // =========================================================================
  btnAudioToggle.addEventListener('click', () => {
    soundscape.toggle();
    if (!audioBanner.classList.contains('hidden')) {
      audioBanner.classList.add('hidden');
    }
  });

  btnEnableAudio.addEventListener('click', () => {
    soundscape.start();
    audioBanner.classList.add('hidden');
  });

  btnDismissAudio.addEventListener('click', () => {
    audioBanner.classList.add('hidden');
  });

  // Enable audio on first user click anywhere if they opted in
  window.addEventListener('click', () => {
    if (!soundscape.isInitialized && !soundscape.isMuted) {
      soundscape.init();
    }
  }, { once: true });

  // =========================================================================
  // KEYBOARD NAVIGATION
  // =========================================================================
  window.addEventListener('keydown', (e) => {
    // Esc closes modal
    if (e.key === 'Escape') {
      closeHotspotModal();
    }
    // Number keys 1-6 jump to sectors
    if (e.key >= '1' && e.key <= '6') {
      jumpToSector(parseInt(e.key, 10) - 1);
    }
    // 'M' toggles audio
    if (e.key.toLowerCase() === 'm') {
      soundscape.toggle();
    }
    // 'Space' toggles auto patrol (if not focused on an input)
    if (e.code === 'Space' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      togglePatrol();
    }
    // 'E' toggles emergency mode
    if (e.key.toLowerCase() === 'e') {
      toggleEmergency();
    }
    // 'G' toggles blueprint grid
    if (e.key.toLowerCase() === 'g') {
      blueprintGrid.classList.toggle('disabled');
      btnGridToggle.classList.toggle('active');
    }
    // 'C' toggles CRT scanlines
    if (e.key.toLowerCase() === 'c') {
      crtOverlay.classList.toggle('disabled');
      btnScanlinesToggle.classList.toggle('active');
    }
  });

  // =========================================================================
  // REAL-TIME SILO CLOCK TICKER
  // =========================================================================
  function updateSiloClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    hudClock.textContent = `DAY 14,291 • ${hours}:${mins}:${secs}`;
  }
  setInterval(updateSiloClock, 1000);
  updateSiloClock();

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  targetScrollProgress = calculateTargetScrollProgress();
  currentScrollProgress = targetScrollProgress;

  // Start engine loop
  requestAnimationFrame(updateSiloEngine);

})();
