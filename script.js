
var livello = 0;
var testo;
var stop = false;
var livelloBoss = [10, 20, 30, 40];
var attacco = 10;
var difesa = 10;
var maxSalute = 100;
var salute = 100;
var critico =10;
var mana = 0;
var monete = 0;
var nomeEroe;
var livello = 0;
var roundTimer = 700;

var maniLibere = 2;
var testa = 0;
var corpo = 0;
var heightwindow;
var numDungeon = 1;
var x = 0;

$(document).ready( function(){
	dungeon(numDungeon);
	heightwindow = $( window ).height();
	$('.colonna-sx').animate({height: (heightwindow)+'px'}, "slow");
	$('#gioco').animate({height: (heightwindow/3*2)+'px'}, "slow");		
	$('#arena').animate({height: (heightwindow/3)+'px'}, "slow");		

	$(".salute-bar").animate({width: (salute/maxSalute)*100 +"%"}, roundTimer);			
	modificaStatsVisualizzate("#attacco-value", attacco, "arancione");
	modificaStatsVisualizzate("#difesa-value", difesa, "blu");
	modificaStatsVisualizzate("#salute-value", salute, "verde");
	$("#maxSalute-value").append(" " + maxSalute);
	modificaStatsVisualizzate("#critico-value", critico, "rosso");
	modificaStatsVisualizzate("#mana-value", mana, "viola");
	modificaStatsVisualizzate("#monete-value", monete, "giallo");
	blocco("#bottone-start",false);	
	$(".avvia-gioco").click(function(){gioco()});





	$("#alert-villaggio").dialog({		//POPUP DI FINE GIOCO
		autoOpen: false,
		dialogClass: "no-close",
		modal: true,
		buttons: {
			"Torna al villaggio": function(){
				$(this).dialog("close");
				villaggio();
				stop = true;
			},
			"Vai avanti": function(){
				$(this).dialog("close");
				aggiungiLog("VAI AVANTI", "titolo-livello");
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
	$('.colonna-sx').animate({height: (heightwindow)+'px'}, 200);
	$('#gioco').animate({height: (heightwindow/3*2)+'px'}, 200);		
	$('#arena').animate({height: (heightwindow/3)+'px'}, 200);		
});


var mappaMostri = {};
var mappaOggetti = {};
var listaMostri = [];
var listaOggetti = [];

console.log( "lettura JSON:" ); //MISTER JSON VIENE LETTO E GIUDICATO PER I SUOI PECCATI
$.getJSON( "data.json", function(data) {
	$.each(data.nemici, function( key, val ) //MOSTRI FINISCONO IN UNA MAPPA E IN UNA LISTA 
	{
		mappaMostri[val.nome] = val; 	//(LISTA = NOME DEL MOSTRO ASSOCIATO A UN 'OGGETTO' MOSTRO) 
														//var mostroScelto = listaMostri[NOME MOSTRO]
														//mostroScelto puo poi essere usato per estrarne le proprietá come vita/attacco/etc (var x = mostroScelto.attacco)
		listaMostri.push(val); //(LISTA = NUMERO INDICE ASSOCIATO A UN 'OGGETTO' MOSTRO) 
										//var mostroScelto = listaMostri[NUMEROINDICE]
		// console.log(val);
	});
	$.each(data.oggetti, function( key, val )  //OGGETTI FINISCONO IN UNA MAPPA E IN UNA LISTA, COME SOPRA
	{
		mappaOggetti[val.nome] = val;
		listaOggetti.push(val);
		// console.log(val);
	});
})
.done(function() {
	console.log( "" );
	console.log( "JSON letto con successo, analisi mappe e liste:" );
	console.log(mappaMostri);
	console.log(mappaOggetti);
	console.log(listaMostri);
	console.log(listaOggetti);
})
.fail( function(d, textStatus, error) {
	console.error("getJSON failed, status: " + textStatus + ", error: "+error)
});
	
function nome(){
	nomeEroe = $("#nomeEroe").val();
	if(nomeEroe.indexOf("Ser") >=0 || nomeEroe.indexOf("ser") >=0){
		$("#nomeEroe").val(nomeEroe);
	} else{
		nomeEroe = "Ser "+ $("#nomeEroe").val();
		$("#nomeEroe").val(nomeEroe);
	}
}

function blocco(input,toggle){
	$(input).prop("disabled", toggle);
}
	
 function numeroRandom(min, max) { //NUOVO RANDOMIZZATORE CON MASSIMI E MINIMI
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizza50(valore) { //UNA FUNZIONE CHE FA IL -50%/+50% DA SOLA PER VARIARE DANNI E CURE
	return Math.round((valore/2)+(valore*Math.random()));
}
 
var generaListaPesata = function(lista)  //FUNZIONE CHE GESTISCE LE LISTE PESATE
{
	var listaPesata = [];
	// console.log(" ");
	// console.log("roll chances:");
	
	for (var i = 0; i < lista.length; i++) 
	{
		var multiples = lista[i].chance * 100;
		
		// console.log("chances " + lista[i].nome + " = " + lista[i].chance)

		for (var j = 0; j < multiples; j++) 
		{
			listaPesata.push(lista[i]);
		}
	}
	return listaPesata;
}

function gioco(){
console.log(numDungeon);

	nome();
	if(nomeEroe == "Ser " || nomeEroe == null){
		nomeEroe = "Ser Random";
		$("#nomeEroe").val(nomeEroe);
	}
	$(".stats-eroe h3").html("statistiche"+nomeEroe);
	blocco("#nomeEroe", true);
	if(stop == false){
		livello++;
		testo= nomeEroe + " è al livello " + livello;
		if(livello == livelloBoss[x]){
			aggiungiLog(testo+", Boss!!!", "titolo-livello");
			scontro(mappaMostri['boss']);
			stop= true;
		} else if(livello != livelloBoss[x]){
			aggiungiLog(testo, "titolo-livello");
			evento();
		}
	} else if(stop == true){
		x++;	
		numDungeon = Math.floor(Math.random()*4)+1;
		popup();
		stop =false;
		blocco("#bottone-start",true);		
	}
}

function evento(){
	var listaPesata = generaListaPesata(listaMostri);
	mostroScelto = listaPesata[numeroRandom(0, listaPesata.length-1)];
	aggiungiLog("incontri: " + mostroScelto.nome + "!", "rosso");
	scontro(mostroScelto);
}

function generaOggetto(){
	var listaPesata = generaListaPesata(listaOggetti);
	oggettoScelto = listaPesata[numeroRandom(0, listaPesata.length-1)];
	spazio();
	aggiungiLog(nomeEroe + " ha trovato: " + oggettoScelto.nomeEsterno + "!", oggettoScelto.coloreTesto);
	aggiungiOggetto("", oggettoScelto, "LI", "lista");
}



function scontro(mostroScelto){ //UN UNICO COSO PER GESTIRE SCONTRI CON NEMICI E BOSS, MENO CODICE, UOMOZ FELICE
	var nomeNemico = mostroScelto.nome;
	var attaccoNemico = parseInt(mostroScelto.attacco);
	var baseAttaccoNemico = parseInt(mostroScelto.attacco);
	var difesaNemico = parseInt(mostroScelto.difesa);
	var vitaNemico = parseInt(mostroScelto.vita);
	var maxVitaNemico = parseInt(mostroScelto.vita);
	


	blocco("#bottone-start",true);	
	$("#bottone-start").val("In combattimento..");
	$("#bottone-start").removeClass("bottone-verde");
	$("#bottone-start").addClass("bottone-rosso");

	statsMostro(vitaNemico, maxVitaNemico, attaccoNemico, difesaNemico);

	 function loopLi() {
		var loop = setInterval(function() { 


			if (mostroScelto.azioni.length > 0) {
			var listaPesataAzioni = generaListaPesata(mostroScelto.azioni);
			attaccoScelto = listaPesataAzioni[numeroRandom(0, listaPesataAzioni.length-1)];
			// console.log(attaccoScelto.nome);
			switch(attaccoScelto.nome){ //UN COSO CHE GESTISCE AZIONI SPECIALI PER QUALUNQUE MOSTRO, VEDI IL JSON COME AGGIUNGERE AZIONI AD ALTRI MOSTRI
				case "leccaFerite":
					vitaNemico+= randomizza50(Math.round(maxVitaNemico*0.2));
					if (vitaNemico > maxVitaNemico)
					{
						vitaNemico = maxVitaNemico;
					}
					attaccoNemico= 0;
					aggiungiLog(nomeNemico +" si lecca le ferite, vita "+ nomeNemico +" attuale: " + vitaNemico);
				break;
				case "pugnoLato":
					aggiungiLog(nomeNemico +" tira un pugno di lato");
					attaccoNemico = baseAttaccoNemico; //RESI STI VALORI DELLE PERCENTUALI DELL ATTACCO BASE DEL MOSTRO COSI LI POSSIAMO USARE ANCHE SU TROLL ETC
				break;
				case "colpoCoda":
					difesa -= 5;
					attaccoNemico = Math.round(baseAttaccoNemico*0.25);
					aggiungiLog(nomeNemico +" usa colpo-coda! Tua nuova difesa: "+ difesa);
					modificaStatsVisualizzate("#difesa-value", difesa, "blu");

				break;
				case "corazzaLava":
					difesaNemico += 5;
					attaccoNemico = Math.round(baseAttaccoNemico*0.25);
					aggiungiLog(nomeNemico +" genera la sua corazza di lava!, difesa attuale: "+ difesaNemico);
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
		
		modificaStatsVisualizzate("#salute-value", salute, "rosso");
		modificaStatsVisualizzate("#salute-mostro-value", vitaNemico, "rosso");
		$(".salute-mostro-bar").animate({width: (vitaNemico/maxVitaNemico)*100 +"%"}, roundTimer);

		aggiungiLog(nomeNemico +" infligge "+ dannoNemico + " danni", "rosso");
		aggiungiLog(nomeEroe + " infligge " + dannoEroe + " danni", "viola");
		//aggiungiLog("Vita " + nomeNemico +": " + vitaNemico + ", vita " + //nomeEroe + ": "+ salute, "rapporto")
			
			
			if(salute <= 0 || vitaNemico <= 0) {
				clearInterval(loop);
				if (salute > 0)
				{
					aggiungiLog(nomeEroe + " ha sconfitto " + nomeNemico, "risultato-scontro");
					
					blocco("#bottone-start", false);
					$('.stats-mostro').children().fadeOut(700, function(){
						$(this).empty()
					});
					if (numeroRandom(0, 100) > 25) 
					{
						generaOggetto();
					}
					$("#bottone-start").val("Scende ancora..");
					$("#bottone-start").removeClass("bottone-rosso");
					$("#bottone-start").addClass("bottone-verde");
					spazio();
				}
				else
				{
					aggiungiLog(nomeEroe + " è morto", "morto");
					stop= true;
					var r = confirm(nomeEroe + " é morto! Riprova?\n\n Livello Raggiunto: "+livello);
					if(r == true){
						location.reload();
					}
				}
			}
		}, roundTimer*2);
	}
	loopLi();
}

function aggiungiOggetto(testo, oggettoObj, tipoElemento, idContainer){
	var nuovoElemento = document.createElement(tipoElemento);
	//var testoInterno = document.createTextNode(testo);  //PASSARE PARAMETRO TESTO COME STRINGA SE SI VUOLE SCRIVERE TESTO (NON TESTATO CON L'IMMAGINE OCCHIO)
	nuovoElemento.className = oggettoObj.nome + " oggetto slot";
	var list = document.getElementById(idContainer);
	list.insertBefore(nuovoElemento, list.childNodes[list.length]);  
	$(nuovoElemento).prop("nome",oggettoObj.nome);
	$("."+oggettoObj.nome).empty();
	$("."+oggettoObj.nome).prepend('<img id="theImg" src="images/' + oggettoObj.nome + '.png" />');
	var info = '<div class="info"><p>' + oggettoObj.nomeEsterno + '</p>';
	info += '<p>Tipo: ' + oggettoObj.tipo + '</p>';
	info += '<p>Slot: ' + oggettoObj.slot + '</p>';
	if (oggettoObj.attacco != 0)
	{
		info += '<p>Attacco: +' + oggettoObj.attacco + '</p>';
	}
	if (oggettoObj.difesa != 0)
	{
		info += '<p>Difesa: +' + oggettoObj.difesa + '</p>';
	}
	if (oggettoObj.salute != 0)
	{
		info += '<p>Salute: +' + oggettoObj.salute + '</p>';
	}
	$("."+oggettoObj.nome).append(info);
}


function aggiungiLog(testo, classe){
	var nuovoElemento = '<p class="'+classe+'">'+testo+'</p>';
 	$(nuovoElemento).hide().appendTo($("#gioco")).fadeIn(300);
	$("#gioco").animate({scrollTop:$("#gioco")[0].scrollHeight}, roundTimer/2);
}

function spazio(){
	$("#gioco").append("<br/>");
}

function popup(){
	$("#alert-villaggio").dialog("open");
};
	
function modificaStatsVisualizzate(tipo, valore, classe){	
	$(tipo).empty();
	$(tipo).append(" " + valore);
	$(tipo).addClass(classe);
	$(tipo).addClass("bold");
	$(tipo).toggleClass( classe, roundTimer, "easeInOutCubic" );
	$(tipo).toggleClass( "bold", roundTimer, "easeInOutCubic" );
	
	if(valore == salute){
		$(".salute-bar").animate({width: (salute/maxSalute)*100 +"%"}, roundTimer);		
		$(".salute-bar").addClass("bgBianco");		
		$(".salute-bar").toggleClass("bgBianco", roundTimer/5, "easeOutCubic" );		
	}
}

$(document).on("click", "#lista .oggetto", function(){
	var oggettoObj = mappaOggetti[$(this).prop("nome")];
	if(oggettoObj.tipo == "equip"){
		if ((oggettoObj.slot == "mano" && maniLibere >= 1)
			|| (oggettoObj.slot == "testa" && testa < 1)
			|| (oggettoObj.slot == "corpo" && corpo < 1)
			|| (oggettoObj.slot == "2 mani" && maniLibere >= 2))
		{
			if (oggettoObj.slot == "mano" )
			{
				maniLibere--;
			}
			else if (oggettoObj.slot == "testa" )
			{
				testa++;
			}
			else if (oggettoObj.slot == "corpo" )
			{
				corpo++;
			}
			else if (oggettoObj.slot == "2 mani" )
			{
				maniLibere -= 2;
			}
			$(this).remove();
			text = nomeEroe + " ha equipaggiato " + oggettoObj.nomeEsterno + ",";
			aggiornaStatsEquip(oggettoObj, text, true);
			aggiungiOggetto("", oggettoObj, "LI", "equip-lista");
		} 
		else 
		{
			aggiungiLog(nomeEroe + "  non ha uno slot libero per questo oggetto!");
		}
	} 
	else if (oggettoObj.tipo == "uso") 
	{
		if(salute < maxSalute){
			$(this).remove();		
			text = nomeEroe + "  ha consumato " + oggettoObj.nomeEsterno + ",";
			aggiornaStatsEquip(oggettoObj, text, true);		
		} else{
			aggiungiLog("salute di " + nomeEroe + " al massimo");
		}
	}
	spazio();	
});

$(document).on("click", "#equip-lista .oggetto", function(){
	var oggettoObj = mappaOggetti[$(this).prop("nome")];
	
		if (oggettoObj.slot == "mano" )
		{
			maniLibere++;
		}
		else if (oggettoObj.slot == "testa" )
		{
			testa--;
		}
		else if (oggettoObj.slot == "corpo" )
		{
			corpo--;
		}
		else if (oggettoObj.slot == "2 mani" )
			{
				maniLibere += 2;
			}
		$(this).remove();
		text = nomeEroe + " ha rimosso " + oggettoObj.nomeEsterno + ",";
		aggiornaStatsEquip(oggettoObj, text, false);
		aggiungiOggetto("", oggettoObj, "LI", "lista");
		 
		spazio();	

});

function aggiornaStatsEquip(oggettoObj, text, equipaggiato) 
{
	if (oggettoObj.attacco != 0)
	{
		if (equipaggiato)
		{
			attacco += parseInt(oggettoObj.attacco);
			modificaStatsVisualizzate("#attacco-value", attacco, "arancione");
			text += " attacco + " + oggettoObj.attacco;
		} 
		else 
		{
			attacco -= parseInt(oggettoObj.attacco);
			modificaStatsVisualizzate("#attacco-value", attacco, "arancione");
			text += " attacco - " + oggettoObj.attacco;
		}
		
	}
	if (oggettoObj.difesa != 0)
	{
		if (equipaggiato)
		{
			difesa += parseInt(oggettoObj.difesa);
			modificaStatsVisualizzate("#difesa-value", difesa, "blu");
			text += " difesa + " + oggettoObj.difesa;
		} 
		else 
		{
			difesa -= parseInt(oggettoObj.difesa);
			modificaStatsVisualizzate("#difesa-value", difesa, "blu");
			text += " difesa - " + oggettoObj.difesa;
		}
	}
	if (oggettoObj.salute != 0)
	{
		if (equipaggiato)
		{
			salute += parseInt(oggettoObj.salute);
			if (salute > maxSalute)		
			{		
				salute = maxSalute;		
			}
			modificaStatsVisualizzate("#salute-value", salute, "verde");
			text += " salute + " + oggettoObj.salute;
		} 
		else 
		{
			salute -= parseInt(oggettoObj.salute);
			if (salute > maxSalute)		
			{		
				salute = maxSalute;		
			}
			modificaStatsVisualizzate("#salute-value", salute, "verde");
			text += " salute - " + oggettoObj.salute;
		}
	}
	aggiungiLog(text, oggettoObj.coloreTesto);
}
