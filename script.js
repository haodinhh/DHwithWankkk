// ===== Timeline Navigation System =====

class Timeline {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 6;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.bindElements();
        this.attachEventListeners();
        this.updateNavigation();
    }

    bindElements() {
        this.pages = document.querySelectorAll('.page');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.indicators = document.querySelectorAll('.indicator');
    }

    attachEventListeners() {
        // Button navigation
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());

        // Indicator navigation
        this.indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const pageNum = parseInt(e.target.dataset.page);
                this.goToPage(pageNum);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousPage();
            } else if (e.key === 'ArrowRight') {
                this.nextPage();
            }
        });

        // Touch/swipe navigation (vertical)
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartY, touchEndY);
        });

        // Mouse wheel navigation (optional smooth scrolling)
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (this.isTransitioning) return;

            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.nextPage();
                } else if (e.deltaY < 0) {
                    this.previousPage();
                }
            }, 50);
        }, { passive: true });
    }

    handleSwipe(startY, endY) {
        const swipeThreshold = 50;
        const diff = startY - endY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - next page
                this.nextPage();
            } else {
                // Swipe down - previous page
                this.previousPage();
            }
        }
    }

    goToPage(pageNum) {
        if (pageNum === this.currentPage || this.isTransitioning) return;
        if (pageNum < 1 || pageNum > this.totalPages) return;

        this.isTransitioning = true;

        const isGoingDown = pageNum > this.currentPage;

        // Remove active class from current page
        const currentPageElement = document.getElementById(`page-${this.currentPage}`);
        currentPageElement.classList.remove('active');

        // Add appropriate exit class based on direction
        if (isGoingDown) {
            currentPageElement.classList.add('prev');
            currentPageElement.classList.remove('next');
        } else {
            currentPageElement.classList.add('next');
            currentPageElement.classList.remove('prev');
        }

        // Update current page
        const previousPage = this.currentPage;
        this.currentPage = pageNum;

        // Add active class to new page
        const newPageElement = document.getElementById(`page-${this.currentPage}`);
        newPageElement.classList.remove('prev', 'next');
        newPageElement.classList.add('active');

        // Update navigation
        this.updateNavigation();

        // Reset transition lock
        setTimeout(() => {
            this.isTransitioning = false;
        }, 700);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    updateNavigation() {
        // Update button states
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === this.totalPages;

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            if (index + 1 === this.currentPage) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

// ===== Initialize Timeline =====
document.addEventListener('DOMContentLoaded', () => {
    const timeline = new Timeline();

    // Optional: Add custom animations or effects
    addPageAnimations();
});

// ===== Additional Animation Effects =====
function addPageAnimations() {
    // Add entrance animations for content elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.content').forEach(content => {
        observer.observe(content);
    });
}

// ===== Utility Functions =====

// Add sparkle effect on mouse move (optional enhancement)
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.95) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '5px';
    sparkle.style.height = '5px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.background = '#FFC2D1';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.opacity = '1';
    sparkle.style.transition = 'all 1s ease-out';

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.style.opacity = '0';
        sparkle.style.transform = 'translateY(-20px)';
    }, 10);

    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Log initialization
console.log('💕 Timeline initialized successfully!');
