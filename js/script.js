var livello = 0;
var livelloBoss = 10;

var attacco = 10;
var difesa = 10;
var maxSalute = 200;
var salute = maxSalute;
var critico =10;
var mana = 0;
var monete = 0;

var nomeEroe;

var statoGioco;
var roundTimer = 700;
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
		spazio();
		numDungeon = Math.floor(Math.random()*4)+1;
		aggiungiLog(testo+", Boss!", "titolo-livello");
		scontro(listaMostri["boss"]);
		livelloBoss += randomizza50(10);
	} else if(livello != livelloBoss){
		spazio();
		aggiungiLog(testo, "titolo-livello");
		evento();
	}
}

function cambiaStatoGioco(nuovoStatoGioco){
	statoGioco = nuovoStatoGioco;
	if (nuovoStatoGioco == "combattimento"){
		$("#bottone-start").val(locCorrente["In combattimento.."]);
		$("#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx, #lista").sortable( "disable" );
		blocco("#bottone-start",true);	
		$("#bottone-start").removeClass("bottone-verde");
		$("#bottone-start").addClass("bottone-rosso");
	} else if (nuovoStatoGioco == "scende"){
		$("#bottone-start").val(locCorrente["Scende ancora.."]);
		$("#equip-testa, #equip-corpo, #equip-manoDx, #equip-manoSx, #lista").sortable( "enable" );
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
	
	
	aggiungiLog(nomeEroe + locCorrente[" incontra: "] + nomeNemico + "!", "rosso");
	
	cambiaStatoGioco("combattimento");	
	
	statsMostro(vitaNemico, maxVitaNemico, attaccoNemico, difesaNemico, nomeNemico);

	 function loopLi() {
		var loop = setInterval(function() { 

			if (mostroScelto.azioni.length > 0) {
			var attaccoScelto = estraiDaListaPesata(mostroScelto.azioni);
			spazio();
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
		attaccoNemicoTemp = randomizza50(attaccoNemico);
		attaccoTemp = randomizza50(attacco);
		dannoNemico = attaccoNemicoTemp-difesa;
		dannoEroe = attaccoTemp-difesaNemico;
		if ( dannoNemico <= 0)
		{
			dannoNemico = 1;
		}
		if (dannoEroe <= 0)
		{
			dannoEroe = 1;
		}
		salute -= dannoNemico;
		vitaNemico -= dannoEroe;
		
		$(".numeri-mostro").css("height", $(".numeri-eroe").height());
		$(".salute-mostro-bar").animate({width: (vitaNemico/maxVitaNemico)*100 +"%"}, roundTimer/2);
		modificaStatsVisualizzate("#salute-value", salute, "rosso");
		modificaStatsVisualizzate("#salute-mostro-value", vitaNemico, "rosso");
		
		aggiungiLog(nomeNemico
		+ " <span class='flaticon-roll'> </span>(<span class='flaticon-attacco'> </span>"
		+ attaccoNemicoTemp + " - <span class='flaticon-difesa'> </span>" 
		+ difesa
		+ "): "
		+ locCorrente["infligge "]
		+ dannoNemico
		+ locCorrente[" danni"], "rosso");
		aggiungiLog(nomeEroe + locCorrente[" attacca con "], "risultato-scontro");
		aggiungiLog(nomeEroe 
		+ " <span class='flaticon-roll'> </span>(<span class='flaticon-attacco'> </span>" 
		+ attaccoTemp 
		+ " - <span class='flaticon-difesa'> </span>" 
		+ difesaNemico 
		+ "): " 
		+ locCorrente["infligge "] 
		+ dannoEroe 
		+ locCorrente[" danni"], "viola");
			
			
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
					
					spazio();
					aggiungiLog(nomeEroe + locCorrente[" ha sconfitto "] + nomeNemico, "morto");
					cambiaStatoGioco("scende");
					spazio();
				}
				else
				{
					cambiaStatoGioco("morto");
					spazio();
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
	loopLi();
}

// function popup(){
// 	$("#alert-villaggio").dialog("open");
// };
	

