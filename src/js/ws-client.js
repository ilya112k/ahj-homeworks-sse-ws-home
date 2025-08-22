export class WSClient {
  constructor(url) {
    this.ws = null;
    this.url = url;
    this.handlers = new Map();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = (event) => this.handleMessage(event);
    return new Promise((resolve) => {
      this.ws.onopen = () => resolve();
    });
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      const handler = this.handlers.get(data.type);
      if (handler) handler(data);
    } catch (error) {
      console.error("Message handling error:", error);
    }
  }

  on(eventType, callback) {
    this.handlers.set(eventType, callback);
  }

  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  close() {
    this.ws.close();
  }
}
