/**
 * Terminal Animation Module — Enhanced
 */

(function () {
  const LINES = [
    { type: 'cmd',    text: 'whoami' },
    { type: 'output', parts: [{ cls: 't-accent', text: 'Navneet Mallick' }, { cls: '', text: ' — Computer Engineering Student' }] },
    { type: 'output', parts: [{ cls: 't-accent', text: 'Passionate About' }, { cls: '', text: ' Software Development and Programming' }] },

    { type: 'cmd',    text: 'cat about.txt' },
    { type: 'output', parts: [{ cls: 't-green', text: '📍 Location:' }, { cls: '', text: ' Dharan, Nepal' }] },
    { type: 'output', parts: [{ cls: 't-green', text: '🎓 Education:' }, { cls: '', text: ' IOE Purwanchal Campus' }] },
    { type: 'output', parts: [{ cls: 't-green', text: '💼 Role:' }, { cls: '', text: ' Intern Supervisor @ CODE IT' }] },
    { type: 'output', parts: [{ cls: 't-green', text: '🎨 Role:' }, { cls: '', text: ' Graphics Designer @ ACES ERC' }] },

    { type: 'cmd',    text: 'ls -la skills/' },
    { type: 'output', parts: [{ cls: 't-val', text: 'drwxr-xr-x' }, { cls: '', text: '  web-development/' }] },
    { type: 'output', parts: [{ cls: 't-val', text: 'drwxr-xr-x' }, { cls: '', text: '  machine-learning/' }] },
    { type: 'output', parts: [{ cls: 't-val', text: 'drwxr-xr-x' }, { cls: '', text: '  backend-development/' }] },

    { type: 'cmd',    text: 'cat skills/stack.json' },
    { type: 'output', parts: [{ cls: '', text: '{' }] },
    { type: 'output', parts: [{ cls: 't-key', text: '  "expert"' }, { cls: '', text: ': ' }, { cls: 't-val', text: '["HTML", "CSS", "JavaScript", "SQL", "C++"],' }] },
    { type: 'output', parts: [{ cls: 't-key', text: '  "intermediate"' }, { cls: '', text: ': ' }, { cls: 't-val', text: '["Python", "ML", "Node.js", "Data Science", "PHP"],' }] },
    { type: 'output', parts: [{ cls: 't-key', text: '  "beginner"' }, { cls: '', text: ': ' }, { cls: 't-val', text: '["Django", "React"]' }] },
    { type: 'output', parts: [{ cls: '', text: '}' }] },

    { type: 'cmd',    text: 'git log --oneline --graph -4' },
    { type: 'output', parts: [{ cls: 't-accent', text: '* a1b2c3d' }, { cls: '', text: ' 🚀 Deployed portfolio website' }] },
    { type: 'output', parts: [{ cls: 't-accent', text: '* e4f5g6h' }, { cls: '', text: ' 🤖 Built ML movie recommender' }] },
    { type: 'output', parts: [{ cls: 't-accent', text: '* i7j8k9l' }, { cls: '', text: ' 🏆 Participated in ACES TechFest 7.0 & X-Hack 3.0' }] },
    { type: 'output', parts: [{ cls: 't-accent', text: '* m1n2o3p' }, { cls: '', text: ' 📜 Completed CS50x AI @ IOE Dharan' }] },

    { type: 'cmd',    text: 'echo $STATUS' },
    { type: 'output', parts: [{ cls: 't-green', text: '✔ Available for opportunities' }] },
    { type: 'output', parts: [{ cls: 't-green', text: '✔ Open to collaboration' }] },
  ];

  const PROMPT = '<span class="t-prompt">navneet@portfolio</span><span style="color:#fff">:</span><span style="color:#79c0ff">~</span><span style="color:#fff">$</span>';
  const NOISE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  const CMD_SPEED  = 38;
  const LINE_DELAY = 280;
  const RESTART_DELAY = 3500; // ms before replay

  // ── Noise-type effect: scrambles chars before settling ──────────────────────
  function typeCommand(body, text, done) {
    const line = document.createElement('div');
    line.className = 't-line';
    line.innerHTML = PROMPT + ' ';
    const cmdSpan = document.createElement('span');
    cmdSpan.className = 't-cmd';
    line.appendChild(cmdSpan);
    const cursor = document.createElement('span');
    cursor.className = 't-cursor';
    line.appendChild(cursor);
    body.appendChild(line);
    body.scrollTop = body.scrollHeight;

    let i = 0;
    let noiseFrame = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        // Show settled chars + 1 noise char ahead
        const settled = text.slice(0, i);
        const noise = NOISE_CHARS[Math.floor(Math.random() * NOISE_CHARS.length)];
        cmdSpan.textContent = settled + (noiseFrame % 2 === 0 ? noise : text[i]);
        noiseFrame++;

        // Commit the real char every other tick
        if (noiseFrame % 2 === 0) i++;
        body.scrollTop = body.scrollHeight;
      } else {
        cmdSpan.textContent = text;
        clearInterval(interval);
        cursor.remove();
        // Brief glitch flash on the completed command
        glitchElement(cmdSpan);
        setTimeout(done, 180);
      }
    }, CMD_SPEED);
  }

  // ── Glitch: rapid color flicker on an element ───────────────────────────────
  function glitchElement(el) {
    const colors = ['#ff00c1', '#00fff9', '#fff', '#f59e0b', '#00d9ff'];
    let t = 0;
    const orig = el.style.color;
    const iv = setInterval(() => {
      el.style.color = colors[t % colors.length];
      el.style.textShadow = `0 0 8px ${colors[t % colors.length]}`;
      t++;
      if (t > 6) {
        clearInterval(iv);
        el.style.color = orig;
        el.style.textShadow = '';
      }
    }, 40);
  }

  // ── Slide-in output line ─────────────────────────────────────────────────────
  function makeOutputLine(parts) {
    const div = document.createElement('div');
    div.className = 't-line t-output';
    div.style.opacity = '0';
    div.style.transform = 'translateX(-12px)';
    parts.forEach(p => {
      const span = document.createElement('span');
      span.className = p.cls || '';
      span.textContent = p.text;
      div.appendChild(span);
    });
    return div;
  }

  function animateOutput(el) {
    el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    requestAnimationFrame(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    });
  }

  // ── Scanline sweep on terminal open ─────────────────────────────────────────
  function addScanSweep(terminalEl) {
    const sweep = document.createElement('div');
    sweep.style.cssText = `
      position:absolute; top:0; left:0; width:100%; height:3px;
      background: linear-gradient(90deg, transparent, rgba(0,217,255,0.6), transparent);
      pointer-events:none; z-index:10;
      animation: termSweep 1.2s ease forwards;
    `;
    terminalEl.style.position = 'relative';
    terminalEl.appendChild(sweep);
    setTimeout(() => sweep.remove(), 1300);
  }

  // ── Run all lines recursively ────────────────────────────────────────────────
  function runLines(body, lines, index, onDone) {
    if (index >= lines.length) {
      const last = document.createElement('div');
      last.className = 't-line';
      last.innerHTML = PROMPT + ' <span class="t-cursor"></span>';
      body.appendChild(last);
      body.scrollTop = body.scrollHeight;

      setTimeout(() => {
        const hint = document.createElement('div');
        hint.className = 't-line t-output';
        hint.style.opacity = '0';
        hint.innerHTML = '<span style="color:#58a6ff;font-style:italic;">// Session complete — replaying in 3.5s...</span>';
        body.appendChild(hint);
        animateOutput(hint);
        body.scrollTop = body.scrollHeight;
        if (onDone) setTimeout(onDone, RESTART_DELAY);
      }, 800);
      return;
    }

    const line = lines[index];
    if (line.type === 'cmd') {
      typeCommand(body, line.text, () => runLines(body, lines, index + 1, onDone));
    } else {
      setTimeout(() => {
        const el = makeOutputLine(line.parts);
        body.appendChild(el);
        animateOutput(el);
        body.scrollTop = body.scrollHeight;
        runLines(body, lines, index + 1, onDone);
      }, LINE_DELAY);
    }
  }

  // ── Boot + restart loop ──────────────────────────────────────────────────────
  function startTerminal(body, terminalEl) {
    body.innerHTML = '';

    // Scanline sweep
    addScanSweep(terminalEl);

    const loading = document.createElement('div');
    loading.className = 't-line';
    loading.innerHTML = '<span style="color:#58a6ff;">Initializing terminal</span><span class="t-dots"></span>';
    body.appendChild(loading);

    // Animate the dots
    let dots = 0;
    const dotsEl = loading.querySelector('.t-dots');
    const dotsIv = setInterval(() => {
      dotsEl.textContent = '.'.repeat((dots++ % 3) + 1);
    }, 300);

    setTimeout(() => {
      clearInterval(dotsIv);
      loading.remove();
      runLines(body, LINES, 0, () => startTerminal(body, terminalEl));
    }, 1000);
  }

  // ── Inject keyframe for scan sweep ──────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes termSweep {
      0%   { top: 0%;   opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    /* Cursor color pulse: cyan → purple */
    .t-cursor {
      animation: blink 0.7s infinite, cursorPulse 3s ease-in-out infinite !important;
    }
    @keyframes cursorPulse {
      0%,100% { background: #00d9ff; box-shadow: 0 0 8px rgba(0,217,255,0.8); }
      50%      { background: #7c3aed; box-shadow: 0 0 8px rgba(124,58,237,0.8); }
    }
  `;
  document.head.appendChild(style);

  // ── Init ─────────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const body = document.getElementById('terminal-body');
    const terminalEl = document.querySelector('.terminal');
    if (!body || !terminalEl) return;

    startTerminal(body, terminalEl);

    // Hover lift
    terminalEl.addEventListener('mouseenter', () => {
      terminalEl.style.transform = 'translateY(-5px)';
      terminalEl.style.boxShadow = '0 0 50px rgba(0,217,255,0.25), 0 25px 70px rgba(0,0,0,0.6)';
    });
    terminalEl.addEventListener('mouseleave', () => {
      terminalEl.style.transform = '';
      terminalEl.style.boxShadow = '';
    });
  });

})();


