switch(async_load[?"type"])
{
	case network_type_data:
		var buff = async_load[?"buffer"];
		var buff_processed = buffer_read(buff, buffer_text)
		var data = json_decode(buff_processed)
		switch(data[?"type"])
		{
			case msgtype.JOIN:
				if (!initialized)
				{
					clientid = data[?"id"]
					show_debug_message("INITIALIZED! UUID: " + clientid);
					var player_data = ds_map_create();
					ds_map_add(player_data, "id", clientid);
					ds_map_add(player_data, "x", 0.0);
					ds_map_add(player_data, "y", 0.0);
					ds_map_add(player_data, "ispeppino", true);
					ds_map_add(player_data, "xscale", 1.0);
					ds_map_add(player_data, "room", 818.0);
					ds_map_add(player_data, "sprite_index", 2052.0);
					ds_map_add(player_data, "image_index", 1.0);
					ds_map_add(player_data, "image_speed", 1.0);
					SendUDPMap(global.ip, global.port, player_data, msgtype.SET_DATA);
					initialized = true;
				}
				break;
			case msgtype.GET_DATA:
				with (obj_player)
				{
					if (!obj_pause.pause)
					{		
						var ghost = noone;
						var found = false;
						var i = 0;
						if (instance_number(obj_ghostplayer) > 0)
						{
							for (i = 0; i < instance_number(obj_ghostplayer); i++)
							{
								ghost = instance_find(obj_ghostplayer, i)
								with(ghost)
								{
									if (data[?"id"] == ghostid)
									{
										x = data[?"x"];
										y = data[?"y"];
										ispeppino = data[?"ispeppino"];
										roomnumber = data[?"room"];
										xscale = data[?"xscale"];
										sprite_index = data[?"sprite_index"];
										image_index = data[?"image_index"];
										image_speed = data[?"image_speed"];
										found = true;
										break;
									}
								}
							}
						}
						if (!found && i == instance_number(obj_ghostplayer))
						{
							var new_ghost = instance_create_layer(0,0,"Instances", obj_ghostplayer,
							{
								username : string(data[?"sprite_index"]),
								ghostid : data[?"id"],
								x : data[?"x"],
								y : data[?"y"],
								ispeppino : data[?"ispeppino"],
								roomnumber : data[?"room"],
								xscale : data[?"xscale"],
								sprite_index : data[?"sprite_index"],
								image_index : data[?"image_index"],
								image_speed : data[?"image_speed"],
							});
							show_debug_message("Player " + new_ghost.ghostid + " has been synced!!");
						}
					}
				}
				break;
		}
}