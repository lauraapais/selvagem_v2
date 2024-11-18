const buttonStart = document.getElementById("buttonStart");
const introSelvagem = document.getElementById("introSelvagem");
const selvagemProgram = document.getElementById("selvagemProgram");

buttonStart.addEventListener("click", () => {
  introSelvagem.style.opacity = "0";

  setTimeout(() => {
    introSelvagem.style.display = "none";
    selvagemProgram.style.display = "block";
    setVisibility(introSelvagem, true);
    setVisibility(selvagemProgram, false);
    setTimeout(() => {
      selvagemProgram.style.opacity = "1";
    }, 50);
  }, 400);
});

function setVisibility(item, status) {
  if (status) {
    item.classList.add("hidden");
    item.classList.remove("visible");
  } else {
    item.classList.remove("hidden");
    item.classList.add("visible");
  }
}

let currentTrack = document.querySelector(".track1");

let jazzAudio = currentTrack.querySelector(".jazz");
let poesiaAudio = currentTrack.querySelector(".poesia");
let videoElement = currentTrack.querySelector(".video");
let legendasVideo = currentTrack.querySelector(".legendas");

const loadingText = document.getElementById("loadingText");

const faixaElements = document.querySelectorAll(".faixa");
faixaElements.forEach((faixa) => {
  faixa.setAttribute("disabled", true);
});

legendasVideo.style.display = "none";

let interactionEnabled = false;

function setInitialProgress() {
  jazzAudio.volume = 0.7;
  poesiaAudio.volume = 0.5;
  videoElement.style.opacity = 1.0;
  legendasVideo.style.opacity = 0.3;
}

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
    mediaElement.addEventListener("canplaythrough", callback, { once: true });
  }
}

function checkMediaReady() {
  if (
    jazzAudio.readyState >= 3 &&
    poesiaAudio.readyState >= 3 &&
    videoElement.readyState >= 3 &&
    legendasVideo.readyState >= 3
  ) {
    loadingText.style.display = "none";

    videoElement.play();
    videoElement.style.display = "block";
    videoElement.style.opacity = "1";
    legendasVideo.play();
    legendasVideo.style.display = "block";
    legendasVideo.style.opacity = "1";

    jazzAudio.play();
    poesiaAudio.play();

    setInitialProgress();
  }
}

buttonStart.addEventListener("click", () => {
  interactionEnabled = true;

  faixaElements.forEach((faixa) => {
    faixa.removeAttribute("disabled");
  });
  loadingText.style.display = "block";
  videoElement.load();
  legendasVideo.load();

  ensureMediaReady(jazzAudio, checkMediaReady);
  ensureMediaReady(poesiaAudio, checkMediaReady);
  ensureMediaReady(videoElement, checkMediaReady);
  ensureMediaReady(legendasVideo, checkMediaReady);
});

function stopCurrentTrack() {
  if (jazzAudio) {
    jazzAudio.pause();
    jazzAudio.currentTime = 0; 
    jazzAudio.removeAttribute('style');
  }
  if (poesiaAudio) {
    poesiaAudio.pause();
    poesiaAudio.currentTime = 0; 
    poesiaAudio.removeAttribute('style');
  }
  if (videoElement) {
    videoElement.pause();
    videoElement.currentTime = 0;
    videoElement.removeAttribute('style');
    videoElement.classList.remove("activeVideo");
  }
  if (legendasVideo) {
    legendasVideo.pause();
    legendasVideo.currentTime = 0; 
    legendasVideo.removeAttribute('style');
  }

  jazzAudio = null;
  poesiaAudio = null;
  videoElement = null;
  legendasVideo = null;
}

function playTrack(trackElement) {
  stopCurrentTrack(); 

  loadingText.style.display = "block";
  currentTrack = trackElement;

  faixaElements.forEach((faixa) => faixa.classList.remove("active-track"));
  const faixaTitles = document.querySelectorAll(".faixaTitle .faixa");
  faixaTitles.forEach((faixa) => faixa.classList.remove("active-track"));

  jazzAudio = currentTrack.querySelector(".jazz");
  poesiaAudio = currentTrack.querySelector(".poesia");
  videoElement = currentTrack.querySelector(".video");
  videoElement.classList.add("activeVideo");
  legendasVideo = currentTrack.querySelector(".legendas");
  console.log(videoElement);

  videoElement.play();
  poesiaAudio.play();
  legendasVideo.play();
  jazzAudio.play();


  const trackId = trackElement.id; 
  const activeFaixa = document.querySelector(`[data-track="${trackId}"]`);
  const activeTitle = document.querySelector(`.faixaTitle .faixa[data-track="${trackId}"]`);

  if (activeFaixa) {
    activeFaixa.classList.add("active-track");
  }

  if (activeTitle) {
    activeTitle.classList.add("active-track");
  }
}

function adjustValue(position, start, end) {
  if (position < start) return 0;
  if (position > end) return 1;
  return (position - start) / (end - start);
}

function handleTouchMove(
  event,
  progressElement,
  adjustFunction,
  isHorizontal = true
) {
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

const divTop = document.querySelector(".divTop"); 
const divRight = document.querySelector(".divRight");
const divLeft = document.querySelector(".divLeft");
const divBottom = document.querySelector(".divBottom");

const progressJazz = divTop.querySelector(".progress");
const progressVideo = divLeft.querySelector(".progress");
const progressPoesia = divBottom.querySelector(".progress");
const progressLegendas = divRight.querySelector(".progress");

divTop.addEventListener("mousemove", (e) => {
  if (!interactionEnabled) return;

  const rect = divTop.getBoundingClientRect();
  const volume = adjustValue(e.clientX, rect.left + 50, rect.right - 50);
  jazzAudio.volume = volume;

  cursor.style.width = `${2 + volume * 4}em`;
  cursor.style.height = `${2 + volume * 4}em`;
});

divTop.addEventListener("touchmove", (e) => {
  if (!interactionEnabled) return;

  handleTouchMove(
    e,
    divTop,
    (volume) => {
      jazzAudio.volume = volume;
      updateProgressBar(progressJazz, volume, true);
    },
    true
  );
});

divRight.addEventListener("mousemove", (e) => {
  if (!interactionEnabled) return;

  const rect = divRight.getBoundingClientRect();
  const opacity = 1 - adjustValue(e.clientY, rect.top + 50, rect.bottom - 50);
  legendasVideo.style.opacity = opacity;

  cursor.style.width = `${2 + opacity * 4}em`;
  cursor.style.height = `${2 + opacity * 4}em`;
});

divRight.addEventListener("touchmove", (e) => {
  if (!interactionEnabled) return;

  handleTouchMove(
    e,
    divRight,
    (opacity) => {
      legendasVideo.style.opacity = 1 - opacity;
    },
    false
  );
});

divBottom.addEventListener("mousemove", (e) => {
  if (!interactionEnabled) return;

  const rect = divBottom.getBoundingClientRect();
  const volume = adjustValue(e.clientX, rect.left + 50, rect.right - 50);
  poesiaAudio.volume = volume;

  cursor.style.width = `${2 + volume * 4}em`;
  cursor.style.height = `${2 + volume * 4}em`;
});

divBottom.addEventListener("touchmove", (e) => {
  if (!interactionEnabled) return;

  handleTouchMove(
    e,
    divBottom,
    (volume) => {
      poesiaAudio.volume = volume;
    },
    true
  ); 
});

divLeft.addEventListener("mousemove", (e) => {
  if (!interactionEnabled) return;

  const rect = divLeft.getBoundingClientRect();
  const opacity = 1 - adjustValue(e.clientY, rect.top + 50, rect.bottom - 50);
  videoElement.style.opacity = opacity;

  cursor.style.width = `${2 + opacity * 4}em`;
  cursor.style.height = `${2 + opacity * 4}em`;
});

divLeft.addEventListener("touchmove", (e) => {
  if (!interactionEnabled) return;

  handleTouchMove(
    e,
    divLeft,
    (opacity) => {
      videoElement.style.opacity = 1 - opacity;
    },
    false
  );
});

faixaElements.forEach((faixa) => {
  faixa.addEventListener("click", () => {
    if (!interactionEnabled) return;

    const trackId = faixa.getAttribute("data-track");
    const trackElement = document.getElementById(trackId);

    playTrack(trackElement);
  });
});

const hoverLinks = document.querySelectorAll(".hover-link");

hoverLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => {
    cursor.classList.add("active");
  });

  link.addEventListener("mouseleave", () => {
    cursor.classList.remove("active");
  });
});

const interactionDivs = document.querySelectorAll(".interation");

function showInteractions() {
  interactionDivs.forEach((div) => {
    div.classList.add("active");
    div.classList.remove("hidden");
  });
}

function hideInteractions() {
  interactionDivs.forEach((div) => {
    div.classList.add("hidden");
    div.classList.remove("active");
  });
}

let inactivityTimer;

function resetInactivityTimer() {
  showInteractions();

  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(hideInteractions, 2000);
}

window.addEventListener("mousemove", resetInactivityTimer);
window.addEventListener("touchmove", resetInactivityTimer);
hideInteractions();

const touchDivs = document.querySelectorAll(
  ".divTop div, .divBottom div, .divRight div, .divLeft div"
);

function activateDiv(event) {
  const touchedDiv = event.target;
  if (
    touchedDiv.classList.contains("divTop") ||
    touchedDiv.classList.contains("divBottom") ||
    touchedDiv.classList.contains("divRight") ||
    touchedDiv.classList.contains("divLeft")
  ) {
    touchedDiv.classList.add("active");
  }
}

function deactivateDiv(event) {
  const touchedDiv = event.target;
  touchedDiv.classList.remove("active");
}

touchDivs.forEach((div) => {
  div.addEventListener("touchstart", activateDiv);
  div.addEventListener("touchend", deactivateDiv);
});


