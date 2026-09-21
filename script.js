/* =========================================================
   ود فيصل - Football App
   Pure JavaScript / GitHub Pages
   ========================================================= */

"use strict";

/* =========================================================
   API CONFIG
   ========================================================= */

const API_KEY = "a4c2934c4adb9f2d14d0acc2e970cca6";
const API_BASE = "https://v3.football.api-sports.io";

const API_ENABLED =
  API_KEY &&
  API_KEY.trim() !== "" &&
  API_KEY.trim() !== "a4c2934c4adb9f2d14d0acc2e970cca6";

const CURRENT_YEAR = new Date().getFullYear();

/*
  API-Football uses the season starting year.
  For September 2026, the current European season is 2026.
*/
const DEFAULT_SEASON =
  new Date().getMonth() >= 7
    ? CURRENT_YEAR
    : CURRENT_YEAR - 1;

/* =========================================================
   STATE
   ========================================================= */

const state = {
  currentPage: "homePage",
  matchFilter: "all",
  resultOffset: 0,
  leagueFilter: "all",
  channelFilter: "all",
  selectedMatch: null,
  selectedLeague: null,
  detailTab: "events",
  leagueDetailTab: "standings",
  matches: [],
  liveMatches: [],
  todayMatches: [],
  results: [],
  leagues: [],
  favorites: [],
  favoriteChannels: [],
  settings: {
    quality: "balanced",
    autoRefresh: true,
    notifications: true,
    darkMode: true
  },
  cache: new Map(),
  refreshTimer: null,
  searchTimer: null
};

/* =========================================================
   FALLBACK DATA
   ========================================================= */

const fallbackMatches = [
  {
    fixture: {
      id: 100001,
      date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      timestamp: Math.floor(Date.now() / 1000) + 3600,
      status: {
        short: "NS",
        long: "Not Started",
        elapsed: null
      }
    },
    league: {
      id: 39,
      name: "الدوري الإنجليزي",
      country: "England",
      logo: ""
    },
    teams: {
      home: {
        id: 33,
        name: "Manchester United",
        logo: ""
      },
      away: {
        id: 40,
        name: "Liverpool",
        logo: ""
      }
    },
    goals: {
      home: null,
      away: null
    }
  },
  {
    fixture: {
      id: 100002,
      date: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      timestamp: Math.floor(Date.now() / 1000) + 10800,
      status: {
        short: "NS",
        long: "Not Started",
        elapsed: null
      }
    },
    league: {
      id: 140,
      name: "الدوري الإسباني",
      country: "Spain",
      logo: ""
    },
    teams: {
      home: {
        id: 529,
        name: "Barcelona",
        logo: ""
      },
      away: {
        id: 541,
        name: "Real Madrid",
        logo: ""
      }
    },
    goals: {
      home: null,
      away: null
    }
  },
  {
    fixture: {
      id: 100003,
      date: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      timestamp: Math.floor(Date.now() / 1000) - 2100,
      status: {
        short: "2H",
        long: "Second Half",
        elapsed: 68
      }
    },
    league: {
      id: 135,
      name: "الدوري الإيطالي",
      country: "Italy",
      logo: ""
    },
    teams: {
      home: {
        id: 489,
        name: "AC Milan",
        logo: ""
      },
      away: {
        id: 505,
        name: "Inter",
        logo: ""
      }
    },
    goals: {
      home: 1,
      away: 1
    }
  }
];

const fallbackLeagues = [
  {
    league: {
      id: 39,
      name: "الدوري الإنجليزي الممتاز",
      type: "League",
      logo: ""
    },
    country: {
      name: "England"
    },
    seasons: [{ year: DEFAULT_SEASON }]
  },
  {
    league: {
      id: 140,
      name: "الدوري الإسباني",
      type: "League",
      logo: ""
    },
    country: {
      name: "Spain"
    },
    seasons: [{ year: DEFAULT_SEASON }]
  },
  {
    league: {
      id: 135,
      name: "الدوري الإيطالي",
      type: "League",
      logo: ""
    },
    country: {
      name: "Italy"
    },
    seasons: [{ year: DEFAULT_SEASON }]
  },
  {
    league: {
      id: 78,
      name: "الدوري الألماني",
      type: "League",
      logo: ""
    },
    country: {
      name: "Germany"
    },
    seasons: [{ year: DEFAULT_SEASON }]
  },
  {
    league: {
      id: 2,
      name: "دوري أبطال أوروبا",
      type: "Cup",
      logo: ""
    },
    country: {
      name: "World"
    },
    seasons: [{ year: DEFAULT_SEASON }]
  },
  {
    league: {
      id: 1,
      name: "كأس العالم",
      type: "Cup",
      logo: ""
    },
    country: {
      name: "World"
    },
    seasons: [{ year: DEFAULT_SEASON }]
  }
];

const channels = [
  {
    id: "bein-1",
    name: "beIN SPORTS",
    group: "beIN",
    description: "شبكة beIN الرياضية",
    icon: "B"
  },
  {
    id: "bein-2",
    name: "beIN SPORTS 1",
    group: "beIN",
    description: "القناة الرياضية الأولى",
    icon: "1"
  },
  {
    id: "bein-3",
    name: "beIN SPORTS 2",
    group: "beIN",
    description: "القناة الرياضية الثانية",
    icon: "2"
  },
  {
    id: "ssc-1",
    name: "SSC SPORTS",
    group: "SSC",
    description: "شبكة SSC الرياضية",
    icon: "S"
  },
  {
    id: "ssc-1hd",
    name: "SSC 1 HD",
    group: "SSC",
    description: "القناة الرياضية الأولى",
    icon: "1"
  },
  {
    id: "ssc-2",
    name: "SSC 2 HD",
    group: "SSC",
    description: "القناة الرياضية الثانية",
    icon: "2"
  }
];

/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function safeText(value, fallback = "غير متوفر") {
  if (value === null  value === undefined  value === "") {
    return fallback;
  }

  return String(value);
}

function escapeHtml(value) {
  return safeText(value, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function fallbackLogo(name = "⚽") {
  const encoded = encodeURIComponent(name.substring(0, 2).toUpperCase());

  return data:image/svg+xml;charset=UTF-8,
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    <rect width="100" height="100" rx="22" fill="%230a2342"/>
    <text x="50" y="58" text-anchor="middle"
      font-family="Arial" font-size="28" fill="%2338b5ff">${encoded}</text>
  </svg>;
}

function imageHtml(src, alt, className = "") {
  const safeSrc = src  fallbackLogo(alt  "FC");

  return 
    <img
      class="${className}"
      src="${escapeHtml(safeSrc)}"
      alt="${escapeHtml(alt)}"
      loading="lazy"
      onerror="this.onerror=null;this.src='${fallbackLogo(alt || "FC")}'"
    >
  ;
}

function formatDate(dateValue) {
  try {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "غير محدد";
    }

    return new Intl.DateTimeFormat("ar-SD", {
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(date);
  } catch (error) {
    return "غير محدد";
  }
}

function formatTime(dateValue) {
  try {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return new Intl.DateTimeFormat("ar-SD", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date);
  } catch (error) {
    return "--:--";
  }
}

function getDateString(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return ${year}-${month}-${day};
}

function getStatus(match) {
  return match?.fixture?.status?.short || "NS";
}

function isLive(match) {
  return [
    "1H",
    "2H",
    "ET",
    "P",
    "LIVE",
    "HT"
  ].includes(getStatus(match));
}

function isFinished(match) {
  return [
    "FT",
    "AET",
    "PEN"
  ].includes(getStatus(match));
}

function isUpcoming(match) {
  return !isLive(match) && !isFinished(match) &&
    !["PST", "CANC", "ABD", "AWD", "WO"].includes(getStatus(match));
}

function getStatusLabel(match) {
  const status = getStatus(match);

  if (isLive(match)) {
    const minute = match?.fixture?.status?.elapsed;

    return minute
      ? ${minute}' مباشر
      : "مباشر";
  }

  if (isFinished(match)) {
    return "انتهت";
  }

  if (status === "PST") return "مؤجلة";
  if (status === "CANC") return "ملغاة";

  return "قادمة";
}

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function loadLocalData() {
  try {
    const favorites = localStorage.getItem("wad_faisal_favorites");
    const favoriteChannels = localStorage.getItem("wad_faisal_channels");
    const settings = localStorage.getItem("wad_faisal_settings");

    state.favorites = favorites
      ? JSON.parse(favorites)
      : [];

    state.favoriteChannels = favoriteChannels
      ? JSON.parse(favoriteChannels)
      : [];

    if (settings) {
      state.settings = {
        ...state.settings,
        ...JSON.parse(settings)
      };
    }
  } catch (error) {
    console.warn("LocalStorage error:", error);

    state.favorites = [];
    state.favoriteChannels = [];
  }
}

function saveLocalData() {
  try {
    localStorage.setItem(
      "wad_faisal_favorites",
      JSON.stringify(state.favorites)
    );

    localStorage.setItem(
      "wad_faisal_channels",
      JSON.stringify(state.favoriteChannels)
    );

    localStorage.setItem(
      "wad_faisal_settings",
      JSON.stringify(state.settings)
    );
  } catch (error) {
    console.warn("Could not save local data:", error);
  }
}

/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function showToast(message, icon = "✓") {
  try {
    const toast = $("#toast");
    const messageElement = $("#toastMessage");
    const iconElement = $("#toastIcon");

    if (!toast  !messageElement  !iconElement) {
      return;
    }

    messageElement.textContent = safeText(message);
    iconElement.textContent = icon;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  } catch (error) {
    console.warn("Toast error:", error);
  }
}

/* =========================================================
   API
   ========================================================= */

async function apiRequest(endpoint, params = {}, cacheSeconds = 60) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.set(key, value);
    }
  });

  const cacheKey = ${endpoint}?${query.toString()};
  const cached = state.cache.get(cacheKey);

  if (
    cached &&
    Date.now() - cached.time < cacheSeconds * 1000
  ) {
    return cached.data;
  }

  if (!API_ENABLED) {
    throw new Error("API_KEY_NOT_CONFIGURED");
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(
      ${API_BASE}/${endpoint}?${query.toString()},
      {
        method: "GET",
        headers: {
          "x-apisports-key": API_KEY,
          "Accept": "application/json"
        },
        signal: controller.signal
      }
    );

    if (!response.ok) {
      throw new Error(HTTP_${response.status});
    }

    let data;

    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error("INVALID_JSON");
    }

    if (
      data &&
      Array.isArray(data.errors) &&
      data.errors.length > 0
    ) {
      throw new Error(
        Array.isArray(data.errors)
          ? JSON.stringify(data.errors)
          : "API_ERROR"
      );
    }

    state.cache.set(cacheKey, {
      time: Date.now(),
      data
    });

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function navigateTo(pageId) {
  try {
    const page = document.getElementById(pageId);

    if (!page) {
      console.warn(Page not found: ${pageId});
      return;
    }

    $$(".page").forEach((item) => {
      item.classList.remove("active-page");
    });

    page.classList.add("active-page");

    $$(".nav-item").forEach((item) => {
      item.classList.toggle(
        "active",
        item.dataset.page === pageId
      );
    });

    state.currentPage = pageId;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (pageId === "matchesPage") {
      loadMatchesPage();
    }

    if (pageId === "resultsPage") {
      loadResultsPage();
    }

    if (pageId === "leaguesPage") {
      loadLeagues();
    }

    if (pageId === "channelsPage") {
      renderChannels();
    }

    if (pageId === "favoritesPage") {
      renderFavorites();
    }

    if (pageId === "settingsPage") {
      renderSettings();
    }
  } catch (error) {
    console.error("Navigation error:", error);
    showToast("تعذر فتح الصفحة", "!");
  }
}

/* =========================================================
   MATCH CARD
   ========================================================= */

function renderMatchCard(match) {
  try {
    const fixture = match?.fixture || {};
    const league = match?.league || {};
    const teams = match?.teams || {};
    const goals = match?.goals || {};

    const home = teams.home || {};
    const away = teams.away || {};

    const live = isLive(match);
    const finished = isFinished(match);

    let centerText = formatTime(fixture.date);

    if (finished || live) {
      const homeScore =
        goals.home === null || goals.home === undefined
          ? 0
          : goals.home;

      const awayScore =
        goals.away === null || goals.away === undefined
          ? 0
          : goals.away;

      centerText = ${homeScore} - ${awayScore};
    }

    const minute =
      live && fixture.status?.elapsed
        ? ${fixture.status.elapsed}'
        : "";

    return 
      <article class="match-card ${live ? "live" : ""}">
        <div class="match-top">
          <span class="league-name">
            ${escapeHtml(safeText(league.name, "بطولة"))}
          </span>

          <span class="match-status ${live ? "live" : ""}">
            ${escapeHtml(getStatusLabel(match))}
          </span>
        </div>

        <div class="match-teams">

          <div class="team home">
            ${imageHtml(home.logo, home.name || "HOME", "team-logo")}
            <span class="team-name">
              ${escapeHtml(safeText(home.name, "الفريق المضيف"))}
            </span>
          </div>

          <div class="match-center">
            <div class="${finished || live ? "team-score" : "match-time"}">
              ${escapeHtml(centerText)}
            </div>

            ${
              minute
                ? <span class="match-minute">${escapeHtml(minute)}</span>
                : ""
            }

            <small>${escapeHtml(formatDate(fixture.date))}</small>
          </div>

          <div class="team away">
            <span class="team-name">
              ${escapeHtml(safeText(away.name, "الفريق الضيف"))}
            </span>
            ${imageHtml(away.logo, away.name || "AWAY", "team-logo")}
          </div>

        </div>

        <button
          class="match-open"
          type="button"
          data-match-id="${escapeHtml(fixture.id)}"
        >
          عرض تفاصيل المباراة ←
        </button>
      </article>
    ;
  } catch (error) {
    console.warn("Match card error:", error);

    return 
      <div class="error-box">
        <p>تعذر عرض هذه المباراة.</p>
      </div>
    ;
  }
}

/* =========================================================
   HOME
   ========================================================= */

async function loadHome() {
  const liveContainer = $("#homeLiveMatches");
  const todayContainer = $("#homeTodayMatches");

  if (!liveContainer || !todayContainer) {
    return;
  }

  try {
    const today = getDateString(0);

    let todayData;

    try {
      todayData = await apiRequest(
        "fixtures",
        {
          date: today,
          timezone: "Africa/Khartoum"
        },
        60
      );
    } catch (error) {
      todayData = {
        response: fallbackMatches
      };
    }

    const matches = Array.isArray(todayData?.response)
      ? todayData.response
      : [];

    state.todayMatches =
      matches.length > 0
        ? matches
        : fallbackMatches;

    state.liveMatches =
      state.todayMatches.filter(isLive);

    if (state.liveMatches.length > 0) {
      liveContainer.innerHTML =
        state.liveMatches
          .slice(0, 4)
          .map(renderMatchCard)
          .join("");
    } else {
      liveContainer.innerHTML = 
        <div class="empty-box">
          <div style="font-size:28px">⚽</div>
          <p>لا توجد مباريات مباشرة حاليًا</p>
        </div>
      ;
    }

    const important =
      state.todayMatches
        .filter((match) => !isLive(match))
        .slice(0, 5);

    if (important.length > 0) {
      todayContainer.innerHTML =
        important.map(renderMatchCard).join("");
    } else {
      todayContainer.innerHTML = 
        <div class="empty-box">
          <div style="font-size:28px">📅</div>
          <p>لا توجد مباريات متاحة حاليًا</p>
        </div>
      ;
    }
  } catch (error) {
    console.warn("Home loading error:", error);

    state.todayMatches = fallbackMatches;

    liveContainer.innerHTML = 
      <div class="empty-box">
        <div style="font-size:28px">📡</div>
        <p>تعذر الاتصال بالبيانات المباشرة، لكن التطبيق يعمل بشكل طبيعي.</p>
      </div>
    ;

    todayContainer.innerHTML =
      fallbackMatches.map(renderMatchCard).join("");
  }
}

/* =========================================================
   MATCHES PAGE
   ========================================================= */

async function loadMatchesPage() {
  const container = $("#matchesList");
  const label = $("#matchesDateLabel");

  if (!container) {
    return;
  }

  if (label) {
    label.textContent = formatDate(new Date());
  }

  container.innerHTML = 
    <div class="loading-box">
      <div class="spinner"></div>
      <p>جاري تحميل المباريات...</p>
    </div>
  ;

  try {
    let data;

    try {
      data = await apiRequest(
        "fixtures",
        {
          date: getDateString(0),
          timezone: "Africa/Khartoum"
        },
        60
      );
    } catch (apiError) {
      data = {
        response: fallbackMatches
      };
    }

    const response = Array.isArray(data?.response)
      ? data.response
      : [];

    state.matches =
      response.length > 0
        ? response
        : fallbackMatches;

    renderMatchesFiltered();
  } catch (error) {
    console.error("Matches page error:", error);

    state.matches = fallbackMatches;

    renderMatchesFiltered();

    showToast(
      "تعذر تحديث البيانات، تم استخدام بيانات احتياطية",
      "!"
    );
  }
}

function renderMatchesFiltered() {
  const container = $("#matchesList");

  if (!container) {
    return;
  }

  let matches = [...state.matches];

  if (state.matchFilter === "live") {
    matches = matches.filter(isLive);
  }

  if (state.matchFilter === "upcoming") {
    matches = matches.filter(isUpcoming);
  }

  if (state.matchFilter === "finished") {
    matches = matches.filter(isFinished);
  }

  if (matches.length === 0) {
    container.innerHTML = 
      <div class="empty-box">
        <div style="font-size:30px">⚽</div>
        <p>لا توجد مباريات متاحة حاليًا</p>
      </div>
    ;

    return;
  }

  container.innerHTML =
    matches.map(renderMatchCard).join("");
}

/* =========================================================
   RESULTS
   ========================================================= */

async function loadResultsPage() {
  const container = $("#resultsList");
  const title = $("#resultsDateTitle");

  if (!container) {
    return;
  }

  const offset = state.resultOffset;
  const date = getDateString(offset);

  if (title) {
    title.textContent = formatDate(
      new Date(${date}T12:00:00)
    );
  }

  container.innerHTML = 
    <div class="loading-box">
      <div class="spinner"></div>
      <p>جاري تحميل النتائج...</p>
    </div>
  ;

  try {
    let data;

    try {
      data = await apiRequest(
        "fixtures",
        {
          date,
          timezone: "Africa/Khartoum"
        },
        120
      );
    } catch (apiError) {
      data = {
        response:
          offset === 0
            ? fallbackMatches
            : []
      };
    }

    const matches = Array.isArray(data?.response)
      ? data.response
      : [];

    const finished = matches.filter(isFinished);

    if (finished.length > 0) {
      container.innerHTML =
        finished.map(renderMatchCard).join("");
      return;
    }

    if (offset === 0) {
      const fallbackFinished = fallbackMatches.filter(
        (match) => match.fixture.id !== 100001
      );

      container.innerHTML =
        fallbackFinished.length > 0
          ? fallbackFinished.map(renderMatchCard).join("")
          : emptyResults();
    } else {
      container.innerHTML = emptyResults();
    }
  } catch (error) {
    console.warn("Results error:", error);

    container.innerHTML = emptyResults(
      "تعذر الحصول على النتائج حاليًا"
    );
  }
}

function emptyResults(message = "لا توجد نتائج متاحة لهذا التاريخ") {
  return 
    <div class="empty-box">
      <div style="font-size:30px">📊</div>
      <p>${escapeHtml(message)}</p>
    </div>
  ;
}

/* =========================================================
   LEAGUES
   ========================================================= */

async function loadLeagues() {
  const container = $("#leaguesList");

  if (!container) {
    return;
  }

  container.innerHTML = 
    <div class="loading-box">
      <div class="spinner"></div>
      <p>جاري تحميل البطولات...</p>
    </div>
  ;

  try {
    let data;

    try {
      data = await apiRequest(
        "leagues",
        {
          current: true
        },
        3600
      );
    } catch (apiError) {
      data = {
        response: fallbackLeagues
      };
    }

    state.leagues =
      Array.isArray(data?.response) &&
      data.response.length > 0
        ? data.response
        : fallbackLeagues;

    renderLeagues();
  } catch (error) {
    console.error("Leagues error:", error);

    state.leagues = fallbackLeagues;

    renderLeagues();

    showToast("تم عرض البطولات الأساسية", "!");
  }
}

function renderLeagues() {
  const container = $("#leaguesList");

  if (!container) {
    return;
  }

  let leagues = [...state.leagues];

  if (state.leagueFilter !== "all") {
    leagues = leagues.filter((item) => {
      const type =
        item?.league?.type?.toLowerCase() || "";

      return type === state.leagueFilter;
    });
  }

  if (leagues.length === 0) {
    container.innerHTML = 
      <div class="empty-box">
        <p>لا توجد بطولات في هذا القسم.</p>
      </div>
    ;

    return;
  }

  container.innerHTML = leagues
    .slice(0, 50)
    .map((item) => {
      const league = item.league || {};
      const country = item.country || {};

      return 
        <button
          class="league-card"
          type="button"
          data-league-id="${escapeHtml(league.id)}"
          data-league-name="${escapeHtml(league.name)}"
        >
          <span class="league-logo">
            ${imageHtml(league.logo, league.name || "L")}
          </span>

          <span>
            <strong>${escapeHtml(
              safeText(league.name, "بطولة")
            )}</strong>

            <small>
              ${escapeHtml(
                safeText(country.name, "دولي")
              )}
              ·
              ${escapeHtml(
                safeText(league.type, "Competition")
              )}
            </small>
          </span>

          <span class="league-arrow">‹</span>
        </button>
      ;
    })
    .join("");
}

/* =========================================================
   LEAGUE DETAILS
   ========================================================= */

async function openLeagueDetails(leagueId, leagueName) {
  const modal = $("#leagueModal");
  const container = $("#leagueDetails");

  if (!modal || !container) {
    return;
  }

  state.selectedLeague = {
    id: Number(leagueId),
    name: leagueName
  };

  modal.classList.remove("hidden");

  container.innerHTML = 
    <div class="loading-box">
      <div class="spinner"></div>
      <p>جاري تحميل تفاصيل البطولة...</p>
    </div>
  ;

  try {
    const fallback = state.leagues.find(
      (item) =>
        Number(item?.league?.id) === Number(leagueId)
    );

    const leagueInfo = fallback?.league || {
      id: leagueId,
      name: leagueName,
      logo: ""
    };

    const country = fallback?.country?.name || "World";

    let season = DEFAULT_SEASON;

    try {
      const seasons = fallback?.seasons;

      if (Array.isArray(seasons) && seasons.length > 0) {
        season = seasons[seasons.length - 1].year || season;
      }
    } catch (seasonError) {
      console.warn("Season error:", seasonError);
    }

    container.innerHTML = 
      <div class="league-head">
        ${imageHtml(
          leagueInfo.logo,
          leagueInfo.name || leagueName
        )}

        <div>
          <h2>${escapeHtml(
            safeText(leagueInfo.name, leagueName)
          )}</h2>
          <p>
            ${escapeHtml(country)}
            · موسم ${escapeHtml(season)}
          </p>
        </div>
      </div>

      <div class="league-detail-tabs">
        <button
          class="league-detail-tab active"
          data-league-detail-tab="standings"
        >
          الترتيب
        </button>

        <button
          class="league-detail-tab"
          data-league-detail-tab="scorers"
        >
          الهدافون
        </button>
      </div>

      <div id="leagueDetailContent">
        <div class="loading-box">
          <div class="spinner"></div>
          <p>جاري تحميل الترتيب...</p>
        </div>
      </div>
    ;

    state.leagueDetailTab = "standings";

    await loadLeagueDetailContent(
      Number(leagueId),
      season
    );
  } catch (error) {
    console.error("League detail error:", error);

    container.innerHTML = 
      <div class="empty-box">
        <div style="font-size:30px">🏆</div>
        <p>تعذر تحميل تفاصيل البطولة حاليًا.</p>
      </div>
    ;
  }
}

async function loadLeagueDetailContent(leagueId, season) {
  const container = $("#leagueDetailContent");

  if (!container) {
    return;
  }

  container.innerHTML = 
    <div class="loading-box">
      <div class="spinner"></div>
      <p>جاري تحميل البيانات...</p>
    </div>
  ;

  try {
    if (state.leagueDetailTab === "scorers") {
      let data;

      try {
        data = await apiRequest(
          "players/topscorers",
          {
            league: leagueId,
            season
          },
          3600
        );
      } catch (apiError) {
        data = {
          response: []
        };
      }

      const players = Array.isArray(data?.response)
        ? data.response
        : [];

      if (players.length === 0) {
        container.innerHTML = 
          <div class="empty-box">
            <div style="font-size:25px">⚽</div>
            <p>لا توجد بيانات للهدافين حاليًا.</p>
          </div>
        ;
        return;
      }

      container.innerHTML = players
        .slice(0, 20)
        .map((item, index) => {
          const player = item.player || {};
          const statistics =
            Array.isArray(item.statistics)
              ? item.statistics[0] || {}
              : {};

          const goals =
            statistics?.goals?.total || 0;

          const team = statistics?.team || {};

          return 
            <div class="top-scorer">
              <span class="scorer-rank">${index + 1}</span>

              ${imageHtml(
                player.photo,
                player.name || "Player",
                "scorer-avatar"
              )}

              <div>
                <strong>${escapeHtml(
                  safeText(player.name, "لاعب")
                )}</strong>

                <small>${escapeHtml(
                  safeText(team.name, "فريق")
                )}</small>
              </div>

              <span class="scorer-goals">
                ${escapeHtml(goals)}
              </span>
            </div>
          ;
        })
        .join("");

      return;
    }

    let data;

    try {
      data = await apiRequest(
        "standings",
        {
          league: leagueId,
          season
        },
        3600
      );
    } catch (apiError) {
      data = {
        response: []
      };
    }

    const standings =
      data?.response?.[0]?.league?.standings?.[0] || [];

    if (!Array.isArray(standings) || standings.length === 0) {
      container.innerHTML = 
        <div class="empty-box">
          <div style="font-size:25px">📊</div>
          <p>لا تتوفر بيانات الترتيب لهذه البطولة حاليًا.</p>
        </div>
      ;
      return;
    }

    container.innerHTML = 
      <table class="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الفريق</th>
            <th>ل</th>
            <th>ف</th>
            <th>ن</th>
            <th>نقاط</th>
          </tr>
        </thead>

        <tbody>
          ${standings.map((row) => {
            const team = row.team || {};
            const all = row.all || {};

            return 
              <tr>
                <td>${escapeHtml(
                  safeText(row.rank, "-")
                )}</td>

                <td>
                  <div class="standings-team">
                    ${imageHtml(
                      team.logo,
                      team.name || "Team"
                    )}
                    <span>${escapeHtml(
                      safeText(team.name, "فريق")
                    )}</span>
                  </div>
                </td>

                <td>${escapeHtml(
                  safeText(all.played, "0")
                )}</td>

                <td>${escapeHtml(
                  safeText(all.win, "0")
                )}</td>

                <td>${escapeHtml(
                  safeText(all.draw, "0")
                )}</td>

                <td><strong>${escapeHtml(
                  safeText(row.points, "0")
                )}</strong></td>
              </tr>
            ;
          }).join("")}
        </tbody>
      </table>
    ;
  } catch (error) {
    console.error("League content error:", error);

    container.innerHTML = 
      <div class="empty-box">
        <p>حدث خطأ أثناء تحميل بيانات البطولة.</p>
      </div>
    ;
  }
}

/* =========================================================
   CHANNELS
   ========================================================= */

function renderChannels() {
  const container = $("#channelsList");

  if (!container) {
    return;
  }

  let list = [...channels];

  if (
    state.channelFilter === "beIN" ||
    state.channelFilter === "SSC"
  ) {
    list = list.filter(
      (channel) =>
        channel.group === state.channelFilter
    );
  }

  if (state.channelFilter === "favorite") {
    list = list.filter((channel) =>
      state.favoriteChannels.includes(channel.id)
    );
  }

  if (list.length === 0) {
    container.innerHTML = 
      <div class="empty-box" style="grid-column:1/-1">
        <div style="font-size:28px">📺</div>
        <p>لا توجد قنوات في المفضلة.</p>
      </div>
    ;

    return;
  }

  container.innerHTML = list
    .map((channel) => {
      const favorite =
        state.favoriteChannels.includes(channel.id);

      return 
        <article class="channel-card">
          <button
            class="channel-fav ${favorite ? "active" : ""}"
            type="button"
            data-channel-fav="${escapeHtml(channel.id)}"
            aria-label="المفضلة"
          >
            ${favorite ? "♥" : "♡"}
          </button>

          <div class="channel-logo">
            ${escapeHtml(channel.icon)}
          </div>

          <strong>${escapeHtml(channel.name)}</strong>
          <small>${escapeHtml(channel.description)}</small>
        </article>
      ;
    })
    .join("");
}

/* =========================================================
   FAVORITES
   ========================================================= */

function isFavorite(teamId) {
  return state.favorites.some(
    (team) => Number(team.id) === Number(teamId)
  );
}

function toggleFavorite(team) {
  try {
    if (!team || team.id === undefined) {
      return;
    }

    const index = state.favorites.findIndex(
      (item) =>
        Number(item.id) === Number(team.id)
    );

    if (index >= 0) {
      state.favorites.splice(index, 1);
      showToast("تم حذف الفريق من المفضلة", "♥");
    } else {
      state.favorites.push({
        id: Number(team.id),
        name: safeText(team.name, "فريق"),
        logo: team.logo || ""
      });

      showToast("تمت إضافة الفريق إلى المفضلة", "♥");
    }

    saveLocalData();

    renderFavorites();

    updateModalFavoriteButton();
  } catch (error) {
    console.error("Favorite error:", error);
    showToast("تعذر تعديل المفضلة", "!");
  }
}

function renderFavorites() {
  const container = $("#favoritesList");

  if (!container) {
    return;
  }

  if (!Array.isArray(state.favorites) ||
      state.favorites.length === 0) {
    container.innerHTML = 
      <div class="empty-box">
        <div style="font-size:35px">♡</div>
        <p>لم تضف أي فريق إلى المفضلة بعد.</p>
        <button
          class="text-btn"
          data-page="matchesPage"
          style="margin-top:8px"
        >
          استعرض المباريات
        </button>
      </div>
    ;
    return;
  }

  container.innerHTML = state.favorites
    .map((team) => 
      <div class="favorite-team">
        ${imageHtml(
          team.logo,
          team.name,
          ""
        )}

        <div>
          <strong>${escapeHtml(team.name)}</strong>
          <small>فريق مفضل</small>
        </div>

        <button
          class="remove-favorite"
          type="button"
          data-remove-favorite="${escapeHtml(team.id)}"
        >
          ♥
        </button>
      </div>
    )
    .join("");
}

/* =========================================================
   MATCH DETAILS
   ========================================================= */

async function openMatchDetails(matchId) {
  const modal = $("#matchModal");
  const container = $("#matchDetails");

  if (!modal || !container) {
    return;
  }

  modal.classList.remove("hidden");

  state.selectedMatch = null;
  state.detailTab = "events";

  container.innerHTML = 
    <div class="loading-box">
      <div class="spinner"></div>
      <p>جاري تحميل تفاصيل المباراة...</p>
    </div>
  ;

  try {
    const localMatch =
      state.matches.find(
        (match) =>
          Number(match?.fixture?.id) === Number(matchId)
      ) ||
      state.todayMatches.find(
        (match) =>
          Number(match?.fixture?.id) === Number(matchId)
      ) ||
      fallbackMatches.find(
        (match) =>
          Number(match?.fixture?.id) === Number(matchId)
      );

    let match = localMatch;

    try {
      if (API_ENABLED) {
        const data = await apiRequest(
          "fixtures",
          {
            id: matchId
          },
          30
        );

        if (
          Array.isArray(data?.response) &&
          data.response[0]
        ) {
          match = data.response[0];
        }
      }
    } catch (apiError) {
      console.warn(
        "Match details API error:",
        apiError
      );
    }

    if (!match) {
      throw new Error("MATCH_NOT_FOUND");
    }

    state.selectedMatch = match;

    renderMatchDetailsHeader(match);

    await loadDetailTab();
  } catch (error) {
    console.error("Match details error:", error);

    container.innerHTML = 
      <div class="empty-box">
        <div style="font-size:30px">⚽</div>
        <p>تعذر تحميل تفاصيل المباراة.</p>
      </div>
    ;
  }
}

function renderMatchDetailsHeader(match) {
  const container = $("#matchDetails");

  if (!container) {
    return;
  }

  const league = match.league || {};
  const home = match.teams?.home || {};
  const away = match.teams?.away || {};
  const goals = match.goals || {};

  const live = isLive(match);

  const homeScore =
    goals.home === null ||
    goals.home === undefined
      ? "-"
      : goals.home;

  const awayScore =
    goals.away === null ||
    goals.away === undefined
      ? "-"
      : goals.away;

  container.innerHTML = 
    <div class="detail-hero">
      <div class="detail-league">
        ${escapeHtml(
          safeText(league.name, "بطولة")
        )}
      </div>

      <span class="detail-status ${live ? "live" : ""}">
        ${escapeHtml(getStatusLabel(match))}
      </span>

      <div class="detail-teams">

        <div class="detail-team">
          ${imageHtml(
            home.logo,
            home.name || "Home"
          )}
          <strong>${escapeHtml(
            safeText(home.name, "المضيف")
          )}</strong>
        </div>

        <div>
          <div class="detail-score">
            ${escapeHtml(homeScore)}
            :
            ${escapeHtml(awayScore)}
          </div>

          <div class="detail-time">
            ${escapeHtml(
              formatTime(match.fixture?.date)
            )}
          </div>
        </div>

        <div class="detail-team">
          ${imageHtml(
            away.logo,
            away.name || "Away"
          )}
          <strong>${escapeHtml(
            safeText(away.name, "الضيف")
          )}</strong>
        </div>

      </div>
    </div>
  ;

  updateModalFavoriteButton();
}

function updateModalFavoriteButton() {
  const button = $("#modalFavoriteBtn");

  if (!button) {
    return;
  }

  const homeId =
    state.selectedMatch?.teams?.home?.id;

  const awayId =
    state.selectedMatch?.teams?.away?.id;

  const favorite =
    isFavorite(homeId) ||
    isFavorite(awayId);

  button.classList.toggle("active", favorite);
  button.textContent = favorite ? "♥" : "♡";
}

async function loadDetailTab() {
  const container = $("#detailTabContent");

  if (!container || !state.selectedMatch) {
    return;
  }

  container.innerHTML = 
    <div class="loading-box">
      <div class="spinner"></div>
      <p>جاري تحميل البيانات...</p>
    </div>
  ;

  const matchId =
    state.selectedMatch.fixture?.id;

  try {
    if (state.detailTab === "events") {
      await loadMatchEvents(matchId);
      return;
    }

    if (state.detailTab === "lineups") {
      await loadMatchLineups(matchId);
      return;
    }

    if (state.detailTab === "stats") {
      await loadMatchStats(matchId);
      return;
    }
  } catch (error) {
    console.error(
      "Detail tab error:",
      error
    );

    container.innerHTML = 
      <div class="empty-box">
        <p>لا توجد بيانات متاحة حاليًا.</p>
      </div>
    ;
  }
}

/* =========================================================
   EVENTS
   ========================================================= */

async function loadMatchEvents(matchId) {
  const container = $("#detailTabContent");

  if (!container) {
    return;
  }

  let events = [];

  try {
    if (API_ENABLED) {
      const data = await apiRequest(
        "fixtures/events",
        {
          fixture: matchId
        },
        30
      );

      events = Array.isArray(data?.response)
        ? data.response
        : [];
    }
  } catch (error) {
    console.warn("Events API error:", error);
  }

  if (events.length === 0) {
    container.innerHTML = 
      <div class="no-events">
        لا توجد أحداث متاحة لهذه المباراة حاليًا.
      </div>
    ;
    return;
  }

  container.innerHTML = events
    .map((event) => {
      const type = event.type || "";
      const detail = event.detail || "";
      const player = event.player?.name || "";
      const team = event.team?.name || "";

      let icon = "•";

      if (type === "Goal") icon = "⚽";
      if (type === "Card") {
        icon =
          detail.toLowerCase().includes("red")
            ? "🟥"
            : "🟨";
      }
      if (type === "subst") icon = "🔄";
      if (type === "Var") icon = "📺";

      const minute =
        event.time?.elapsed !== undefined
          ? ${event.time.elapsed}'
          : "--";

      return 
        <div class="event-item">
          <span class="event-minute">
            ${escapeHtml(minute)}
          </span>

          <div class="event-center">
            <strong>${escapeHtml(
              safeText(player, detail || type)
            )}</strong>

            <div class="event-team">
              ${escapeHtml(
                safeText(team, "")
              )}
            </div>
          </div>

          <span class="event-icon">${icon}</span>
        </div>
      ;
    })
    .join("");
}

/* =========================================================
   LINEUPS
   ========================================================= */

async function loadMatchLineups(matchId) {
  const container = $("#detailTabContent");

  if (!container) {
    return;
  }

  let lineups = [];

  try {
    if (API_ENABLED) {
      const data = await apiRequest(
        "fixtures/lineups",
        {
          fixture: matchId
        },
        300
      );

      lineups = Array.isArray(data?.response)
        ? data.response
        : [];
    }
  } catch (error) {
    console.warn("Lineups API error:", error);
  }

  if (lineups.length === 0) {
    container.innerHTML = 
      <div class="no-events">
        لا تتوفر التشكيلات حاليًا.
      </div>
    ;
    return;
  }

  container.innerHTML = lineups
    .map((lineup) => {
      const team = lineup.team || {};
      const players = Array.isArray(lineup.startXI)
        ? lineup.startXI
        : [];

      return 
        <div class="lineup-section">
          <h3>
            ${escapeHtml(
              safeText(team.name, "الفريق")
            )}
            ${
              lineup.formation
                ?  · ${escapeHtml(lineup.formation)}
                : ""
            }
          </h3>

          <div class="lineup-list">
            ${players.map((item) => {
              const player =
                item.player || {};

              return 
                <div class="player-row">
                  <span class="player-number">
                    ${escapeHtml(
                      safeText(
                        player.number,
                        "-"
                      )
                    )}
                  </span>

                  <div>
                    <strong>${escapeHtml(
                      safeText(
                        player.name,
                        "لاعب"
                      )
                    )}</strong>

                    <small>
                      ${escapeHtml(
                        safeText(
                          player.pos,
                          "لاعب"
                        )
                      )}
                    </small>
                  </div>
                </div>
              ;
            }).join("")}
          </div>
        </div>
      ;
    })
    .join("");
}

/* =========================================================
   STATISTICS
   ========================================================= */

async function loadMatchStats(matchId) {
  const container = $("#detailTabContent");

  if (!container) {
    return;
  }

  let stats = [];

  try {
    if (API_ENABLED) {
      const data = await apiRequest(
        "fixtures/statistics",
        {
          fixture: matchId
        },
        120
      );

      stats = Array.isArray(data?.response)
        ? data.response
        : [];
    }
  } catch (error) {
    console.warn("Statistics API error:", error);
  }

  if (stats.length === 0) {
    container.innerHTML = 
      <div class="no-events">
        لا تتوفر إحصائيات لهذه المباراة حاليًا.
      </div>
    ;
    return;
  }

  const statMap = new Map();

  stats.forEach((teamStats) => {
    const teamName =
      teamStats?.team?.name || "فريق";

    const values =
      Array.isArray(teamStats?.statistics)
        ? teamStats.statistics
        : [];

    values.forEach((item) => {
      const key = item.type;

      if (!statMap.has(key)) {
        statMap.set(key, {
          name: key,
          values: []
        });
      }

      statMap.get(key).values.push({
        team: teamName,
        value: item.value
      });
    });
  });

  const rows = Array.from(statMap.values());

  if (rows.length === 0) {
    container.innerHTML = 
      <div class="no-events">
        لا توجد إحصائيات متاحة.
      </div>
    ;
    return;
  }

  container.innerHTML = 
    <div class="stats-section">
      ${rows.map((row) => {
        const first = row.values[0]?.value ?? 0;
        const second = row.values[1]?.value ?? 0;

        const n1 = parseNumericValue(first);
        const n2 = parseNumericValue(second);

        const total = n1 + n2 || 1;
        const homePercent = (n1 / total) * 100;

        return 
          <div class="stat-row">
            <div class="stat-head">
              <span>${escapeHtml(
                safeText(row.values[0]?.value, "0")
              )}</span>

              <strong>${escapeHtml(
                safeText(row.name, "إحصائية")
              )}</strong>

              <span>${escapeHtml(
                safeText(row.values[1]?.value, "0")
              )}</span>
            </div>

            <div class="stat-bar">
              <div
                class="stat-home"
                style="width:${homePercent}%"
              ></div>

              <div
                class="stat-away"
                style="width:${100 - homePercent}%"
              ></div>
            </div>
          </div>
        ;
      }).join("")}
    </div>
  ;
}

function parseNumericValue(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return 0;
  }

  const clean = value.replace("%", "").trim();
  const number = parseFloat(clean);

  return Number.isFinite(number)
    ? number
    : 0;
}

/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {
  const input = $("#globalSearch");
  const results = $("#searchResults");
  const clear = $("#clearSearch");

  if (!input  !results  !clear) {
    return;
  }

  input.addEventListener("input", () => {
    try {
      const query = input.value.trim();

      clear.classList.toggle(
        "hidden",
        query.length === 0
      );

      clearTimeout(state.searchTimer);

      if (query.length < 3) {
        results.classList.add("hidden");
        results.innerHTML = "";
        return;
      }

      results.classList.remove("hidden");

      results.innerHTML = 
        <div class="search-result">
          <span class="result-icon">⌕</span>
          <div>
            <strong>جاري البحث...</strong>
            <small>يرجى الانتظار</small>
          </div>
        </div>
      ;

      state.searchTimer = setTimeout(() => {
        performSearch(query);
      }, 500);
    } catch (error) {
      console.warn("Search input error:", error);
    }
  });

  clear.addEventListener("click", () => {
    input.value = "";
    clear.classList.add("hidden");
    results.classList.add("hidden");
    results.innerHTML = "";
    input.focus();
  });

  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".search-wrapper")
    ) {
      results.classList.add("hidden");
    }
  });
}

async function performSearch(query) {
  const results = $("#searchResults");

  if (!results) {
    return;
  }

  try {
    if (!API_ENABLED) {
      performLocalSearch(query);
      return;
    }

    const [teamsData, leaguesData] =
      await Promise.allSettled([
        apiRequest(
          "teams",
          {
            search: query
          },
          600
        ),
        apiRequest(
          "leagues",
          {
            search: query
          },
          600
        )
      ]);

    const teams =
      teamsData.status === "fulfilled" &&
      Array.isArray(
        teamsData.value?.response
      )
        ? teamsData.value.response
        : [];

    const leagues =
      leaguesData.status === "fulfilled" &&
      Array.isArray(
        leaguesData.value?.response
      )
        ? leaguesData.value.response
        : [];

    renderSearchResults(
      teams.slice(0, 5),
      leagues.slice(0, 5)
    );
  } catch (error) {
    console.warn("Search API error:", error);

    performLocalSearch(query);
  }
}

function performLocalSearch(query) {
  const q = query.toLowerCase();

  const teams = [];

  fallbackMatches.forEach((match) => {
    const home = match.teams?.home;
    const away = match.teams?.away;

    if (
      home?.name?.toLowerCase().includes(q)
    ) {
      teams.push({
        team: home
      });
    }

    if (
      away?.name?.toLowerCase().includes(q)
    ) {
      teams.push({
        team: away
      });
    }
  });

  const leagues = fallbackLeagues.filter(
    (item) =>
      item?.league?.name
        ?.toLowerCase()
        .includes(q)
  );

  renderSearchResults(
    teams.slice(0, 5),
    leagues.slice(0, 5)
  );
}

function renderSearchResults(teams, leagues) {
  const results = $("#searchResults");

  if (!results) {
    return;
  }

  if (
    teams.length === 0 &&
    leagues.length === 0
  ) {
    results.innerHTML = 
      <div class="search-result">
        <span class="result-icon">⌕</span>
        <div>
          <strong>لا توجد نتائج</strong>
          <small>جرّب كلمة بحث أخرى</small>
        </div>
      </div>
    ;

    return;
  }

  let html = "";

  teams.forEach((item) => {
    const team = item.team || {};

    html += 
      <button
        class="search-result"
        type="button"
        data-search-team-id="${escapeHtml(team.id)}"
        data-search-team-name="${escapeHtml(team.name)}"
        data-search-team-logo="${escapeHtml(team.logo || "")}"
      >
        ${imageHtml(
          team.logo,
          team.name,
          ""
        )}

        <div>
          <strong>${escapeHtml(
            safeText(team.name, "فريق")
          )}</strong>
          <small>فريق · اضغط للإضافة للمفضلة</small>
        </div>
      </button>
    ;
  });

  leagues.forEach((item) => {
    const league = item.league || {};

    html += 
      <button
        class="search-result"
        type="button"
        data-search-league-id="${escapeHtml(league.id)}"
        data-search-league-name="${escapeHtml(league.name)}"
      >
        ${imageHtml(
          league.logo,
          league.name,
          ""
        )}

        <div>
          <strong>${escapeHtml(
            safeText(league.name, "بطولة")
          )}</strong>
          <small>بطولة · اضغط لعرض التفاصيل</small>
        </div>
      </button>
    ;
  });

  results.innerHTML = html;
}

/* =========================================================
   SETTINGS
   ========================================================= */

function renderSettings() {
  $$(".quality-option").forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.quality ===
        state.settings.quality
    );
  });

  const autoRefresh = $("#autoRefreshToggle");
  const notifications = $("#notificationsToggle");
  const darkMode = $("#darkModeToggle");

  if (autoRefresh) {
    autoRefresh.checked =
      Boolean(state.settings.autoRefresh);
  }

  if (notifications) {
    notifications.checked =
      Boolean(state.settings.notifications);
  }

  if (darkMode) {
    darkMode.checked =
      Boolean(state.settings.darkMode);
  }
}

/* =========================================================
   REFRESH
   ========================================================= */

async function refreshCurrentData() {
  const button = $("#refreshIcon");

  if (button) {
    button.style.display = "inline-block";
    button.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(360deg)" }
      ],
      {
        duration: 650,
        iterations: 1
      }
    );
  }

  try {
    state.cache.clear();

    if (state.currentPage === "homePage") {
      await loadHome();
    }

    if (state.currentPage === "matchesPage") {
      await loadMatchesPage();
    }

    if (state.currentPage === "resultsPage") {
      await loadResultsPage();
    }

    if (state.currentPage === "leaguesPage") {
      await loadLeagues();
    }

    if (state.currentPage === "channelsPage") {
      renderChannels();
    }

    showToast("تم تحديث البيانات", "✓");
  } catch (error) {
    console.warn("Refresh error:", error);
    showToast("تعذر التحديث، التطبيق يعمل طبيعيًا", "!");
  }
}

/* =========================================================
   AUTO REFRESH
   ========================================================= */

function setupAutoRefresh() {
  clearInterval(state.refreshTimer);

  if (!state.settings.autoRefresh) {
    return;
  }

  const interval =
    state.settings.quality === "best"
      ? 30000
      : state.settings.quality === "data"
        ? 120000
        : 60000;

  state.refreshTimer = setInterval(async () => {
    try {
      if (
        document.hidden ||
        !API_ENABLED
      ) {
        return;
      }

      if (
        state.currentPage === "homePage" ||
        state.currentPage === "matchesPage"
      ) {
        await refreshLiveOnly();
      }
    } catch (error) {
      console.warn(
        "Automatic refresh error:",
        error
      );
    }
  }, interval);
}

async function refreshLiveOnly() {
  try {
    const data = await apiRequest(
      "fixtures",
      {
        live: "all"
      },
      20
    );

    const live =
      Array.isArray(data?.response)
        ? data.response
        : [];

    state.liveMatches = live;

    const homeLive = $("#homeLiveMatches");

    if (
      homeLive &&
      state.currentPage === "homePage"
    ) {
      homeLive.innerHTML =
        live.length > 0
          ? live
              .slice(0, 4)
              .map(renderMatchCard)
              .join("")
          : 
            <div class="empty-box">
              <div style="font-size:28px">⚽</div>
              <p>لا توجد مباريات مباشرة حاليًا</p>
            </div>
          ;
    }
  } catch (error) {
    console.warn(
      "Live refresh failed:",
      error
    );
  }
}

/* =========================================================
   SHARE / CONTACT
   ========================================================= */

async function shareApp() {
  const shareData = {
    title: "ود فيصل",
    text: "ود فيصل - كرة القدم... عشق لا ينتهي",
    url: window.location.href
  };

  try {
    if (
      navigator.share &&
      typeof navigator.share === "function"
    ) {
      await navigator.share(shareData);
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(
        window.location.href
      );

      showToast(
        "تم نسخ رابط التطبيق",
        "✓"
      );

      return;
    }

    showToast(
      "رابط التطبيق: " + window.location.href,
      "↗"
    );
  } catch (error) {
    if (error?.name !== "AbortError") {
      showToast(
        "تعذر مشاركة التطبيق",
        "!"
      );
    }
  }
}

function openContact() {
  try {
    window.location.href =
      "mailto:?subject=تواصل مع ود فيصل&body=مرحباً فريق ود فيصل،";
  } catch (error) {
    showToast("تعذر فتح البريد", "!");
  }
}

function sendIdea() {
  try {
    window.location.href =
      "mailto:?subject=فكرة لتطوير ود فيصل&body=لدي فكرة لتطوير تطبيق ود فيصل:%0A%0A";
  } catch (error) {
    showToast("تعذر فتح البريد", "!");
  }
}

/* =========================================================
   EVENT DELEGATION
   ========================================================= */

function setupGlobalEvents() {
  document.addEventListener("click", async (event) => {
    try {
      const pageButton =
        event.target.closest("[data-page]");

      if (
        pageButton &&
        !event.target.closest(".match-open")
      ) {
        const pageId =
          pageButton.dataset.page;

        if (pageId) {
          navigateTo(pageId);
          return;
        }
      }

      const matchButton =
        event.target.closest("[data-match-id]");

      if (matchButton) {
        await openMatchDetails(
          matchButton.dataset.matchId
        );
        return;
      }

      const leagueButton =
        event.target.closest("[data-league-id]");

      if (leagueButton) {
        await openLeagueDetails(
          leagueButton.dataset.leagueId,
          leagueButton.dataset.leagueName
        );
        return;
      }

      const searchTeam =
        event.target.closest(
          "[data-search-team-id]"
        );

      if (searchTeam) {
        toggleFavorite({
          id: searchTeam.dataset.searchTeamId,
          name: searchTeam.dataset.searchTeamName,
          logo: searchTeam.dataset.searchTeamLogo
        });

        const searchResults =
          $("#searchResults");

        if (searchResults) {
          searchResults.classList.add(
            "hidden"
          );
        }

        return;
      }

      const searchLeague =
        event.target.closest(
          "[data-search-league-id]"
        );

      if (searchLeague) {
        await openLeagueDetails(
          searchLeague.dataset.searchLeagueId,
          searchLeague.dataset.searchLeagueName
        );

        const searchResults =
          $("#searchResults");

        if (searchResults) {
          searchResults.classList.add(
            "hidden"
          );
        }

        return;
      }

      const removeFavorite =
        event.target.closest(
          "[data-remove-favorite]"
        );

      if (removeFavorite) {
        const id =
          Number(
            removeFavorite.dataset.removeFavorite
          );

        state.favorites =
          state.favorites.filter(
            (team) =>
              Number(team.id) !== id
          );

        saveLocalData();
        renderFavorites();
        updateModalFavoriteButton();

        showToast(
          "تم حذف الفريق من المفضلة",
          "♥"
        );

        return;
      }

      const channelFavorite =
        event.target.closest(
          "[data-channel-fav]"
        );

      if (channelFavorite) {
        const id =
          channelFavorite.dataset.channelFav;

        const index =
          state.favoriteChannels.indexOf(id);

        if (index >= 0) {
          state.favoriteChannels.splice(
            index,
            1
          );

          showToast(
            "تم حذف القناة من المفضلة",
            "♥"
          );
        } else {
          state.favoriteChannels.push(id);

          showToast(
            "تمت إضافة القناة للمفضلة",
            "♥"
          );
        }

        saveLocalData();
        renderChannels();

        return;
      }

      const matchFilter =
        event.target.closest(
          "[data-match-filter]"
        );

      if (matchFilter) {
        state.matchFilter =
          matchFilter.dataset.matchFilter;

        $$(".tab").forEach((tab) => {
          tab.classList.toggle(
            "active",
            tab === matchFilter
          );
        });

        renderMatchesFiltered();
        return;
      }

      const resultDay =
        event.target.closest(
          "[data-result-day]"
        );

      if (resultDay) {
        state.resultOffset =
          Number(
            resultDay.dataset.resultDay
          );

        $$(".date-btn").forEach((button) => {
          button.classList.toggle(
            "active",
            button === resultDay
          );
        });

        await loadResultsPage();
        return;
      }

      const leagueType =
        event.target.closest(
          "[data-league-type]"
        );

      if (leagueType) {
        state.leagueFilter =
          leagueType.dataset.leagueType;

        $$(".league-filter-btn").forEach(
          (button) => {
            button.classList.toggle(
              "active",
              button === leagueType
            );
          }
        );

        renderLeagues();
        return;
      }

      const channelFilter =
        event.target.closest(
          "[data-channel-filter]"
        );

      if (channelFilter) {
        state.channelFilter =
          channelFilter.dataset.channelFilter;

        $$(".channel-tab").forEach(
          (button) => {
            button.classList.toggle(
              "active",
              button === channelFilter
            );
          }
        );

        renderChannels();
        return;
      }

      const detailTab =
        event.target.closest(
          "[data-detail-tab]"
        );

      if (detailTab) {
        state.detailTab =
          detailTab.dataset.detailTab;

        $$(".detail-tab").forEach(
          (button) => {
            button.classList.toggle(
              "active",
              button === detailTab
            );
          }
        );

        await loadDetailTab();
        return;
      }

      const leagueDetailTab =
        event.target.closest(
          "[data-league-detail-tab]"
        );

      if (leagueDetailTab) {
        state.leagueDetailTab =
          leagueDetailTab.dataset.leagueDetailTab;

        $$(".league-detail-tab").forEach(
          (button) => {
            button.classList.toggle(
              "active",
              button === leagueDetailTab
            );
          }
        );

        const league =
          state.selectedLeague;

        if (league) {
          await loadLeagueDetailContent(
            league.id,
            DEFAULT_SEASON
          );
        }

        return;
      }

      const closeMatch =
        event.target.closest(
          "[data-close-modal]"
        );

      if (closeMatch) {
        closeMatchModal();
        return;
      }

      const closeLeague =
        event.target.closest(
          "[data-close-league]"
        );

      if (closeLeague) {
        closeLeagueModal();
        return;
      }
    } catch (error) {
      console.error(
        "Global click error:",
        error
      );

      showToast(
        "حدث خطأ بسيط، حاول مرة أخرى",
        "!"
      );
    }
  });
}

/* =========================================================
   SETTINGS EVENTS
   ========================================================= */

function setupSettingsEvents() {
  $$(".quality-option").forEach((button) => {
    button.addEventListener("click", () => {
      try {
        state.settings.quality =
          button.dataset.quality;

        saveLocalData();
        renderSettings();
        setupAutoRefresh();

        showToast(
          "تم حفظ جودة البيانات",
          "✓"
        );
      } catch (error) {
        console.warn(
          "Quality setting error:",
          error
        );
      }
    });
  });

  const autoRefresh =
    $("#autoRefreshToggle");

  if (autoRefresh) {
    autoRefresh.addEventListener(
      "change",
      () => {
        state.settings.autoRefresh =
          autoRefresh.checked;

        saveLocalData();
        setupAutoRefresh();

        showToast(
          autoRefresh.checked
            ? "تم تشغيل التحديث التلقائي"
            : "تم إيقاف التحديث التلقائي",
          "✓"
        );
      }
    );
  }

  const notifications =
    $("#notificationsToggle");

  if (notifications) {
    notifications.addEventListener(
      "change",
      () => {
        state.settings.notifications =
          notifications.checked;

        saveLocalData();

        showToast(
          notifications.checked
            ? "تم تشغيل الإشعارات"
            : "تم إيقاف الإشعارات",
          "✓"
        );
      }
    );
  }

  const darkMode =
    $("#darkModeToggle");

  if (darkMode) {
    darkMode.addEventListener(
      "change",
      () => {
        state.settings.darkMode =
          darkMode.checked;

        saveLocalData();

        /*
          The application is designed primarily
          as a dark sports UI. The switch therefore
          controls the saved preference while the
          neon theme remains the core visual identity.
        */

        showToast(
          darkMode.checked
            ? "الوضع الليلي مفعّل"
            : "تم حفظ إعداد المظهر",
          "✓"
        );
      }
    );
  }
}

/* =========================================================
   MODALS
   ========================================================= */

function closeMatchModal() {
  const modal = $("#matchModal");

  if (modal) {
    modal.classList.add("hidden");
  }

  state.selectedMatch = null;
}

function closeLeagueModal() {
  const modal = $("#leagueModal");

  if (modal) {
    modal.classList.add("hidden");
  }

  state.selectedLeague = null;
}

function setupModalEvents() {
  const matchModal =
    $("#matchModal");

  const leagueModal =
    $("#leagueModal");

  if (matchModal) {
    matchModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target === matchModal
        ) {
          closeMatchModal();
        }
      }
    );
  }

  if (leagueModal) {
    leagueModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target === leagueModal
        ) {
          closeLeagueModal();
        }
      }
    );
  }

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      closeMatchModal();
      closeLeagueModal();
    }
  );

  const favoriteButton =
    $("#modalFavoriteBtn");

  if (favoriteButton) {
    favoriteButton.addEventListener(
      "click",
      () => {
        try {
          const match =
            state.selectedMatch;

          if (!match) {
            return;
          }

          const home =
            match.teams?.home;

          const away =
            match.teams?.away;

          /*
            If either team is already favorite,
            remove it. Otherwise add home team.
          */
          if (isFavorite(home?.id)) {
            toggleFavorite(home);
            return;
          }

          if (isFavorite(away?.id)) {
            toggleFavorite(away);
            return;
          }

          toggleFavorite(home);
        } catch (error) {
          console.warn(
            "Modal favorite error:",
            error
          );
        }
      }
    );
  }
}

/* =========================================================
   HEADER EVENTS
   ========================================================= */

function setupHeaderEvents() {
  const refresh =
    $("#refreshBtn");

  if (refresh) {
    refresh.addEventListener(
      "click",
      refreshCurrentData
    );
  }

  const matchesRefresh =
    $("#matchesRefreshBtn");

  if (matchesRefresh) {
    matchesRefresh.addEventListener(
      "click",
      async () => {
        state.cache.clear();
        await loadMatchesPage();
      }
    );
  }

  const notification =
    $("#notificationBtn");

  if (notification) {
    notification.addEventListener(
      "click",
      () => {
        if (
          state.settings.notifications
        ) {
          showToast(
            "لا توجد إشعارات جديدة حاليًا",
            "🔔"
          );
        } else {
          showToast(
            "الإشعارات متوقفة من الإعدادات",
            "!"
          );
        }
      }
    );
  }

  const share =
    $("#shareAppBtn");

  if (share) {
    share.addEventListener(
      "click",
      shareApp
    );
  }

  const contact =
    $("#contactBtn");

  if (contact) {
    contact.addEventListener(
      "click",
      openContact
    );
  }

  const idea =
    $("#ideaBtn");

  if (idea) {
    idea.addEventListener(
      "click",
      sendIdea
    );
  }
}

/* =========================================================
   SPLASH
   ========================================================= */

function finishSplash() {
  try {
    const splash =
      $("#splashScreen");

    const app =
      $("#app");

    if (app) {
      app.classList.remove("hidden");
    }

    if (splash) {
      splash.classList.add("hide");

      setTimeout(() => {
        splash.remove();
      }, 700);
    }
  } catch (error) {
    console.warn(
      "Splash finish error:",
      error
    );

    const splash =
      $("#splashScreen");

    const app =
      $("#app");

    if (splash) {
      splash.style.display = "none";
    }

    if (app) {
      app.classList.remove("hidden");
    }
  }
}

function startSplash() {
  const loadingText =
    $("#loadingText");

  const messages = [
    "جاري تحميل التطبيق...",
    "جاري تجهيز المباريات...",
    "جاري تجهيز البطولات...",
    "أهلاً بك في ود فيصل..."
  ];

  let index = 0;

  const messageTimer =
    setInterval(() => {
      try {
        index++;

        if (
          loadingText &&
          messages[index]
        ) {
          loadingText.textContent =
            messages[index];
        }

        if (index >= messages.length - 1) {
          clearInterval(messageTimer);
        }
      } catch (error) {
        clearInterval(messageTimer);
      }
    }, 500);

  /*
    Splash is deliberately independent from API.
    Even if internet/API fails, the app opens.
  */
  setTimeout(
    finishSplash,
    2100
  );
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

async function initializeApp() {
  try {
    loadLocalData();

    setupGlobalEvents();
    setupSearch();
    setupSettingsEvents();
    setupModalEvents();
    setupHeaderEvents();

    renderSettings();
    renderChannels();
    renderFavorites();

    /*
      The app does not wait for the API.
      Home data is loaded in the background.
    */
    loadHome().catch((error) => {
      console.warn(
        "Background home load:",
        error
      );
    });

    setupAutoRefresh();

    /*
      Make sure navigation works immediately.
    */
    navigateTo("homePage");

    /*
      If API is not configured, inform user
      without blocking the application.
    */
    if (!API_ENABLED) {
      setTimeout(() => {
        showToast(
          "ضع مفتاح API داخل script.js لتفعيل البيانات الحية",
          "!"
        );
      }, 2500);
    }
  } catch (error) {
    /*
      Absolute fallback:
      never let initialization prevent the UI
      from opening.
    */
    console.error(
      "Application initialization error:",
      error
    );

    try {
      renderSettings();
      renderChannels();
      renderFavorites();
    } catch (fallbackError) {
      console.error(
        "Fallback initialization error:",
        fallbackError
      );
    }
  }
}

/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    try {
      initializeApp();
    } catch (error) {
      console.error(
        "DOMContentLoaded error:",
        error
      );
    }

    /*
      Splash timer is independent from all
      API/network operations.
    */
    startSplash();
  }
);

/* =========================================================
   GLOBAL ERROR PROTECTION
   ========================================================= */

window.addEventListener(
  "error",
  (event) => {
    console.warn(
      "Global JavaScript error:",
      event.error || event.message
    );

    /*
      Do not expose technical errors to users.
      The application remains usable.
    */
  }
);

window.addEventListener(
  "unhandledrejection",
  (event) => {
    console.warn(
      "Unhandled promise rejection:",
      event.reason
    );

    /*
      Prevent a rejected API promise from
      breaking the rest of the application.
    */

    event.preventDefault();
  }
);
