const WebSocket = require("ws");

function send(client, data) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}
function system(wss, text, eventType) {
  wss.clients.forEach((client) => {
    send(client, { type: "system", text, eventType });
  });
}

function users(wss, usersList) {
  const userList = [...usersList.values()];
  wss.clients.forEach((client) => {
    send(client, { type: "userList", users: userList });
  });
}
export { send, system, users };
