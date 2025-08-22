export class MessageBuilder {
  static createUserMessage(nickname, text, isSelf, timestamp) {
    const date = new Date(timestamp);
    return `
      <div class="message ${isSelf ? "self" : "other"}">
        <div class="message-header">
          <strong>${isSelf ? "You" : nickname}</strong>
          <span class="message-time">
            ${date.toLocaleTimeString()} ${date.toLocaleDateString()}
          </span>
        </div>
        <div class="message-text">${text}</div>
      </div>
    `;
  }

  static createSystemMessage(text) {
    const div = document.createElement("div");
    div.className = "message system";
    div.textContent = text;
    return div;
  }
}
