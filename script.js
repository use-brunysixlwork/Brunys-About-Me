particlesJS("particles-js", {
  particles: {
    number: { value: 20 },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    move: { enable: true, speed: 1 },
    line_linked: { enable: false }
  }
});

const audioElement = document.getElementById("bg-audio");
const mp3Selector = document.getElementById("mp3Selector");
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const source = audioCtx.createMediaElementSource(audioElement);
source.connect(analyser);
analyser.connect(audioCtx.destination);


const volumeControl = document.getElementById("volumeControl");


function setVolumeCookie(volume) {
  document.cookie = "audioVolume=" + volume + ";path=/;max-age=" + (60 * 60 * 24 * 30); 
}


function getVolumeCookie() {
  const name = "audioVolume=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}


const savedVolume = getVolumeCookie();
if (savedVolume) {
  audioElement.volume = savedVolume;
  volumeControl.value = savedVolume;
} else {
  audioElement.volume = 0.5; 
  volumeControl.value = 0.5;
}


volumeControl.addEventListener("input", function () {
  audioElement.volume = volumeControl.value;
  setVolumeCookie(volumeControl.value);
});


function setAudioTimeCookie(currentTime) {
  document.cookie = "audioTime=" + currentTime + ";path=/;max-age=" + (60 * 60 * 24 * 30); 
}


function getAudioTimeCookie() {
  const name = "audioTime=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return parseFloat(c.substring(name.length, c.length));
  }
  return 0; 
}


window.addEventListener("beforeunload", function () {
  setAudioTimeCookie(audioElement.currentTime);
});

function setSongCookie(song) {
  document.cookie = "selectedSong=" + song + ";path=/;max-age=" + (60 * 60 * 24 * 30); 
}

function getSongCookie() {
  const name = "selectedSong=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

function animateVisualizer() {
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += dataArray[i];
  }
  let avg = sum / bufferLength;
  let scale = 1 + (avg / 255) * 0.5; 
  document.querySelector("img.profile").style.transform = "scale(" + scale + ")";
  requestAnimationFrame(animateVisualizer);
}

function startAudio() {
  if (audioCtx.state === "suspended") { audioCtx.resume(); }
  audioElement.play();
  animateVisualizer();
}

document.getElementById("enterOverlay").addEventListener("click", function () {
  this.style.opacity = 0;
  setTimeout(() => { this.style.display = "none"; }, 1000);
  startAudio();
});

const savedSong = getSongCookie();
if (savedSong) {
  audioElement.src = savedSong;
} else {
  audioElement.src = "/music/talk down.mp3"; 
}


const savedAudioTime = getAudioTimeCookie();
if (savedAudioTime) {
  audioElement.currentTime = savedAudioTime;
}

mp3Selector.addEventListener("change", function () {
  audioElement.src = this.value;
  setSongCookie(this.value); 
  audioElement.play();
});

startAudio();

function saveSelection() {
  const selector = document.getElementById("mp3Selector");
  localStorage.setItem("selectedSong", selector.value);
}

window.onload = function() {
  const savedSong = localStorage.getItem("selectedSong");
  if (savedSong) {
      document.getElementById("mp3Selector").value = savedSong;
  }
}
