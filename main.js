    let search = document.querySelector('.search-box');
    let navbar = document.querySelector('.navbar');
    let searchInput;

    document.querySelector('#search-icon').onclick = () => {
        search.classList.toggle('active');
        navbar.classList.remove('active');
        if (search.classList.contains('active') && searchInput) {
            searchInput.focus();
        }
    }

    document.querySelector('#menu-icon').onclick = () => {
        navbar.classList.toggle('active');
        search.classList.remove('active');
    }

    window.onscroll = () => {
        navbar.classList.remove('active');
        search.classList.remove('active');
    }

    let header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        header.classList.toggle('shadow', window.scrollY > 0);
    });

    // =======================================================
    // CAROUSEL HOMEPAGE FUNCTIONALITY - 4 SLIDES
    // =======================================================

    let currentSlide = 0;
    const totalSlides = 4; // UPDATED: Sekarang 4 slides
    let autoSlideInterval;

    function initCarousel() {
        const carousel = document.querySelector('.home-carousel');
        if (!carousel) return;

        // Create navigation dots untuk 4 slides
        const dotsContainer = document.querySelector('.carousel-controls');
        if (dotsContainer) {
            // Clear existing dots
            dotsContainer.innerHTML = '';
            
            // Create 4 dots
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('div');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        // Arrow navigation
        const prevBtn = document.querySelector('.carousel-arrow.prev');
        const nextBtn = document.querySelector('.carousel-arrow.next');
        
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                nextSlide();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                prevSlide();
            }
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        });

        // Auto slide
        startAutoSlide();

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }

    function goToSlide(index) {
        const carousel = document.querySelector('.home-carousel');
        const dots = document.querySelectorAll('.carousel-dot');
        
        // Ensure index is within bounds
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        if (carousel) {
            // UPDATED: Gunakan 25% untuk 4 slides (100% / 4 = 25%)
            const translateValue = -(currentSlide * 25);
            carousel.style.transform = `translateX(${translateValue}%)`;
        }
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides; // Modulo dengan 4
        goToSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; // Modulo dengan 4
        goToSlide(currentSlide);
    }

    function startAutoSlide() {
        stopAutoSlide();
        // Auto slide setiap 5 detik
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // =======================================================
    // SEARCH FUNCTIONALITY
    // =======================================================

    document.addEventListener('DOMContentLoaded', function() {
        searchInput = document.getElementById('search-input');

        // Initialize carousel dengan 4 slides
        initCarousel();
        
        // Initialize product carousel
        initProductCarousel();

        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch();
                    search.classList.remove('active');
                }
            });

            searchInput.addEventListener('keyup', performSearch);
        }
    });

    // =======================================================
    // PRODUCT CAROUSEL FUNCTIONALITY
    // =======================================================

    let currentProductIndex = 0;
    let productsPerView = 3;
    

    function initProductCarousel() {
        const productsContainer = document.querySelector('.products-container');
        const prevBtn = document.querySelector('.product-arrow.prev');
        const nextBtn = document.querySelector('.product-arrow.next');
        
        if (!productsContainer) return;
        
        const productBoxes = productsContainer.querySelectorAll('.box');
        const totalProducts = productBoxes.length;
        
        // Update products per view based on screen size
        updateProductsPerView();
        window.addEventListener('resize', updateProductsPerView);
        
        // Arrow navigation
        if (prevBtn) prevBtn.addEventListener('click', () => scrollProducts('prev'));
        if (nextBtn) nextBtn.addEventListener('click', () => scrollProducts('next'));
        
        // Initial button state
        updateProductButtons();
        
        function updateProductsPerView() {
            if (window.innerWidth <= 360) {
                productsPerView = 1;
            } else if (window.innerWidth <= 768) {
                productsPerView = 2;
            } else {
                productsPerView = 3;
            }
            updateProductButtons();
        }
        
        function scrollProducts(direction) {
            const maxIndex = Math.max(0, totalProducts - productsPerView);
            
            if (direction === 'next') {
                currentProductIndex = Math.min(currentProductIndex + 1, maxIndex);
            } else {
                currentProductIndex = Math.max(currentProductIndex - 1, 0);
            }
            
            updateProductPosition();
            updateProductButtons();
        }
        
        function updateProductPosition() {
            const boxWidth = productBoxes[0].offsetWidth;
            const gap = 32; // 2rem gap
            const translateX = -(currentProductIndex * (boxWidth + gap));
            productsContainer.style.transform = `translateX(${translateX}px)`;
        }
        
        function updateProductButtons() {
            const maxIndex = Math.max(0, totalProducts - productsPerView);
            
            if (prevBtn) {
                prevBtn.disabled = currentProductIndex === 0;
            }
            
            if (nextBtn) {
                nextBtn.disabled = currentProductIndex >= maxIndex;
            }
        }
        
        // Touch/Swipe support for products
        let touchStartX = 0;
        let touchEndX = 0;
        
        productsContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        productsContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleProductSwipe();
        });
        
        function handleProductSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                scrollProducts('next');
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                scrollProducts('prev');
            }
        }
    }

    function scrollProducts(direction) {
    const container = document.getElementById('products-container');
    const scrollAmount = 350; // Jarak scroll, disesuaikan dengan perkiraan lebar satu box

    if (container) {
        if (direction === 'left') {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else if (direction === 'right') {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }
}

    function performSearch() {
        if (!searchInput) return; 
        
        const searchTerm = searchInput.value.toLowerCase();
        
        const productsContainer = document.querySelector('.products-wrapper');
        const productBoxes = document.querySelectorAll('.products-container .box');
        
        let resultsFound = false;

        let noResultMsg = document.getElementById('no-result-message');
        if (noResultMsg) {
            noResultMsg.remove();
        }

        productBoxes.forEach(box => {
            const productName = box.querySelector('h3') ? box.querySelector('h3').textContent.toLowerCase() : '';
            const productDesc = box.querySelector('p') ? box.querySelector('p').textContent.toLowerCase() : '';
            
            const isMatch = productName.includes(searchTerm) || productDesc.includes(searchTerm);

            if (isMatch || searchTerm.trim() === "") {
                box.style.display = 'flex';
                resultsFound = true;
            } else {
                box.style.display = 'none';
            }
        });

        if (!resultsFound && searchTerm.trim() !== "") {
            const messageDiv = document.createElement('p');
            messageDiv.id = 'no-result-message';
            messageDiv.textContent = `❌ Maaf, tidak ditemukan produk untuk kata kunci "${searchTerm}". Silakan coba kata kunci lain (contoh: '3 kotak', 'keluarga', 'coba').`;
            
            messageDiv.style.textAlign = 'center';
            messageDiv.style.padding = '30px';
            messageDiv.style.color = '#dc3545'; 
            messageDiv.style.fontWeight = '700';
            messageDiv.style.fontSize = '1.2rem';
            messageDiv.style.backgroundColor = '#fff';
            messageDiv.style.borderRadius = '8px';
            messageDiv.style.margin = '20px auto';
            messageDiv.style.maxWidth = '800px';

            if (productsContainer) {
                productsContainer.prepend(messageDiv);
            }
            
            const productsSection = document.getElementById('products');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // =======================================================
    // COMMENT FUNCTIONALITY
    // =======================================================

    function addComments() {
        let name = document.getElementById('name').value;
        let comment = document.getElementById('comment').value;
        
        if (name.trim() === "" || comment.trim() === "") {
            alert("Nama dan Ulasan tidak boleh kosong.");
            return;
        }

        const commentList = document.getElementById("comment-list");
        
        const commentdiv = document.createElement("div");
        commentdiv.classList.add("comment-list");
        
        commentdiv.style.marginBottom = "15px";
        commentdiv.style.padding = "10px";
        commentdiv.style.borderBottom = "1px solid #ccc";

        const nameComment = document.createElement("h4");
        nameComment.textContent = name + " (Pelanggan Etawanesia)";
        nameComment.classList.add("heading-pertama");
        
        const commentText = document.createElement("p");
        commentText.textContent = comment;
        
        commentList.prepend(commentdiv);
        commentdiv.append(nameComment);
        commentdiv.append(commentText);

        document.getElementById('name').value = "";
        document.getElementById('comment').value = "";
    }