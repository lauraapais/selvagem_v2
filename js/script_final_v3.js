document.addEventListener("DOMContentLoaded", function () {
  const videoElements = document.querySelectorAll('video[data-src]');
  const trackElements = document.querySelectorAll('.testeTrackNum p');
  let currentTrack = null;

  // Função para carregar e iniciar o vídeo
  function playVideo(trackIndex) {
    if (currentTrack !== null) {
      // Pausar e reiniciar o vídeo atual
      videoElements[currentTrack].pause();
      videoElements[currentTrack].currentTime = 0;
    }
    // Definir a nova faixa como atual e iniciar o vídeo
    currentTrack = trackIndex;
    videoElements[currentTrack].src = videoElements[currentTrack].dataset.src;
    videoElements[currentTrack].play();
  }

  // Adicionar evento de clique a cada número de faixa
  trackElements.forEach((trackElement, index) => {
    trackElement.addEventListener('click', () => {
      playVideo(index);
    });
  });
});
