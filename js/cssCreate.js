$(document).ready(function(){
	setAltezze();

	$(".salute-bar").animate({width: (salute/maxSalute)*100 +"%"}, roundTimer);			
	modificaStatsVisualizzate("#attacco-value", attacco, "arancione");
	modificaStatsVisualizzate("#difesa-value", difesa, "blu");
	modificaStatsVisualizzate("#salute-value", salute, "verde");
	$("#maxSalute-value").append(" " + maxSalute);
	modificaStatsVisualizzate("#critico-value", critico, "rosso");
	modificaStatsVisualizzate("#mana-value", mana, "viola");
	modificaStatsVisualizzate("#monete-value", monete, "giallo");
});
$(window).resize(function () { 
	setAltezze();
});

function setAltezze(){
	heightwindow =$( window ).height();
	$('.colonna-sx').css("height", heightwindow/5*4);
	$(".header").css("height", $(".colonna-sx").height()*0.13);
	$(".toggle-container").css("height", $(".colonna-sx").height()*0.699);
	$("#scelta-nome").css("height", $(".colonna-sx").height()*0.171);
	$("#bottone-start").css("height", $(".colonna-sx").height()*0.171);
	$("#gioco").css("height", heightwindow/5*4);
	$("#arena").css("height", heightwindow/5*1);
};
function traduci(bandiera){
	if(bandiera == "bandiera"){
		$("#lingua").toggleClass("ita", function(){
			$(this).attr("title", locCorrente["Switch Language"])
		});
	}
	$("#inventarioNome").html(locCorrente["Inventario"]);
	$("#equipaggiamentoNome").html(locCorrente["Equipaggiato"]);
	$(".attacco").html(locCorrente["Attacco"]);
	$(".difesa").html(locCorrente["Difesa"]);
	$(".salute").html(locCorrente["Salute"]);
	$(".critico").html(locCorrente["Critico"]);
	$(".mana").html(locCorrente["Mana"]);
	$(".monete").html(locCorrente["Monete"]);
	$("#nomeEroe").attr("placeholder", locCorrente["Inserisci il nome dell'Eroe"]);
	cambiaStatoGioco(statoGioco);
	
	$("#lista li, #equip-testa li, #equip-corpo li, #equip-manoDx li, #equip-manoSx li").each(function( index ) {
		oggettoObj = $(this).prop("oggetto");
		$(this).empty();
		$(this).prop("oggetto",oggettoObj);
		this.className = "ui-state-default slot";
		$(this).prepend('<img id="theImg" src="images/' + oggettoObj.nome + '.png" />');
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
		$(this).append("<div>"+info+"</div>");
	});
}

function sistemaNome(){
	nomeEroe = $("#nomeEroe").val();
	if (nomeEroe == "frocini") {
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
		generaOggetto();
	}
	if(nomeEroe.indexOf("Ser") >=0 || nomeEroe.indexOf("ser") >=0){
		$("#nomeEroe").val(nomeEroe);
	} else{
		nomeEroe = "Ser "+ $("#nomeEroe").val();
		$("#nomeEroe").val(nomeEroe);
	}
	if(nomeEroe == "Ser " || nomeEroe == null){
		nomeEroe = "Ser Random";
		$("#nomeEroe").val(nomeEroe);
	}
	
	$(".stats-eroe h3").html(locCorrente["Statistiche "] + nomeEroe);
	
	blocco("#nomeEroe", true);
}
