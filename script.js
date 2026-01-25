const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqJKH4kFqwfTddvPGSv19SB4MkMXEuHSuRqcaNWs8m2dGu2gz_ONcAQLOQECrxZvc4lw/exec";

/* ===== ELEMENT SELECTOR ===== */
const gameInput = document.getElementById("game");
const layananInput = document.getElementById("layanan");
const hargaInput = document.getElementById("harga");
const modalInput = document.getElementById("modal");
const statusEl = document.getElementById("status");

const bulanSelect = document.getElementById("bulan");
const tahunSelect = document.getElementById("tahun");

const totalOrderEl = document.getElementById("totalOrder");
const totalProfitEl = document.getElementById("totalOmset"); // ID tetap totalOmset sesuai HTML Anda
const yearOrderEl = document.getElementById("yearOrder");
const yearProfitEl = document.getElementById("yearOmset"); // ID tetap yearOmset sesuai HTML Anda

let allData = [];

/* ===== HELPER: MENGUBAH INPUT/DATA MENJADI ANGKA BERSIH ===== */
function parseHarga(val) {
  if (val === undefined || val === null || val === "") return 0;
  let num = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9]/g, ""));
  return isNaN(num) ? 0 : num;
}

/* ===== LOAD DATA DARI GOOGLE SHEETS ===== */
function loadData() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      allData = data;
      initTahun();
      setDefaultBulan();
      hitungStatistik();
    })
    .catch(err => {
      console.error("Gagal memuat data:", err);
      statusEl.innerText = "Gagal memuat data terbaru.";
    });
}

/* ===== SIMPAN DATA (SUBMIT) ===== */
document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();
  statusEl.innerText = "⏳ Sedang menyimpan...";

  const dataKirim = {
    game: gameInput.value,
    layanan: layananInput.value,
    harga: hargaInput.value,
    modal: modalInput.value
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(dataKirim)
  })
  .then(res => res.json())
  .then(result => {
    statusEl.innerText = "✅ Berhasil disimpan ke Database!";
    e.target.reset();
    loadData(); // Refresh data setelah simpan
  })
  .catch(err => {
    console.error("Gagal simpan:", err);
    statusEl.innerText = "❌ Gagal menyimpan. Coba lagi.";
  });
});

/* ===== LOGIC FILTER & HITUNG ===== */
bulanSelect.addEventListener("change", hitungStatistik);
tahunSelect.addEventListener("change", hitungStatistik);

function setDefaultBulan() {
  bulanSelect.value = new Date().getMonth();
}

function initTahun() {
  const currentYear = new Date().getFullYear();
  let years = [...new Set(allData.map(d => new Date(d.tanggal).getFullYear()))];
  
  // Jika data kosong, masukkan tahun saat ini
  if (years.length === 0 || isNaN(years[0])) years = [currentYear];

  tahunSelect.innerHTML = "";
  years.sort().forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    tahunSelect.appendChild(opt);
  });
  tahunSelect.value = currentYear;
}

function hitungStatistik() {
  const blnSelected = Number(bulanSelect.value);
  const thnSelected = Number(tahunSelect.value);

  // 1. Hitung Bulanan
  const dataBulanIni = allData.filter(d => {
    const t = new Date(d.tanggal);
    return t.getMonth() === blnSelected && t.getFullYear() === thnSelected;
  });

  totalOrderEl.innerText = dataBulanIni.length;

  const profitBulanIni = dataBulanIni.reduce((sum, d) => {
    return sum + (parseHarga(d.harga) - parseHarga(d.modal));
  }, 0);
  totalProfitEl.innerText = "Rp " + profitBulanIni.toLocaleString("id-ID");

  // 2. Hitung Tahunan
  const dataTahunIni = allData.filter(d => {
    return new Date(d.tanggal).getFullYear() === thnSelected;
  });

  yearOrderEl.innerText = dataTahunIni.length;

  const profitTahunIni = dataTahunIni.reduce((sum, d) => {
    return sum + (parseHarga(d.harga) - parseHarga(d.modal));
  }, 0);
  yearProfitEl.innerText = "Rp " + profitTahunIni.toLocaleString("id-ID");
}

/* Jalankan saat halaman dibuka */
document.addEventListener("DOMContentLoaded", loadData);
