// ===============================
// AMBIL ELEMEN HTML
// ===============================

const API_URL = "https://script.google.com/macros/s/AKfycbzxGY9MJef2If5Je1L6nW0EEdRCL72nEM7Vdy1EpzY8uLoCWB6rfzdiZiGvNIx2Rm8lyQ/exec";

// ===============================
// KONFIGURASI WEBSITE & AKSES
// ===============================

// Data website (dipakai baik oleh mode admin maupun mode client)
const WEBSITES = {
    laradeza:   { label: "Lara & Deza (24 Oktober 2026)",   baseUrl: "..." },
    dezalara:   { label: "Deza & Lara (01 November 2026)",  baseUrl: "..." },
    ekaarian:   { label: "Eka & Arian (04 September 2026)", baseUrl: "https://ekaarian-wedding.vercel.app/" },
    putrirama:  { label: "Putri & Rama (23 Agustus 2026)",  baseUrl: "https://putrirama-wedding.vercel.app/" },
    gitaabid:   { label: "Gita & Abid (11 September 2026)", baseUrl: "https://gitaabid1109-wedding.vercel.app/" },
    softred001: { label: "Sampel LDD SoftRed 001",          baseUrl: "https://ldd-softred001.vercel.app/" },
};

// Pemetaan slug link client (?client=...) ke id website di atas
const CLIENT_SLUGS = {
    "laradeza!241026":  "laradeza",
    "dezalara!011126":  "dezalara",
    "ekaarian!040926":  "ekaarian",
    "putrirama!230826": "putrirama",
    "gitaabid!110926": "gitaabid",
};

// Kunci rahasia untuk mode admin (?admin=...)
const ADMIN_KEY = "deza!211001";

// Menyimpan id website & mode saat ini, ditentukan sekali di awal
let currentMode = "invalid"; // "admin" | "client" | "invalid"
let lockedWebsiteId = null;

const generatorForm = document.getElementById("generatorForm");
const guestName = document.getElementById("guestName");
const websiteSelect = document.getElementById("websiteSelect");
const generateBtn = document.getElementById("generateBtn");
const resultUrl = document.getElementById("resultUrl");
const saveStatus = document.getElementById("saveStatus");
const copyBtn = document.getElementById("copyBtn");
const openBtn = document.getElementById("openBtn");
const resetBtn = document.getElementById("resetBtn");

const invalidState = document.getElementById("invalidState");
const appState = document.getElementById("appState");
const websiteFieldNormal = document.getElementById("websiteFieldNormal");
const websiteFieldLocked = document.getElementById("websiteFieldLocked");
const lockedWebsiteText = document.getElementById("lockedWebsiteText");

// Teks default saat belum ada URL yang digenerate
const DEFAULT_RESULT_TEXT = "Hasil url akan muncul disini";
const DEFAULT_COPY_TEXT = "Copy Link";

// ===============================
// TENTUKAN MODE SAAT HALAMAN DIBUKA
// ===============================

function initMode() {

    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get("admin");
    const clientParam = params.get("client");

    if (adminParam === ADMIN_KEY) {

        // Mode admin: dropdown lengkap seperti biasa
        currentMode = "admin";
        invalidState.style.display = "none";
        appState.style.display = "block";
        websiteFieldNormal.style.display = "block";
        websiteFieldLocked.style.display = "none";

    } else if (clientParam && CLIENT_SLUGS[clientParam]) {

        // Mode client: kunci ke satu website, sembunyikan dropdown
        currentMode = "client";
        lockedWebsiteId = CLIENT_SLUGS[clientParam];

        invalidState.style.display = "none";
        appState.style.display = "block";
        websiteFieldNormal.style.display = "none";
        websiteFieldLocked.style.display = "block";
        lockedWebsiteText.textContent = WEBSITES[lockedWebsiteId].label;

    } else {

        // Tidak ada param yang valid: tolak akses
        currentMode = "invalid";
        appState.style.display = "none";
        invalidState.style.display = "block";

    }

}

initMode();

// ===============================
// SAAT FORM DI-SUBMIT (Tombol Generate diklik ATAU Enter ditekan)
// ===============================

generatorForm.addEventListener("submit", function (e) {

    e.preventDefault();

    // Ambil nama tamu
    const name = guestName.value.trim();

    // Validasi nama terlebih dahulu (mengikuti urutan form dari atas ke bawah)
    if (name === "") {
        alert("Silakan masukkan nama tamu.");
        guestName.focus();
        return;
    }

    // Tentukan id website: dari dropdown (mode admin) atau terkunci (mode client)
    const websiteId = (currentMode === "client") ? lockedWebsiteId : websiteSelect.value;

    if (!websiteId) {
        alert("Silakan pilih website.");
        websiteSelect.focus();
        return;
    }

    // Tentukan URL dasar
    const website = WEBSITES[websiteId];

    if (!website) {
        alert("Website tidak ditemukan.");
        return;
    }

    const baseUrl = website.baseUrl;

    // Encode nama tamu
    const encodedName = encodeURIComponent(name);

    // Gabungkan URL
    const finalUrl = `${baseUrl}?to=${encodedName}`;

    // Tampilkan hasil URL segera
    resultUrl.textContent = finalUrl;

    // Nonaktifkan tombol generate selagi menyimpan data (cegah klik dobel)
    generateBtn.disabled = true;
    generateBtn.textContent = "Berhasil!";
    saveStatus.textContent = "";
    saveStatus.className = "save-status";

    fetch(API_URL, {

        method: "POST",

        body: JSON.stringify({

            nama: name,

            website: websiteId,

            url: finalUrl

        })

    })
    .finally(() => {

        generateBtn.disabled = false;
        generateBtn.textContent = "Generate";

    });

});

// ===============================
// SAAT TOMBOL COPY LINK DIKLIK
// ===============================

copyBtn.addEventListener("click", function () {

    const url = resultUrl.textContent.trim();

    if (url === DEFAULT_RESULT_TEXT) {
        alert("Silakan generate URL terlebih dahulu.");
        return;
    }

    navigator.clipboard.writeText(url).then(() => {

        copyBtn.textContent = "Tersalin!";

        setTimeout(() => {
            copyBtn.textContent = DEFAULT_COPY_TEXT;
        }, 1500);

    }).catch(() => {

        alert("Gagal menyalin link.");

    });

});

// ===============================
// SAAT TOMBOL BUKA LINK DIKLIK
// ===============================

openBtn.addEventListener("click", function () {

    const url = resultUrl.textContent.trim();

    if (url === DEFAULT_RESULT_TEXT) {
        alert("Silakan generate URL terlebih dahulu.");
        return;
    }

    window.open(url, "_blank");

});

// ===============================
// SAAT TOMBOL RESET DIKLIK
// ===============================

resetBtn.addEventListener("click", function () {

    guestName.value = "";

    if (currentMode === "admin") {
        websiteSelect.selectedIndex = 0;
    }

    resultUrl.textContent = DEFAULT_RESULT_TEXT;
    saveStatus.textContent = "";
    saveStatus.className = "save-status";
    copyBtn.textContent = DEFAULT_COPY_TEXT;

});