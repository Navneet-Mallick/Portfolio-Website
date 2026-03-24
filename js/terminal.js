/**
 * Enhanced Terminal Animation Module
 * Interactive terminal with dynamic typing effects and commands
 */

(function () {
  const LINES = [
    { type: 'cmd',    text: 'whoami' },
    { type: 'output', parts: [{ cls: 't-accent', text: 'Navneet Mallick' }, { cls: '', text: ' — Computer Engineering Student' }] },

    { type: 'cmd',    text: 'cat about.txt' },
    { type: 'output', parts: [{ cls: 't-green', text: '📍 Location:' }, { cls: '', text: ' Dharan, Nepal' }] },
    { type: 'output', parts: [{ cls: 't-green', text: '🎓 Education:' }, { cls: '', text: ' IOE Purwanchal Campus' }] },
    { type: 'output', parts: [{ cls: 't-green', text: '💼 Role:' }, { cls: '', text: ' Intern Supervisor @ CODE IT' }] },

    { type: 'cmd',    text: 'ls -la skills/' },
    { type: 'output', parts: [{ cls: 't-val', text: 'drwxr-xr-x' }, { cls: '', text: '  web-development/' }] },
    { type: 'output', parts: [{ cls: 't-val', text: 'drwxr-xr-x' }, { cls: '', text: '  machine-learning/' }] },
    { type: 'output', parts: [{ cls: 't-val', text: 'drwxr-xr-x' }, { cls: '', text: '  backend-development/' }] },

    { type: 'cmd',    text: 'cat skills/web-development/stack.json' },
    { type: 'output', parts: [{ cls: '', text: '{' }] },
    { type: 'output', parts: [{ cls: 't-key', text: '  "frontend"' }, { cls: '', text: ': ' }, { cls: 't-val', text: '["HTML5", "CSS3", "JavaScript", "React"],' }] },
    { type: 'output', parts: [{ cls: 't-key', text: '  "backend"' }, { cls: '', text: ': ' }, { cls: 't-val', text: '["Node.js", "Django", "SQL"],' }] },
    { type: 'output', parts: [{ cls: 't-key', text: '  "proficiency"' }, { cls: '', text: ': ' }, { cls: 't-accent', text: '"90%"' }] },
    { type: 'output', parts: [{ cls: '', text: '}' }] },

    { type: 'cmd',    text: 'git log --oneline --graph -4' },
    { type: 'output', parts: [{ cls: 't-accent', text: '* a1b2c3d' }, { cls: '', text: ' 🚀 Deployed portfolio website' }] },
    { type: 'output', parts: [{ cls: 't-accent', text: '* e4f5g6h' }, { cls: '', text: ' 🤖 Built ML movie recommender' }] },
    { type: 'output', parts: [{ cls: 't-accent', text: '* i7j8k9l' }, { cls: '', text: ' 🏆 Won ACES TechFest hackathon' }] },
    { type: 'output', parts: [{ cls: 't-accent', text: '* m1n2o3p' }, { cls: '', text: ' 📜 Completed CS50x AI certification' }] },

    { type: 'cmd',    text: 'python3 -c "import this" | head -3' },
    { type: 'output', parts: [{ cls: '', text: 'Beautiful is better than ugly.' }] },
    { type: 'output', parts: [{ cls: '', text: 'Explicit is better than implicit.' }] },
    { type: 'output', parts: [{ cls: '', text: 'Simple is better than complex.' }] },

    { type: 'cmd',    text: 'echo $STATUS' },
    { type: 'output', parts: [{ cls: 't-green', text: '✔ Available for opportunities' }] },
    { type: 'output', parts: [{ cls: 't-green', text: '✔ Open to collaboration' }] },
  ];

  const PROMPT = '<span class="t-prompt">navneet@portfolio</span><span style="color:#fff">:</span><span style="color:#79c0ff">~</span><span style="color:#fff">$</span>';
  const CMD_SPEED = 40;   // ms per character when typing
  const LINE_DELAY = 300; // ms between lines

  function makeOutputLine(parts) {
    const div = document.createElement('div');
    div.className = 't-line t-output';
    div.style.opacity = '0';
    parts.forEach(p => {
      const span = document.createElement('span');
      span.className = p.cls || '';
      span.textContent = p.text;
      div.appendChild(span);
    });
    return div;
  }

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
    const interval = setInterval(() => {
      if (i < text.length) {
        cmdSpan.textContent += text[i++];
        body.scrollTop = body.scrollHeight;
      } else {
        clearInterval(interval);
        cursor.remove();
        setTimeout(done, 150);
      }
    }, CMD_SPEED);
  }

  function animateOutput(element) {
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    element.style.transform = 'translateX(-10px)';
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0)';
    }, 50);
  }

  function runLines(body, lines, index) {
    if (index >= lines.length) {
      // Final blinking cursor with interactive hint
      const last = document.createElement('div');
      last.className = 't-line';
      last.innerHTML = PROMPT + ' <span class="t-cursor"></span>';
      body.appendChild(last);
      body.scrollTop = body.scrollHeight;
      
      // Add interactive message after a delay
      setTimeout(() => {
        const hint = document.createElement('div');
        hint.className = 't-line t-output';
        hint.style.opacity = '0';
        hint.innerHTML = '<span style="color: #58a6ff; font-style: italic;">// Terminal session complete. Scroll down to explore more!</span>';
        body.appendChild(hint);
        animateOutput(hint);
        body.scrollTop = body.scrollHeight;
      }, 1000);
      return;
    }

    const line = lines[index];

    if (line.type === 'cmd') {
      typeCommand(body, line.text, () => {
        runLines(body, lines, index + 1);
      });
    } else {
      setTimeout(() => {
        const el = makeOutputLine(line.parts);
        body.appendChild(el);
        animateOutput(el);
        body.scrollTop = body.scrollHeight;
        runLines(body, lines, index + 1);
      }, LINE_DELAY);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const body = document.getElementById('terminal-body');
    if (!body) return;

    // Add loading animation
    const loading = document.createElement('div');
    loading.className = 't-line';
    loading.innerHTML = '<span style="color: #58a6ff;">Initializing terminal...</span>';
    body.appendChild(loading);

    // Start terminal animation
    setTimeout(() => {
      loading.remove();
      runLines(body, LINES, 0);
    }, 800);
  });

  // Add hover effect on terminal
  const terminal = document.querySelector('.terminal');
  if (terminal) {
    terminal.addEventListener('mouseenter', () => {
      terminal.style.transform = 'translateY(-5px)';
      terminal.style.boxShadow = '0 0 50px rgba(0, 217, 255, 0.2), 0 25px 70px rgba(0,0,0,0.6)';
    });
    terminal.addEventListener('mouseleave', () => {
      terminal.style.transform = 'translateY(0)';
      terminal.style.boxShadow = '0 0 40px rgba(0, 217, 255, 0.1), 0 20px 60px rgba(0,0,0,0.5)';
    });
  }

})();
