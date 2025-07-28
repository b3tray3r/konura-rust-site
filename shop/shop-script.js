// Global variables
let selectedProduct = null;
let selectedPrice = 0;

// DOM elements
const tabButtons = document.querySelectorAll('.tab-button');
const productGrids = document.querySelectorAll('.products-grid');
const paymentModal = document.getElementById('paymentModal');
const selectedProductName = document.getElementById('selectedProductName');
const selectedProductPrice = document.getElementById('selectedProductPrice');
const paymentForm = document.querySelector('.payment-form');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showCategory('vip'); // Show VIP products by default
});

// Initialize event listeners
function initializeEventListeners() {
    // Tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchCategory(category);
        });
    });

    // Payment form
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }

    // Close modal on outside click
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && paymentModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Switch between product categories
function switchCategory(category) {
    // Update active tab
    tabButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-category') === category) {
            button.classList.add('active');
        }
    });

    // Show corresponding products
    showCategory(category);
}

// Show products for specific category
function showCategory(category) {
    productGrids.forEach(grid => {
        grid.classList.add('hidden');
        if (grid.id === category) {
            grid.classList.remove('hidden');
            // Trigger animation
            const productCards = grid.querySelectorAll('.product-card');
            productCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }
    });
}

// Select product for purchase
function selectProduct(productId, price) {
    selectedProduct = productId;
    selectedPrice = price;

    // Update modal content
    const productNames = {
        'vip-gold': 'VIP GOLD',
        'vip-silver': 'VIP SILVER',
        'vip-bronze': 'VIP BRONZE',
        'ak47-skin': 'AK-47 Скин',
        'resources': 'Набор ресурсов',
        'admin-access': 'Админ-зона',
        'starter-kit': 'Стартовый набор'
    };

    selectedProductName.textContent = productNames[productId] || productId;
    selectedProductPrice.textContent = `${price}₽`;

    // Show modal
    openModal();
}

// Open payment modal
function openModal() {
    paymentModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    const firstInput = paymentForm.querySelector('input[type="text"]');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

// Close payment modal
function closeModal() {
    paymentModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    if (paymentForm) {
        paymentForm.reset();
    }
}

// Handle payment form submission
function handlePayment(e) {
    e.preventDefault();
    
    const formData = new FormData(paymentForm);
    const playerName = formData.get('playerName') || document.getElementById('playerName').value;
    const email = formData.get('email') || document.getElementById('email').value;
    const paymentMethod = formData.get('payment');

    // Validate form
    if (!playerName || !email) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Пожалуйста, введите корректный email', 'error');
        return;
    }

    // Simulate payment processing
    processPayment({
        product: selectedProduct,
        price: selectedPrice,
        playerName: playerName,
        email: email,
        paymentMethod: paymentMethod
    });
}

// Process payment (simulation)
function processPayment(paymentData) {
    // Show loading state
    const paymentButton = document.querySelector('.payment-button');
    const originalText = paymentButton.textContent;
    paymentButton.textContent = 'Обработка...';
    paymentButton.disabled = true;

    // Simulate payment processing delay
    setTimeout(() => {
        // Reset button
        paymentButton.textContent = originalText;
        paymentButton.disabled = false;

        // Close modal
        closeModal();

        // Show success message
        showNotification(`Платеж успешно обработан! Товар "${paymentData.product}" будет добавлен в игру в течение 5 минут.`, 'success');

        // In a real application, you would send this data to your payment processor
        console.log('Payment data:', paymentData);
        
        // You could also redirect to a success page
        // window.location.href = '/payment-success';
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const mobileButton = document.querySelector('.mobile-menu-button');
    
    navMenu.classList.toggle('active');
    mobileButton.classList.toggle('active');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation styles dynamically
const animationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
    }

    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }

    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 20px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }

        .nav-menu.active {
            transform: translateX(0);
        }

        .mobile-menu-button.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-button.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-button.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize tooltips for features
function initializeTooltips() {
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            // Add tooltip functionality if needed
        });
    });
}

// Call initialize tooltips
initializeTooltips();

// Performance optimization: Lazy load heavy content
function optimizePerformance() {
    // Optimize video loading
    const video = document.querySelector('.background-video video');
    if (video) {
        video.preload = 'metadata';
    }

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize performance optimizations
optimizePerformance();

// Export functions for global access
window.selectProduct = selectProduct;
window.closeModal = closeModal;
window.toggleMobileMenu = toggleMobileMenu;