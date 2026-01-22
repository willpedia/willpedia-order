const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzTI_im_QXPxxHIDOQRICr36lROJjgDJAju1nWwVGvTrrotfOc4IG3bNpBy7sZ8ZKwmVw/exec";

const totalOrderEl = document.getElementById("totalOrder");
const totalOmsetEl = document.getElementById("totalOmset");
const statusEl = document.getElementById("status");

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    game: game.value,
    layanan: layanan.value,
    harga: harga.value
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(() => {
    statusEl.innerText = "✅ Order tersimpan";
    e.target.reset();
    loadData();
  })
  .catch(() => statusEl.innerText = "❌ Gagal menyimpan");
});

function loadData() {
  fetch(SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      const now = new Date();
      const bulan = now.getMonth();
      const tahun = now.getFullYear();

      const bulanIni = data.filter(d => {
        const tgl = new Date(d.tanggal);
        return tgl.getMonth() === bulan && tgl.getFullYear() === tahun;
      });

      const totalOrder = bulanIni.length;
      const totalOmset = bulanIni.reduce((a,b)=>a+Number(b.harga),0);

      totalOrderEl.innerText = totalOrder;
      totalOmsetEl.innerText =
        "Rp " + totalOmset.toLocaleString("id-ID");
    });
}

loadData();

