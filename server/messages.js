function send(WebSocket, client, data) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(data));
  }
}
function system(WebSocket, wss, text, eventType) {
  wss.clients.forEach((client) => {
    send(client, { type: "system", text, eventType });
  });
}

function users(WebSocket, wss, usersList) {
  const userList = [...usersList.values()];
  wss.clients.forEach((client) => {
    send(client, { type: "userList", users: userList });
  });
}
export { send, system, users };
