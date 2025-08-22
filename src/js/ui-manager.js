import { MessageBuilder } from "./message-builder";

export class UiManager {
  constructor() {
    this.chatArea = document.getElementById("chatArea");
    this.userList = document.getElementById("userList");
    this.messageInput = document.getElementById("messageInput");
    this.chatContainer = document.querySelector(".chat-container");
  }

  updateUserList(users) {
    this.userList.innerHTML = users
      .map((user) => `<li><span class="online-dot"></span>${user}</li>`)
      .join("");
  }

  appendMessage(nickname, text, isSelf, timestamp) {
    const html = MessageBuilder.createUserMessage(
      nickname,
      text,
      isSelf,
      timestamp,
    );
    this.chatArea.insertAdjacentHTML("beforeend", html);
    this.scrollToBottom();
  }

  appendSystemMessage(text, eventType) {
    const message = MessageBuilder.createSystemMessage(text);
    this.chatArea.appendChild(message);
    this.scrollToBottom();

    if (!["USER_JOINED", "USER_LEFT"].includes(eventType)) {
      this.autoRemoveMessage(message);
    }
  }

  scrollToBottom() {
    this.chatArea.scrollTop = this.chatArea.scrollHeight;
  }

  autoRemoveMessage(element) {
    setTimeout(() => {
      element.style.opacity = "0";
      setTimeout(() => element.remove(), 300);
    }, 5000);
  }

  setupInputResize() {
    this.messageInput.addEventListener("input", function () {
      this.style.height = "auto";
      const maxHeight = window.innerWidth <= 768 ? 100 : 150;
      this.style.height = Math.min(this.scrollHeight, maxHeight) + "px";
    });
  }

  showChat() {
    this.chatContainer.style.display = "flex";
  }
}
