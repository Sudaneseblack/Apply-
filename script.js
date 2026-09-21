/* ======================================================
   ود فيصل
   Main Application Script
====================================================== */

"use strict";


/* ======================================================
   CONFIG
====================================================== */

const APP_VERSION = "1.0.0";

const CHANNEL_URL =
    "https://t.me/alrufaaey1";

const DEVELOPER_USERNAME =
    "@mohmmedfysal";

const DEVELOPER_URL =
    "https://t.me/mohmmedfysal";


/* ======================================================
   DOM
====================================================== */

const splashScreen =
    document.getElementById("splashScreen");

const loginScreen =
    document.getElementById("loginScreen");

const mainApp =
    document.getElementById("mainApp");

const enterButton =
    document.getElementById("enterButton");

const loadingBar =
    document.getElementById("loadingBar");

const loadingPercent =
    document.getElementById("loadingPercent");

const loadingText =
    document.getElementById("loadingText");

const notificationButton =
    document.getElementById("notificationButton");

const notificationPanel =
    document.getElementById("notificationPanel");

const closeNotification =
    document.getElementById("closeNotification");

const notificationBadge =
    document.getElementById("notificationBadge");

const aboutModal =
    document.getElementById("aboutModal");

const developerModal =
    document.getElementById("developerModal");

const messageModal =
    document.getElementById("messageModal");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");

const toastIcon =
    document.getElementById("toastIcon");

const messageInput =
    document.getElementById("messageInput");

const messageCount =
    document.getElementById("messageCount");

const sendMessageButton =
    document.getElementById("sendMessageButton");

const developerTelegramButton =
    document.getElementById(
        "developerTelegramButton"
    );

const developerCopyButton =
    document.getElementById(
        "developerCopyButton"
    );

const copyDeveloperButton =
    document.getElementById(
        "copyDeveloperButton"
    );

const shareButton =
    document.getElementById(
        "shareButton"
    );

const updateButton =
    document.getElementById(
        "updateButton"
    );

const aboutSettingsButton =
    document.getElementById(
        "aboutSettingsButton"
    );

const notificationToggle =
    document.getElementById(
        "notificationToggle"
    );

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

const themeText =
    document.getElementById(
        "themeText"
    );


/* ======================================================
   STATE
====================================================== */

let toastTimer = null;

let splashFinished = false;

let currentPage = "homePage";

let notificationEnabled = true;


/* ======================================================
   HAPTIC
====================================================== */

function vibrate(
    duration = 10
) {

    try {

        if (
            "vibrate" in navigator
        ) {

            navigator.vibrate(
                duration
            );
        }

    } catch (error) {
        // Ignore vibration errors.
    }
}


/* ======================================================
   OPEN EXTERNAL
====================================================== */

function openExternal(
    url
) {

    vibrate(12);

    try {

        window.open(
            url,
            "_blank"
        );

    } catch (error) {

        window.location.href = url;
    }
}


/* ======================================================
   TOAST
====================================================== */

function showToast(
    message,
    type = "success"
) {

    if (!toast) {
        return;
    }


    clearTimeout(toastTimer);


    if (type === "success") {

        toastIcon.textContent = "✓";

        toastIcon.style.color =
            "#43dc94";

        toastIcon.style.background =
            "rgba(40,216,137,.12)";

    } else if (type === "info") {

        toastIcon.textContent = "i";

        toastIcon.style.color =
            "#45aaff";

        toastIcon.style.background =
            "rgba(22,140,255,.12)";

    } else {

        toastIcon.textContent = "!";

        toastIcon.style.color =
            "#ff6b7c";

        toastIcon.style.background =
            "rgba(255,94,114,.12)";
    }


    toastMessage.textContent =
        message;


    toast.classList.add("show");


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* ======================================================
   SPLASH
====================================================== */

function startSplash() {

    let progress = 0;


    const messages = [
        "جاري تجهيز التطبيق",
        "جاري تحميل الواجهة",
        "جاري تجهيز الخدمات",
        "تقريباً انتهينا",
        "أهلاً بك"
    ];


    const interval =
        setInterval(() => {

            progress +=
                Math.floor(
                    Math.random() * 4
                ) + 2;


            if (progress > 100) {
                progress = 100;
            }


            loadingBar.style.width =
                `${progress}%`;


            loadingPercent.textContent =
                `${progress}%`;


            const index =
                Math.min(
                    messages.length - 1,
                    Math.floor(
                        progress / 21
                    )
                );


            loadingText.textContent =
                messages[index];


            if (progress >= 100) {

                clearInterval(interval);


                setTimeout(
                    finishSplash,
                    450
                );
            }

        }, 75);
}


/* ======================================================
   FINISH SPLASH
====================================================== */

function finishSplash() {

    if (splashFinished) {
        return;
    }

    splashFinished = true;


    splashScreen.classList.remove(
        "active"
    );


    setTimeout(() => {

        loginScreen.classList.add(
            "active"
        );

    }, 250);
}


/* ======================================================
   ENTER APP
====================================================== */

function enterApp() {

    vibrate(18);


    loginScreen.classList.remove(
        "active"
    );


    setTimeout(() => {

        mainApp.classList.add(
            "visible"
        );


        navigateTo(
            "homePage"
        );


    }, 280);
}


/* ======================================================
   NAVIGATION
====================================================== */

function navigateTo(
    pageId
) {

    const pages =
        document.querySelectorAll(
            ".page"
        );

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    pages.forEach(
        page => {

            page.classList.remove(
                "active-page"
            );

        }
    );


    const target =
        document.getElementById(
            pageId
        );


    if (!target) {
        return;
    }


    target.classList.add(
        "active-page"
    );


    navItems.forEach(
        item => {

            item.classList.toggle(
                "active",
                item.dataset.page === pageId
            );

        }
    );


    currentPage = pageId;


    const content =
        document.querySelector(
            ".content-area"
        );


    if (content) {

        content.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }


    vibrate(8);
}


/* ======================================================
   NAVIGATION BUTTONS
====================================================== */

document
    .querySelectorAll(".nav-item")
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                navigateTo(
                    item.dataset.page
                );
            }
        );

    });


/* ======================================================
   SERVICE ACTIONS
====================================================== */

document
    .querySelectorAll(
        "[data-action]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                handleAction(action);
            }
        );

    });


/* ======================================================
   ACTION HANDLER
====================================================== */

function handleAction(
    action
) {

    vibrate(12);


    switch (action) {

        case "channel":

            openExternal(
                CHANNEL_URL
            );

            break;


        case "developer":

            openModal(
                developerModal
            );

            break;


        case "message":

            openModal(
                messageModal
            );

            setTimeout(
                () => {

                    if (messageInput) {

                        messageInput.focus();

                    }

                },
                250
            );

            break;


        case "about":

            openModal(
                aboutModal
            );

            break;


        default:
            break;
    }
}


/* ======================================================
   MODALS
====================================================== */

function openModal(
    modal
) {

    if (!modal) {
        return;
    }


    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";


    vibrate(10);
}


function closeModal(
    modal
) {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";
}


/* ======================================================
   CLOSE MODALS
====================================================== */

document
    .querySelectorAll(
        "[data-close-modal]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modal =
                    button.closest(
                        ".modal-overlay"
                    );

                closeModal(modal);
            }
        );

    });


/* ======================================================
   CLICK OUTSIDE MODAL
====================================================== */

document
    .querySelectorAll(
        ".modal-overlay"
    )
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeModal(
                        modal
                    );
                }
            }
        );

    });


/* ======================================================
   DEVELOPER
====================================================== */

if (developerTelegramButton) {

    developerTelegramButton.addEventListener(
        "click",
        () => {

            openExternal(
                DEVELOPER_URL
            );

        }
    );
}


if (developerCopyButton) {

    developerCopyButton.addEventListener(
        "click",
        async () => {

            await copyText(
                DEVELOPER_USERNAME
            );

            showToast(
                "تم نسخ معرف المطور"
            );
        }
    );
}


/* ======================================================
   COPY DEVELOPER
====================================================== */

if (copyDeveloperButton) {

    copyDeveloperButton.addEventListener(
        "click",
        async () => {

            await copyText(
                DEVELOPER_USERNAME
            );

            showToast(
                "تم نسخ معرف المطور"
            );

        }
    );
}


/* ======================================================
   COPY FUNCTION
====================================================== */

async function copyText(
    text
) {

    try {

        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {

            await navigator.clipboard.writeText(
                text
            );

            return true;
        }

    } catch (error) {
        // Continue to fallback.
    }


    try {

        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.style.position =
            "fixed";

        textarea.style.opacity =
            "0";


        document.body.appendChild(
            textarea
        );


        textarea.focus();

        textarea.select();


        document.execCommand(
            "copy"
        );


        textarea.remove();


        return true;

    } catch (error) {

        return false;
    }
}


/* ======================================================
   MESSAGE COUNTER
====================================================== */

if (messageInput) {

    messageInput.addEventListener(
        "input",
        () => {

            const length =
                messageInput.value.length;


            messageCount.textContent =
                length;

        }
    );
}


/* ======================================================
   SEND MESSAGE
====================================================== */

if (sendMessageButton) {

    sendMessageButton.addEventListener(
        "click",
        () => {

            const message =
                messageInput.value.trim();


            if (!message) {

                showToast(
                    "اكتب الرسالة أولاً",
                    "info"
                );

                messageInput.focus();

                return;
            }


            if (message.length > 500) {

                showToast(
                    "الرسالة طويلة جداً",
                    "error"
                );

                return;
            }


            vibrate(18);


            const url =
                DEVELOPER_URL +
                "?text=" +
                encodeURIComponent(
                    message
                );


            closeModal(
                messageModal
            );


            setTimeout(() => {

                openExternal(url);

            }, 180);

        }
    );
}


/* ======================================================
   NOTIFICATIONS
====================================================== */

if (notificationButton) {

    notificationButton.addEventListener(
        "click",
        () => {

            notificationPanel.classList.add(
                "show"
            );

            vibrate(10);

        }
    );
}


if (closeNotification) {

    closeNotification.addEventListener(
        "click",
        () => {

            closeNotifications();

        }
    );
}


function closeNotifications() {

    notificationPanel.classList.remove(
        "show"
    );
}


if (notificationPanel) {

    notificationPanel.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                notificationPanel
            ) {

                closeNotifications();

            }

        }
    );
}


/* ======================================================
   NOTIFICATION BADGE
====================================================== */

if (notificationPanel) {

    notificationPanel.addEventListener(
        "click",
        event => {

            const card =
                event.target.closest(
                    ".notification-card"
                );


            if (card) {

                notificationBadge.classList.add(
                    "hidden"
                );

                showToast(
                    "تمت قراءة الإشعار"
                );

            }

        }
    );
}


/* ======================================================
   NOTIFICATION SETTING
====================================================== */

if (notificationToggle) {

    notificationToggle.checked =
        localStorage.getItem(
            "notificationsEnabled"
        ) !== "false";


    notificationEnabled =
        notificationToggle.checked;


    notificationToggle.addEventListener(
        "change",
        () => {

            notificationEnabled =
                notificationToggle.checked;


            localStorage.setItem(
                "notificationsEnabled",
                notificationEnabled
            );


            if (
                notificationEnabled
            ) {

                showToast(
                    "تم تفعيل التنبيهات"
                );

            } else {

                showToast(
                    "تم إيقاف التنبيهات",
                    "info"
                );
            }

        }
    );
}


/* ======================================================
   THEME
====================================================== */

function applyTheme(
    theme
) {

    if (theme === "light") {

        document.body.classList.add(
            "light-theme"
        );


        if (themeText) {

            themeText.textContent =
                "الوضع الفاتح";
        }

    } else {

        document.body.classList.remove(
            "light-theme"
        );


        if (themeText) {

            themeText.textContent =
                "الوضع الداكن";
        }
    }


    localStorage.setItem(
        "appTheme",
        theme
    );
}


/* ======================================================
   LOAD THEME
====================================================== */

const savedTheme =
    localStorage.getItem(
        "appTheme"
    ) || "dark";


applyTheme(
    savedTheme
);


/* ======================================================
   THEME BUTTON
====================================================== */

if (themeToggle) {

    themeToggle.addEventListener(
        "click",
        () => {

            const isLight =
                document.body.classList.contains(
                    "light-theme"
                );


            applyTheme(
                isLight
                    ? "dark"
                    : "light"
            );


            showToast(
                isLight
                    ? "تم تفعيل الوضع الداكن"
                    : "تم تفعيل الوضع الفاتح"
            );

        }
    );
}


/* ======================================================
   SHARE
====================================================== */

if (shareButton) {

    shareButton.addEventListener(
        "click",
        async () => {

            vibrate(12);


            const shareData = {

                title:
                    "ود فيصل",

                text:
                    "تطبيق ود فيصل - تواصل معنا بسهولة",

                url:
                    CHANNEL_URL
            };


            try {

                if (
                    navigator.share
                ) {

                    await navigator.share(
                        shareData
                    );

                    return;
                }


                await copyText(
                    CHANNEL_URL
                );


                showToast(
                    "تم نسخ رابط القناة للمشاركة"
                );

            } catch (error) {

                if (
                    error &&
                    error.name ===
                    "AbortError"
                ) {

                    return;
                }


                showToast(
                    "تعذر فتح المشاركة",
                    "error"
                );
            }

        }
    );
}


/* ======================================================
   CHECK UPDATE
====================================================== */

if (updateButton) {

    updateButton.addEventListener(
        "click",
        () => {

            vibrate(10);


            showToast(
                `أنت تستخدم الإصدار ${APP_VERSION}`,
                "info"
            );

        }
    );
}


/* ======================================================
   ABOUT SETTINGS
====================================================== */

if (aboutSettingsButton) {

    aboutSettingsButton.addEventListener(
        "click",
        () => {

            openModal(
                aboutModal
            );

        }
    );
}


/* ======================================================
   RIPPLE EFFECT
====================================================== */

function createRipple(
    event
) {

    const button =
        event.currentTarget;


    if (
        !button ||
        button.disabled
    ) {
        return;
    }


    const rect =
        button.getBoundingClientRect();


    const size =
        Math.max(
            rect.width,
            rect.height
        );


    const ripple =
        document.createElement(
            "span"
        );


    ripple.className =
        "ripple";


    ripple.style.width =
        `${size}px`;

    ripple.style.height =
        `${size}px`;


    ripple.style.left =
        `${event.clientX - rect.left - size / 2}px`;

    ripple.style.top =
        `${event.clientY - rect.top - size / 2}px`;


    if (
        getComputedStyle(button).position ===
        "static"
    ) {

        button.style.position =
            "relative";
    }


    button.style.overflow =
        "hidden";


    button.appendChild(
        ripple
    );


    setTimeout(
        () => {

            ripple.remove();

        },
        600
    );
}


/* ======================================================
   ADD RIPPLE TO BUTTONS
====================================================== */

document
    .querySelectorAll(
        "button"
    )
    .forEach(button => {

        button.addEventListener(
            "pointerdown",
            createRipple
        );

    });


/* ======================================================
   PREVENT DOUBLE CLICK
====================================================== */

function protectButton(
    button,
    duration = 700
) {

    if (!button) {
        return false;
    }


    if (
        button.dataset.locked ===
        "true"
    ) {

        return true;
    }


    button.dataset.locked =
        "true";


    setTimeout(
        () => {

            button.dataset.locked =
                "false";

        },
        duration
    );


    return false;
}


/* ======================================================
   ENTER BUTTON
====================================================== */

if (enterButton) {

    enterButton.addEventListener(
        "click",
        () => {

            if (
                protectButton(
                    enterButton,
                    900
                )
            ) {
                return;
            }


            enterApp();

        }
    );
}


/* ======================================================
   KEYBOARD / BACK
====================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeModal(
                aboutModal
            );

            closeModal(
                developerModal
            );

            closeModal(
                messageModal
            );

            closeNotifications();

        }

    }
);


/* ======================================================
   HANDLE VISIBILITY
====================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.visibilityState ===
            "visible"
        ) {

            // Keep application responsive.
            document.body.classList.remove(
                "app-hidden"
            );

        } else {

            document.body.classList.add(
                "app-hidden"
            );
        }

    }
);


/* ======================================================
   INITIALIZE
====================================================== */

function initializeApp() {

    /*
       Restore notification state.
    */

    const savedNotifications =
        localStorage.getItem(
            "notificationsEnabled"
        );


    if (
        savedNotifications !== null &&
        notificationToggle
    ) {

        notificationToggle.checked =
            savedNotifications === "true";

    }


    /*
       Start splash.
    */

    startSplash();
}


/* ======================================================
   START
====================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}
