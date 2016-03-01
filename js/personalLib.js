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
 	$(nuovoElemento).hide().appendTo($("#gioco")).fadeIn(roundTimer/4);
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/4);
	spazio();
}

function aggiungiLogComplesso(testo){
	var nuovoElemento = testo;
 	$(nuovoElemento).hide().appendTo($("#gioco")).fadeIn(roundTimer/4);
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/4);
	spazio();
}

function spazio(){
	$("#gioco").append("<br/>");
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/4);
}

function modificaStatsVisualizzate(div, nuovoValore, classe){	
	if (nuovoValore < 0) nuovoValore = 0;
	$(div).empty();
	$(div).append(" " + nuovoValore);
	$(div).addClass(classe);
	$(div).addClass("bold");
	$(div).toggleClass( classe, roundTimer/2, "easeInOutCubic" );
	$(div).toggleClass( "bold", roundTimer/2, "easeInOutCubic" );
		
	if (div == "#salute-value")
	{
		$(".salute-bar").addClass("bgBianco");		
		$(".salute-bar").toggleClass("bgBianco", roundTimer/2, "easeInOutCubic" );	
		$(".salute-bar").animate({width: (salute/maxSalute)*100 +"%"}, roundTimer/2);	
	}
}