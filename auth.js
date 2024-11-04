// auth.js

class Auth {
    // Константы для ключей хранилища
    static STORAGE_KEYS = {
        TOKEN: 'authToken',
        USER: 'currentUser',
        USERS: 'users'
    };

    constructor() {
        // DOM элементы
        this.elements = {
            loginBtn: document.getElementById('loginBtn'),
            profileSection: document.getElementById('profileSection'),
            profileUsername: document.getElementById('profileUsername'),
            profileSubscription: document.getElementById('profileSubscription'),
            profileAvatar: document.getElementById('profileAvatar')
        };

        this.init();
    }

    async init() {
        try {
            this.elements.loginBtn?.addEventListener('click', () => this.redirectToLogin());
            await this.checkAuth();
            this.initializeUsers();
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            this.showNotification('Ошибка инициализации системы', 'error');
        }
    }

    initializeUsers() {
        if (!localStorage.getItem(Auth.STORAGE_KEYS.USERS)) {
            const initialUsers = [
                {
                    id: 1,
                    username: 'user1',
                    email: 'user1@example.com',
                    password: this.hashPassword('password1'), // Хеширование пароля
                    avatar: 'avatar1.png',
                    subscription: 'Premium',
                    createdAt: new Date().toISOString()
                },
                // Другие пользователи...
            ];
            this.saveUsers(initialUsers);
        }
    }

    async checkAuth() {
        const token = this.getToken();
        if (token) {
            const user = await this.validateToken(token);
            if (user) {
                this.updateUIForAuthenticatedUser(user);
            } else {
                await this.logout();
            }
        } else {
            this.updateUIForUnauthenticatedUser();
        }
    }

    async validateToken(token) {
        try {
            // Здесь должна быть реальная проверка токена на сервере
            const user = this.getUserByToken(token);
            return user && this.isTokenValid(token) ? user : null;
        } catch (error) {
            console.error('Ошибка валидации токена:', error);
            return null;
        }
    }

    async login(email, password) {
        try {
            const hashedPassword = this.hashPassword(password);
            const users = this.getUsers();
            const user = users.find(u => 
                u.email === email && 
                u.password === hashedPassword
            );
            
            if (user) {
                const token = this.generateToken();
                this.setToken(token);
                this.setUser(user);
                this.updateUIForAuthenticatedUser(user);
                this.showNotification('Успешный вход в систему', 'success');
                return true;
            }
            
            this.showNotification('Неверные учетные данные', 'error');
            return false;
        } catch (error) {
            console.error('Ошибка входа:', error);
            this.showNotification('Ошибка при входе в систему', 'error');
            return false;
        }
    }

    async register(username, email, password) {
        try {
            const users = this.getUsers();
            if (users.some(u => u.email === email)) {
                this.showNotification('Email уже используется', 'error');
                return false;
            }

            const newUser = {
                id: this.generateUserId(),
                username,
                email,
                password: this.hashPassword(password),
                avatar: 'default-avatar.png',
                subscription: 'Standard',
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            this.saveUsers(users);

            const token = this.generateToken();
            this.setToken(token);
            this.setUser(newUser);
            
            this.updateUIForAuthenticatedUser(newUser);
            this.showNotification('Регистрация успешна', 'success');
            return true;
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            this.showNotification('Ошибка при регистрации', 'error');
            return false;
        }
    }

    async logout() {
        try {
            this.removeToken();
            this.removeUser();
            this.updateUIForUnauthenticatedUser();
            this.showNotification('Выход выполнен успешно', 'success');
        } catch (error) {
            console.error('Ошибка выхода:', error);
            this.showNotification('Ошибка при выходе из системы', 'error');
        }
    }

    // UI методы
    updateUIForAuthenticatedUser(user) {
        if (!user) return;

        const { loginBtn, profileSection, profileUsername, 
                profileSubscription, profileAvatar } = this.elements;

        loginBtn.style.display = 'none';
        profileSection.style.display = 'flex';
        profileUsername.textContent = user.username;
        profileSubscription.textContent = user.subscription;
        profileAvatar.src = user.avatar;
    }

    updateUIForUnauthenticatedUser() {
        const { loginBtn, profileSection } = this.elements;
        loginBtn.style.display = 'flex';
        profileSection.style.display = 'none';
    }

    // Вспомогательные методы
    generateToken() {
        return Math.random().toString(36).substr(2) + Date.now().toString(36);
    }

    generateUserId() {
        return Date.now() + Math.random().toString(36).substr(2);
    }

    hashPassword(password) {
        // В реальном приложении использовать криптографические функции
        return btoa(password); // Простое кодирование для демонстрации
    }

    isTokenValid(token) {
        // Здесь должна быть реальная проверка валидности токена
        return true;
    }

    // Методы работы с хранилищем
    getToken() {
        return localStorage.getItem(Auth.STORAGE_KEYS.TOKEN);
    }

    setToken(token) {
        localStorage.setItem(Auth.STORAGE_KEYS.TOKEN, token);
    }

    removeToken() {
        localStorage.removeItem(Auth.STORAGE_KEYS.TOKEN);
    }

    getUser() {
        const userJson = localStorage.getItem(Auth.STORAGE_KEYS.USER);
        return userJson ? JSON.parse(userJson) : null;
    }

    setUser(user) {
        localStorage.setItem(Auth.STORAGE_KEYS.USER, JSON.stringify(user));
    }

    removeUser() {
        localStorage.removeItem(Auth.STORAGE_KEYS.USER);
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(Auth.STORAGE_KEYS.USERS) || '[]');
    }

    saveUsers(users) {
        localStorage.setItem(Auth.STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    showNotification(message, type) {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Экспорт экземпляра класса
export default new Auth();
