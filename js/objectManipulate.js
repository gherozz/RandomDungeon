//"background": '#' + Math.floor( Math.random() * 16777215 ).toString( 16 )
//http://jqueryui.com/slider/#colorpicker
//http://jqueryui.com/slider/#side-scroll
//http://jqueryui.com/slider/#steps
//http://jqueryui.com/slider/#slider-vertical

function generaOggetto()
{
	var oggettoObj = estraiDaListaPesata(listaOggetti);
	aggiungiLog(nomeEroe + locCorrente[" ha trovato: "] + nomeLocalizzato(oggettoObj) + "!", oggettoObj.coloreTesto);
	creaLiOggetto(oggettoObj, "#ulInventario");
}

function creaLiOggetto(oggettoObj, DOM){
	var nuovoElemento = $("<li></li>").appendTo(DOM);
	
	nuovoElemento.prop("oggetto",oggettoObj);
	nuovoElemento.addClass("slot");
	nuovoElemento.prepend('<img id="theImg" src="images/' + oggettoObj.nome + '.png" />');
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

	$("#ulInventario").sortable({
		connectWith: "#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx",
		revert: 100,
		helper : 'clone',
		receive: function(e, ui) {
			var oggettoObj = ui.item.prop("oggetto");
			if (oggettoObj.slot == "irremovibile"){
				ui.sender.sortable('cancel');
			}
		}
	}).disableSelection().on("click", "li", function() {	
		if (statoGioco != "combattimento"){
			var li = $(this).closest("li");
			var oggettoObj = li.prop("oggetto");
			var id;
			
			var dxLength = $("#equip-manoDx").find("li").length;
			var sxLength = $("#equip-manoSx").find("li").length;
			var testaLength = $("#equip-testa").find("li").length;
			var corpoLength = $("#equip-corpo").find("li").length;
			
			if (oggettoObj.tipo == "uso") 
			{
				if(salute < maxSalute){
					text = nomeEroe + locCorrente["  ha consumato "] + nomeLocalizzato(oggettoObj) + ",";
					aggiuntaStatsOggetto(oggettoObj, text);
					li.remove();
				} else{
					aggiungiLog(locCorrente["salute di "] + nomeEroe + locCorrente[" al massimo"]);
				}
			} else {
				if (
					(dxLength == 0 && sxLength == 0 && oggettoObj.slot == "2 mani")
					||
					((dxLength == 0 || sxLength == 0) && oggettoObj.slot == "mano")
					||
					(testaLength == 0 && oggettoObj.slot == "testa")
					||
					(corpoLength == 0 && oggettoObj.slot == "corpo")
					)
				{
					if (oggettoObj.slot == "2 mani") 
					{
						li.appendTo("#equip-manoDx");
						id = "equip-manoDx";
						creaLiOggetto(listaOggetti["mano"], "#equip-manoSx");
						aggiuntaStatsOggetto(listaOggetti["mano"], "", "equip-manoSx");
					} 
					else if (oggettoObj.slot == "mano") 
					{
						if (dxLength == 0) {
							li.appendTo("#equip-manoDx");
							id = "equip-manoDx";
						} else {
							li.appendTo("#equip-manoSx");
							id = "equip-manoSx";
						}
					}
					else if (oggettoObj.slot == "testa") 
					{
						li.appendTo("#equip-testa");
						id = "equip-testa";
					}
					else if (oggettoObj.slot == "corpo") 
					{
						li.appendTo("#equip-corpo");
						id = "equip-corpo";
					}
					var text = nomeEroe + locCorrente[" ha equipaggiato "] + nomeLocalizzato(oggettoObj) + ",";
					aggiuntaStatsOggetto(oggettoObj, text, id);
				}
			}
		}
	});
	
			
	$("#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx").sortable({
		revert: 100,
		connectWith: "#ulInventario",	
		receive: function(e, ui) {
			var oggettoObj = ui.item.prop("oggetto");
			
			var dxLength = $("#equip-manoDx").find("li").length;
			var sxLength = $("#equip-manoSx").find("li").length;
			var testaLength = $("#equip-testa").find("li").length;
			var corpoLength = $("#equip-corpo").find("li").length;
			var id = $(this).attr('id');
			
			if (id == "equip-manoDx") {
				dxLength -= 1;
			} else if (id == "equip-manoSx") {
				sxLength -= 1;
			} else if (id == "equip-testa") {
				testaLength -= 1;
			} else if (id == "equip-corpo") {
				corpoLength -= 1;
			}
			
			if(oggettoObj.tipo == "equip"){
				if (
					(dxLength == 0
						&& sxLength == 0
						&& oggettoObj.slot == "2 mani" 
						&& (id == "equip-manoDx" || id == "equip-manoSx"))
					||
					((dxLength == 0 || sxLength  == 0)
						&& oggettoObj.slot == "mano" 
						&& (id == "equip-manoDx" || id == "equip-manoSx"))
					||
					(testaLength  == 0
						&& oggettoObj.slot == "testa" 
						&& id == "equip-testa")
					||
					(corpoLength  == 0
						&& oggettoObj.slot == "corpo" 
						&& id == "equip-corpo")
					)
				{
					if (id == "equip-manoDx" && oggettoObj.slot == "2 mani") 
					{
						creaLiOggetto(listaOggetti["mano"], "#equip-manoSx");
						aggiuntaStatsOggetto(listaOggetti["mano"], "", "equip-manoSx");
					} 
					else if (id == "equip-manoSx" && oggettoObj.slot == "2 mani") 
					{
						creaLiOggetto(listaOggetti["mano"], "#equip-manoDx");
						aggiuntaStatsOggetto(listaOggetti["mano"], "", "equip-manoDx");
					}
					var text = nomeEroe + locCorrente[" ha equipaggiato "] + nomeLocalizzato(oggettoObj) + ",";
					aggiuntaStatsOggetto(oggettoObj, text, id);
					
				} else {
					ui.sender.sortable('cancel');
				}
			}  else {
				ui.sender.sortable('cancel');
			}
		}, 
		remove: function (e, ui){
			var oggettoObj = ui.item.prop("oggetto");
			var id = $(this).attr('id');
			if (oggettoObj.slot == "2 mani") {
				if (id == "equip-manoDx") {
					$("#equip-manoSx").empty();
					rimozioneStatsOggetto(listaOggetti["mano"], "equip-manoSx");
				}
				if (id == "equip-manoSx") {
					$("#equip-manoDx").empty();
					rimozioneStatsOggetto(listaOggetti["mano"], "equip-manoDx");
				}
			}
			if (oggettoObj.slot != "irremovibile") rimozioneStatsOggetto(oggettoObj, id);
		}
	}).disableSelection().on("click", "li", function() {	
		var li = $(this).closest("li");
		var ul = $(this).closest("ul");
		var oggettoObj = li.prop("oggetto");
		if (statoGioco != "combattimento" && oggettoObj.slot != "irremovibile"){
			traduci();	
			
			if (oggettoObj.slot == "2 mani") {
				if (ul.attr('id') == "equip-manoDx") {
					$("#equip-manoSx").empty();
					rimozioneStatsOggetto(listaOggetti["mano"], "equip-manoSx");
				}
				if (ul.attr('id') == "equip-manoSx") {
					$("#equip-manoDx").empty();
					rimozioneStatsOggetto(listaOggetti["mano"], "equip-manoDx");
				}
			}
			rimozioneStatsOggetto(oggettoObj, ul.attr('id'));
			li.appendTo("#ulInventario");
		}
	});
	
});

function aggiuntaStatsOggetto(oggettoObj, text, idSlot){
	if (oggettoObj.attacco != 0 && oggettoObj.attacco != undefined)
	{
		{
		if (idSlot == "equip-manoDx") {
			attaccoDx += parseInt(oggettoObj.attacco);
			modificaStatsVisualizzate("#attaccoDx-value", attaccoDx, "arancione");
		} else if (idSlot == "equip-manoSx"){
			attaccoSx += parseInt(oggettoObj.attacco);
			modificaStatsVisualizzate("#attaccoSx-value", attaccoSx, "arancione");
		}
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
		if (salute > maxSalute)		
		{		
			salute = maxSalute;		
		}
		maxSalute += parseInt(oggettoObj.maxSalute);
		modificaStatsVisualizzate("#maxSalute-value", maxSalute, "verde");
		text += " <span class='flaticon-salute'></span> " + locCorrente['Max Salute'] + " + " + oggettoObj.maxSalute;
	}
	if (oggettoObj.nome != "mano") aggiungiLog(text, oggettoObj.coloreTesto);
}

function rimozioneStatsOggetto(oggettoObj, idSlot) {
	
	var text = nomeEroe + locCorrente[" ha rimosso "] + nomeLocalizzato(oggettoObj) + ",";	
	
	if (oggettoObj.attacco != 0 && oggettoObj.attacco != undefined)
	{
		if (idSlot == "equip-manoDx") {
			attaccoDx -= parseInt(oggettoObj.attacco);
			modificaStatsVisualizzate("#attaccoDx-value", attaccoDx, "blu");
		} else {
			attaccoSx -= parseInt(oggettoObj.attacco);
			modificaStatsVisualizzate("#attaccoSx-value", attaccoSx, "blu");
		}
		
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
		if (salute > maxSalute)		
		{		
			salute = maxSalute;		
		}
		maxSalute -= parseInt(oggettoObj.maxSalute);
		modificaStatsVisualizzate("#maxSalute-value", maxSalute, "rosso");
		text += " <span class='flaticon-salute'></span> " + locCorrente['Max Salute'] + " - " + oggettoObj.salute;
	}
	if (oggettoObj.nome != "mano") aggiungiLog(text, oggettoObj.coloreTesto);
}

