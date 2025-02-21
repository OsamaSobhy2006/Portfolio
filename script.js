document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseover', () => {
        link.style.transform = "translateY(-5px)";
    });
    link.addEventListener('mouseout', () => {
        link.style.transform = "translateY(0)";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let sections = document.querySelectorAll("section");

    function fadeInSections() {
        sections.forEach(section => {
            let sectionTop = section.getBoundingClientRect().top;
            let windowHeight = window.innerHeight;

            if (sectionTop < windowHeight - 100) {
                section.classList.add("visible");
            }
        });
    }

    fadeInSections();
    window.addEventListener("scroll", fadeInSections);
});
