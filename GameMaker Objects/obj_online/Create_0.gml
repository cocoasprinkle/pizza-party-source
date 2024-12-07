global.client = network_create_socket(network_socket_udp);
global.ip = "localhost";
global.port = 8000;
network_connect_raw(global.client, global.ip, global.port);

enum msgtype
{
	JOIN,
	SET_DATA,
	GET_DATA,
	UPDATE_DATA
}
res_json = -4;
clientid = "";
hassentdata = false;
initialized = false;
oldclientid = clientid;
connectbuffer = buffer_create(1, buffer_grow, 1);
connection = ds_map_create()
SendUDPMap(global.ip, global.port, connection, msgtype.JOIN)
