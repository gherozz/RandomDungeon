function dungeon(numdungeon){
	
	switch(numdungeon){

		case 1:
			// $('.header').animate({backgroundColor: "#2A7F00"});
			$('.colonna-sx').animate({backgroundColor: "#88C159"});
		break;
		case 2:
			//$('.header').animate({backgroundColor: "#ef4410"});
			$('.colonna-sx').animate({backgroundColor: "#f27d3e"});
		break;
		case 3:
			//$('.header').animate({backgroundColor: "#8C8181"});
			$('.colonna-sx').animate({backgroundColor: "#9E7E7E"});
		break;
		case 4:
			//$('.header').animate({backgroundColor: "#474141"});
			$('.colonna-sx').animate({backgroundColor: "#684E4E"});
		
	}
}

function villaggio(){
	$('.header').removeClass('header-red');
	$('.colonna-sx').removeClass('colonna-sx-red');
	$('.main').html('<div id="villaggio"><div id="title"><h1>Frocinilandia</h1><button id="ancora">gioca ancora</button> </div><div class="opzione" id="opz1"></div><div class="opzione" id="opz2"></div><div class="opzione" id="opz3"></div><div class="opzione" id="opz4"></div><div class="opzione" id="opz5"></div><div class="opzione" id="opz6"></div></div>');
	blocco("#bottone-start",false);		
}


function statsMostro(vita,maxvita, attacco, difesa,nomeNemico){
	$('.stats-mostro').html(
		'<div class="numeri-mostro">'+
			'<ul>'+
				'<li>'+
				'<span class="flaticon-salute"> </span>'+
				'<span class="salute"></span>:'+
				'<span id="salute-mostro-value"></span>/'+
				'<span id="maxSalute-mostro-value"></span>'+
				'</li>'+
				'<li>'+
				'<span class="flaticon-difesa"> </span>'+
				'<span class="difesa"></span>:'+
				'<span id="difesa-mostro-value"></span>'+
				'</li>'+
				'<li>'+
				'<span class="flaticon-attacco"> </span>'+
				'<span class="attacco"></span>:'+
				'<span id="attacco-mostro-value"></span>'+
				'</li>'+
			'</ul>'+
		'</div>'+
		'<div class="salute-container">'+
			'<div id="salute-mostro-max">'+
				'<div class="salute-mostro-bar"></div>'+
			'</div>' +
		'</div>' +
		'<h3></h3>'
	);
	
	$(".numeri-mostro").css("height", $(".numeri-eroe").height());
	$(".stats-mostro h3").html(locCorrente["Statistiche "]+nomeNemico);
	$(".salute-mostro-bar").animate({width: (vita/maxvita)*100 +"%"}, roundTimer);	
	modificaStatsVisualizzate("#attacco-mostro-value", attacco, "arancione");
	modificaStatsVisualizzate("#difesa-mostro-value", difesa, "blu");
	modificaStatsVisualizzate("#salute-mostro-value", vita, "verde");
	$("#maxSalute-mostro-value").html(maxvita);
	traduci();
}