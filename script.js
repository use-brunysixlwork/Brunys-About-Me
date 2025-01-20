const overlay = document.getElementById('overlay');
const contentBox = document.getElementById('content-box');
const audio = document.getElementById('audio');

overlay.addEventListener('click', () => {
    audio.play(); 
    overlay.style.opacity = '0'; 
    contentBox.style.filter = 'blur(0)'; 
    setTimeout(() => {
        overlay.style.display = 'none'; 
    }, 1000); 
});
