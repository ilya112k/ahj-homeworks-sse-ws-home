export class CancelModal {
  constructor() {
    this.modal = document.getElementById("confirmModal");
    this.confirmButton = document.getElementById("confirmLeave");
    this.cancelButton = document.getElementById("confirmCancel");
  }

  init(configCallback, errorCallback) {
    this.confirmButton.addEventListener("click", configCallback);
    this.cancelButton.addEventListener("click", errorCallback);
  }

  show() {
    this.modal.style.display = "flex";
  }

  hide() {
    this.modal.style.display = "none";
  }
}
