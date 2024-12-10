if (initialized)
{
	with (obj_player)
	{
		var send = true;
		if (x == -1000 && y == -1000)
		{
			send = false;
		}
		if (!obj_pause.pause && send)
		{
			var player_data = ds_map_create();
			ds_map_add(player_data, "id", obj_online.clientid);
			ds_map_add(player_data, "x", x);
			ds_map_add(player_data, "y", y);
			ds_map_add(player_data, "ispeppino", ispeppino);
			ds_map_add(player_data, "xscale", xscale);
			ds_map_add(player_data, "room", room);
			ds_map_add(player_data, "sprite_index", sprite_index);
			ds_map_add(player_data, "image_index", image_index);
			ds_map_add(player_data, "image_speed", image_speed);
			SendUDPMap(global.ip, global.port, player_data, msgtype.UPDATE_DATA);
			var id_data = ds_map_create();
			ds_map_add(id_data, "id", obj_online.clientid);
		}
	}
}