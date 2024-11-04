// Константы
const NOTIFICATION_DURATION = 3000;
const THEME_KEY = 'theme';
const DARK_THEME_CLASS = 'dark-theme';

// DOM элементы
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const notificationContainer = document.getElementById('notificationContainer');

// Обработчик переключения темы
const toggleTheme = () => {
    body.classList.toggle(DARK_THEME_CLASS);
    localStorage.setItem(THEME_KEY, body.classList.contains(DARK_THEME_CLASS) ? 'dark' : 'light');
};

// Инициализация темы
const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark') {
        body.classList.add(DARK_THEME_CLASS);
    }
};

// Создание уведомления
const createNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    return notification;
};

// Показ уведомления
const showNotification = (message, type) => {
    const notification = createNotification(message, type);
    notificationContainer.appendChild(notification);
    
    // Удаление уведомления после заданного времени
    setTimeout(() => {
        notification.classList.add('fade-out');
        notification.addEventListener('transitionend', () => {
            notification.remove();
        });
    }, NOTIFICATION_DURATION);
};

// Специфические типы уведомлений
const showErrorNotification = (message) => showNotification(message, 'error');
const showSuccessNotification = (message) => showNotification(message, 'success');

// Инициализация
const init = () => {
    initTheme();
    themeToggle.addEventListener('click', toggleTheme);
};

// Запуск инициализации при загрузке DOM
document.addEventListener('DOMContentLoaded', init);

// Экспорт функций для использования в других модулях
export { showNotification, showErrorNotification, showSuccessNotification };
