function blocco(input,toggle){
	$(input).prop("disabled", toggle);
}

function numeroRandom(min, max) 
{ 
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizza50(valore) 
{
	return Math.round((valore/2)+(valore*Math.random()));
}

function randomizza25(valore) 
{
	return Math.round((valore/4*3)+(valore*Math.random())/2);
}
 
function estraiDaListaPesata(lista) 
{
	var listaPesata = [];
	
	for(key in lista)
	{
		var multiples = lista[key].chance * 100;
		for (var j = 0; j < multiples; j++) 
		{
			listaPesata.push(lista[key]);
		}
	}
	return listaPesata[numeroRandom(0, listaPesata.length-1)];
}
function nomeLocalizzato(mostroObj)
{
	if (locCorrente == locEn)
	{
		return mostroObj.nomeEn;
	}
	else if (locCorrente == locIta)
	{
		return mostroObj.nomeIta;
	}
}

function aggiungiLog(testo, classe){
	var nuovoElemento = '<p class="'+classe+'">'+testo+'</p>';
 	$(nuovoElemento).hide().appendTo($("#gioco")).fadeIn(300);
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/3);
}

function aggiungiLogComplesso(testo){
	var nuovoElemento = testo;
 	$(nuovoElemento).hide().appendTo($("#gioco")).fadeIn(300);
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/3);
}

function spazio(){
	$("#gioco").append("<br/>");
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/3);
}
function modificaStatsVisualizzate(div, nuovoValore, classe){	
	$(div).empty();
	$(div).append(" " + nuovoValore);
	$(div).addClass(classe);
	$(div).addClass("bold");
	$(div).toggleClass( classe, roundTimer/2, "easeInOutCubic" );
	$(div).toggleClass( "bold", roundTimer/2, "easeInOutCubic" );
		
	if (div.indexOf("salute-mostro") != -1)
	{		
		$(".salute-mostro-bar").addClass("bgBianco");		
		$(".salute-mostro-bar").toggleClass("bgBianco", roundTimer/2, "easeInOutCubic" );
	}
	else if (div.indexOf("salute") != -1)
	{
		$(".salute-bar").animate({width: (salute/maxSalute)*100 +"%"}, roundTimer/2);		
		$(".salute-bar").addClass("bgBianco");		
		$(".salute-bar").toggleClass("bgBianco", roundTimer/2, "easeInOutCubic" );	
	}
}