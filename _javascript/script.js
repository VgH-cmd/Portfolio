const mascote = document.querySelector('.hmasc');

const imagemOriginal = "_imagens/mascaraTrim.png";
const imagemHover = "_imagens/mascaraTrimhover.png";

mascote.addEventListener('mouseenter', () => {
    mascote.src = imagemHover;
});


mascote.addEventListener('mouseleave', () => {
    mascote.src = imagemOriginal;
});

mascote.addEventListener('mouseenter', () => {
    mascote.src = imagemHover;
    mascote.style.filter = "brightness(1) drop-shadow(0 0 5px #00D084)"; 
});

mascote.addEventListener('mouseleave', () => {
    mascote.src = imagemOriginal;
    mascote.style.filter = "none";
});





window.addEventListener('scroll', () => {
    const section = document.getElementById('portfolio-scroll');
    const text = document.querySelector('.scroll-text');
    const allScreens = document.querySelectorAll('.site-screen');
    const isMobile = window.innerWidth < 600;
    
    if (!section || !text) return;

    if (isMobile) {
        text.style.opacity = '1';
        text.style.visibility = 'visible';
        return;
    }

    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Cálculo de progresso (0 a 1)
    let progress = (windowHeight - rect.top) / (rect.height + windowHeight);
    let scrollPercent = Math.max(0, Math.min(1, progress));

    // --- LOGICA DAS IMAGENS ---
    const startPoint = 0.15;
    if (scrollPercent > startPoint) {
        let activePercent = (scrollPercent - startPoint) / (1 - startPoint);
        const move = activePercent * 700;
        const opacity = Math.min(1, activePercent * 8);
        const scale = Math.min(1, activePercent * 2.5);

        const positions = {
            s1: { x: -move - 50,  y: -move - 80, r: -15 },
            s2: { x: move + 50,   y: -move - 100, r: 12 },
            s3: { x: -move - 110, y: move - 30,   r: -8 },
            s4: { x: move + 110,  y: move - 20,   r: 18 },
            s5: { x: -move - 200, y: -40,          r: -5 }
        };

        Object.keys(positions).forEach(key => {
            const el = document.querySelector('.' + key);
            if (el) {
                const pos = positions[key];
                el.style.opacity = opacity;
                el.style.transform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${pos.r}deg) scale(${scale})`;
            }
        });
    }


    // 1. Se o topo da seção estiver muito longe ou o fundo da seção já subiu
    if (rect.bottom < 100 || rect.top > windowHeight) {
        text.style.opacity = "0";
        text.style.visibility = "hidden";
    } 
    // 2. Janela de exibição ideal (enquanto o notebook está no centro)
    else if (scrollPercent > 0.35 && scrollPercent < 0.75) {
        text.style.visibility = "visible";
        text.style.opacity = "1";
    } 

    else {
        text.style.opacity = "0";
        text.style.visibility = "hidden";
    }



    if (text) {
        // Aparece quando as imagens estão quase todas abertas (0.45)
        // E some antes de chegar na próxima seção (0.85)
        if (scrollPercent > 0.45 && scrollPercent < 0.85) {
            text.style.visibility = "visible";
            text.style.opacity = "1";
        } else {
            text.style.opacity = "0";
            text.style.visibility = "hidden";
        }
    }
});

// Slider mobile (sem parallax)
const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = document.querySelectorAll('.carousel-item');
const btnPrev = document.querySelector('.carousel-btn.prev');
const btnNext = document.querySelector('.carousel-btn.next');
let currentSlide = 0;

function updateCarousel() {
    if (!carouselTrack) return;
    const translateX = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${translateX}%)`;
}

if (btnPrev && btnNext && carouselItems.length > 0) {
    btnPrev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
        updateCarousel();
    });

    btnNext.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % carouselItems.length;
        updateCarousel();
    });

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    const track = carouselTrack;

    const touchStart = (index) => (event) => {
        isDragging = true;
        startX = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        track.style.transition = 'none';
    };

    const touchMove = (event) => {
        if (!isDragging) return;
        const x = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        const delta = x - startX;
        currentTranslate = prevTranslate + (delta / track.offsetWidth) * 100;
        track.style.transform = `translateX(${currentTranslate}%)`;
    };

    const touchEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = 'transform 0.3s ease';
        const moved = currentTranslate - prevTranslate;
        if (moved < -15) currentSlide = Math.min(carouselItems.length - 1, currentSlide + 1);
        if (moved > 15) currentSlide = Math.max(0, currentSlide - 1);
        prevTranslate = -currentSlide * 100;
        updateCarousel();
    };

    if (track) {
        track.addEventListener('touchstart', touchStart(currentSlide));
        track.addEventListener('touchmove', touchMove);
        track.addEventListener('touchend', touchEnd);
        track.addEventListener('mousedown', touchStart(currentSlide));
        track.addEventListener('mousemove', touchMove);
        track.addEventListener('mouseup', touchEnd);
        track.addEventListener('mouseleave', touchEnd);
    }
}

// Carousel de Projetos
const projetosCarouselTrack = document.querySelector('.projetos-carousel-track');
const projetosCards = document.querySelectorAll('.projetos-carousel-track .projeto-card');
const projetoBtnPrev = document.querySelector('.projetos-carousel-btn.prev');
const projetoBtnNext = document.querySelector('.projetos-carousel-btn.next');

if (projetosCarouselTrack && projetosCards.length > 0) {
    let projetoCurrentIndex = 0;
    const cardWidth = 290; // largura do card em px
    const cardGap = 20; // gap entre cards em px
    const cardsPerView = 4; // máximo de cards visíveis

    function updateProjetosCarousel() {
        const totalCards = projetosCards.length;
        // Calcula a translação para mostrar 4 cards pulando 1 de cada vez
        const translateX = -(projetoCurrentIndex * (cardWidth + cardGap));
        projetosCarouselTrack.style.transform = `translateX(${translateX}px)`;
    }

    if (projetoBtnNext) {
        projetoBtnNext.addEventListener('click', () => {
            projetoCurrentIndex = (projetoCurrentIndex + 1) % projetosCards.length;
            updateProjetosCarousel();
        });
    }

    if (projetoBtnPrev) {
        projetoBtnPrev.addEventListener('click', () => {
            projetoCurrentIndex = (projetoCurrentIndex - 1 + projetosCards.length) % projetosCards.length;
            updateProjetosCarousel();
        });
    }

    updateProjetosCarousel();
}

