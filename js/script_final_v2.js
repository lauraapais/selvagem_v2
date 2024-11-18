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


