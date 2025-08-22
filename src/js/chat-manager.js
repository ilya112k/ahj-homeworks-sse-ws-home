export class ChatManager {
  constructor(wsClient, uiManager, authManager) {
    this.wsClient = wsClient;
    this.uiManager = uiManager;
    this.authManager = authManager;
    this.setupMessageHandlers();
  }

  setupMessageHandlers() {
    this.wsClient.on("error", (data) =>
      this.authManager.showError(data.message),
    );

    this.wsClient.on("registered", () => {
      this.authManager.hideAuth();
      this.uiManager.showChat();
    });

    this.wsClient.on("userList", (data) =>
      this.uiManager.updateUserList(data.users),
    );

    this.wsClient.on("message", (data) =>
      this.uiManager.appendMessage(
        data.nickname,
        data.text,
        data.isSelf,
        data.timestamp,
      ),
    );

    this.wsClient.on("system", (data) =>
      this.uiManager.appendSystemMessage(data.text, data.eventType),
    );
  }

  initializeChatControls() {
    const send = () => {
      const text = this.uiManager.messageInput.value.trim();
      if (text) {
        this.wsClient.send({ type: "message", text });
        this.uiManager.messageInput.value = "";
      }
    };

    this.uiManager.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });

    document.getElementById("sendButton").addEventListener("click", send);
  }
}
