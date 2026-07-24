// ===============================
// AMBIL ELEMEN HTML
// ===============================

const API_URL = "https://script.google.com/macros/s/AKfycbzxGY9MJef2If5Je1L6nW0EEdRCL72nEM7Vdy1EpzY8uLoCWB6rfzdiZiGvNIx2Rm8lyQ/exec";

const guestName = document.getElementById("guestName");
const generateBtn = document.getElementById("generateBtn");
const resultUrl = document.getElementById("resultUrl");
const copyBtn = document.getElementById("copyBtn");

// ===============================
// SAAT TOMBOL DIKLIK
// ===============================

generateBtn.addEventListener("click", function () {
  copyBtn.addEventListener("click", function () {

    const url = resultUrl.textContent;

    if (url === "Hasil URL akan muncul di sini...") {
        alert("Silakan generate URL terlebih dahulu.");
        return;
    }

    navigator.clipboard.writeText(url);

    alert("Link berhasil disalin.");

});

    // Ambil nama tamu
    const name = guestName.value.trim();

    // Cek website yang dipilih
    const selectedWebsite = document.querySelector('input[name="website"]:checked');

    // Validasi nama
    if (name === "") {
        alert("Silakan masukkan nama tamu.");
        return;
    }

    // Validasi website
    if (!selectedWebsite) {
        alert("Silakan pilih website.");
        return;
    }

    // Tentukan URL dasar
    let baseUrl = "";

    if (selectedWebsite.value === "laradeza") {

        baseUrl = "https://laradeza-wedding.vercel.app/";

    } else {

        baseUrl = "https://dezalara-wedding.vercel.app/";

    }

    // Encode nama tamu
    const encodedName = encodeURIComponent(name);

    // Gabungkan URL
    const finalUrl = `${baseUrl}?to=${encodedName}`;

    fetch(API_URL, {

    method: "POST",

    body: JSON.stringify({

        nama: name,

        website: selectedWebsite.value,

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