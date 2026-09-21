/* =========================================================
   ود فيصل
   Telegram + Football API
========================================================= */


/* =========================================================
   الروابط الأساسية
========================================================= */

const CHANNEL_URL =
  "https://t.me/alrufaaey1";

const DEVELOPER_URL =
  "https://t.me/mohmmedfysal";

const DEVELOPER_USERNAME =
  "@mohmmedfysal";


/* =========================================================
   API-Football
========================================================= */

const FOOTBALL_API_KEY =
  "7c34938958fccb0a48fe5f67e493d9ec";

const FOOTBALL_API_BASE =
  "https://v3.football.api-sports.io";

const FOOTBALL_TIMEZONE =
  "Africa/Khartoum";


/*
  التحديث التلقائي كل 15 دقيقة.
  السبب:
  الخطة المجانية محدودة بعدد طلبات يومي،
  لذلك لا نستهلكها بسرعة.
*/
const FOOTBALL_REFRESH_MS =
  15 * 60 * 1000;


/*
  أقل مدة بين طلبين يدويين.
*/
const FOOTBALL_MIN_REQUEST_GAP =
  60 * 1000;


/* =========================================================
   عناصر الصفحات
========================================================= */

const welcomeScreen =
  document.getElementById("welcomeScreen");

const homeScreen =
  document.getElementById("homeScreen");

const messageScreen =
  document.getElementById("messageScreen");

const footballScreen =
  document.getElementById("footballScreen");


/* =========================================================
   أزرار الصفحة الرئيسية
========================================================= */

const enterBtn =
  document.getElementById("enterBtn");

const channelBtn =
  document.getElementById("channelBtn");

const developerBtn =
  document.getElementById("developerBtn");

const messageBtn =
  document.getElementById("messageBtn");

const footballBtn =
  document.getElementById("footballBtn");

const aboutBtn =
  document.getElementById("aboutBtn");

const backHomeBtn =
  document.getElementById("backHomeBtn");

const backFootballHomeBtn =
  document.getElementById("backFootballHomeBtn");


/* =========================================================
   المطور
========================================================= */

const developerModal =
  document.getElementById("developerModal");

const aboutModal =
  document.getElementById("aboutModal");

const openDeveloperBtn =
  document.getElementById("openDeveloperBtn");

const copyDeveloperBtn =
  document.getElementById("copyDeveloperBtn");


/* =========================================================
   الرسالة
========================================================= */

const messageInput =
  document.getElementById("messageInput");

const charCount =
  document.getElementById("charCount");

const sendMessageBtn =
  document.getElementById("sendMessageBtn");


/* =========================================================
   Toast
========================================================= */

const toast =
  document.getElementById("toast");

let toastTimer =
  null;


/* =========================================================
   عناصر كرة القدم
========================================================= */

const footballDateText =
  document.getElementById("footballDateText");

const liveCount =
  document.getElementById("liveCount");

const todayCount =
  document.getElementById("todayCount");

const upcomingCount =
  document.getElementById("upcomingCount");

const footballApiStatus =
  document.getElementById("footballApiStatus");

const footballLastUpdate =
  document.getElementById("footballLastUpdate");

const footballRefreshBtn =
  document.getElementById("footballRefreshBtn");

const footballNotifyBtn =
  document.getElementById("footballNotifyBtn");

const footballMatches =
  document.getElementById("footballMatches");

const footballCompetitions =
  document.getElementById("footballCompetitions");

const footballTabs =
  document.querySelectorAll(
    "[data-football-tab]"
  );


/* =========================================================
   حالة كرة القدم
========================================================= */

let footballMode =
  "live";

let footballToday =
  [];

let footballTomorrow =
  [];

let footballLastFetchTime =
  0;

let footballRefreshTimer =
  null;

let footballRequestRunning =
  false;

let previousLiveSnapshot =
  "";

let notificationEnabled =
  false;


/* =========================================================
   الحالات
========================================================= */

const LIVE_STATUSES =
  new Set([
    "1H",
    "HT",
    "2H",
    "ET",
    "BT",
    "P",
    "INT"
  ]);

const FINISHED_STATUSES =
  new Set([
    "FT",
    "AET",
    "PEN"
  ]);


/* =========================================================
   التاريخ
========================================================= */

function getDateInTimeZone(
  timeZone = FOOTBALL_TIMEZONE,
  offsetDays = 0
) {
  const now =
    new Date();

  now.setDate(
    now.getDate() + offsetDays
  );

  const parts =
    new Intl.DateTimeFormat(
      "en",
      {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }
    ).formatToParts(now);

  const map = {};

  parts.forEach(part => {
    if (part.type !== "literal") {
      map[part.type] =
        part.value;
    }
  });

  return (
    map.year +
    "-" +
    map.month +
    "-" +
    map.day
  );
}


function formatArabicDate(
  dateKey
) {
  try {

    const date =
      new Date(
        dateKey + "T12:00:00"
      );

    return new Intl.DateTimeFormat(
      "ar-SD",
      {
        timeZone:
          FOOTBALL_TIMEZONE,

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric"
      }
    ).format(date);

  } catch {

    return dateKey;

  }
}


function formatKickoff(
  isoDate
) {
  try {

    return new Intl.DateTimeFormat(
      "ar-SD",
      {
        timeZone:
          FOOTBALL_TIMEZONE,

        hour: "2-digit",

        minute: "2-digit"
      }
    ).format(
      new Date(isoDate)
    );

  } catch {

    return "--:--";

  }
}


/* =========================================================
   LocalStorage آمن
========================================================= */

function storageSet(
  key,
  value
) {
  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  } catch {

    // بعض البيئات قد تمنع التخزين.
  }
}


function storageGet(
  key,
  fallback = null
) {
  try {

    const value =
      localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);

  } catch {

    return fallback;

  }
}


/* =========================================================
   التنبيهات داخل التطبيق
========================================================= */

notificationEnabled =
  storageGet(
    "wad_faisal_football_notifications",
    false
  ) === true;

updateNotificationButton();


function updateNotificationButton() {

  if (!footballNotifyBtn) {
    return;
  }

  footballNotifyBtn.classList.toggle(
    "active",
    notificationEnabled
  );

  footballNotifyBtn.textContent =
    notificationEnabled
      ? "🔔"
      : "🔕";

  footballNotifyBtn.title =
    notificationEnabled
      ? "تنبيهات المباريات مفعلة"
      : "تنبيهات المباريات غير مفعلة";
}


/* =========================================================
   عرض الشاشة
========================================================= */

function showScreen(
  screen
) {

  [
    welcomeScreen,
    homeScreen,
    messageScreen,
    footballScreen
  ].forEach(item => {

    if (item) {
      item.classList.remove(
        "active"
      );
    }

  });


  if (screen) {
    screen.classList.add(
      "active"
    );
  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  updateFootballTimer();
}


/* =========================================================
   Telegram
========================================================= */

function openTelegram(
  url
) {
  window.location.href =
    url;
}


/* =========================================================
   Toast
========================================================= */

function showToast(
  message
) {

  clearTimeout(
    toastTimer
  );

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  toastTimer =
    setTimeout(() => {

      toast.classList.remove(
        "show"
      );

    }, 2800);
}


/* =========================================================
   Modal
========================================================= */

function openModal(
  modal
) {

  if (!modal) {
    return;
  }

  modal.classList.add(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );
}


function closeModal(
  modal
) {

  if (!modal) {
    return;
  }

  modal.classList.remove(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );
}


/* =========================================================
   الصفحة الرئيسية
========================================================= */

enterBtn.addEventListener(
  "click",
  () => {

    showScreen(
      homeScreen
    );

  }
);


channelBtn.addEventListener(
  "click",
  () => {

    openTelegram(
      CHANNEL_URL
    );

  }
);


developerBtn.addEventListener(
  "click",
  () => {

    openModal(
      developerModal
    );

  }
);


messageBtn.addEventListener(
  "click",
  () => {

    showScreen(
      messageScreen
    );

    setTimeout(() => {

      messageInput.focus();

    }, 180);

  }
);


backHomeBtn.addEventListener(
  "click",
  () => {

    showScreen(
      homeScreen
    );

  }
);


aboutBtn.addEventListener(
  "click",
  () => {

    openModal(
      aboutModal
    );

  }
);


/* =========================================================
   المودالات
========================================================= */

document
  .querySelectorAll("[data-close]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const modal =
          document.getElementById(
            button.dataset.close
          );

        if (modal) {
          closeModal(
            modal
          );
        }

      }
    );

  });


document
  .querySelectorAll(".modal-backdrop")
  .forEach(backdrop => {

    backdrop.addEventListener(
      "click",
      () => {

        const modal =
          backdrop.closest(
            ".modal"
          );

        if (modal) {
          closeModal(
            modal
          );
        }

      }
    );

  });


/* =========================================================
   المطور
========================================================= */

openDeveloperBtn.addEventListener(
  "click",
  () => {

    openTelegram(
      DEVELOPER_URL
    );

  }
);


copyDeveloperBtn.addEventListener(
  "click",
  async () => {

    try {

      await navigator
        .clipboard
        .writeText(
          DEVELOPER_USERNAME
        );

      showToast(
        "تم نسخ معرف المطور"
      );

    } catch {

      showToast(
        "معرف المطور: " +
        DEVELOPER_USERNAME
      );

    }

  }
);


/* =========================================================
   الرسالة
========================================================= */

messageInput.addEventListener(
  "input",
  () => {

    charCount.textContent =
      messageInput.value.length;

  }
);


sendMessageBtn.addEventListener(
  "click",
  () => {

    const message =
      messageInput.value.trim();


    if (!message) {

      showToast(
        "اكتب رسالتك أولاً"
      );

      messageInput.focus();

      return;
    }


    const finalMessage =
      "السلام عليكم محمد فيصل\n\n" +
      message +
      "\n\n— من تطبيق ود فيصل";


    openTelegram(
      DEVELOPER_URL +
      "?text=" +
      encodeURIComponent(
        finalMessage
      )
    );

  }
);


/* =========================================================
   Football API
========================================================= */

async function footballApiGet(
  params = {}
) {

  const url =
    new URL(
      FOOTBALL_API_BASE +
      "/fixtures"
    );


  Object.entries(
    params
  ).forEach(
    ([key, value]) => {

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {

        url.searchParams.set(
          key,
          value
        );

      }

    }
  );


  const response =
    await fetch(
      url.toString(),
      {
        method: "GET",

        headers: {
          "x-apisports-key":
            FOOTBALL_API_KEY,

          "Accept":
            "application/json"
        },

        cache: "no-store"
      }
    );


  let data = null;

  try {

    data =
      await response.json();

  } catch {

    throw new Error(
      "تعذر قراءة رد الخدمة."
    );

  }


  if (!response.ok) {

    throw new Error(
      "الخدمة أعادت خطأ HTTP " +
      response.status
    );

  }


  if (
    data &&
    data.errors &&
    Object.keys(
      data.errors
    ).length > 0
  ) {

    const errorValues =
      Object.values(
        data.errors
      );

    throw new Error(
      errorValues.join(" • ")
    );

  }


  return data;
}


/* =========================================================
   تحميل مباريات يوم
========================================================= */

async function fetchFixturesForDate(
  dateKey,
  force = false
) {

  const storageKey =
    "wad_faisal_fixtures_" +
    dateKey;

  const cached =
    storageGet(
      storageKey,
      null
    );


  /*
    نظهر الكاش بسرعة.
  */
  if (
    cached &&
    Array.isArray(
      cached.response
    )
  ) {

    if (
      dateKey ===
      getDateInTimeZone()
    ) {

      footballToday =
        cached.response;

    } else {

      footballTomorrow =
        cached.response;

    }

  }


  const now =
    Date.now();


  /*
    منع الطلبات المتكررة.
  */
  if (
    !force &&
    footballLastFetchTime > 0 &&
    now - footballLastFetchTime <
      FOOTBALL_MIN_REQUEST_GAP &&
    dateKey ===
      getDateInTimeZone()
  ) {

    return cached
      ? cached.response
      : [];

  }


  const data =
    await footballApiGet({
      date: dateKey,

      timezone:
        FOOTBALL_TIMEZONE
    });


  const response =
    Array.isArray(
      data.response
    )
      ? data.response
      : [];


  storageSet(
    storageKey,
    {
      savedAt: now,
      response
    }
  );


  if (
    dateKey ===
    getDateInTimeZone()
  ) {

    footballToday =
      response;

    footballLastFetchTime =
      now;

  } else {

    footballTomorrow =
      response;

  }


  return response;
}


/* =========================================================
   تحميل اليوم
========================================================= */

async function loadToday(
  force = false
) {

  return fetchFixturesForDate(
    getDateInTimeZone(),
    force
  );

}


/* =========================================================
   تحميل الغد
========================================================= */

async function loadTomorrow(
  force = false
) {

  return fetchFixturesForDate(
    getDateInTimeZone(
      FOOTBALL_TIMEZONE,
      1
    ),
    force
  );

}


/* =========================================================
   تحديد المباراة الحية
========================================================= */

function isLiveMatch(
  match
) {

  const status =
    match &&
    match.fixture &&
    match.fixture.status;

  if (!status) {
    return false;
  }

  return LIVE_STATUSES.has(
    status.short
  );

}


/* =========================================================
   الوقت القادم
========================================================= */

function isUpcomingMatch(
  match
) {

  if (
    !match ||
    !match.fixture
  ) {
    return false;
  }


  const timestamp =
    match.fixture.timestamp;


  if (
    typeof timestamp !==
    "number"
  ) {
    return false;
  }


  return (
    timestamp * 1000 >
    Date.now()
  );

}


/* =========================================================
   تحويل حالة المباراة للعربي
========================================================= */

function getStatusText(
  match
) {

  const status =
    match &&
    match.fixture &&
    match.fixture.status;


  if (!status) {
    return "غير معروف";
  }


  const code =
    status.short;


  const names = {

    NS: "لم تبدأ",

    TBD: "لم تحدد",

    "1H": "الشوط الأول",

    HT: "استراحة",

    "2H": "الشوط الثاني",

    ET: "وقت إضافي",

    BT: "استراحة إضافية",

    P: "ركلات ترجيح",

    INT: "متوقفة",

    FT: "انتهت",

    AET: "انتهت بعد التمديد",

    PEN: "انتهت بركلات الترجيح",

    PST: "مؤجلة",

    CANC: "ملغاة",

    ABD: "متوقفة",

    AWD: "فوز إداري",

    WO: "انسحاب",

    SUSP: "موقوفة"

  };


  return (
    names[code] ||
    status.long ||
    code
  );

}


/* =========================================================
   الدقيقة الحالية
========================================================= */

function getElapsedText(
  match
) {

  const status =
    match &&
    match.fixture &&
    match.fixture.status;


  if (
    !status
  ) {
    return "";
  }


  if (
    !LIVE_STATUSES.has(
      status.short
    )
  ) {

    return getStatusText(
      match
    );

  }


  if (
    typeof status.elapsed ===
    "number"
  ) {

    if (
      typeof status.extra ===
      "number"
    ) {

      return (
        status.elapsed +
        "+" +
        status.extra +
        "'"
      );

    }

    return (
      status.elapsed +
      "'"
    );

  }


  return getStatusText(
    match
  );

}


/* =========================================================
   تنسيق النتيجة
========================================================= */

function getScore(
  match
) {

  const goals =
    match.goals || {};


  const home =
    goals.home ??
    0;

  const away =
    goals.away ??
    0;


  return {
    home,
    away
  };

}


/* =========================================================
   HTML escaping
========================================================= */

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================================
   رابط صورة آمن
========================================================= */

function safeImageUrl(
  url
) {

  if (
    typeof url !== "string"
  ) {
    return "";
  }

  if (
    !url.startsWith(
      "https://"
    )
  ) {
    return "";
  }

  return escapeHtml(
    url
  );

}


/* =========================================================
   بطاقة مباراة
========================================================= */

function createMatchCard(
  match,
  index
) {

  const fixture =
    match.fixture || {};

  const league =
    match.league || {};

  const teams =
    match.teams || {};

  const home =
    teams.home || {};

  const away =
    teams.away || {};

  const score =
    getScore(
      match
    );

  const isLive =
    isLiveMatch(
      match
    );


  const statusText =
    getStatusText(
      match
    );


  const elapsedText =
    getElapsedText(
      match
    );


  const kickoff =
    formatKickoff(
      fixture.date
    );


  const homeLogo =
    safeImageUrl(
      home.logo
    );

  const awayLogo =
    safeImageUrl(
      away.logo
    );

  const leagueLogo =
    safeImageUrl(
      league.logo
    );


  const round =
    league.round ||
    "مباراة";


  const homeLogoHtml =
    homeLogo
      ? `
        <img
          class="team-logo"
          src="${homeLogo}"
          alt=""
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        >
        <span
          class="team-logo-fallback"
          style="display:none"
        >
          ⚽
        </span>
      `
      : `
        <span class="team-logo-fallback">
          ⚽
        </span>
      `;


  const awayLogoHtml =
    awayLogo
      ? `
        <img
          class="team-logo"
          src="${awayLogo}"
          alt=""
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
        >
        <span
          class="team-logo-fallback"
          style="display:none"
        >
          ⚽
        </span>
      `
      : `
        <span class="team-logo-fallback">
          ⚽
        </span>
      `;


  const leagueLogoHtml =
    leagueLogo
      ? `
        <img
          class="league-logo"
          src="${leagueLogo}"
          alt=""
          loading="lazy"
          onerror="this.style.display='none';"
        >
      `
      : `
        <span
          class="league-logo"
          style="
            display:grid;
            place-items:center;
            font-size:12px;
          "
        >
          🏆
        </span>
      `;


  return `
    <article
      class="match-card ${isLive ? "live" : ""}"
      style="animation-delay:${Math.min(index * 35, 350)}ms"
    >

      <div class="match-top">

        <div class="league-info">

          ${leagueLogoHtml}

          <span class="league-name">
            ${escapeHtml(
              league.name ||
              "بطولة"
            )}
          </span>

        </div>


        <span
          class="match-status ${isLive ? "live" : ""}"
        >
          ${isLive ? "🔴 " : ""}
          ${escapeHtml(
            isLive
              ? elapsedText
              : statusText
          )}
        </span>

      </div>


      <div class="match-main">


        <div class="team home">

          <div class="team-logo-wrap">
            ${homeLogoHtml}
          </div>

          <div class="team-name">
            ${escapeHtml(
              home.name ||
              "الفريق الأول"
            )}
          </div>

        </div>


        <div class="score-box">

          <div class="score">

            <span>
              ${escapeHtml(
                score.home
              )}
            </span>

            <span class="score-divider">
              -
            </span>

            <span>
              ${escapeHtml(
                score.away
              )}
            </span>

          </div>


          <div
            class="score-time ${isLive ? "live" : ""}"
          >
            ${
              isLive
                ? elapsedText
                : kickoff
            }
          </div>

        </div>


        <div class="team away">

          <div class="team-logo-wrap">
            ${awayLogoHtml}
          </div>

          <div class="team-name">
            ${escapeHtml(
              away.name ||
              "الفريق الثاني"
            )}
          </div>

        </div>


      </div>


      <div class="match-bottom">

        <span class="match-round">
          ${escapeHtml(
            round
          )}
        </span>

        <span>
          ${escapeHtml(
            league.country ||
            ""
          )}
        </span>

      </div>

    </article>
  `;

}


/* =========================================================
   إنشاء قائمة المباريات
========================================================= */

function renderMatches(
  matches,
  emptyTitle,
  emptyText
) {

  if (
    !Array.isArray(matches) ||
    matches.length === 0
  ) {

    footballMatches.innerHTML = `
      <div class="football-empty glass">

        <div class="football-empty-icon">
          ⚽
        </div>

        <strong>
          ${escapeHtml(
            emptyTitle
          )}
        </strong>

        <p>
          ${escapeHtml(
            emptyText
          )}
        </p>

        <button
          class="retry-btn"
          id="emptyRefreshBtn"
        >
          تحديث الآن
        </button>

      </div>
    `;


    const emptyRefreshBtn =
      document.getElementById(
        "emptyRefreshBtn"
      );


    if (emptyRefreshBtn) {

      emptyRefreshBtn.addEventListener(
        "click",
        () => {

          loadFootball(
            footballMode,
            true
          );

        }
      );

    }


    return;
  }


  const sorted =
    [...matches]
      .sort(
        (a, b) => {

          const liveA =
            isLiveMatch(a);

          const liveB =
            isLiveMatch(b);

          if (
            liveA !==
            liveB
          ) {
            return liveB - liveA;
          }


          const aTime =
            a.fixture?.timestamp ||
            0;

          const bTime =
            b.fixture?.timestamp ||
            0;

          return (
            aTime -
            bTime
          );

        }
      );


  footballMatches.innerHTML = `
    <div class="matches-list">

      ${sorted
        .map(
          (match, index) =>
            createMatchCard(
              match,
              index
            )
        )
        .join("")}

    </div>
  `;

}


/* =========================================================
   البطولات
========================================================= */

function renderCompetitions(
  matches
) {

  if (
    !Array.isArray(matches) ||
    matches.length === 0
  ) {

    footballCompetitions.innerHTML =
      "";

    return;
  }


  const map =
    new Map();


  matches.forEach(
    match => {

      const league =
        match.league;

      if (!league) {
        return;
      }

      const id =
        league.id ||
        league.name;

      if (!map.has(id)) {

        map.set(
          id,
          {
            name:
              league.name ||
              "بطولة",

            count: 0
          }
        );

      }


      map.get(id).count++;

    }
  );


  const competitions =
    [...map.values()]
      .sort(
        (a,b) =>
          b.count -
          a.count
      )
      .slice(0, 12);


  if (
    competitions.length === 0
  ) {

    footballCompetitions.innerHTML =
      "";

    return;
  }


  footballCompetitions.innerHTML = `
    <div class="competitions-wrap">

      <div class="competitions-title">
        البطولات الموجودة حالياً
      </div>

      <div class="competition-list">

        ${competitions
          .map(
            item => `
              <span class="competition-chip">
                🏆
                ${escapeHtml(
                  item.name
                )}
                ·
                ${item.count}
              </span>
            `
          )
          .join("")}

      </div>

    </div>
  `;

}


/* =========================================================
   الإحصائيات
========================================================= */

function updateFootballStats() {

  const today =
    Array.isArray(
      footballToday
    )
      ? footballToday
      : [];


  const tomorrow =
    Array.isArray(
      footballTomorrow
    )
      ? footballTomorrow
      : [];


  const live =
    today.filter(
      isLiveMatch
    );


  const todayUpcoming =
    today.filter(
      isUpcomingMatch
    );


  const tomorrowUpcoming =
    tomorrow.filter(
      match =>
        !FINISHED_STATUSES.has(
          match.fixture?.status?.short
        )
    );


  if (liveCount) {

    liveCount.textContent =
      live.length;

  }


  if (todayCount) {

    todayCount.textContent =
      today.length;

  }


  if (upcomingCount) {

    upcomingCount.textContent =
      todayUpcoming.length +
      tomorrowUpcoming.length;

  }

}


/* =========================================================
   آخر تحديث
========================================================= */

function updateLastUpdateText() {

  footballLastUpdate.textContent =
    "آخر تحديث: " +
    new Intl.DateTimeFormat(
      "ar-SD",
      {
        timeZone:
          FOOTBALL_TIMEZONE,

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit"
      }
    ).format(
      new Date()
    );

}


/* =========================================================
   التحقق من تغيير النتيجة
========================================================= */

function makeLiveSnapshot(
  matches
) {

  return matches
    .filter(
      isLiveMatch
    )
    .map(
      match => {

        const id =
          match.fixture?.id ??
          "";

        const home =
          match.goals?.home ??
          0;

        const away =
          match.goals?.away ??
          0;

        const elapsed =
          match.fixture?.status?.elapsed ??
          "";

        const status =
          match.fixture?.status?.short ??
          "";

        return [
          id,
          home,
          away,
          elapsed,
          status
        ].join("|");

      }
    )
    .sort()
    .join(";;");

}


/* =========================================================
   تنبيه تغيير نتيجة
========================================================= */

function checkLiveChanges(
  matches,
  initial = false
) {

  if (
    !notificationEnabled
  ) {
    return;
  }


  const currentSnapshot =
    makeLiveSnapshot(
      matches
    );


  if (
    initial ||
    !previousLiveSnapshot
  ) {

    previousLiveSnapshot =
      currentSnapshot;

    return;
  }


  if (
    currentSnapshot ===
    previousLiveSnapshot
  ) {

    return;
  }


  const oldSet =
    new Set(
      previousLiveSnapshot
        .split(";;")
        .filter(Boolean)
    );


  const changed =
    matches.find(
      match => {

        if (
          !isLiveMatch(
            match
          )
        ) {
          return false;
        }


        const id =
          match.fixture?.id ??
          "";

        const home =
          match.goals?.home ??
          0;

        const away =
          match.goals?.away ??
          0;

        const elapsed =
          match.fixture?.status?.elapsed ??
          "";

        const status =
          match.fixture?.status?.short ??
          "";


        const signature =
          [
            id,
            home,
            away,
            elapsed,
            status
          ].join("|");


        return !oldSet.has(
          signature
        );

      }
    );


  if (changed) {

    const homeName =
      changed.teams?.home?.name ||
      "الفريق الأول";

    const awayName =
      changed.teams?.away?.name ||
      "الفريق الثاني";

    const homeScore =
      changed.goals?.home ??
      0;

    const awayScore =
      changed.goals?.away ??
      0;


    showToast(
      "🔔 " +
      homeName +
      " " +
      homeScore +
      " - " +
      awayScore +
      " " +
      awayName
    );

  }


  previousLiveSnapshot =
    currentSnapshot;

}


/* =========================================================
   تنسيق شاشة الخطأ
========================================================= */

function renderFootballError(
  error
) {

  const message =
    error?.message ||
    "حدث خطأ أثناء جلب المباريات.";


  footballApiStatus.textContent =
    "تعذر الاتصال";


  footballLastUpdate.textContent =
    "تحقق من الإنترنت ومفتاح API";


  footballMatches.innerHTML = `
    <div class="football-empty glass">

      <div class="football-empty-icon">
        ⚠️
      </div>

      <strong>
        تعذر جلب مباريات كرة القدم
      </strong>

      <p>
        ${escapeHtml(
          message
        )}
      </p>

      <button
        class="retry-btn"
        id="footballErrorRetry"
      >
        المحاولة مرة أخرى
      </button>

    </div>
  `;


  const retry =
    document.getElementById(
      "footballErrorRetry"
    );


  if (retry) {

    retry.addEventListener(
      "click",
      () => {

        loadFootball(
          footballMode,
          true
        );

      }
    );

  }

}


/* =========================================================
   تحميل قسم كرة القدم
========================================================= */

async function loadFootball(
  mode = "live",
  force = false
) {

  if (
    footballRequestRunning
  ) {
    return;
  }


  footballRequestRunning =
    true;


  footballMode =
    mode;


  footballApiStatus.textContent =
    "جاري التحديث...";


  footballRefreshBtn.classList.add(
    "loading"
  );


  renderLoadingIfNeeded();


  try {

    let activeMatches =
      [];


    if (
      mode === "upcoming"
    ) {

      /*
        القادم = مباريات الغد.
      */
      await loadTomorrow(
        force
      );

      activeMatches =
        footballTomorrow.filter(
          match =>
            isUpcomingMatch(match) ||
            !FINISHED_STATUSES.has(
              match.fixture?.status?.short
            )
        );


    } else {

      /*
        اليوم والمباشر:
        نفس طلب اليوم.
      */
      await loadToday(
        force
      );


      activeMatches =
        footballToday;

    }


    updateFootballStats();


    if (
      footballDateText
    ) {

      const currentDate =
        mode === "upcoming"
          ? getDateInTimeZone(
              FOOTBALL_TIMEZONE,
              1
            )
          : getDateInTimeZone();

      footballDateText.textContent =
        formatArabicDate(
          currentDate
        );

    }


    let displayMatches =
      activeMatches;


    if (
      mode === "live"
    ) {

      displayMatches =
        activeMatches.filter(
          isLiveMatch
        );


      renderMatches(
        displayMatches,

        "لا توجد مباراة مباشرة الآن",

        "عندما تبدأ المباريات سنعرضها هنا مع النتيجة والدقيقة والتحديثات."
      );


    } else if (
      mode === "today"
    ) {

      displayMatches =
        activeMatches;

      renderMatches(
        displayMatches,

        "لا توجد مباريات اليوم",

        "لم تظهر مباريات متاحة لهذا اليوم في البيانات الحالية."
      );


    } else {

      displayMatches =
        activeMatches;

      renderMatches(
        displayMatches,

        "لا توجد مباريات قادمة غداً",

        "لم نجد مباريات قادمة متاحة للغد في البيانات الحالية."
      );

    }


    renderCompetitions(
      displayMatches
    );


    footballApiStatus.textContent =
      "متصل بالخدمة ✓";


    updateLastUpdateText();


    checkLiveChanges(
      footballToday,
      footballLastFetchTime === 0
    );


  } catch (error) {

    console.error(
      "Football API Error:",
      error
    );

    renderFootballError(
      error
    );

  } finally {

    footballRequestRunning =
      false;

    footballRefreshBtn.classList.remove(
      "loading"
    );

    updateFootballTimer();

  }

}


/* =========================================================
   شاشة تحميل
========================================================= */

function renderLoadingIfNeeded() {

  if (
    footballMatches.children.length > 0 &&
    !footballMatches.querySelector(
      ".football-loading"
    )
  ) {
    return;
  }


  footballMatches.innerHTML = `
    <div class="football-loading glass">

      <div class="loading-spinner"></div>

      <strong>
        جاري جلب المباريات
      </strong>

      <span>
        يتم الاتصال بمصدر النتائج...
      </span>

    </div>
  `;

}


/* =========================================================
   التبديل بين مباشر / اليوم / القادم
========================================================= */

footballTabs.forEach(
  tab => {

    tab.addEventListener(
      "click",
      () => {

        footballTabs.forEach(
          item =>
            item.classList.remove(
              "active"
            )
        );


        tab.classList.add(
          "active"
        );


        const mode =
          tab.dataset.footballTab;


        loadFootball(
          mode,
          false
        );

      }
    );

  }
);


/* =========================================================
   زر كرة القدم من الرئيسية
========================================================= */

footballBtn.addEventListener(
  "click",
  () => {

    showScreen(
      footballScreen
    );


    /*
      نبدأ دائماً من مباشر.
    */
    setFootballTab(
      "live"
    );


    /*
      إظهار الكاش مباشرة إن كان موجوداً.
    */
    const cached =
      storageGet(
        "wad_faisal_fixtures_" +
        getDateInTimeZone(),
        null
      );


    if (
      cached &&
      Array.isArray(
        cached.response
      )
    ) {

      footballToday =
        cached.response;

      updateFootballStats();

      renderMatches(
        footballToday.filter(
          isLiveMatch
        ),

        "لا توجد مباراة مباشرة الآن",

        "إذا كانت هناك مباراة شغالة حالياً فستظهر هنا."
      );

      renderCompetitions(
        footballToday.filter(
          isLiveMatch
        )
      );

    }


    loadFootball(
      "live",
      false
    );


    startFootballAutoRefresh();

  }
);


/* =========================================================
   العودة من قسم الكورة
========================================================= */

backFootballHomeBtn.addEventListener(
  "click",
  () => {

    stopFootballAutoRefresh();

    showScreen(
      homeScreen
    );

  }
);


/* =========================================================
   تغيير التبويب برمجياً
========================================================= */

function setFootballTab(
  mode
) {

  footballMode =
    mode;


  footballTabs.forEach(
    tab => {

      tab.classList.toggle(
        "active",
        tab.dataset.footballTab ===
          mode
      );

    }
  );

}


/* =========================================================
   زر تحديث كرة القدم
========================================================= */

footballRefreshBtn.addEventListener(
  "click",
  () => {

    if (
      Date.now() -
      footballLastFetchTime <
      FOOTBALL_MIN_REQUEST_GAP
    ) {

      showToast(
        "انتظر قليلاً قبل التحديث مرة أخرى"
      );

      return;
    }


    loadFootball(
      footballMode,
      true
    );

  }
);


/* =========================================================
   تنبيهات المباريات
========================================================= */

footballNotifyBtn.addEventListener(
  "click",
  () => {

    notificationEnabled =
      !notificationEnabled;


    storageSet(
      "wad_faisal_football_notifications",
      notificationEnabled
    );


    updateNotificationButton();


    if (
      notificationEnabled
    ) {

      showToast(
        "🔔 تم تفعيل تنبيهات المباريات داخل التطبيق"
      );

    } else {

      showToast(
        "🔕 تم إيقاف تنبيهات المباريات"
      );

    }

  }
);


/* =========================================================
   التحديث التلقائي
========================================================= */

function startFootballAutoRefresh() {

  stopFootballAutoRefresh();


  footballRefreshTimer =
    setInterval(
      () => {

        /*
          لا نحدث إلا إذا كانت
          شاشة الكورة ظاهرة.
        */
        if (
          footballScreen.classList.contains(
            "active"
          )
        ) {

          /*
            نحدث بيانات اليوم فقط.
          */
          loadFootball(
            "live",
            true
          );

        }

      },
      FOOTBALL_REFRESH_MS
    );

}


function stopFootballAutoRefresh() {

  if (
    footballRefreshTimer
  ) {

    clearInterval(
      footballRefreshTimer
    );

    footballRefreshTimer =
      null;

  }

}


/* =========================================================
   تحديث الحالة النصية
========================================================= */

function updateFootballTimer() {

  if (
    !footballScreen ||
    !footballScreen.classList.contains(
      "active"
    )
  ) {
    return;
  }


  /*
    مجرد توضيح للمستخدم.
  */
  footballApiStatus.textContent =
    footballRequestRunning
      ? "جاري التحديث..."
      : "جاهز";

}


/* =========================================================
   إغلاق المودالات بزر الرجوع Escape
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      document
        .querySelectorAll(
          ".modal.open"
        )
        .forEach(
          closeModal
        );

    }

  }
);


/* =========================================================
   بداية التطبيق
========================================================= */

updateFootballStats();
