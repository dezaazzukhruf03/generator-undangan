// ===============================
// AMBIL ELEMEN HTML
// ===============================

const API_URL = "https://script.google.com/macros/s/AKfycbzxGY9MJef2If5Je1L6nW0EEdRCL72nEM7Vdy1EpzY8uLoCWB6rfzdiZiGvNIx2Rm8lyQ/exec";

const guestName = document.getElementById("guestName");
const websiteSelect = document.getElementById("websiteSelect");
const generateBtn = document.getElementById("generateBtn");
const resultUrl = document.getElementById("resultUrl");
const copyBtn = document.getElementById("copyBtn");
const openBtn = document.getElementById("openBtn");
const resetBtn = document.getElementById("resetBtn");

// Teks default saat belum ada URL yang digenerate
const DEFAULT_RESULT_TEXT = "Hasil url akan muncul disini";

// ===============================
// SAAT TOMBOL GENERATE DIKLIK
// ===============================

generateBtn.addEventListener("click", function () {

    // Ambil nama tamu
    const name = guestName.value.trim();

    // Cek website yang dipilih
    if (!websiteSelect.value) {
        alert("Silakan pilih website.");
        return;
    }

    // Validasi nama
    if (name === "") {
        alert("Silakan masukkan nama tamu.");
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

    })
    .catch(error => {

        console.error(error);

    });

    // Tampilkan hasil
    resultUrl.textContent = finalUrl;

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

    navigator.clipboard.writeText(url);

    alert("Link berhasil disalin.");

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

});