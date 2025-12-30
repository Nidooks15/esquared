document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple interaction example
    const btn = document.querySelector('.primary-btn');
    if (btn) {
        btn.addEventListener('mouseenter', () => {
            btn.style.filter = 'brightness(1.1)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.filter = 'brightness(1)';
        });
    }

    console.log('Esquared | Angelmer initialized');
});
