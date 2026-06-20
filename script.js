// =====================
// DEBUG GLOBAL (BIAR KELIHATAN ERROR)
// =====================
window.onerror = function(msg, url, line) {
  alert("ERROR: " + msg + " | line: " + line);
};


// =====================
// JAM (PALING AMAN)
// =====================
function startClock() {
  setInterval(function () {
    var el = document.getElementById("clock");
    if (!el) return;

    var now = new Date();
    var jam = now.getHours().toString().padStart(2, "0") + ":" +
              now.getMinutes().toString().padStart(2, "0") + ":" +
              now.getSeconds().toString().padStart(2, "0");

    el.innerHTML = jam;
  }, 1000);
}


// =====================
// API SHOLAT
// =====================
function getJadwal(kota) {
  fetch("https://api.aladhan.com/v1/timingsByCity?city=" + kota + "&country=Indonesia")
    .then(res => res.json())
    .then(data => {
      if (!data.data) return;

      var t = data.data.timings;

      document.getElementById("subuh").innerHTML = "Subuh: " + t.Fajr;
      document.getElementById("dzuhur").innerHTML = "Dzuhur: " + t.Dhuhr;
      document.getElementById("ashar").innerHTML = "Ashar: " + t.Asr;
      document.getElementById("maghrib").innerHTML = "Maghrib: " + t.Maghrib;
      document.getElementById("isya").innerHTML = "Isya: " + t.Isha;

      window.jadwal = t;
    })
    .catch(err => {
      alert("API ERROR: " + err);
    });
}


// =====================
// SET KOTA
// =====================
function setKota() {
  var kota = document.getElementById("kota").value;
  getJadwal(kota);
}


// =====================
// SOUND
// =====================
function playSound(file) {
  var audio = new Audio(file);
  audio.play();
}


// =====================
// ALARM
// =====================
function triggerAlarm() {
  var mode = document.getElementById("alarmMode").value;

  if (mode === "azan") {
    playSound("azan.mp3");
  } else {
    playSound("alarm.mp3");
  }
}


// =====================
// ALARM MANUAL
// =====================
function setManualAlarm() {
  var waktu = document.getElementById("manualTime").value;

  alert("Alarm: " + waktu);

  setInterval(function () {
    var now = new Date();
    var jam = now.getHours().toString().padStart(2, "0") + ":" +
              now.getMinutes().toString().padStart(2, "0");

    if (jam === waktu) {
      triggerAlarm();
    }
  }, 1000);
}


// =====================
// CEK SHOLAT
// =====================
function cekSholat() {
  setInterval(function () {
    if (!window.jadwal) return;

    var now = new Date();
    var jam = now.getHours().toString().padStart(2, "0") + ":" +
              now.getMinutes().toString().padStart(2, "0");

    if (jam === window.jadwal.Fajr) triggerAlarm();
    if (jam === window.jadwal.Dhuhr) triggerAlarm();
    if (jam === window.jadwal.Asr) triggerAlarm();
    if (jam === window.jadwal.Maghrib) triggerAlarm();
    if (jam === window.jadwal.Isha) triggerAlarm();

  }, 1000);
}


// =====================
// INIT (PALING PENTING)
// =====================
window.onload = function () {
  startClock();
  getJadwal("Surabaya");
  cekSholat();
};
