"use strict";

/* =========================================================
   ود فيصل | FOOTBALL APP
   Version 2.0
   ========================================================= */

const API_KEY = "ae810dfaca4572f90e77eb206e0c96b3";

const API_BASE = "https://v3.football.api-sports.io";
const TIMEZONE = "Africa/Khartoum";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

const state = {

    currentPage: "homePage",

    todayFixtures: [],

    liveFixtures: [],

    leagues: [],

    favorites: loadJSON(
        "wd_faisal_favorites",
        []
    ),

    settings: loadJSON(
        "wd_faisal_settings",
        {
            quality: "best",
            network: true,
            notifications: true,
            darkMode: true
        }
    ),

    channelsFavorites: loadJSON(
        "wd_faisal_channels",
        []
    ),

    cache: new Map(),

    currentMatch: null,

    currentLeague: null,

    resultDate: getDateOffset(0),

    matchesFilter: "all",

    initialized: false

};


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
    try {
        return document.querySelector(selector);
    } catch {
        return null;
    }
}


function $$(selector) {
    try {
        return Array.from(
            document.querySelectorAll(selector)
        );
    } catch {
        return [];
    }
}


function byId(id) {
    return document.getElementById(id);
}


/* =========================================================
   SAFE STORAGE
   ========================================================= */

function loadJSON(key, fallback) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        const parsed =
            JSON.parse(value);

        return parsed ?? fallback;

    } catch {

        return fallback;

    }

}


function saveJSON(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.warn(
            "Storage error:",
            error
        );

    }

}


/* =========================================================
   START APP
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init,
        {
            once: true
        }
    );

} else {

    init();

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

async function init() {

    if (state.initialized) {
        return;
    }

    state.initialized = true;


    /*
     * مهم:
     * شاشة البداية لا تنتظر API.
     * التطبيق يفتح حتى لو الإنترنت لا يعمل.
     */

    startSplashTimer();


    try {
        applySettings();
    } catch (error) {
        console.error(
            "Settings error:",
            error
        );
    }


    try {
        setupNavigation();
    } catch (error) {
        console.error(
            "Navigation error:",
            error
        );
    }


    try {
        setupSearch();
    } catch (error) {
        console.error(
            "Search error:",
            error
        );
    }


    try {
        setupFilters();
    } catch (error) {
        console.error(
            "Filters error:",
            error
        );
    }


    try {
        setupSettings();
    } catch (error) {
        console.error(
            "Settings controls error:",
            error
        );
    }


    try {
        setupModal();
    } catch (error) {
        console.error(
            "Modal error:",
            error
        );
    }


    try {
        setupProfileActions();
    } catch (error) {
        console.error(
            "Profile error:",
            error
        );
    }


    try {
        setupDateButtons();
    } catch (error) {
        console.error(
            "Date buttons error:",
            error
        );
    }


    try {
        setupRefreshButtons();
    } catch (error) {
        console.error(
            "Refresh buttons error:",
            error
        );
    }


    try {
        renderChannels();
    } catch (error) {
        console.error(
            "Channels error:",
            error
        );
    }


    try {
        updateDateLabel();
    } catch (error) {
        console.error(
            "Date label error:",
            error
        );
    }


    /*
     * تحميل البيانات بدون تعطيل الواجهة.
     */

    try {
        await loadHomeData();
    } catch (error) {

        console.error(
            "Home API error:",
            error
        );

    }

}


/* =========================================================
   SPLASH SCREEN
   ========================================================= */

function startSplashTimer() {

    const splash =
        byId("splashScreen");

    const app =
        byId("app");


    /*
     * فتح التطبيق بعد 1.8 ثانية.
     * لا ننتظر API.
     */

    window.setTimeout(
        () => {

            try {

                if (splash) {

                    splash.classList.add(
                        "hide"
                    );

                }

                if (app) {

                    app.classList.remove(
                        "hidden"
                    );

                    app.style.display =
                        "block";

                    app.style.visibility =
                        "visible";

                    app.style.opacity =
                        "1";

                }

                document.body.classList.add(
                    "app-ready"
                );

            } catch (error) {

                console.error(
                    "Splash error:",
                    error
                );

            }

        },
        1800
    );

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    $$("[data-page]")
        .forEach(button => {

            if (
                button.dataset.bound === "true"
            ) {
                return;
            }

            button.dataset.bound = "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const page =
                        button.dataset.page;

                    if (!page) {
                        return;
                    }

                    navigateTo(page);

                }
            );

        });

}


function navigateTo(pageId) {

    if (!pageId) {
        return;
    }


    $$(".page")
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

            page.classList.remove(
                "active"
            );

        });


    const target =
        byId(pageId);


    if (!target) {

        console.warn(
            "Page not found:",
            pageId
        );

        return;
    }


    target.classList.add(
        "active-page"
    );


    target.classList.add(
        "active"
    );


    state.currentPage =
        pageId;


    $$(".nav-item")
        .forEach(item => {

            item.classList.remove(
                "active-nav"
            );

            const itemPage =
                item.dataset.page;

            if (
                itemPage === pageId ||

                (
                    pageId ===
                    "settingsPage" &&
                    itemPage ===
                    "profilePage"
                ) ||

                (
                    pageId ===
                    "leagueDetailsPage" &&
                    itemPage ===
                    "leaguesPage"
                )
            ) {

                item.classList.add(
                    "active-nav"
                );

            }

        });


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    try {

        if (
            pageId === "homePage"
        ) {

            renderHome();

        }


        if (
            pageId === "matchesPage"
        ) {

            renderMatches();

        }


        if (
            pageId === "resultsPage"
        ) {

            loadResults();

        }


        if (
            pageId === "leaguesPage"
        ) {

            loadLeagues();

        }


        if (
            pageId === "favoritesPage"
        ) {

            renderFavorites();

        }


        if (
            pageId === "channelsPage"
        ) {

            renderChannels();

        }

    } catch (error) {

        console.error(
            "Navigation page error:",
            error
        );

    }

}


/* =========================================================
   DATE
   ========================================================= */

function pad(number) {

    return String(
        number
    ).padStart(
        2,
        "0"
    );

}


function getDateOffset(offset) {

    const date =
        new Date();

    date.setDate(
        date.getDate() + offset
    );


    return [

        date.getFullYear(),

        pad(
            date.getMonth() + 1
        ),

        pad(
            date.getDate()
        )

    ].join("-");

}


function formatDateArabic(
    dateString
) {

    try {

        const date =
            new Date(
                `${dateString}T12:00:00`
            );


        return date.toLocaleDateString(
            "ar-SD",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    } catch {

        return String(
            dateString || ""
        );

    }

}


function formatTime(
    dateString
) {

    if (!dateString) {
        return "--:--";
    }


    try {

        return new Date(
            dateString
        ).toLocaleTimeString(
            "ar-SD",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Africa/Khartoum"
            }
        );

    } catch {

        return "--:--";

    }

}


function updateDateLabel() {

    const element =
        byId("matchesDateLabel");


    if (!element) {
        return;
    }


    element.textContent =
        formatDateArabic(
            getDateOffset(0)
        );

}


/* =========================================================
   API
   ========================================================= */

async function api(
    endpoint,
    params = {},
    cacheTime = 20000
) {

    if (
        !API_KEY ||
        API_KEY.length < 10
    ) {

        throw new Error(
            "API key غير موجود"
        );

    }


    const query =
        new URLSearchParams();


    Object.entries(
        params || {}
    ).forEach(
        ([key, value]) => {

            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {

                query.set(
                    key,
                    String(value)
                );

            }

        }
    );


    const cacheKey =
        endpoint +
        "?" +
        query.toString();


    const cached =
        state.cache.get(
            cacheKey
        );


    if (
        cached &&
        Date.now() - cached.time <
        cacheTime
    ) {

        return cached.data;

    }


    const url =
        `${API_BASE}/${endpoint}` +
        (
            query.toString()
                ? `?${query.toString()}`
                : ""
        );


    let response;


    try {

        response =
            await fetch(
                url,
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

    } catch (error) {

        throw new Error(
            "لا يوجد اتصال بالإنترنت"
        );

    }


    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
        );

    }


    let data;


    try {

        data =
            await response.json();

    } catch {

        throw new Error(
            "استجابة API غير صالحة"
        );

    }


    if (
        data &&
        data.errors &&
        Object.keys(
            data.errors
        ).length
    ) {

        const message =
            Object.values(
                data.errors
            ).join(" - ");


        throw new Error(
            message ||
            "خطأ في API"
        );

    }


    state.cache.set(
        cacheKey,
        {
            time: Date.now(),
            data
        }
    );


    return data;

}


/* =========================================================
   HOME
   ========================================================= */

async function loadHomeData() {

    renderLoading(
        "#homeLiveMatches"
    );

    renderLoading(
        "#homeTodayMatches"
    );


    const today =
        getDateOffset(0);


    try {

        const results =
            await Promise.allSettled([

                api(
                    "fixtures",
                    {
                        date: today,
                        timezone:
                            TIMEZONE
                    },
                    30000
                ),

                api(
                    "fixtures",
                    {
                        live: "all",
                        timezone:
                            TIMEZONE
                    },
                    15000
                )

            ]);


        const todayResult =
            results[0];

        const liveResult =
            results[1];


        if (
            todayResult.status ===
            "fulfilled"
        ) {

            state.todayFixtures =
                Array.isArray(
                    todayResult.value?.response
                )
                    ? todayResult.value.response
                    : [];

        } else {

            state.todayFixtures = [];

        }


        if (
            liveResult.status ===
            "fulfilled"
        ) {

            state.liveFixtures =
                Array.isArray(
                    liveResult.value?.response
                )
                    ? liveResult.value.response
                    : [];

        } else {

            state.liveFixtures = [];

        }


        renderHome();


    } catch (error) {

        console.error(
            "Home error:",
            error
        );


        renderApiError(
            "#homeLiveMatches",
            "تعذر تحميل المباريات المباشرة"
        );


        renderApiError(
            "#homeTodayMatches",
            "تعذر تحميل مباريات اليوم"
        );

    }

}


function renderHome() {

    const live =
        Array.isArray(
            state.liveFixtures
        )
            ? state.liveFixtures
            : [];


    const today =
        Array.isArray(
            state.todayFixtures
        )
            ? state.todayFixtures
            : [];


    renderMatchesInto(
        "#homeLiveMatches",
        live.slice(
            0,
            6
        )
    );


    const nonLive =
        today
            .filter(
                fixture =>
                    !isLiveFixture(
                        fixture
                    )
            )
            .slice(
                0,
                8
            );


    renderMatchesInto(
        "#homeTodayMatches",
        nonLive
    );

}


/* =========================================================
   MATCHES
   ========================================================= */

function renderMatches() {

    const element =
        byId("matchesList");


    if (!element) {
        return;
    }


    let fixtures =
        Array.isArray(
            state.todayFixtures
        )
            ? [
                ...state.todayFixtures
            ]
            : [];


    if (
        state.matchesFilter ===
        "live"
    ) {

        fixtures =
            Array.isArray(
                state.liveFixtures
            )
                ? [
                    ...state.liveFixtures
                ]
                : [];

    }


    if (
        state.matchesFilter ===
        "upcoming"
    ) {

        fixtures =
            fixtures.filter(
                isUpcomingFixture
            );

    }


    if (
        state.matchesFilter ===
        "finished"
    ) {

        fixtures =
            fixtures.filter(
                isFinishedFixture
            );

    }


    renderMatchesInto(
        "#matchesList",
        fixtures
    );

}


function renderMatchesInto(
    selector,
    fixtures
) {

    const container =
        $(selector);


    if (!container) {
        return;
    }


    if (
        !Array.isArray(
            fixtures
        ) ||
        !fixtures.length
    ) {

        container.innerHTML = `
            <div class="empty-state">
                ⚽
                <br><br>
                لا توجد مباريات متاحة حالياً
            </div>
        `;

        return;

    }


    container.innerHTML =
        fixtures
            .map(
                fixture =>
                    matchCardHtml(
                        fixture
                    )
            )
            .join("");


    $(`${selector}`)
        ?.querySelectorAll(
            ".match-card"
        )
        .forEach(card => {

            if (
                card.dataset.bound ===
                "true"
            ) {
                return;
            }


            card.dataset.bound =
                "true";


            card.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            card.dataset.id
                        );


                    if (
                        Number.isFinite(id)
                    ) {

                        openMatchDetails(
                            id
                        );

                    }

                }
            );

        });

}


/* =========================================================
   MATCH CARD
   ========================================================= */

function matchCardHtml(
    fixture
) {

    const info =
        fixture?.fixture || {};

    const league =
        fixture?.league || {};

    const teams =
        fixture?.teams || {};

    const home =
        teams.home || {};

    const away =
        teams.away || {};

    const goals =
        fixture?.goals || {};

    const status =
        info.status || {};


    const live =
        isLiveFixture(
            fixture
        );


    const finished =
        isFinishedFixture(
            fixture
        );


    let statusLabel =
        "قادمة";


    let statusClass =
        "upcoming-label";


    if (live) {

        statusLabel =
            "مباشر";

        statusClass =
            "live-label";

    } else if (finished) {

        statusLabel =
            "انتهت";

        statusClass =
            "finished-label";

    }


    const scoreHome =
        goals.home ??
        "";


    const scoreAway =
        goals.away ??
        "";


    let centerText;


    if (
        live ||
        finished
    ) {

        centerText =
            `${scoreHome} - ${scoreAway}`;

    } else {

        centerText =
            formatTime(
                info.date
            );

    }


    return `

        <article
            class="match-card ${live ? "live" : ""}"
            data-id="${escapeAttribute(
                info.id || ""
            )}">

            <div class="match-top">

                <span>
                    ${escapeHtml(
                        league.name ||
                        "كرة القدم"
                    )}
                </span>

                <span class="${statusClass}">

                    ${statusLabel}

                    ${
                        live &&
                        status.elapsed
                            ? ` • ${escapeHtml(
                                status.elapsed
                            )}'`
                            : ""
                    }

                </span>

            </div>


            <div class="match-teams">

                <div class="team">

                    ${teamLogo(
                        home.logo,
                        home.name
                    )}

                    <div class="team-name">

                        ${escapeHtml(
                            home.name ||
                            "الفريق المضيف"
                        )}

                    </div>

                </div>


                <div class="score-area">

                    <div class="${
                        live || finished
                            ? "score"
                            : "time-score"
                    }">

                        ${escapeHtml(
                            centerText
                        )}

                    </div>


                    ${
                        live
                            ? `
                            <div class="match-minute">
                                ⚡ مباشر الآن
                            </div>
                            `
                            : ""
                    }

                </div>


                <div class="team">

                    ${teamLogo(
                        away.logo,
                        away.name
                    )}

                    <div class="team-name">

                        ${escapeHtml(
                            away.name ||
                            "الفريق الضيف"
                        )}

                    </div>

                </div>

            </div>


            <div class="match-league">

                <span>

                    ${escapeHtml(
                        league.country ||
                        league.round ||
                        ""
                    )}

                </span>

                <span class="match-action">
                    التفاصيل ›
                </span>

            </div>

        </article>

    `;

}


/* =========================================================
   TEAM LOGO
   ========================================================= */

function teamLogo(
    url,
    name
) {

    const safeName =
        escapeHtml(
            name || "فريق"
        );


    if (!url) {

        return `
            <div
                class="team-logo-fallback"
                aria-label="${safeName}">
                ⚽
            </div>
        `;

    }


    return `
        <img
            class="team-logo"
            src="${escapeAttribute(url)}"
            alt="${safeName}"
            loading="lazy"
            onerror="
                this.onerror=null;
                this.style.display='none';
                if(this.nextElementSibling){
                    this.nextElementSibling.style.display='flex';
                }
            ">

        <div
            class="team-logo-fallback"
            style="display:none">
            ⚽
        </div>
    `;

}


/* =========================================================
   STATUS
   ========================================================= */

function isLiveFixture(
    fixture
) {

    const code =
        fixture?.fixture?.status?.short;


    return [
        "1H",
        "HT",
        "2H",
        "ET",
        "P",
        "BT"
    ].includes(
        code
    );

}


function isFinishedFixture(
    fixture
) {

    const code =
        fixture?.fixture?.status?.short;


    return [
        "FT",
        "AET",
        "PEN"
    ].includes(
        code
    );

}


function isUpcomingFixture(
    fixture
) {

    const code =
        fixture?.fixture?.status?.short;


    return [
        "NS",
        "TBD"
    ].includes(
        code
    );

}


/* =========================================================
   FILTERS
   ========================================================= */

function setupFilters() {

    $$(".filter-tab")
        .forEach(button => {

            if (
                button.dataset.bound ===
                "true"
            ) {
                return;
            }

            button.dataset.bound =
                "true";


            button.addEventListener(
                "click",
                () => {

                    $$(".filter-tab")
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active-filter"
                                )
                        );


                    button.classList.add(
                        "active-filter"
                    );


                    state.matchesFilter =
                        button.dataset.filter ||
                        "all";


                    renderMatches();

                }
            );

        });


    $$(".league-tab")
        .forEach(button => {

            if (
                button.dataset.bound ===
                "true"
            ) {
                return;
            }

            button.dataset.bound =
                "true";


            button.addEventListener(
                "click",
                () => {

                    $$(".league-tab")
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active-league-tab"
                                )
                        );


                    button.classList.add(
                        "active-league-tab"
                    );


                    const tab =
                        button.dataset.leagueTab;


                    const standings =
                        byId(
                            "standingsContent"
                        );

                    const scorers =
                        byId(
                            "scorersContent"
                        );


                    if (standings) {

                        standings.classList.toggle(
                            "hidden",
                            tab !== "standings"
                        );

                    }


                    if (scorers) {

                        scorers.classList.toggle(
                            "hidden",
                            tab !== "scorers"
                        );

                    }

                }
            );

        });


    $$(".channel-tab")
        .forEach(button => {

            if (
                button.dataset.bound ===
                "true"
            ) {
                return;
            }

            button.dataset.bound =
                "true";


            button.addEventListener(
                "click",
                () => {

                    $$(".channel-tab")
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active-channel"
                                )
                        );


                    button.classList.add(
                        "active-channel"
                    );


                    renderChannels(
                        button.dataset.channel ||
                        "all"
                    );

                }
            );

        });

}


/* =========================================================
   RESULTS
   ========================================================= */

function setupDateButtons() {

    const yesterday =
        byId(
            "yesterdayButton"
        );

    const today =
        byId(
            "todayButton"
        );

    const tomorrow =
        byId(
            "tomorrowButton"
        );


    yesterday?.addEventListener(
        "click",
        () => {

            state.resultDate =
                getDateOffset(-1);

            setDateButton(
                "yesterdayButton"
            );

            loadResults();

        }
    );


    today?.addEventListener(
        "click",
        () => {

            state.resultDate =
                getDateOffset(0);

            setDateButton(
                "todayButton"
            );

            loadResults();

        }
    );


    tomorrow?.addEventListener(
        "click",
        () => {

            state.resultDate =
                getDateOffset(1);

            setDateButton(
                "tomorrowButton"
            );

            loadResults();

        }
    );

}


function setDateButton(
    id
) {

    [
        "yesterdayButton",
        "todayButton",
        "tomorrowButton"
    ]
    .forEach(
        itemId => {

            byId(
                itemId
            )?.classList.remove(
                "selected-date"
            );

        }
    );


    byId(
        id
    )?.classList.add(
        "selected-date"
    );

}


async function loadResults() {

    const container =
        byId("resultsList");


    if (!container) {
        return;
    }


    renderLoading(
        "#resultsList"
    );


    try {

        const data =
            await api(
                "fixtures",
                {
                    date:
                        state.resultDate,

                    timezone:
                        TIMEZONE
                },
                30000
            );


        const fixtures =
            Array.isArray(
                data?.response
            )
                ? data.response
                : [];


        const finished =
            fixtures.filter(
                isFinishedFixture
            );


        renderMatchesInto(
            "#resultsList",
            finished
        );


    } catch (error) {

        console.error(
            "Results error:",
            error
        );


        renderApiError(
            "#resultsList",
            "تعذر تحميل النتائج"
        );

    }

}


/* =========================================================
   LEAGUES
   ========================================================= */

async function loadLeagues() {

    const container =
        byId("leaguesList");


    if (!container) {
        return;
    }


    if (
        Array.isArray(
            state.leagues
        ) &&
        state.leagues.length
    ) {

        renderLeagues();

        return;

    }


    renderLoading(
        "#leaguesList"
    );


    try {

        const data =
            await api(
                "leagues",
                {
                    current:
                        "true"
                },
                600000
            );


        state.leagues =
            Array.isArray(
                data?.response
            )
                ? data.response
                : [];


        const preferred = [

            "Premier League",

            "La Liga",

            "UEFA Champions League",

            "Serie A",

            "Bundesliga",

            "Ligue 1",

            "Saudi Pro League",

            "CAF Champions League",

            "World Cup"

        ];


        state.leagues.sort(
            (a, b) => {

                const ai =
                    preferred.indexOf(
                        a?.league?.name
                    );

                const bi =
                    preferred.indexOf(
                        b?.league?.name
                    );


                return (
                    (ai < 0 ? 999 : ai) -
                    (bi < 0 ? 999 : bi)
                );

            }
        );


        renderLeagues();


    } catch (error) {

        console.error(
            "Leagues error:",
            error
        );


        renderApiError(
            "#leaguesList",
            "تعذر تحميل البطولات"
        );

    }

}


function renderLeagues() {

    const container =
        byId("leaguesList");


    if (!container) {
        return;
    }


    if (!state.leagues.length) {

        container.innerHTML = `
            <div class="empty-state">
                🏆
                <br><br>
                لا توجد بطولات متاحة
            </div>
        `;

        return;

    }


    container.innerHTML =
        state.leagues
            .slice(
                0,
                30
            )
            .map(
                item => {

                    const league =
                        item?.league || {};

                    const country =
                        item?.country || {};


                    return `

                        <button
                            type="button"
                            class="league-card"
                            data-league-id="${
                                league.id || ""
                            }">

                            ${
                                league.logo
                                    ? `
                                    <img
                                        src="${escapeAttribute(
                                            league.logo
                                        )}"
                                        alt=""
                                        loading="lazy">
                                    `
                                    : `
                                    <div>
                                        🏆
                                    </div>
                                    `
                            }

                            <h3>
                                ${escapeHtml(
                                    league.name ||
                                    "بطولة"
                                )}
                            </h3>

                            <small>
                                ${escapeHtml(
                                    country.name ||
                                    "عالمي"
                                )}
                            </small>

                        </button>

                    `;

                }
            )
            .join("");


    $$("#leaguesList .league-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    openLeague(
                        Number(
                            card.dataset.leagueId
                        )
                    );

                }
            );

        });

}


/* =========================================================
   OPEN LEAGUE
   ========================================================= */

async function openLeague(
    leagueId
) {

    if (!leagueId) {
        return;
    }


    const item =
        state.leagues.find(
            entry =>
                Number(
                    entry?.league?.id
                ) ===
                Number(leagueId)
        );


    if (!item) {
        return;
    }


    const league =
        item.league || {};


    const seasons =
        Array.isArray(
            item.seasons
        )
            ? item.seasons
            : [];


    const currentSeason =
        seasons.find(
            season =>
                season?.current
        ) ||
        seasons[0];


    state.currentLeague = {

        id:
            Number(
                league.id
            ),

        name:
            league.name ||
            "البطولة",

        season:
            Number(
                currentSeason?.year ||
                new Date().getFullYear()
            )

    };


    const title =
        byId(
            "leagueDetailTitle"
        );

    const subtitle =
        byId(
            "leagueDetailSubtitle"
        );


    if (title) {

        title.textContent =
            state.currentLeague.name;

    }


    if (subtitle) {

        subtitle.textContent =
            `الترتيب • موسم ${
                state.currentLeague.season
            }`;

    }


    navigateTo(
        "leagueDetailsPage"
    );


    await Promise.allSettled([

        loadStandings(),

        loadTopScorers()

    ]);

}


/* =========================================================
   STANDINGS
   ========================================================= */

async function loadStandings() {

    const container =
        byId(
            "standingsContent"
        );


    if (!container) {
        return;
    }


    renderLoadingElement(
        container
    );


    if (!state.currentLeague) {
        return;
    }


    try {

        const data =
            await api(
                "standings",
                {
                    league:
                        state.currentLeague.id,

                    season:
                        state.currentLeague.season
                },
                300000
            );


        const groups =
            data?.response?.[0]
                ?.league
                ?.standings || [];


        const table =
            groups?.[0] || [];


        if (!table.length) {

            container.innerHTML = `
                <div class="empty-state">
                    لا توجد بيانات ترتيب لهذه البطولة حالياً.
                </div>
            `;

            return;

        }


        container.innerHTML = `

            <div class="standings-card">

                <div class="table-head">

                    <span>#</span>

                    <span>الفريق</span>

                    <span>ل</span>

                    <span>ف</span>

                    <span>ن</span>

                </div>


                ${table.map(
                    row => {

                        const team =
                            row?.team || {};


                        return `

                            <div class="table-row">

                                <span class="rank-number">
                                    ${
                                        row.rank ??
                                        "-"
                                    }
                                </span>


                                <div class="table-team">

                                    ${
                                        team.logo
                                            ? `
                                            <img
                                                src="${escapeAttribute(
                                                    team.logo
                                                )}"
                                                alt=""
                                                loading="lazy">
                                            `
                                            : `
                                            <span>
                                                ⚽
                                            </span>
                                            `
                                    }

                                    <span>
                                        ${escapeHtml(
                                            team.name ||
                                            "فريق"
                                        )}
                                    </span>

                                </div>


                                <span>
                                    ${
                                        row.all?.played ??
                                        "-"
                                    }
                                </span>


                                <span>
                                    ${
                                        row.all?.win ??
                                        "-"
                                    }
                                </span>


                                <span class="points">
                                    ${
                                        row.points ??
                                        "-"
                                    }
                                </span>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;


    } catch (error) {

        console.error(
            "Standings error:",
            error
        );


        container.innerHTML = `
            <div class="empty-state">
                ⚠️
                <br><br>
                تعذر تحميل الترتيب حالياً.
            </div>
        `;

    }

}


/* =========================================================
   TOP SCORERS
   ========================================================= */

async function loadTopScorers() {

    const container =
        byId(
            "scorersContent"
        );


    if (!container) {
        return;
    }


    renderLoadingElement(
        container
    );


    if (!state.currentLeague) {
        return;
    }


    try {

        const data =
            await api(
                "players/topscorers",
                {
                    league:
                        state.currentLeague.id,

                    season:
                        state.currentLeague.season
                },
                300000
            );


        const players =
            Array.isArray(
                data?.response
            )
                ? data.response
                : [];


        if (!players.length) {

            container.innerHTML = `
                <div class="empty-state">
                    لا توجد بيانات للهدافين حالياً.
                </div>
            `;

            return;

        }


        container.innerHTML =
            players
                .slice(
                    0,
                    20
                )
                .map(
                    (
                        playerData,
                        index
                    ) => {

                        const player =
                            playerData?.player ||
                            {};

                        const statistics =
                            playerData?.statistics?.[0] ||
                            {};


                        return `

                            <div class="scorer-card">

                                <div class="scorer-number">
                                    ${
                                        index + 1
                                    }
                                </div>


                                <div class="scorer-avatar">
                                    ⚽
                                </div>


                                <div class="scorer-info">

                                    <b>
                                        ${escapeHtml(
                                            player.name ||
                                            "لاعب"
                                        )}
                                    </b>

                                    <small>
                                        ${escapeHtml(
                                            statistics
                                                ?.team
                                                ?.name ||
                                            ""
                                        )}
                                    </small>

                                </div>


                                <div class="scorer-goals">

                                    ${
                                        statistics
                                            ?.goals
                                            ?.total ??
                                        0
                                    }

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");


    } catch (error) {

        console.error(
            "Scorers error:",
            error
        );


        container.innerHTML = `
            <div class="empty-state">
                تعذر تحميل الهدافين حالياً.
            </div>
        `;

    }

}


/* =========================================================
   CHANNELS
   ========================================================= */

const CHANNELS = [

    {
        id: 1,
        name: "beIN Sports 1",
        type: "bein",
        league: "دوري أبطال أوروبا",
        logo: "beIN 1"
    },

    {
        id: 2,
        name: "beIN Sports 2",
        type: "bein",
        league: "الدوري الإنجليزي",
        logo: "beIN 2"
    },

    {
        id: 3,
        name: "beIN Sports 3",
        type: "bein",
        league: "الدوري الإسباني",
        logo: "beIN 3"
    },

    {
        id: 4,
        name: "SSC 1",
        type: "ssc",
        league: "الدوري السعودي",
        logo: "SSC 1"
    },

    {
        id: 5,
        name: "SSC 5",
        type: "ssc",
        league: "الدوري السعودي",
        logo: "SSC 5"
    },

    {
        id: 6,
        name: "MBC Action",
        type: "other",
        league: "مباريات مختارة",
        logo: "MBC"
    }

];


function renderChannels(
    filter = "all"
) {

    const container =
        byId(
            "channelsList"
        );


    if (!container) {
        return;
    }


    let channels =
        [...CHANNELS];


    if (
        filter === "bein"
    ) {

        channels =
            channels.filter(
                channel =>
                    channel.type ===
                    "bein"
            );

    }


    if (
        filter === "ssc"
    ) {

        channels =
            channels.filter(
                channel =>
                    channel.type ===
                    "ssc"
            );

    }


    if (
        filter === "favorite"
    ) {

        channels =
            channels.filter(
                channel =>
                    state.channelsFavorites
                        .includes(
                            channel.id
                        )
            );

    }


    if (!channels.length) {

        container.innerHTML = `
            <div class="empty-state">
                لا توجد قنوات هنا حالياً.
            </div>
        `;

        return;

    }


    container.innerHTML =
        channels
            .map(
                channel => `

                    <div
                        class="channel-card"
                        data-channel-id="${
                            channel.id
                        }">

                        <div class="channel-logo">
                            ${escapeHtml(
                                channel.logo
                            )}
                        </div>


                        <div class="channel-info">

                            <b>
                                ${escapeHtml(
                                    channel.name
                                )}
                            </b>

                            <small>
                                ${escapeHtml(
                                    channel.league
                                )}
                            </small>

                        </div>


                        <span class="channel-live">
                            مباشر
                        </span>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   FAVORITES
   ========================================================= */

function addFavorite(
    team
) {

    if (!team?.id) {
        return;
    }


    const id =
        Number(
            team.id
        );


    const exists =
        state.favorites.some(
            favoriteId =>
                Number(
                    favoriteId
                ) === id
        );


    if (exists) {

        state.favorites =
            state.favorites.filter(
                favoriteId =>
                    Number(
                        favoriteId
                    ) !== id
            );


        showToast(
            "تمت إزالة الفريق من المفضلة"
        );

    } else {

        state.favorites.push(
            id
        );


        showToast(
            "تمت إضافة الفريق للمفضلة ⭐"
        );

    }


    saveJSON(
        "wd_faisal_favorites",
        state.favorites
    );


    renderFavorites();

}


function renderFavorites() {

    const container =
        byId(
            "favoritesList"
        );


    if (!container) {
        return;
    }


    if (
        !state.favorites.length
    ) {

        container.innerHTML = `
            <div class="empty-state">
                ⭐
                <br><br>
                لم تقم بإضافة أي فريق للمفضلة بعد.
            </div>
        `;

        return;

    }


    const teams = [];


    [
        ...state.todayFixtures,
        ...state.liveFixtures
    ]
    .forEach(
        fixture => {

            [
                fixture?.teams?.home,
                fixture?.teams?.away
            ]
            .forEach(
                team => {

                    if (!team?.id) {
                        return;
                    }


                    if (
                        !state.favorites.includes(
                            Number(
                                team.id
                            )
                        )
                    ) {
                        return;
                    }


                    if (
                        !teams.some(
                            existing =>
                                Number(
                                    existing.id
                                ) ===
                                Number(
                                    team.id
                                )
                        )
                    ) {

                        teams.push(
                            team
                        );

                    }

                }
            );

        }
    );


    if (!teams.length) {

        container.innerHTML = `
            <div class="empty-state">
                الفرق المفضلة محفوظة،
                وستظهر هنا عند تحميل مبارياتها.
            </div>
        `;

        return;

    }


    container.innerHTML =
        teams
            .map(
                team => `

                    <button
                        type="button"
                        class="match-card"
                        style="text-align:right"
                        data-team-id="${
                            team.id
                        }">

                        <div
                            style="
                                display:flex;
                                align-items:center;
                                gap:12px">

                            ${
                                team.logo
                                    ? `
                                    <img
                                        src="${escapeAttribute(
                                            team.logo
                                        )}"
                                        style="
                                            width:45px;
                                            height:45px;
                                            object-fit:contain"
                                        alt=""
                                        loading="lazy">
                                    `
                                    : `
                                    <span>
                                        ⚽
                                    </span>
                                    `
                            }

                            <div>

                                <b>
                                    ${escapeHtml(
                                        team.name ||
                                        "فريق"
                                    )}
                                </b>

                                <div
                                    style="
                                        color:#718ba1;
                                        font-size:9px;
                                        margin-top:4px">

                                    فريق مفضل ⭐

                                </div>

                            </div>

                        </div>

                    </button>

                `
            )
            .join("");

}


/* =========================================================
   SEARCH
   ========================================================= */

let searchTimer = null;


function setupSearch() {

    const input =
        byId(
            "searchInput"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        () => {

            clearTimeout(
                searchTimer
            );


            const query =
                input.value.trim();


            const results =
                byId(
                    "searchResults"
                );


            if (
                query.length < 2
            ) {

                results?.classList.add(
                    "hidden"
                );

                return;

            }


            searchTimer =
                window.setTimeout(
                    () =>
                        performSearch(
                            query
                        ),
                    450
                );

        }
    );

}


async function performSearch(
    query
) {

    const container =
        byId(
            "searchResults"
        );


    if (!container) {
        return;
    }


    container.classList.remove(
        "hidden"
    );


    container.innerHTML = `
        <div class="loading-state">
            جاري البحث...
        </div>
    `;


    const localFixtures = [

        ...state.todayFixtures,

        ...state.liveFixtures

    ];


    const localTeams = [];


    localFixtures.forEach(
        fixture => {

            [
                fixture?.teams?.home,
                fixture?.teams?.away
            ]
            .forEach(
                team => {

                    if (!team) {
                        return;
                    }


                    if (
                        !localTeams.some(
                            item =>
                                Number(
                                    item.id
                                ) ===
                                Number(
                                    team.id
                                )
                        )
                    ) {

                        localTeams.push(
                            team
                        );

                    }

                }
            );

        }
    );


    const normalizedQuery =
        normalize(
            query
        );


    const localResults =
        localTeams.filter(
            team =>
                normalize(
                    team.name
                ).includes(
                    normalizedQuery
                )
        );


    const localLeagues =
        state.leagues.filter(
            item =>
                normalize(
                    item?.league?.name
                ).includes(
                    normalizedQuery
                )
        );


    if (
        localResults.length ||
        localLeagues.length
    ) {

        renderSearchResults(
            localResults,
            localLeagues
        );

        return;

    }


    try {

        const results =
            await Promise.all([

                api(
                    "teams",
                    {
                        search: query
                    },
                    120000
                ),

                api(
                    "leagues",
                    {
                        search: query
                    },
                    120000
                )

            ]);


        const teams =
            results[0]?.response || [];


        const leagues =
            results[1]?.response || [];


        renderSearchResults(
            teams.slice(
                0,
                8
            ),
            leagues.slice(
                0,
                8
            )
        );


    } catch (error) {

        console.error(
            "Search error:",
            error
        );


        container.innerHTML = `
            <div class="empty-state">
                لم يتم العثور على نتائج.
            </div>
        `;

    }

}


function renderSearchResults(
    teams,
    leagues
) {

    const container =
        byId(
            "searchResults"
        );


    if (!container) {
        return;
    }


    if (
        !teams.length &&
        !leagues.length
    ) {

        container.innerHTML = `
            <div class="empty-state">
                لا توجد نتائج.
            </div>
        `;

        return;

    }


    let html = "";


    teams.forEach(
        item => {

            const team =
                item?.team ||
                item;


            if (!team?.id) {
                return;
            }


            html += `

                <button
                    type="button"
                    class="search-result"
                    data-team-id="${
                        team.id
                    }">

                    ${
                        team.logo
                            ? `
                            <img
                                src="${escapeAttribute(
                                    team.logo
                                )}"
                                alt=""
                                loading="lazy">
                            `
                            : `
                            <span>
                                ⚽
                            </span>
                            `
                    }

                    <div>

                        <b>
                            ${escapeHtml(
                                team.name ||
                                "فريق"
                            )}
                        </b>

                        <small>
                            فريق
                        </small>

                    </div>

                    <span>
                        ›
                    </span>

                </button>

            `;

        }
    );


    leagues.forEach(
        item => {

            const league =
                item?.league ||
                item;


            if (!league?.id) {
                return;
            }


            html += `

                <button
                    type="button"
                    class="search-result"
                    data-league-id="${
                        league.id
                    }">

                    ${
                        league.logo
                            ? `
                            <img
                                src="${escapeAttribute(
                                    league.logo
                                )}"
                                alt=""
                                loading="lazy">
                            `
                            : `
                            <span>
                                🏆
                            </span>
                            `
                    }

                    <div>

                        <b>
                            ${escapeHtml(
                                league.name ||
                                "بطولة"
                            )}
                        </b>

                        <small>
                            بطولة
                        </small>

                    </div>

                    <span>
                        ›
                    </span>

                </button>

            `;

        }
    );


    container.innerHTML =
        html;


    $$("#searchResults .search-result")
        .forEach(button => {

            button.addEventListener(
                "click",
                async () => {

                    const teamId =
                        button.dataset.teamId;


                    const leagueId =
                        button.dataset.leagueId;


                    if (teamId) {

                        await openTeam(
                            Number(teamId)
                        );

                    }


                    if (leagueId) {

                        await openLeagueFromSearch(
                            Number(leagueId)
                        );

                    }


                    container.classList.add(
                        "hidden"
                    );

                }
            );

        });

}


/* =========================================================
   TEAM
   ========================================================= */

async function openTeam(
    teamId
) {

    if (!teamId) {
        return;
    }


    try {

        const data =
            await api(
                "teams",
                {
                    id:
                        teamId
                },
                300000
            );


        const team =
            data?.response?.[0]?.team;


        if (!team) {

            showToast(
                "لم يتم العثور على الفريق"
            );

            return;

        }


        const favorite =
            state.favorites.includes(
                Number(
                    team.id
                )
            );


        /*
         * استخدام confirm آمن هنا،
         * وإذا لم يدعمه المتصفح لا يحدث خطأ.
         */

        let confirmAdd = true;


        try {

            confirmAdd =
                window.confirm(
                    `${team.name}\n\n` +
                    (
                        favorite
                            ? "إزالة الفريق من المفضلة؟"
                            : "إضافة الفريق إلى المفضلة؟"
                    )
                );

        } catch {

            confirmAdd = true;

        }


        if (confirmAdd) {

            addFavorite(
                team
            );

        }

    } catch (error) {

        console.error(
            "Team error:",
            error
        );


        showToast(
            "تعذر تحميل الفريق"
        );

    }

}


/* =========================================================
   SEARCH LEAGUE
   ========================================================= */

async function openLeagueFromSearch(
    leagueId
) {

    if (!leagueId) {
        return;
    }


    const existing =
        state.leagues.find(
            item =>
                Number(
                    item?.league?.id
                ) ===
                Number(
                    leagueId
                )
        );


    if (existing) {

        await openLeague(
            leagueId
        );

        return;

    }


    try {

        const data =
            await api(
                "leagues",
                {
                    id:
                        leagueId
                },
                300000
            );


        const item =
            data?.response?.[0];


        if (!item) {
            return;
        }


        state.leagues.push(
            item
        );


        await openLeague(
            leagueId
        );


    } catch (error) {

        console.error(
            "League search error:",
            error
        );


        showToast(
            "تعذر تحميل البطولة"
        );

    }

}


/* =========================================================
   MATCH MODAL
   ========================================================= */

function setupModal() {

    byId(
        "closeModal"
    )?.addEventListener(
        "click",
        closeMatchModal
    );


    $(".modal-backdrop")
        ?.addEventListener(
            "click",
            closeMatchModal
        );


    byId(
        "matchModal"
    )?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                byId("matchModal")
            ) {

                closeMatchModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                closeMatchModal();

            }

        }
    );

}


function closeMatchModal() {

    byId(
        "matchModal"
    )?.classList.add(
        "hidden"
    );

}


/* =========================================================
   MATCH DETAILS
   ========================================================= */

async function openMatchDetails(
    fixtureId
) {

    if (!fixtureId) {
        return;
    }


    const modal =
        byId(
            "matchModal"
        );

    const details =
        byId(
            "matchDetails"
        );


    if (!modal || !details) {

        console.warn(
            "matchModal or matchDetails not found"
        );

        return;

    }


    modal.classList.remove(
        "hidden"
    );


    details.innerHTML = `
        <div class="loading-state">

            <div class="spinner"></div>

            جاري تحميل تفاصيل المباراة...

        </div>
    `;


    try {

        /*
         * API-Football يحتاج طلبات منفصلة
         * للأحداث والتشكيلات والإحصائيات.
         */

        const results =
            await Promise.allSettled([

                api(
                    "fixtures",
                    {
                        id:
                            fixtureId
                    },
                    15000
                ),

                api(
                    "fixtures/events",
                    {
                        fixture:
                            fixtureId
                    },
                    15000
                ),

                api(
                    "fixtures/lineups",
                    {
                        fixture:
                            fixtureId
                    },
                    30000
                ),

                api(
                    "fixtures/statistics",
                    {
                        fixture:
                            fixtureId
                    },
                    30000
                )

            ]);


        const fixtureData =
            results[0];


        if (
            fixtureData.status !==
            "fulfilled"
        ) {

            throw new Error(
                "تعذر تحميل المباراة"
            );

        }


        const fixture =
            fixtureData
                .value
                ?.response
                ?.[0];


        if (!fixture) {

            throw new Error(
                "Fixture not found"
            );

        }


        const eventsData =
            results[1];


        const lineupsData =
            results[2];


        const statsData =
            results[3];


        fixture.events =
            eventsData.status ===
            "fulfilled"

                ? (
                    eventsData
                        .value
                        ?.response || []
                )

                : [];


        fixture.lineups =
            lineupsData.status ===
            "fulfilled"

                ? (
                    lineupsData
                        .value
                        ?.response || []
                )

                : [];


        fixture.statistics =
            statsData.status ===
            "fulfilled"

                ? (
                    statsData
                        .value
                        ?.response || []
                )

                : [];


        state.currentMatch =
            fixture;


        renderMatchDetails(
            fixture
        );


    } catch (error) {

        console.error(
            "Match details error:",
            error
        );


        details.innerHTML = `
            <div class="empty-state">

                ⚠️

                <br><br>

                تعذر تحميل تفاصيل المباراة.

                <br><br>

                <button
                    type="button"
                    onclick="location.reload()"
                    style="
                        padding:10px 16px;
                        border-radius:12px;
                        border:0;
                        background:#087fff;
                        color:#fff;
                        cursor:pointer">

                    إعادة المحاولة

                </button>

            </div>
        `;

    }

}


/* =========================================================
   MATCH DETAILS UI
   ========================================================= */

function renderMatchDetails(
    fixture
) {

    const info =
        fixture?.fixture || {};

    const league =
        fixture?.league || {};

    const teams =
        fixture?.teams || {};

    const goals =
        fixture?.goals || {};

    const status =
        info?.status || {};


    const live =
        isLiveFixture(
            fixture
        );


    const finished =
        isFinishedFixture(
            fixture
        );


    const container =
        byId(
            "matchDetails"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="details-league">

            ${escapeHtml(
                league.name ||
                "كرة القدم"
            )}

            ${
                league.country
                    ? ` • ${escapeHtml(
                        league.country
                    )}`
                    : ""
            }

        </div>


        <div class="details-teams">

            <div class="details-team">

                ${
                    teams.home?.logo
                        ? `
                        <img
                            src="${escapeAttribute(
                                teams.home.logo
                            )}"
                            alt=""
                            loading="lazy">
                        `
                        : `
                        <span>
                            ⚽
                        </span>
                        `
                }

                <b>
                    ${escapeHtml(
                        teams.home?.name ||
                        ""
                    )}
                </b>

            </div>


            <div class="details-score">

                <strong>

                    ${
                        live ||
                        finished

                            ? `${goals.home ?? 0} - ${
                                goals.away ?? 0
                              }`

                            : formatTime(
                                info.date
                            )

                    }

                </strong>


                <span>

                    ${
                        live

                            ? (
                                status.elapsed
                                    ? `الدقيقة ${
                                        status.elapsed
                                      }`
                                    : "مباشر"
                              )

                            : (
                                finished
                                    ? "انتهت المباراة"
                                    : "لم تبدأ"
                              )

                    }

                </span>

            </div>


            <div class="details-team">

                ${
                    teams.away?.logo
                        ? `
                        <img
                            src="${escapeAttribute(
                                teams.away.logo
                            )}"
                            alt=""
                            loading="lazy">
                        `
                        : `
                        <span>
                            ⚽
                        </span>
                        `
                }

                <b>
                    ${escapeHtml(
                        teams.away?.name ||
                        ""
                    )}
                </b>

            </div>

        </div>


        <div class="details-tabs">

            <button
                type="button"
                class="details-tab active-details"
                data-details-tab="events">

                الأحداث

            </button>


            <button
                type="button"
                class="details-tab"
                data-details-tab="lineups">

                التشكيلة

            </button>


            <button
                type="button"
                class="details-tab"
                data-details-tab="stats">

                الإحصائيات

            </button>

        </div>


        <div id="detailsContent"></div>

    `;


    renderEvents(
        fixture
    );


    $$("#matchDetails .details-tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    $$("#matchDetails .details-tab")
                        .forEach(
                            item =>
                                item.classList.remove(
                                    "active-details"
                                )
                        );


                    tab.classList.add(
                        "active-details"
                    );


                    const type =
                        tab.dataset.detailsTab;


                    if (
                        type ===
                        "events"
                    ) {

                        renderEvents(
                            fixture
                        );

                    }


                    if (
                        type ===
                        "lineups"
                    ) {

                        renderLineups(
                            fixture
                        );

                    }


                    if (
                        type ===
                        "stats"
                    ) {

                        renderStats(
                            fixture
                        );

                    }

                }
            );

        });

}


/* =========================================================
   EVENTS
   ========================================================= */

function renderEvents(
    fixture
) {

    const container =
        byId(
            "detailsContent"
        );


    if (!container) {
        return;
    }


    const events =
        Array.isArray(
            fixture?.events
        )
            ? fixture.events
            : [];


    if (!events.length) {

        container.innerHTML = `
            <div class="empty-state">
                ⚽
                <br><br>
                لا توجد أحداث مسجلة حالياً.
            </div>
        `;

        return;

    }


    container.innerHTML =
        events
            .map(
                event => {

                    let icon =
                        "•";


                    if (
                        event?.type ===
                        "Goal"
                    ) {

                        icon =
                            "⚽";

                    } else if (
                        event?.type ===
                        "Card"
                    ) {

                        const detail =
                            String(
                                event?.detail ||
                                ""
                            )
                            .toLowerCase();


                        icon =
                            detail.includes(
                                "red"
                            )
                                ? "🟥"
                                : "🟨";

                    } else if (
                        String(
                            event?.type ||
                            ""
                        ).toLowerCase() ===
                        "subst"
                    ) {

                        icon =
                            "🔁";

                    } else if (
                        event?.type ===
                        "Var"
                    ) {

                        icon =
                            "📺";

                    }


                    return `

                        <div class="event-item">

                            <div class="event-time">

                                ${
                                    event?.time?.elapsed
                                        ? `${
                                            event.time.elapsed
                                          }'`
                                        : ""
                                }

                            </div>


                            <div class="event-icon">

                                ${icon}

                            </div>


                            <div class="event-player">

                                ${
                                    event?.player?.name
                                        ? escapeHtml(
                                            event.player.name
                                        )
                                        : escapeHtml(
                                            event?.type ||
                                            ""
                                        )
                                }


                                ${
                                    event?.assist?.name
                                        ? `
                                        <div
                                            style="
                                                color:#6e8ba2;
                                                font-size:8px">

                                            تمريرة:
                                            ${escapeHtml(
                                                event.assist.name
                                            )}

                                        </div>
                                        `
                                        : ""
                                }

                            </div>


                            <div class="event-team">

                                ${
                                    event?.team?.name
                                        ? escapeHtml(
                                            event.team.name
                                        )
                                        : ""
                                }

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   LINEUPS
   ========================================================= */

function renderLineups(
    fixture
) {

    const container =
        byId(
            "detailsContent"
        );


    if (!container) {
        return;
    }


    const lineups =
        Array.isArray(
            fixture?.lineups
        )
            ? fixture.lineups
            : [];


    if (!lineups.length) {

        container.innerHTML = `
            <div class="empty-state">
                👥
                <br><br>
                التشكيلات غير متوفرة حالياً.
            </div>
        `;

        return;

    }


    container.innerHTML =
        lineups
            .map(
                lineup => {

                    const players =
                        Array.isArray(
                            lineup?.startXI
                        )
                            ? lineup.startXI
                            : [];


                    return `

                        <div class="lineup-team">

                            <h3>

                                ${escapeHtml(
                                    lineup?.team?.name ||
                                    "الفريق"
                                )}

                                ${
                                    lineup?.formation
                                        ? `
                                        <span
                                            style="
                                                color:#6ebcf0;
                                                font-size:9px">

                                            • ${
                                                escapeHtml(
                                                    lineup.formation
                                                )
                                            }

                                        </span>
                                        `
                                        : ""
                                }

                            </h3>


                            <div class="lineup-row">

                                ${
                                    players.length
                                        ? players.map(
                                            item => {

                                                const player =
                                                    item?.player ||
                                                    {};


                                                return `

                                                    <span
                                                        class="player-chip">

                                                        ${
                                                            item?.number ??
                                                            ""
                                                        }

                                                        &nbsp;

                                                        ${escapeHtml(
                                                            player.name ||
                                                            "لاعب"
                                                        )}

                                                    </span>

                                                `;

                                            }
                                        ).join("")

                                        : `
                                        <div class="empty-state">
                                            لا توجد تشكيلة أساسية.
                                        </div>
                                        `
                                }

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   STATISTICS
   ========================================================= */

function renderStats(
    fixture
) {

    const container =
        byId(
            "detailsContent"
        );


    if (!container) {
        return;
    }


    const statistics =
        Array.isArray(
            fixture?.statistics
        )
            ? fixture.statistics
            : [];


    if (
        statistics.length < 1
    ) {

        container.innerHTML = `
            <div class="empty-state">
                📊
                <br><br>
                إحصائيات المباراة غير متوفرة.
            </div>
        `;

        return;

    }


    const home =
        statistics[0] || {};


    const away =
        statistics[1] || {};


    const homeStats =
        normalizeStatistics(
            home.statistics
        );


    const awayStats =
        normalizeStatistics(
            away.statistics
        );


    const names =
        Array.from(
            new Set([
                ...Object.keys(
                    homeStats
                ),
                ...Object.keys(
                    awayStats
                )
            ])
        );


    if (!names.length) {

        container.innerHTML = `
            <div class="empty-state">
                لا توجد إحصائيات مفصلة.
            </div>
        `;

        return;

    }


    container.innerHTML =
        names
            .map(
                name => {

                    const h =
                        numericStat(
                            homeStats[name]
                        );


                    const a =
                        numericStat(
                            awayStats[name]
                        );


                    const total =
                        Math.max(
                            h + a,
                            1
                        );


                    const hp =
                        Math.round(
                            h /
                            total *
                            100
                        );


                    const ap =
                        100 - hp;


                    return `

                        <div class="stat-row">

                            <span>
                                ${a}
                            </span>


                            <div>

                                <div
                                    style="
                                        display:flex;
                                        gap:3px;
                                        margin-bottom:5px">

                                    <span
                                        style="
                                            height:5px;
                                            background:
                                                linear-gradient(
                                                    90deg,
                                                    #006dff,
                                                    #00bcff
                                                );
                                            border-radius:20px;
                                            width:${hp}%">
                                    </span>

                                    <span
                                        style="
                                            height:5px;
                                            background:#2c506a;
                                            border-radius:20px;
                                            width:${ap}%">
                                    </span>

                                </div>


                                <div class="stat-name">

                                    ${escapeHtml(
                                        name
                                    )}

                                </div>

                            </div>


                            <span>
                                ${h}
                            </span>

                        </div>

                    `;

                }
            )
            .join("");

}


function normalizeStatistics(
    stats
) {

    const result = {};


    if (
        !Array.isArray(
            stats
        )
    ) {

        return result;

    }


    stats.forEach(
        stat => {

            if (!stat?.type) {
                return;
            }


            result[
                stat.type
            ] =
                stat.value;

        }
    );


    return result;

}


function numericStat(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return 0;

    }


    const text =
        String(value)
            .replace(
                "%",
                ""
            )
            .trim();


    const number =
        Number(
            text
        );


    return Number.isFinite(
        number
    )
        ? number
        : 0;

}


/* =========================================================
   SETTINGS
   ========================================================= */

function setupSettings() {

    $$(
        'input[name="quality"]'
    )
    .forEach(input => {

        input.addEventListener(
            "change",
            () => {

                state.settings.quality =
                    input.value;


                saveSettings();


                showToast(
                    "تم حفظ الجودة"
                );

            }
        );

    });


    byId(
        "networkToggle"
    )?.addEventListener(
        "change",
        event => {

            state.settings.network =
                Boolean(
                    event.target.checked
                );


            saveSettings();

        }
    );


    byId(
        "notificationToggle"
    )?.addEventListener(
        "change",
        event => {

            state.settings.notifications =
                Boolean(
                    event.target.checked
                );


            saveSettings();


            const badge =
                byId(
                    "notificationBadge"
                );


            if (badge) {

                badge.style.display =
                    state.settings.notifications
                        ? "block"
                        : "none";

            }

        }
    );


    byId(
        "darkModeToggle"
    )?.addEventListener(
        "change",
        event => {

            state.settings.darkMode =
                Boolean(
                    event.target.checked
                );


            saveSettings();

            applySettings();

        }
    );

}


function saveSettings() {

    saveJSON(
        "wd_faisal_settings",
        state.settings
    );

}


function applySettings() {

    /*
     * التطبيق مصمم بالوضع الداكن.
     * لذلك لا نسمح بتحويله إلى أبيض
     * حتى لو لم يكن CSS يدعم الوضع الفاتح.
     */

    document.documentElement
        .dataset.theme =
            "dark";


    $$(
        'input[name="quality"]'
    )
    .forEach(
        input => {

            input.checked =
                input.value ===
                state.settings.quality;

        }
    );


    const network =
        byId(
            "networkToggle"
        );


    if (network) {

        network.checked =
            Boolean(
                state.settings.network
            );

    }


    const notifications =
        byId(
            "notificationToggle"
        );


    if (notifications) {

        notifications.checked =
            Boolean(
                state.settings.notifications
            );

    }


    const dark =
        byId(
            "darkModeToggle"
        );


    if (dark) {

        dark.checked = true;

    }


    const badge =
        byId(
            "notificationBadge"
        );


    if (badge) {

        badge.style.display =
            state.settings.notifications
                ? "block"
                : "none";

    }

}


/* =========================================================
   PROFILE
   ========================================================= */

function setupProfileActions() {

    byId(
        "notificationButton"
    )?.addEventListener(
        "click",
        () => {

            showToast(
                state.settings.notifications
                    ? "الإشعارات مفعلة 🔔"
                    : "الإشعارات متوقفة"
            );

        }
    );


    $$(
        '[data-action="notifications"]'
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    navigateTo(
                        "settingsPage"
                    );

                }
            );

        }
    );


    $$(
        '[data-action="share"]'
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                shareApp
            );

        }
    );


    $$(
        '[data-action="contact"]'
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                contactDeveloper
            );

        }
    );


    byId(
        "developerButton"
    )?.addEventListener(
        "click",
        contactDeveloper
    );

}


function contactDeveloper() {

    window.location.href =
        "mailto:developer@example.com" +
        "?subject=" +
        encodeURIComponent(
            "فكرة لتطبيق ود فيصل"
        );

}


/* =========================================================
   SHARE
   ========================================================= */

async function shareApp() {

    const shareData = {

        title:
            "ود فيصل",

        text:
            "تابع مباريات ونتائج كرة القدم مع تطبيق ود فيصل.",

        url:
            window.location.href

    };


    try {

        if (
            typeof navigator.share ===
            "function"
        ) {

            await navigator.share(
                shareData
            );

            return;

        }


        if (
            navigator.clipboard &&
            typeof navigator.clipboard.writeText ===
            "function"
        ) {

            await navigator.clipboard.writeText(
                window.location.href
            );


            showToast(
                "تم نسخ رابط التطبيق"
            );


            return;

        }


        showToast(
            "المشاركة غير متاحة في هذا المتصفح"
        );


    } catch {

        showToast(
            "تم إلغاء المشاركة"
        );

    }

}


/* =========================================================
   REFRESH
   ========================================================= */

function setupRefreshButtons() {

    $$(
        '[data-action="refresh"]'
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    state.cache.clear();

                    loadHomeData();

                    showToast(
                        "جاري تحديث المباريات..."
                    );

                }
            );

        }
    );


    byId(
        "refreshButton"
    )?.addEventListener(
        "click",
        () => {

            state.cache.clear();

            loadHomeData();

            showToast(
                "جاري تحديث البيانات..."
            );

        }
    );

}


/* =========================================================
   AUTO LIVE UPDATE
   ========================================================= */

window.setInterval(
    async () => {

        if (
            document.hidden
        ) {
            return;
        }


        try {

            const data =
                await api(
                    "fixtures",
                    {
                        live:
                            "all",

                        timezone:
                            TIMEZONE
                    },
                    0
                );


            state.liveFixtures =
                Array.isArray(
                    data?.response
                )
                    ? data.response
                    : [];


            if (
                state.currentPage ===
                "homePage"
            ) {

                renderHome();

            }


            if (
                state.currentPage ===
                "matchesPage"
            ) {

                renderMatches();

            }

        } catch (error) {

            console.warn(
                "Live update failed:",
                error
            );

        }

    },
    60000
);


/* =========================================================
   HOME REFRESH
   ========================================================= */

window.setInterval(
    () => {

        if (
            document.hidden
        ) {
            return;
        }


        if (
            state.currentPage ===
            "homePage"
        ) {

            loadHomeData();

        }

    },
    120000
);


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;


function showToast(
    message
) {

    const toast =
        byId(
            "toast"
        );


    if (!toast) {
        return;
    }


    toast.textContent =
        String(
            message || ""
        );


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        window.setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2300
        );

}


/* =========================================================
   LOADING
   ========================================================= */

function renderLoading(
    selector
) {

    const element =
        $(selector);


    if (!element) {
        return;
    }


    element.innerHTML = `
        <div class="loading-state">

            <div class="spinner"></div>

            جاري تحميل البيانات...

        </div>
    `;

}


function renderLoadingElement(
    element
) {

    if (!element) {
        return;
    }


    element.innerHTML = `
        <div class="loading-state">

            <div class="spinner"></div>

            جاري تحميل البيانات...

        </div>
    `;

}


/* =========================================================
   API ERROR
   ========================================================= */

function renderApiError(
    selector,
    message
) {

    const element =
        $(selector);


    if (!element) {
        return;
    }


    element.innerHTML = `
        <div class="empty-state">

            ⚠️

            <br><br>

            ${escapeHtml(
                message
            )}

            <br><br>

            <button
                type="button"
                class="retry-button">

                إعادة المحاولة

            </button>

        </div>
    `;


    element
        .querySelector(
            ".retry-button"
        )
        ?.addEventListener(
            "click",
            () => {

                state.cache.clear();

                loadHomeData();

            }
        );

}


/* =========================================================
   NORMALIZE
   ========================================================= */

function normalize(
    value
) {

    return String(
        value || ""
    )
    .toLowerCase()
    .replace(
        /[\u064B-\u065F\u0670]/g,
        ""
    )
    .replace(
        /[أإآ]/g,
        "ا"
    )
    .replace(
        /ة/g,
        "ه"
    )
    .trim();

}


/* =========================================================
   HTML SECURITY
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


function escapeAttribute(
    value
) {

    return escapeHtml(
        value
    );

}


/* =========================================================
   GLOBAL ERROR PROTECTION
   ========================================================= */

/*
 * إذا حدث أي خطأ غير متوقع في JavaScript،
 * لا نجعل التطبيق يعلق على شاشة البداية.
 */

window.addEventListener(
    "error",
    event => {

        console.error(
            "Global JS error:",
            event.error ||
            event.message
        );


        const splash =
            byId(
                "splashScreen"
            );

        const app =
            byId(
                "app"
            );


        if (splash) {

            splash.classList.add(
                "hide"
            );

        }


        if (app) {

            app.classList.remove(
                "hidden"
            );

            app.style.display =
                "block";

        }

    }
);


window.addEventListener(
    "unhandledrejection",
    event => {

        console.error(
            "Unhandled promise:",
            event.reason
        );

    }
);


/* =========================================================
   END
   ========================================================= */
