/**
 * Optimized Music Player
 * Prev / Play-Pause / Next  +  Volume slider  +  Mute toggle
 */

(function () {
  'use strict';

  /* ── Track list ─────────────────────────────────────────── */
  const TRACKS = [
    { src: 'Assets/eagles.mp3',        label: 'Eagles — Hotel California', mode: 'eagles' },
    { src: 'Assets/interstellar.mp3',  label: 'Interstellar — Hans Zimmer', mode: 'ambient' },
    { src: 'Assets/demons_phonk.mp3',  label: 'Demons Phonk',              mode: 'phonk'  },
  ];

  /* ── State ──────────────────────────────────────────────── */
  let currentIndex = 0;
  let isPlaying    = false;
  let isMuted      = false;
  let lastVolume   = 0.6;
  let audio        = null;

  /* ── DOM refs ───────────────────────────────────────────── */
  const player      = document.getElementById('music-player');
  const toggleBtn   = document.getElementById('music-toggle');
  const prevBtn     = document.getElementById('music-prev');
  const nextBtn     = document.getElementById('music-next');
  const volumeBtn   = document.getElementById('music-volume-btn');
  const volumeSlider = document.getElementById('music-volume');
  const trackNameEl  = document.getElementById('music-track-name');

  if (!player || !toggleBtn) return;

  /* ── Audio init ─────────────────────────────────────────── */
  function initAudio() {
    if (audio) return;
    audio = new Audio();
    audio.preload = 'metadata';
    audio.volume  = lastVolume;

    audio.addEventListener('ended', () => {
      // Auto-advance to next track
      loadTrack((currentIndex + 1) % TRACKS.length, true);
    });

    audio.addEventListener('error', () => {
      console.warn('Audio playback error');
      isPlaying = false;
      updateUI();
    });
  }

  /* ── Load a track ───────────────────────────────────────── */
  function loadTrack(index, autoPlay) {
    if (index < 0 || index >= TRACKS.length) index = 0;
    currentIndex = index;

    initAudio();
    audio.src = TRACKS[index].src;
    audio.load();

    // Sync mode attribute for CSS theming
    player.setAttribute('data-mode', TRACKS[index].mode);

    // Update floating track name
    if (trackNameEl) trackNameEl.textContent = TRACKS[index].label;

    if (autoPlay || isPlaying) {
      isPlaying = true;
      audio.play().catch(err => {
        console.warn('Autoplay blocked:', err);
        isPlaying = false;
        updateUI();
      });
    }

    updateUI();
  }

  /* ── Play / Pause ───────────────────────────────────────── */
  function togglePlay() {
    initAudio();

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      if (!audio.src) loadTrack(currentIndex, false);
      audio.play().catch(err => {
        console.warn('Play failed:', err);
        isPlaying = false;
        updateUI();
      });
      isPlaying = true;
    }

    updateUI();
  }

  /* ── Volume helpers ─────────────────────────────────────── */
  function setVolume(vol) {
    vol = Math.max(0, Math.min(1, vol));
    initAudio();
    audio.volume = vol;
    lastVolume   = vol > 0 ? vol : lastVolume;
    isMuted      = vol === 0;

    if (volumeSlider) volumeSlider.value = vol;
    syncVolumeIcon(vol);
    player.setAttribute('data-muted', isMuted ? 'true' : 'false');
  }

  function syncVolumeIcon(vol) {
    if (!volumeBtn) return;
    const icon = volumeBtn.querySelector('i');
    if (!icon) return;
    if (vol === 0 || isMuted) {
      icon.className = 'fas fa-volume-mute';
    } else if (vol < 0.5) {
      icon.className = 'fas fa-volume-down';
    } else {
      icon.className = 'fas fa-volume-up';
    }
  }

  function toggleMute() {
    initAudio();
    if (isMuted) {
      setVolume(lastVolume || 0.6);
    } else {
      lastVolume = audio.volume || 0.6;
      setVolume(0);
    }
  }

  /* ── UI sync ────────────────────────────────────────────── */
  function updateUI() {
    // Play/pause icon
    const playIcon = toggleBtn.querySelector('i');
    if (playIcon) {
      playIcon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
    } else {
      toggleBtn.innerHTML = isPlaying
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';
    }

    // Player playing class (drives CSS pulse + track badge visibility)
    player.classList.toggle('playing', isPlaying);
    player.setAttribute('data-playing', isPlaying ? 'true' : 'false');
  }

  /* ── Event listeners ────────────────────────────────────── */
  toggleBtn.addEventListener('click', togglePlay);

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prev = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
      loadTrack(prev, isPlaying);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const next = (currentIndex + 1) % TRACKS.length;
      loadTrack(next, isPlaying);
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      setVolume(parseFloat(volumeSlider.value));
    });
  }

  if (volumeBtn) {
    volumeBtn.addEventListener('click', toggleMute);
  }

  // Right-click anywhere on player → next track (old UX preserved)
  player.addEventListener('contextmenu', e => {
    e.preventDefault();
    const next = (currentIndex + 1) % TRACKS.length;
    loadTrack(next, isPlaying);
  });

  /* ── Init ───────────────────────────────────────────────── */
  loadTrack(0, false);            // Preload first track, don't auto-play
  if (volumeSlider) volumeSlider.value = lastVolume;
  syncVolumeIcon(lastVolume);

  /* ── Expose to window for external access ───────────────── */
  window.musicPlayer = {
    play:  () => { if (!isPlaying) togglePlay(); },
    pause: () => { if (isPlaying)  togglePlay(); },
    next:  () => loadTrack((currentIndex + 1) % TRACKS.length, isPlaying),
    prev:  () => loadTrack((currentIndex - 1 + TRACKS.length) % TRACKS.length, isPlaying),
    setVolume,
  };
})();
