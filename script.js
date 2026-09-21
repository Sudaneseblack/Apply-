/* ======================================================
   RESET
====================================================== */

* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

html,
body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

body {
    direction: rtl;
    font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Arial,
        sans-serif;

    background: #050b18;
    color: #ffffff;

    overflow: hidden;

    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
}

button,
textarea,
input {
    font: inherit;
}

button {
    border: 0;
    outline: none;
    cursor: pointer;
}

button:focus-visible {
    outline: 2px solid #3da9ff;
    outline-offset: 3px;
}

textarea {
    outline: none;
}


/* ======================================================
   VARIABLES
====================================================== */

:root {

    --bg:
        #050b18;

    --bg-secondary:
        #091224;

    --card:
        rgba(15, 28, 49, 0.82);

    --card-solid:
        #0e1b30;

    --border:
        rgba(255, 255, 255, 0.08);

    --text:
        #ffffff;

    --text-soft:
        #a8b5c8;

    --text-muted:
        #6e7d92;

    --primary:
        #168cff;

    --primary-light:
        #42a6ff;

    --success:
        #28d889;

    --purple:
        #8b65ff;

    --orange:
        #ff9d42;

    --danger:
        #ff5e72;

    --radius:
        22px;

    --bottom-height:
        78px;
}


/* ======================================================
   LIGHT MODE
====================================================== */

body.light-theme {

    --bg:
        #f4f7fb;

    --bg-secondary:
        #ffffff;

    --card:
        rgba(255, 255, 255, 0.92);

    --card-solid:
        #ffffff;

    --border:
        rgba(10, 30, 60, 0.09);

    --text:
        #101a2a;

    --text-soft:
        #59677a;

    --text-muted:
        #8290a3;
}


/* ======================================================
   APP
====================================================== */

#app {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
}


/* ======================================================
   SCREEN
====================================================== */

.screen {
    position: fixed;
    inset: 0;

    width: 100%;
    height: 100%;

    opacity: 0;
    visibility: hidden;

    transition:
        opacity 0.45s ease,
        visibility 0.45s ease;

    z-index: 1;
}

.screen.active {
    opacity: 1;
    visibility: visible;
}


/* ======================================================
   SPLASH
====================================================== */

.splash-screen {
    background:
        radial-gradient(
            circle at 50% 35%,
            rgba(22, 140, 255, 0.17),
            transparent 32%
        ),
        radial-gradient(
            circle at 20% 80%,
            rgba(139, 101, 255, 0.12),
            transparent 30%
        ),
        #050b18;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;
}

.splash-content {
    width: min(88%, 380px);

    text-align: center;

    position: relative;
    z-index: 2;

    transform: translateY(0);
}

.splash-logo {
    margin: 0 auto 25px;
}

.logo-wrap {
    width: 112px;
    height: 112px;

    position: relative;

    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-ring {
    position: absolute;
    inset: 0;

    border-radius: 32px;

    border: 1px solid
        rgba(74, 169, 255, 0.35);

    box-shadow:
        0 0 0 10px rgba(22, 140, 255, 0.04),
        0 0 50px rgba(22, 140, 255, 0.18);

    animation:
        logoPulse 2.2s ease-in-out infinite;
}

.logo-box {
    width: 76px;
    height: 76px;

    border-radius: 24px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 42px;
    font-weight: 900;

    color: white;

    background:
        linear-gradient(
            145deg,
            #42a6ff,
            #126bd1
        );

    box-shadow:
        0 18px 35px rgba(0, 80, 190, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.35);

    animation:
        logoFloat 3s ease-in-out infinite;
}

.splash-title {
    margin: 0;

    font-size: 31px;
    font-weight: 900;

    letter-spacing: -1px;
}

.splash-subtitle {
    margin: 8px 0 35px;

    color: var(--text-soft);

    font-size: 14px;
}

.loading-area {
    width: 100%;
}

.loading-text {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 10px;

    color: var(--text-muted);

    font-size: 12px;
}

.loading-text strong {
    color: #43a7ff;
    font-size: 13px;
}

.loading-track {
    height: 5px;

    border-radius: 50px;

    background:
        rgba(255, 255, 255, 0.08);

    overflow: hidden;
}

.loading-bar {
    width: 0%;
    height: 100%;

    border-radius: inherit;

    background:
        linear-gradient(
            90deg,
            #126bd1,
            #42a6ff
        );

    box-shadow:
        0 0 15px rgba(42, 155, 255, 0.5);

    transition:
        width 0.15s linear;
}

.loading-dots {
    margin-top: 16px;

    display: flex;
    justify-content: center;
    gap: 6px;
}

.loading-dots span {
    width: 5px;
    height: 5px;

    border-radius: 50%;

    background: #3da3ff;

    animation:
        dotAnimation 1.2s infinite;
}

.loading-dots span:nth-child(2) {
    animation-delay: 0.15s;
}

.loading-dots span:nth-child(3) {
    animation-delay: 0.3s;
}

.splash-version {
    position: absolute;

    bottom:
        calc(25px + env(safe-area-inset-bottom));

    color:
        rgba(255, 255, 255, 0.35);

    font-size: 11px;
}


/* ======================================================
   LOGIN
====================================================== */

.login-screen {
    background:
        radial-gradient(
            circle at 50% 20%,
            rgba(22, 140, 255, 0.12),
            transparent 35%
        ),
        var(--bg);

    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.login-container {
    min-height: 100%;

    width: min(100%, 460px);

    margin: auto;

    padding:
        calc(55px + env(safe-area-inset-top))
        22px
        calc(25px + env(safe-area-inset-bottom));

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.login-logo {
    width: 94px;
    height: 94px;

    margin-bottom: 22px;
}

.login-logo .logo-box {
    width: 65px;
    height: 65px;

    font-size: 35px;

    border-radius: 21px;
}

.login-title-area {
    text-align: center;

    margin-bottom: 28px;
}

.login-title-area h1 {
    margin: 0;

    font-size: 30px;
    font-weight: 900;
}

.login-title-area p {
    margin:
        7px
        0
        4px;

    color: var(--text-soft);

    font-size: 16px;
}

.login-title-area small {
    color: var(--text-muted);

    font-size: 12px;
}

.login-card {
    width: 100%;

    padding: 23px 20px 20px;

    border:
        1px solid var(--border);

    border-radius: 25px;

    background:
        linear-gradient(
            145deg,
            rgba(20, 37, 63, 0.86),
            rgba(9, 19, 35, 0.9)
        );

    box-shadow:
        0 25px 60px rgba(0, 0, 0, 0.24);

    text-align: center;

    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
}

.light-theme .login-card {
    background:
        rgba(255, 255, 255, 0.92);

    box-shadow:
        0 20px 50px rgba(40, 70, 100, 0.12);
}

.welcome-icon {
    width: 50px;
    height: 50px;

    margin: 0 auto 14px;

    border-radius: 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #55aeff;

    background:
        rgba(22, 140, 255, 0.11);
}

.welcome-icon svg {
    width: 25px;
    height: 25px;
}

.login-card h2 {
    margin: 0;

    font-size: 20px;
}

.login-card p {
    margin:
        8px
        0
        20px;

    color: var(--text-soft);

    line-height: 1.8;

    font-size: 13px;
}

.login-card p strong {
    color: var(--text);
}

.primary-button {
    min-height: 52px;

    width: 100%;

    padding: 0 18px;

    border-radius: 16px;

    color: white;

    background:
        linear-gradient(
            135deg,
            #1994ff,
            #126bd1
        );

    box-shadow:
        0 10px 25px rgba(15, 120, 220, 0.23);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    font-size: 14px;
    font-weight: 800;

    transition:
        transform 0.18s ease,
        filter 0.18s ease,
        box-shadow 0.18s ease;
}

.primary-button svg {
    width: 19px;
    height: 19px;
}

.primary-button:active {
    transform: scale(0.97);
    filter: brightness(0.93);
}

.login-features {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 18px;

    margin-top: 22px;

    color: var(--text-muted);

    font-size: 11px;
}

.login-features div {
    display: flex;
    align-items: center;
    gap: 5px;
}

.login-features span {
    font-size: 14px;
}

.login-version {
    margin-top: 18px;

    color: var(--text-muted);

    font-size: 10px;
    direction: ltr;
}


/* ======================================================
   LOGIN BACKGROUND
====================================================== */

.login-background {
    position: absolute;
    inset: 0;

    overflow: hidden;

    pointer-events: none;
}

.login-background span {
    position: absolute;

    width: 180px;
    height: 180px;

    border-radius: 50%;

    background:
        rgba(22, 140, 255, 0.035);

    filter: blur(2px);

    animation:
        backgroundFloat 10s ease-in-out infinite;
}

.login-background span:nth-child(1) {
    top: 5%;
    right: -80px;
}

.login-background span:nth-child(2) {
    bottom: 5%;
    left: -100px;

    animation-delay: -2s;
}

.login-background span:nth-child(3) {
    top: 45%;
    left: 40%;

    width: 80px;
    height: 80px;

    animation-delay: -5s;
}

.login-background span:nth-child(4) {
    top: 20%;
    left: 10%;

    width: 45px;
    height: 45px;

    animation-delay: -7s;
}


/* ======================================================
   MAIN APP
====================================================== */

.main-app {
    position: fixed;
    inset: 0;

    display: none;

    background:
        radial-gradient(
            circle at 100% 0%,
            rgba(22, 140, 255, 0.09),
            transparent 28%
        ),
        var(--bg);

    color: var(--text);

    overflow: hidden;
}

.main-app.visible {
    display: flex;
    flex-direction: column;

    animation:
        appAppear 0.45s ease;
}


/* ======================================================
   TOP BAR
====================================================== */

.top-bar {
    flex: 0 0 auto;

    min-height:
        calc(72px + env(safe-area-inset-top));

    padding:
        calc(12px + env(safe-area-inset-top))
        18px
        10px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom:
        1px solid var(--border);

    background:
        rgba(5, 11, 24, 0.72);

    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    z-index: 20;
}

.light-theme .top-bar {
    background:
        rgba(244, 247, 251, 0.78);
}

.brand {
    display: flex;
    align-items: center;
    gap: 11px;
}

.mini-logo {
    width: 42px;
    height: 42px;

    border-radius: 13px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    font-size: 22px;
    font-weight: 900;

    background:
        linear-gradient(
            145deg,
            #42a6ff,
            #126bd1
        );

    box-shadow:
        0 8px 20px rgba(10, 110, 210, 0.2);
}

.brand-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.brand-text strong {
    font-size: 15px;
}

.brand-text span {
    color: var(--text-muted);

    font-size: 10px;
}

.icon-button {
    width: 43px;
    height: 43px;

    position: relative;

    border:
        1px solid var(--border);

    border-radius: 14px;

    color: var(--text-soft);

    background:
        rgba(255, 255, 255, 0.035);

    display: flex;
    align-items: center;
    justify-content: center;

    transition:
        transform 0.18s ease,
        background 0.18s ease;
}

.icon-button:active {
    transform: scale(0.92);
}

.icon-button svg {
    width: 21px;
    height: 21px;
}

.notification-badge {
    position: absolute;

    top: -3px;
    right: -3px;

    min-width: 17px;
    height: 17px;

    padding: 0 4px;

    border-radius: 50px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    background: #ff4f68;

    border: 2px solid var(--bg);

    font-size: 8px;
    font-weight: 800;
}

.notification-badge.hidden {
    display: none;
}


/* ======================================================
   CONTENT
====================================================== */

.content-area {
    flex: 1 1 auto;

    min-height: 0;

    overflow-y: auto;
    overflow-x: hidden;

    padding:
        18px
        18px
        calc(
            var(--bottom-height)
            + 25px
            + env(safe-area-inset-bottom)
        );

    -webkit-overflow-scrolling: touch;

    overscroll-behavior-y: contain;
}

.page {
    display: none;

    width: 100%;
    max-width: 620px;

    margin: 0 auto;
}

.page.active-page {
    display: block;

    animation:
        pageEnter 0.35s ease;
}


/* ======================================================
   HERO
====================================================== */

.hero-card {
    min-height: 172px;

    position: relative;

    overflow: hidden;

    padding: 24px;

    border:
        1px solid rgba(74, 169, 255, 0.13);

    border-radius: 26px;

    background:
        linear-gradient(
            135deg,
            #0d2b4e,
            #0a172b 75%
        );

    box-shadow:
        0 20px 50px rgba(0, 70, 150, 0.12);
}

.hero-content {
    position: relative;
    z-index: 2;
}

.hero-label {
    display: inline-flex;

    padding: 6px 10px;

    border-radius: 50px;

    color: #6dbbff;

    background:
        rgba(66, 166, 255, 0.09);

    font-size: 10px;
    font-weight: 700;
}

.hero-card h1 {
    margin:
        13px
        0
        7px;

    font-size: 25px;
    line-height: 1.25;
}

.hero-card p {
    margin: 0;

    max-width: 220px;

    color: #91a9c4;

    font-size: 12px;
    line-height: 1.7;
}

.hero-symbol {
    position: absolute;

    left: 25px;
    bottom: -10px;

    width: 110px;
    height: 110px;

    border-radius: 34px;

    display: flex;
    align-items: center;
    justify-content: center;

    color:
        rgba(255, 255, 255, 0.09);

    border:
        1px solid rgba(255, 255, 255, 0.06);

    font-size: 72px;
    font-weight: 900;

    transform: rotate(-10deg);
}

.hero-decoration {
    position: absolute;

    border-radius: 50%;

    pointer-events: none;
}

.hero-decoration.one {
    width: 180px;
    height: 180px;

    left: -70px;
    top: -100px;

    background:
        rgba(30, 143, 255, 0.09);
}

.hero-decoration.two {
    width: 130px;
    height: 130px;

    right: -60px;
    bottom: -80px;

    border:
        1px solid rgba(65, 165, 255, 0.13);
}


/* ======================================================
   SECTION TITLE
====================================================== */

.section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin:
        24px
        2px
        13px;
}

.section-title div {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.section-title span {
    font-size: 15px;
    font-weight: 800;
}

.section-title small {
    color: var(--text-muted);

    font-size: 10px;
}


/* ======================================================
   SERVICE GRID
====================================================== */

.service-grid {
    display: grid;

    grid-template-columns:
        repeat(2, minmax(0, 1fr));

    gap: 12px;
}

.service-card {
    min-height: 158px;

    position: relative;

    overflow: hidden;

    padding: 16px;

    border:
        1px solid var(--border);

    border-radius: 22px;

    background:
        var(--card);

    color: var(--text);

    text-align: right;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    box-shadow:
        0 12px 30px rgba(0, 0, 0, 0.08);

    transition:
        transform 0.18s ease,
        border-color 0.18s ease,
        background 0.18s ease;
}

.service-card::after {
    content: "";

    position: absolute;

    width: 80px;
    height: 80px;

    border-radius: 50%;

    left: -35px;
    bottom: -40px;

    background:
        rgba(255, 255, 255, 0.025);
}

.service-card:active {
    transform: scale(0.97);
}

.service-icon {
    width: 47px;
    height: 47px;

    border-radius: 15px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 17px;
}

.service-icon svg {
    width: 24px;
    height: 24px;
}

.blue-card .service-icon {
    color: #45aaff;
    background:
        rgba(22, 140, 255, 0.11);
}

.purple-card .service-icon {
    color: #a17fff;
    background:
        rgba(139, 101, 255, 0.11);
}

.green-card .service-icon {
    color: #39db92;
    background:
        rgba(40, 216, 137, 0.1);
}

.orange-card .service-icon {
    color: #ffae59;
    background:
        rgba(255, 157, 66, 0.1);
}

.service-info {
    display: flex;
    flex-direction: column;

    gap: 5px;

    min-width: 0;
}

.service-info strong {
    font-size: 14px;
}

.service-info span {
    color: var(--text-muted);

    font-size: 10px;

    line-height: 1.5;
}

.card-arrow {
    position: absolute;

    left: 13px;
    bottom: 14px;

    width: 23px;
    height: 23px;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--text-muted);

    background:
        rgba(255, 255, 255, 0.035);

    font-size: 20px;
}


/* ======================================================
   QUICK CARD
====================================================== */

.quick-card {
    margin-top: 14px;

    min-height: 64px;

    padding: 10px;

    border:
        1px solid var(--border);

    border-radius: 19px;

    background:
        rgba(255, 255, 255, 0.025);

    display: flex;
    align-items: center;
    justify-content: space-around;
}

.quick-item {
    display: flex;
    align-items: center;

    gap: 5px;

    color: var(--text-muted);

    font-size: 9px;
    white-space: nowrap;
}

.quick-icon {
    font-size: 13px;
}

.quick-line {
    width: 1px;
    height: 20px;

    background:
        var(--border);
}


/* ======================================================
   PAGE HEADING
====================================================== */

.page-heading {
    display: flex;
    align-items: center;

    gap: 13px;

    margin:
        4px
        0
        22px;
}

.heading-icon {
    width: 52px;
    height: 52px;

    border-radius: 17px;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
        rgba(22, 140, 255, 0.1);

    font-size: 23px;
}

.page-heading h1 {
    margin: 0 0 4px;

    font-size: 22px;
}

.page-heading p {
    margin: 0;

    color: var(--text-muted);

    font-size: 11px;
}


/* ======================================================
   CONTACT
====================================================== */

.contact-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.contact-item {
    width: 100%;

    min-height: 74px;

    padding: 11px 13px;

    display: flex;
    align-items: center;

    gap: 12px;

    text-align: right;

    border:
        1px solid var(--border);

    border-radius: 19px;

    background:
        var(--card);

    color: var(--text);

    transition:
        transform 0.18s ease,
        background 0.18s ease;
}

.contact-item:active {
    transform: scale(0.98);
}

.contact-icon {
    width: 47px;
    height: 47px;

    flex: 0 0 47px;

    border-radius: 15px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 21px;
}

.contact-icon.telegram {
    color: #49aaff;
    background:
        rgba(22, 140, 255, 0.1);
}

.contact-icon.person {
    background:
        rgba(139, 101, 255, 0.1);
}

.contact-icon.message {
    background:
        rgba(40, 216, 137, 0.1);
}

.contact-icon.copy {
    background:
        rgba(255, 157, 66, 0.1);
}

.contact-info {
    flex: 1;

    min-width: 0;

    display: flex;
    flex-direction: column;

    gap: 4px;
}

.contact-info strong {
    font-size: 13px;
}

.contact-info span {
    color: var(--text-muted);

    font-size: 10px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.contact-arrow {
    color: var(--text-muted);

    font-size: 21px;
}

.contact-note {
    margin-top: 16px;

    padding: 15px;

    border-radius: 18px;

    display: flex;
    align-items: center;
    gap: 10px;

    background:
        rgba(22, 140, 255, 0.05);

    border:
        1px solid rgba(22, 140, 255, 0.08);
}

.contact-note span {
    font-size: 17px;
}

.contact-note p {
    margin: 0;

    color: var(--text-muted);

    font-size: 10px;
    line-height: 1.7;
}


/* ======================================================
   SETTINGS
====================================================== */

.settings-group {
    margin-bottom: 22px;
}

.settings-title {
    margin:
        0
        4px
        9px;

    color: var(--text-muted);

    font-size: 10px;
    font-weight: 700;
}

.setting-row {
    width: 100%;

    min-height: 72px;

    padding: 10px 12px;

    display: flex;
    align-items: center;

    gap: 12px;

    border-bottom:
        1px solid var(--border);

    background:
        var(--card);

    color: var(--text);

    text-align: right;
}

.setting-row:first-of-type {
    border-radius: 18px 18px 0 0;
}

.setting-row:last-child {
    border-radius: 0 0 18px 18px;
    border-bottom: 0;
}

.setting-button {
    cursor: pointer;

    transition:
        background 0.18s ease;
}

.setting-button:active {
    background:
        rgba(255, 255, 255, 0.055);
}

.setting-icon {
    width: 43px;
    height: 43px;

    flex: 0 0 43px;

    border-radius: 14px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 18px;
}

.notification-setting {
    background:
        rgba(255, 157, 66, 0.1);
}

.theme-setting {
    background:
        rgba(139, 101, 255, 0.1);
}

.share-setting {
    background:
        rgba(22, 140, 255, 0.1);
}

.update-setting {
    background:
        rgba(40, 216, 137, 0.1);
}

.about-setting {
    background:
        rgba(255, 255, 255, 0.05);
}

.setting-info {
    flex: 1;

    min-width: 0;

    display: flex;
    flex-direction: column;

    gap: 4px;
}

.setting-info strong {
    font-size: 12px;
}

.setting-info span {
    color: var(--text-muted);

    font-size: 9px;
}

.setting-arrow {
    color: var(--text-muted);

    font-size: 20px;
}

.small-action {
    padding: 7px 12px;

    border-radius: 10px;

    color: #4aaaff;

    background:
        rgba(22, 140, 255, 0.09);

    font-size: 10px;
    font-weight: 700;
}


/* ======================================================
   SWITCH
====================================================== */

.switch {
    position: relative;

    width: 43px;
    height: 24px;

    flex: 0 0 43px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    inset: 0;

    cursor: pointer;

    border-radius: 50px;

    background:
        #26364e;

    transition:
        0.25s ease;
}

.slider::before {
    content: "";

    position: absolute;

    width: 18px;
    height: 18px;

    top: 3px;
    right: 3px;

    border-radius: 50%;

    background: white;

    transition:
        0.25s ease;

    box-shadow:
        0 2px 5px rgba(0, 0, 0, 0.2);
}

.switch input:checked + .slider {
    background:
        #168cff;
}

.switch input:checked + .slider::before {
    transform: translateX(-19px);
}


/* ======================================================
   SETTINGS FOOTER
====================================================== */

.settings-footer {
    padding:
        15px
        0
        20px;

    display: flex;
    flex-direction: column;
    align-items: center;

    color: var(--text-muted);

    text-align: center;
}

.footer-logo {
    width: 42px;
    height: 42px;

    margin-bottom: 8px;

    border-radius: 13px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    background:
        linear-gradient(
            145deg,
            #42a6ff,
            #126bd1
        );

    font-size: 21px;
    font-weight: 900;
}

.settings-footer strong {
    color: var(--text);

    font-size: 12px;
}

.settings-footer span {
    margin-top: 4px;

    font-size: 9px;
}

.settings-footer small {
    margin-top: 7px;

    font-size: 9px;
}


/* ======================================================
   BOTTOM NAV
====================================================== */

.bottom-nav {
    flex: 0 0 auto;

    height:
        calc(
            var(--bottom-height)
            + env(safe-area-inset-bottom)
        );

    padding:
        7px
        10px
        env(safe-area-inset-bottom);

    display: flex;
    align-items: flex-start;
    justify-content: space-around;

    border-top:
        1px solid var(--border);

    background:
        rgba(5, 11, 24, 0.92);

    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);

    z-index: 30;
}

.light-theme .bottom-nav {
    background:
        rgba(255, 255, 255, 0.93);
}

.nav-item {
    width: 32%;

    min-height: 56px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 4px;

    color: var(--text-muted);

    background: transparent;

    font-size: 9px;

    transition:
        color 0.2s ease,
        transform 0.18s ease;
}

.nav-item:active {
    transform: scale(0.92);
}

.nav-item.active {
    color: #45aaff;
}

.nav-icon {
    width: 30px;
    height: 28px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-icon svg {
    width: 21px;
    height: 21px;
}

.nav-item.active .nav-icon {
    border-radius: 11px;

    background:
        rgba(22, 140, 255, 0.1);
}


/* ======================================================
   OVERLAY
====================================================== */

.overlay,
.modal-overlay {
    position: fixed;
    inset: 0;

    z-index: 100;

    display: flex;
    align-items: flex-end;
    justify-content: center;

    padding:
        15px;

    background:
        rgba(0, 0, 0, 0.58);

    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);

    opacity: 0;
    visibility: hidden;

    transition:
        opacity 0.25s ease,
        visibility 0.25s ease;
}

.overlay.show,
.modal-overlay.show {
    opacity: 1;
    visibility: visible;
}


/* ======================================================
   NOTIFICATION SHEET
====================================================== */

.notification-sheet {
    width: min(100%, 500px);

    padding:
        8px
        17px
        calc(
            20px
            + env(safe-area-inset-bottom)
        );

    border-radius:
        25px
        25px
        0
        0;

    border:
        1px solid rgba(255, 255, 255, 0.08);

    background:
        #0b1628;

    transform:
        translateY(30px);

    transition:
        transform 0.3s ease;
}

.overlay.show .notification-sheet {
    transform:
        translateY(0);
}

.sheet-handle {
    width: 42px;
    height: 4px;

    margin:
        0
        auto
        17px;

    border-radius: 50px;

    background:
        rgba(255, 255, 255, 0.15);
}

.sheet-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 15px;
}

.sheet-header div {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.sheet-header strong {
    font-size: 17px;
}

.sheet-header span {
    color: var(--text-muted);

    font-size: 10px;
}

.close-button,
.modal-close {
    width: 35px;
    height: 35px;

    border-radius: 50%;

    color: var(--text-soft);

    background:
        rgba(255, 255, 255, 0.05);

    font-size: 22px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-card {
    padding: 12px;

    display: flex;
    align-items: flex-start;

    gap: 12px;

    border-radius: 18px;

    background:
        rgba(255, 255, 255, 0.035);

    border:
        1px solid rgba(255, 255, 255, 0.06);
}

.notification-image {
    width: 53px;
    height: 53px;

    flex: 0 0 53px;

    border-radius: 16px;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
        linear-gradient(
            145deg,
            #42a6ff,
            #126bd1
        );
}

.notification-image-logo {
    color: white;

    font-size: 27px;
    font-weight: 900;
}

.notification-content {
    flex: 1;
}

.notification-content strong {
    display: block;

    margin-bottom: 5px;

    font-size: 12px;
}

.notification-content p {
    margin: 0;

    color: var(--text-soft);

    font-size: 10px;
    line-height: 1.7;
}

.notification-content span {
    display: block;

    margin-top: 7px;

    color: #45aaff;

    font-size: 8px;
}


/* ======================================================
   MODAL
====================================================== */

.modal-overlay {
    align-items: center;
}

.modal-card {
    width: min(100%, 420px);

    position: relative;

    padding: 28px 20px 20px;

    border-radius: 26px;

    background:
        #0b1628;

    border:
        1px solid rgba(255, 255, 255, 0.08);

    box-shadow:
        0 30px 80px rgba(0, 0, 0, 0.45);

    text-align: center;

    transform:
        translateY(20px)
        scale(0.97);

    transition:
        transform 0.28s ease;
}

.light-theme .modal-card {
    background:
        #ffffff;
}

.modal-overlay.show .modal-card {
    transform:
        translateY(0)
        scale(1);
}

.modal-close {
    position: absolute;

    top: 12px;
    left: 12px;
}

.modal-logo {
    width: 65px;
    height: 65px;

    margin: 0 auto 13px;

    border-radius: 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: white;

    background:
        linear-gradient(
            145deg,
            #42a6ff,
            #126bd1
        );

    font-size: 34px;
    font-weight: 900;
}

.modal-card h2 {
    margin: 0;

    font-size: 20px;
}

.modal-card > p {
    margin:
        13px
        0
        17px;

    color: var(--text-soft);

    font-size: 11px;
    line-height: 1.9;
}

.modal-version {
    display: inline-block;

    margin-top: 6px;

    color: var(--text-muted);

    font-size: 9px;
}

.about-list {
    display: flex;
    flex-direction: column;

    gap: 8px;

    margin-bottom: 18px;
}

.about-list div {
    padding: 10px;

    border-radius: 13px;

    display: flex;
    align-items: center;

    gap: 8px;

    color: var(--text-soft);

    background:
        rgba(255, 255, 255, 0.035);

    text-align: right;

    font-size: 10px;
}

.about-list span {
    font-size: 14px;
}

.modal-button {
    min-height: 48px;
}


/* ======================================================
   DEVELOPER
====================================================== */

.developer-avatar,
.message-icon {
    width: 65px;
    height: 65px;

    margin: 0 auto 13px;

    border-radius: 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
        rgba(139, 101, 255, 0.1);

    font-size: 29px;
}

.developer-id {
    direction: ltr;

    color: #5bb1ff !important;

    font-weight: 700;
}

.developer-actions {
    display: flex;
    flex-direction: column;

    gap: 9px;
}

.secondary-button {
    min-height: 48px;

    width: 100%;

    border-radius: 15px;

    color: var(--text-soft);

    background:
        rgba(255, 255, 255, 0.055);

    font-size: 13px;
    font-weight: 700;
}


/* ======================================================
   MESSAGE
====================================================== */

.message-icon {
    background:
        rgba(40, 216, 137, 0.1);
}

.message-modal > p {
    margin-bottom: 13px;
}

#messageInput {
    width: 100%;

    min-height: 130px;

    resize: none;

    padding: 14px;

    border:
        1px solid rgba(255, 255, 255, 0.08);

    border-radius: 16px;

    background:
        rgba(255, 255, 255, 0.035);

    color: var(--text);

    font-size: 12px;
    line-height: 1.8;
}

#messageInput::placeholder {
    color: var(--text-muted);
}

.message-counter {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin:
        7px
        2px
        13px;

    color: var(--text-muted);

    font-size: 9px;
}

.message-counter strong {
    font-weight: 600;
}


/* ======================================================
   TOAST
====================================================== */

.toast {
    position: fixed;

    z-index: 300;

    left: 50%;

    bottom:
        calc(
            var(--bottom-height)
            + 20px
            + env(safe-area-inset-bottom)
        );

    transform:
        translate(-50%, 20px);

    min-height: 46px;

    max-width: calc(100% - 35px);

    padding:
        8px
        13px;

    border-radius: 15px;

    display: flex;
    align-items: center;

    gap: 8px;

    color: white;

    background:
        rgba(17, 31, 52, 0.96);

    border:
        1px solid rgba(255, 255, 255, 0.08);

    box-shadow:
        0 15px 40px rgba(0, 0, 0, 0.3);

    opacity: 0;
    visibility: hidden;

    transition:
        opacity 0.25s ease,
        transform 0.25s ease,
        visibility 0.25s ease;

    font-size: 11px;

    pointer-events: none;
}

.toast.show {
    opacity: 1;
    visibility: visible;

    transform:
        translate(-50%, 0);
}

.toast-icon {
    width: 25px;
    height: 25px;

    flex: 0 0 25px;

    border-radius: 9px;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
        rgba(40, 216, 137, 0.12);

    color: #43dc94;

    font-weight: 900;
}


/* ======================================================
   RIPPLE
====================================================== */

.ripple {
    position: absolute;

    border-radius: 50%;

    transform:
        scale(0);

    background:
        rgba(255, 255, 255, 0.16);

    pointer-events: none;

    animation:
        rippleEffect 0.55s linear;
}


/* ======================================================
   ANIMATIONS
====================================================== */

@keyframes logoPulse {

    0%,
    100% {
        transform: scale(1);
        opacity: 0.75;
    }

    50% {
        transform: scale(1.07);
        opacity: 1;
    }
}

@keyframes logoFloat {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

@keyframes dotAnimation {

    0%,
    100% {
        opacity: 0.25;
        transform: translateY(0);
    }

    50% {
        opacity: 1;
        transform: translateY(-3px);
    }
}

@keyframes backgroundFloat {

    0%,
    100% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(20px, -25px);
    }
}

@keyframes appAppear {

    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes pageEnter {

    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes rippleEffect {

    to {
        transform: scale(4);
        opacity: 0;
    }
}


/* ======================================================
   SMALL PHONES
====================================================== */

@media (max-height: 680px) {

    .login-container {
        justify-content: flex-start;

        padding-top:
            calc(
                30px
                + env(safe-area-inset-top)
            );
    }

    .login-logo {
        margin-bottom: 13px;
    }

    .login-title-area {
        margin-bottom: 16px;
    }

    .login-card {
        padding: 17px;
    }

    .hero-card {
        min-height: 150px;
    }

    .service-card {
        min-height: 145px;
    }
}


/* ======================================================
   VERY SMALL WIDTH
====================================================== */

@media (max-width: 350px) {

    .content-area {
        padding-left: 13px;
        padding-right: 13px;
    }

    .service-grid {
        gap: 8px;
    }

    .service-card {
        padding: 13px;
    }

    .service-icon {
        width: 43px;
        height: 43px;
    }

    .quick-card {
        gap: 2px;
    }

    .quick-item {
        font-size: 8px;
    }

}


/* ======================================================
   REDUCE MOTION
====================================================== */

@media (prefers-reduced-motion: reduce) {

    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

}
