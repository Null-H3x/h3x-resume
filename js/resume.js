'use strict';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'experience', label: 'Experience', icon: '◉' },
  { id: 'skills', label: 'Proficiencies', icon: '⚙' },
  { id: 'credentials', label: 'Credentials', icon: '🔑' },
];

const EXP_SECTIONS = [
  { key: 'network', label: 'NETWORK' },
  { key: 'cyber', label: 'CYBER' },
  { key: 'management', label: 'MANAGEMENT' },
];

/** Canonical sidebar buttons — not driven by resume.json links (avoids stale Bartunek.Tech). */
const SIDEBAR_LINKS = [
  { label: 'Email', icon: '✉', style: 'cyan', kind: 'email' },
  { label: 'Github', icon: '◈', style: 'violet', kind: 'github', url: 'https://github.com/Null-H3x' },
];

const HOBBIES = [
  {
    label: 'Musician',
    url: 'https://open.spotify.com/artist/6qsOkLrF6UNm4PdWoGWx48?si=WMul68VDQJ2wmk1pCWOTlQ',
    icon: 'spotify',
  },
];

const SPOTIFY_ICON = `<svg class="hobby-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`;

const BOOT_DUMMY_LINES = [
  { text: '[H3x-Resume] Initializing candidate discovery protocol...', cls: 't-info' },
  { text: '[*] Mounting /dev/resume0 partition... OK', cls: 't-dim' },
  { text: '[*] Loading credential store........ OK', cls: 't-dim' },
  { text: '[*] Parsing experience matrix....... OK', cls: 't-dim' },
  { text: '[*] Indexing technical proficiencies OK', cls: 't-dim' },
  { text: '[*] Handshake: SIEM telemetry....... OK', cls: 't-dim' },
  { text: '[*] Handshake: network topology..... OK', cls: 't-dim' },
  { text: '[*] Verifying clearance flags....... OK', cls: 't-dim' },
  { text: '[*] Decrypting MOS metadata......... OK', cls: 't-dim' },
  { text: '[*] Spinning up GitHub mirror....... OK', cls: 't-dim' },
  { text: '[*] Compiling leadership module..... OK', cls: 't-dim' },
  { text: '[*] Compiling communication module.. OK', cls: 't-dim' },
  { text: '[*] Running integrity checksum...... OK', cls: 't-dim' },
  { text: '[*] Scanning for technology wizard.. DETECTED', cls: 't-warn' },
  { text: '[*] Cross-referencing certifications OK', cls: 't-dim' },
  { text: '[*] Hydrating tenure timeline....... OK', cls: 't-dim' },
  { text: '[*] Mapping cyber / network / mgmt.. OK', cls: 't-dim' },
  { text: '[*] Applying syntax highlighting.... OK', cls: 't-dim' },
  { text: '[*] Finalizing profile render....... OK', cls: 't-dim' },
  { text: '[H3x-Resume] PROFILE FOUND', cls: 't-ok' },
];

const HIGHLIGHT_KEYWORDS = [
  'collaborating with cross-functional teams',
  'planned and executed \u201CGrey Box\u201D penetration testing',
  'encouraging policy and security changes',
  'Army Cyber Center Southwest Asia',
  'advanced troubleshooting techniques',
  'Designed communication infrastructure',
  'IP-based communication systems',
  'network performance optimization',
  'system architecture integration',
  'Diagnosed and repaired hardware',
  'downtrace sensor integration',
  'Security Information & Event Management',
  'two-factor authentication',
  'role-based access controls',
  'role-based group policies',
  'network security measures',
  'optimize system performance',
  'secure data transmission',
  'remote mission-critical operations',
  'remote nodal networks',
  'proprietary platforms',
  'encryption protocols',
  'terrestrial network configurations',
  'virtual configuration',
  'minimize downtime',
  'maintain uptime',
  'industry standards',
  'encrypted data',
  'network engineer',
  'proactive planning',
  'timely resolution',
  'root cause analysis',
  'Active Directory',
  'led training programs',
  '4,000+ systems',
  'access controls',
  'group policies',
  'network security',
  'mesh network',
  'edge devices',
  'reported findings',
  'user accounts',
  '2,000 users',
  'sensor integration',
  'penetration testing',
  'blue team',
  'IPS/IDS',
  'troubleshooting',
  'compliance',
  'regulations',
  'CentOS',
  'Nessus',
  'Splunk',
  'Tier-3',
  'standards',
  '5,000',
  'hardware',
  'Upgraded',
  'vendors',
  'support',
  'remote',
  'SIEM',
  'usage',
  '\u201CGrey Box\u201D',
].sort((a, b) => b.length - a.length);

function esc(str) {
  if (str == null) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function keywordPattern(kw) {
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (/^[A-Za-z0-9]+$/.test(kw)) return `\\b${escaped}\\b`;
  return escaped;
}

function highlightText(text) {
  const ranges = [];
  for (const kw of HIGHLIGHT_KEYWORDS) {
    const re = new RegExp(keywordPattern(kw), 'gi');
    let match;
    while ((match = re.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const overlaps = ranges.some(r => start < r.end && end > r.start);
      if (!overlaps) ranges.push({ start, end, text: match[0] });
    }
  }
  ranges.sort((a, b) => a.start - b.start);
  let html = '';
  let last = 0;
  for (const r of ranges) {
    html += esc(text.slice(last, r.start));
    html += `<span class="kw">${esc(r.text)}</span>`;
    last = r.end;
  }
  html += esc(text.slice(last));
  return html;
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
  const el = document.getElementById('terminal-init');
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

function renderExpSections(sections) {
  if (!sections) return '';
  return EXP_SECTIONS.map(({ key, label }) => {
    const items = sections[key];
    if (!items?.length) return '';
    return `
      <div class="exp-subsection">
        <div class="exp-sub-head">${label}</div>
        <ul class="exp-highlights">
          ${items.map(h => `<li>${highlightText(h)}</li>`).join('')}
        </ul>
      </div>`;
  }).join('');
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
      ${exp.mos ? `<div class="exp-mos">${highlightText(exp.mos)}</div>` : ''}
      ${exp.sections ? renderExpSections(exp.sections) : ''}
      ${!exp.sections && exp.highlights?.length ? `
        <ul class="exp-highlights">
          ${exp.highlights.map(h => `<li>${highlightText(h)}</li>`).join('')}
        </ul>` : ''}
    </article>
  `).join('');
}

function renderSkills(skills) {
  const el = document.getElementById('skills-grid');
  if (!el || !skills) return;
  el.innerHTML = skills.map(block => `
    <div class="skill-block">
      <div class="skill-cat">${esc(block.category)}</div>
      <ul class="skill-items">
        ${block.items.map(item => `<li>${esc(item)}</li>`).join('')}
      </ul>
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
      <span class="edu-degree">${esc(e.degree)}</span>
      <span class="cert-issuer">${esc(e.school)}</span>
      <span class="cert-year">${esc(e.period)}</span>
    </div>
    ${e.notes ? `<p class="about-text edu-notes">${esc(e.notes)}</p>` : ''}
  `).join('');
}

function hobbyIcon(name) {
  if (name === 'spotify') return SPOTIFY_ICON;
  return '';
}

function renderHobbies() {
  const el = document.getElementById('hobbies-list');
  if (!el) return;
  el.innerHTML = HOBBIES.map(h => `
    <a class="hobby-link hobby-link-spotify" href="${esc(h.url)}" target="_blank" rel="noopener noreferrer">
      ${hobbyIcon(h.icon)}
      <span>${esc(h.label)}</span>
    </a>
  `).join('');
}

function sidebarLinksForProfile(profile) {
  const email = profile?.email || 'Resume@Bartunek.Tech';
  return SIDEBAR_LINKS.map(link => {
    if (link.kind === 'email') {
      return { ...link, url: `mailto:${email}` };
    }
    return { ...link };
  });
}

function renderLinkButtons(el, links) {
  if (!el || !links?.length) return;
  el.innerHTML = links.map(l => {
    const external = !l.url.startsWith('mailto:');
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const btnClass = l.style === 'violet' ? 'btn-violet' : 'btn-cyan';
    return `<a class="btn ${btnClass}" href="${esc(l.url)}"${attrs}>
      ${esc(l.icon || '◈')} ${esc(l.label)}
    </a>`;
  }).join('');
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
  if (p.email) parts.push(`✉ <a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`);
  meta.innerHTML = parts.join(' · ');

  const sidebarLinks = document.getElementById('sidebar-links');
  renderLinkButtons(sidebarLinks, sidebarLinksForProfile(p));

  const avail = document.getElementById('availability-val');
  if (avail) avail.textContent = p.availability || 'Available';
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
  renderHobbies();
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
      setSidebarOpen(false);
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

function setSidebarOpen(open) {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!sidebar) return;
  sidebar.classList.toggle('open', open);
  if (backdrop) backdrop.classList.toggle('visible', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function initMenuToggle() {
  const btn = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (!btn || !sidebar) return;
  btn.addEventListener('click', () => setSidebarOpen(!sidebar.classList.contains('open')));
  backdrop?.addEventListener('click', () => setSidebarOpen(false));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setSidebarOpen(false);
  });
}

function unlockPage() {
  document.body.classList.remove('boot-locked');
  const wizard = document.getElementById('wizard-modal');
  const boot = document.getElementById('boot-overlay');
  if (wizard) wizard.hidden = true;
  if (boot) boot.hidden = true;
}

function showWizardDecline() {
  const modal = document.querySelector('#wizard-modal .boot-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="boot-modal-icon">✕</div>
    <div class="boot-modal-title">ACCESS DECLINED</div>
    <div class="boot-modal-sub">// NON-WIZARD TRAJECTORY DETECTED //</div>
    <p class="boot-modal-prompt">No problem — conventional candidates are everywhere. This profile is reserved for teams seeking a technology wizard.</p>
    <div class="boot-modal-btns">
      <button type="button" class="btn btn-cyan" id="wizard-retry">↺ TRY AGAIN</button>
    </div>`;
  document.getElementById('wizard-retry')?.addEventListener('click', () => location.reload());
}

function runBootSequence(onDone) {
  const overlay = document.getElementById('boot-overlay');
  const term = document.getElementById('boot-terminal');
  const wizard = document.getElementById('wizard-modal');
  if (!overlay || !term) {
    onDone();
    return;
  }

  if (wizard) wizard.hidden = true;
  overlay.hidden = false;
  term.innerHTML = '';

  const totalMs = 8000;
  const lines = BOOT_DUMMY_LINES;
  const stepMs = Math.floor(totalMs / lines.length);
  let i = 0;

  function appendLine(line) {
    const span = document.createElement('span');
    span.className = line.cls || '';
    span.textContent = line.text + '\n';
    term.appendChild(span);
    term.scrollTop = term.scrollHeight;
  }

  const timer = setInterval(() => {
    if (i >= lines.length) {
      clearInterval(timer);
      setTimeout(onDone, 400);
      return;
    }
    appendLine(lines[i]);
    i += 1;
  }, stepMs);
}

function initWizardGate() {
  const wizard = document.getElementById('wizard-modal');
  const yesBtn = document.getElementById('wizard-yes');
  const noBtn = document.getElementById('wizard-no');

  if (sessionStorage.getItem('h3x_resume_boot')) {
    unlockPage();
    return;
  }

  document.body.classList.add('boot-locked');
  if (wizard) wizard.hidden = false;

  yesBtn?.addEventListener('click', () => {
    runBootSequence(() => {
      sessionStorage.setItem('h3x_resume_boot', '1');
      unlockPage();
    });
  });

  noBtn?.addEventListener('click', showWizardDecline);
}

async function loadResume() {
  try {
    const res = await fetch('data/resume.json', { cache: 'no-store' });
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
  initWizardGate();
  loadResume();
  initScrollSpy();
  initClock();
  initMenuToggle();
});
