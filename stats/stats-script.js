// ===== УПРАВЛЕНИЕ ВКЛАДКАМИ =====
        class TabsManager {
            constructor() {
                this.tabButtons = document.querySelectorAll('.tab-button');
                this.tabPanels = document.querySelectorAll('.tab-panel');
                this.init();
            }

            init() {
                this.tabButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        const tabId = e.target.dataset.tab;
                        this.switchTab(tabId);
                    });
                });
            }

            switchTab(tabId) {
                // Удаляем активный класс со всех кнопок и панелей
                this.tabButtons.forEach(btn => btn.classList.remove('active'));
                this.tabPanels.forEach(panel => panel.classList.remove('active'));

                // Добавляем активный класс к выбранным элементам
                document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
                document.getElementById(tabId).classList.add('active');

                // Загружаем данные для вкладки (если нужно)
                this.loadTabData(tabId);
            }

            loadTabData(tabId) {
                switch(tabId) {
                    case 'players':
                        playersManager.loadPlayers();
                        break;
                    case 'clans':
                        // Загрузка данных кланов
                        break;
                    case 'weapons':
                        // Загрузка статистики оружия
                        break;
                    case 'events':
                        // Загрузка статистики событий
                        break;
                    case 'server':
                        // Загрузка серверной статистики
                        break;
                }
            }
        }

        // ===== УПРАВЛЕНИЕ ИГРОКАМИ =====
        class PlayersManager {
            constructor() {
                this.players = [];
                this.filteredPlayers = [];
                this.currentPage = 1;
                this.playersPerPage = 20;
                this.sortBy = 'kills';
                this.sortOrder = 'desc';
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.loadPlayers();
            }

            setupEventListeners() {
                // Поиск
                const searchInput = document.getElementById('playerSearch');
                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        this.filterPlayers(e.target.value);
                    });
                }

                // Сортировка
                const sortSelect = document.getElementById('sortBy');
                if (sortSelect) {
                    sortSelect.addEventListener('change', (e) => {
                        this.sortBy = e.target.value;
                        this.sortPlayers();
                    });
                }

                // Сортировка по заголовкам таблицы
                document.querySelectorAll('.players-table th[data-sort]').forEach(th => {
                    th.addEventListener('click', (e) => {
                        const sortKey = e.target.dataset.sort;
                        this.handleColumnSort(sortKey);
                    });
                });
            }

            async loadPlayers() {
                // Показываем загрузку
                this.showLoading();

                try {
                    // Генерируем тестовые данные (в реальном проекте здесь будет API запрос)
                    this.players = this.generateTestPlayers();
                    this.filteredPlayers = [...this.players];
                    this.renderPlayers();
                } catch (error) {
                    console.error('Ошибка загрузки игроков:', error);
                    this.showError();
                } finally {
                    this.hideLoading();
                }
            }

            generateTestPlayers() {
                const names = [
                    'RustMaster2024', 'PvPKing', 'SniperElite', 'BuilderPro', 'RaidLord',
                    'SurvivalGod', 'HeadshotHero', 'FarmBot', 'ToxicPlayer', 'FriendlyGamer',
                    'AK47Master', 'CrossbowSniper', 'ExplosiveExpert', 'StealthNinja', 'MedicalSupport',
                    'ResourceHoarder', 'BaseDefender', 'WipeWarrior', 'ClanLeader', 'SoloSurvivor',
                    'RustVeteran', 'NewbieCrusher', 'EliteGamer', 'ProBuilder', 'RaidMaster',
                    'PvPGod', 'SniperKing', 'ExplosiveMaster', 'BuilderKing', 'FarmLord'
                ];

                return names.map((name, index) => ({
                    rank: index + 1,
                    name: name,
                    avatar: `https://via.placeholder.com/40x40/333/fff?text=${name[0]}`,
                    level: Math.floor(Math.random() * 100) + 1,
                    kills: Math.floor(Math.random() * 5000) + 100,
                    deaths: Math.floor(Math.random() * 3000) + 50,
                    headshots: Math.floor(Math.random() * 1000) + 10,
                    accuracy: (Math.random() * 80 + 20).toFixed(1),
                    playtime: Math.floor(Math.random() * 500) + 10,
                    lastSeen: this.getRandomDate()
                })).map(player => ({
                    ...player,
                    kdr: (player.kills / Math.max(player.deaths, 1)).toFixed(2)
                })).sort((a, b) => b.kills - a.kills);
            }

            getRandomDate() {
                const now = new Date();
                const daysAgo = Math.floor(Math.random() * 30);
                const date = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
                return date.toLocaleDateString('ru-RU');
            }

            filterPlayers(searchTerm) {
                if (!searchTerm.trim()) {
                    this.filteredPlayers = [...this.players];
                } else {
                    this.filteredPlayers = this.players.filter(player =>
                        player.name.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }
                this.currentPage = 1;
                this.renderPlayers();
            }

            handleColumnSort(sortKey) {
                if (this.sortBy === sortKey) {
                    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortBy = sortKey;
                    this.sortOrder = 'desc';
                }
                
                this.updateSortHeaders();
                this.sortPlayers();
            }

            updateSortHeaders() {
                document.querySelectorAll('.players-table th').forEach(th => {
                    th.classList.remove('sorted-asc', 'sorted-desc');
                });
                
                const currentHeader = document.querySelector(`[data-sort="${this.sortBy}"]`);
                if (currentHeader) {
                    currentHeader.classList.add(`sorted-${this.sortOrder}`);
                }
            }

            sortPlayers() {
                this.filteredPlayers.sort((a, b) => {
                    let aVal = a[this.sortBy];
                    let bVal = b[this.sortBy];

                    // Преобразуем строки в числа для числовых полей
                    if (['kills', 'deaths', 'level', 'headshots', 'playtime', 'kdr', 'accuracy'].includes(this.sortBy)) {
                        aVal = parseFloat(aVal);
                        bVal = parseFloat(bVal);
                    }

                    if (this.sortOrder === 'asc') {
                        return aVal > bVal ? 1 : -1;
                    } else {
                        return aVal < bVal ? 1 : -1;
                    }
                });

                this.renderPlayers();
            }

            renderPlayers() {
                const tbody = document.getElementById('playersTableBody');
                if (!tbody) return;

                const startIndex = (this.currentPage - 1) * this.playersPerPage;
                const endIndex = startIndex + this.playersPerPage;
                const playersToShow = this.filteredPlayers.slice(startIndex, endIndex);

                if (playersToShow.length === 0) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="9" class="empty-state">
                                <div class="icon">😔</div>
                                <p>Игроки не найдены</p>
                            </td>
                        </tr>
                    `;
                    return;
                }

                tbody.innerHTML = playersToShow.map((player, index) => {
                    const globalRank = startIndex + index + 1;
                    const rankBadge = this.getRankBadge(globalRank);
                    
                    return `
                        <tr>
                            <td>${rankBadge}</td>
                            <td>
                                <div class="player-info">
                                    <img src="${player.avatar}" alt="${player.name}" class="player-avatar">
                                    <div class="player-details">
                                        <h4>${player.name}</h4>
                                        <span>Был в сети: ${player.lastSeen}</span>
                                    </div>
                                </div>
                            </td>
                            <td><span class="stat-value">${player.level}</span></td>
                            <td><span class="stat-value stat-positive">${player.kills.toLocaleString()}</span></td>
                            <td><span class="stat-value stat-negative">${player.deaths.toLocaleString()}</span></td>
                            <td><span class="stat-value stat-neutral">${player.kdr}</span></td>
                            <td><span class="stat-value stat-positive">${player.headshots.toLocaleString()}</span></td>
                            <td><span class="stat-value">${player.accuracy}%</span></td>
                            <td><span class="stat-value" style="min-width:60px;">${player.playtime}ч</span></td>
                        </tr>
                    `;
                }).join('');

                this.renderPagination();
            }

            getRankBadge(rank) {
                let className = 'rank-badge ';
                if (rank === 1) className += 'rank-1';
                else if (rank === 2) className += 'rank-2';
                else if (rank === 3) className += 'rank-3';
                else className += 'rank-other';

                return `<span class="${className}">${rank}</span>`;
            }

            renderPagination() {
                const totalPages = Math.ceil(this.filteredPlayers.length / this.playersPerPage);
                const pagination = document.getElementById('pagination');
                
                if (!pagination || totalPages <= 1) {
                    if (pagination) pagination.style.display = 'none';
                    return;
                }

                pagination.style.display = 'flex';
                
                let paginationHTML = `
                    <button ${this.currentPage === 1 ? 'disabled' : ''} onclick="playersManager.goToPage(${this.currentPage - 1})">
                        ← Предыдущая
                    </button>
                `;

                // Показываем первые 3 страницы, текущую и последние
                for (let i = 1; i <= Math.min(3, totalPages); i++) {
                    paginationHTML += `
                        <button class="${i === this.currentPage ? 'active' : ''}" onclick="playersManager.goToPage(${i})">
                            ${i}
                        </button>
                    `;
                }

                if (totalPages > 5) {
                    paginationHTML += '<button disabled>...</button>';
                    paginationHTML += `
                        <button class="${totalPages === this.currentPage ? 'active' : ''}" onclick="playersManager.goToPage(${totalPages})">
                            ${totalPages}
                        </button>
                    `;
                }

                paginationHTML += `
                    <button ${this.currentPage === totalPages ? 'disabled' : ''} onclick="playersManager.goToPage(${this.currentPage + 1})">
                        Следующая →
                    </button>
                `;

                pagination.innerHTML = paginationHTML;
            }

            goToPage(page) {
                const totalPages = Math.ceil(this.filteredPlayers.length / this.playersPerPage);
                if (page >= 1 && page <= totalPages) {
                    this.currentPage = page;
                    this.renderPlayers();
                }
            }

            showLoading() {
                const tbody = document.getElementById('playersTableBody');
                if (tbody) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="9" class="loading-spinner">
                                <div class="spinner"></div>
                            </td>
                        </tr>
                    `;
                }
            }

            hideLoading() {
                // Загрузка скрывается автоматически при рендере данных
            }

            showError() {
                const tbody = document.getElementById('playersTableBody');
                if (tbody) {
                    tbody.innerHTML = `
                        <tr>
                            <td colspan="9" class="empty-state">
                                <div class="icon">❌</div>
                                <p>Ошибка загрузки данных</p>
                                <button onclick="playersManager.loadPlayers()" class="cta-button primary" style="margin-top: 1rem;">
                                    Попробовать снова
                                </button>
                            </td>
                        </tr>
                    `;
                }
            }
        }

        // ===== НАВИГАЦИЯ (упрощенная версия) =====
        class SimpleNavigation {
            constructor() {
                this.init();
            }

            init() {
                // Мобильное меню
                const mobileToggle = document.getElementById('mobile-toggle');
                const navLinks = document.getElementById('nav-links');

                if (mobileToggle && navLinks) {
                    mobileToggle.addEventListener('click', () => {
                        navLinks.classList.toggle('active');
                        mobileToggle.classList.toggle('active');
                    });
                }

                // Эффекты скролла для navbar
                this.setupScrollEffects();
            }

            setupScrollEffects() {
                const navbar = document.getElementById('navbar');
                if (!navbar) return;

                window.addEventListener('scroll', () => {
                    const scrollY = window.scrollY;
                    const opacity = Math.min(scrollY / 100, 1);
                    navbar.style.backgroundColor = `rgba(0, 0, 0, ${0.6 + opacity * 0.3})`;
                }, { passive: true });
            }
        }

        // ===== ИНИЦИАЛИЗАЦИЯ =====
        let tabsManager;
        let playersManager;
        let navigation;

        document.addEventListener('DOMContentLoaded', () => {
            tabsManager = new TabsManager();
            playersManager = new PlayersManager();
            navigation = new SimpleNavigation();
        });

        // ===== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ =====
        
        // Подключение к серверу
        document.addEventListener('DOMContentLoaded', () => {
            const joinButtons = document.querySelectorAll('.join-server-btn[href*="steam://"]');
            joinButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // На мобильных устройствах показываем инструкцию
                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        e.preventDefault();
                        alert('Для подключения к серверу:\n1. Откройте Steam\n2. Нажмите F1 в игре Rust\n3. Введите: client.connect 203.16.163.232:28834');
                    }
                });
            });
        });

        // Анимация счетчиков
        function animateCounters() {
            const counters = document.querySelectorAll('.big-number');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent.replace(/,/g, ''));
                if (isNaN(target)) return;

                let current = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current).toLocaleString();
                }, 20);
            });
        }

        // Запускаем анимацию при загрузке
        window.addEventListener('load', () => {
            setTimeout(animateCounters, 500);
        });



        // ===== УПРАВЛЕНИЕ ВИДЕО ФОНОМ =====
class VideoBackground {
    constructor() {
        this.video = document.querySelector('.video-background video');
        this.init();
    }

    init() {
        if (!this.video) return;

        // Обработчики событий видео
        this.video.addEventListener('loadeddata', () => {
            console.log('Видео загружено');
        });

        this.video.addEventListener('error', (e) => {
            console.error('Ошибка загрузки видео:', e);
            this.handleVideoError();
        });

        // Попытка принудительного воспроизведения
        this.video.play().catch(e => {
            console.warn('Автовоспроизведение заблокировано:', e);
        });
    }

    handleVideoError() {
        const videoContainer = document.querySelector('.video-background');
        if (videoContainer) {
            videoContainer.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
        }
    }
}

// Добавьте в инициализацию
document.addEventListener('DOMContentLoaded', () => {
    tabsManager = new TabsManager();
    playersManager = new PlayersManager();
    navigation = new SimpleNavigation();
    
    // Добавьте эту строку
    const videoBackground = new VideoBackground();
});