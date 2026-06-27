'use strict';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'experience', label: 'Experience', icon: '◉' },
  { id: 'skills', label: 'Proficiencies', icon: '⚙' },
  { id: 'credentials', label: 'Credentials', icon: '🔑' },
  { id: 'contact', label: 'Contact', icon: '◎' },
];

function esc(str) {
  if (str == null) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function badgeClass(color) {
  const map = { cyan: 'cyan', violet: 'violet', green: 'green', orange: 'orange', red: 'red' };
  return map[color] || 'cyan';
}

function renderNav() {
  const nav = document.getElementById('nav-links');
  if (!nav) return;
  nav.innerHTML = SECTIONS.map(s =>
    `<a href="#${s.id}" class="nav-link" data-section="${s.id}">
      <span class="nav-icon">${s.icon}</span> ${esc(s.label)}
    </a>`
  ).join('');
}

function renderStats(stats) {
  const el = document.getElementById('stat-grid');
  if (!el || !stats) return;
  el.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-label">${esc(s.label)}</div>
      <div class="stat-val ${badgeClass(s.color)}">${esc(s.value)}</div>
    </div>
  `).join('');
}

function renderTerminal(lines) {
  const el = document.getElementById('terminal-intro');
  if (!el || !lines) return;
  el.innerHTML = lines.map(line => {
    let cls = '';
    if (line.includes('[H3x-Resume]')) cls = 't-info';
    else if (line.startsWith('[*]')) cls = 't-dim';
    return `<span class="${cls}">${esc(line)}\n</span>`;
  }).join('');
}

function renderTenure(summary, hours) {
  const panel = document.getElementById('tenure-panel');
  const el = document.getElementById('tenure-grid');
  if (!panel || !el || !summary?.length) return;
  panel.style.display = '';
  let html = '';
  if (hours) {
    html += `<div class="tenure-hours">${esc(hours)}</div>`;
  }
  html += summary.map(row => `
    <div class="tenure-item">
      <div class="tenure-years">${esc(row.years)} yrs</div>
      <div class="tenure-label">${esc(row.label)}</div>
    </div>
  `).join('');
  el.innerHTML = html;
}

function renderExperience(items) {
  const el = document.getElementById('experience-list');
  if (!el || !items) return;
  el.innerHTML = items.map(exp => `
    <article class="exp-card">
      <div class="exp-header">
        <div class="exp-role">${esc(exp.role)}</div>
        <div class="exp-company">${esc(exp.company)}${exp.location ? ` · ${esc(exp.location)}` : ''}</div>
        <div class="exp-period">${esc(exp.period)}</div>
      </div>
      ${exp.mos ? `<div class="exp-mos">${esc(exp.mos)}</div>` : ''}
      ${exp.highlights?.length ? `
        <ul class="exp-highlights">
          ${exp.highlights.map(h => `<li>${esc(h)}</li>`).join('')}
        </ul>` : ''}
      ${exp.tags?.length ? `
        <div class="tag-row">
          ${exp.tags.map(t => `<span class="badge badge-info">${esc(t)}</span>`).join('')}
        </div>` : ''}
    </article>
  `).join('');
}

function renderSkills(skills) {
  const el = document.getElementById('skills-grid');
  if (!el || !skills) return;
  el.innerHTML = skills.map(block => `
    <div class="skill-block">
      <div class="skill-cat">${esc(block.category)}</div>
      <div class="skill-items">
        ${block.items.map(item => `<span class="badge badge-green">${esc(item)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderCerts(certs) {
  const el = document.getElementById('certs-list');
  if (!el) return;
  if (!certs?.length) {
    el.innerHTML = '<p class="about-text text-muted">No certifications listed.</p>';
    return;
  }
  el.innerHTML = certs.map(c => `
    <div class="cert-row">
      <span class="cert-name">${esc(c.name)}</span>
      <span class="cert-issuer">${esc(c.issuer)}</span>
      <span class="cert-year">${esc(c.year)}</span>
    </div>
  `).join('');
}

function renderEducation(edu) {
  const el = document.getElementById('education-list');
  if (!el) return;
  if (!edu?.length) {
    el.innerHTML = '<p class="about-text text-muted">No education listed.</p>';
    return;
  }
  el.innerHTML = edu.map(e => `
    <div class="edu-row">
      <span class="cert-name">${esc(e.degree)}</span>
      <span class="cert-issuer">${esc(e.school)}</span>
      <span class="cert-year">${esc(e.period)}</span>
    </div>
    ${e.notes ? `<p class="about-text edu-notes">${esc(e.notes)}</p>` : ''}
  `).join('');
}

function renderProfile(data) {
  const p = data.profile;
  if (!p) return;

  document.title = `${p.name} — H3x-Resume`;
  document.getElementById('logo-hex').textContent = esc(p.handle || 'H3');
  document.getElementById('hero-name').textContent = p.name;
  document.getElementById('hero-title').textContent = p.title;
  document.getElementById('hero-tagline').textContent = p.tagline || '';
  document.getElementById('about-text').textContent = data.about || '';

  const leadershipPanel = document.getElementById('leadership-panel');
  const communicationPanel = document.getElementById('communication-panel');
  const leadership = document.getElementById('leadership-text');
  const communication = document.getElementById('communication-text');

  if (leadership) leadership.textContent = data.leadership || '';
  if (communication) communication.textContent = data.communication || '';
  if (leadershipPanel) leadershipPanel.style.display = data.leadership ? '' : 'none';
  if (communicationPanel) communicationPanel.style.display = data.communication ? '' : 'none';

  const meta = document.getElementById('hero-meta');
  const parts = [];
  if (p.location) parts.push(`📍 ${esc(p.location)}`);
  if (p.phone) parts.push(`☎ ${esc(p.phone)}`);
  if (p.email) parts.push(`✉ <a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`);
  meta.innerHTML = parts.join(' · ');

  const links = document.getElementById('profile-links');
  if (links && p.links?.length) {
    links.innerHTML = p.links.map(l =>
      `<a class="btn btn-cyan" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">
        ${esc(l.icon || '◈')} ${esc(l.label)}
      </a>`
    ).join('');
  }

  const avail = document.getElementById('availability-val');
  if (avail) avail.textContent = p.availability || 'Available';

  document.getElementById('contact-email').innerHTML =
    p.email ? `<a class="val" href="mailto:${esc(p.email)}">${esc(p.email)}</a>` : '—';
  document.getElementById('contact-phone').textContent = p.phone || '—';
  document.getElementById('contact-location').textContent = p.location || '—';

  const contactLinks = document.getElementById('contact-links');
  if (contactLinks && p.links?.length) {
    contactLinks.innerHTML = p.links.map(l =>
      `<a class="btn btn-green" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)} ↗</a>`
    ).join('');
  }
}

function renderAll(data) {
  renderProfile(data);
  renderStats(data.stats);
  renderTerminal(data.terminalIntro);
  renderTenure(data.experienceSummary, data.experienceHours);
  renderExperience(data.experience);
  renderSkills(data.skills);
  renderCerts(data.certifications);
  renderEducation(data.education);
}

function initScrollSpy() {
  const links = document.querySelectorAll('.nav-link[data-section]');
  const sections = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);

  function updateActive() {
    let current = sections[0]?.id;
    const offset = 120;
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= offset) current = sec.id;
    }
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  links.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.remove('open');
    });
  });
}

function initClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  function tick() {
    const now = new Date();
    el.textContent = now.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  }
  tick();
  setInterval(tick, 1000);
}

function initMenuToggle() {
  const btn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => sidebar.classList.toggle('open'));
}

async function loadResume() {
  try {
    const res = await fetch('data/resume.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderAll(data);
  } catch (err) {
    console.error('[H3x-Resume] Failed to load resume.json:', err);
    const about = document.getElementById('about-text');
    if (about) {
      about.textContent = 'Could not load data/resume.json. Run scripts/parse_resume.py after updating Resume.docx.';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  loadResume();
  initScrollSpy();
  initClock();
  initMenuToggle();
});
