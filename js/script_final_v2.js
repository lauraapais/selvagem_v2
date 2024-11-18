document.getElementById("buttonStart").addEventListener("click", function () {
  const introSelvagem = document.getElementById("introSelvagem");
  const selvagemProgram = document.getElementById("selvagemProgram");

  // Altera as classes para iniciar a transição
  introSelvagem.classList.remove("visible");
  introSelvagem.classList.add("hidden");

  selvagemProgram.classList.remove("hidden");
  selvagemProgram.classList.add("visible");

  // Inicia a reprodução da primeira track
  playCurrentTrack(1);
});

function playCurrentTrack(trackNum) {
  const tracks = document.querySelectorAll('.mediaTrack');
  const trackNumbers = document.querySelectorAll('.faixaNum');

  // Reiniciar todos os vídeos e áudios e ocultar faixas
  tracks.forEach(track => {
    track.classList.add('hidden');
    const videos = track.querySelectorAll('video');
    const audios = track.querySelectorAll('audio');
    videos.forEach(video => {
      video.stop();
      video.currentTime = 0; // Reinicia o vídeo
      if (video.dataset.src) {
        video.src = video.dataset.src; // Define a fonte do vídeo
      }
    });
    audios.forEach(audio => {
      audio.stop();
      audio.currentTime = 0; // Reinicia o áudio
    });
  });

  // Remover a classe 'active-track' de todas as faixas
  trackNumbers.forEach(num => num.classList.remove('active-track'));

  // Atualizar a faixa atual
  const currentTrack = document.getElementById(`faixa${trackNum}`);
  currentTrack.classList.remove('hidden');

  const currentTrackNum = document.querySelector(`.faixaNum[data-track="faixa${trackNum}"]`);
  currentTrackNum.classList.add('active-track');

  const videos = currentTrack.querySelectorAll('video');
  const audios = currentTrack.querySelectorAll('audio');

  // Garantir que os vídeos são carregados e reproduzidos
  videos.forEach(video => {
    video.load();
    video.play();
  });
  audios.forEach(audio => audio.play());

  // Adicionar evento para saber quando a track termina
  audios[audios.length - 1].onended = function () {
    if (trackNum < 10) {
      playCurrentTrack(trackNum + 1);
    }
  };
}

document.querySelectorAll('.faixaNum').forEach(item => {
  item.addEventListener('click', event => {
    const trackNum = event.target.getAttribute('data-track').replace('faixa', '');
    playCurrentTrack(trackNum);
  });
});
