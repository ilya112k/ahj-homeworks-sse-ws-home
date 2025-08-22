export class Auth {
  constructor() {
    this.overlay = document.getElementById("auth");
    this.input = document.getElementById("nicknameInput");
    this.error = document.getElementById("authError");
    this.setupEvents();
  }

  setupEvents() {
    this.input.addEventListener("input", () => this.clearError());
  }

  validate(nickname) {
    if (!nickname) {
      this.showError("Псевдоним не может быть пустым");
      return false;
    }

    if (nickname.length > 10) {
      this.showError("Псевдоним должен состоять не более чем из 10 символов");
      return false;
    }

    return true;
  }

  showError(message) {
    this.error.textContent = message;
    this.error.style.display = "block";
    this.input.classList.add("error");
    this.input.focus();
  }

  clearError() {
    this.error.style.display = "none";
    this.input.classList.remove("error");
  }

  hideAuth() {
    this.overlay.style.display = "none";
  }
}
