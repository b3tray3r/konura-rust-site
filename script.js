// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Анимация появления блоков
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Запуск анимации печати для заголовков в этом блоке
            const headings = entry.target.querySelectorAll('h2, h3, h4');
            headings.forEach((heading, index) => {
                if (!heading.hasAttribute('data-typewriter-animated')) {
                    heading.setAttribute('data-typewriter-animated', 'true');
                    setTimeout(() => {
                        if (window.TypewriterUtils) {
                            window.TypewriterUtils.animate(heading, {
                                speed: 60,
                                delay: index * 300,
                                cursor: false
                            });
                        }
                    }, 200);
                }
            });
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.content-item, .map-section, .feature-item, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Кнопки подключения
document.querySelectorAll('.cta-button, .join-server-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        if (btn.getAttribute('href') === '#join') {
            e.preventDefault();
            alert('IP сервера: rust.konura.ru:28015\nСкопируйте адрес в консоль F1 в Rust: client.connect rust.konura.ru:28015');
        }
    });
});

// Запрос к твоему Ktor-серверу для получения данных Discord
async function fetchDiscordStats() {
    try {
        const response = await fetch('https://ktor-server-u2py.onrender.com/discord');
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка при получении данных Discord с сервера:', error);
        return null;
    }
}

// Главная функция обновления статистики
async function updateStats() {
    try {
        // Данные Rust с BattleMetrics
        const rustRes = await fetch('https://api.battlemetrics.com/servers/34847101');
        const rustData = await rustRes.json();
        const players = rustData.data.attributes.players;
        const maxPlayers = rustData.data.attributes.maxPlayers;
        const serverStatus = rustData.data.attributes.status;

        document.getElementById('rust-players').textContent = `${players}/${maxPlayers}`;
        document.getElementById('rust-fill').style.width = `${(players / maxPlayers) * 100}%`;
        document.getElementById('rust-percent').textContent = `${Math.round((players / maxPlayers) * 100)}% заполненность`;

        // Обновление статуса
        const statusSpan = document.querySelector('.status-online');
        if (serverStatus === 'online') {
            statusSpan.textContent = 'Онлайн';
            statusSpan.style.backgroundColor = '#00cc66';
            statusSpan.style.fontWeight = 'Bold';
            statusSpan.style.color = 'Black';
            statusSpan.style.padding = '4px 12px';
            statusSpan.style.borderRadius = '6px';
        } else {
            statusSpan.textContent = 'Оффлайн';
            statusSpan.style.backgroundColor = 'red';
            statusSpan.style.fontWeight = 'Bold';
            statusSpan.style.color = 'white';
            statusSpan.style.padding = '4px 12px';
            statusSpan.style.borderRadius = '6px';
        }

        // Данные Discord через сервер Ktor
        const discordData = await fetchDiscordStats();
        if (discordData) {
            document.getElementById('discord-total').textContent = discordData.approximate_member_count ?? '—';
            document.getElementById('discord-online').textContent = discordData.approximate_presence_count ?? '—';
        } else {
            document.getElementById('discord-total').textContent = '—';
            document.getElementById('discord-online').textContent = '—';
        }

    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

async function updateServerInfo() {
    try {
        const response = await fetch('https://api.battlemetrics.com/servers/34847101');
        const data = await response.json();

        // Дата последнего вайпа
        const lastWipeStr = data.data.attributes.details.rust_last_wipe;
        const lastWipeDate = new Date(lastWipeStr);

        // Выводим дату вайпа
        document.getElementById('wipe-date-value').textContent = lastWipeDate.toLocaleDateString();

        function updateTimeSinceWipe() {
            const now = new Date();
            const diffMs = now - lastWipeDate;

            const seconds = Math.floor((diffMs / 1000) % 60);
            const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
            const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));


            let timeString = '';
                if (days > 0) {
                timeString += `${days}д `;
                }
                timeString += `  ${hours}ч ${minutes}м ${seconds}с`;

                document.getElementById('wipe-time-value').textContent =
                timeString
        }

        // Сразу обновляем
        updateTimeSinceWipe();

        // И запускаем обновление каждую секунду
        setInterval(updateTimeSinceWipe, 1000);

    } catch (error) {
        console.error('Ошибка загрузки информации о сервере:', error);
    }
}

async function fetchSteamUser() {
    const params = new URLSearchParams(window.location.search);
    const steamId = params.get('steamid');
    if (!steamId) return;

    const res = await fetch(`https://ktor-server-u2py.onrender.com/steam/userinfo/${steamId}`);
    if (!res.ok) return;

    const user = await res.json();
    document.getElementById('username').textContent = user.name;
    document.getElementById('avatar').src = user.avatar;
    document.getElementById('profile').href = user.profile;
  }




async function updateMapInfo() {
    try {
        const response = await fetch('https://api.battlemetrics.com/servers/34847101');
        const data = await response.json();
        const mapData = data.data.attributes.details.rust_maps;

        // Название и размер карты
        document.getElementById('map-name').textContent = data.data.attributes.details.map || 'Неизвестна';
        document.getElementById('map-size').textContent = `${mapData.size} м`;
        document.getElementById('map-monuments').textContent = Object.keys(mapData.monumentCounts).length;

        // Изображение карты и ссылка
        document.getElementById('map-thumbnail').src = mapData.thumbnailUrl;
        document.getElementById('map-link').href = mapData.url;
    } catch (error) {
        console.error('Ошибка загрузки карты:', error);
    }
}




updateMapInfo();
fetchSteamUser();

updateServerInfo(); // вызываем при загрузке


// Запуск после загрузки страницы
window.addEventListener('load', updateStats);
