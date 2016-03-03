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

function nomeLocalizzato(ogg)
{
	if (locCorrente == locEn)
	{
		return ogg.nomeEn;
	}
	else if (locCorrente == locIta)
	{
		return ogg.nomeIta;
	}
}

function aggiungiLog(testo, classe, txtEffect){
	var nuovoElemento = '<p class="'+classe+'">'+testo+'</p>';
 	$(nuovoElemento).hide().appendTo($("#area-log")).fadeIn(roundTimer/4);
	$("#area-log").animate({scrollTop:$("#area-log")[0].scrollHeight}, roundTimer/4);
	if (txtEffect == "shake") {
		$("#area-log p:last-child").effect(txtEffect, {times:6, distance:5, direction:"up"}, roundTimer);
		$("#area-log p:last-child").addClass("rossoCrit");
		$("#area-log p:last-child").toggleClass("rossoCrit", roundTimer/2, "easeInOutCubic" );	
	}
}

function aggiungiLogComplesso(testo){
	var nuovoElemento = testo;
 	$(nuovoElemento).hide().appendTo($("#area-log")).fadeIn(roundTimer/4);
	$("#area-log").animate({scrollTop:$("#area-log")[0].scrollHeight}, roundTimer/4);
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
	
	var materiale;
	
	if (oggettoObj.materiale == "metallo") {
		oggettoObj.materiale = estraiDaListaPesata(listaMetalli);
		modificaStatsOggettoMateriali(oggettoObj);
	} else if (oggettoObj.materiale == "pozione"){
		oggettoObj.materiale = estraiDaListaPesata(listaPozioni);
		modificaStatsOggettoMateriali(oggettoObj);
	}
	if (oggettoObj.qualita == "") {
		oggettoObj.qualita = estraiDaListaPesata(listaQualita);
		modificaStatsOggettoQualita(oggettoObj);
	}
	
	jQ.prepend("<div class='imgSlot " + oggettoObj.materiale.nome + "'><span class='" + oggettoObj.immagine + " " + oggettoObj.qualita.nome + "'></span></div>");
	var info = '<div class="info"><p>' + nomeLocalizzato(oggettoObj) + ', ' + nomeLocalizzato(oggettoObj.materiale) + ', ' + nomeLocalizzato(oggettoObj.qualita) + '</p>';
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

function modificaStatsOggettoMateriali(oggettoObj) {
	if (oggettoObj.materiale.attacco > 0 && oggettoObj.materiale.attacco != undefined)
	{
		oggettoObj.attacco = oggettoObj.materiale.attacco;
	}
	if (oggettoObj.materiale.difesa > 0 && oggettoObj.materiale.difesa != undefined)
	{
		oggettoObj.difesa = oggettoObj.materiale.difesa;
	}
	if (oggettoObj.materiale.salute > 0 && oggettoObj.materiale.salute != undefined)
	{
		oggettoObj.salute = oggettoObj.materiale.salute;
	}
	if (oggettoObj.materiale.maxSalute > 0 && oggettoObj.materiale.maxSalute != undefined)
	{
		oggettoObj.maxSalute = oggettoObj.materiale.maxSalute;
	}
}

function modificaStatsOggettoQualita(oggettoObj) {
	if (oggettoObj.qualita.attacco > 0 && oggettoObj.qualita.attacco != undefined)
	{
		oggettoObj.attacco = oggettoObj.qualita.attacco;
	}
	if (oggettoObj.qualita.difesa > 0 && oggettoObj.qualita.difesa != undefined)
	{
		oggettoObj.difesa = oggettoObj.qualita.difesa;
	}
	if (oggettoObj.qualita.salute > 0 && oggettoObj.qualita.salute != undefined)
	{
		oggettoObj.salute = oggettoObj.qualita.salute;
	}
	if (oggettoObj.qualita.maxSalute > 0 && oggettoObj.qualita.maxSalute != undefined)
	{
		oggettoObj.maxSalute = oggettoObj.qualita.maxSalute;
	}
}
