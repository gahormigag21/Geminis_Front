let currentSlide = 0;

const showSlide = (index) => {
    const slides = document.querySelectorAll('.carousel-item');
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    slides.forEach((slide, i) => {
        slide.style.display = i === currentSlide ? 'block' : 'none';
    });
};

const nextSlide = () => {
    currentSlide++;
    showSlide(currentSlide);
};

const prevSlide = () => {
    currentSlide--;
    showSlide(currentSlide);
};

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
});
