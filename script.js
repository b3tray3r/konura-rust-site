// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    // API endpoints
    APIS: {
        BATTLEMETRICS: 'https://api.battlemetrics.com/servers/34847101',
        DISCORD: 'https://ktor-server-u2py.onrender.com/discord',
        STEAM_LOGIN: 'https://ktor-server-u2py.onrender.com/steam/login',
        STEAM_USER: 'https://ktor-server-u2py.onrender.com/steam/userinfo',
        YOUTUBE: 'https://www.googleapis.com/youtube/v3/videos'
    },

    // YouTube configuration
    YOUTUBE: {
        API_KEY: 'AIzaSyDFfuhLMpLlB5JPUHKBV6bO3cV2BKOHdAw',
        VIDEO_IDS: ['06G8xVhAWqc', 'tydVrQDynZA', '1NtfUg6_mFI']
    },

    // Server configuration
    SERVER: {
        IP: 'rust.konura.ru:28015',
        CONNECT_PROTOCOL: 'steam://connect/203.16.163.232:28834'
    },

    // Update intervals (in milliseconds)
    INTERVALS: {
        STATS_UPDATE: 120000,      // 2 minutes
        WIPE_TIME_UPDATE: 1000,   // 1 second
        RETRY_DELAY: 5000         // 5 seconds on error
    },

    // Animation settings
    ANIMATION: {
        INTERSECTION_THRESHOLD: 0.1,
        INTERSECTION_MARGIN: '0px 0px -50px 0px',
        TYPEWRITER_SPEED: 60,
        TYPEWRITER_DELAY: 300
    }
};

// ===== УТИЛИТЫ =====
class Utils {
    /**
     * Безопасный селектор элементов
     */
    static $(selector) {
        return document.querySelector(selector);
    }

    static $$(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Безопасное обновление текстового содержимого
     */
    static updateText(selector, text, fallback = '--') {
        const element = this.$(selector);
        if (element) {
            element.textContent = text || fallback;
        }
    }

    /**
     * Безопасное обновление атрибутов
     */
    static updateAttribute(selector, attribute, value) {
        const element = this.$(selector);
        if (element && value) {
            element.setAttribute(attribute, value);
        }
    }

    /**
     * Форматирование чисел
     */
    static formatNumber(num) {
        return Number(num).toLocaleString('ru-RU');
    }

    /**
     * Форматирование времени с вайпа
     */
    static formatTimeSinceWipe(diffMs) {
        const seconds = Math.floor((diffMs / 1000) % 60);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let timeString = '';
        if (days > 0) {
            timeString += `${days}д `;
        }
        timeString += `${hours}ч ${minutes}м ${seconds}с`;

        return timeString;
    }

    /**
     * Добавление класса с проверкой
     */
    static addClass(selector, className) {
        const element = this.$(selector);
        if (element) {
            element.classList.add(className);
        }
    }

    /**
     * Удаление класса с проверкой
     */
    static removeClass(selector, className) {
        const element = this.$(selector);
        if (element) {
            element.classList.remove(className);
        }
    }

    /**
     * Показать/скрыть элемент
     */
    static toggleVisibility(selector, show) {
        const element = this.$(selector);
        if (element) {
            if (show) {
                element.classList.remove('hidden');
                element.style.display = '';
            } else {
                element.classList.add('hidden');
                element.style.display = 'none';
            }
        }
    }

    /**
     * Логирование ошибок
     */
    static logError(context, error) {
        console.error(`[${context}] Ошибка:`, error);
    }

    /**
     * Задержка выполнения
     */
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ===== УПРАВЛЕНИЕ НАВИГАЦИЕЙ =====
class NavigationManager {
    constructor() {
        this.navbar = Utils.$('.navbar');
        this.mobileToggle = Utils.$('#mobile-toggle');
        this.navLinks = Utils.$('#nav-links');
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupMobileMenu();
        this.setupScrollEffects();
    }

    /**
     * Плавная прокрутка к якорным ссылкам
     */
    setupSmoothScroll() {
        Utils.$$('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = Utils.$(targetId);

                if (target) {
                    const offsetTop = target.offsetTop - 80; // Учитываем высоту navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });

                    // Закрываем мобильное меню если оно открыто
                    this.closeMobileMenu();
                }
            });
        });
    }

    /**
     * Мобильное меню
     */
    setupMobileMenu() {
        if (this.mobileToggle) {
            this.mobileToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Закрытие меню при клике на ссылку
        Utils.$$('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.navLinks) {
            this.navLinks.classList.toggle('active');
            this.mobileToggle.classList.toggle('active');
        }
    }

    closeMobileMenu() {
        if (this.navLinks) {
            this.navLinks.classList.remove('active');
            this.mobileToggle.classList.remove('active');
        }
    }

    /**
     * Эффекты при скролле
     */
    setupScrollEffects() {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Прозрачность navbar в зависимости от скролла
            if (this.navbar) {
                const opacity = Math.min(currentScrollY / 100, 1);
                this.navbar.style.backgroundColor = `rgba(0, 0, 0, ${0.6 + opacity * 0.3})`;
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }
}

// ===== УПРАВЛЕНИЕ АНИМАЦИЯМИ =====
class AnimationManager {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }

    /**
     * Настройка наблюдателя пересечений
     */
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: CONFIG.ANIMATION.INTERSECTION_THRESHOLD,
            rootMargin: CONFIG.ANIMATION.INTERSECTION_MARGIN
        });
    }

    /**
     * Наблюдение за элементами
     */
    observeElements() {
        const elementsToObserve = [
            '.stat-card',
            '.feature-item',
            '.youtube-card',
            '.map-card'
        ];

        elementsToObserve.forEach(selector => {
            Utils.$$(selector).forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                this.observer.observe(el);
            });
        });
    }

    /**
     * Анимация элемента
     */
    animateElement(element) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';

        // Анимация заголовков
        const headings = element.querySelectorAll('h2, h3, h4');
        headings.forEach((heading, index) => {
            if (!heading.hasAttribute('data-animated')) {
                heading.setAttribute('data-animated', 'true');
                setTimeout(() => {
                    if (window.TypewriterUtils) {
                        window.TypewriterUtils.animate(heading, {
                            speed: CONFIG.ANIMATION.TYPEWRITER_SPEED,
                            delay: index * CONFIG.ANIMATION.TYPEWRITER_DELAY,
                            cursor: false
                        });
                    }
                }, 200);
            }
        });

        // Останавливаем наблюдение за этим элементом
        this.observer.unobserve(element);
    }
}

// ===== УПРАВЛЕНИЕ API =====
class APIManager {
    /**
     * Универсальный метод для API запросов
     */
    static async fetchWithRetry(url, options = {}, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    signal: AbortSignal.timeout(10000) // 10 second timeout
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return await response.json();
            } catch (error) {
                Utils.logError('APIManager', `Попытка ${i + 1}/${retries} для ${url}: ${error.message}`);

                if (i === retries - 1) {
                    throw error;
                }

                await Utils.delay(CONFIG.INTERVALS.RETRY_DELAY);
            }
        }
    }

    /**
     * Получение данных сервера Rust
     */
    static async getRustServerData() {
        return this.fetchWithRetry(CONFIG.APIS.BATTLEMETRICS);
    }

    /**
     * Получение данных Discord
     */
    static async getDiscordData() {
        return this.fetchWithRetry(CONFIG.APIS.DISCORD);
    }

    /**
     * Получение информации о пользователе Steam
     */
    static async getSteamUserData(steamId) {
        const url = `${CONFIG.APIS.STEAM_USER}/${steamId}`;
        console.log('APIManager: Запрос к Steam API:', url);
        
        try {
            const response = await this.fetchWithRetry(url);
            console.log('APIManager: Ответ Steam API:', JSON.stringify(response, null, 2));
            return response;
        } catch (error) {
            console.error('APIManager: Ошибка Steam API:', error);
            throw error;
        }
    }

    /**
     * Получение данных YouTube видео
     */
    static async getYouTubeVideoData(videoId) {
        const url = `${CONFIG.APIS.YOUTUBE}?part=snippet,statistics&id=${videoId}&key=${CONFIG.YOUTUBE.API_KEY}`;
        const data = await this.fetchWithRetry(url);

        if (!data.items || data.items.length === 0) {
            throw new Error(`Видео ${videoId} не найдено`);
        }

        const item = data.items[0];
        return {
            thumbnail: item.snippet.thumbnails.high.url,
            title: item.snippet.title,
            views: item.statistics.viewCount,
            comments: item.statistics.commentCount,
            url: `https://www.youtube.com/watch?v=${videoId}`
        };
    }
}

// ===== УПРАВЛЕНИЕ СТАТИСТИКОЙ =====
class StatsManager {
    constructor() {
        this.updateInterval = null;
        this.wipeTimeInterval = null;
        this.lastWipeDate = null;
        this.init();
    }

    init() {
        this.updateStats();
        this.setupAutoUpdate();
        this.setupConnectionHandlers();
    }

    /**
     * Настройка автоматического обновления
     */
    setupAutoUpdate() {
        // Обновление основной статистики
        this.updateInterval = setInterval(() => {
            this.updateStats();
        }, CONFIG.INTERVALS.STATS_UPDATE);

        // Обновление времени с вайпа каждую секунду
        this.wipeTimeInterval = setInterval(() => {
            this.updateWipeTime();
        }, CONFIG.INTERVALS.WIPE_TIME_UPDATE);
    }

    /**
     * Обработчики кнопок подключения
     */
    setupConnectionHandlers() {
        const connectButtons = Utils.$$('.cta-button, .join-server-btn');
        connectButtons.forEach(btn => {
            if (btn.getAttribute('href') === '#join') {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showConnectionInfo();
                });
            }
        });

        // Discord кнопка
        const discordBtn = Utils.$('#discord-join');
        if (discordBtn) {
            discordBtn.addEventListener('click', () => {
                window.open('https://discord.gg/pYR8brsq5W', '_blank');
            });
        }
    }

    /**
     * Показать информацию о подключении
     */
    showConnectionInfo() {
        const message = `IP сервера: ${CONFIG.SERVER.IP}\n\nСкопируйте адрес в консоль F1 в Rust:\nclient.connect ${CONFIG.SERVER.IP}`;
        alert(message);
    }

    /**
     * Основное обновление статистики
     */
    async updateStats() {
        try {
            Utils.addClass('.stats-container', 'loading');

            // Параллельное получение данных
            const [rustData, discordData] = await Promise.allSettled([
                APIManager.getRustServerData(),
                APIManager.getDiscordData()
            ]);

            // Обработка данных Rust сервера
            if (rustData.status === 'fulfilled') {
                this.updateRustStats(rustData.value);
            } else {
                Utils.logError('StatsManager', 'Ошибка получения данных Rust: ' + rustData.reason);
                this.showRustError();
            }

            // Обработка данных Discord
            if (discordData.status === 'fulfilled') {
                this.updateDiscordStats(discordData.value);
            } else {
                Utils.logError('StatsManager', 'Ошибка получения данных Discord: ' + discordData.reason);
                this.showDiscordError();
            }

        } catch (error) {
            Utils.logError('StatsManager', 'Общая ошибка обновления статистики: ' + error);
        } finally {
            Utils.removeClass('.stats-container', 'loading');
        }
    }

    /**
     * Обновление статистики Rust сервера
     */
    updateRustStats(data) {
        try {
            const attributes = data.data.attributes;
            const players = attributes.players;
            const maxPlayers = attributes.maxPlayers;
            const serverStatus = attributes.status;

            // Обновление игроков онлайн
            Utils.updateText('#rust-players', `${players}/${maxPlayers}`);

            // Обновление заполненности
            const fillPercentage = Math.round((players / maxPlayers) * 100);
            const fillElement = Utils.$('#rust-fill');
            if (fillElement) {
                fillElement.style.width = `${fillPercentage}%`;
            }
            Utils.updateText('#rust-percent', `${fillPercentage}% заполненность`);

            // Обновление статуса сервера
            this.updateServerStatus(serverStatus);

            // Обновление информации о вайпе
            this.updateWipeInfo(attributes.details);

        } catch (error) {
            Utils.logError('StatsManager', 'Ошибка обработки данных Rust: ' + error);
            this.showRustError();
        }
    }

    /**
     * Обновление статуса сервера
     */
    updateServerStatus(status) {
        const statusElement = Utils.$('#server-status');
        if (!statusElement) return;

        if (status === 'online') {
            statusElement.textContent = 'Онлайн';
            statusElement.className = 'status-badge online';
            statusElement.style.cssText = 'background-color: var(--success-color); color: white; font-weight: bold;';
        } else {
            statusElement.textContent = 'Оффлайн';
            statusElement.className = 'status-badge offline';
            statusElement.style.cssText = 'background-color: var(--danger-color); color: white; font-weight: bold;';
        }
    }

    /**
     * Обновление информации о вайпе
     */
    updateWipeInfo(details) {
        try {
            if (details.rust_last_wipe) {
                this.lastWipeDate = new Date(details.rust_last_wipe);
                Utils.updateText('#wipe-date-value', this.lastWipeDate.toLocaleDateString('ru-RU'));
                this.updateWipeTime();
            }
        } catch (error) {
            Utils.logError('StatsManager', 'Ошибка обработки данных вайпа: ' + error);
        }
    }

    /**
     * Обновление времени с последнего вайпа
     */
    updateWipeTime() {
        if (!this.lastWipeDate) return;

        const now = new Date();
        const diffMs = now - this.lastWipeDate;
        const timeString = Utils.formatTimeSinceWipe(diffMs);

        Utils.updateText('#wipe-time-value', timeString);
    }

    /**
     * Обновление статистики Discord
     */
    updateDiscordStats(data) {
        try {
            const totalMembers = data.approximate_member_count;
            const onlineMembers = data.approximate_presence_count;

            Utils.updateText('#discord-total', Utils.formatNumber(totalMembers));
            Utils.updateText('#discord-online', Utils.formatNumber(onlineMembers));

        } catch (error) {
            Utils.logError('StatsManager', 'Ошибка обработки данных Discord: ' + error);
            this.showDiscordError();
        }
    }

    /**
     * Показать ошибку для Rust статистики
     */
    showRustError() {
        Utils.updateText('#rust-players', 'Ошибка');
        Utils.updateText('#rust-percent', 'Недоступно');
        Utils.updateText('#server-status', 'Неизвестно');
    }

    /**
     * Показать ошибку для Discord статистики
     */
    showDiscordError() {
        Utils.updateText('#discord-total', 'Ошибка');
        Utils.updateText('#discord-online', 'Ошибка');
    }

    /**
     * Очистка интервалов
     */
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.wipeTimeInterval) {
            clearInterval(this.wipeTimeInterval);
        }
    }
}

// ===== УПРАВЛЕНИЕ КАРТОЙ =====
class MapManager {
    constructor() {
        this.init();
    }

    async init() {
        try {
            await this.updateMapInfo();
        } catch (error) {
            Utils.logError('MapManager', 'Ошибка инициализации карты: ' + error);
        }
    }

    /**
     * Обновление информации о карте
     */
    async updateMapInfo() {
        try {
            const data = await APIManager.getRustServerData();
            const attributes = data.data.attributes;
            const mapData = attributes.details.rust_maps;

            // Обновление информации о карте
            Utils.updateText('#map-name', attributes.details.map || 'Неизвестна');
            Utils.updateText('#map-size', `${mapData.size} м`);
            Utils.updateText('#map-monuments', Object.keys(mapData.monumentCounts || {}).length);

            // Обновление изображения и ссылки
            Utils.updateAttribute('#map-thumbnail', 'src', mapData.thumbnailUrl);
            Utils.updateAttribute('#map-link', 'href', mapData.url);

            // Добавление обработчика загрузки изображения
            const mapImage = Utils.$('#map-thumbnail');
            if (mapImage) {
                mapImage.addEventListener('load', () => {
                    mapImage.style.opacity = '1';
                });
                mapImage.addEventListener('error', () => {
                    mapImage.alt = 'Карта недоступна';
                    mapImage.style.opacity = '0.5';
                });
            }

        } catch (error) {
            Utils.logError('MapManager', 'Ошибка обновления карты: ' + error);
            this.showMapError();
        }
    }

    /**
     * Показать ошибку карты
     */
    showMapError() {
        Utils.updateText('#map-name', 'Недоступно');
        Utils.updateText('#map-size', 'Недоступно');
        Utils.updateText('#map-monuments', 'Недоступно');
    }
}

// ===== УПРАВЛЕНИЕ YOUTUBE КОНТЕНТОМ =====
class YouTubeManager {
    constructor() {
        this.container = Utils.$('#youtube-cards');
        this.init();
    }

    extractVideoId(url) {
        const match = url.match(/v=([^&]+)/);
        return match ? match[1] : '';
    }

    async init() {
        if (!this.container) return;

        try {
            await this.renderYouTubeCards();
        } catch (error) {
            Utils.logError('YouTubeManager', 'Ошибка инициализации YouTube: ' + error);
            this.showYouTubeError();
        }
    }

    /**
     * Рендеринг YouTube карточек
     */
    async renderYouTubeCards() {
        const videoPromises = CONFIG.YOUTUBE.VIDEO_IDS.map(id =>
            APIManager.getYouTubeVideoData(id).catch(error => {
                Utils.logError('YouTubeManager', `Ошибка загрузки видео ${id}: ${error}`);
                return null;
            })
        );

        const videos = await Promise.all(videoPromises);
        const validVideos = videos.filter(video => video !== null);

        if (validVideos.length === 0) {
            this.showYouTubeError();
            return;
        }

        this.container.innerHTML = '';

        validVideos.forEach(video => {
            const card = this.createVideoCard(video);
            this.container.appendChild(card);
        });
    }

    /**
     * Создание карточки видео
     */
    createVideoCard(videoData) {
        const card = document.createElement('div');
        card.className = 'youtube-card';

        card.innerHTML = `
    <div class="video-frame">
      <iframe 
        width="100%" 
        height="260" 
        src="https://www.youtube.com/embed/${this.extractVideoId(videoData.url)}" 
        title="${videoData.title}" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    </div>
    <div class="video-info">
      <h3 class="title">${this.truncateTitle(videoData.title)}</h3>
      <div class="meta">
        <span>👁️ ${Utils.formatNumber(videoData.views)}</span>
        <span>💬 ${Utils.formatNumber(videoData.comments)}</span>
      </div>
    </div>
  `;

        return card;
    }

    /**
     * Обрезка длинных заголовков
     */
    truncateTitle(title, maxLength = 60) {
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    }

    /**
     * Показать ошибку YouTube
     */
    showYouTubeError() {
        if (this.container) {
            this.container.innerHTML = `
        <div class="youtube-error">
          <p>Не удалось загрузить видео</p>
          <button onclick="youTubeManager.init()">Попробовать снова</button>
        </div>
      `;
        }
    }
}

// ===== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЕМ STEAM =====
class SteamUserManager {
    constructor() {
        this.steamLoginBtn = Utils.$('.join-steam-btn'); // Кнопка "Steam Login"
        this.steamLogoutBtn = Utils.$('#steam-logout'); // Кнопка "Выйти"
        this.steamAvatar = Utils.$('#steam-avatar'); // Аватар в навигации
        this.steamWelcome = Utils.$('#steam-welcome'); // Приветствие на главной
        this.init();
    }

    async init() {
        console.log('SteamUserManager: Инициализация...');
        
        const steamId = this.getSteamIdFromURL();
        if (steamId) {
            console.log('SteamUserManager: SteamID найден в URL:', steamId);
            // Если SteamID есть в URL, значит это возврат после авторизации
            localStorage.setItem("steamId", steamId);
            history.replaceState({}, document.title, "/"); // Убираем steamid из URL
            await this.fetchAndDisplayUser(steamId);
        } else {
            // Проверяем, есть ли сохраненный ID (пользователь уже залогинен)
            const savedSteamId = localStorage.getItem("steamId");
            if (savedSteamId) {
                console.log('SteamUserManager: Найден сохраненный SteamID:', savedSteamId);
                await this.fetchAndDisplayUser(savedSteamId);
            } else {
                console.log('SteamUserManager: Пользователь не авторизован');
                this.showLoginState();
            }
        }

        // Добавляем обработчик события для кнопки выхода
        if (this.steamLogoutBtn) {
            this.steamLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // ТЕСТОВАЯ ФУНКЦИЯ - удалите после отладки
        this.addTestButton();
    }

    // ТЕСТОВАЯ ФУНКЦИЯ - удалите после отладки
    addTestButton() {
        const testBtn = document.createElement('button');
        testBtn.textContent = 'Тест авторизации';
        testBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px; background: red; color: white;';
        testBtn.onclick = () => {
            const testData = {
                personaname: 'Тестовый Игрок',
                avatarfull: 'https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg',
                profileurl: 'https://steamcommunity.com/profiles/76561198000000000'
            };
            console.log('Тестируем отображение с данными:', testData);
            this.displayUserInfo(testData);
            this.showLogoutState();
        };
        document.body.appendChild(testBtn);
    }

    /**
     * Получение Steam ID из URL
     */
    getSteamIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('steamid');
    }

    /**
     * Получение и отображение информации о пользователе
     */
    async fetchAndDisplayUser(steamId) {
        try {
            console.log('SteamUserManager: Получение данных пользователя для ID:', steamId);
            const userData = await APIManager.getSteamUserData(steamId);
            console.log('SteamUserManager: Полученные данные пользователя:', JSON.stringify(userData, null, 2));
            
            // Проверяем разные возможные форматы ответа
            let processedData = userData;
            
            // Если данные обернуты в response или data
            if (userData.response && userData.response.players && userData.response.players.length > 0) {
                processedData = userData.response.players[0];
                console.log('SteamUserManager: Используем формат Steam API response.players[0]');
            } else if (userData.data) {
                processedData = userData.data;
                console.log('SteamUserManager: Используем формат data wrapper');
            } else if (userData.player) {
                processedData = userData.player;
                console.log('SteamUserManager: Используем формат player wrapper');
            }
            
            console.log('SteamUserManager: Обработанные данные:', JSON.stringify(processedData, null, 2));
            this.displayUserInfo(processedData);
            this.showLogoutState();
        } catch (error) {
            Utils.logError('SteamUserManager', 'Ошибка получения данных пользователя: ' + error);
            console.error('SteamUserManager: Детали ошибки:', error);
            this.showLoginState();
            // Удаляем некорректный steamId из localStorage
            localStorage.removeItem("steamId");
        }
    }

    /**
     * Отображение информации о пользователе
     */
    displayUserInfo(userData) {
        console.log('SteamUserManager: Отображение данных пользователя:', JSON.stringify(userData, null, 2));
        
        if (!userData) {
            console.warn("SteamUserManager: userData is null or undefined");
            this.showLoginState();
            return;
        }

        // Пробуем разные возможные поля для имени пользователя
        const possibleNameFields = ['personaname', 'displayname', 'name', 'username', 'nickname'];
        const possibleAvatarFields = ['avatarfull', 'avatarmedium', 'avatar', 'avatar_url', 'avatarUrl'];
        const possibleProfileFields = ['profileurl', 'profile_url', 'profileUrl', 'url'];

        let userName = null;
        let userAvatar = null;
        let userProfile = null;

        // Ищем имя пользователя
        for (const field of possibleNameFields) {
            if (userData[field]) {
                userName = userData[field];
                console.log(`SteamUserManager: Найдено имя в поле "${field}":`, userName);
                break;
            }
        }

        // Ищем аватар
        for (const field of possibleAvatarFields) {
            if (userData[field]) {
                userAvatar = userData[field];
                console.log(`SteamUserManager: Найден аватар в поле "${field}":`, userAvatar);
                break;
            }
        }

        // Ищем профиль
        for (const field of possibleProfileFields) {
            if (userData[field]) {
                userProfile = userData[field];
                console.log(`SteamUserManager: Найден профиль в поле "${field}":`, userProfile);
                break;
            }
        }

        if (!userName) {
            console.warn("SteamUserManager: Не удалось найти имя пользователя в данных");
            console.warn("SteamUserManager: Доступные поля:", Object.keys(userData));
            this.showLoginState();
            return;
        }

        console.log('SteamUserManager: Отображение информации о пользователе');
        console.log('SteamUserManager: Имя:', userName);
        console.log('SteamUserManager: Аватар:', userAvatar);
        console.log('SteamUserManager: Профиль:', userProfile);

        // Отображаем аватар в навигации
        if (this.steamAvatar && userAvatar) {
            console.log('SteamUserManager: Устанавливаем аватар');
            this.steamAvatar.src = userAvatar;
            this.steamAvatar.style.display = 'block';
            this.steamAvatar.style.width = '40px';
            this.steamAvatar.style.height = '40px';
            this.steamAvatar.style.borderRadius = '50%';
            
            // Добавляем обработчик ошибки загрузки изображения
            this.steamAvatar.onerror = () => {
                console.error('SteamUserManager: Ошибка загрузки аватара:', userAvatar);
                this.steamAvatar.style.display = 'none';
            };
            
            this.steamAvatar.onload = () => {
                console.log('SteamUserManager: Аватар успешно загружен');
            };
        } else {
            console.warn('SteamUserManager: Аватар не найден или элемент отсутствует');
            console.warn('SteamUserManager: steamAvatar element:', this.steamAvatar);
            console.warn('SteamUserManager: userAvatar:', userAvatar);
        }

        // Отображаем приветствие на главной странице
        if (this.steamWelcome) {
            console.log('SteamUserManager: Устанавливаем приветствие');
            this.steamWelcome.textContent = `Добро пожаловать, ${userName}!`;
            this.steamWelcome.style.color = '#00d4ff';
            this.steamWelcome.style.textShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
        } else {
            console.warn('SteamUserManager: Элемент приветствия не найден');
        }

        console.log('SteamUserManager: Информация о пользователе успешно отображена');
    }

    /**
     * Показываем состояние "не залогинен"
     */
    showLoginState() {
        console.log('SteamUserManager: Переключение в состояние "не залогинен"');
        
        // Показываем кнопку входа
        Utils.toggleVisibility('.join-steam-btn', true);
        
        // Скрываем кнопку выхода
        Utils.toggleVisibility('#steam-logout', false);
        
        // Скрываем аватар
        if (this.steamAvatar) {
            this.steamAvatar.style.display = 'none';
            this.steamAvatar.src = '';
        }
        
        // Очищаем приветствие
        if (this.steamWelcome) {
            this.steamWelcome.textContent = '';
        }
    }

    /**
     * Показываем состояние "залогинен"
     */
    showLogoutState() {
        console.log('SteamUserManager: Переключение в состояние "залогинен"');
        
        // Скрываем кнопку входа
        Utils.toggleVisibility('.join-steam-btn', false);
        
        // Показываем кнопку выхода
        Utils.toggleVisibility('#steam-logout', true);
    }

    /**
     * Выход из аккаунта
     */
    logout() {
        console.log('SteamUserManager: Выход из аккаунта');
        
        localStorage.removeItem("steamId"); // Удаляем ID из хранилища
        this.showLoginState(); // Переключаемся в состояние "не залогинен"
        
        // Показываем уведомление
        alert('Вы успешно вышли из аккаунта');
    }
}

// ===== ГЛАВНЫЙ КЛАСС ПРИЛОЖЕНИЯ =====
class App {
    constructor() {
        this.managers = {};
        this.init();
    }

    /**
     * Инициализация приложения
     */
    async init() {
        try {
            // Ждем загрузки DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeManagers());
            } else {
                this.initializeManagers();
            }

            // Обработка ошибок
            this.setupErrorHandling();

            // Оптимизация производительности
            this.setupPerformanceOptimizations();

        } catch (error) {
            Utils.logError('App', 'Ошибка инициализации приложения: ' + error);
        }
    }

    /**
     * Инициализация всех менеджеров
     */
    initializeManagers() {
        try {
            this.managers.navigation = new NavigationManager();
            this.managers.animation = new AnimationManager();
            this.managers.stats = new StatsManager();
            this.managers.map = new MapManager();
            this.managers.youtube = new YouTubeManager();
            this.managers.steamUser = new SteamUserManager();

            console.log('✅ Все менеджеры инициализированы успешно');
        } catch (error) {
            Utils.logError('App', 'Ошибка инициализации менеджеров: ' + error);
        }
    }

    /**
     * Настройка обработки ошибок
     */
    setupErrorHandling() {
        // Глобальная обработка ошибок
        window.addEventListener('error', (event) => {
            Utils.logError('Global', `${event.message} в ${event.filename}:${event.lineno}`);
        });

        // Обработка ошибок Promise
        window.addEventListener('unhandledrejection', (event) => {
            Utils.logError('Promise', event.reason);
            event.preventDefault();
        });
    }

    /**
     * Оптимизация производительности
     */
    setupPerformanceOptimizations() {
        // Ленивая загрузка изображений
        if ('loading' in HTMLImageElement.prototype) {
            const images = Utils.$('img[loading="lazy"]');
            images.forEach(img => {
                if (!img.getAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
            });
        }

        // Предзагрузка критических ресурсов
        this.preloadCriticalResources();

        // Оптимизация скролла
        this.optimizeScrollPerformance();
    }

    /**
     * Предзагрузка критических ресурсов
     */
    preloadCriticalResources() {
        const criticalAPIs = [
            CONFIG.APIS.BATTLEMETRICS,
            CONFIG.APIS.DISCORD
        ];

        // Предзагружаем данные через 1 секунду после загрузки
        setTimeout(() => {
            criticalAPIs.forEach(url => {
                fetch(url).catch(() => { }); // Игнорируем ошибки предзагрузки
            });
        }, 1000);
    }

    /**
     * Оптимизация производительности скролла
     */
    optimizeScrollPerformance() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Очистка ресурсов
     */
    destroy() {
        Object.values(this.managers).forEach(manager => {
            if (manager.destroy && typeof manager.destroy === 'function') {
                manager.destroy();
            }
        });
    }
}

// ===== УТИЛИТЫ ДЛЯ АНИМАЦИИ ПЕЧАТИ =====
window.TypewriterUtils = {
    animate(element, options = {}) {
        const settings = {
            speed: 50,
            delay: 0,
            cursor: true,
            ...options
        };

        const text = element.textContent;
        element.textContent = '';

        setTimeout(() => {
            let i = 0;
            const timer = setInterval(() => {
                element.textContent = text.slice(0, ++i);

                if (i === text.length) {
                    clearInterval(timer);
                    if (!settings.cursor) {
                        element.style.borderRight = 'none';
                    }
                }
            }, settings.speed);

            if (settings.cursor) {
                element.style.borderRight = '2px solid var(--primary-color)';
                element.style.animation = 'blink 1s infinite';
            }
        }, settings.delay);
    }
};

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ =====
let app;
let navigationManager;
let statsManager;
let mapManager;
let youTubeManager;
let steamUserManager;

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    app = new App();

    // Экспорт менеджеров для глобального доступа
    window.addEventListener('load', () => {
        navigationManager = app.managers.navigation;
        statsManager = app.managers.stats;
        mapManager = app.managers.map;
        youTubeManager = app.managers.youtube;
        steamUserManager = app.managers.steamUser;
    });
});

// ===== СТИЛИ ДЛЯ АНИМАЦИИ ПЕЧАТИ =====
const style = document.createElement('style');
style.textContent = `
  @keyframes blink {
    0%, 50% { border-color: var(--primary-color); }
    51%, 100% { border-color: transparent; }
  }
  
  .youtube-error {
    text-align: center;
    padding: 2rem;
    color: var(--text-muted);
  }
  
  .youtube-error button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .youtube-error button:hover {
    background: var(--primary-hover);
  }
  
  /* Стили для аватара Steam */
  #steam-avatar {
    border: 2px solid var(--primary-color);
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
    transition: all 0.3s ease;
  }
  
  #steam-avatar:hover {
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.6);
    transform: scale(1.05);
  }
  
  /* Стили для приветствия */
  #steam-welcome {
    text-align: center;
    margin: 1rem 0;
    font-weight: bold;
    background: linear-gradient(45deg, #00d4ff, #0099cc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;
document.head.appendChild(style);

// Управление эффектами перехода полосок
// Простое управление плавным неоновым эффектом
class NeonTransitionManager {
    constructor() {
        this.init();
    }

    init() {
        this.startNeonAnimation();
    }

    startNeonAnimation() {
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            // Запускаем плавную анимацию с небольшой задержкой
            setTimeout(() => {
                statsContainer.classList.add('neon-active');
            }, 300);
        }
    }
}