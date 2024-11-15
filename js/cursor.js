const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
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
