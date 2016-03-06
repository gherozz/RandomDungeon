//"background": '#' + Math.floor( Math.random() * 16777215 ).toString( 16 )
//http://jqueryui.com/slider/#colorpicker
//http://jqueryui.com/slider/#side-scroll
//http://jqueryui.com/slider/#steps
//http://jqueryui.com/slider/#slider-vertical

//nomeEroe + locCorrente[" ha equipaggiato "] + nomeLocalizzato(oggettoObj) + ","

function trovaOggetto()
{
	var oggettoObj = estraiDaListaPesata(listaOggetti);
	aggiungiLog("<span class='flaticon-inventario'></span> " + nomeEroe + locCorrente[" ha trovato "] + nomeLocalizzato(oggettoObj) + "!", oggettoObj.coloreTesto + " loot");
	creaLiOggetto(oggettoObj, "#ulInventario");
}

function aggiungiOggetto()
{
	var oggettoObj = estraiDaListaPesata(listaOggetti);
	creaLiOggetto(oggettoObj, "#ulInventario");
}

function creaLiOggetto(oggettoObj, DOM){
	var nuovoElemento = $("<li></li>").appendTo(DOM);
	setItemInfo(nuovoElemento, oggettoObj);
}

$(document).ready( function(){

	$("#ulInventario").sortable({
		connectWith: "#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx",
		revert: 100,
		placeholder: "placeholder",
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
			
			var dxLibera = ($("#equip-manoDx").find("li").first().prop("oggetto").nome == "manoDx");
			var sxLibera = ($("#equip-manoSx").find("li").first().prop("oggetto").nome == "manoSx");
			var testaLibera = $("#equip-testa").find("li").length == 0;
			var corpoLibero = $("#equip-corpo").find("li").length == 0;
			var id;
			
			if (oggettoObj.uso == "consumabile") 
			{
				if(salute < maxSalute){
					text = nomeEroe + locCorrente["  ha consumato "] + nomeLocalizzato(oggettoObj) + ",";
					modificaStatsEquip(oggettoObj, "", true);
					li.remove();
				} else{
					aggiungiLog(locCorrente["salute di "] + nomeEroe + locCorrente[" al massimo"], "verde");
				}
			} 
			else if (oggettoObj.uso == "equip") 
			{
				if (dxLibera && sxLibera && oggettoObj.slot == "2 mani") 
				{
					$("#equip-manoDx").empty();
					$("#equip-manoSx").empty();
					modificaStatsEquip(listaOggetti["manoDx"], "equip-manoDx", false);
					modificaStatsEquip(listaOggetti["manoSx"], "equip-manoSx", false);
					li.appendTo("#equip-manoDx");
					creaLiOggetto(listaOggetti["manoOccupata"], "#equip-manoSx");
					modificaStatsEquip(listaOggetti["manoOccupata"], "equip-manoSx", true);
					modificaStatsEquip(oggettoObj, "equip-manoDx", true);
				}
				else if ((dxLibera || sxLibera) && oggettoObj.slot == "mano") 
				{
					if (dxLibera) {
						$("#equip-manoDx").empty();
						modificaStatsEquip(listaOggetti["manoDx"], "equip-manoDx",false);
						li.appendTo("#equip-manoDx");
						modificaStatsEquip(oggettoObj, "equip-manoDx", true);
					} else {
						$("#equip-manoSx").empty();
						modificaStatsEquip(listaOggetti["manoSx"], "equip-manoSx", false);
						li.appendTo("#equip-manoSx");
						modificaStatsEquip(oggettoObj, "equip-manoSx", true);
					}
				}
				else if (testaLibera && oggettoObj.slot == "testa") 
				{
					li.appendTo("#equip-testa");
					modificaStatsEquip(oggettoObj, "equip-testa", true);
				}
				else if (corpoLibero && oggettoObj.slot == "corpo")
				{
					li.appendTo("#equip-corpo");
					modificaStatsEquip(oggettoObj, "equip-corpo", true);
				}
			}
		}
	});
	
			
	$("#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx").sortable({
		revert: 100,
		connectWith: "#ulInventario",	
		placeholder: "placeholder",
		receive: function(e, ui) {
			var oggettoObj = ui.item.prop("oggetto");
			var id = $(this).attr('id');
			
			if(oggettoObj.uso == "equip"){
				if (oggettoObj.slot == "2 mani" && (id == "equip-manoDx" || id == "equip-manoSx"))
				{
					svuotaSlotEquip($(this), 2);
					if (id == "equip-manoDx") {
						svuotaSlotEquip($("#equip-manoSx"), 1);
						creaLiOggetto(listaOggetti["manoOccupata"], "#equip-manoSx");
						modificaStatsEquip(listaOggetti["manoOccupata"], "equip-manoSx", true);
					} else {
						svuotaSlotEquip($("#equip-manoDx"), 1);
						creaLiOggetto(listaOggetti["manoOccupata"], "#equip-manoDx");
						modificaStatsEquip(listaOggetti["manoOccupata"], "equip-manoDx", true);
					}
					modificaStatsEquip(oggettoObj, id, true);
				} 
				else if ((oggettoObj.slot == "mano" && (id == "equip-manoDx" || id == "equip-manoSx"))
					|| (oggettoObj.slot == "testa" && id == "equip-testa") 
					|| (oggettoObj.slot == "corpo" && id == "equip-corpo"))
				{	
					modificaStatsEquip(oggettoObj, id, true);
					svuotaSlotEquip($(this), 2);
				} 
				else 
				{
					ui.sender.sortable('cancel');
				}
			}  else {
				ui.sender.sortable('cancel');
			}
		}, 
		remove: function (e, ui){
			var oggettoObj = ui.item.prop("oggetto");
			var id = $(this).attr('id');
			rimozioneOggetto(oggettoObj, id);
		}
	}).disableSelection().on("click", "li", function() {	
		var id = $(this).closest("ul").attr('id');
		var oggettoObj = $(this).prop("oggetto");
		
		if (statoGioco != "combattimento" && oggettoObj.slot != "irremovibile"){
			traduci();	
			rimozioneOggetto(oggettoObj, id);
			$(this).appendTo("#ulInventario");
		}
	});
});

function rimozioneOggetto(oggettoObj, id) {
	if (oggettoObj.slot == "2 mani") {
		if (id == "equip-manoDx") {
			$("#equip-manoSx").empty();
			modificaStatsEquip(listaOggetti["manoOccupata"], "equip-manoSx", false);
		}
		if (id == "equip-manoSx") {
			$("#equip-manoDx").empty();
			modificaStatsEquip(listaOggetti["manoOccupata"], "equip-manoDx", false);
		}
		creaLiOggetto(listaOggetti["manoDx"], "#equip-manoDx");
		modificaStatsEquip(listaOggetti["manoDx"], "equip-manoDx", true);
		creaLiOggetto(listaOggetti["manoSx"], "#equip-manoSx");
		modificaStatsEquip(listaOggetti["manoSx"], "equip-manoSx", true);
	} else if (oggettoObj.slot != "irremovibile") {
		if (id == "equip-manoDx") {
			creaLiOggetto(listaOggetti["manoDx"], "#equip-manoDx");
			modificaStatsEquip(listaOggetti["manoDx"], "equip-manoDx", true);
		}
		if (id == "equip-manoSx") {
			creaLiOggetto(listaOggetti["manoSx"], "#equip-manoSx");
			modificaStatsEquip(listaOggetti["manoSx"], "equip-manoSx", true);
		}
	}
	if (oggettoObj.slot != "irremovibile") modificaStatsEquip(oggettoObj, id, false);
}

function svuotaSlotEquip(jqueryObj, listaLength){
	if (jqueryObj.find("li").length >= listaLength){
		modificaStatsEquip(jqueryObj.find("li").last().prop("oggetto"), jqueryObj.attr('id'), false);
		if (jqueryObj.find("li").last().prop("oggetto").tipo.nome == "pelle") {
			jqueryObj.find("li").last().remove();
		} else {
			jqueryObj.find("li").last().appendTo("#ulInventario");
		}
	}
}

function modificaStatsEquip(oggettoObj, idSlot, boolEquip){
	var colore;
	var text;
	
	if (oggettoObj.attacco != 0 && oggettoObj.attacco != undefined)
	{
		if ((oggettoObj.attacco > 0 && boolEquip) || (oggettoObj.attacco < 0 && !boolEquip)){
			colore = "arancione";
		} else {
			colore = "blu";
		}
		if (idSlot == "equip-manoDx") {
			if (boolEquip) {
				attaccoDx += parseInt(oggettoObj.attacco);
			} else {
				attaccoDx -= parseInt(oggettoObj.attacco);
			}
			modificaStatsVisualizzate("#attaccoDx-value", attaccoDx, colore);
		} else if (idSlot == "equip-manoSx"){
			if (boolEquip) {
				attaccoSx += parseInt(oggettoObj.attacco);
			} else {
				attaccoSx -= parseInt(oggettoObj.attacco);
			}
			modificaStatsVisualizzate("#attaccoSx-value", attaccoSx, colore);
		}
		text += " <span class='flaticon-attacco'></span> " + locCorrente['Attacco'] + " " + oggettoObj.attacco;
	}
	
	if (oggettoObj.difesa != 0 && oggettoObj.difesa != undefined)
	{
		if ((oggettoObj.difesa > 0 && boolEquip) || (oggettoObj.difesa < 0 && !boolEquip)){
			colore = "blu";
		} else {
			colore = "arancione";
		}
		if (boolEquip) {
			difesa += parseInt(oggettoObj.difesa);
		} else {
			difesa -= parseInt(oggettoObj.difesa);
		}
		modificaStatsVisualizzate("#difesa-value", difesa, colore);
		text += " <span class='flaticon-difesa'></span> " + locCorrente['Difesa'] + " " + oggettoObj.difesa;
	}
	
	if (oggettoObj.salute != 0 && oggettoObj.salute != undefined)
	{
		if ((oggettoObj.salute > 0 && boolEquip) || (oggettoObj.salute < 0 && !boolEquip)){
			colore = "verde";
		} else {
			colore = "rosso";
		}
		if (boolEquip) {
			salute += parseInt(oggettoObj.salute);
		} else {
			salute -= parseInt(oggettoObj.salute);
		}
		if (salute > maxSalute)		
		{		
			salute = maxSalute;		
		}
		modificaStatsVisualizzate("#salute-value", salute, colore);
		text += " <span class='flaticon-salute'></span> " + locCorrente['Salute'] + " " + oggettoObj.salute;
	}
	
	if (oggettoObj.maxSalute != 0 && oggettoObj.maxSalute != undefined)
	{
		if ((oggettoObj.maxSalute > 0 && boolEquip) || (oggettoObj.maxSalute < 0 && !boolEquip)){
			colore = "verde";
		} else {
			colore = "rosso";
		}
		if (boolEquip) {
			maxSalute += parseInt(oggettoObj.maxSalute);
		} else {
			maxSalute -= parseInt(oggettoObj.maxSalute);
		}
		if (salute > maxSalute)		
		{		
			salute = maxSalute;		
		}
		modificaStatsVisualizzate("#maxSalute-value", maxSalute, colore);
		modificaStatsVisualizzate("#salute-value", salute, colore);
		text += " <span class='flaticon-salute'></span> " + locCorrente['Max Salute'] + " " + oggettoObj.maxSalute;
	}
	
	if (oggettoObj.velocita != 0 && oggettoObj.velocita != undefined)
	{
		if ((oggettoObj.velocita > 0 && boolEquip) || (oggettoObj.velocita < 0 && !boolEquip)){
			colore = "giallo";
		} else {
			colore = "viola";
		}
		if (boolEquip) {
			velocita += parseInt(oggettoObj.velocita);
		} else {
			velocita -= parseInt(oggettoObj.velocita);
		}
		modificaStatsVisualizzate("#velocita-value", velocita, colore);
		text += " <span class='flaticon-tempo'></span> " + locCorrente['Velocita'] + " " + oggettoObj.velocita;
	}
	
	if (oggettoObj.schivata != 0 && oggettoObj.schivata != undefined)
	{
		if ((oggettoObj.schivata > 0 && boolEquip) || (oggettoObj.schivata < 0 && !boolEquip)){
			colore = "viola";
		} else {
			colore = "giallo";
		}
		if (boolEquip) {
			schivata += parseInt(oggettoObj.schivata);
		} else {
			schivata -= parseInt(oggettoObj.schivata);
		}
		modificaStatsVisualizzate("#schivata-value", schivata, colore);
		text += " <span class='schivata-tempo'></span> " + locCorrente['Schivata'] + " " + oggettoObj.schivata;
	}
	
	return text;
}

