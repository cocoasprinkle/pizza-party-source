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
      var playerinfo = {
        eventname: "Player Data",
        id: players[i].id,
        name: players[i].name,
        xpos: players[i].xpos,
        ypos: players[i].ypos,
        ispeppino: players[i].ispeppino,
        spriteindex: players[i].spriteindex,
        palette: players[i].palette,
        texture: players[i].texture,
        roomindex: players[i].roomindex,
        xscale: players[i].xscale,
        imageindex: players[i].imageindex,
        imagespeed: players[i].imagespeed,
      };
      for (let j in players)
      {
        if (i != j)
        {
            players[i].socket.send(JSON.stringify(playerinfo));
        }
      }
      }
    }
  setTimeout(stateUpdate, 1000 / 60);
}
stateUpdate();

wss.on("connection", (ws) => {
  //Handles a client connection
  console.log("Player has connected!");
  clientid++;
  sockets.push(ws);

  //Sends the ID to the client to keep track of which player is who
  var connectioninit = {
    eventname: "Connection Info",
    id: clientid,
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
      for (let i in sockets) {
        sockets[i].send(JSON.stringify(serverinfo));
      }
    }
    var parsedData = JSON.parse(data);
    switch (parsedData.eventname) {
      //When the server receives player data, we either define a new player or replace an existing one's data if the ID matches
      case "Player Data":
        var player = {
          name: parsedData.name,
          id: clientid,
          socket: ws,
          xpos: parsedData.xpos,
          ypos: parsedData.ypos,
          ispeppino: parsedData.ispeppino,
          spriteindex: parsedData.spriteindex,
          palette: parsedData.palette,
          texture: parsedData.texture,
          roomindex: parsedData.roomindex,
          xscale: parsedData.xscale,
          imageindex: parsedData.imageindex,
          imagespeed: parsedData.imagespeed,
        };
        let found = players.find((o) => o.id === player.id);
        if (!found) {
          players.push(player);
        } else {
          let replacer = players.find((o, i) => {
            if (o.id === player.id) {
              players[i] = {
                name: parsedData.name,
                id: clientid,
                socket: ws,
                xpos: parsedData.xpos,
                ypos: parsedData.ypos,
                ispeppino: parsedData.ispeppino,
                spriteindex: parsedData.spriteindex,
                xscale: parsedData.xscale,
                palette: parsedData.palette,
                texture: parsedData.texture,
                roomindex: parsedData.roomindex,
                imageindex: parsedData.imageindex,
                imagespeed: parsedData.imagespeed,
              };
              return true; // stop searching
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
        sockets.splice(i, 1);
        players.splice(i, 1);
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
