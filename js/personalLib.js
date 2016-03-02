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

function aggiungiLog(testo, classe, txtEffect){
	var nuovoElemento = '<p class="'+classe+'">'+testo+'</p>';
 	$(nuovoElemento).hide().appendTo($("#area-log")).fadeIn(roundTimer/4);
	$("#area-log").animate({scrollTop:$("#area-log")[0].scrollHeight}, roundTimer/4);
	if (txtEffect == "shake") $("#area-log p:last-child").effect(txtEffect, {times:6, distance:5, direction:"up"}, roundTimer);
	spazio();
}

function aggiungiLogComplesso(testo){
	var nuovoElemento = testo;
 	$(nuovoElemento).hide().appendTo($("#area-log")).fadeIn(roundTimer/4);
	$("#area-log").animate({scrollTop:$("#area-log")[0].scrollHeight}, roundTimer/4);
	spazio();
}

function spazio(){
	$("#area-log").append("<br/>");
	$("#area-log").animate({scrollTop:$("#area-log")[0].scrollHeight}, roundTimer/4);
}

function modificaStatsVisualizzate(div, nuovoValore, classe){	
	if (nuovoValore < 0) nuovoValore = 0;
	$(div).empty();
	$(div).append(" " + nuovoValore);
	$(div).addClass(classe);
	$(div).addClass("bold");
	$(div).toggleClass( classe, roundTimer/2, "easeInOutCubic" );
	$(div).toggleClass( "bold", roundTimer/2, "easeInOutCubic" );
		
	if (div == "#salute-value" || div == "#maxSalute-value")
	{
		$(".salute-bar").addClass("bgBianco");		
		$(".salute-bar").toggleClass("bgBianco", roundTimer/2, "easeInOutCubic" );	
		$(".salute-bar").animate({width: (salute/maxSalute)*100 +"%"}, roundTimer/2);	
	}
}

function setItemInfo(jQ, oggettoObj) {
	jQ.prop("oggetto",oggettoObj);		
	jQ.addClass("slot");
	jQ.prepend('<img id="theImg" src="images/' + oggettoObj.nome + '.png" />');
	var info = '<div class="info"><p>' + nomeLocalizzato(oggettoObj) + '</p>';
	if (oggettoObj.statoMax != undefined)info += '<p>' + locCorrente["Stato"] + ': ' + oggettoObj.statoAttuale + '/' + oggettoObj.statoMax + '</p>';
	if (oggettoObj.tipo != undefined)info += '<p>' + locCorrente["Tipo"] + ': ' + locCorrente[oggettoObj.tipo] + '</p>';
	if (oggettoObj.slot != undefined)info += '<p>' + locCorrente["Slot"] + ': ' + locCorrente[oggettoObj.slot] + '</p>';
	if (oggettoObj.attacco >= -100 && oggettoObj.attacco != undefined)
	{
		info += '<p><span class="flaticon-attacco"></span>  ' + locCorrente["Attacco"] + ': ' + oggettoObj.attacco + '</p>';
	}
	if (oggettoObj.difesa >= -100 && oggettoObj.difesa != undefined)
	{
		info += '<p><span class="flaticon-difesa"></span>  ' + locCorrente["Difesa"] + ': ' + oggettoObj.difesa + '</p>';
	}
	if (oggettoObj.salute >= -100 && oggettoObj.salute != undefined)
	{
		info += '<p><span class="flaticon-salute"></span>  ' + locCorrente["Salute"] + ': ' + oggettoObj.salute + '</p>';
	}
	if (oggettoObj.maxSalute >= -100 && oggettoObj.maxSalute != undefined)
	{
		info += '<p><span class="flaticon-salute"></span>  ' + locCorrente["Max Salute"] + ': ' + oggettoObj.maxSalute + '</p>';
	}
	jQ.append("<div>"+info+"</div>");
}
