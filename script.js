/* =========================================================
   ود فيصل
   FOOTBALL ENGINE
   ========================================================= */


/* =========================================================
   API
========================================================= */

const API_KEY =
    "a4c2934c4adb9f2d14d0acc2e970cca6";

const API_BASE =
    "https://v3.football.api-sports.io";


/* =========================================================
   VARIABLES
========================================================= */

let matches = [];

let currentFilter =
    "all";

let selectedOffset =
    0;

let selectedDate =
    "";

let isLoading =
    false;

let refreshTimer =
    null;


/* =========================================================
   STORAGE
========================================================= */

const favorites =
    new Set(
        JSON.parse(
            localStorage.getItem(
                "wd_faisal_favorites"
            ) || "[]"
        )
    );


const settings = {

    autoRefresh:
        localStorage.getItem(
            "wd_faisal_auto"
        ) !== "false",

    animations:
        localStorage.getItem(
            "wd_faisal_anim"
        ) !== "false"

};


/* =========================================================
   SHORT SELECTOR
========================================================= */

const $ =
    function(id){

        return document.getElementById(id);

    };


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
){

    const toast =
        $("toast");


    if(!toast)
        return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.__toastTimer
    );


    window.__toastTimer =
        setTimeout(
            function(){

                toast.classList.remove(
                    "show"
                );

            },
            2300
        );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(
    value
){

    return String(
        value ?? ""
    )

    .replaceAll(
        "&",
        "&amp;"
    )

    .replaceAll(
        "<",
        "&lt;"
    )

    .replaceAll(
        ">",
        "&gt;"
    )

    .replaceAll(
        '"',
        "&quot;"
    )

    .replaceAll(
        "'",
        "&#039;"
    );

}


/* =========================================================
   FAVORITES
========================================================= */

function saveFavorites(){

    localStorage.setItem(
        "wd_faisal_favorites",

        JSON.stringify(
            [...favorites]
        )

    );

}


function toggleFavorite(
    id
){

    const key =
        String(id);


    if(
        favorites.has(key)
    ){

        favorites.delete(
            key
        );

        showToast(
            "تمت إزالة المباراة من المفضلة"
        );

    }else{

        favorites.add(
            key
        );

        showToast(
            "⭐ تمت إضافة المباراة للمفضلة"
        );

    }


    saveFavorites();

    renderMatches();

}


/* =========================================================
   DATE - SUDAN
========================================================= */

function getSudanDate(
    offset = 0
){

    const now =
        new Date();


    const parts =
        new Intl.DateTimeFormat(
            "en-CA",
            {

                timeZone:
                    "Africa/Khartoum",

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit"

            }
        ).formatToParts(
            now
        );


    const year =
        Number(
            parts.find(
                p =>
                    p.type ===
                    "year"
            )?.value
        );


    const month =
        Number(
            parts.find(
                p =>
                    p.type ===
                    "month"
            )?.value
        );


    const day =
        Number(
            parts.find(
                p =>
                    p.type ===
                    "day"
            )?.value
        );


    return new Date(

        Date.UTC(
            year,
            month - 1,
            day + offset
        )

    )

    .toISOString()
    .slice(
        0,
        10
    );

}


/* =========================================================
   DATE LABEL
========================================================= */

function getDateLabel(){

    if(
        selectedOffset === -1
    )
        return "أمس";


    if(
        selectedOffset === 1
    )
        return "غداً";


    return "اليوم";

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    date
){

    return new Intl.DateTimeFormat(
        "ar-SD",
        {

            timeZone:
                "Africa/Khartoum",

            weekday:
                "long",

            day:
                "numeric",

            month:
                "long"

        }
    ).format(

        new Date(
            date +
            "T12:00:00Z"
        )

    );

}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(
    date
){

    return new Intl.DateTimeFormat(
        "ar-SD",
        {

            timeZone:
                "Africa/Khartoum",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    ).format(

        new Date(
            date
        )

    );

}


/* =========================================================
   STATUS TYPE
========================================================= */

function matchType(
    status
){

    const live =
        [
            "1H",
            "HT",
            "2H",
            "ET",
            "BT",
            "P",
            "LIVE"
        ];


    const finished =
        [
            "FT",
            "AET",
            "PEN"
        ];


    if(
        live.includes(
            status
        )
    )
        return "live";


    if(
        finished.includes(
            status
        )
    )
        return "finished";


    return "upcoming";

}


/* =========================================================
   ARABIC STATUS
========================================================= */

function arabicStatus(
    status,
    elapsed
){

    const labels = {

        NS:
            "لم تبدأ",

        TBD:
            "الوقت غير محدد",

        HT:
            "استراحة",

        FT:
            "مكتملة",

        AET:
            "بعد الوقت الإضافي",

        PEN:
            "ركلات الترجيح",

        PST:
            "مؤجلة",

        CANC:
            "ملغاة",

        SUSP:
            "متوقفة",

        ABD:
            "متوقفة"

    };


    if(
        [
            "1H",
            "2H",
            "ET",
            "P",
            "BT",
            "LIVE"
        ].includes(
            status
        )
    ){

        return elapsed
            ?
            `🔴 مباشر ${elapsed}'`
            :
            "🔴 مباشر";

    }


    return (

        labels[status]
        ||
        status
        ||
        "غير معروف"

    );

}


/* =========================================================
   API STATUS
========================================================= */

function apiStatus(
    message,
    kind = ""
){

    const box =
        $("apiStatus");


    if(!box)
        return;


    box.textContent =
        message;


    box.className =
        "api-status " +
        kind;

}


/* =========================================================
   API FETCH
========================================================= */

async function apiFetch(
    url
){

    const response =
        await fetch(
            url,
            {

                method:
                    "GET",

                headers:{

                    "x-apisports-key":
                        API_KEY,

                    "Accept":
                        "application/json"

                }

            }
        );


    if(
        !response.ok
    ){

        throw new Error(
            "HTTP " +
            response.status
        );

    }


    const data =
        await response.json();


    if(
        data.errors &&
        Object.keys(
            data.errors
        ).length
    ){

        throw new Error(
            JSON.stringify(
                data.errors
            )
        );

    }


    return data;

}


/* =========================================================
   SKELETON
========================================================= */

function renderSkeletons(
    count = 5
){

    const box =
        $("matchesBox");


    if(!box)
        return;


    box.innerHTML =
        Array.from(
            {
                length:
                    count
            }
        )

        .map(
            function(){

                return `

                    <div
                        class="skeleton-match"
                    >

                        <div
                            class="skeleton-line wide"
                        ></div>


                        <div
                            class="skeleton-teams"
                        >

                            <div>

                                <span
                                    class="skeleton-circle"
                                ></span>

                                <span
                                    class="skeleton-line"
                                ></span>

                            </div>


                            <div>

                                <span
                                    class="skeleton-score"
                                ></span>

                                <span
                                    class="skeleton-line short"
                                ></span>

                            </div>


                            <div>

                                <span
                                    class="skeleton-circle"
                                ></span>

                                <span
                                    class="skeleton-line"
                                ></span>

                            </div>

                        </div>

                    </div>

                `;

            }
        )

        .join("");

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboardStats(){

    const live =
        matches.filter(
            function(match){

                return (
                    matchType(
                        match.fixture
                            ?.status
                            ?.short
                    )
                    ===
                    "live"
                );

            }
        ).length;


    const upcoming =
        matches.filter(
            function(match){

                return (
                    matchType(
                        match.fixture
                            ?.status
                            ?.short
                    )
                    ===
                    "upcoming"
                );

            }
        ).length;


    const finished =
        matches.filter(
            function(match){

                return (
                    matchType(
                        match.fixture
                            ?.status
                            ?.short
                    )
                    ===
                    "finished"
                );

            }
        ).length;


    if(
        $("liveCount")
    )
        $("liveCount")
            .textContent =
            live;


    if(
        $("upcomingCount")
    )
        $("upcomingCount")
            .textContent =
            upcoming;


    if(
        $("finishedCount")
    )
        $("finishedCount")
            .textContent =
            finished;


    if(
        $("todayMatchesCount")
    )
        $("todayMatchesCount")
            .textContent =
            matches.length;

}


/* =========================================================
   LOAD FOOTBALL
========================================================= */

async function loadFootball(
    options = {}
){

    const silent =
        Boolean(
            options.silent
        );


    if(
        isLoading
    )
        return;


    isLoading =
        true;


    const button =
        $("refreshBtn");


    const topButton =
        $("topRefresh");


    if(button){

        button.disabled =
            true;

        button.textContent =
            "⏳";

    }


    if(topButton){

        topButton.disabled =
            true;

    }


    if(!silent){

        renderSkeletons(
            5
        );

    }


    apiStatus(
        "🟡 جاري جلب مباريات " +
        getDateLabel() +
        "...",
        "loading"
    );


    selectedDate =
        getSudanDate(
            selectedOffset
        );


    if(
        $("selectedDateLabel")
    ){

        $("selectedDateLabel")
            .textContent =

            getDateLabel()
            +
            " • "
            +
            formatDate(
                selectedDate
            );

    }


    try{

        /*
          طلب واحد فقط.
        */

        const url =
            API_BASE +
            "/fixtures?date=" +
            selectedDate +
            "&timezone=Africa/Khartoum";


        const data =
            await apiFetch(
                url
            );


        matches =
            Array.isArray(
                data.response
            )
            ?
            data.response
            :
            [];


        matches.sort(
            function(a,b){

                return (

                    new Date(
                        a.fixture.date
                    )

                    -

                    new Date(
                        b.fixture.date
                    )

                );

            }
        );


        updateDashboardStats();

        renderMatches();

        renderResults();


        apiStatus(

            "🟢 متصل — " +
            matches.length +
            " مباراة في " +
            getDateLabel(),

            "success"

        );


        if(
            $("lastUpdate")
        ){

            $("lastUpdate")
                .textContent =
                new Intl.DateTimeFormat(
                    "ar-SD",
                    {

                        timeZone:
                            "Africa/Khartoum",

                        hour:
                            "2-digit",

                        minute:
                            "2-digit"

                    }

                ).format(
                    new Date()
                );

        }


        if(!silent){

            showToast(
                "تم تحديث المباريات ⚽"
            );

        }

    }

    catch(error){

        console.error(
            error
        );


        apiStatus(
            "🔴 تعذر الاتصال بخدمة النتائج",
            "error"
        );


        const box =
            $("matchesBox");


        if(box){

            box.innerHTML = `

                <div
                    class="
                        error-box
                        glass
                    "
                >

                    <div
                        class="error-icon"
                    >
                        ⚠️
                    </div>


                    <strong>
                        لم يتم تحميل المباريات
                    </strong>


                    <small>
                        تأكد من الإنترنت
                        وصلاحية مفتاح API
                        ثم حاول مرة أخرى.
                    </small>


                    <button
                        class="retry-btn"
                        onclick="loadFootball()"
                    >
                        إعادة المحاولة
                    </button>

                </div>

            `;

        }

    }


    finally{

        isLoading =
            false;


        if(button){

            button.disabled =
                false;

            button.textContent =
                "↻";

        }


        if(topButton){

            topButton.disabled =
                false;

        }

    }

}


/* =========================================================
   FILTER
========================================================= */

function filterMatches(){

    let list =
        [
            ...matches
        ];


    if(
        currentFilter !==
        "all"
    ){

        if(
            currentFilter ===
            "favorite"
        ){

            list =
                list.filter(
                    function(match){

                        return favorites.has(
                            String(
                                match.fixture?.id
                            )
                        );

                    }
                );

        }

        else{

            list =
                list.filter(
                    function(match){

                        return (

                            matchType(
                                match.fixture
                                    ?.status
                                    ?.short
                            )

                            ===

                            currentFilter

                        );

                    }
                );

        }

    }


    const search =
        (
            $("search")
            ?.value
            ||
            ""
        )

        .trim()
        .toLowerCase();


    if(search){

        list =
            list.filter(
                function(match){

                    const home =
                        (
                            match.teams
                                ?.home
                                ?.name
                            ||
                            ""
                        )
                        .toLowerCase();


                    const away =
                        (
                            match.teams
                                ?.away
                                ?.name
                            ||
                            ""
                        )
                        .toLowerCase();


                    const league =
                        (
                            match.league
                                ?.name
                            ||
                            ""
                        )
                        .toLowerCase();


                    return (

                        home.includes(
                            search
                        )

                        ||

                        away.includes(
                            search
                        )

                        ||

                        league.includes(
                            search
                        )

                    );

                }
            );

    }


    return list;

}


/* =========================================================
   RENDER MATCHES
========================================================= */

function renderMatches(){

    const box =
        $("matchesBox");


    if(!box)
        return;


    const list =
        filterMatches();


    if(!list.length){

        box.innerHTML = `

            <div
                class="
                    empty-state
                    glass
                "
            >

                <div>
                    ⚽
                </div>


                <strong>
                    لا توجد مباريات هنا
                </strong>


                <small>
                    جرّب تغيير القسم
                    أو البحث عن فريق آخر.
                </small>

            </div>

        `;

        return;

    }


    box.innerHTML =
        list
            .map(
                createMatch
            )
            .join("");

}


/* =========================================================
   CREATE MATCH
========================================================= */

function createMatch(
    match
){

    const fixture =
        match.fixture
        ||
        {};


    const home =
        match.teams
            ?.home
        ||
        {};


    const away =
        match.teams
            ?.away
        ||
        {};


    const goals =
        match.goals
        ||
        {};


    const status =
        fixture.status
            ?.short
        ||
        "";


    const type =
        matchType(
            status
        );


    const favorite =
        favorites.has(
            String(
                fixture.id
            )
        );


    const homeScore =
        goals.home == null
        ?
        "-"
        :
        goals.home;


    const awayScore =
        goals.away == null
        ?
        "-"
        :
        goals.away;


    const homeLogo =
        home.logo

        ?

        `
            <img
                src="${home.logo}"
                alt=""
                loading="lazy"
            >
        `

        :

        `
            <div
                class="club-placeholder"
            >
                ⚽
            </div>
        `;


    const awayLogo =
        away.logo

        ?

        `
            <img
                src="${away.logo}"
                alt=""
                loading="lazy"
            >
        `

        :

        `
            <div
                class="club-placeholder"
            >
                ⚽
            </div>
        `;


    return `

        <article
            class="match-card"
            data-match-id="${fixture.id}"
        >


            <button
                class="
                    favorite-btn
                    ${favorite ? "active" : ""}
                "
                data-favorite="${fixture.id}"
                aria-label="المفضلة"
            >

                ${
                    favorite
                    ?
                    "★"
                    :
                    "☆"
                }

            </button>


            <div class="match-top">

                <span
                    class="competition"
                >

                    <i></i>

                    ${escapeHtml(
                        match.league
                            ?.name
                        ||
                        "كرة القدم"
                    )}

                </span>


                <span>

                    ${formatTime(
                        fixture.date
                    )}

                </span>

            </div>


            <div
                class="match-teams"
            >


                <div
                    class="
                        club
                        right
                    "
                >

                    ${homeLogo}


                    <strong>

                        ${escapeHtml(
                            home.name
                            ||
                            "الفريق الأول"
                        )}

                    </strong>

                </div>



                <div
                    class="score-area"
                >

                    <div
                        class="score"
                    >

                        ${
                            homeScore
                        }

                        <span>
                            -
                        </span>

                        ${
                            awayScore
                        }

                    </div>


                    <span
                        class="
                            status
                            ${
                                type === "live"
                                ?
                                "live"
                                :
                                type === "finished"
                                ?
                                "finished"
                                :
                                ""
                            }
                        "
                    >

                        ${
                            arabicStatus(
                                status,
                                fixture
                                    .status
                                    ?.elapsed
                            )
                        }

                    </span>

                </div>



                <div
                    class="
                        club
                        left
                    "
                >

                    ${awayLogo}


                    <strong>

                        ${escapeHtml(
                            away.name
                            ||
                            "الفريق الثاني"
                        )}

                    </strong>

                </div>


            </div>


            <div
                class="match-bottom"
            >

                <span>

                    ${escapeHtml(
                        match.league
                            ?.round
                        ||
                        "مباراة كرة قدم"
                    )}

                </span>


                <span>

                    ${
                        type === "live"
                        ?
                        "متابعة مباشرة"
                        :
                        "اضغط للتفاصيل"
                    }

                </span>

            </div>


        </article>

    `;

}


/* =========================================================
   FILTER BUTTON
========================================================= */

function setFilter(
    filter,
    button
){

    currentFilter =
        filter;


    document
        .querySelectorAll(
            ".filter"
        )
        .forEach(
            function(btn){

                btn.classList.toggle(
                    "active",
                    btn === button
                );

            }
        );


    renderMatches();

}


/* =========================================================
   DATE BUTTON
========================================================= */

function setDate(
    offset,
    button
){

    selectedOffset =
        Number(
            offset
        );


    document
        .querySelectorAll(
            ".date-tab"
        )
        .forEach(
            function(btn){

                btn.classList.toggle(
                    "active",
                    btn === button
                );

            }
        );


    loadFootball();

}


/* =========================================================
   RESULTS
========================================================= */

function renderResults(){

    const box =
        $("resultsBox");


    if(!box)
        return;


    const results =
        matches.filter(
            function(match){

                return (

                    matchType(
                        match.fixture
                            ?.status
                            ?.short
                    )

                    ===

                    "finished"

                );

            }
        );


    if(!results.length){

        box.innerHTML = `

            <div
                class="
                    empty-state
                    glass
                "
            >

                <div>
                    🏆
                </div>


                <strong>
                    لا توجد نتائج مكتملة
                </strong>


                <small>
                    عند نهاية المباريات
                    ستظهر النتائج هنا.
                </small>

            </div>

        `;

        return;

    }


    box.innerHTML =
        results
            .map(
                createMatch
            )
            .join("");

}


/* =========================================================
   OPEN MATCH
========================================================= */

function openMatch(
    matchId
){

    const match =
        matches.find(
            function(item){

                return (

                    String(
                        item.fixture
                            ?.id
                    )

                    ===

                    String(
                        matchId
                    )

                );

            }
        );


    if(!match)
        return;


    const fixture =
        match.fixture
        ||
        {};


    const home =
        match.teams
            ?.home
        ||
        {};


    const away =
        match.teams
            ?.away
        ||
        {};


    const goals =
        match.goals
        ||
        {};


    const halfHome =
        match.score
            ?.halftime
            ?.home
        ??
        "-";


    const halfAway =
        match.score
            ?.halftime
            ?.away
        ??
        "-";


    const homeScore =
        goals.home == null
        ?
        "-"
        :
        goals.home;


    const awayScore =
        goals.away == null
        ?
        "-"
        :
        goals.away;


    const type =
        matchType(
            fixture.status
                ?.short
        );


    const modal =
        $("matchModal");


    const content =
        $("modalContent");


    if(
        !modal ||
        !content
    )
        return;


    content.innerHTML = `

        <div
            class="modal-kicker"
        >

            ${escapeHtml(
                match.league
                    ?.name
                ||
                "كرة القدم"
            )}

        </div>


        <div
            class="modal-title"
        >

            ${escapeHtml(
                match.league
                    ?.round
                ||
                "تفاصيل المباراة"
            )}

        </div>


        <div
            class="modal-teams"
        >


            <div
                class="modal-club"
            >

                ${
                    home.logo

                    ?

                    `
                        <img
                            src="${home.logo}"
                            alt=""
                        >
                    `

                    :

                    `
                        <div
                            class="modal-placeholder"
                        >
                            ⚽
                        </div>
                    `
                }


                <strong>

                    ${escapeHtml(
                        home.name
                        ||
                        "الفريق الأول"
                    )}

                </strong>

            </div>



            <div
                class="modal-score"
            >

                <strong>

                    ${
                        homeScore
                    }

                    <span>
                        -
                    </span>

                    ${
                        awayScore
                    }

                </strong>


                <small
                    class="
                        status
                        ${
                            type === "live"
                            ?
                            "live"
                            :
                            type === "finished"
                            ?
                            "finished"
                            :
                            ""
                        }
                    "
                >

                    ${
                        arabicStatus(
                            fixture.status
                                ?.short,
                            fixture.status
                                ?.elapsed
                        )
                    }

                </small>

            </div>



            <div
                class="modal-club"
            >

                ${
                    away.logo

                    ?

                    `
                        <img
                            src="${away.logo}"
                            alt=""
                        >
                    `

                    :

                    `
                        <div
                            class="modal-placeholder"
                        >
                            ⚽
                        </div>
                    `
                }


                <strong>

                    ${escapeHtml(
                        away.name
                        ||
                        "الفريق الثاني"
                    )}

                </strong>

            </div>


        </div>



        <div
            class="detail-grid"
        >


            <div>

                <span>
                    الوقت
                </span>

                <b>
                    ${formatTime(
                        fixture.date
                    )}
                </b>

            </div>


            <div>

                <span>
                    التاريخ
                </span>

                <b>
                    ${formatDate(
                        selectedDate
                    )}
                </b>

            </div>


            <div>

                <span>
                    الشوط الأول
                </span>

                <b>

                    ${halfHome}
                    -
                    ${halfAway}

                </b>

            </div>


            <div>

                <span>
                    الملعب
                </span>

                <b>

                    ${escapeHtml(
                        fixture.venue
                            ?.name
                        ||
                        "غير متوفر"
                    )}

                </b>

            </div>


            <div>

                <span>
                    المدينة
                </span>

                <b>

                    ${escapeHtml(
                        fixture.venue
                            ?.city
                        ||
                        "غير متوفر"
                    )}

                </b>

            </div>


            <div>

                <span>
                    الحكم
                </span>

                <b>

                    ${escapeHtml(
                        fixture.referee
                        ||
                        "غير متوفر"
                    )}

                </b>

            </div>


        </div>

    `;


    modal.classList.add(
        "show"
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal(){

    $("matchModal")
        ?.classList.remove(
            "show"
        );

}


/* =========================================================
   NAVIGATION
========================================================= */

function openPage(
    pageId,
    navButton = null
){

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            function(page){

                page.classList.remove(
                    "active"
                );

            }
        );


    const page =
        $(pageId);


    if(!page)
        return;


    page.classList.add(
        "active"
    );


    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            function(item){

                item.classList.remove(
                    "active"
                );

            }
        );


    if(navButton){

        navButton.classList.add(
            "active"
        );

    }

    else{

        const nav =
            document.querySelector(
                `.nav-item[data-page="${pageId}"]`
            );


        if(nav){

            nav.classList.add(
                "active"
            );

        }

    }


    window.scrollTo(
        {
            top:0,
            behavior:"smooth"
        }
    );


    if(
        pageId ===
        "matches"
    ){

        renderMatches();

    }


    if(
        pageId ===
        "results"
    ){

        renderResults();

    }

}


/* =========================================================
   DEVELOPER MESSAGE
========================================================= */

async function sendDeveloperMessage(){

    const textarea =
        $("developerMessage");


    if(!textarea)
        return;


    const text =
        textarea.value
            .trim();


    if(!text){

        showToast(
            "اكتب رسالتك أولاً ✍️"
        );

        textarea.focus();

        return;

    }


    try{

        if(
            navigator.clipboard
        ){

            await navigator.clipboard
                .writeText(
                    text
                );

            showToast(
                "تم نسخ الرسالة ✅ افتح محادثة المطور وأرسلها"
            );

        }

        else{

            showToast(
                "تم تجهيز الرسالة، افتح المطور وأرسلها"
            );

        }

    }

    catch(error){

        showToast(
            "تم تجهيز الرسالة، افتح المطور"
        );

    }


    localStorage.setItem(
        "wd_faisal_message",
        text
    );


    setTimeout(
        function(){

            window.open(
                "https://t.me/mohmmedfysal",
                "_blank"
            );

        },
        600
    );

}


/* =========================================================
   SETTINGS
========================================================= */

function applySettings(){

    document.body.classList.toggle(
        "no-animations",
        !settings.animations
    );


    const auto =
        $("autoRefreshToggle");


    const anim =
        $("animationsToggle");


    if(auto)
        auto.checked =
            settings.autoRefresh;


    if(anim)
        anim.checked =
            settings.animations;


    clearInterval(
        refreshTimer
    );


    if(
        settings.autoRefresh
    ){

        refreshTimer =
            setInterval(
                function(){

                    if(
                        document.visibilityState
                        ===
                        "visible"
                    ){

                        loadFootball(
                            {
                                silent:true
                            }
                        );

                    }

                },

                10 *
                60 *
                1000

            );

    }

}


/* =========================================================
   SETTING TOGGLE
========================================================= */

function toggleSetting(
    name,
    value
){

    settings[name] =
        value;


    if(
        name ===
        "autoRefresh"
    ){

        localStorage.setItem(
            "wd_faisal_auto",
            String(value)
        );

    }


    if(
        name ===
        "animations"
    ){

        localStorage.setItem(
            "wd_faisal_anim",
            String(value)
        );

    }


    applySettings();


    showToast(
        value
        ?
        "تم تفعيل الإعداد ✅"
        :
        "تم إيقاف الإعداد"
    );

}


/* =========================================================
   TOUCH PULL REFRESH
========================================================= */

function startPullRefresh(){

    let startY =
        0;

    let pulled =
        false;


    document.addEventListener(
        "touchstart",
        function(event){

            if(
                window.scrollY ===
                0
            ){

                startY =
                    event.touches[0]
                        .clientY;

            }

        },
        {
            passive:true
        }
    );


    document.addEventListener(
        "touchmove",
        function(event){

            if(!startY)
                return;


            const delta =
                event.touches[0]
                    .clientY
                -
                startY;


            if(
                delta > 85
            ){

                pulled =
                    true;

            }

        },
        {
            passive:true
        }
    );


    document.addEventListener(
        "touchend",
        function(){

            if(pulled){

                showToast(
                    "جاري التحديث... 🔄"
                );

                loadFootball();

            }


            startY =
                0;

            pulled =
                false;

        }
    );

}


/* =========================================================
   SPLASH
========================================================= */

function startSplash(){

    let count =
        3;


    let progress =
        0;


    const counter =
        $("counter");


    const progressBar =
        $("splashProgress");


    const splash =
        $("splash");


    const timer =
        setInterval(
            function(){

                count--;

                progress +=
                    33.33;


                if(
                    counter
                ){

                    counter.textContent =

                        count > 0

                        ?

                        "جاري التجهيز... " +
                        count

                        :

                        "مرحباً بك 👋";

                }


                if(
                    progressBar
                ){

                    progressBar.style.width =
                        Math.min(
                            progress,
                            100
                        ) +
                        "%";

                }


                if(
                    count <= 0
                ){

                    clearInterval(
                        timer
                    );


                    setTimeout(
                        function(){

                            splash?.classList.add(
                                "hide"
                            );

                        },
                        550
                    );

                }

            },

            700
        );

}


/* =========================================================
   DOCUMENT EVENTS
========================================================= */

document.addEventListener(
    "click",
    function(event){


        /* المفضلة */

        const favorite =
            event.target.closest(
                "[data-favorite]"
            );


        if(
            favorite
        ){

            event.stopPropagation();


            toggleFavorite(
                favorite.dataset.favorite
            );


            return;

        }


        /* المباراة */

        const matchCard =
            event.target.closest(
                "[data-match-id]"
            );


        if(
            matchCard
        ){

            openMatch(
                matchCard.dataset.matchId
            );

        }


        /* إغلاق */

        if(
            event.target.closest(
                "[data-close-modal]"
            )
        ){

            closeModal();

        }

    }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    function(event){

        if(
            event.key ===
            "Escape"
        ){

            closeModal();

        }

    }
);


/* =========================================================
   START
========================================================= */

window.addEventListener(
    "load",
    function(){


        startSplash();


        applySettings();


        startPullRefresh();


        const savedMessage =
            localStorage.getItem(
                "wd_faisal_message"
            );


        if(
            savedMessage &&
            $("developerMessage")
        ){

            $("developerMessage")
                .value =
                savedMessage;

        }


        if(
            $("developerMessage")
        ){

            $("developerMessage")
                .addEventListener(
                    "input",
                    function(event){

                        localStorage.setItem(
                            "wd_faisal_message",
                            event.target.value
                        );

                    }
                );

        }


        setTimeout(
            function(){

                loadFootball();

            },
            1200
        );

    }
);
