const WebSocketServer = require("ws");

const wss = new WebSocketServer.Server({ port: 8000 });

var players = [];
var sockets = [];
var clientid = 0;

wss.on("connection", (ws) => {
  clientid++;
  sockets.push(ws);
  var connectioninit = {
    eventname: "Connection Info",
    id: clientid,
  };
  ws.send(JSON.stringify(connectioninit));
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
                players[j].socket.send(JSON.stringify(playerinfo));
            }
          }
          }
        }
      setTimeout(stateUpdate, 1000 / 60);
    }
    stateUpdate();
  }
  ws.on("message", (data) => {
    var parsedData = JSON.parse(data);
    switch (parsedData.eventname) {
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
        let found = players.find((o) => o.name === player.name);
        if (!found) {
          players.push(player);
        } else {
          let replacer = players.find((o, i) => {
            if (o.name === player.name) {
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
        break;
    }
  });
  ws.on("close", () => {
    for (let i = 0; i < sockets.length; i++) {
      if (sockets[i] == ws) {
        players.splice(i, 1);
        sockets.splice(i, 1);
      }
    }
  });

  ws.onerror = function () {
    console.log("Error!");
  };
});
console.log("Server is up!");
