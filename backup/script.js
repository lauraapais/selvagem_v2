const startButton = document.getElementById('buttonStart');
let currentTrack = document.querySelector('.track1'); 

let jazzAudio = currentTrack.querySelector('.jazz');
let poesiaAudio = currentTrack.querySelector('.poesia');
let videoElement = currentTrack.querySelector('.video');
let legendasVideo = currentTrack.querySelector('.legendas');

const loadingText = document.getElementById('loadingText');

const faixaElements = document.querySelectorAll('.faixa');
faixaElements.forEach(faixa => {
    faixa.setAttribute('disabled', true); 
});

videoElement.style.display = 'none';
legendasVideo.style.display = 'none';

let interactionEnabled = false; 

function setInitialProgress() {
    jazzAudio.volume = 0.7; 
    poesiaAudio.volume = 0.5; 
    videoElement.style.opacity = 1.0;
    legendasVideo.style.opacity = 0.3; 

    updateProgressBar(progressJazz, 0.7, true);
    updateProgressBar(progressPoesia, 0.5, false);
    updateProgressBar(progressVideo, 1.0, false); 
    updateProgressBar(progressLegendas, 0.3, true);
}


// Adicionando o cursor customizado
const cursor = document.getElementById("cursor");
document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
});

function adjustCursorSize(value) {
    cursor.style.width = `${2 + value * 4}em`;
    cursor.style.height = `${2 + value * 4}em`;
}

function ensureMediaReady(mediaElement, callback) {
    if (mediaElement.readyState >= 3) { 
        callback();
    } else {
        mediaElement.addEventListener('canplaythrough', callback, { once: true });
    }
}

function checkMediaReady() {
    if (jazzAudio.readyState >= 3 && poesiaAudio.readyState >= 3 && videoElement.readyState >= 3 && legendasVideo.readyState >= 3) {
        loadingText.style.display = 'none';
        
        videoElement.play();
        videoElement.style.display = 'block';
        videoElement.style.opacity = '1';
        legendasVideo.play();
        legendasVideo.style.display = 'block';
        legendasVideo.style.opacity = '1';

        jazzAudio.play();
        poesiaAudio.play();

        setInitialProgress(); 
    }
}

startButton.addEventListener('click', () => {
    interactionEnabled = true; 

    faixaElements.forEach(faixa => {
        faixa.removeAttribute('disabled'); 
    });

    loadingText.style.display = 'block';

    if (!videoElement.src) {
        videoElement.src = videoElement.getAttribute('data-src');
    }
    videoElement.load(); 

    if (!legendasVideo.src) {
        legendasVideo.src = legendasVideo.getAttribute('data-src');
    }
    legendasVideo.load(); 

    ensureMediaReady(jazzAudio, checkMediaReady);
    ensureMediaReady(poesiaAudio, checkMediaReady);
    ensureMediaReady(videoElement, checkMediaReady);
    ensureMediaReady(legendasVideo, checkMediaReady);

    startButton.style.display = 'none';
});

function stopCurrentTrack() {
    if (jazzAudio) {
        jazzAudio.pause();
        jazzAudio.currentTime = 0; 
    }
    if (poesiaAudio) {
        poesiaAudio.pause();
        poesiaAudio.currentTime = 0; 
    }
    if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0; 
        videoElement.src = ''; 
        videoElement.load(); 
    }
    if (legendasVideo) {
        legendasVideo.pause();
        legendasVideo.currentTime = 0; 
        legendasVideo.src = ''; 
        legendasVideo.load(); 
    }

    videoElement.style.display = 'none';
    legendasVideo.style.display = 'none';
}

function playTrack(trackElement) {
    stopCurrentTrack();  

    loadingText.style.display = 'block';

    currentTrack = trackElement;

    jazzAudio = currentTrack.querySelector('.jazz');
    poesiaAudio = currentTrack.querySelector('.poesia');
    videoElement = currentTrack.querySelector('.video');
    legendasVideo = currentTrack.querySelector('.legendas');

    videoElement.src = videoElement.getAttribute('data-src'); 
    videoElement.load();

    legendasVideo.src = legendasVideo.getAttribute('data-src'); 
    legendasVideo.load();

    ensureMediaReady(jazzAudio, checkMediaReady);
    ensureMediaReady(poesiaAudio, checkMediaReady);
    ensureMediaReady(videoElement, checkMediaReady);
    ensureMediaReady(legendasVideo, checkMediaReady);
}

function adjustValue(position, start, end) {
    if (position < start) return 0;
    if (position > end) return 1;
    return (position - start) / (end - start);
}

function updateProgressBar(progressElement, value, isHorizontal = true) {
    if (isHorizontal) {
        progressElement.style.width = (value * 100) + '%';
    } else {
        progressElement.style.height = (value * 100) + '%';
    }
}

function handleTouchMove(event, progressElement, adjustFunction, isHorizontal = true) {
    if (!interactionEnabled) return;

    const touch = event.touches[0];
    const rect = progressElement.getBoundingClientRect();
    
    if (isHorizontal) {
        const value = adjustValue(touch.clientX, rect.left + 50, rect.right - 50);
        adjustFunction(value);
    } else {
        const value = adjustValue(touch.clientY, rect.top + 50, rect.bottom - 50);
        adjustFunction(value);
    }
}

const divTop = document.querySelector('.divTop');
const divRight = document.querySelector('.divRight');
const divLeft = document.querySelector('.divLeft');
const divBottom = document.querySelector('.divBottom');

const progressJazz = divTop.querySelector('.progress');
const progressVideo = divRight.querySelector('.progress');
const progressPoesia = divLeft.querySelector('.progress');
const progressLegendas = divBottom.querySelector('.progress');

divTop.addEventListener('mousemove', (e) => {
    if (!interactionEnabled) return;

    const rect = divTop.getBoundingClientRect();
    const volume = adjustValue(e.clientX, rect.left + 50, rect.right - 50);
    jazzAudio.volume = volume;
    updateProgressBar(progressJazz, volume, true); 

    cursor.style.width = `${2 + volume * 4}em`;
    cursor.style.height = `${2 + volume * 4}em`;
});

divTop.addEventListener('touchmove', (e) => {
    if (!interactionEnabled) return; 

    handleTouchMove(e, divTop, (volume) => {
        jazzAudio.volume = volume;
        updateProgressBar(progressJazz, volume, true);
    }, true);
});

divRight.addEventListener('mousemove', (e) => {
    if (!interactionEnabled) return;

    const rect = divRight.getBoundingClientRect();
    const opacity = 1 - adjustValue(e.clientY, rect.top + 50, rect.bottom - 50);
    videoElement.style.opacity = opacity;
    updateProgressBar(progressVideo, opacity, false);

    cursor.style.width = `${2 + opacity * 4}em`;
    cursor.style.height = `${2 + opacity * 4}em`;
});

divRight.addEventListener('touchmove', (e) => {
    if (!interactionEnabled) return;

    handleTouchMove(e, divRight, (opacity) => {
        videoElement.style.opacity = 1 -opacity;
        updateProgressBar(progressVideo, 1 - opacity, false);
    }, false);
});

divBottom.addEventListener('mousemove', (e) => {
    if (!interactionEnabled) return;

    const rect = divBottom.getBoundingClientRect();
    const opacity = adjustValue(e.clientX, rect.left + 50, rect.right - 50);
    legendasVideo.style.opacity = opacity;
    updateProgressBar(progressLegendas, opacity, true);

    cursor.style.width = `${2 + opacity * 4}em`;
    cursor.style.height = `${2 + opacity * 4}em`;
});

divBottom.addEventListener('touchmove', (e) => {
    if (!interactionEnabled) return;

    handleTouchMove(e, divBottom, (opacity) => {
        legendasVideo.style.opacity = opacity;
        updateProgressBar(progressLegendas, opacity, true);
    }, true);  // A interação na divBottom é horizontal, então passamos true
});


divLeft.addEventListener('mousemove', (e) => {
    if (!interactionEnabled) return; 

    const rect = divLeft.getBoundingClientRect();
    const volume = 1 - adjustValue(e.clientY, rect.top + 50, rect.bottom - 50); 
    poesiaAudio.volume = volume;
    updateProgressBar(progressPoesia, volume, false); 

    cursor.style.width = `${2 + volume * 4}em`;
    cursor.style.height = `${2 + volume * 4}em`;
});

divLeft.addEventListener('touchmove', (e) => {
    if (!interactionEnabled) return; 

    handleTouchMove(e, divLeft, (volume) => {
        volume = 1 - volume;
        poesiaAudio.volume = volume;
        updateProgressBar(progressPoesia, volume, false);
    }, false);
});

faixaElements.forEach(faixa => {
    console.log(faixa);
    faixa.addEventListener('click', () => {
        if (!interactionEnabled) return; 
        
        const trackId = faixa.getAttribute('data-track');
        const trackElement = document.getElementById(trackId);

        playTrack(trackElement); 
    });
});



const hoverLinks = document.querySelectorAll('.hover-link');

hoverLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
        cursor.classList.add("active");
    });

    link.addEventListener('mouseleave', () => {
        cursor.classList.remove("active");
    });
});

const buttonStart = document.getElementById('buttonStart');
const introSelvagem = document.getElementById('introSelvagem');
const selvagemProgram = document.getElementById('selvagemProgram');

buttonStart.addEventListener('click', () => {
    introSelvagem.style.opacity = '0';

    setTimeout(() => {
        introSelvagem.style.display = 'none';
        selvagemProgram.style.display = 'block';

        setTimeout(() => {
            selvagemProgram.style.opacity = '1';
        }, 50); 
    }, 400); 
});