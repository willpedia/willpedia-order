const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzTI_im_QXPxxHIDOQRICr36lROJjgDJAju1nWwVGvTrrotfOc4IG3bNpBy7sZ8ZKwmVw/exec";

/* ===== ELEMENT ===== */
const game = document.getElementById("game");
const layanan = document.getElementById("layanan");
const harga = document.getElementById("harga");
const statusEl = document.getElementById("status");

const bulanSelect = document.getElementById("bulan");
const tahunSelect = document.getElementById("tahun");

const totalOrderEl = document.getElementById("totalOrder");
const totalOmsetEl = document.getElementById("totalOmset");
const yearOrderEl = document.getElementById("yearOrder");
const yearOmsetEl = document.getElementById("yearOmset");

/* ===== DATA ===== */
let allData = [];

/* ===== HELPER ===== */
function parseHarga(val) {
  if (!val) return 0;
  return Number(String(val).replace(/[^0-9]/g, ""));
}

/* ===== LOAD DATA ===== */
function loadData() {
  fetch(SCRIPT_URL)
    .then(res => res.text())
    .then(text => {
      allData = JSON.parse(text);
      initTahun();
      setDefaultBulan();
      hitungBulanan();
    })
    .catch(err => console.error("Load gagal:", err));
}

/* ===== SUBMIT ===== */
document
  .getElementById("orderForm")
  .addEventListener("submit", submitOrder);

function submitOrder(e) {
  e.preventDefault();

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      game: game.value,
      layanan: layanan.value,
      harga: harga.value
    })
  })
  .then(r => r.text())
  .then(() => {
    statusEl.innerText = "✅ Order tersimpan";
    e.target.reset();
    loadData();
  })
  .catch(err => {
    console.error(err);
    statusEl.innerText = "❌ Gagal menyimpan";
  });
}

/* ===== FILTER ===== */
bulanSelect.addEventListener("change", hitungBulanan);
tahunSelect.addEventListener("change", hitungBulanan);

/* ===== LOGIC ===== */
function setDefaultBulan() {
  bulanSelect.value = new Date().getMonth();
}

function initTahun() {
  tahunSelect.innerHTML = "";

  const years = [
    ...new Set(allData.map(d => new Date(d.tanggal).getFullYear()))
  ];

  if (years.length === 0) {
    years.push(new Date().getFullYear());
  }

  years.sort().forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    tahunSelect.appendChild(opt);
  });

  tahunSelect.value = new Date().getFullYear();
}

function hitungBulanan() {
  const bulan = Number(bulanSelect.value);
  const tahun = Number(tahunSelect.value);

  const data = allData.filter(d => {
    const t = new Date(d.tanggal);
    return t.getMonth() === bulan && t.getFullYear() === tahun;
  });

  totalOrderEl.innerText = data.length;

  const total = data.reduce(
    (sum, d) => sum + parseHarga(d.harga),
    0
  );

  totalOmsetEl.innerText =
    "Rp " + total.toLocaleString("id-ID");

  hitungTahunan();
}

function hitungTahunan() {
  const tahun = Number(tahunSelect.value);

  const data = allData.filter(d =>
    new Date(d.tanggal).getFullYear() === tahun
  );

  yearOrderEl.innerText = data.length;

  const total = data.reduce(
    (sum, d) => sum + parseHarga(d.harga),
    0
  );

  yearOmsetEl.innerText =
    "Rp " + total.toLocaleString("id-ID");
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", loadData);
