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