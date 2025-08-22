const WebSocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end('Chat server is running');
});
const wss = new WebSocket.Server({ server });
const users = new Map();

function safeSend(client, data) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}

wss.on("connection", (ws) => {
  let nickname = null;

  const checkDuplicateNicknames = (name) => {
    const nameLower = name.toLowerCase();
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const existing = users.get(client);
        if (existing?.toLowerCase() === nameLower) {
          safeSend(client, {
            type: "error",
            message: "Это имя уже занято. Введите другое",
          });
        }
      }
    });
  };

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);

      if (msg.type === "register") {
        const name = msg.nickname.trim();

        if (!name || name.length > 10) {
          return safeSend(ws, {
            type: "error",
            message: "Имя должно быть длинной 1-10 символов)",
          });
        }

        const isTaken = [...users.values()].some(
          (n) => n.toLowerCase() === name.toLowerCase(),
        );

        if (isTaken) {
          checkDuplicateNicknames(name);
          return safeSend(ws, {
            type: "error",
            message: "Имя уже занято",
          });
        }

        nickname = name;
        users.set(ws, nickname);

        safeSend(ws, { type: "registered" });
        broadcastUsers();
        broadcastSystemMessage(`${nickname} присоедился к чату`, "USER_JOINED");
      }

      if (msg.type === "message" && nickname) {
        broadcastMessage(ws, nickname, msg.text);
      }
    } catch (error) {
      console.error("Message error:", error);
    }
  });

  ws.on("close", () => {
    if (nickname) {
      users.delete(ws);
      broadcastUsers();
      broadcastSystemMessage(`${nickname} покинул чат`, "USER_LEFT");
    }
  });
});

function broadcastUsers() {
  const userList = [...users.values()];
  wss.clients.forEach((client) => {
    safeSend(client, { type: "userList", users: userList });
  });
}

function broadcastMessage(sender, nickname, text) {
  wss.clients.forEach((client) => {
    safeSend(client, {
      type: "message",
      nickname,
      text,
      isSelf: client === sender,
      timestamp: new Date().toISOString(),
    });
  });
}

function broadcastSystemMessage(text, eventType) {
  wss.clients.forEach((client) => {
    safeSend(client, { type: "system", text, eventType });
  });
}


const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
