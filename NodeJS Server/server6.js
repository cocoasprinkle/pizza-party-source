// Importing the required modules
const WebSocketServer = require("ws");

// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 8000 });

var players = [];
var sockets = [];
var clientid = 0;

function stateUpdate() {
  if (players.length != 0) {
    for (let i in players) {
      var playerinfo = players[i];
      for (let j in sockets) {
        if (i != j) {
          console.log("Sending from", i, "to", j);
          sockets[j].send(JSON.stringify(playerinfo));
        }
      }
    }
  }
  setTimeout(stateUpdate, 1000 / 60);
}

wss.on("connection", (ws) => {
  //Handles a client connection
  console.log("Player has connected!");
  clientid++;
  sockets.push(ws);

  //Sends the ID to the client to keep track of which player is who
  var connectioninit = {
    eventname: "Connection Info",
    id: clientid,
    socket: ws,
  };
  ws.send(JSON.stringify(connectioninit));

  //When the client sends us a message
  ws.on("message", (data) => {
    var serverinfo = {
      eventname: "Server Info",
      ver: 0.1,
      playercount: sockets.length,
    };
    if (sockets.length > 0) {
      if (players.length != 0) {
        for (let i in sockets) {
          sockets[i].send(JSON.stringify(serverinfo));
        }
      }
    }
    stateUpdate();
    var parsedData = JSON.parse(data);
    switch (parsedData.eventname) {
      //When the server receives player data, we either define a new player or replace an existing one's data if the ID matches
      case "Player Data":
        var player = parsedData;
        let found = players.find((o) => o.id === player.id);
        if (!found) {
          players.push(player);
        } else {
          let replacer = players.find((o, i) => {
            if (o.name === player.name) {
              players[i] = parsedData;
              return true;
            }
          });
        }
    }
  });
  // Handles what to do when clients disconnects from the server
  ws.on("close", () => {
    console.log("Player has disconnected!");
    for (let i = 0; i < sockets.length; i++) {
      if (sockets[i] == ws) {
        players.splice(i, 1);
        sockets.splice(i, 1);
        clientid--;
      }
    }
  });

  // Handles a client connection error
  ws.onerror = function () {
    console.log("Error!");
  };
});
console.log("Server is up!");
