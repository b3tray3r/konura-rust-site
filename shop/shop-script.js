// ===== КОНФИГУРАЦИЯ МАГАЗИНА =====
const SHOP_CONFIG = {
    // Категории товаров
    CATEGORIES: {
        subscriptions: 'Подписки',
        items: 'Предметы',
        access: 'Доступы',
        kits: 'Наборы'
    },

    // Анимации
    ANIMATION: {
        CARD_DELAY: 100,
        TRANSITION_DURATION: 300
    }
};

// ===== ДАННЫЕ ТОВАРОВ =====
const SHOP_DATA = {
    subscriptions: [
        {
            id: 'gold',
            name: 'Gold',
            price: 699,
            icon: '🥇',
            description: 'Золотой статус с отличными привилегиями',
            features: [
                'Приоритетная очередь',
                'Увеличенный лимит построек',
                'Дополнительные команды',
                'Золотые скины оружия',
                'Увеличенная скорость крафта',
                'Защита от голода и жажды',
                'Доступ к Gold зонам'
            ],
            duration: '30 дней',
            class: 'gold'
        },
        {
            id: 'silver',
            name: 'Silver',
            price: 399,
            icon: '🥈',
            description: 'Серебряный статус для комфортной игры',
            features: [
                'Быстрое подключение',
                'Дополнительные слоты инвентаря',
                'Базовые привилегии',
                'Серебряные скины',
                'Увеличенное здоровье',
                'Защита от холода'
            ],
            duration: '30 дней',
            class: 'silver popular'
        },
        {
            id: 'bronze',
            name: 'Bronze',
            price: 199,
            icon: '🥉',
            description: 'Бронзовый статус для начинающих',
            features: [
                'Базовые привилегии',
                'Бронзовые скины',
                'Дополнительные слоты',
                'Базовая защита',
                'Стартовые бонусы'
            ],
            duration: '30 дней',
            class: 'bronze'
        }
    ],

    items: [
        {
            id: 'ak47_skin',
            name: 'AK-47 Огненный',
            price: 299,
            icon: '🔫',
            description: 'Эксклюзивный скин для автомата AK-47',
            features: [
                'Уникальный огненный дизайн',
                'Светящиеся элементы',
                'Статистика убийств',
                'Персональная гравировка'
            ],
            class: 'weapon-skin'
        },
        {
            id: 'armor_set',
            name: 'Набор брони Титан',
            price: 499,
            icon: '🛡️',
            description: 'Полный комплект защитной экипировки',
            features: [
                'Максимальная защита',
                'Устойчивость к радиации',
                'Ночное видение',
                'Встроенный регенератор'
            ],
            class: 'armor'
        },
        {
            id: 'helicopter',
            name: 'Личный вертолёт',
            price: 1299,
            icon: '🚁',
            description: 'Персональный транспорт для быстрых перемещений',
            features: [
                'Высокая скорость',
                'Броневая защита',
                'Встроенное оружие',
                'Система автопилота'
            ],
            class: 'vehicle popular'
        }
    ],

    access: [
        {
            id: 'moderator',
            name: 'Права Модератора',
            price: 1499,
            icon: '🛡️',
            description: 'Возможности для поддержания порядка на сервере',
            features: [
                'Кик и бан игроков',
                'Мут в чате',
                'Телепортация',
                'Просмотр логов'
            ],
            duration: '1 месяц',
            class: 'moderator'
        },
        {
            id: 'builder',
            name: 'Права Строителя',
            price: 899,
            icon: '🔨',
            description: 'Специальные возможности для строительства',
            features: [
                'Неограниченные ресурсы',
                'Режим полёта',
                'Быстрое строительство',
                'Защита построек'
            ],
            duration: '1 месяц',
            class: 'builder'
        },
        {
            id: 'vip_zone',
            name: 'VIP Зона',
            price: 599,
            icon: '🌟',
            description: 'Доступ к эксклюзивным областям сервера',
            features: [
                'Безопасная торговля',
                'Эксклюзивные ресурсы',
                'Особые НПЦ',
                'PvP-free зона'
            ],
            duration: '1 месяц',
            class: 'zone'
        }
    ],

    kits: [
        {
            id: 'starter_kit',
            name: 'Стартовый набор',
            price: 99,
            icon: '🎒',
            description: 'Всё необходимое для успешного старта',
            features: [
                'Базовые инструменты',
                'Запас еды и воды',
                'Простая одежда',
                'Стартовые ресурсы'
            ],
            class: 'starter popular'
        },
        {
            id: 'military_kit',
            name: 'Военный набор',
            price: 799,
            icon: '⚔️',
            description: 'Полное военное снаряжение для PvP',
            features: [
                'Штурмовая винтовка',
                'Бронежилет и шлем',
                'Патроны и гранаты',
                'Медикаменты'
            ],
            class: 'military'
        },
        {
            id: 'builder_kit',
            name: 'Набор Строителя',
            price: 599,
            icon: '🏠',
            description: 'Материалы и инструменты для строительства',
            features: [
                'Строительные материалы',
                'Молоток и план',
                'Замки и двери',
                'Декоративные элементы'
            ],
            class: 'builder'
        }
    ]
};

// ===== ОСНОВНОЙ КЛАСС МАГАЗИНА =====
class ShopManager {
    constructor() {
        this.currentCategory = 'subscriptions';
        this.productsGrid = document.getElementById('products-grid');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        
        // Модальное окно
        this.modal = document.getElementById('purchase-modal');
        this.modalClose = document.getElementById('modal-close');
        this.selectedPaymentMethod = null;
        
        this.init();
    }

    init() {
        this.setupCategoryNavigation();
        this.setupModalHandlers();
        this.renderProducts(this.currentCategory);
        this.setupPaymentMethods();
        
        // Анимация появления элементов
        this.setupAnimations();
    }

    /**
     * Настройка навигации по категориям
     */
    setupCategoryNavigation() {
        this.categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.switchCategory(category);
            });
        });
    }

    /**
     * Переключение категории
     */
    switchCategory(category) {
        if (category === this.currentCategory) return;

        // Обновляем активную кнопку
        this.categoryButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Анимация смены товаров
        this.productsGrid.style.opacity = '0';
        this.productsGrid.style.transform = 'translateY(20px)';

        setTimeout(() => {
            this.currentCategory = category;
            this.renderProducts(category);
            
            this.productsGrid.style.opacity = '1';
            this.productsGrid.style.transform = 'translateY(0)';
        }, SHOP_CONFIG.ANIMATION.TRANSITION_DURATION);
    }

    /**
     * Отрисовка товаров
     */
    renderProducts(category) {
        const products = SHOP_DATA[category] || [];
        
        if (products.length === 0) {
            this.productsGrid.innerHTML = '<p>Товары в данной категории временно недоступны</p>';
            return;
        }

        this.productsGrid.innerHTML = '';

        products.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            this.productsGrid.appendChild(productCard);
        });
    }

    /**
     * Создание карточки товара
     */
    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = `product-card ${product.class || ''}`;
        card.style.animationDelay = `${index * SHOP_CONFIG.ANIMATION.CARD_DELAY}ms`;

        const durationHTML = product.duration ? 
            `<div class="product-duration">Срок действия: ${product.duration}</div>` : '';

        const featuresHTML = product.features.map(feature => 
            `<li>${feature}</li>`
        ).join('');

        card.innerHTML = `
            <div class="product-header">
                <div class="product-icon">${product.icon}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">${product.price} ₽</div>
            </div>
            <p class="product-description">${product.description}</p>
            ${durationHTML}
            <ul class="product-features">
                ${featuresHTML}
            </ul>
            <button class="buy-btn" data-product-id="${product.id}">
                <span class="btn-icon">🛒</span>
                Купить сейчас
            </button>
        `;

        // Добавляем обработчик клика на кнопку покупки
        const buyBtn = card.querySelector('.buy-btn');
        buyBtn.addEventListener('click', () => this.openPurchaseModal(product));

        return card;
    }

    /**
     * Настройка обработчиков модального окна
     */
    setupModalHandlers() {
        // Закрытие модального окна
        this.modalClose.addEventListener('click', () => this.closePurchaseModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closePurchaseModal();
            }
        });

        // Закрытие на Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closePurchaseModal();
            }
        });

        // Кнопка подтверждения покупки
        const confirmBtn = document.getElementById('confirm-purchase');
        confirmBtn.addEventListener('click', () => this.processPurchase());
    }

    /**
     * Открытие модального окна покупки
     */
    openPurchaseModal(product) {
        // Заполняем данные товара
        document.getElementById('modal-title').textContent = `Покупка: ${product.name}`;
        document.getElementById('modal-icon').textContent = product.icon;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-description').textContent = product.description;
        document.getElementById('modal-price').textContent = `${product.price} ₽`;

        // Заполняем преимущества
        const featuresContainer = document.getElementById('modal-features');
        featuresContainer.innerHTML = '';
        
        const featuresList = document.createElement('ul');
        featuresList.className = 'product-features';
        
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
        
        featuresContainer.appendChild(featuresList);

        // Сохраняем данные товара для покупки
        this.selectedProduct = product;

        // Показываем модальное окно
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Закрытие модального окна
     */
    closePurchaseModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.selectedProduct = null;
        this.selectedPaymentMethod = null;
        
        // Сбрасываем выбранный способ оплаты
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    /**
     * Настройка способов оплаты
     */
    setupPaymentMethods() {
        const paymentBtns = document.querySelectorAll('.payment-btn');
        
        paymentBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Убираем выделение с других кнопок
                paymentBtns.forEach(b => b.classList.remove('selected'));
                
                // Выделяем выбранную кнопку
                btn.classList.add('selected');
                this.selectedPaymentMethod = btn.dataset.method;
            });
        });
    }

    /**
     * Обработка покупки
     */
    processPurchase() {
        if (!this.selectedProduct) {
            alert('Ошибка: товар не выбран');
            return;
        }

        if (!this.selectedPaymentMethod) {
            alert('Пожалуйста, выберите способ оплаты');
            return;
        }

        // Здесь должна быть интеграция с платёжной системой
        // Пока что показываем сообщение
        const confirmMessage = `
Подтверждение покупки:

Товар: ${this.selectedProduct.name}
Цена: ${this.selectedProduct.price} ₽
Способ оплаты: ${this.getPaymentMethodName(this.selectedPaymentMethod)}

Продолжить?
        `;

        if (confirm(confirmMessage)) {
            this.simulatePurchase();
        }
    }

    /**
     * Получение названия способа оплаты
     */
    getPaymentMethodName(method) {
        const methods = {
            card: 'Банковская карта',
            qiwi: 'QIWI Кошелёк',
            yoomoney: 'ЮMoney'
        };
        return methods[method] || method;
    }

    /**
     * Симуляция процесса покупки
     */
    simulatePurchase() {
        const confirmBtn = document.getElementById('confirm-purchase');
        const originalText = confirmBtn.innerHTML;
        
        // Показываем процесс обработки
        confirmBtn.innerHTML = '<span class="loading-spinner"></span> Обработка...';
        confirmBtn.disabled = true;

        // Симулируем задержку обработки
        setTimeout(() => {
            alert(`Покупка "${this.selectedProduct.name}" успешно завершена!\n\nТовар будет выдан в течение 5 минут.`);
            
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
            
            this.closePurchaseModal();
        }, 2000);
    }

    /**
     * Настройка анимаций
     */
    setupAnimations() {
        // Intersection Observer для анимации появления карточек
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Наблюдаем за карточками товаров
        const observeCards = () => {
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        };

        // Запускаем наблюдение с задержкой
        setTimeout(observeCards, 100);
    }
}

// ===== УТИЛИТЫ ДЛЯ ФОРМАТИРОВАНИЯ =====
class ShopUtils {
    /**
     * Форматирование цены
     */
    static formatPrice(price) {
        return `${price.toLocaleString('ru-RU')} ₽`;
    }

    /**
     * Анимация счётчика
     */
    static animateCounter(element, targetValue, duration = 1000) {
        const startValue = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = this.formatPrice(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Копирование в буфер обмена
     */
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Ошибка копирования:', err);
            return false;
        }
    }
}

// ===== ИНТЕГРАЦИЯ С ОСНОВНЫМ САЙТОМ =====
class ShopIntegration {
    constructor() {
        this.steamUserManager = null;
        this.init();
    }

    init() {
        // Ждём загрузки основного скрипта
        this.waitForMainScript().then(() => {
            this.initializeSteamIntegration();
        });
    }

    /**
     * Ожидание загрузки основного скрипта
     */
    waitForMainScript() {
        return new Promise((resolve) => {
            const checkScript = () => {
                if (window.SteamUserManager) {
                    resolve();
                } else {
                    setTimeout(checkScript, 100);
                }
            };
            checkScript();
        });
    }

    /**
     * Инициализация интеграции с Steam
     */
    initializeSteamIntegration() {
        try {
            this.steamUserManager = new window.SteamUserManager();
            console.log('✅ Steam интеграция инициализирована в магазине');
        } catch (error) {
            console.error('❌ Ошибка инициализации Steam интеграции:', error);
        }
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    // Инициализируем магазин
    const shopManager = new ShopManager();
    
    // Инициализируем интеграцию
    const shopIntegration = new ShopIntegration();
    
    // Глобальные переменные для совместимости
    window.shopManager = shopManager;
    window.ShopUtils = ShopUtils;
    
    console.log('✅ Магазин KONURA RUST инициализирован');
});

// ===== ДОПОЛНИТЕЛЬНЫЕ СТИЛИ ЧЕРЕЗ JS =====
const additionalStyles = `
    .loading-spinner {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .product-card:hover .buy-btn {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
    }
    
    .category-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    }
`;

// Добавляем дополнительные стили
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);