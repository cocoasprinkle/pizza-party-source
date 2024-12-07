image_xscale = xscale;
image_yscale = yscale;

switch (ispeppino)
{
	case 0:
		character = "N";
		player_index = 1;
		scr_characterspr();
		break;
	case 1:
		character = "P";
		player_index = 0;
		scr_characterspr();
		break;
}

//pal = player_index;
//paletteselect = player_paletteselect[pal];
//pal_swap_set (spr_palette, paletteselect, false);