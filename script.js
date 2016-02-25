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

var roundTimer = 700;
var fattoreScala = 50;

var stop = false;
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

$.getJSON( "localizzazione.json", function(data) {
	$.each(data.stringhe, function( key, val ) 
	{
		locIta[val.ita] = val.ita;
		locEn[val.ita] = val.en;
		console.log(val.ita+val.en);
	});
})
.done(function() {
	console.log( "JSON letto con successo, analisi liste:" );
	console.log(locIta);
	console.log(locEn);
})
.fail( function(d, textStatus, error) {
	console.error("getJSON failed, status: " + textStatus + ", error: "+error)
});

$.getJSON( "data.json", function(data) {
	$.each(data.nemici, function( key, val ) 
	{
		listaMostri[val.nomeIta] = val;
		// console.log(val);
	});
	$.each(data.oggetti, function( key, val )
	{
		listaOggetti[val.nome] = val;
		// console.log(val);
	});
})
.done(function() {
	console.log( "JSON letto con successo, analisi liste:" );
	console.log(listaMostri);
	console.log(listaOggetti);
})
.fail( function(d, textStatus, error) {
	console.error("getJSON failed, status: " + textStatus + ", error: "+error)
});	

$(document).ready( function(){
	locCorrente = locEn;
	dungeon(numDungeon);
	dungeon(numDungeon);
	heightwindow = $( window ).height();
	$('.colonna-sx').css("height", heightwindow/5*4);
	$(".header").css("height", $(".colonna-sx").height()*0.13);
	$(".toggle-container").css("height", $(".colonna-sx").height()*0.7);
	$("#scelta-nome").css("height", $(".colonna-sx").height()*0.17);
	$("#bottone-start").css("height", $(".colonna-sx").height()*0.17);
	$("#gioco").css("height", heightwindow/5*4);
	$("#arena").css("height", heightwindow/5*1);

	$(".footer-content").css({height: $("footer").height()-5});

	$(".footer-pull,.triangolo,footer").click(function(){
		$("footer").slideToggle("slow");
	})
	$(".salute-bar").animate({width: (salute/maxSalute)*100 +"%"}, roundTimer);			
	modificaStatsVisualizzate("#attacco-value", attacco, "arancione");
	modificaStatsVisualizzate("#difesa-value", difesa, "blu");
	modificaStatsVisualizzate("#salute-value", salute, "verde");
	$("#maxSalute-value").append(" " + maxSalute);
	modificaStatsVisualizzate("#critico-value", critico, "rosso");
	modificaStatsVisualizzate("#mana-value", mana, "viola");
	modificaStatsVisualizzate("#monete-value", monete, "giallo");
	blocco("#bottone-start",false);	
	
	$(".avvia-gioco").click(function(){
		gioco();
	});
	
	var s1 = nomeEroe + locCorrente[" torna al villaggio"];
	var s2 = nomeEroe + locCorrente[" procede"];

	$("#alert-villaggio").dialog({
		autoOpen: false,
		dialogClass: "no-close",
		modal: true,
		buttons: {
			s1: function(){
				$(this).dialog("close");
				villaggio();
				stop = true;
			},
			s2: function(){
				$(this).dialog("close");
				aggiungiLog(nomeEroe + locCorrente[" procede"], "titolo-livello");
				dungeon(numDungeon);
				spazio();	
				stop = false;
				gioco();
				blocco("#bottone-start",false);
			}
		}
	})
});

$(window).resize(function () { 
	heightwindow =$( window ).height();
	$('.colonna-sx').css("height", heightwindow/5*4);
	$(".header").css("height", $(".colonna-sx").height()*0.13);
	$(".toggle-container").css("height", $(".colonna-sx").height()*0.7);
	$("#scelta-nome").css("height", $(".colonna-sx").height()*0.17);
	$("#bottone-start").css("height", $(".colonna-sx").height()*0.17);
	$("#gioco").css("height", heightwindow/5*4);
	$("#arena").css("height", heightwindow/5*1);
});
	
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

function gioco()
{
	console.log(numDungeon);

	sistemaNome();
	
	if(stop == false){
		livello++;
		var testo= nomeEroe + locCorrente[" ha raggiunto il livello del dungeon: "] + livello;
		if(livello == livelloBoss){
			aggiungiLog(testo+", Boss!", "titolo-livello");
			scontro(listaMostri["boss"]);
			stop= true;
			livelloBoss += randomizza50(10);
		} else if(livello != livelloBoss){
			aggiungiLog(testo, "titolo-livello");
			evento();
		}
	} else if(stop == true){
		numDungeon = Math.floor(Math.random()*4)+1;
		popup();
		stop =false;
		blocco("#bottone-start",true);		
	}
}

function evento(){
	var mostroScelto = estraiDaListaPesata(listaMostri);
	scontro(mostroScelto);
}

function nomeLocalizzato(mostroObj)
{
	if (locCorrente == locEn)
	{
		return mostroObj.nomeEn;
	}
	else if (locCorrente == locIta)
	{
		return mostroObj.nomeIta;
	}
}

function scontro(mostroScelto) { 
	var nomeNemico = nomeLocalizzato(mostroScelto) ;
	var baseAttaccoNemico = randomizza25(parseInt(mostroScelto.attacco) + parseInt(mostroScelto.attacco)*livello/fattoreScala);
	var difesaNemico = randomizza25(parseInt(mostroScelto.difesa) + parseInt(mostroScelto.difesa)*livello/fattoreScala);
	var maxVitaNemico = randomizza25(parseInt(mostroScelto.vita) + parseInt(mostroScelto.vita)*livello/fattoreScala);
	var vitaNemico = maxVitaNemico;
	var attaccoNemico = baseAttaccoNemico;
	
	
	aggiungiLog(nomeEroe + locCorrente[" incontra: "] + nomeNemico + "!", "rosso");
	
	blocco("#bottone-start",true);	
	$("#bottone-start").val(locCorrente["In combattimento.."]);
	$("#bottone-start").removeClass("bottone-verde");
	$("#bottone-start").addClass("bottone-rosso");
	
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
					spazio();
					aggiungiLog(nomeEroe + locCorrente[" ha sconfitto "] + nomeNemico, "morto");
					
					blocco("#bottone-start", false);
					$('.stats-mostro').children().fadeOut(700, function(){
						$(this).empty();
					});
					if (numeroRandom(0, 100) > 25) 
					{
						generaOggetto();
					}
					$("#bottone-start").val(locCorrente["Scende ancora.."]);
					$("#bottone-start").removeClass("bottone-rosso");
					$("#bottone-start").addClass("bottone-verde");
					spazio();
				}
				else
				{
					spazio();
					aggiungiLog(nomeEroe + locCorrente[" è morto"], "morto");
					$("#bottone-start").val(locCorrente["Morto.."]);
					stop = true;
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

function aggiornamentoVisualOggetti( idContenitore)
{
	if (idContenitore == "lista")
	{
		array = arrayInventario;
	}
	else if (idContenitore == "equip-lista")
	{
		array = arrayEquip;
	}
	$("#" + idContenitore).empty();
	for (var x = 0; x <= array.length -1; x++)
	{
		var oggettoObj = array[x];
		var nuovoElemento = document.createElement("LI");
		nuovoElemento.className = "slot";
		var list = document.getElementById(idContenitore);
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
}

function generaOggetto(){
	var oggettoScelto = estraiDaListaPesata(listaOggetti);
	spazio();
	aggiungiLog(nomeEroe + locCorrente[" ha trovato: "] + nomeLocalizzato(oggettoScelto) + "!", oggettoScelto.coloreTesto);
	arrayInventario.push(oggettoScelto);
	aggiornamentoVisualOggetti("lista");
}

function muoviOggetto(oggettoObj, idContenitorePartenza, idContenitoreArrivo){

	if (idContenitorePartenza == "lista")
	{
		arrayPartenza = arrayInventario;
	}
	else if (idContenitorePartenza == "equip-lista")
	{
		arrayPartenza = arrayEquip;
	}
	
	if (idContenitoreArrivo == "equip-lista")
	{
		arrayArrivo = arrayEquip;
		
		if(oggettoObj.tipo == "equip"){
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
			} 
			else
			{
				aggiungiLog(nomeEroe + locCorrente["  non ha uno slot libero per questo oggetto!"]);
				spazio();
				return;
			}
			text = nomeEroe + locCorrente[" ha equipaggiato "] + nomeLocalizzato(oggettoObj) + ",";
			aggiornaStatsEquip(oggettoObj, text, true);
		} 
		else if (oggettoObj.tipo == "uso") 
		{
			if(salute < maxSalute){
				text = nomeEroe + locCorrente["  ha consumato "] + nomeLocalizzato(oggettoObj) + ",";
				aggiornaStatsEquip(oggettoObj, text, true);		
				arrayPartenza.splice($.inArray(oggettoObj, arrayPartenza),1);
				aggiornamentoVisualOggetti(idContenitorePartenza);
				return;
			} else{
				aggiungiLog(locCorrente["salute di "] + nomeEroe + locCorrente[" al massimo"]);
				return;
			}
		}
		spazio();	
	}
	else if (idContenitoreArrivo == "lista")
	{
		arrayArrivo = arrayInventario;
		
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
		text = nomeEroe + locCorrente[" ha rimosso "] + nomeLocalizzato(oggettoObj) + ",";
		aggiornaStatsEquip(oggettoObj, text, false);
		spazio();	
	}

	arrayPartenza.splice($.inArray(oggettoObj, arrayPartenza),1);
	aggiornamentoVisualOggetti(idContenitorePartenza);
	arrayArrivo.push(oggettoObj);
	aggiornamentoVisualOggetti(idContenitoreArrivo);
}

$(document).on("click", "#lista .slot", function(){
	var oggettoObj = $(this).prop("oggetto");
	muoviOggetto(oggettoObj, "lista", "equip-lista");
});

$(document).on("click", "#equip-lista .slot", function(){
	var oggettoObj = $(this).prop("oggetto");
	muoviOggetto(oggettoObj, "equip-lista", "lista");
});

function aggiornaStatsEquip(oggettoObj, text, equipaggiato) 
{
	if (oggettoObj.attacco != 0 && oggettoObj.attacco != undefined)
	{
		if (equipaggiato)
		{
			attacco += parseInt(oggettoObj.attacco);
			modificaStatsVisualizzate("#attacco-value", attacco, "arancione");
			text += " <span class='flaticon-attacco'></span> " + locCorrente['Attacco'] + " + " + oggettoObj.attacco;
		} 
		else 
		{
			attacco -= parseInt(oggettoObj.attacco);
			modificaStatsVisualizzate("#attacco-value", attacco, "blu");
			text += " <span class='flaticon-attacco'></span> " + locCorrente['Attacco'] + " - " + oggettoObj.attacco;
		}
		
	}
	if (oggettoObj.difesa != 0 && oggettoObj.difesa != undefined)
	{
		if (equipaggiato)
		{
			difesa += parseInt(oggettoObj.difesa);
			modificaStatsVisualizzate("#difesa-value", difesa, "blu");
			text += " <span class='flaticon-difesa'></span> " + locCorrente['Difesa'] + " + " + oggettoObj.difesa;
		} 
		else 
		{
			difesa -= parseInt(oggettoObj.difesa);
			modificaStatsVisualizzate("#difesa-value", difesa, "arancione");
			text += " <span class='flaticon-difesa'></span> " + locCorrente['Difesa'] + " - " + oggettoObj.difesa;
		}
	}
	if (oggettoObj.salute != 0 && oggettoObj.salute != undefined)
	{
		if (equipaggiato)
		{
			salute += parseInt(oggettoObj.salute);
			if (salute > maxSalute)		
			{		
				salute = maxSalute;		
			}
			modificaStatsVisualizzate("#salute-value", salute, "verde");
			text += " <span class='flaticon-salute'></span> " + locCorrente['Salute'] + " + " + oggettoObj.salute;
		} 
		else 
		{
			salute -= parseInt(oggettoObj.salute);
			if (salute > maxSalute)		
			{		
				salute = maxSalute;		
			}
			modificaStatsVisualizzate("#salute-value", salute, "rosso");
			text += " <span class='flaticon-salute'></span> " + locCorrente['Salute'] + " - " + oggettoObj.salute;
		}
	}
	if (oggettoObj.maxSalute != 0 && oggettoObj.maxSalute != undefined)
	{
		if (equipaggiato)
		{
			maxSalute += parseInt(oggettoObj.maxSalute);
			modificaStatsVisualizzate("#maxSalute-value", maxSalute, "verde");
			text += " <span class='flaticon-salute'></span> " + locCorrente['Max Salute'] + " + " + oggettoObj.maxSalute;
		} 
		else 
		{
			maxSalute -= parseInt(oggettoObj.maxSalute);
			modificaStatsVisualizzate("#maxSalute-value", maxSalute, "rosso");
			text += " <span class='flaticon-salute'></span> " + locCorrente['Max Salute'] + " - " + oggettoObj.salute;
		}
	}
	aggiungiLog(text, oggettoObj.coloreTesto);
}


function aggiungiLog(testo, classe){
	var nuovoElemento = '<p class="'+classe+'">'+testo+'</p>';
 	$(nuovoElemento).hide().appendTo($("#gioco")).fadeIn(300);
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/3);
}

function aggiungiLogComplesso(testo){
	var nuovoElemento = testo;
 	$(nuovoElemento).hide().appendTo($("#gioco")).fadeIn(300);
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/3);
}

function spazio(){
	$("#gioco").append("<br/>");
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/3);
}

function popup(){
	$("#alert-villaggio").dialog("open");
};
	
function modificaStatsVisualizzate(div, nuovoValore, classe){	
	$(div).empty();
	$(div).append(" " + nuovoValore);
	$(div).addClass(classe);
	$(div).addClass("bold");
	$(div).toggleClass( classe, roundTimer/2, "easeInOutCubic" );
	$(div).toggleClass( "bold", roundTimer/2, "easeInOutCubic" );
		
	if (div.indexOf("salute-mostro") != -1)
	{		
		$(".salute-mostro-bar").addClass("bgBianco");		
		$(".salute-mostro-bar").toggleClass("bgBianco", roundTimer/2, "easeInOutCubic" );
	}
	else if (div.indexOf("salute") != -1)
	{
		$(".salute-bar").animate({width: (salute/maxSalute)*100 +"%"}, roundTimer/2);		
		$(".salute-bar").addClass("bgBianco");		
		$(".salute-bar").toggleClass("bgBianco", roundTimer/2, "easeInOutCubic" );	
	}
}
