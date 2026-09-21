/* ==================================================
   ود فيصل
   التطبيق الرئيسي
================================================== */


/* =========================
   روابط التطبيق
========================= */

const CHANNEL_URL =
  "https://t.me/alrufaaey1";

const DEVELOPER_URL =
  "https://t.me/mohmmedfysal";

const DEVELOPER_USERNAME =
  "@mohmmedfysal";


/* =========================
   API FOOTBALL
========================= */

/*
  ضع مفتاح API-Football هنا.

  مثال:

  const API_KEY = "ضع_المفتاح_هنا";

  لا تنشر المفتاح الحقيقي في GitHub
  إذا كان المستودع عاماً.
*/

const API_KEY =
  "ضع_مفتاح_API_FOOTBALL_هنا";


const FOOTBALL_API =
  "https://v3.football.api-sports.io";


/* =========================
   العناصر
========================= */

const welcomeScreen =
  document.getElementById("welcomeScreen");

const homeScreen =
  document.getElementById("homeScreen");

const messageScreen =
  document.getElementById("messageScreen");

const footballScreen =
  document.getElementById("footballScreen");


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

const backFootballBtn =
  document.getElementById("backFootballBtn");

const refreshFootballBtn =
  document.getElementById("refreshFootballBtn");


const developerModal =
  document.getElementById("developerModal");

const aboutModal =
  document.getElementById("aboutModal");


const openDeveloperBtn =
  document.getElementById("openDeveloperBtn");

const copyDeveloperBtn =
  document.getElementById("copyDeveloperBtn");


const messageInput =
  document.getElementById("messageInput");

const charCount =
  document.getElementById("charCount");

const sendMessageBtn =
  document.getElementById("sendMessageBtn");


const toast =
  document.getElementById("toast");


const footballList =
  document.getElementById("footballList");

const footballLoading =
  document.getElementById("footballLoading");

const footballEmpty =
  document.getElementById("footballEmpty");

const footballUpdated =
  document.getElementById("footballUpdated");


/* =========================
   متغيرات الكرة
========================= */

let footballTimer = null;

let currentFootballTab =
  "live";

let footballData = {
  live: [],
  today: [],
  upcoming: []
};


/* =========================
   Toast
========================= */

let toastTimer = null;

function showToast(message) {

  clearTimeout(toastTimer);

  toast.textContent =
    message;

  toast.classList.add("show");

  toastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2300);
}


/* =========================
   فتح Telegram
========================= */

function openTelegram(url) {

  window.location.href =
    url;
}


/* =========================
   تبديل الصفحات
========================= */

function showScreen(screen) {

  const screens = [

    welcomeScreen,
    homeScreen,
    messageScreen,
    footballScreen

  ];

  screens.forEach(item => {

    if (item) {

      item.classList.remove(
        "active"
      );

    }

  });


  screen.classList.add(
    "active"
  );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================
   شاشة الدخول
========================= */

enterBtn.addEventListener(
  "click",
  () => {

    showScreen(
      homeScreen
    );

  }
);


/* =========================
   القناة
========================= */

channelBtn.addEventListener(
  "click",
  () => {

    openTelegram(
      CHANNEL_URL
    );

  }
);


/* =========================
   المطور
========================= */

developerBtn.addEventListener(
  "click",
  () => {

    openModal(
      developerModal
    );

  }
);


/* =========================
   الرسالة
========================= */

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


/* =========================
   العودة
========================= */

backHomeBtn.addEventListener(
  "click",
  () => {

    showScreen(
      homeScreen
    );

  }
);


/* =========================
   كرة القدم
========================= */

footballBtn.addEventListener(
  "click",
  () => {

    showScreen(
      footballScreen
    );

    loadFootball();

  }
);


backFootballBtn.addEventListener(
  "click",
  () => {

    stopFootballAutoRefresh();

    showScreen(
      homeScreen
    );

  }
);


/* =========================
   About
========================= */

aboutBtn.addEventListener(
  "click",
  () => {

    openModal(
      aboutModal
    );

  }
);


/* =========================
   Modal
========================= */

function openModal(modal) {

  modal.classList.add(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );
}


function closeModal(modal) {

  modal.classList.remove(
    "open"
  );

  modal.setAttribute(
    "aria-hidden",
    "true"
  );
}


document
  .querySelectorAll(
    "[data-close]"
  )
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
  .querySelectorAll(
    ".modal-backdrop"
  )
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


/* =========================
   حساب المطور
========================= */

openDeveloperBtn.addEventListener(
  "click",
  () => {

    openTelegram(
      DEVELOPER_URL
    );

  }
);


/* =========================
   نسخ المعرف
========================= */

copyDeveloperBtn.addEventListener(
  "click",
  async () => {

    try {

      await navigator.clipboard.writeText(
        DEVELOPER_USERNAME
      );

      showToast(
        "تم نسخ معرف المطور"
      );

    } catch {

      showToast(
        DEVELOPER_USERNAME
      );

    }

  }
);


/* =========================
   الرسالة
========================= */

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

      `السلام عليكم محمد فيصل

${message}

— من تطبيق ود فيصل`;


    openTelegram(
      `${DEVELOPER_URL}?text=${
        encodeURIComponent(
          finalMessage
        )
      }`
    );

  }
);


/* ==================================================
   كرة القدم
================================================== */


/* =========================
   التاريخ الحالي
========================= */

function getTodayDate() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}


/* =========================
   طلب API
========================= */

async function footballRequest(
  endpoint
) {

  if (
    !API_KEY ||
    API_KEY.includes(
      "ضع_مفتاح"
    )
  ) {

    throw new Error(
      "API_KEY_MISSING"
    );

  }


  const response =
    await fetch(
      `${FOOTBALL_API}${endpoint}`,
      {

        method: "GET",

        headers: {

          "x-apisports-key":
            API_KEY,

          "Accept":
            "application/json"

        }

      }
    );


  if (!response.ok) {

    throw new Error(
      `HTTP_${response.status}`
    );

  }


  const data =
    await response.json();


  if (
    data.errors &&
    Object.keys(
      data.errors
    ).length > 0
  ) {

    throw new Error(
      "API_ERROR"
    );

  }


  return data.response || [];
}


/* =========================
   تحميل كرة القدم
========================= */

async function loadFootball() {

  footballLoading.classList.remove(
    "hidden"
  );

  footballEmpty.classList.add(
    "hidden"
  );

  footballList.innerHTML =
    "";


  try {

    /*
      المباريات المباشرة
    */

    const live =
      await footballRequest(
        "/fixtures?live=all"
      );


    /*
      مباريات اليوم
    */

    const todayDate =
      getTodayDate();

    const today =
      await footballRequest(
        `/fixtures?date=${todayDate}`
      );


    /*
      نخلي المباريات القادمة
      من مباريات اليوم فقط.
    */

    const upcoming =
      today.filter(
        fixture => {

          const status =
            fixture.fixture.status.short;

          return (
            status === "NS" ||
            status === "TBD"
          );

        }
      );


    footballData = {

      live,
      today,
      upcoming

    };


    footballLoading.classList.add(
      "hidden"
    );


    footballUpdated.textContent =
      `آخر تحديث: ${new Date().toLocaleTimeString(
        "ar",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      )}`;


    renderFootball();


  } catch (error) {

    console.error(
      error
    );


    footballLoading.classList.add(
      "hidden"
    );


    footballEmpty.classList.remove(
      "hidden"
    );


    if (
      error.message ===
      "API_KEY_MISSING"
    ) {

      footballEmpty.innerHTML = `

        <div>🔑</div>

        <h3>
          مفتاح API غير موجود
        </h3>

        <p>
          ضع مفتاح API-Football
          داخل ملف script.js.
        </p>

      `;

    } else {

      footballEmpty.innerHTML = `

        <div>📡</div>

        <h3>
          تعذر جلب النتائج
        </h3>

        <p>
          تأكد من الإنترنت
          ومفتاح API ثم حاول مرة أخرى.
        </p>

      `;

    }

  }

}


/* =========================
   عرض المباريات
========================= */

function renderFootball() {

  footballList.innerHTML =
    "";


  let matches = [];


  if (
    currentFootballTab ===
    "live"
  ) {

    matches =
      footballData.live;

  }


  if (
    currentFootballTab ===
    "today"
  ) {

    matches =
      footballData.today;

  }


  if (
    currentFootballTab ===
    "upcoming"
  ) {

    matches =
      footballData.upcoming;

  }


  if (
    !matches ||
    matches.length === 0
  ) {

    footballEmpty.classList.remove(
      "hidden"
    );

    footballEmpty.innerHTML = `

      <div>⚽</div>

      <h3>
        لا توجد مباريات
      </h3>

      <p>
        لا توجد مباريات ضمن هذا القسم حالياً.
      </p>

    `;

    return;

  }


  footballEmpty.classList.add(
    "hidden"
  );


  matches.forEach(
    match => {

      footballList.appendChild(
        createMatchCard(
          match
        )
      );

    }
  );

}


/* =========================
   بطاقة المباراة
========================= */

function createMatchCard(
  match
) {

  const card =
    document.createElement(
      "article"
    );


  card.className =
    "match-card glass";


  const fixture =
    match.fixture;

  const teams =
    match.teams;

  const goals =
    match.goals;

  const league =
    match.league;


  const status =
    fixture.status;


  const isLive =
    isLiveStatus(
      status.short
    );


  const minute =
    status.elapsed
      ? `${status.elapsed}'`
      : "";


  const scoreHome =
    goals.home ?? "-";

  const scoreAway =
    goals.away ?? "-";


  const homeLogo =
    teams.home.logo || "";


  const awayLogo =
    teams.away.logo || "";


  let statusText =
    getStatusText(
      status.short
    );


  if (isLive) {

    statusText =
      `🔴 مباشر • ${minute}`;

  }


  card.innerHTML = `

    <div class="match-league">

      <span>
        ${escapeHtml(
          league.name || "كرة القدم"
        )}
      </span>

      <span class="${
        isLive
          ? "match-live"
          : ""
      }">

        ${statusText}

      </span>

    </div>


    <div class="match-teams">


      <div class="team home">

        <div class="team-name">

          ${escapeHtml(
            teams.home.name
          )}

        </div>

        <img
          src="${homeLogo}"
          alt=""
          onerror="this.style.display='none'"
        >

      </div>


      <div class="match-score">

        <div class="score">

          ${scoreHome}
          -
          ${scoreAway}

        </div>

        ${
          isLive
            ? `
              <div class="minute">
                ${minute}
              </div>
            `
            : ""
        }

      </div>


      <div class="team away">

        <img
          src="${awayLogo}"
          alt=""
          onerror="this.style.display='none'"
        >

        <div class="team-name">

          ${escapeHtml(
            teams.away.name
          )}

        </div>

      </div>

    </div>


    <div class="match-status">

      ${getMatchDescription(
        status.short
      )}

    </div>


    ${
      isLive
        ? `
          <button
            class="watch-btn"
            data-fixture="${fixture.id}">
            📺 مشاهدة مباشر
          </button>
        `
        : ""
    }

  `;


  const watchButton =
    card.querySelector(
      ".watch-btn"
    );


  if (watchButton) {

    watchButton.addEventListener(
      "click",
      () => {

        showToast(
          "البث المرئي يحتاج مصدر بث متاح لهذه المباراة"
        );

      }
    );

  }


  return card;

}


/* =========================
   حالات المباراة
========================= */

function isLiveStatus(
  status
) {

  return [

    "1H",
    "HT",
    "2H",
    "ET",
    "BT",
    "P"

  ].includes(
    status
  );

}


/* =========================
   اسم الحالة
========================= */

function getStatusText(
  status
) {

  const statuses = {

    NS: "لم تبدأ",

    TBD: "موعد غير محدد",

    FT: "انتهت",

    AET: "بعد الوقت الإضافي",

    PEN: "ركلات ترجيح",

    PST: "تأجلت",

    CANC: "ألغيت",

    SUSP: "متوقفة",

    1H: "الشوط الأول",

    HT: "استراحة",

    2H: "الشوط الثاني",

    ET: "وقت إضافي",

    BT: "استراحة إضافية",

    P: "ركلات ترجيح"

  };


  return (
    statuses[status] ||
    status ||
    "غير معروف"
  );

}


/* =========================
   وصف المباراة
========================= */

function getMatchDescription(
  status
) {

  if (
    isLiveStatus(
      status
    )
  ) {

    return "المباراة جارية الآن";

  }


  if (
    status === "FT"
  ) {

    return "المباراة انتهت";

  }


  if (
    status === "NS" ||
    status === "TBD"
  ) {

    return "المباراة لم تبدأ بعد";

  }


  return getStatusText(
    status
  );

}


/* =========================
   تحديث يدوي
========================= */

refreshFootballBtn.addEventListener(
  "click",
  () => {

    loadFootball();

  }
);


/* =========================
   Tabs
========================= */

document
  .querySelectorAll(
    ".football-tab"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".football-tab"
          )
          .forEach(
            tab =>
              tab.classList.remove(
                "active"
              )
          );


        button.classList.add(
          "active"
        );


        currentFootballTab =
          button.dataset.tab;


        renderFootball();

      }
    );

  });


/* =========================
   تحديث تلقائي
========================= */

function startFootballAutoRefresh() {

  stopFootballAutoRefresh();


  footballTimer =
    setInterval(
      () => {

        if (
          footballScreen.classList.contains(
            "active"
          )
        ) {

          loadFootball();

        }

      },
      15000
    );

}


function stopFootballAutoRefresh() {

  if (
    footballTimer
  ) {

    clearInterval(
      footballTimer
    );

    footballTimer =
      null;

  }

}


/*
  تشغيل التحديث عند فتح القسم
*/

footballBtn.addEventListener(
  "click",
  () => {

    startFootballAutoRefresh();

  }
);


/* =========================
   حماية النصوص
========================= */

function escapeHtml(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)

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


/* =========================
   زر ESC
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
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
