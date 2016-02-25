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
function traduci(){
	$("#inventarioNome").html(locCorrente["Inventario"]);
	$("#equipaggiamentoNome").html(locCorrente["Equipaggiato"]);
	$(".attacco").html(locCorrente["Attacco"]);
	$(".difesa").html(locCorrente["Difesa"]);
	$(".salute").html(locCorrente["Salute"]);
	$(".critico").html(locCorrente["Critico"]);
	$(".mana").html(locCorrente["Mana"]);
	$(".monete").html(locCorrente["Monete"]);

	$("#nomeEroe").attr("placeholder", locCorrente["Inserisci il nome dell'Eroe"]);
	$("#bottone-start").val(locCorrente["Inizio"]);
}

function sistemaNome(){
	nomeEroe = $("#nomeEroe").val();
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