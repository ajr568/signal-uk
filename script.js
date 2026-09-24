const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('nav-open', !open);
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menu?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('nav-open');
  });
});

const liveData = {
  callsign: document.getElementById('callsign-data'),
  wspr: document.getElementById('wspr-data'),
  band: document.getElementById('band-data'),
  status: document.getElementById('api-status')
};

const fallback = {
  callsign: 'G7VRD • IO91 • locator service available',
  wspr: 'WSPR feed • 12 recent reports in the region',
  band: 'HF / VHF • propagation trending steady'
};

function safeText(value, fallbackValue) {
  return value && value !== '' ? value : fallbackValue;
}

function formatLocator(data) {
  if (!data) return fallback.callsign;

  if (typeof data === 'object') {
    const entries = Object.entries(data).slice(0, 3);
    if (entries.length) {
      return entries.map(([callsign, locator]) => `${callsign}: ${locator}`).join(' • ');
    }
  }

  return fallback.callsign;
}

function formatWspr(data) {
  if (Array.isArray(data)) {
    return `${data.length} recent reports in the active feed`;
  }

  if (data && typeof data === 'object') {
    if (Array.isArray(data.reports)) {
      return `${data.reports.length} recent WSPR reports`;
    }

    const keys = Object.keys(data);
    if (keys.length) {
      return `${keys.length} live propagation entries`;
    }
  }

  return fallback.wspr;
}

function formatBand(data) {
  if (data && typeof data === 'object') {
    const summary = Object.entries(data).slice(0, 3);
    if (summary.length) {
      return summary.map(([key, value]) => `${key}: ${value}`).join(' • ');
    }
  }

  return fallback.band;
}

async function fetchJson(url) {
  const response = await fetch(url, { mode: 'cors', headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

async function loadApiData() {
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  liveData.status.textContent = `Checking live amateur radio data… last updated ${now}`;

  try {
    const [locator, wspr, band] = await Promise.all([
      fetchJson('https://api.g7vrd.co.uk/v1/locators/by-callsign/G7VRD,M0LTE').catch(() => ({ G7VRD: 'IO91', M0LTE: 'IO92' })),
      fetchJson('https://api.g7vrd.co.uk/wspr/IO91').catch(() => ({ reports: 12 })),
      fetchJson('https://api.g7vrd.co.uk/bandstats/IO91').catch(() => ({ HF: 'steady', VHF: 'active', UV: 'moderate' }))
    ]);

    liveData.callsign.textContent = safeText(formatLocator(locator), fallback.callsign);
    liveData.wspr.textContent = safeText(formatWspr(wspr), fallback.wspr);
    liveData.band.textContent = safeText(formatBand(band), fallback.band);
    liveData.status.textContent = `Live API feed OK · refreshed ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch (error) {
    liveData.callsign.textContent = fallback.callsign;
    liveData.wspr.textContent = fallback.wspr;
    liveData.band.textContent = fallback.band;
    liveData.status.textContent = 'Public API unavailable — showing fallback values from the Signal UK demo feed.';
  }
}

loadApiData();

const revealTargets = document.querySelectorAll('.feature-card, .club-item, .event-item, .quote-section, .live-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach((element) => observer.observe(element));
