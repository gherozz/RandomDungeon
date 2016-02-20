var livello = 0;
var testo;
var stop = false;
var livelloBoss = 10;
var attacco = 10;
var difesa = 10;
var maxSalute = 100;
var salute = 100;
var nomeEroe

var mani = 0;
var testa = 0;
var corpo = 0;

$(document).ready(function(){
	blocco(false);
	nomeEroe = prompt("Inserisci il nome dell'eroe");
	if(nomeEroe == "" || nomeEroe == null){
		nomeEroe = "Ser Frocini";
	}
	console.log(nomeEroe);
	$("#attacco-value").append(attacco);
	$("#difesa-value").append(difesa);
	$("#salute-value").append(salute);
	$("#salute-bar").css("width", salute+'px');
	$("#salute-max").css("width", maxSalute+'px');
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
			console.log(val);
		});
		$.each(data.oggetti, function( key, val )  //OGGETTI FINISCONO IN UNA MAPPA E IN UNA LISTA, COME SOPRA
		{
			mappaOggetti[val.nome] = val;
			listaOggetti.push(val);
			console.log(val);
		});
	})
	.done(function() {
		console.log( "" );
		console.log( "JSON letto con successo, analisi mappe e liste:" ); //VARI CHECK SUL LOG PER VEDERE CHE FUNZIONI
		console.log(mappaMostri);
		console.log(mappaOggetti);
		console.log(listaMostri);
		console.log(listaOggetti);
	})
	.fail( function(d, textStatus, error) {
        console.error("getJSON failed, status: " + textStatus + ", error: "+error)
    });

 function numeroRandom(min, max) { //NUOVO RANDOMIZZATORE CON MASSIMI E MINIMI
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomizza50(valore) { //UNA FUNZIONE CHE FA IL -50%/+50% DA SOLA PER VARIARE DANNI E CURE
	return Math.round((valore/2)+(valore*Math.random()));
}
 
var generaListaPesata = function(lista)  //FUNZIONE CHE GESTISCE LE LISTE PESATE
{
	var listaPesata = [];
	console.log(" ");
	console.log("roll chances:");
	
	for (var i = 0; i < lista.length; i++) 
	{
		var multiples = lista[i].chance * 100;
		
		console.log("chances " + lista[i].nome + " = " + lista[i].chance)

		for (var j = 0; j < multiples; j++) 
		{
			listaPesata.push(lista[i]);
		}
	}
	return listaPesata;
}

function gioco(){
	if(stop == false){
		livello++;
		testo= nomeEroe + " è al livello " + livello;
		if(livello == livelloBoss){
			creaP(testo+", Boss!!!", "titolo-livello");
			scontro(mappaMostri['Boss']);
			stop= true;
			livello++;
		} else if(livello< livelloBoss){
			creaP(testo, "titolo-livello");
			evento();
			creaP("hai attacco: "+attacco+", difesa: "+difesa+", salute: "+salute);
			spazio();
		}
	} else if(stop == true){
		popup();	
	}
}

function evento(){ //SEMPLIFICATI EVENTI/CONDIZIONI MA CI VA LAVORATO
	if (numeroRandom(0, 100) > 50) 
	{
		var listaPesata = generaListaPesata(listaMostri);
		mostroScelto = listaPesata[numeroRandom(0, listaPesata.length-1)];
		creaP("incontri: " + mostroScelto.nome + "!", "rosso");
		scontro(mostroScelto);
	}
	else
	{
		var listaPesata = generaListaPesata(listaOggetti);
		oggettoScelto = listaPesata[numeroRandom(0, listaPesata.length-1)];
		creaP("hai trovato: " + oggettoScelto.nome + "!", oggettoScelto.coloreTesto);
		stampa("", oggettoScelto, "LI", "lista");
	}
}


function blocco(toggle){
	$("#bottone-start").prop("disabled", toggle);
}

function scontro(mostroScelto){ //UN UNICO COSO PER GESTIRE SCONTRI CON NEMICI E BOSS, MENO CODICE, UOMOZ FELICE
	var nomeNemico = mostroScelto.nome;
	var attaccoNemico = parseInt(mostroScelto.attacco);
	var baseAttaccoNemico = parseInt(mostroScelto.attacco);
	var difesaNemico = parseInt(mostroScelto.difesa);
	var vitaNemico = parseInt(mostroScelto.vita);
	var maxVitaNemico = parseInt(mostroScelto.vita);
	
	blocco(true);
	 function loopLi() {
		var loop = setInterval(function() { 

			if (mostroScelto.azioni.length > 0) {
			var listaPesataAzioni = generaListaPesata(mostroScelto.azioni);
			attaccoScelto = listaPesataAzioni[numeroRandom(0, listaPesataAzioni.length-1)];
			console.log(attaccoScelto.nome);
			switch(attaccoScelto.nome){ //UN COSO CHE GESTISCE AZIONI SPECIALI PER QUALUNQUE MOSTRO, VEDI IL JSON COME AGGIUNGERE AZIONI AD ALTRI MOSTRI
				case "leccaFerite":
					vitaNemico+= randomizza50(Math.round(maxVitaNemico*0.2));
					if (vitaNemico > maxVitaNemico)
					{
						vitaNemico = maxVitaNemico;
					}
					attaccoNemico= 0;
					creaP("Il "+ nomeNemico +" si lecca le ferite, vita "+ nomeNemico +" attuale: " + vitaNemico);
				break;
				case "pugnoLato":
					creaP("Il "+ nomeNemico +" tira un pugno di lato");
					attaccoNemico = baseAttaccoNemico; //RESI STI VALORI DELLE PERCENTUALI DELL ATTACCO BASE DEL MOSTRO COSI LI POSSIAMO USARE ANCHE SU TROLL ETC
				break;
				case "colpoCoda":
					difesa -= 5;
					attaccoNemico = Math.round(baseAttaccoNemico*0.25);
					creaP("Il "+ nomeNemico +" usa colpo-coda! Tua nuova difesa: "+ difesa);
				break;
				case "corazzaLava":
					difesaNemico += 5;
					attaccoNemico = Math.round(baseAttaccoNemico*0.25);
					creaP("Il "+ nomeNemico +" genera la sua corazza di lava!!!1!11, difesa attuale: "+ difesaNemico);
				break;
			}
		}
		attaccoNemicoTemp = randomizza50(attaccoNemico);
		attaccoTemp = randomizza50(attacco);
		dannoNemico = attaccoNemicoTemp-difesa;
		dannoEroe = attaccoTemp-difesaNemico;
		if ( dannoNemico < 0)
		{
			dannoNemico = 0;
		}
		if (dannoEroe < 0)
		{
			dannoEroe = 0;
		}
		salute -= dannoNemico;
		vitaNemico -= dannoEroe;
		
		stats("#salute-value", salute, "rosso");
		$("#salute-bar").css("width", salute+'px');		// MODIFICA IN TEMPO "REALE" LA STAT DELLA SALUTE DELL'EROE NELL'HEADER
		$("#gioco").animate({scrollTop: $(document).height()});

		creaP(nomeNemico +" infligge "+ dannoNemico + " danni", "rosso");
		creaP(nomeEroe + " infligge " + dannoEroe + " danni", "viola");
		creaP("Vita " + nomeNemico +": " + vitaNemico + ", vita " + nomeEroe + ": "+ salute)
			
			
			if(salute <= 0 || vitaNemico <= 0) {
				clearInterval(loop);
				if (salute > 0)
				{
					creaP(nomeEroe + " ha sconfitto " + nomeNemico, "risultato-scontro");
					spazio();
					blocco(false);

				}
				else
				{
					creaP(nomeEroe + " è morto", "morto");
					stop= true;
					var r = confirm("Sei Morto! Riprova?");
					if(r == true){
						location.reload();
					}
				}
			}
		}, 1000);
	}
	loopLi();
}

function stampa(testo, oggettoObj, tipoElemento, idContainer){	// GENERA LE MINIATURE NELL'INVENTARIO E NELL'EQUIPAGGIATO
	var nuovoElemento = document.createElement(tipoElemento);
	//var testoInterno = document.createTextNode(testo);  //PASSARE PARAMETRO TESTO COME STRINGA SE SI VUOLE SCRIVERE TESTO (NON TESTATO CON L'IMMAGINE OCCHIO)
	nuovoElemento.className = oggettoObj.nome + " oggetto slot";
	//nuovoElemento.appendChild(testoInterno);
	var list = document.getElementById(idContainer);
	list.insertBefore(nuovoElemento, list.childNodes[list.length]);  
	//immagini();		// FICCA LE IMMAGINI 
	$(nuovoElemento).prop("nome",oggettoObj.nome);
	$("."+oggettoObj.nome).empty();
	$("."+oggettoObj.nome).prepend('<img id="theImg" src="images/' + oggettoObj.nome + '.png" title="' + oggettoObj.nome + '"/>');
	var info = '<div class="info"><p>' + oggettoObj.nome + '</p>';
	info += '<p>Tipo: ' + oggettoObj.tipo + '</p>';
	info += '<p>Slot: ' + oggettoObj.slot + '</p>';
	if (oggettoObj.attacco > 0)
	{
		info += '<p>Attacco: +' + oggettoObj.attacco + '</p>';
	}
	if (oggettoObj.difesa > 0)
	{
		info += '<p>Difesa: +' + oggettoObj.difesa + '</p>';
	}
	if (oggettoObj.salute > 0)
	{
		info += '<p>Salute: +' + oggettoObj.salute + '</p>';
	}
	$("."+oggettoObj.nome).append(info);
}

/*
function immagini(){    //IN BASE ALLA CLASSE PASSATA ALLA FUNZIONE STAMPA() GENERA LA CORRETTA MINIATURA
	$(".spada").empty();
	$(".spada").prepend('<img id="theImg" src="images/spada-base.png" title="spada"/>');
	$(".spada").append('<div class="info"><p>Spada</p><p>Attacco: +10</p>');

	$(".scudo").empty();
	$(".scudo").prepend('<img id="theImg" src="images/scudo-base.png"/>');
	$(".scudo").append('<div class="info"><p>scudo</p><p>Difesa: +10</p>');

	$(".pozione").empty();
	$(".pozione").prepend('<img id="theImg" src="images/pozionesalute-base.png"/>');
	$(".pozione").append('<div class="info"><p>Pozione</p><p>Salute: +30</p>');

	$(".spada-incantata").empty();
	$(".spada-incantata").prepend('<img id="theImg" src="images/spada-incantata.png"/>');
	$(".spada-incantata").append('<div class="info"><p>Spada</p><p>incantata</p><p>Attacco: +30</p>');
};

*/


function creaP(testo, classe){		//CREA IL LOG DEL GIOCO
	var nuovoElemento = document.createElement("P");
	var testoInterno = document.createTextNode(testo);
	if(classe != undefined){
		nuovoElemento.className=classe;
	}
	nuovoElemento.appendChild(testoInterno);
	document.getElementById("gioco").appendChild(nuovoElemento);
}

function spazio(){				// CREA LO SPAZIO TRA IL LOG
	var nuovoElemento = document.createElement("P");
	var testoInterno = document.createTextNode("__________");
	nuovoElemento.appendChild(testoInterno);
	document.getElementById("gioco").appendChild(nuovoElemento);
}


function popup(){		// RICHIAMA JQUERY POPUP DI FINE GIOCO (2 SCELTE CUSTOMIZZABILI)
	$("#alert-villaggio").dialog("open");
};
	
function stats(tipo, valore, classe){		// FUNZIONE CHE MODIFICA LE STATS NELL'HEADER
	$(tipo).empty();
	$(tipo).append(valore);
	$(tipo).addClass(classe);	//ASSEGNA UN COLORE ALLA SCRITTA
	setTimeout(function(){
		$(tipo).removeClass(classe);	// RIMUOVE IL COLORE DOPO 0.4S, EFFETTO BOH MI GARBAVA
	}, 400);
	if(valore == salute){
		$("#salute-bar").css("width", salute+'px');
	}
}

// JQuery

$(document).on("click", "#lista .oggetto", function(){
	var oggettoObj = mappaOggetti[$(this).prop("nome")];
	if(oggettoObj.tipo == "equip"){
		if ((oggettoObj.slot == "mano" && mani < 2)
			|| (oggettoObj.slot == "testa" && testa < 1)
			|| (oggettoObj.slot == "corpo" && corpo < 1))
		{
			if (oggettoObj.slot == "mano" )
			{
				mani++;
			}
			else if (oggettoObj.slot == "testa" )
			{
				testa++;
			}
			else if (oggettoObj.slot == "corpo" )
			{
				corpo++;
			}
			$(this).remove();
			text = "equipaggi " + oggettoObj.nome + ",";
			aggiornaStatsEquip(oggettoObj, text, true);
			stampa("", oggettoObj, "LI", "equip-lista");
		} 
		else 
		{
			creaP("Non hai uno slot libero per questo oggetto!");
		}
	} 
	else if (oggettoObj.tipo == "uso") 
	{
		if(salute < maxSalute){
			$(this).remove();		
			text = "consumi " + oggettoObj.nome + ",";
			aggiornaStatsEquip(oggettoObj, text, true);		
		} else{
			creaP("salute al massimo");
		}
	}
	spazio();	
});

$(document).on("click", "#equip-lista .oggetto", function(){
	var oggettoObj = mappaOggetti[$(this).prop("nome")];
	//var r = confirm("rimuovi " + oggettoObj.nome +"?");
	//if(r == true)
	//{
		if (oggettoObj.slot == "mano" )
		{
			mani--;
		}
		else if (oggettoObj.slot == "testa" )
		{
			testa--;
		}
		else if (oggettoObj.slot == "corpo" )
		{
			corpo--;
		}
		$(this).remove();
		text = "rimuovi " + oggettoObj.nome + ",";
		aggiornaStatsEquip(oggettoObj, text, false);
		stampa("", oggettoObj, "LI", "lista");
		 
		spazio();	
	//}
});

function aggiornaStatsEquip(oggettoObj, text, equipaggiato) 
{
	var colore;
	if ((oggettoObj.attacco) > (oggettoObj.difesa)
		&& (oggettoObj.attacco) > (oggettoObj.salute))
	{
		colore = "arancione";
	}
	else if ((oggettoObj.difesa) > (oggettoObj.attacco)
		&& (oggettoObj.difesa) > (oggettoObj.salute))
	{
		colore = "blu";
	} 
	else
	{
		colore = "verde";
	}

	if (oggettoObj.attacco > 0)
	{
		if (equipaggiato)
		{
			attacco += parseInt(oggettoObj.attacco);
			stats("#attacco-value", attacco, "arancione");
			text += " attacco + " + oggettoObj.attacco;
		} 
		else 
		{
			attacco -= parseInt(oggettoObj.attacco);
			stats("#attacco-value", attacco, "arancione");
			text += " attacco - " + oggettoObj.attacco;
		}
		
	}
	if (oggettoObj.difesa > 0)
	{
		if (equipaggiato)
		{
			difesa += parseInt(oggettoObj.difesa);
			stats("#difesa-value", difesa, "blu");
			text += " difesa + " + oggettoObj.difesa;
		} 
		else 
		{
			difesa -= parseInt(oggettoObj.difesa);
			stats("#difesa-value", difesa, "blu");
			text += " difesa - " + oggettoObj.difesa;
		}
	}
	if (oggettoObj.salute > 0)
	{
		if (equipaggiato)
		{
			salute += parseInt(oggettoObj.salute);
			stats("#salute-value", salute, "verde");
			text += " salute + " + oggettoObj.salute;
		} 
		else 
		{
			salute -= parseInt(oggettoObj.salute);
			stats("#salute-value", salute, "verde");
			text += " salute - " + oggettoObj.salute;
		}
	}
	creaP(text, colore);
	
	if (salute > maxSalute)
	{
		salute = maxSalute;
		stats("#salute-value", salute, "verde");
	}
}

$(document).ready(function(){		// AL CLICK DELL'INPUT SCORRE IN FONDO ALLA PAG
	$("#bottone-start").click(function(){
		$("#gioco").animate({scrollTop: $(document).height()});
		$(this).val("Gioca ancora!!")		// IL BOTTONE CAMBIA IN GIOCA ANCORA!!
	});

	$("#alert-villaggio").dialog({		//POPUP DI FINE GIOCO
		autoOpen: false,
		dialogClass: "no-close",
		modal: true,
		buttons: {
			"Torna al villaggio": function(){
				$(this).dialog("close");
				creaP("Torni al villaggio", "titolo-livello");
				spazio();
				stop = true;
			},
			"Vai avanti": function(){
				$(this).dialog("close");
				creaP("VAI AVANTI", "titolo-livello");
				spazio();	
			}
		}
	})
})
$(document).ready( function(){
var heightwindow = $(document).height();
$('#gioco').css('height', (heightwindow-350)+'px');
});
$(document).ready( function(){
var heightwindow = $(document).height();
$('.colonna-sx').css('height', (heightwindow-100)+'px');
});









