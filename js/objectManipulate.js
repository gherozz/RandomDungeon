//"background": '#' + Math.floor( Math.random() * 16777215 ).toString( 16 )
//http://jqueryui.com/slider/#colorpicker
//http://jqueryui.com/slider/#side-scroll
//http://jqueryui.com/slider/#steps
//http://jqueryui.com/slider/#slider-vertical

function generaOggetto()
{
	var oggettoObj = estraiDaListaPesata(listaOggetti);
	spazio();
	aggiungiLog(nomeEroe + locCorrente[" ha trovato: "] + nomeLocalizzato(oggettoObj) + "!", oggettoObj.coloreTesto);
	var nuovoElemento = document.createElement("LI");
	nuovoElemento.className = "ui-state-default slot";
	var list = document.getElementById("lista");
	list.insertBefore(nuovoElemento, list.childNodes[list.length]);  
	$(nuovoElemento).prop("oggetto",oggettoObj);

	$(nuovoElemento).prepend('<img id="theImg" src="images/' + oggettoObj.nome + '.png" />');
	var info = '<div class="info"><p>' + nomeLocalizzato(oggettoObj) + '</p>';
	info += '<p>' + locCorrente["Stato"] + ': ' + oggettoObj.statoAttuale + '/' + oggettoObj.statoAttuale + '</p>';
	info += '<p>' + locCorrente["Tipo"] + ': ' + locCorrente[oggettoObj.tipo] + '</p>';
	info += '<p>' + locCorrente["Slot"] + ': ' + locCorrente[oggettoObj.slot] + '</p>';
	if (oggettoObj.attacco != 0 && oggettoObj.attacco != undefined)
	{
		info += '<p><span class="flaticon-attacco"></span>  ' + locCorrente["Attacco"] + ': ' + oggettoObj.attacco + '</p>';
	}
	if (oggettoObj.difesa != 0 && oggettoObj.difesa != undefined)
	{
		info += '<p><span class="flaticon-difesa"></span>  ' + locCorrente["Difesa"] + ': ' + oggettoObj.difesa + '</p>';
	}
	if (oggettoObj.salute != 0 && oggettoObj.salute != undefined)
	{
		info += '<p><span class="flaticon-salute"></span>  ' + locCorrente["Salute"] + ': ' + oggettoObj.salute + '</p>';
	}
	if (oggettoObj.maxSalute != 0 && oggettoObj.maxSalute != undefined)
	{
		info += '<p><span class="flaticon-salute"></span>  ' + locCorrente["Max Salute"] + ': ' + oggettoObj.maxSalute + '</p>';
	}
	$(nuovoElemento).append("<div>"+info+"</div>");
}

$(document).ready( function(){

	$("#lista").sortable({
		connectWith: ".connectedSortable",
		revert: 100
	}).disableSelection();
		
	$("#equip-lista").sortable({
		revert: 100,
		connectWith: ".connectedSortable",
	
		receive: function(e, ui) {
			var oggettoObj = ui.item.prop("oggetto");
			if(oggettoObj.tipo == "equip"){
				if (checkSlots(oggettoObj)) {
					var text = nomeEroe + locCorrente[" ha equipaggiato "] + nomeLocalizzato(oggettoObj) + ",";
					aggiuntaStatsOggetto(oggettoObj, text);
				} else {
					aggiungiLog(nomeEroe + locCorrente["  non ha uno slot libero per questo oggetto!"]);
					spazio();
					ui.sender.sortable('cancel');
				}
			} 
			else if (oggettoObj.tipo == "uso") 
			{
				if(salute < maxSalute){
					text = nomeEroe + locCorrente["  ha consumato "] + nomeLocalizzato(oggettoObj) + ",";
					aggiuntaStatsOggetto(oggettoObj, text);
					ui.item.remove();
				} else{
					aggiungiLog(locCorrente["salute di "] + nomeEroe + locCorrente[" al massimo"]);
					ui.sender.sortable('cancel');
				}
			}				
		}, 
		remove: function (e, ui){
			var oggettoObj = ui.item.prop("oggetto");
			rimozioneStatsOggetto(oggettoObj);
			spazio();
		}
	}).disableSelection();
});

function checkSlots(oggettoObj){	
	if (oggettoObj.slot == "mano" && (!manoDx || !manoSx))
	{
		if (!manoDx) 
		{	
			manoDx = true;
		}
		else if (!manoSx) 
		{
			manoSx = true;
		}
	}
	else if (oggettoObj.slot == "testa" && !testa)
	{
		testa = true;
	}
	else if (oggettoObj.slot == "corpo" && !corpo)
	{
		corpo = true;
	}
	else if (oggettoObj.slot == "2 mani" && (!manoDx && !manoSx))
	{
		manoDx = true;
		manoSx = true;
	} else {
		return false;
	}
	return true;
}

function aggiuntaStatsOggetto(oggettoObj, text){
	if (oggettoObj.attacco != 0 && oggettoObj.attacco != undefined)
	{
		{
		attacco += parseInt(oggettoObj.attacco);
		modificaStatsVisualizzate("#attacco-value", attacco, "arancione");
		text += " <span class='flaticon-attacco'></span> " + locCorrente['Attacco'] + " + " + oggettoObj.attacco;
		} 
	}
	if (oggettoObj.difesa != 0 && oggettoObj.difesa != undefined)
	{
		difesa += parseInt(oggettoObj.difesa);
		modificaStatsVisualizzate("#difesa-value", difesa, "blu");
		text += " <span class='flaticon-difesa'></span> " + locCorrente['Difesa'] + " + " + oggettoObj.difesa;
	}
	if (oggettoObj.salute != 0 && oggettoObj.salute != undefined)
	{
		salute += parseInt(oggettoObj.salute);
		if (salute > maxSalute)		
		{		
			salute = maxSalute;		
		}
		modificaStatsVisualizzate("#salute-value", salute, "verde");
		text += " <span class='flaticon-salute'></span> " + locCorrente['Salute'] + " + " + oggettoObj.salute;
	}
	if (oggettoObj.maxSalute != 0 && oggettoObj.maxSalute != undefined)
	{
		maxSalute += parseInt(oggettoObj.maxSalute);
		modificaStatsVisualizzate("#maxSalute-value", maxSalute, "verde");
		text += " <span class='flaticon-salute'></span> " + locCorrente['Max Salute'] + " + " + oggettoObj.maxSalute;
	}
	aggiungiLog(text, oggettoObj.coloreTesto);
	spazio();
}

function rimozioneStatsOggetto(oggettoObj) {
	if (oggettoObj.slot == "mano" )
	{
		if (manoDx) 
		{	
			manoDx = false;
		}
		else if (manoSx) 
		{
			manoSx = false;
		}
	}
	else if (oggettoObj.slot == "testa" )
	{
		testa = false;
	}
	else if (oggettoObj.slot == "corpo" )
	{
		corpo = false;
	}
	else if (oggettoObj.slot == "2 mani" )
	{
		manoSx = false;
		manoDx = false;
	}
	
	var text = nomeEroe + locCorrente[" ha rimosso "] + nomeLocalizzato(oggettoObj) + ",";	
	
	if (oggettoObj.attacco != 0 && oggettoObj.attacco != undefined)
	{
		attacco -= parseInt(oggettoObj.attacco);
		modificaStatsVisualizzate("#attacco-value", attacco, "blu");
		text += " <span class='flaticon-attacco'></span> " + locCorrente['Attacco'] + " - " + oggettoObj.attacco;
	}
	if (oggettoObj.difesa != 0 && oggettoObj.difesa != undefined)
	{
		difesa -= parseInt(oggettoObj.difesa);
		modificaStatsVisualizzate("#difesa-value", difesa, "arancione");
		text += " <span class='flaticon-difesa'></span> " + locCorrente['Difesa'] + " - " + oggettoObj.difesa;
	}
	if (oggettoObj.salute != 0 && oggettoObj.salute != undefined)
	{
		salute -= parseInt(oggettoObj.salute);
		if (salute > maxSalute)		
		{		
			salute = maxSalute;		
		}
		modificaStatsVisualizzate("#salute-value", salute, "rosso");
		text += " <span class='flaticon-salute'></span> " + locCorrente['Salute'] + " - " + oggettoObj.salute;
	}
	if (oggettoObj.maxSalute != 0 && oggettoObj.maxSalute != undefined)
	{
		maxSalute -= parseInt(oggettoObj.maxSalute);
		modificaStatsVisualizzate("#maxSalute-value", maxSalute, "rosso");
		text += " <span class='flaticon-salute'></span> " + locCorrente['Max Salute'] + " - " + oggettoObj.salute;
	}
	aggiungiLog(text, oggettoObj.coloreTesto);
}

/*
$(document).on("click", "#lista .slot", function(){
	var oggettoObj = $(this).prop("oggetto");
	muoviOggetto(oggettoObj, "lista", "equip-lista");
});

$(document).on("click", "#equip-lista .slot", function(){
	var oggettoObj = $(this).prop("oggetto");
	muoviOggetto(oggettoObj, "equip-lista", "lista");
});

*/
