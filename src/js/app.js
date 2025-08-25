import { WSClient } from "./ws-client";
import { Auth } from "./auth";
import { UiManager } from "./ui-manager";
import { CancelModal } from "./cancel-modal";
import { ChatManager } from "./chat-manager";

const beURL = "http://localhost:8000/";
document.addEventListener("DOMContentLoaded", () => {
  const auth = new Auth();
  const uiManager = new UiManager();

  const exitModal = new CancelModal();
  const wsClient = new WSClient(beURL);

  const chatManager = new ChatManager(wsClient, uiManager, auth);

  document.getElementById("authButton").addEventListener("click", async (e) => {
    e.preventDefault();
    const nickname = auth.input.value.trim();
    if (!auth.validate(nickname)) return;

    try {
      await wsClient.connect();
      // Добавьте таймаут для проверки соединения
      setTimeout(() => {
        if (wsClient.ws.readyState !== WebSocket.OPEN) {
          throw new Error("Connection timeout");
        }
        wsClient.send({ type: "register", nickname });
      }, 1000);
    } catch (error) {
      auth.showError("Ошибка подключения к серверу");
      console.error("Connection error:", error);
    }
  });

  document
    .getElementById("logoutButton")
    .addEventListener("click", () => exitModal.show());

  const exitChat = () => {
    wsClient.close();
    uiManager.chatContainer.style.display = "none";
    auth.overlay.style.display = "flex";
    exitModal.hide();
  };
  const closeModal = () => exitModal.hide();

  exitModal.init(exitChat, closeModal);

  uiManager.setupInputResize();
  chatManager.initializeChatControls();
});
