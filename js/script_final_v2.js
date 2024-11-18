document.getElementById("buttonStart").addEventListener("click", function () {
  const introSelvagem = document.getElementById("introSelvagem");
  const selvagemProgram = document.getElementById("selvagemProgram");

  // Altera as classes para iniciar a transição
  introSelvagem.classList.remove("visible");
  introSelvagem.classList.add("hidden");

  selvagemProgram.classList.remove("hidden");
  selvagemProgram.classList.add("visible");

  // Inicia a reprodução da primeira track
  playCurrentTrack();
});

document.addEventListener("DOMContentLoaded", function () {
  const tracks = document.querySelectorAll(".mediaTrack"); // Seleciona todas as tracks
  let currentTrackIndex = 0; // Índice inicial (Track 1)
  let isManualSelection = false; // Indica se a track foi selecionada manualmente

  // Função para carregar e reproduzir o vídeo e os áudios da track atual
  function playCurrentTrack() {
    const currentTrack = tracks[currentTrackIndex];
    const video = currentTrack.querySelector(".video");
    const poesiaAudio = currentTrack.querySelector(".poesia");
    const jazzAudio = currentTrack.querySelector(".jazz");
  
    // Configura o vídeo com o src correto se o data-src existir
    if (video && video.dataset.src) {
      if (video.src !== video.dataset.src) { // Evita redefinir o src desnecessariamente
        video.src = video.dataset.src;
        video.load(); // Garante que o novo src seja carregado
      } else {
        video.currentTime = 0; // Reinicia o vídeo do início
        video.load();
      }
    }
  
    // Reproduz vídeo e áudios
    if (video) {
      video.play()
        .then(() => console.log("Vídeo reproduzido."))
        .catch(err => console.error("Erro ao reproduzir o vídeo:", err));
    }
    if (poesiaAudio) {
      poesiaAudio.play()
        .then(() => console.log("Áudio de poesia reproduzido."))
        .catch(err => console.error("Erro ao reproduzir o áudio de poesia:", err));
    }
    if (jazzAudio) {
      jazzAudio.play()
        .then(() => console.log("Áudio de jazz reproduzido."))
        .catch(err => console.error("Erro ao reproduzir o áudio de jazz:", err));
    }
  
    // Configura eventos para avançar para a próxima track
    if (video) {
      video.addEventListener("ended", handleNextTrack, { once: true });
    }
    if (poesiaAudio) {
      poesiaAudio.addEventListener("ended", handleNextTrack, { once: true });
    }
    if (jazzAudio) {
      jazzAudio.addEventListener("ended", handleNextTrack, { once: true });
    }
  }
  
  // Função para avançar para a próxima track
  function handleNextTrack() {
    const currentTrack = tracks[currentTrackIndex];

    // Pausa todos os elementos da track atual
    currentTrack.querySelectorAll("video, audio").forEach((media) => {
      media.pause();
      media.currentTime = 0; // Reseta o tempo para o início
    });

    // Avança para a próxima track, somente se não for manual
    if (!isManualSelection) {
      currentTrackIndex++;
      if (currentTrackIndex < tracks.length) {
        playCurrentTrack();
      } else {
        console.log("Todas as tracks foram reproduzidas.");
      }
    }
    isManualSelection = false; // Sempre redefinir após uso
  }    

  // Função para selecionar uma track manualmente
  document.querySelectorAll(".faixaNum").forEach((faixa) => {
    faixa.addEventListener("click", function () {
      const trackId = this.dataset.track; // Obtém o ID da faixa clicada
      const newTrackIndex = Array.from(tracks).findIndex(
        (track) => track.id === trackId
      );

      if (newTrackIndex !== -1) {
        // Reinicia todos os elementos de mídia da track atual
        const currentTrack = tracks[currentTrackIndex];
        currentTrack.querySelectorAll("video, audio").forEach((media) => {
          media.pause(); // Pausa qualquer reprodução em andamento
          media.currentTime = 0; // Reseta para o início
          if (media.tagName === "VIDEO" && media.dataset.src) {
            media.src = media.dataset.src; // Garante que o vídeo tenha o src correto
            media.load(); // Recarrega o vídeo
          }
        });

        // Atualiza o índice e reproduz a track selecionada
        currentTrackIndex = newTrackIndex;
        isManualSelection = true; // Flag para indicar seleção manual
        playCurrentTrack();
      }
    });
  });

  // Expor a função para o botão "Start"
  window.playCurrentTrack = playCurrentTrack;
});


if (video) {
  if (video.dataset.src) {
    video.src = ""; // Zera temporariamente para forçar um reset
    video.src = video.dataset.src; // Reatribui o src
    video.load(); // Recarrega o vídeo
  }
  video.currentTime = 0; // Reinicia do início
  video.play().catch(err => console.error("Erro ao reproduzir o vídeo:", err));
}
media.pause(); // Pausa a reprodução
media.currentTime = 0; // Reinicia o tempo
media.load(); // Garante que está completamente recarregado
setTimeout(() => {
  media.play().catch(err => console.error("Erro ao reproduzir a mídia:", err));
}, 100); // Atraso para garantir o carregamento completo


