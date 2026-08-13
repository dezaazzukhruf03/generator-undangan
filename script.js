// ===============================
// AMBIL ELEMEN HTML
// ===============================

const API_URL = "https://script.google.com/macros/s/AKfycbzxGY9MJef2If5Je1L6nW0EEdRCL72nEM7Vdy1EpzY8uLoCWB6rfzdiZiGvNIx2Rm8lyQ/exec";

const generatorForm = document.getElementById("generatorForm");
const guestName = document.getElementById("guestName");
const websiteSelect = document.getElementById("websiteSelect");
const generateBtn = document.getElementById("generateBtn");
const resultUrl = document.getElementById("resultUrl");
const saveStatus = document.getElementById("saveStatus");
const copyBtn = document.getElementById("copyBtn");
const openBtn = document.getElementById("openBtn");
const resetBtn = document.getElementById("resetBtn");

// Teks default saat belum ada URL yang digenerate
const DEFAULT_RESULT_TEXT = "Hasil url akan muncul disini";
const DEFAULT_COPY_TEXT = "Copy Link";

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

    // Cek website yang dipilih
    if (!websiteSelect.value) {
        alert("Silakan pilih website.");
        websiteSelect.focus();
        return;
    }

    // Tentukan URL dasar
    let baseUrl = "";

    switch (websiteSelect.value) {

        case "laradeza":
            baseUrl = "https://laradeza-wedding.vercel.app/";
            break;

        case "ekaarian":
            baseUrl = "https://ekaarian-wedding.vercel.app/";
            break;

        case "putrirama":
            baseUrl = "https://putrirama-wedding.vercel.app/";
            break;

        default:
            alert("Website tidak ditemukan.");
            return;

    }

    // Encode nama tamu
    const encodedName = encodeURIComponent(name);

    // Gabungkan URL
    const finalUrl = `${baseUrl}?to=${encodedName}`;

    // Tampilkan hasil URL segera
    resultUrl.textContent = finalUrl;

    // Nonaktifkan tombol generate selagi menyimpan data (cegah klik dobel)
    generateBtn.disabled = true;
    generateBtn.textContent = "Menyimpan...";
    saveStatus.textContent = "";
    saveStatus.className = "save-status";

    fetch(API_URL, {

        method: "POST",

        body: JSON.stringify({

            nama: name,

            website: websiteSelect.value,

            url: finalUrl

        })

    })
    .then(response => response.json())
    .then(data => {

        console.log("Berhasil disimpan");
        saveStatus.textContent = "Data berhasil disimpan.";
        saveStatus.className = "save-status save-status--success";

    })
    .catch(error => {

        console.error(error);
        saveStatus.textContent = "Gagal menyimpan data. Link tetap bisa dipakai, coba generate ulang jika perlu.";
        saveStatus.className = "save-status save-status--error";

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
    websiteSelect.selectedIndex = 0;
    resultUrl.textContent = DEFAULT_RESULT_TEXT;
    saveStatus.textContent = "";
    saveStatus.className = "save-status";
    copyBtn.textContent = DEFAULT_COPY_TEXT;

});