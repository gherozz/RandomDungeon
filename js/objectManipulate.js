
function aggiornamentoVisualOggetti(idContenitore)
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