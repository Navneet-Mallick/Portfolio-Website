/**
 * Typing Effect — clean rewrite
 */

(function () {
  const el = document.getElementById('typing-text');
  const cursor = document.querySelector('.cursor');
  if (!el) return;

  const phrases = [
    'a Web Developer',
    'an ML/DS Enthusiast',
    'a Computer Engineering Student',
    'a Graphics Designer',
  ];

  let phraseIndex = 0;
  let charIndex    = 0;
  let deleting     = false;
  let paused       = false;

  function tick() {
    if (paused) return;

    const current = phrases[phraseIndex];

    if (!deleting) {
      // Type forward
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        // Finished typing — pause then start deleting
        paused = true;
        setTimeout(() => { paused = false; deleting = true; tick(); }, 1800);
        return;
      }
      setTimeout(tick, 90 + Math.random() * 40); // slight human variance
    } else {
      // Delete backward
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        // Finished deleting — move to next phrase
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        paused = true;
        setTimeout(() => { paused = false; tick(); }, 400);
        return;
      }
      setTimeout(tick, 45);
    }
  }

  // Start after a short delay so page loads first
  setTimeout(tick, 800);
})();
