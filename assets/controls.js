/**
 * Interface AI - Theme Toggle & Offline Soft Rock Audio Controller
 */
(function () {
  'use strict';

  /* ==========================================================================
     1. Light / Dark Theme Controller
     ========================================================================== */
  var themeToggleBtn = document.getElementById('theme-toggle');

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem('interface_theme');
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme, save) {
    if (save) {
      try {
        localStorage.setItem('interface_theme', theme);
      } catch (e) {}
    }
    document.documentElement.setAttribute('data-theme', theme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      themeToggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

      var sunIcon = themeToggleBtn.querySelector('.icon-sun');
      var moonIcon = themeToggleBtn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === 'dark' ? 'block' : 'none';
        moonIcon.style.display = theme === 'dark' ? 'none' : 'block';
      }
    }

    var fallbackLogos = document.querySelectorAll('.logo-picture img:not(.logo-light):not(.logo-dark)');
    fallbackLogos.forEach(function (img) {
      img.src = theme === 'dark' ? 'assets/logo-dark.svg' : 'assets/logo-light.svg';
    });
  }

  var initialTheme = getStoredTheme() || getSystemTheme();
  applyTheme(initialTheme, false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || initialTheme;
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? 'dark' : 'light', false);
      }
    });
  }

  /* ==========================================================================
     2. Music Engine: Offline Soft Rock Audio + Ambient Synthesizer
     ========================================================================== */
  var musicToggleBtn = document.getElementById('music-toggle');
  var musicMenuBtn = document.getElementById('music-menu-btn');
  var musicPopover = document.getElementById('music-popover');
  var volumeSlider = document.getElementById('music-volume');
  var currentTrackLabel = document.getElementById('current-track-name');

  if (!musicToggleBtn) return;

  // Offline music collection on top, followed by ambient synthesizer
  var tracks = {
    'summer-is-gone': {
      title: 'Summer Is Gone',
      artist: 'Zambolino',
      badge: 'Soft Rock · Offline',
      source: 'local',
      src: 'assets/audio/summer-is-gone.mp3'
    },
    'reflection': {
      title: 'Reflection',
      artist: 'Hazelwood',
      badge: 'Soft Rock · Offline',
      source: 'local',
      src: 'assets/audio/reflection.mp3'
    },
    'joshua-tree': {
      title: 'Joshua Tree',
      artist: 'Guillermo Guareschi',
      badge: 'Soft Rock · Offline',
      source: 'local',
      src: 'assets/audio/joshua-tree.mp3'
    },
    'silhouette': {
      title: 'Silhouette',
      artist: 'Moavii',
      badge: 'Soft Rock · Offline',
      source: 'local',
      src: 'assets/audio/silhouette.mp3'
    },
    'ambient-synth': {
      title: 'Ambient AI Flow',
      artist: 'Procedural Synth',
      badge: 'Web Audio API',
      source: 'synth'
    }
  };

  var selectedType = localStorage.getItem('interface_music_type') || 'summer-is-gone';
  if (!tracks[selectedType]) selectedType = 'summer-is-gone';

  var storedVol = localStorage.getItem('interface_music_vol');
  var volume = 20; // Default to 20%
  if (storedVol !== null && localStorage.getItem('interface_vol_v2') === 'true') {
    volume = parseInt(storedVol, 10);
  } else {
    volume = 20;
    localStorage.setItem('interface_music_vol', '20');
    localStorage.setItem('interface_vol_v2', 'true');
  }
  if (volumeSlider) volumeSlider.value = volume;

  var isPlaying = false;

  // HTML5 Audio element for offline playback
  var localAudio = document.getElementById('local-audio');
  if (!localAudio) {
    localAudio = document.createElement('audio');
    localAudio.id = 'local-audio';
    localAudio.loop = true;
    localAudio.preload = 'metadata';
    document.body.appendChild(localAudio);
  }

  // Web Audio Synthesizer State (for Ambient Synth option)
  var audioCtx = null;
  var masterGain = null;
  var oscillators = [];
  var lfo = null;

  function updateUIState(playing) {
    isPlaying = playing;
    musicToggleBtn.classList.toggle('is-playing', playing);
    if (musicPopover) musicPopover.classList.toggle('is-playing', playing);

    var currentTrack = tracks[selectedType] || tracks['summer-is-gone'];
    musicToggleBtn.setAttribute('title', playing ? 'Pause ' + currentTrack.title : 'Play ' + currentTrack.title);
    musicToggleBtn.setAttribute('aria-label', playing ? 'Pause ' + currentTrack.title : 'Play ' + currentTrack.title);

    if (currentTrackLabel) {
      currentTrackLabel.textContent = currentTrack.title;
    }

    // Highlight active track in popover
    document.querySelectorAll('.music-type-option').forEach(function (opt) {
      var type = opt.getAttribute('data-type');
      opt.classList.toggle('is-selected', type === selectedType);
      var radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = (type === selectedType);
    });
  }

  /* --- Web Audio Synthesizer Logic --- */
  function initWebAudio() {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;

    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

    var filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);
    filter.Q.setValueAtTime(2, audioCtx.currentTime);

    lfo = audioCtx.createOscillator();
    var lfoGain = audioCtx.createGain();
    lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime);
    lfoGain.gain.setValueAtTime(140, audioCtx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    var freqs = [87.31, 130.81, 220.0, 261.63, 329.63, 392.0];
    var types = ['sine', 'triangle', 'sine', 'sine', 'triangle', 'sine'];

    oscillators = freqs.map(function (freq, i) {
      var osc = audioCtx.createOscillator();
      var oscGain = audioCtx.createGain();
      osc.type = types[i] || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      var detune = (i % 2 === 0 ? 1 : -1) * (i * 2.5);
      osc.detune.setValueAtTime(detune, audioCtx.currentTime);
      var vol = 0.12 / (1 + i * 0.4);
      oscGain.gain.setValueAtTime(vol, audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      return osc;
    });

    filter.connect(masterGain);
    masterGain.connect(audioCtx.destination);
    return true;
  }

  function startSynth() {
    if (!audioCtx && !initWebAudio()) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    var targetGain = (volume / 100) * 0.22;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(targetGain, audioCtx.currentTime + 1.2);
    updateUIState(true);
  }

  function stopSynth() {
    if (!audioCtx || !masterGain) return;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
  }

  /* --- Unified Audio Controls --- */
  function startPlay() {
    var cur = tracks[selectedType];
    if (cur.source === 'local') {
      stopSynth();
      if (!localAudio.src.endsWith(cur.src)) {
        localAudio.src = cur.src;
      }
      localAudio.volume = volume / 100;
      localAudio.play().then(function () {
        updateUIState(true);
      }).catch(function (err) {
        console.warn('Audio play error:', err);
      });
    } else {
      localAudio.pause();
      startSynth();
    }
  }

  function pausePlay() {
    localAudio.pause();
    stopSynth();
    updateUIState(false);
  }

  function switchTrack(newType) {
    if (!tracks[newType]) return;
    var wasPlaying = isPlaying;
    selectedType = newType;
    localStorage.setItem('interface_music_type', newType);

    var cur = tracks[newType];
    if (cur.source === 'local') {
      stopSynth();
      localAudio.src = cur.src;
      localAudio.volume = volume / 100;
      if (wasPlaying) {
        localAudio.play().then(function () {
          updateUIState(true);
        });
      } else {
        updateUIState(false);
      }
    } else {
      localAudio.pause();
      if (wasPlaying) {
        startSynth();
      } else {
        updateUIState(false);
      }
    }
  }

  // Toggle main button
  musicToggleBtn.addEventListener('click', function () {
    if (isPlaying) {
      pausePlay();
    } else {
      startPlay();
    }
  });

  // Toggle dropdown popover
  if (musicMenuBtn && musicPopover) {
    musicMenuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isHidden = musicPopover.hasAttribute('hidden');
      if (isHidden) {
        musicPopover.removeAttribute('hidden');
      } else {
        musicPopover.setAttribute('hidden', '');
      }
    });

    document.addEventListener('click', function (e) {
      if (!musicPopover.contains(e.target) && !musicMenuBtn.contains(e.target)) {
        musicPopover.setAttribute('hidden', '');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !musicPopover.hasAttribute('hidden')) {
        musicPopover.setAttribute('hidden', '');
      }
    });
  }

  // Track selection in popover
  document.querySelectorAll('.music-type-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var type = this.getAttribute('data-type');
      if (type) {
        switchTrack(type);
        if (!isPlaying) {
          startPlay();
        }
      }
    });
  });

  // Volume slider handler
  if (volumeSlider) {
    volumeSlider.addEventListener('input', function () {
      volume = parseInt(this.value, 10);
      localStorage.setItem('interface_music_vol', volume);

      localAudio.volume = volume / 100;

      if (audioCtx && masterGain && isPlaying) {
        var targetGain = (volume / 100) * 0.22;
        masterGain.gain.setValueAtTime(targetGain, audioCtx.currentTime);
      }
    });
  }

  // Tab visibility: pause audio when hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (isPlaying) {
        localAudio.pause();
        stopSynth();
      }
    } else {
      if (isPlaying) {
        startPlay();
      }
    }
  });

  // Handle audio track end (looping)
  localAudio.addEventListener('ended', function () {
    localAudio.currentTime = 0;
    localAudio.play();
  });

  // Initialize UI with initial state
  updateUIState(false);
})();
