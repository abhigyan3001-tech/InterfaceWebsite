/**
 * Interface AI - Dynamic Network Background Canvas
 * Visual Metaphor: Unstructured data points floating organically,
 * forming structured API integrations and data mappings when in proximity.
 */
(function () {
  'use strict';

  var canvas = document.getElementById('network-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Configuration
  var config = {
    maxDist: 140,              // Max distance for drawing connection lines
    particleSpeed: 0.45,       // Subtle organic drift speed
    baseNodeRadius: 2.2,       // Base particle radius
    lineAlphaMax: 0.14,        // Max opacity for connection lines (10-15%)
    nodeAlpha: 0.35,           // Opacity for particle nodes (subtle)
    packetChance: 0.008,       // Probability of a data packet traversing a connection
    packetSpeed: 0.018         // Speed of data packet
  };

  // State
  var width = 0;
  var height = 0;
  var dpr = 1;
  var particles = [];
  var packets = [];
  var animFrameId = null;
  var isReducedMotion = false;
  var isVisible = true;

  // Check accessibility motion preference
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  isReducedMotion = motionQuery.matches;

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', function (e) {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        stopAnimation();
        drawStaticFrame();
      } else {
        startAnimation();
      }
    });
  }

  // Parse color string (hex or rgb) into RGB components
  function parseColor(str) {
    if (!str) return { r: 7, g: 141, b: 144 };
    str = str.trim();
    if (str.startsWith('#')) {
      var hex = str.slice(1);
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      var num = parseInt(hex, 16);
      return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
      };
    }
    var rgbMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1], 10),
        g: parseInt(rgbMatch[2], 10),
        b: parseInt(rgbMatch[3], 10)
      };
    }
    return { r: 7, g: 141, b: 144 };
  }

  // Dynamically read CSS variables for current theme
  var cachedColors = null;
  function updateThemeColors() {
    var styles = getComputedStyle(document.documentElement);
    var teal = styles.getPropertyValue('--teal').trim() || '#078d90';
    var aqua = styles.getPropertyValue('--aqua').trim() || '#19bdb3';
    var ink = styles.getPropertyValue('--ink').trim() || '#173849';
    cachedColors = {
      primary: parseColor(teal),
      accent: parseColor(aqua),
      ink: parseColor(ink)
    };
  }

  // Particle constructor
  function Particle(x, y) {
    this.x = x !== undefined ? x : Math.random() * width;
    this.y = y !== undefined ? y : Math.random() * height;
    var angle = Math.random() * Math.PI * 2;
    var speed = (Math.random() * 0.5 + 0.5) * config.particleSpeed;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = Math.random() * 1.4 + config.baseNodeRadius;
    this.isAccent = Math.random() > 0.75;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap-around or smooth bounce at viewport edges
    if (this.x < 0) { this.x = 0; this.vx *= -1; }
    else if (this.x > width) { this.x = width; this.vx *= -1; }
    if (this.y < 0) { this.y = 0; this.vy *= -1; }
    else if (this.y > height) { this.y = height; this.vy *= -1; }
  };

  // Data packet traveling along an API connection pipeline
  function Packet(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
    this.progress = 0;
    this.speed = config.packetSpeed * (Math.random() * 0.4 + 0.8);
  }

  Packet.prototype.update = function () {
    this.progress += this.speed;
    return this.progress < 1;
  };

  Packet.prototype.draw = function (colors) {
    var c = colors.accent;
    var curX = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
    var curY = this.p1.y + (this.p2.y - this.p1.y) * this.progress;
    ctx.beginPath();
    ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(' + c.r + ',' + c.g + ',' + c.b + ', 0.5)';
    ctx.fill();
  };

  function initParticles() {
    // Density-based count: ~1 particle per 18,000 sq pixels, bounded between 28 and 85
    var targetCount = Math.min(Math.max(Math.floor((width * height) / 18000), 28), 85);
    particles = [];
    packets = [];
    for (var i = 0; i < targetCount; i++) {
      particles.push(new Particle());
    }
  }

  function resize() {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    dpr = window.devicePixelRatio || 1;

    width = newWidth;
    height = newHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    updateThemeColors();
    initParticles();

    if (isReducedMotion) {
      drawStaticFrame();
    }
  }

  function render(animate) {
    if (!ctx || width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);

    var colors = cachedColors || {
      primary: { r: 7, g: 141, b: 144 },
      accent: { r: 25, g: 189, b: 179 },
      ink: { r: 23, g: 56, b: 73 }
    };

    var maxDistSq = config.maxDist * config.maxDist;
    var pLen = particles.length;

    // Draw connection lines (Integrations / Data Mapping)
    for (var i = 0; i < pLen; i++) {
      var p1 = particles[i];
      if (animate) p1.update();

      for (var j = i + 1; j < pLen; j++) {
        var p2 = particles[j];
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        var distSq = dx * dx + dy * dy;

        if (distSq < maxDistSq) {
          var dist = Math.sqrt(distSq);
          var alpha = (1 - dist / config.maxDist) * config.lineAlphaMax;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(' + colors.primary.r + ',' + colors.primary.g + ',' + colors.primary.b + ',' + alpha.toFixed(4) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Occasionally spawn a subtle data packet between connected nodes
          if (animate && Math.random() < config.packetChance && packets.length < 10) {
            packets.push(new Packet(p1, p2));
          }
        }
      }

      // Draw particle (Data point)
      var pColor = p1.isAccent ? colors.accent : colors.primary;
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + pColor.r + ',' + pColor.g + ',' + pColor.b + ',' + config.nodeAlpha + ')';
      ctx.fill();
    }

    // Update and draw active data packets
    if (animate) {
      for (var k = packets.length - 1; k >= 0; k--) {
        var pkt = packets[k];
        if (pkt.update()) {
          pkt.draw(colors);
        } else {
          packets.splice(k, 1);
        }
      }
    }
  }

  function loop() {
    if (!isVisible || isReducedMotion) return;
    render(true);
    animFrameId = requestAnimationFrame(loop);
  }

  function startAnimation() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    if (!isReducedMotion && isVisible) {
      animFrameId = requestAnimationFrame(loop);
    }
  }

  function stopAnimation() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function drawStaticFrame() {
    stopAnimation();
    render(false);
  }

  // Handle tab visibility changes to save battery & CPU
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      isVisible = false;
      stopAnimation();
    } else {
      isVisible = true;
      if (!isReducedMotion) {
        startAnimation();
      }
    }
  });

  // Window resize handler
  window.addEventListener('resize', resize, { passive: true });

  // Optional: Listen to theme changes if data-theme or class changes on html
  if (window.MutationObserver) {
    var themeObserver = new MutationObserver(function () {
      updateThemeColors();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
  }

  // Initialize
  resize();
  if (isReducedMotion) {
    drawStaticFrame();
  } else {
    startAnimation();
  }
})();
