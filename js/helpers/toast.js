function createToastContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed z-[999] flex flex-col gap-2.5 right-6 bottom-6';
        document.body.appendChild(container);
    }
    return container;
}

export function showToast(message, type) {
    if (!type) type = 'success';
    const container = createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 3000);
  }