var livello = 0;
var livelloBoss = 10;

var attaccoManiNude = 5;
var attaccoDx = attaccoManiNude;
var attaccoSx = attaccoManiNude;
var difesa = 0;
var maxSalute = 100;
var salute = maxSalute;
var critico = 10;
var mana = 0;
var monete = 0;

var coloreEroe = "viola";
var coloreNemico = "rosso";
var nomeEroe = "Ser Random";

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
var listaMetalli = [];
var listaPozioni = [];
var listaQualita = [];
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
		$.each(data.qualita, function( key, val )
		{
			listaQualita[val.nome] = val;
		});
		$.each(data.materiali, function( key, val )
		{
			$.each(val.metalli, function( key, val )
			{
				listaMetalli[val.nome] = val;
			});
			$.each(val.pozioni, function( key, val )
			{
				listaPozioni[val.nome] = val;
			});
		});
	})
	.done(function() {
	trovaOggetto();
	trovaOggetto();
	trovaOggetto();
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
	});
	
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
	
	aggiungiLog(nomeEroe + locCorrente[" incontra: "] + nomeNemico + "!", "incontro");
	
	cambiaStatoGioco("combattimento");	
	
	statsMostro(vitaNemico, maxVitaNemico, attaccoNemico, difesaNemico, nomeNemico);
	
	loopLi();

	function loopLi() {
		var loop = setInterval(function() { 
		
			if (turnoEroe) {
			
				var arma1, arma2;
				var text = "";
				
				arma1 =  nomeArma("#equip-manoDx");
				arma2 =  nomeArma("#equip-manoSx");
				
				if (arma1 != undefined) {
					text += arma1;
				} 
				if (text != "" && arma2 != undefined) {
					text += locCorrente[" e "] + arma2;
				} else if (text == "" && arma2 != undefined) {
					text += arma2;
				} else if (text == "") {
					text = locCorrente["pugni nudi!"];
				}
				
				aggiungiLog(nomeEroe + locCorrente[" attacca con "] + text, "azione");
			
				if (attaccoDx > 0) {
					setTimeout(function() {
						vitaNemico -= attaccoEroe(attaccoDx, difesaNemico, arma1);
						$(".salute-mostro-bar").animate({width: (vitaNemico/maxVitaNemico)*100 +"%"}, roundTimer/2);
						modificaStatsVisualizzate("#salute-mostro-value", vitaNemico, "rosso");
						}, roundTimer/3);
				}
				
				if (attaccoSx > 0) {
					setTimeout(function() {
						vitaNemico -= attaccoEroe(attaccoSx, difesaNemico, arma2);
						$(".salute-mostro-bar").animate({width: (vitaNemico/maxVitaNemico)*100 +"%"}, roundTimer/2);
						modificaStatsVisualizzate("#salute-mostro-value", vitaNemico, "rosso");
					}, roundTimer/3*2);
				}
				
				$(".salute-mostro-bar").addClass("bgBianco");		
				$(".salute-mostro-bar").toggleClass("bgBianco", roundTimer/2, "easeInOutCubic" );
				
				turnoEroe = !turnoEroe;
			} else if (vitaNemico > 0) {
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
							aggiungiLog(nomeNemico + locCorrente[" rigenera le sue ferite"], "azione");
						break;
						case "artiglio":
							aggiungiLog(nomeNemico + locCorrente[" artiglia "] + nomeEroe, "azione");
							attaccoNemico = baseAttaccoNemico;
						break;
						case "colpoCoda":
							difesa -= 5;
							attaccoNemico = Math.round(baseAttaccoNemico*0.25);
							aggiungiLog(nomeNemico + locCorrente[" sferra un colpo con la coda, abbassando le difese dell'eroe di "]  + nomeEroe, "azione");
							modificaStatsVisualizzate("#difesa-value", difesa, "blu");

						break;
						case "corazzaSpine":
							difesaNemico += 5;
							attaccoNemico = Math.round(baseAttaccoNemico*0.25);
							aggiungiLog(nomeNemico + locCorrente[" genera la sua corazza spinata!"], "azione");
							modificaStatsVisualizzate("#difesa-mostro-value", difesaNemico, "blu");
						break;
					}
				}
				
				var txt = locCorrente["infligge "];
				var classe = coloreNemico + " roll";;
				var txtEffect;
				
				attaccoNemicoTemp = randomizza50(attaccoNemico);
				if (Math.random()*100 < 10) {
					attaccoNemicoTemp *=2;
					txt = locCorrente["infligge un CRITICO per "]
					classe = "criticoTxt " + coloreNemico;
					txtEffect = "shake";
				}
				dannoNemico = attaccoNemicoTemp-difesa;
				if ( dannoNemico <= 0)
				{
					dannoNemico = 1;
				}
				setTimeout(function() {
					salute -= dannoNemico;
					modificaStatsVisualizzate("#salute-value", salute, "rosso");
					$(".numeri-mostro").css("height", $(".numeri-eroe").height());
				
				aggiungiLog(
				"<span class='flaticon-roll'>   "
					+	nomeNemico 
					+ " </span>(<span class='flaticon-attacco'> </span>"
					+ attaccoNemicoTemp + " - <span class='flaticon-difesa'> </span>" 
					+ difesa
					+ "): "
					+ txt
					+ dannoNemico
					+ locCorrente[" danni"], classe, txtEffect);
				
				turnoEroe = !turnoEroe;
				}, roundTimer/2);
			}
			
			if(salute <= 0 || vitaNemico <= 0) {
				clearInterval(loop);
				setTimeout(function()  {
					if (salute > 0)
					{
						
						$('.stats-mostro').children().fadeOut(700, function(){
							$(this).empty();
						});
						
						aggiungiLog(nomeEroe + locCorrente[" ha sconfitto "] + nomeNemico, "morto");
						
						if (numeroRandom(0, 100) > 25) 
						{
							trovaOggetto();
						}
						
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
						}, roundTimer*2);
					}
				}, roundTimer);
			}
		}, roundTimer*2);
	}
}

function nomeArma(slot) {
	if ($(slot).find("li").length > 0) {
		var oggetto = $(slot + " li").first().prop("oggetto");
		if (oggetto.attacco >= 0 && oggetto.attacco != undefined) {
			return nomeLocalizzato(oggetto);
		}
	} else {
		return locCorrente["pugno"];
	}
}

function attaccoEroe(attacco, difesaNemico, arma) {
	var txt = locCorrente["infligge "];
	var classe = coloreEroe + " roll";
	var txtEffect;
	
	attaccoTemp = randomizza50(attacco);
	if (Math.random()*100 < critico) {
		attaccoTemp *=2;
		txt = locCorrente["infligge un CRITICO per "]
		classe = "criticoTxt " + coloreEroe;
		txtEffect = "shake";
	}
	dannoEroe = attaccoTemp-difesaNemico;
	if (dannoEroe <= 0)
	{
		dannoEroe = 1;
	}	
	aggiungiLog(
	"<span class='flaticon-roll'>   " 
	+ nomeEroe 
	+ " </span>(<span class='flaticon-attacco'> </span>" 
	+ attaccoTemp 
	+ " - <span class='flaticon-difesa'> </span>" 
	+ difesaNemico 
	+ "): " 
	+ txt
	+ dannoEroe 
	+ locCorrente[" danni con "] + arma, classe, txtEffect);
	
	return dannoEroe;
}