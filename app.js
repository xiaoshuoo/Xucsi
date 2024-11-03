// app.js

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация приложения
    initApp();
});

function initApp() {
    // Элементы DOM
    const ctaBtn = document.getElementById('cta-btn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const loadingScreen = document.getElementById('loadingScreen');

    // Обработчики событий
    ctaBtn.addEventListener('click', handleCtaClick);
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', throttle(handleScroll, 200));

    // Инициализация компонентов
    initializeGames();
    initializeAchievements();
    checkAuthentication();

    // Убираем экран загрузки
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1000);
}

function handleCtaClick(event) {
    event.preventDefault();
    // Проверяем, авторизован ли пользователь
    if (isAuthenticated()) {
        showNotification('Вы уже зарегистрированы!', 'info');
    } else {
        window.location.href = 'register.html';
    }
}

function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('show');
}

function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function initializeGames() {
    // Здесь может быть логика загрузки игр с сервера
    console.log('Инициализация игр...');
    // Пример: fetchGames().then(renderGames);
}

function initializeAchievements() {
    // Здесь может быть логика загрузки достижений пользователя
    console.log('Инициализация достижений...');
    // Пример: fetchAchievements().then(renderAchievements);
}

function checkAuthentication() {
    const token = getLocalStorage('authToken');
    if (token) {
        // Проверка токена на сервере
        validateToken(token)
            .then(response => {
                if (response.valid) {
                    updateUIForAuthenticatedUser(response.user);
                } else {
                    handleInvalidToken();
                }
            })
            .catch(error => {
                console.error('Ошибка при проверке токена:', error);
                handleInvalidToken();
            });
    } else {
        updateUIForUnauthenticatedUser();
    }
}

function validateToken(token) {
    // Здесь должен быть реальный запрос к серверу
    return new Promise((resolve) => {
        setTimeout(() => {
            // Имитация ответа сервера
            resolve({
                valid: true,
                user: {
                    username: 'JohnDoe',
                    avatar: 'avatar.png',
                    subscription: 'Premium'
                }
            });
        }, 1000);
    });
}

function updateUIForAuthenticatedUser(user) {
    const loginBtn = document.getElementById('loginBtn');
    const profileSection = document.getElementById('profileSection');
    const profileUsername = document.getElementById('profileUsername');
    const profileSubscription = document.getElementById('profileSubscription');
    const profileAvatar = document.getElementById('profileAvatar');

    loginBtn.style.display = 'none';
    profileSection.style.display = 'flex';
    profileUsername.textContent = user.username;
    profileSubscription.textContent = user.subscription;
    profileAvatar.src = user.avatar;

    showNotification(`Добро пожаловать, ${user.username}!`, 'success');
}

function updateUIForUnauthenticatedUser() {
    const loginBtn = document.getElementById('loginBtn');
    const profileSection = document.getElementById('profileSection');

    loginBtn.style.display = 'flex';
    profileSection.style.display = 'none';
}

function handleInvalidToken() {
    removeLocalStorage('authToken');
    updateUIForUnauthenticatedUser();
    showNotification('Сессия истекла. Пожалуйста, войдите снова.', 'warning');
}

function isAuthenticated() {
    return !!getLocalStorage('authToken');
}

// Дополнительные вспомогательные функции

function fetchGames() {
    // Здесь должен быть реальный запрос к API
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, title: 'Awesome Game 1', image: 'game1.jpg' },
                { id: 2, title: 'Awesome Game 2', image: 'game2.jpg' },
                { id: 3, title: 'Awesome Game 3', image: 'game3.jpg' },
            ]);
        }, 1000);
    });
}

function renderGames(games) {
    const gamesContainer = document.querySelector('.games-grid');
    if (!gamesContainer) return;

    gamesContainer.innerHTML = '';
    games.forEach(game => {
        const gameElement = createGameElement(game);
        gamesContainer.appendChild(gameElement);
    });
}

function createGameElement(game) {
    const gameElement = document.createElement('div');
    gameElement.classList.add('game-card');
    gameElement.innerHTML = `
        <img src="${game.image}" alt="${game.title}" class="game-image">
        <div class="game-info">
            <h3>${game.title}</h3>
            <button class="btn btn-primary">Играть</button>
        </div>
    `;
    return gameElement;
}

// Запуск приложения
initApp();