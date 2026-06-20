/  // ==========================
// JAM REALTIME
// ==========================
function updateClock() {
  let now = new Date();
  let jam = now.toLocaleTimeString();
  document.getElementById("clock").innerHTML = jam;
}
setInterval(updateClock, 1000);
updateClock();

// ==========================
// API WAKTU SHOLAT
// ==========================
async function getJadwal(kota) {
  try {
    let res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=11`);
    let data = await res.json();
    let t = data.data.timings;

    document.getElementById("subuh").innerHTML = "Subuh: " + t.Fajr;
    document.getElementById("dzuhur").innerHTML = "Dzuhur: " + t.Dhuhr;
    document.getElementById("ashar").innerHTML = "Ashar: " + t.Asr;
    document.getElementById("maghrib").innerHTML = "Maghrib: " + t.Maghrib;
    document.getElementById("isya").innerHTML = "Isya: " + t.Isha;

    // simpan untuk alarm
    window.jadwal = t;

  } catch (err) {
    alert("Gagal ambil data API");
  }
}

// ==========================
// PILIH KOTA
// ==========================
function setKota() {
  let kota = document.getElementById("kota").value;
  getJadwal(kota);
}

// default kota
getJadwal("Surabaya");

// ==========================
// PLAY SOUND
// ==========================
function playSound(file) {
  let audio = new Audio(file);
  audio.play();
}

// ==========================
// ALARM MANUAL
// ==========================
function setManualAlarm() {
  let waktu = document.getElementById("manualTime").value;
  alert("Alarm diset jam " + waktu);

  setInterval(() => {
    let now = new Date();
    let current =
      now.getHours().toString().padStart(2, "0") +
      ":" +
      now.getMinutes().toString().padStart(2, "0");

    if (current === waktu) {
      triggerAlarm();
    }
  }, 1000);
}

// ==========================
// CEK WAKTU SHOLAT
// ==========================
setInterval(() => {
  if (!window.jadwal) return;

  let now = new Date();
  let current =
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  if (current === window.jadwal.Fajr) triggerAlarm();
  if (current === window.jadwal.Dhuhr) triggerAlarm();
  if (current === window.jadwal.Asr) triggerAlarm();
  if (current === window.jadwal.Maghrib) triggerAlarm();
  if (current === window.jadwal.Isha) triggerAlarm();

}, 1000);

// ==========================
// MODE ALARM
// ==========================
function triggerAlarm() {
  let mode = document.getElementById("alarmMode").value;

  if (mode === "azan") {
    playSound("azan.mp3");
  } else {
    playSound("alarm.mp3");
  }
}
