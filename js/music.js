/**
 * Optimized Music Player - Minimal
 * Lightweight, performant audio playback
 */

(function() {
  const TRACKS = [
    'Assets/eagles.mp3',
    'Assets/interstellar.mp3',
    'Assets/demons_phonk.mp3',
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  let audio = null;

  const player = document.getElementById('music-player');
  const toggleBtn = document.getElementById('music-toggle');

  if (!player || !toggleBtn) return;

  // Initialize audio element
  function initAudio() {
    if (audio) return;
    audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = 0.6;
    
    audio.addEventListener('ended', () => {
      isPlaying = false;
      updateUI();
    });

    audio.addEventListener('error', () => {
      console.warn('Audio playback error');
      isPlaying = false;
      updateUI();
    });
  }

  // Load track
  function loadTrack(index) {
    if (index < 0 || index >= TRACKS.length) index = 0;
    currentTrackIndex = index;
    
    initAudio();
    audio.src = TRACKS[index];
    
    if (isPlaying) {
      audio.play().catch(err => {
        console.warn('Autoplay blocked:', err);
        isPlaying = false;
        updateUI();
      });
    }
  }

  // Toggle play/pause
  function togglePlay() {
    initAudio();
    
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      if (!audio.src) loadTrack(currentTrackIndex);
      audio.play().catch(err => {
        console.warn('Play failed:', err);
        isPlaying = false;
      });
      isPlaying = true;
    }
    
    updateUI();
  }

  // Update UI
  function updateUI() {
    if (isPlaying) {
      toggleBtn.innerHTML = '<i class="fas fa-pause"></i>';
      player.classList.add('playing');
    } else {
      toggleBtn.innerHTML = '<i class="fas fa-play"></i>';
      player.classList.remove('playing');
    }
  }

  // Event listeners
  toggleBtn.addEventListener('click', togglePlay);
  
  // Right-click to next track
  player.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    loadTrack((currentTrackIndex + 1) % TRACKS.length);
    if (isPlaying) audio.play().catch(err => console.warn('Play failed:', err));
  });

  // Initialize with first track
  loadTrack(0);

  // Expose to window for external access
  window.musicPlayer = {
    play: () => { isPlaying = false; togglePlay(); },
    pause: () => { isPlaying = true; togglePlay(); },
    next: () => loadTrack((currentTrackIndex + 1) % TRACKS.length),
  };
})();
