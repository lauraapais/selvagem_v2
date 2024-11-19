const buttonStart = document.getElementById("buttonStart");
const introSelvagem = document.getElementById("introSelvagem");
const selvagemProgram = document.getElementById("selvagemProgram");
const outroSelvagem = document.getElementById("outroSelvagem");

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

//const loadingText = document.getElementById("loadingText");

const faixaElements = document.querySelectorAll(".faixa");
const faixaTitles = document.querySelectorAll(".faixaTitle .faixa");
let pTrack = 1;

let interactionEnabled = false;

function setInitialProgress() {
  jazzAudio.volume = 0.7;
  poesiaAudio.volume = 0.5;
  videoElement.style.opacity = 1.0;
  legendasVideo.style.opacity = 0.3;
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

buttonStart.addEventListener("click", () => {
  interactionEnabled = true;

  faixaElements.forEach((faixa) => {
    faixa.removeAttribute("disabled");
  });


  loadGroup(1);
});

let video = document.getElementById("video");
let legendas = document.getElementById("legendas");
let poesia = document.getElementById("poesia");
let jazz = document.getElementById("jazz");

video.addEventListener("canplaythrough", checkCanPlayThrough);
legendas.addEventListener("canplaythrough", checkCanPlayThrough);
poesia.addEventListener("canplaythrough", checkCanPlayThrough);
jazz.addEventListener("canplaythrough", checkCanPlayThrough);

function checkCanPlayThrough() {
  if (
    video.readyState >= 3 &&
    legendas.readyState >= 3 &&
    poesia.readyState >= 3 &&
    jazz.readyState >= 3
  ) {
    video.play();
    legendas.play();
    poesia.play();
    jazz.play();
    document.getElementById('loading').style.display = 'none';  }
}

function pauseCurrentTrack() {
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  if (legendas) {
    legendas.pause();
    legendas.currentTime = 0;
  }
  if (poesia) {
    poesia.pause();
    poesia.currentTime = 0;
  }
  if (jazz) {
    jazz.pause();
    jazz.currentTime = 0;
  }
}

function loadGroup(groupNumber) {
  // Pause and reset the current media
  pauseCurrentTrack()
  
  document.getElementById('loading').style.display = 'block';

  
  faixaElements[pTrack].classList.remove("active-track");
  faixaTitles[pTrack].classList.remove("active-track");
  faixaElements[groupNumber - 1].classList.add("active-track");
  faixaTitles[groupNumber - 1].classList.add("active-track");

  // Set new sources for the selected group
  video.setAttribute(
    "src",
    `data/track/${groupNumber}/Luz${groupNumber}_video.mp4`
  );
  legendas.setAttribute(
    "src",
    `data/track/${groupNumber}/Luz${groupNumber}_legendas.mp4`
  );
  poesia.setAttribute(
    "src",
    `data/track/${groupNumber}/Luz${groupNumber}_voz.wav`
  );
  jazz.setAttribute(
    "src",
    `data/track/${groupNumber}/Luz${groupNumber}_instrumental.wav`
  );

  // Add ended event listener to video to load the next group
  video.addEventListener("ended", function onVideoEnd() {
    if (groupNumber < 10) {
      let nextGroup = groupNumber + 1;
      loadGroup(nextGroup);
    } else {
      pauseCurrentTrack();
      setVisibility(selvagemProgram, true);
      setVisibility(outroSelvagem, false);
    }
    video.removeEventListener("ended", onVideoEnd); // Remove the event listener to avoid stacking
  });

  // Trigger a check in case media are already loaded
  checkCanPlayThrough();
  pTrack = groupNumber - 1;
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

const divTop = document.querySelector(".divTop"); // Música/Jazz
const divRight = document.querySelector(".divRight"); // Texto/Legendas
const divLeft = document.querySelector(".divLeft"); // Imagem/Vídeo
const divBottom = document.querySelector(".divBottom"); // Voz/Poesia

const progressJazz = divTop.querySelector(".progress");
const progressVideo = divLeft.querySelector(".progress");
const progressPoesia = divBottom.querySelector(".progress");
const progressLegendas = divRight.querySelector(".progress");

divTop.addEventListener("mousemove", (e) => {
  if (!interactionEnabled) return;

  const rect = divTop.getBoundingClientRect();
  const volume = adjustValue(e.clientX, rect.left + 50, rect.right - 50);
  jazz.volume = volume;
  /* updateProgressBar(progressJazz, volume, true);*/

  cursor.style.width = `${2 + volume * 4}em`;
  cursor.style.height = `${2 + volume * 4}em`;
});

divTop.addEventListener("touchmove", (e) => {
  if (!interactionEnabled) return;

  handleTouchMove(
    e,
    divTop,
    (volume) => {
      jazz.volume = volume;
      updateProgressBar(progressJazz, volume, true);
    },
    true
  );
});

divRight.addEventListener("mousemove", (e) => {
  if (!interactionEnabled) return;

  const rect = divRight.getBoundingClientRect();
  const opacity = 1 - adjustValue(e.clientY, rect.top + 50, rect.bottom - 50);
  legendas.style.opacity = opacity;

  cursor.style.width = `${2 + opacity * 4}em`;
  cursor.style.height = `${2 + opacity * 4}em`;
});

divRight.addEventListener("touchmove", (e) => {
  if (!interactionEnabled) return;

  handleTouchMove(
    e,
    divRight,
    (opacity) => {
      legendas.style.opacity = 1 - opacity;
    },
    false
  );
});

divBottom.addEventListener("mousemove", (e) => {
  if (!interactionEnabled) return;

  const rect = divBottom.getBoundingClientRect();
  const volume = adjustValue(e.clientX, rect.left + 50, rect.right - 50);
  poesia.volume = volume;

  cursor.style.width = `${2 + volume * 4}em`;
  cursor.style.height = `${2 + volume * 4}em`;
});

divBottom.addEventListener("touchmove", (e) => {
  if (!interactionEnabled) return;

  handleTouchMove(
    e,
    divBottom,
    (volume) => {
      poesia.volume = volume;
    },
    true
  ); // A interação na divBottom é horizontal
});

divLeft.addEventListener("mousemove", (e) => {
  if (!interactionEnabled) return;

  const rect = divLeft.getBoundingClientRect();
  const opacity = 1 - adjustValue(e.clientY, rect.top + 50, rect.bottom - 50);
  video.style.opacity = opacity;

  cursor.style.width = `${2 + opacity * 4}em`;
  cursor.style.height = `${2 + opacity * 4}em`;
});

divLeft.addEventListener("touchmove", (e) => {
  if (!interactionEnabled) return;

  handleTouchMove(
    e,
    divLeft,
    (opacity) => {
      video.style.opacity = 1 - opacity;
    },
    false
  );
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

//Feedback Interação Programa
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
