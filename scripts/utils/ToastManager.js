export class ToastManager {
  constructor(maxToasts = 3, className, type) {
    this.activeToasts = 0;
    this.maxToasts = maxToasts;
    this.className = className;
    this.type = type;
    this.activeMessages = new Set();
  }

  #renderIcon() {
    switch (this.type) {
      case 'error':
        return `<svg width="20" height="20" fill="red">
            <use href="../../assets/icons/icons.svg#validationErrorIcon"></use>
          </svg>`;
      case 'success':
        return `<svg width="20" height="20" fill="#008A2E">
            <use href="../../assets/icons/icons.svg#validationSuccessIcon"></use>
          </svg>`;
    }
  }

  showToast(message) {
    if (this.activeToasts >= this.maxToasts || this.activeMessages.has(message)) return;

    this.activeToasts++;
    this.activeMessages.add(message);

    Toastify({
      text: `<div style="display: flex; align-items: center; gap: 8px;">
              ${this.#renderIcon(this.type)}
              <span>${message}</span>
            </div>`,
      duration: 2000,
      gravity: 'top',
      position: 'center',
      stopOnFocus: true,
      escapeMarkup: false,
      className: this.className,
      callback: () => {
        this.activeToasts--;
        this.activeMessages.delete(message);
      },
    }).showToast();
  }
}
