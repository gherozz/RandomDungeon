var livello = 0;
var livelloBoss = 10;

var attaccoDx = 5;
var attaccoSx = 5;
var difesa = 0;
var maxSalute = 200;
var salute = maxSalute;
var critico = 10;
var mana = 0;
var monete = 0;

var nomeEroe;

var statoGioco;
var roundTimer = 600;
var fattoreScala = 50;

var lingua = "en";

var manoDx = false;
var manoSx = false;
var testa = false;
var corpo = false;

var numDungeon = 1;

var listaMostri = [];
var listaOggetti = [];
var locIta = [];
var locEn = [];
var locCorrente = [];

var arrayInventario = [];
var arrayEquip = [];




$(document).ready( function(){

	locCorrente = locEn;
	dungeon(Math.floor(Math.random()*4)+1);
	
	$.getJSON( "localizzazione.json", function(data) {
		$.each(data.stringhe, function( key, val ) 
		{
			locIta[val.ita] = val.ita;
			locEn[val.ita] = val.en;
		});
	})
	.done(function() {
		cambiaStatoGioco("inizio");
		traduci();
	})
	.fail( function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error)
	});

	$.getJSON( "data.json", function(data) {
		$.each(data.nemici, function( key, val ) 
		{
			listaMostri[val.nomeIta] = val;
		});
		$.each(data.oggetti, function( key, val )
		{
			listaOggetti[val.nome] = val;
		});
	})
	.done(function() {
		generaOggetto();
		generaOggetto();
		generaOggetto();
	})
	.fail( function(d, textStatus, error) {
		console.error("getJSON failed, status: " + textStatus + ", error: "+error)
	});	

	$(".footer-pull,footer").click(function(){
		$("footer").slideToggle("slow");
	});
	
	$("#lingua").click(function(){
		if(locCorrente == locIta){
			locCorrente = locEn;
		} else{
			locCorrente = locIta;
		};
		traduci("bandiera");
	});
	
	$(".avvia-gioco").click(function(){
		gioco();
	});

	$("#fullscreen").click(function(){
		screenfull.toggle(); 
	})
	
	// var s1 = nomeEroe + locCorrente[" torna al villaggio"];
	// var s2 = nomeEroe + locCorrente[" procede"];

	// $("#alert-villaggio").dialog({
	// 	autoOpen: false,
	// 	dialogClass: "no-close",
	// 	modal: true,
	// 	buttons: {
	// 		s1: function(){
	// 			$(this).dialog("close");
	// 			villaggio();
	// 			stop = true;
	// 		},
	// 		s2: function(){
	// 			$(this).dialog("close");
	// 			aggiungiLog(nomeEroe + locCorrente[" procede"], "titolo-livello");
	// 			dungeon(numDungeon);
	// 			spazio();	
	// 			stop = false;
	// 			gioco();
	// 			blocco("#bottone-start",false);
	// 		}
	// 	}
	// })
});


function gioco()
{
	if (livello == 0) sistemaNome();
	livello++;
	var testo= nomeEroe + locCorrente[" ha raggiunto il livello del dungeon: "] + livello;
	if(livello == livelloBoss){
		numDungeon = Math.floor(Math.random()*4)+1;
		aggiungiLog(testo+", Boss!", "titolo-livello");
		scontro(listaMostri["Boss"]);
		livelloBoss += randomizza50(10);
	} else if(livello != livelloBoss){
		aggiungiLog(testo, "titolo-livello");
		evento();
	}
}

function cambiaStatoGioco(nuovoStatoGioco){
	statoGioco = nuovoStatoGioco;
	if (nuovoStatoGioco == "combattimento"){
		$("#bottone-start").val(locCorrente["In combattimento.."]);
		$("#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx, #ulInventario").sortable( "disable" );
		blocco("#bottone-start",true);	
		$("#bottone-start").removeClass("bottone-verde");
		$("#bottone-start").addClass("bottone-rosso");
	} else if (nuovoStatoGioco == "scende"){
		$("#bottone-start").val(locCorrente["Scende ancora.."]);
		$("#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx, #ulInventario").sortable( "enable" );
		blocco("#bottone-start", false);
		$("#bottone-start").removeClass("bottone-rosso");
		$("#bottone-start").addClass("bottone-verde");
	} else if (nuovoStatoGioco == "morto"){
		$("#bottone-start").val(locCorrente["Morto.."]);
	} else {
		$("#bottone-start").val(locCorrente["Inizia"]);
	}
}

function evento(){
	var mostroScelto = estraiDaListaPesata(listaMostri);
	scontro(mostroScelto);
}

function scontro(mostroScelto) { 
	var nomeNemico = nomeLocalizzato(mostroScelto) ;
	var baseAttaccoNemico = randomizza25(parseInt(mostroScelto.attacco) + parseInt(mostroScelto.attacco)*livello/fattoreScala);
	var difesaNemico = randomizza25(parseInt(mostroScelto.difesa) + parseInt(mostroScelto.difesa)*livello/fattoreScala);
	var maxVitaNemico = randomizza25(parseInt(mostroScelto.vita) + parseInt(mostroScelto.vita)*livello/fattoreScala);
	var vitaNemico = maxVitaNemico;
	var attaccoNemico = baseAttaccoNemico;
	
	var turnoEroe = true;
	
	aggiungiLog(nomeEroe + locCorrente[" incontra: "] + nomeNemico + "!", "rosso");
	
	cambiaStatoGioco("combattimento");	
	
	statsMostro(vitaNemico, maxVitaNemico, attaccoNemico, difesaNemico, nomeNemico);
	
	loopLi();

	function loopLi() {
		var loop = setInterval(function() { 
		
			if (turnoEroe) {
			
				var arma1, arma2;
				var text = "";
				
				if ($("#equip-manoDx").find("li").length > 0) {
					var oggetto1 = $("#equip-manoDx li").first().prop("oggetto");
					if (oggetto1.nome != "mano") arma1 = nomeLocalizzato(oggetto1);
				}
				
				if ($("#equip-manoSx").find("li").length > 0) {
					var oggetto2 = $("#equip-manoSx li").first().prop("oggetto");
					if (oggetto2.nome != "mano") arma2 = nomeLocalizzato(oggetto2);
				}
				
				if (arma1 != undefined) {
					text += arma1;
				} 
				if (text != "" && arma2 != undefined) {
					text += " and " + arma2;
				} else if (text == "" && arma2 != undefined) {
					text += arma2;
				} else if (text == "") {
					text = locCorrente["pugni nudi!"];
				}
				
				aggiungiLog(nomeEroe + locCorrente[" attacca con "] + text, "risultato-scontro");
			
				if (attaccoDx > 0) {
				
					var txt = locCorrente["infligge "];
					var classe = "viola";
					
					attaccoTemp = randomizza50(attaccoDx);
					if (Math.random()*100 < critico) {
						attaccoTemp *=2;
						txt = locCorrente["infligge un CRITICO per "]
						classe = "morto";
					}
					dannoEroe = attaccoTemp-difesaNemico;
					if (dannoEroe <= 0)
					{
						dannoEroe = 1;
					}
					vitaNemico -= dannoEroe;
					
					modificaStatsVisualizzate("#salute-mostro-value", vitaNemico, "rosso");
					$(".salute-mostro-bar").animate({width: (vitaNemico/maxVitaNemico)*100 +"%"}, roundTimer/2);
					
					aggiungiLog(nomeEroe 
					+ " <span class='flaticon-roll'> </span>(<span class='flaticon-attacco'> </span>" 
					+ attaccoTemp 
					+ " - <span class='flaticon-difesa'> </span>" 
					+ difesaNemico 
					+ "): " 
					+ txt
					+ dannoEroe 
					+ locCorrente[" danni"], classe);
				}
				
				if (attaccoSx > 0) {
				
					var txt = locCorrente["infligge "];
					var classe = "viola";
					
					attaccoTemp = randomizza50(attaccoSx);
					if (Math.random()*100 < critico) {
						attaccoTemp *=2;
						txt = locCorrente["infligge un CRITICO per "]
						classe = "morto";
					}
					dannoEroe = attaccoTemp-difesaNemico;
					if (dannoEroe <= 0)
					{
						dannoEroe = 1;
					}
					vitaNemico -= dannoEroe;
					
					modificaStatsVisualizzate("#salute-mostro-value", vitaNemico, "rosso");			
					$(".salute-mostro-bar").animate({width: (vitaNemico/maxVitaNemico)*100 +"%"}, roundTimer/2);
					
					aggiungiLog(nomeEroe 
					+ " <span class='flaticon-roll'> </span>(<span class='flaticon-attacco'> </span>" 
					+ attaccoTemp 
					+ " - <span class='flaticon-difesa'> </span>" 
					+ difesaNemico 
					+ "): " 
					+ txt 
					+ dannoEroe 
					+ locCorrente[" danni"], classe);
				}
				$(".salute-mostro-bar").addClass("bgBianco");		
				$(".salute-mostro-bar").toggleClass("bgBianco", roundTimer/2, "easeInOutCubic" );
				turnoEroe = !turnoEroe;
			} else {
				if (mostroScelto.azioni.length > 0) {
					var attaccoScelto = estraiDaListaPesata(mostroScelto.azioni);
					switch(attaccoScelto.nome){ 
						case "rigenera":
							vitaNemico+= randomizza50(Math.round(maxVitaNemico*0.2));
							if (vitaNemico > maxVitaNemico)
							{
								vitaNemico = maxVitaNemico;
							}
							attaccoNemico= 0;
							aggiungiLog(nomeNemico + locCorrente[" rigenera le sue ferite"], "risultato-scontro");
						break;
						case "artiglio":
							aggiungiLog(nomeNemico + locCorrente[" artiglia "] + nomeEroe, "risultato-scontro");
							attaccoNemico = baseAttaccoNemico;
						break;
						case "colpoCoda":
							difesa -= 5;
							attaccoNemico = Math.round(baseAttaccoNemico*0.25);
							aggiungiLog(nomeNemico + locCorrente[" sferra un colpo con la coda, abbassando le difese dell'eroe di "]  + nomeEroe, "risultato-scontro");
							modificaStatsVisualizzate("#difesa-value", difesa, "blu");

						break;
						case "corazzaSpine":
							difesaNemico += 5;
							attaccoNemico = Math.round(baseAttaccoNemico*0.25);
							aggiungiLog(nomeNemico + locCorrente[" genera la sua corazza spinata!"], "risultato-scontro");
							modificaStatsVisualizzate("#difesa-mostro-value", difesaNemico, "blu");
						break;
					}
				}
				
				var txt = locCorrente["infligge "];
				var classe = "rosso";
				
				attaccoNemicoTemp = randomizza50(attaccoNemico);
				if (Math.random()*100 < 10) {
					attaccoTemp *=2;
					txt = locCorrente["infligge un CRITICO per "]
					classe = "morto";
				}
				dannoNemico = attaccoNemicoTemp-difesa;
				if ( dannoNemico <= 0)
				{
					dannoNemico = 1;
				}
				salute -= dannoNemico;
				
				modificaStatsVisualizzate("#salute-value", salute, "rosso");
				$(".numeri-mostro").css("height", $(".numeri-eroe").height());
				
				
				aggiungiLog(nomeNemico
				+ " <span class='flaticon-roll'> </span>(<span class='flaticon-attacco'> </span>"
				+ attaccoNemicoTemp + " - <span class='flaticon-difesa'> </span>" 
				+ difesa
				+ "): "
				+ txt
				+ dannoNemico
				+ locCorrente[" danni"], classe);
				
				turnoEroe = !turnoEroe;
			}
			
			if(salute <= 0 || vitaNemico <= 0) {
				clearInterval(loop);
				if (salute > 0)
				{
					
					$('.stats-mostro').children().fadeOut(700, function(){
						$(this).empty();
					});
					
					if (numeroRandom(0, 100) > 25) 
					{
						generaOggetto();
					}
					
					aggiungiLog(nomeEroe + locCorrente[" ha sconfitto "] + nomeNemico, "morto");
					cambiaStatoGioco("scende");
				}
				else
				{
					cambiaStatoGioco("morto");
					aggiungiLog(nomeEroe + locCorrente[" è morto"], "morto");
					
					setTimeout(function(){ 
						var r = confirm(nomeEroe + locCorrente[" é morto! Riprova?\n\n Livello raggiunto: "] + livello);
						if(r == true){
							location.reload();
						}
					}, 2000);
				}
			}
		}, roundTimer*2);
	}
}

// function popup(){
// 	$("#alert-villaggio").dialog("open");
// };
	

