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
	$(div).removeClass(classe);
	$(div).removeClass("bold");
	$(div).addClass(classe);
	$(div).addClass("bold");
	$(div).toggleClass( classe, roundTimer/4, "easeInOutCubic" );
	$(div).toggleClass( "bold", roundTimer/4, "easeInOutCubic" );
		
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
	
	var tipo;
	
	if (oggettoObj.tipo == "metallo") {
		oggettoObj.tipo = estraiDaListaPesata(listaMetalli);
		modificaStatsOggettoTipo(oggettoObj);
	} else if (oggettoObj.tipo == "pozione"){
		oggettoObj.tipo = estraiDaListaPesata(listaPozioni);
		modificaStatsOggettoTipo(oggettoObj);
	} 
	if (oggettoObj.qualita == "") {
		oggettoObj.qualita = estraiDaListaPesata(listaQualita);
		modificaStatsOggettoQualita(oggettoObj);
	}
	if (oggettoObj.tipo == undefined && oggettoObj.qualita == undefined) {
		oggettoObj.tipo = [];
		oggettoObj.qualita = [];
		oggettoObj.tipo.nome = "pelle";
		oggettoObj.qualita.nome = "pelle";
	}
	
	jQ.prepend("<div class='imgSlot " + oggettoObj.tipo.nome + " " + oggettoObj.tipo.nome + "-colore'><span class='" + oggettoObj.immagine + " " + oggettoObj.qualita.nome + "'></span></div>");
	
	var info = '<div class="info"><p class="' + oggettoObj.coloreTesto + '">' + nomeLocalizzato(oggettoObj) + '</p>';
	
	if (oggettoObj.tipo.nome != "pelle")info += '<p>' + locCorrente["Tipo"] + ': <span class="' + oggettoObj.tipo.nome + '-colore">' + nomeLocalizzato(oggettoObj.tipo) + '</span></p>';
	
	if (oggettoObj.qualita.nome != "pelle")info += '<p>' + locCorrente["Qualitá"] + ': <span class="' + oggettoObj.qualita.nome + '-colore">' + nomeLocalizzato(oggettoObj.qualita) + '</span></p>';
	
	if (oggettoObj.statoMax != undefined)info += '<p>' + locCorrente["Stato"] + ': ' + oggettoObj.statoAttuale + '/' + oggettoObj.statoMax + '</p>';
	
	if (oggettoObj.uso != undefined)info += '<p>' + locCorrente["Uso"] + ': ' + locCorrente[oggettoObj.uso] + '</p>';
	
	if (oggettoObj.slot != undefined) {
		var iconaSlot;
		if (oggettoObj.slot == "mano") {
			iconaSlot = '<span class="flaticon-mano"></span>'
		} else if (oggettoObj.slot == "testa"){
			iconaSlot = '<span class="flaticon-testa"></span>'
		} else if (oggettoObj.slot == "corpo"){
			iconaSlot = '<span class="flaticon-corpo"></span>'
		} else if (oggettoObj.slot == "2 mani"){
			iconaSlot = '<span class="flaticon-mano"></span><span class="flaticon-mano"></span>'
		}
		info += '<p>' + locCorrente["Slot"] + ': ' + iconaSlot + '</p>';
	}
	
	if (oggettoObj.attacco != undefined)
	{
		info += '<p><span class="flaticon-attacco"></span>  ' + locCorrente["Attacco"] + ': ' + oggettoObj.attacco + '</p>';
	}
	
	if (oggettoObj.difesa != undefined)
	{
		info += '<p><span class="flaticon-difesa"></span>  ' + locCorrente["Difesa"] + ': ' + oggettoObj.difesa + '</p>';
	}
	
	if (oggettoObj.salute != undefined)
	{
		info += '<p><span class="flaticon-salute"></span>  ' + locCorrente["Salute"] + ': ' + oggettoObj.salute + '</p>';
	}
	
	if (oggettoObj.maxSalute != undefined)
	{
		info += '<p><span class="flaticon-salute"></span>  ' + locCorrente["Max Salute"] + ': ' + oggettoObj.maxSalute + '</p>';
	}
	
	jQ.append("<div>"+info+"</div>");
	console.log(oggettoObj);
}

function modificaStatsOggettoTipo(oggettoObj) {

	if (oggettoObj.tipo.attacco != undefined) oggettoObj.attacco = 0 + parseInt(oggettoObj.tipo.attacco);
	if (oggettoObj.tipo.difesa != undefined) oggettoObj.difesa = 0 + parseInt(oggettoObj.tipo.difesa);
	if (oggettoObj.tipo.salute != undefined) oggettoObj.salute = 0 + parseInt(oggettoObj.tipo.salute);
	if (oggettoObj.tipo.maxSalute != undefined) oggettoObj.maxSalute =  0 + parseInt(oggettoObj.tipo.maxSalute);
	
	if (oggettoObj.attacco > 0)
	{
		oggettoObj.attacco = Math.round(parseInt(oggettoObj.attacco) + (oggettoObj.attacco*oggettoObj.tipo.stats/100));
	}
	if (oggettoObj.difesa > 0)
	{
		oggettoObj.difesa = Math.round(parseInt(oggettoObj.difesa) + (oggettoObj.difesa*oggettoObj.tipo.stats/100));
	}
	if (oggettoObj.salute > 0)
	{
		oggettoObj.salute = Math.round(parseInt(oggettoObj.salute) + (oggettoObj.salute*oggettoObj.tipo.stats/100));
	}
	if (oggettoObj.maxSalute > 0)
	{
		oggettoObj.maxSalute = Math.round(parseInt(oggettoObj.maxSalute) + (oggettoObj.maxSalute*oggettoObj.tipo.stats/100));
	}
}

function modificaStatsOggettoQualita(oggettoObj) {
	if (oggettoObj.attacco > 0)
	{
		oggettoObj.attacco = Math.round(parseInt(oggettoObj.attacco) + (oggettoObj.attacco*oggettoObj.qualita.stats/100));
	}
	if (oggettoObj.difesa > 0)
	{
		oggettoObj.difesa = Math.round(parseInt(oggettoObj.difesa) + (oggettoObj.difesa*oggettoObj.qualita.stats/100));
	}
	if (oggettoObj.salute > 0)
	{
		oggettoObj.salute = Math.round(parseInt(oggettoObj.salute) + (oggettoObj.salute*oggettoObj.qualita.stats/100));
	}
	if (oggettoObj.maxSalute > 0)
	{
		oggettoObj.maxSalute = Math.round(parseInt(oggettoObj.maxSalute) + (oggettoObj.maxSalute*oggettoObj.qualita.stats/100));
	}
}
