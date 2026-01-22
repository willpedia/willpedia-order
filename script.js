const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzTI_im_QXPxxHIDOQRICr36lROJjgDJAju1nWwVGvTrrotfOc4IG3bNpBy7sZ8ZKwmVw/exec";

const totalOrderEl = document.getElementById("totalOrder");
const totalOmsetEl = document.getElementById("totalOmset");
const statusEl = document.getElementById("status");
const bulanSelect = document.getElementById("bulan");
const tahunSelect = document.getElementById("tahun");
const yearOrderEl = document.getElementById("yearOrder");
const yearOmsetEl = document.getElementById("yearOmset");


let allData = [];

/* ========= INIT ========= */
fetch(SCRIPT_URL)
  .then(res => res.json())
  .then(data => {
    allData = data;
    initTahun();
    setDefaultBulan();
    hitungBulanan();
  });

/* ========= FORM SUBMIT ========= */
document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      game: game.value,
      layanan: layanan.value,
      harga: harga.value
    })
  })
  .then(() => {
    statusEl.innerText = "✅ Order tersimpan";
    e.target.reset();
    reloadData();
  })
  .catch(() => statusEl.innerText = "❌ Gagal menyimpan");
});

/* ========= FILTER ========= */
bulanSelect.addEventListener("change", hitungBulanan);
tahunSelect.addEventListener("change", hitungBulanan);

/* ========= FUNCTIONS ========= */

function reloadData() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      allData = data;
      hitungBulanan();
    });
}

function setDefaultBulan() {
  const now = new Date();
  bulanSelect.value = now.getMonth();
}

function initTahun() {
  const tahunSet = new Set(
    allData.map(d => new Date(d.tanggal).getFullYear())
  );

  [...tahunSet].sort().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    tahunSelect.appendChild(opt);
  });

  tahunSelect.value = new Date().getFullYear();
}

function hitungBulanan() {
  const bulan = Number(bulanSelect.value);
  const tahun = Number(tahunSelect.value);

  const filtered = allData.filter(d => {
    const tgl = new Date(d.tanggal);
    return tgl.getMonth() === bulan && tgl.getFullYear() === tahun;
  });

  totalOrderEl.innerText = filtered.length;

  const omset = filtered.reduce(
    (sum, d) => sum + Number(d.harga), 0
  );

  totalOmsetEl.innerText =
    "Rp " + omset.toLocaleString("id-ID");

  // ✅ PANGGIL DI SINI
  hitungTahunan();
}

function hitungTahunan() {
  const tahun = Number(tahunSelect.value);

  const dataTahun = allData.filter(d => {
    const tgl = new Date(d.tanggal);
    return tgl.getFullYear() === tahun;
  });

  yearOrderEl.innerText = dataTahun.length;

  const omsetTahun = dataTahun.reduce(
    (sum, d) => sum + Number(d.harga), 0
  );

  yearOmsetEl.innerText =
    "Rp " + omsetTahun.toLocaleString("id-ID");
}


