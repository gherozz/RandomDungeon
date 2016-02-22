function dungeon(numdungeon){
	
	switch(numdungeon){
		case 1:
			// $('.main').html('<div id="alert-villaggio"><p>Fine Dungeon</p><p>Dove vai?</p></div><div class="colonna-sx"><h3>Inventario</h3><div id="inventario"><ul id="lista"></ul></div><h3>Equipaggiato</h3><div id="equipaggiamento"><ul id="equip-lista"></ul></div></div><div id="arena"></div><div id="gioco"></div>');
		break;
		case 2:
			// $('.main').html('<div id="alert-villaggio"><p>Fine Dungeon</p><p>Dove vai?</p></div><div class="colonna-sx"><h3>Inventario</h3><div id="inventario"><ul id="lista"></ul></div><h3>Equipaggiato</h3><div id="equipaggiamento"><ul id="equip-lista"></ul></div></div><div id="arena"></div><div id="gioco"></div>');
			$('.header').addClass('');
			$('.colonna-sx').addClass('');
		break;
	}
}

function villaggio(){
	$('.header').removeClass('header-red');
	$('.colonna-sx').removeClass('colonna-sx-red');
	$('.main').html('<div id="villaggio"><div id="title"><h1>Frocinilandia</h1><button id="ancora">gioca ancora</button> </div><div class="opzione" id="opz1"></div><div class="opzione" id="opz2"></div><div class="opzione" id="opz3"></div><div class="opzione" id="opz4"></div><div class="opzione" id="opz5"></div><div class="opzione" id="opz6"></div></div>');
	blocco("#bottone-start",false);		
}


function statsMostro(vita,maxvita, attacco, difesa){
	$('.stats-mostro').html('<h3>Statistiche Mostro</h3><div class="stats1"><ul><li><span class="flaticon-medieval"></span><span class="attacco"></span><span id="attacco-mostro-value"></span></li><li><span class="flaticon-weapon"></span><span class="difesa"></span><span id="difesa-mostro-value"></span></li><li><span class="flaticon-shapes"></span><span class="salute"></span><span id="salute-mostro-value"></span><span id="maxSalute-mostro-value"></span></li></ul></div><div class="salute-container"><div id="salute-mostro-max"><div id="salute-mostro-bar"></div></div></div>');

	$("#salute-mostro-bar").animate({width: (vita/maxvita)*100 +"%"}, roundTimer);
	modificaStatsVisualizzate("#attacco-mostro-value", attacco, "arancione");
	modificaStatsVisualizzate("#difesa-mostro-value", difesa, "blu");
	modificaStatsVisualizzate("#salute-mostro-value", vita, "verde");
	$("#maxSalute-mostro-value").html(" / " + maxvita);
	
}
