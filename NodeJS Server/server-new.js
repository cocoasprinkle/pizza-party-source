var dgram = require("dgram");
const { hostname } = require("os");
var { v4: uuidv4 } = require("uuid");

var server = dgram.createSocket("udp4");

var data;

var players = [];

const msgtype =
{
  JOIN : 0,
  SET_DATA : 1,
  GET_DATA : 2,
  UPDATE_DATA : 3,
};

server.on("message", function (msg, rinfo) {
  data = JSON.parse(msg);
  switch (data.type) {
    case msgtype.JOIN:
      join_from_client(data, rinfo);
      break;
    case msgtype.SET_DATA:
      set_player_data(data, rinfo);
    case msgtype.GET_DATA:
      get_player_data(data, rinfo);
    case msgtype.UPDATE_DATA:
      update_player_data(data, rinfo);
  }
});

function join_from_client(data, rinfo)
{
  console.log("Client has connected!");
  var init = {
    type: msgtype.JOIN,
    id: uuidv4(),
  };
  console.log("Client has been initialized!\n", init.id);
  server.send(JSON.stringify(init), rinfo.port, rinfo.address);
}

function set_player_data(data, rinfo)
{
  var player = {
    type: msgtype.GET_DATA,
    id: data.id,
    x: data.x,
    y: data.y,
    ispeppino: data.ispeppino,
    xscale: data.xscale,
    room: data.room,
    sprite_index: data.sprite_index,
    image_index: data.image_index,
    image_speed: data.image_speed,
  };
  players.push(player);
}

function get_player_data(data, rinfo)
{
  for (i in players)
    {
      if (players[i].id != data.id && data.x != undefined)
      {
        server.send(JSON.stringify(players[i]), rinfo.port, rinfo.address);
      }
    }
}

function update_player_data(data, rinfo)
{
  console.log(data);
  for (i in players)
  {
    if (players[i].id == data.id && data.x != undefined)
    {
      players[i].x = data.x;
      players[i].y = data.y;
      players[i].ispeppino = data.ispeppino;
      players[i].xscale = data.xscale;
      players[i].room = data.room;
      players[i].sprite_index = data.sprite_index;
      players[i].image_index = data.image_index;
      players[i].image_speed = data.image_speed;
    }
  }
}

server.bind(8000);
console.log("PIZZA PARTY SERVER (ALPHA)\nServer is online!");
