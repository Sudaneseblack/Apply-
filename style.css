/* =========================
   روابط التطبيق
========================= */

const CHANNEL_URL = "https://t.me/alrufaaey1";
const DEVELOPER_USERNAME = "mohmmedfysal";


/* =========================
   فتح القناة
========================= */

function openChannel() {
    window.location.href = CHANNEL_URL;
}


/* =========================
   فتح صفحة
========================= */

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageName);

    if (page) {
        page.classList.add("active");
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


/* =========================
   صفحة الرسالة الخاصة
========================= */

function openPrivate() {
    showPage("private");
}


/* =========================
   إرسال رسالة Telegram
========================= */

function sendTelegramMessage() {

    const message = document.getElementById("message").value.trim();

    let telegramUrl =
        "https://t.me/" +
        DEVELOPER_USERNAME;

    /*
      نحاول فتح Telegram مع الرسالة.
      إذا لم يدعم التطبيق الرسالة الجاهزة،
      ستفتح محادثة المطور بشكل طبيعي.
    */

    if (message.length > 0) {
        telegramUrl += "?text=" + encodeURIComponent(message);
    }

    window.location.href = telegramUrl;
}


/* =========================
   الشروحات
========================= */

function showTutorial(number) {

    const content =
        document.getElementById("tutorial-content");

    let title = "";
    let text = "";

    if (number === 1) {

        title = "📢 التعريف بالقناة";

        text = `
            <h3>${title}</h3>
            <p>
                مرحباً بك في القناة الرسمية.
                هنا يمكنك إضافة وصف القناة والخدمات
                والمعلومات التي تريد أن يعرفها الزوار.
            </p>
        `;

    } else if (number === 2) {

        title = "📚 طريقة الاستخدام";

        text = `
            <h3>${title}</h3>
            <p>
                يمكنك كتابة شرح كامل هنا عن طريقة
                استخدام خدمات القناة خطوة بخطوة.
            </p>
        `;

    } else if (number === 3) {

        title = "❓ الأسئلة الشائعة";

        text = `
            <h3>${title}</h3>

            <p>
                <strong>س: كيف أتواصل مع المطور؟</strong>
                <br>
                ج: استخدم زر "رسالة خاصة" من الصفحة الرئيسية.
            </p>

            <p>
                <strong>س: أين أجد القناة؟</strong>
                <br>
                ج: اضغط على زر "دخول إلى القناة".
            </p>
        `;
    }

    content.innerHTML = text;

    content.classList.add("show");

    content.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}