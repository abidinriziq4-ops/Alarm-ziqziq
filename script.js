// =======================
// JAM REALTIME
// =======================
function updateJam() {
  const now = new Date();

  const jam = now.getHours().toString().padStart(2, "0");
  const menit = now.getMinutes().toString().padStart(2, "0");
  const detik = now.getSeconds().toString().padStart(2, "0");

  const el = document.getElementById("clock");
  if (el) {
    el.innerText = `${jam}:${menit}:${detik}`;
  }
}
setInterval(updateJam, 1000);
updateJam();


// =======================
// LIST KOTA INDONESIA
// =======================
const semuaKota = [
"Jakarta","Surabaya","Bandung","Medan","Semarang","Makassar","Palembang",
"Yogyakarta","Denpasar","Balikpapan","Malang","Bogor","Depok","Tangerang",
"Bekasi","Padang","Pekanbaru","Pontianak","Banjarmasin","Manado",
"Mataram","Kupang","Jayapura","Ambon","Cirebon","Tasikmalaya","Solo",
"Kediri","Jember","Batu","Samarinda","Batam","Tegal","Purwokerto",
"Serang","Cilegon","Palu","Kendari","Sorong","Bengkulu","Jambi",
"Tarakan","Lhokseumawe","Langsa","Pangkalpinang","Tanjung Pinang"
];


// =======================
// LOAD KOTA KE DROPDOWN
// =======================
window.addEventListener("load", () => {
  const select = document.getElementById("kota");
  if (!select) return;

  select.innerHTML = "";

  semuaKota.forEach(kota => {
    let opt = document.createElement("option");
    opt.value = kota;
    opt.textContent = kota;
    select.appendChild(opt);
  });

  select.value = "Surabaya";
  getJadwal("Surabaya");
});


// =======================
// AMBIL JADWAL SHOLAT API
// =======================
async function getJadwal(kota) {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=11`);
    const data = await res.json();

    const jadwal = data.data.timings;

    setText("subuh", jadwal.Fajr);
    setText("dzuhur", jadwal.Dhuhr);
    setText("ashar", jadwal.Asr);
    setText("maghrib", jadwal.Maghrib);
    setText("isya", jadwal.Isha);

  } catch (e) {
    console.log("Error ambil jadwal:", e);
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}


// =======================
// GANTI KOTA
// =======================
const kotaSelect = document.getElementById("kota");
if (kotaSelect) {
  kotaSelect.addEventListener("change", function () {
    getJadwal(this.value);
  });
}


// =======================
// AUDIO AZAN
// =======================
const audioAzan = new Audio("azan.mp3"); // pastikan file ada


// =======================
// CEK WAKTU SHOLAT AUTO
// =======================
setInterval(() => {
  const now = new Date();
  const waktu = now.toTimeString().slice(0,5);

  const subuh = document.getElementById("subuh")?.innerText;
  const dzuhur = document.getElementById("dzuhur")?.innerText;
  const ashar = document.getElementById("ashar")?.innerText;
  const maghrib = document.getElementById("maghrib")?.innerText;
  const isya = document.getElementById("isya")?.innerText;

  if ([subuh,dzuhur,ashar,maghrib,isya].includes(waktu)) {
    audioAzan.play();
    alert("Waktu sholat telah tiba!");
  }

}, 30000);


// =======================
// ALARM MANUAL
// =======================
let alarmTime = null;

function setAlarm() {
  const input = document.getElementById("alarmTime");
  if (!input || !input.value) return alert("Pilih waktu dulu!");

  alarmTime = input.value;
  alert("Alarm diset: " + alarmTime);
}

setInterval(() => {
  if (!alarmTime) return;

  const now = new Date().toTimeString().slice(0,5);

  if (now === alarmTime) {
    audioAzan.play();
    alert("Alarm bunyi!");
    alarmTime = null;
  }

}, 1000);
