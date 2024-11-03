let notificationContainer = document.getElementById('notificationContainer');

function showNotification(message, type) {
    let notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showErrorNotification(message) {
    showNotification(message, 'error');
}

function showSuccessNotification(message) {
    showNotification(message, 'success');
}