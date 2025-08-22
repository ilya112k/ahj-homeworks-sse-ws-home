const WebSocket = require("ws");
const http = require("http");
const messages = require("./messages");

const PORT = 8000;
const users = new Map();

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end("Chat server is running");
});
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  let nickname = null;

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.type === "register") {
        nickname = msg.nickname.trim();
        users.set(ws, nickname);

        messages.send(ws, { type: "registered" });
        messages.users(wss, users);
        messages.system(wss, `${nickname} присоедился к чату`, "USER_JOINED");
      }

      if (msg.type === "message" && nickname) {
        wss.clients.forEach((client) => {
          messages.send(client, {
            type: "message",
            nickname,
            text: msg.text,
            isSelf: client === ws,
            timestamp: new Date().toISOString(),
          });
        });
      }
    } catch (error) {
      console.error("Message error:", error);
    }
  });

  ws.on("close", () => {
    if (nickname) {
      users.delete(ws);
      messages.users(wss, users);
      messages.system(wss, `${nickname} покинул чат`, "USER_LEFT");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
