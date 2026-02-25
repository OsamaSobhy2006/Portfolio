document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('mouseover', () => {
        link.style.transform = "translateY(-5px)";
    });
    link.addEventListener('mouseout', () => {
        link.style.transform = "translateY(0)";
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll("section");

    function fadeInSections() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight - 100) {
                section.classList.add("visible");
            }
        });
    }

    fadeInSections();
    window.addEventListener("scroll", fadeInSections);

    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const mainSections = document.querySelectorAll('main section');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    mainSections.forEach(section => observer.observe(section));
});
