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
	creaLiOggetto(oggettoObj, "lista");
}

function creaLiOggetto(oggettoObj, DOM){
	var nuovoElemento = document.createElement("LI");
	var list = document.getElementById(DOM);
	list.insertBefore(nuovoElemento, list.childNodes[list.length]);  
	
	$(nuovoElemento).prop("oggetto",oggettoObj);
	if (oggettoObj.tipo == "uso") {
		nuovoElemento.className = "slot uso";
	} else {
		nuovoElemento.className = "slot";
	}
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
		connectWith: "#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx",
		revert: 100,
		helper : 'clone',
	}).disableSelection().on("click", "li", function() {
		
		//var otherUL = $("#unassigned_list, #recipients_list").not($(this).closest("ul"));
		//var li = $(this).closest("li");
		
		var li = $(this).closest("li");
		var oggettoObj = li.prop("oggetto");
		
		if (oggettoObj.tipo == "uso") 
		{
			if(salute < maxSalute){
				text = nomeEroe + locCorrente["  ha consumato "] + nomeLocalizzato(oggettoObj) + ",";
				aggiuntaStatsOggetto(oggettoObj, text);
				li.remove();
			} else{
				aggiungiLog(locCorrente["salute di "] + nomeEroe + locCorrente[" al massimo"]);
			}
		}
	});
	
			
	$("#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx").sortable({
		revert: 100,
		connectWith: "#lista",		
		receive: function(e, ui) {
			traduci();
			var oggettoObj = ui.item.prop("oggetto");
			if(oggettoObj.tipo == "equip"){
				if (
					this.children.length > 1 
					||
					($(this).attr('id')) == "equip-manoDx" && oggettoObj.slot == "2 mani" && ($("#equip-manoSx").find("li").length) > 0 
					||
					$(this).attr('id') == "equip-manoSx" && oggettoObj.slot == "2 mani" && ($("#equip-manoDx").find("li").length) > 0
					||
					($(this).attr('id')) != "equip-manoDx" &&	($(this).attr('id')) != "equip-manoSx" && oggettoObj.slot == "mano"
					||
					($(this).attr('id')) != "equip-manoDx" &&	($(this).attr('id')) != "equip-manoSx" && oggettoObj.slot == "2 mani"
					||
					($(this).attr('id')) != "equip-corpo" && oggettoObj.slot == "corpo"
					||
					($(this).attr('id')) != "equip-testa" &&	oggettoObj.slot == "testa"
					)
				{
					spazio();
					ui.sender.sortable('cancel');
				} else {
					console.log($("#equip-manoDx").find("li").length);
					console.log($("#equip-manoSx").find("li").length);
					if ($(this).attr('id') == "equip-manoDx" && oggettoObj.slot == "2 mani") 
					{
						creaLiOggetto(listaOggetti["mano"], "equip-manoSx");
					} 
					else if ($(this).attr('id') == "equip-manoSx" && oggettoObj.slot == "2 mani") 
					{
						creaLiOggetto(listaOggetti["mano"], "equip-manoDx");
					}
					var text = nomeEroe + locCorrente[" ha equipaggiato "] + nomeLocalizzato(oggettoObj) + ",";
					aggiuntaStatsOggetto(oggettoObj, text);
				}
			}  else {
				ui.sender.sortable('cancel');
			}
		}, 
		
		remove: function (e, ui){
			traduci();
			var oggettoObj = ui.item.prop("oggetto");
			if (oggettoObj.slot == "2 mani") {
				if ($(this).attr('id') == "equip-manoDx") {
					$("#equip-manoSx").empty();
				}
				if ($(this).attr('id') == "equip-manoSx") {
					$("#equip-manoDx").empty();
				}
			}
			var oggettoObj = ui.item.prop("oggetto");
			rimozioneStatsOggetto(oggettoObj);
			spazio();
		}
	}).disableSelection();
});

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

