// =====================
// JAM REALTIME
// =====================
setInterval(() => {

  let d = new Date();

  let h = String(d.getHours()).padStart(2,'0');
  let m = String(d.getMinutes()).padStart(2,'0');
  let s = String(d.getSeconds()).padStart(2,'0');

  let clock = document.getElementById("clock");
  if(clock){
    clock.innerText = `${h}:${m}:${s}`;
  }

}, 1000);

// =====================
// DATA SHOLAT
// =====================
let prayer = {};
let lastAuto = "";

// =====================
// AMBIL API SHOLAT
// =====================
function loadSholat(){

  let city = document.getElementById("city").value;

  fetch("https://api.aladhan.com/v1/timingsByCity?city=" + city + "&country=Indonesia&method=20")
  .then(res => res.json())
  .then(data => {

    prayer = data.data.timings;

    setText("subuh", "Subuh: " + prayer.Fajr);
    setText("dzuhur", "Dzuhur: " + prayer.Dhuhr);
    setText("ashar", "Ashar: " + prayer.Asr);
    setText("maghrib", "Maghrib: " + prayer.Maghrib);
    setText("isya", "Isya: " + prayer.Isha);

  })
  .catch(err => {
    alert("API error ❌");
    console.log(err);
  });
}

// helper aman (biar tidak error kalau element belum ada)
function setText(id, text){
  let el = document.getElementById(id);
  if(el) el.innerText = text;
}

// =====================
// ALARM SHOLAT OTOMATIS
// =====================
setInterval(() => {

  if(!prayer.Fajr) return;

  let d = new Date();

  let now =
    String(d.getHours()).padStart(2,'0') + ":" +
    String(d.getMinutes()).padStart(2,'0');

  let map = {
    [prayer.Fajr.slice(0,5)]:"Subuh",
    [prayer.Dhuhr.slice(0,5)]:"Dzuhur",
    [prayer.Asr.slice(0,5)]:"Ashar",
    [prayer.Maghrib.slice(0,5)]:"Maghrib",
    [prayer.Isha.slice(0,5)]:"Isya"
  };

  if(map[now] && lastAuto !== now){
    lastAuto = now;

    alert("🕌 Waktu " + map[now]);
    playAzan();
  }

}, 1000);

// =====================
// ALARM MANUAL
// =====================
let manualTime = "";
let manualActive = false;

function setAlarm(){

  let input = document.getElementById("alarmTime");
  if(!input) return;

  manualTime = input.value;
  manualActive = true;

  let status = document.getElementById("status");
  if(status){
    status.innerText = "⏰ Alarm diset: " + manualTime;
  }
}

// cek alarm manual
setInterval(() => {

  if(!manualActive) return;

  let d = new Date();

  let now =
    String(d.getHours()).padStart(2,'0') + ":" +
    String(d.getMinutes()).padStart(2,'0');

  if(now === manualTime){
    manualActive = false;

    alert("🔔 ALARM MANUAL!");
    playAzan();
  }

}, 1000);

// =====================
// SUARA AZAN
// =====================
function playAzan(){
  let audio = new Audio("https://www.islamcan.com/audio/adhan/azan1.mp3");
  audio.play();
}

// =====================
// AUTO LOAD
// =====================
loadSholat();