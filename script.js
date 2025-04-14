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

const splash = document.getElementById('splash');
const mainContainer = document.getElementById('mainContainer');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const playPause = document.getElementById('playPause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const trackSelector = document.getElementById('trackSelector');
const visualizer = document.getElementById('visualizer');

const tracks = [
  { name: "🎵 Dry Your Eyes - Twikipedia", file: "/music/dryyoureyes.mp3" },
  { name: "🎵 Talk Down - Twikipedia", file: "/music/talk down.mp3" },
  { name: "🎵 I Wanna Be The Guy - Twikipedia", file: "/music/iwannabetheguy.mp3" }
];

let currentTrack = parseInt(localStorage.getItem('currentTrack')) || 0;
let savedTime = parseFloat(localStorage.getItem('currentTime')) || 0;
let savedVolume = parseFloat(localStorage.getItem('volume')) || 1;

tracks.forEach((track, index) => {
  const option = document.createElement('option');
  option.value = index;
  option.textContent = track.name;
  trackSelector.appendChild(option);
});
trackSelector.value = currentTrack;

function loadTrack(index, restoreTime = false, autoplay = false) {
  currentTrack = index;
  audio.src = tracks[index].file;
  trackSelector.value = index;
  localStorage.setItem('currentTrack', index);

  audio.onloadedmetadata = () => {
    if (restoreTime) audio.currentTime = savedTime;
    if (autoplay) audio.play();
  };
}

playPause.addEventListener('click', () => {
  if (audio.paused) audio.play();
  else audio.pause();
});

audio.addEventListener('timeupdate', () => {
  progress.max = audio.duration || 0;
  progress.value = audio.currentTime || 0;
  localStorage.setItem('currentTime', audio.currentTime);
});

progress.addEventListener('input', () => {
  audio.currentTime = progress.value;
});

volume.value = savedVolume;
audio.volume = savedVolume;

volume.addEventListener('input', () => {
  audio.volume = volume.value;
  localStorage.setItem('volume', audio.volume);
});

nextBtn.addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  localStorage.setItem('currentTime', 0);
  loadTrack(currentTrack, false, true);
});

prevBtn.addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  localStorage.setItem('currentTime', 0);
  loadTrack(currentTrack, false, true);
});

trackSelector.addEventListener('change', (e) => {
  currentTrack = parseInt(e.target.value);
  localStorage.setItem('currentTime', 0);
  loadTrack(currentTrack, false, true);
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function animateVisualizer() {
  requestAnimationFrame(animateVisualizer);
  analyser.getByteFrequencyData(dataArray);
  const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
  const scale = 1 + (avg / 255);
  visualizer.style.transform = `scale(${scale})`;
  visualizer.querySelector("::before");
}

audio.addEventListener('play', () => {
  audioCtx.resume();
  animateVisualizer();
});

audio.addEventListener('ended', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  loadTrack(currentTrack, false, true);
});

splash.addEventListener('click', () => {
  splash.classList.add('hidden');
  setTimeout(() => {
    splash.style.display = 'none';
    mainContainer.style.display = 'flex';
  }, 700);

  loadTrack(currentTrack, true, true);
});
