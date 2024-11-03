let themeToggle = document.getElementById('themeToggle');
let body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    setLocalStorage('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
});

if (getLocalStorage('theme') === 'dark') {
    body.classList.add('dark-theme');
}