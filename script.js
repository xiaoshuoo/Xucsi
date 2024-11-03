class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [
            {
                id: 1,
                username: 'user1',
                email: 'user1@example.com',
                password: 'password1',
                avatar: 'avatar1.png',
                subscription: 'Premium',
                games: 15,
                friends: 30
            },
            {
                id: 2,
                username: 'user2',
                email: 'user2@example.com',
                password: 'password2',
                avatar: 'avatar2.png',
                subscription: 'Standard',
                games: 5,
                friends: 10
            },
            {
                id: 3,
                username: 'user3',
                email: 'user3@example.com',
                password: 'password3',
                avatar: 'avatar3.png',
                subscription: 'Premium',
                games: 20,
                friends: 40
            }
        ];
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('loggedInUserId', user.id);
            return true;
        }
        return false;
    }

    register(username, email, password) {
        const user = this.users.find(u => u.email === email);
        if (!user) {
            const newUser = {
                id: this.users.length + 1,
                username,
                email,
                password,
                avatar: 'avatar.png',
                subscription: 'Standard',
                games: 0,
                friends: 0
            };
            this.users.push(newUser);
            localStorage.setItem('users', JSON.stringify(this.users));
            localStorage.setItem('loggedInUserId', newUser.id);
            return true;
        }
        return false;
    }

    getUser(id) {
        return this.users.find(u => u.id === id);
    }
}

const userManager = new UserManager();

// Обновление информации профиля
function updateProfileInfo(user) {
    const profilePageAvatar = document.querySelector('#profilePageAvatar');
    const profilePageUsername = document.querySelector('#profilePageUsername');
    const profilePageEmail = document.querySelector('#profilePageEmail');
    const profilePageSubscription = document.querySelector('#profilePageSubscription');
    const profilePageGames = document.querySelector('#profilePageGames');
    const profilePageFriends = document.querySelector('#profilePageFriends');

    profilePageAvatar.src = user.avatar;
    profilePageUsername.textContent = user.username;
    profilePageEmail.textContent = user.email;
    profilePageSubscription.textContent = user.subscription;
    profilePageGames.textContent = user.games;
    profilePageFriends.textContent = user.friends;
}

// Проверка авторизации
const loggedInUserId = localStorage.getItem('loggedInUserId');
if (loggedInUserId) {
    const user = userManager.getUser(parseInt(loggedInUserId));
    if (user) {
        updateProfileInfo(user);
    } else {
        localStorage.removeItem('loggedInUserId');
    }
}

// Обработка формы регистрации
const registerForm = document.querySelector('#registerForm');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    if (password === confirmPassword) {
        if (userManager.register(username, email, password)) {
            window.location.href = 'profile.html';
        } else {
            alert('Email уже занят');
        }
    } else {
        alert('Пароли не совпадают');
    }
});