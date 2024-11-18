function submitPassword() {
    const passwordInput = document.getElementById("passwordInput").value;
    
    if (passwordInput === "HUMANIDADE") {
        const enterSelvagem = document.getElementById("enterSelvagem");
        const introSelvagem = document.getElementById("introSelvagem");

        // Adicionar transição de opacidade
        enterSelvagem.style.transition = "opacity 0.4s";
        introSelvagem.style.transition = "opacity 0.4s";

        // Alterar opacidade
        enterSelvagem.style.opacity = "0";
        introSelvagem.style.opacity = "1";

        // Usar setTimeout para trocar as classes após a transição
        setTimeout(() => {
            enterSelvagem.classList.remove("visible");
            enterSelvagem.classList.add("hidden");
            introSelvagem.classList.remove("hidden");
            introSelvagem.classList.add("visible");
        }, 400); // Tempo em milissegundos para a transição
    } else {
        alert("Palavra-passe incorreta!");
    }
}

document.getElementById("submitPassword").addEventListener("click", submitPassword);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        submitPassword();
    }
});
