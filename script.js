// --- Videos ---
const videoFiles = [
  {id:'video-madrugada', key:'madrugada'},
  {id:'video-dawn', key:'dawn'},
  {id:'video-day', key:'day'},
  {id:'video-sunset', key:'sunset'},
  {id:'video-night', key:'night'}
];

const vids = {};
videoFiles.forEach(v => vids[v.key] = document.getElementById(v.id));
const nightStatic = document.getElementById("video-night-2");

// --- Horarios de transición ---
const videoTransitions = {
  madrugada: [{start:4.5, end:5.5}],
  dawn: [{start:7, end:8}],
  day: [{start:9, end:10}, {start:10, end:11}],
  sunset: [{start:16.5, end:18}],
  night: [{start:19.5, end:20.5}]
};

// --- Opacidad ---
function calculateOpacity(key, hour){
  let op = 0;
  if(!videoTransitions[key]) return 0;

  videoTransitions[key].forEach(tr=>{
    let start = tr.start;
    let end = tr.end;
    let h = hour;

    if(end < start){
      if(h < start) h += 24;
      end += 24;
    }

    if(h >= start && h <= end){
      op = Math.max(op, (h-start)/(end-start));
    } else if(h > end){
      op = 1;
    }
  });

  return Math.min(Math.max(op,0),1);
}

function updateVideos(hour){
  if(hour >=0 && hour <=5.5){
    nightStatic.style.opacity = 1;
    nightStatic.play().catch(()=>{});
    videoFiles.forEach(v => {
      vids[v.key].style.opacity = 0;
      vids[v.key].pause();
    });
  } else {
    nightStatic.style.opacity = 0;
    nightStatic.pause();
    videoFiles.forEach(v => {
      vids[v.key].style.opacity = calculateOpacity(v.key, hour);
      vids[v.key].play().catch(()=>{});
    });
  }
}

function initVideos(){
  videoFiles.forEach(v=>{
    const vid = vids[v.key];
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    vid.style.opacity = 0;
    vid.play().catch(()=>{});
  });

  nightStatic.loop = true;
  nightStatic.muted = true;
  nightStatic.playsInline = true;
  nightStatic.style.opacity = 0;
  nightStatic.play().catch(()=>{});

  // Hora real para videos
  const now = new Date();
  const hour = now.getHours() + now.getMinutes()/60;
  updateVideos(hour);
}

window.addEventListener('load', initVideos);

// --- Countdown ---
const targetDate = new Date("November 15, 2025 00:00:00").getTime();
const timerEl = document.getElementById("timer");

function updateCountdown(){
  const now = new Date().getTime();
  const diff = targetDate - now;

  if(diff <=0){
    timerEl.textContent = "¡Comenzó!";
    clearInterval(countdownInterval);
    return;
  }

  const days = Math.floor(diff/(1000*60*60*24));
  const hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const minutes = Math.floor((diff%(1000*60*60))/(1000*60));
  const seconds = Math.floor((diff%(1000*60))/1000);

  timerEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();
