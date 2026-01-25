const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzTI_im_QXPxxHIDOQRICr36lROJjgDJAju1nWwVGvTrrotfOc4IG3bNpBy7sZ8ZKwmVw/exec";

const totalOrderEl = document.getElementById("totalOrder");
const totalOmsetEl = document.getElementById("totalOmset");
const statusEl = document.getElementById("status");
const bulanSelect = document.getElementById("bulan");
const tahunSelect = document.getElementById("tahun");
const yearOrderEl = document.getElementById("yearOrder");
const yearOmsetEl = document.getElementById("yearOmset");

// form input
const game = document.getElementById("game");
const layanan = document.getElementById("layanan");
const harga = document.getElementById("harga");

let allData = [];

/* ========= INIT (AMAN CORS) ========= */
fetch(SCRIPT_URL)
  .then(res => res.text())
  .then(text => {
    allData = JSON.parse(text);
    initTahun();
    setDefaultBulan();
    hitungBulanan();
  })
  .catch(err => {
    console.error("Gagal load data:", err);
  });

/* ========= FORM SUBMIT (NO PREFLIGHT) ========= */
document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("game", game.value);
  formData.append("layanan", layanan.value);
  formData.append("harga", harga.value);

  fetch(SCRIPT_URL, {
    method: "POST",
    body: formData
  })
    .then(() => {
      statusEl.innerText = "✅ Order tersimpan";
      e.target.reset();
      reloadData();
    })
    .catch(() => {
      statusEl.innerText = "❌ Gagal menyimpan";
    });
});

/* ========= FILTER ========= */
bulanSelect.addEventListener("change", hitungBulanan);
tahunSelect.addEventListener("change", hitungBulanan);

/* ========= FUNCTIONS ========= */

function reloadData() {
  fetch(SCRIPT_URL)
    .then(res => res.text())
    .then(text => {
      allData = JSON.parse(text);
      hitungBulanan();
    });
}

function setDefaultBulan() {
  const now = new Date();
  bulanSelect.value = now.getMonth();
}

function initTahun() {
  tahunSelect.innerHTML = "";

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



