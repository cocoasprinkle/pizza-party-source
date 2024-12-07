// Script assets have changed for v2.3.0 see
// https://help.yoyogames.com/hc/en-us/articles/360005277377 for more information
function SendUDPMap(ip, port, map, type){
	var player_buffer = buffer_create(1, buffer_grow, 1);
	ds_map_add(map, "type", type);
	var datajson = json_encode(map);
	ds_map_destroy(map);
	buffer_write(player_buffer, buffer_text, datajson);
	network_send_udp_raw(global.client, ip, port, player_buffer, buffer_tell(player_buffer));
	buffer_delete(player_buffer);			
}