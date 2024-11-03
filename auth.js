// auth.js

class Auth {
    constructor() {
        this.tokenKey = 'authToken';
        this.userKey = 'currentUser';
        this.usersKey = 'users';
        this.loginBtn = document.getElementById('loginBtn');
        this.profileSection = document.getElementById('profileSection');
        this.profileUsername = document.getElementById('profileUsername');
        this.profileSubscription = document.getElementById('profileSubscription');
        this.profileAvatar = document.getElementById('profileAvatar');

        this.init();
    }

    init() {
        this.loginBtn.addEventListener('click', () => this.redirectToLogin());
        this.checkAuth();
        this.initializeUsers();
    }

    initializeUsers() {
        if (!localStorage.getItem(this.usersKey)) {
            const initialUsers = [
                {
                    id: 1,
                    username: 'user1',
                    email: 'user1@example.com',
                    password: 'password1',
                    avatar: 'avatar1.png',
                    subscription: 'Premium'
                },
                {
                    id: 2,
                    username: 'user2',
                    email: 'user2@example.com',
                    password: 'password2',
                    avatar: 'avatar2.png',
                    subscription: 'Standard'
                }
            ];
            localStorage.setItem(this.usersKey, JSON.stringify(initialUsers));
        }
    }

    checkAuth() {
        const token = this.getToken();
        if (token) {
            const user = this.getUserByToken(token);
            if (user) {
                this.updateUIForAuthenticatedUser(user);
            } else {
                this.logout();
            }
        } else {
            this.updateUIForUnauthenticatedUser();
        }
    }

    getUserByToken(token) {
        const users = JSON.parse(localStorage.getItem(this.usersKey));
        return users.find(user => user.id === parseInt(token));
    }

    login(email, password) {
        const users = JSON.parse(localStorage.getItem(this.usersKey));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.setToken(user.id.toString());
            this.setUser(user);
            this.updateUIForAuthenticatedUser(user);
            this.showNotification('Вы успешно вошли в систему!', 'success');
            return true;
        } else {
            this.showNotification('Неверный email или пароль', 'error');
            return false;
        }
    }

    register(username, email, password) {
        const users = JSON.parse(localStorage.getItem(this.usersKey));
        if (users.some(u => u.email === email)) {
            this.showNotification('Пользователь с таким email уже существует', 'error');
            return false;
        }

        const newUser = {
            id: users.length + 1,
            username,
            email,
            password,
            avatar: 'default-avatar.png',
            subscription: 'Standard'
        };

        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));

        this.setToken(newUser.id.toString());
        this.setUser(newUser);
        this.updateUIForAuthenticatedUser(newUser);
        this.showNotification('Вы успешно зарегистрировались!', 'success');
        return true;
    }

    logout() {
        this.removeToken();
        this.removeUser();
        this.updateUIForUnauthenticatedUser();
        this.showNotification('Вы вышли из системы', 'success');
    }

    updateUIForAuthenticatedUser(user) {
        this.loginBtn.style.display = 'none';
        this.profileSection.style.display = 'flex';
        this.profileUsername.textContent = user.username;
        this.profileSubscription.textContent = user.subscription;
        this.profileAvatar.src = user.avatar;
    }

    updateUIForUnauthenticatedUser() {
        this.loginBtn.style.display = 'flex';
        this.profileSection.style.display = 'none';
    }

    redirectToLogin() {
        window.location.href = 'login.html';
    }

    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    removeToken() {
        localStorage.removeItem(this.tokenKey);
    }

    setUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    getUser() {
        const userJson = localStorage.getItem(this.userKey);
        return userJson ? JSON.parse(userJson) : null;
    }

    removeUser() {
        localStorage.removeItem(this.userKey);
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    showNotification(message, type) {
        // Предполагается, что у вас есть функция showNotification из предыдущего кода
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Инициализация аутентификации
const auth = new Auth();

// Экспорт для использования в других модулях
export default auth;