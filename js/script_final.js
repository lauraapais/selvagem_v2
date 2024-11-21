const introSelvagem = document.getElementById("introSelvagem");
const selvagemProgram = document.getElementById("selvagemProgram");
const submitPasswordButton = document.getElementById("submitPassword");
const passwordInput = document.getElementById("passwordInput");
const cursor = document.getElementById("cursor");
const trackPlaying = document.getElementById("trackPlaying");
const outroSelvagem = document.getElementById("outroSelvagem");

let interactionEnabled = false;

function submitPassword() {
  const password = passwordInput.value;

  if (password === "HUMANIDADE") {
    introSelvagem.style.transition = "opacity 0.4s";
    selvagemProgram.style.transition = "opacity 0.4s";

    introSelvagem.style.opacity = "0";
    selvagemProgram.style.opacity = "1";

    setTimeout(() => {
      introSelvagem.classList.remove("visible");
      introSelvagem.classList.add("hidden");
      selvagemProgram.classList.remove("hidden");
      selvagemProgram.classList.remove("hidden");
      selvagemProgram.classList.add("visible");

      resetMediaSources();
    }, 400);

    interactionEnabled = true;
  } else {
    alert("Palavra-passe incorreta!");
  }
  passwordInput.value = "";
}

submitPasswordButton.addEventListener("click", submitPassword);
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitPassword();
  }
});

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

let currentTrack = document.querySelector(".track1");
let jazzAudio = currentTrack.querySelector(".jazz");
let poesiaAudio = currentTrack.querySelector(".poesia");
let videoElement = currentTrack.querySelector(".video");
let legendasVideo = currentTrack.querySelector(".legendas");

const faixaElements = document.querySelectorAll(".faixaNum"); // Certifique-se de usar a classe correta.
const faixaTitles = document.querySelectorAll(".faixaTitle .faixa"); // Ajuste se necessário.

let pTrack = 1;

function setInitialProgress() {
  jazzAudio.volume = 1.0;
  poesiaAudio.volume = 1.0;
  videoElement.style.opacity = 1.0;
  legendasVideo.style.opacity = 1.0;
}

document.getElementById("submitPassword").addEventListener("click", () => {
  interactionEnabled = true;

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
    document.getElementById("loading").style.display = "none";
  }
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
function pauseAllMedia() {
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
  pauseCurrentTrack();

  // Update active-track class for multiple elements
  let previousTracks = document.querySelectorAll(
    `[data-track="${pTrack + 1}"]`
  );
  let newTracks = document.querySelectorAll(`[data-track="${groupNumber}"]`);
  previousTracks.forEach((track) => track.classList.remove("active-track"));
  newTracks.forEach((track) => track.classList.add("active-track"));

  document.getElementById("loading").style.display = "block";

  const trackNames = [
    "Luz",
    "Fim de Tarde",
    "Instantâneo",
    "Dependência / Correntes Marítimas",
    "Periferia",
    "O Cão Sozinho",
    "Canção dos Brancos Negros",
    "Altura",
    "Humanidade",
    "Arqueologia",
  ];
  document.getElementById("trackNumberPlaying").textContent = groupNumber
    .toString()
    .padStart(2, "0");
  document.getElementById("trackPlaying").textContent =
    trackNames[groupNumber - 1];

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

  // Video End
  video.addEventListener("ended", function onVideoEnd() {
    let nextGroup = pTrack + 1;
    console.log("ID:" + nextGroup);
    if (nextGroup < 10) {
      console.log("NEXT:" + nextGroup);
      loadGroup(nextGroup);
    } else if (nextGroup === 10) {
      console.log("END:" + nextGroup);
      video.classList.add("fade-out");

      setTimeout(function () {
        console.log("CALL END");
        video.classList.remove("fade-out");
        toggleCreditView();
      }, 1000);
    }

    video.removeEventListener("ended", onVideoEnd);
  });

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

const interactionDivs = document.querySelectorAll(
  ".interation, #faixaInteration1, #faixaInteration2"
);

const videoElements = document.querySelectorAll(
  ".mediaTrack .video, .mediaTrack .legendas"
);

function showInteractions() {
  interactionDivs.forEach((div) => {
    div.classList.add("active");
    div.classList.remove("hidden");
  });

  // Aplicar o filtro brightness(0.5) às classes .video e .legendas
  videoElements.forEach((video) => {
    video.style.filter = "brightness(0.5)";
  });
}

function hideInteractions() {
  interactionDivs.forEach((div) => {
    div.classList.add("hidden");
    div.classList.remove("active");
  });

  // Remover o filtro brightness(0.5) das classes .video e .legendas
  videoElements.forEach((video) => {
    video.style.filter = "none";
  });
}

let inactivityTimer;

function resetInactivityTimer() {
  showInteractions();

  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(hideInteractions, 2000); // 2 segundos de inatividade
}

// Adiciona eventos para detectar atividade no ecrã
window.addEventListener("mousemove", resetInactivityTimer);
window.addEventListener("touchmove", resetInactivityTimer);

// Inicialmente, esconde os elementos
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

document
  .querySelectorAll(".divRight div, .divLeft div, .divTop div, .divBottom div")
  .forEach((div) => {
    div.addEventListener("mouseover", () => {
      // Remove "visited" de outros irmãos
      div.parentElement
        .querySelectorAll("div")
        .forEach((sibling) => sibling.classList.remove("visited"));
      // Adiciona "visited" ao elemento atual
      div.classList.add("visited");
    });

    div.addEventListener("click", () => {
      // Remove "active" de outros irmãos
      div.parentElement
        .querySelectorAll("div")
        .forEach((sibling) => sibling.classList.remove("active"));
      // Adiciona "active" ao elemento atual
      div.classList.add("active");
    });
  });

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const trackNumberPlaying = document.getElementById("trackNumberPlaying");
  const trackPlayingdiv = document.getElementById("trackPlayingdiv");
  const menuContent1 = document.getElementById("menuContent1");
  const menuContent2 = document.getElementById("menuContent2");
  const faixaElements = document.querySelectorAll(".faixaNum");

  // Função para fechar o menu
  function closeMenu() {
    menuContent1.classList.remove("expanded");
    menuContent2.classList.remove("expanded");
    menuToggle.classList.add("visible");
    trackNumberPlaying.classList.add("visible");
    trackPlayingdiv.classList.add("visible");
  }

  // Alterna a expansão do menu ao clicar no botão de toggle
  menuToggle.addEventListener("click", (event) => {
    event.stopPropagation(); // Previne o evento de propagação para o documento
    const isExpanded = menuContent1.classList.toggle("expanded");
    menuContent2.classList.toggle("expanded");

    if (isExpanded) {
      menuToggle.classList.remove("visible");
      trackNumberPlaying.classList.remove("visible");
      trackPlayingdiv.classList.remove("visible");
    } else {
      closeMenu();
    }
  });

  // Fecha o menu ao clicar em uma faixa
  faixaElements.forEach((faixa) => {
    faixa.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Fecha o menu ao clicar em qualquer lugar fora dele
  document.addEventListener("click", (event) => {
    const isClickInsideMenu =
      menuContent1.contains(event.target) ||
      menuContent2.contains(event.target);
    if (!isClickInsideMenu) {
      closeMenu();
    }
  });
});

function toggleCreditView() {
  console.log("TOGGLE KEK");
  pauseAllMedia();

  video.removeEventListener("canplaythrough", checkCanPlayThrough);
  legendas.removeEventListener("canplaythrough", checkCanPlayThrough);
  poesia.removeEventListener("canplaythrough", checkCanPlayThrough);
  jazz.removeEventListener("canplaythrough", checkCanPlayThrough);

  // Prevent autoplay
  video.removeAttribute("autoplay");
  legendas.removeAttribute("autoplay");
  poesia.removeAttribute("autoplay");
  jazz.removeAttribute("autoplay");

  // Transition to credits
  selvagemProgram.style.transition = "opacity 0.4s";
  outroSelvagem.style.transition = "opacity 0.4s";
  selvagemProgram.style.opacity = "0";
  outroSelvagem.style.opacity = "1";

  setTimeout(() => {
    selvagemProgram.classList.remove("visible");
    selvagemProgram.classList.add("hidden");
    outroSelvagem.classList.remove("hidden");
    outroSelvagem.classList.add("visible");
  }, 400);
}

creditButton.addEventListener("click", toggleCreditView);

const backCreditsButton = document.getElementById("backCredits");

backCreditsButton.addEventListener("click", () => {
  // Define as transições
  outroSelvagem.style.transition = "opacity 0.4s";
  introSelvagem.style.transition = "opacity 0.4s";

  // Esconde outroSelvagem e mostra introSelvagem
  outroSelvagem.style.opacity = "0";
  introSelvagem.style.opacity = "1";

  // Aguarda o tempo da transição para alterar as classes
  setTimeout(() => {
    outroSelvagem.classList.remove("visible");
    outroSelvagem.classList.add("hidden");
    introSelvagem.classList.remove("hidden");
    introSelvagem.classList.add("visible");
  }, 400); // Duração da transição
});

// Tamanho padrão do cursor
const defaultCursorSize = "2em";

// Função para redefinir o tamanho do cursor
function resetCursorSize() {
  cursor.style.width = defaultCursorSize;
  cursor.style.height = defaultCursorSize;
}

// Adiciona o evento 'mouseleave' para todos os divs interativos
[divTop, divBottom, divLeft, divRight].forEach((div) => {
  div.addEventListener("mouseleave", resetCursorSize);
});

// Função para reiniciar os recursos de mídia
function resetMediaSources() {
  // Redefine as fontes dos elementos
  video.setAttribute("src", `data/track/1/Luz1_video.mp4`);
  legendas.setAttribute("src", `data/track/1/Luz1_legendas.mp4`);
  poesia.setAttribute("src", `data/track/1/Luz1_voz.wav`);
  jazz.setAttribute("src", `data/track/1/Luz1_instrumental.wav`);

  // Restaura autoplay
  video.setAttribute("autoplay", "true");
  legendas.setAttribute("autoplay", "true");
  poesia.setAttribute("autoplay", "true");
  jazz.setAttribute("autoplay", "true");

  // Reinstala os event listeners
  video.addEventListener("canplaythrough", checkCanPlayThrough);
  legendas.addEventListener("canplaythrough", checkCanPlayThrough);
  poesia.addEventListener("canplaythrough", checkCanPlayThrough);
  jazz.addEventListener("canplaythrough", checkCanPlayThrough);

  // Restaura o progresso inicial
  setInitialProgress();
}
