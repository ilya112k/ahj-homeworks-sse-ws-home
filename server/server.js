const WebSocket = require("ws");
const http = require("http");
const messages = require("./messages");
const {send} = require("./messages");

const PORT = 8000;
const users = new Map();


const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end("Chat server is running");
});
const wss = new WebSocket.Server({ server });

function safeSend(client, data) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

wss.on("connection", (ws) => {
  let nickname = null;

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.type === "register") {
        nickname = msg.nickname.trim();

        const isTaken = [...users.values()].some(
          (n) => n.toLowerCase() === nickname.toLowerCase(),
        );

        if (isTaken) {
          return messages.send(WebSocket, ws, {
            type: "error",
            message: "Имя уже занято",
          });
        }
        users.set(ws, nickname);

        messages.send(WebSocket, ws, { type: "registered" });
        const userList = [...users.values()];
        wss.clients.forEach((client) => {
          safeSend(client, { type: "userList", users: userList });
        });
        wss.clients.forEach((client) => {
          safeSend(client, { type: "system", text: `${nickname} присоедился к чату`, eventType: "USER_JOINED"});
        });
      }

      if (msg.type === "message" && nickname) {
        wss.clients.forEach((client) => {
          messages.send(WebSocket, client, {
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
      wss.clients.forEach((client) => {
        safeSend(client, { type: "userList", users: users });
      });
      wss.clients.forEach((client) => {
        safeSend(client, { type: "system", text: `${nickname} покинул чат`, eventType: "USER_LEFT"});
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
