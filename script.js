function copyText(text) {
  navigator.clipboard.writeText(text);
  alert("Copied: " + text);
}
// Reuseable copy helpers
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    toast('Copied!');
  }).catch(() => alert('Copy failed'));
}

function copyFromElement(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.innerText; // preserves line breaks
  copyText(text);
}

// Tiny toast
function toast(msg) {
  let t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 1200);
}

// Build Settings page from settings.txt
async function buildSettingsFromTxt() {
  const container = document.getElementById('settings-container');
  if (!container) return;

  try {
    const resp = await fetch('settings.txt', { cache: 'no-store' });
    if (!resp.ok) throw new Error('settings.txt not found');
    const raw = await resp.text();

    // Split blocks by blank line(s)
    const blocks = raw
      .split(/\r?\n\r?\n+/)        // blocks separated by one or more blank lines
      .map(b => b.trim())
      .filter(Boolean);

    if (blocks.length === 0) {
      container.innerHTML = '<p class="muted">No settings found. Add some blocks in settings.txt</p>';
      return;
    }

    container.innerHTML = ''; // clear

    blocks.forEach((block, i) => {
      const lines = block.split(/\r?\n/);
      const title = (lines.shift() || 'Untitled').trim();
      const content = lines.join('\n'); // keep the paragraph lines

      const id = `s-card-${i + 1}`;

      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-aos', 'fade-up');

      const header = document.createElement('div');
      header.className = 'card-header-row';

      const h = document.createElement('div');
      h.className = 'card-header';
      h.textContent = title;

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => copyFromElement(id));

      header.appendChild(h);
      header.appendChild(btn);

      const pre = document.createElement('pre');
      pre.className = 'multi-text';
      pre.id = id;
      pre.textContent = content; // safe text, preserves lines

      card.appendChild(header);
      card.appendChild(pre);

      container.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    // Optional JSON fallback if you prefer a structured file
    await buildSettingsFromJSON();
  }
}

// Optional JSON fallback: settings.json => [{ "title": "...", "content": "line1\nline2" }, ...]
async function buildSettingsFromJSON() {
  const container = document.getElementById('settings-container');
  if (!container) return;

  try {
    const resp = await fetch('settings.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error('settings.json not found');
    const items = await resp.json();

    container.innerHTML = '';

    items.forEach((item, i) => {
      const id = `s-card-json-${i + 1}`;

      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-aos', 'fade-up');

      const header = document.createElement('div');
      header.className = 'card-header-row';

      const h = document.createElement('div');
      h.className = 'card-header';
      h.textContent = item.title || 'Untitled';

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => copyFromElement(id));

      header.appendChild(h);
      header.appendChild(btn);

      const pre = document.createElement('pre');
      pre.className = 'multi-text';
      pre.id = id;
      pre.textContent = item.content || '';

      card.appendChild(header);
      card.appendChild(pre);

      container.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    const container = document.getElementById('settings-container');
    if (container) {
      container.innerHTML = '<p class="error">Could not load settings.txt or settings.json</p>';
    }
  }
}

// Auto-run on Settings page
document.addEventListener('DOMContentLoaded', () => {
  buildSettingsFromTxt();
});
// Load plugins from plugins.txt
async function buildPluginsFromTxt() {
  const container = document.getElementById('plugin-container');
  if (!container) return;

  try {
    const resp = await fetch('plugins.txt', { cache: 'no-store' });
    if (!resp.ok) throw new Error('plugins.txt not found');
    const raw = await resp.text();

    const blocks = raw
      .split(/\r?\n\r?\n+/)
      .map(b => b.trim())
      .filter(Boolean);

    container.innerHTML = '';

    blocks.forEach((block, i) => {
      const lines = block.split(/\r?\n/);
      const name = lines[0] || 'Unnamed Plugin';
      const about = lines[1] || 'No description';
      const url = lines[2] || '#';

      const card = document.createElement('div');
      card.className = 'card';
      card.setAttribute('data-aos', 'fade-up');

      const h3 = document.createElement('h3');
      h3.textContent = name;

      const p = document.createElement('p');
      p.textContent = `About: ${about}`;

      const btn = document.createElement('button');
      btn.textContent = 'Copy URL';
      btn.addEventListener('click', () => copyText(url));

      card.appendChild(h3);
      card.appendChild(p);
      card.appendChild(btn);

      container.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    container.innerHTML = '<p class="error">Could not load plugins.txt</p>';
  }
}

// Auto-run on Plugins page
document.addEventListener('DOMContentLoaded', () => {
  buildPluginsFromTxt();
});
