/**
 * Actions.js
 *
 * Author: Fernando.Ferreira@icsystems.com.br
 * Date:   March 15th, 2010
 */

/*-------------------------- Global Functions ------------------------------*/
//jquery validation fixes : accept comma instead of dot

(function($){
	$.fn.writePortugueseDate = function(){
		var element = $(this[0]);
		var mydate=new Date()
		var year=mydate.getYear()
		if (year<2000)
		year += (year < 1900) ? 1900 : 0
		var day=mydate.getDay()
		var month=mydate.getMonth()
		var daym=mydate.getDate()
		if (daym<10)
		daym="0"+daym
		var dayarray=new Array(
			"Domingo",
			"Segunda-feira",
			"Terça-feira",
			"Quarta-feira",
			"Quinta-feira",
			"Sexta-feira",
			"Sábado"
		);
		var montharray=new Array(
			"de Janeiro de ",
			"de Fevereiro de ",
			"de Março de ",
			"de Abril de ",
			"de Maio de ",
			"de Junho de",
			"de Julho de ",
			"de Agosto de ",
			"de Setembro de ",
			"de Outubro de ",
			"de Novembro de ",
			"de Dezembro de "
		);
		var msg = dayarray[day]+", "+daym+" "+montharray[month]+year;
		element.val(msg);
	};
})(jQuery);

function writeTable(xmlstring, div){
	var booleanColor = true;
	var xml = (new DOMParser()).parseFromString(xmlstring, "text/xml");
	var table = $('<table />');
	table.addClass('registers');
	table.css('border-collapse', 'collapse');
	var tbody = $('<tbody />');
	if (xml.getElementsByTagName('error')[0] != undefined)
		throw "Nothing to write"
	var elements = xml.getElementsByTagName('documento')[0].childNodes;
	$(elements).each(function(){
		var el = $(this).get(0);
		var tr = $('<tr />');
		if($(el)[0].nodeType == xml.ELEMENT_NODE){
			var tagname = $(el)[0].tagName;
			tr.append('<th>' + tagname +'</th>');
			tr.append('<td>' + $(el).text()+'</td>');
			if (booleanColor)
				tr.css('background-color','#B9D3EE');
			booleanColor = !booleanColor;
			tbody.append(tr);
			tbody.css('color','black');
			tbody.css('text-align','left');
			table.append(tbody);
			table.css('margin','35px');
			div.html(table);
		}
	});
}

function getScrollXY() {
	var myWidth = 0, myHeight = 0;
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}
	return [ myWidth, myHeight ];
}
/*----------------------------------------------------------------------------*/
//Make a clock
function getTime(){
	var time = new Date();
	var hours = time.getHours();
	if (hours.toString().length == 1)
		hours = '0' + hours;
	var minutes = time.getMinutes();
	if (minutes.toString().length == 1)
		minutes = '0' + minutes;
	var timeStr = hours+':'+minutes;
	return timeStr;
}

$.validator.methods.range = function (value, element, param) {
	var globalizedValue = value.replace(",", ".");
	return this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);
}
$.validator.methods.number = function (value, element) {
	return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.,]\d{3})+)(?:[\.,]\d+)?$/.test(value);
}



//Document is ready, let's play
$(document).ready(function(){

	//Write the date in a portuguese format
	//when the document is ready
	$('#dataPreenchimento').writePortugueseDate();

/*------------------------------Edition and Relation-----------------------------*/
	//Make the urlbase (necessary case SAPeM migrate to another server)
	var urlString = $(location).attr('href');
	var urlArray = urlString.split('/');
	var indexToRunUrlString = 0; 
	var urlbase = '';
	for (indexToRunUrlString in urlArray)
		if (urlArray[indexToRunUrlString] == 'sapem')
			var indexToRecord = indexToRunUrlString;
	for (indexToRunUrlString in urlArray.slice(0,parseInt(indexToRecord,10) + 1))
		if (indexToRunUrlString == 0)
			urlbase += urlArray[indexToRunUrlString];
		else
			urlbase += '/' + urlArray[indexToRunUrlString];
	urlbase += '/';
	//Relation between forms
	//Diagnóstico - Consulta e FollowUp
	if (urlString.search("edit") != -1){
		var fichaId = urlArray[urlArray.length-2];
		var url = urlbase + 'ficha/' + fichaId + '/';
	}else{
		var fichaId = urlArray[urlArray.length-2];
		var url = urlbase + 'patientLastRegisterByType/' + fichaId + '/Consulta/';
	}
	$.ajax({
		type: 'POST',
		url: url,
		dataType: "html",
		cache: false,
		success: function(text){
			if (window.DOMParser)
			{
				parser=new DOMParser();
				xml=parser.parseFromString(text,"text/xml");
			}else{ // Internet Explorer
				xml=new ActiveXObject("Microsoft.XMLDOM");
				xml.async="false";
				xml.loadXML(text);
			}
			if (xml.getElementsByTagName('error')[0] == undefined){
				var elements = xml.getElementsByTagName('documento')[0].childNodes;
				if (urlString.search("edit") != -1){
					//Edit
					$(elements).each(function(){
						var el = $(this).get(0);
						if($(el)[0].nodeType == xml.ELEMENT_NODE){
							var tagname = $(el)[0].tagName;
							idDiv = $('#'+tagname).parent().attr('id');
							var hlcolor = '#FFF8C6';
							//Checkbox
							if (tagname == 'tratamentoPrescritoTBFarmacos')
							{
								$('input[name=tratamentoPrescritoTBFarmacos]').each(function(){
									if ($(el).text().localeCompare($(this).val()) == 0){
										$(this).attr('checked',true);
									}
								});
							}
							if (tagname == 'farmacosOutros')
							{
								$('#tratamentoPrescritoTBFarmacos_13').attr('checked',true);
								$('#'+tagname).removeAttr('disabled');
							}
							if (tagname == 'reacoesAdversasTuberculostaticosMaiores')
							{
								$('input[name=reacoesAdversasTuberculostaticosMaiores]').each(function(){
									if ($(el).text().search($(this).val()) != -1)
										$(this).attr('checked',true);
								});
							}
							if (tagname == 'reacoesAdversasTuberculostaticosMenores')
							{
								$('input[name=reacoesAdversasTuberculostaticosMenores]').each(function(){
									if ($(el).text().search($(this).val()) != -1)
										$(this).attr('checked',true);
								});
							}
							if (tagname == 'mudancaFarmacos')
							{
								$('input[name=mudancaFarmacos]').each(function(){
									if ($(el).text().localeCompare($(this).val()) == 0){
										$(this).attr('checked',true);
									}
								});
							}
							if (tagname == 'farmacos14')
							{
								$('input[name=mudancaFarmacos]').each(function(){
									if ($(this).val() == 'outros')
											$(this).attr('checked',true);
								});
								$('#' + tagname).removeAttr('disabled');
							}
							if (tagname == 'mudancaMotivo')
							{
								$('input[name=mudancaMotivo]').each(function(){
									if ($(el).text().search($(this).val()) != -1)
										$(this).click();
								});
							}
							if (tagname == 'mudanca')
							{
								$('#'+tagname).attr('checked',true);
								$('#data_mudanca').attr('disabled',true);
							}
							if (tagname == 'diagnosticoDiferenteTB')
							{
								$('input[name=diagnosticoDiferenteTB]').each(function(){
									if ($(el).text().search($(this).val()) != -1)
										$(this).attr('checked',true);
								});
								if ($(el).text() == 'outros')
									$('#outro_diagnostico_sim').removeAttr('disabled');
							}
							//Setting values
							$('#'+tagname).val($(el).text());
							$('#'+tagname).change();
						}
					});
				}else{
				//Relation
					$(elements).each(function(){
						var el = $(this).get(0);
						if($(el)[0].nodeType == xml.ELEMENT_NODE){
						var tagname = $(el)[0].tagName;
						idDiv = $('#'+tagname).parent().attr('id');
						var hlcolor = '#FFF8C6';
						if (tagname == 'diagnostico') $('#' + tagname).val($(el).text());
						if (tagname == 'tratamentoPrescritoTB')
						{
							if ($(el).text() == '')
								$('#' + tagname).val('ignorado');
							else
								$('#' + tagname).val($(el).text());
						}
						if (tagname == 'data_inicio')
							$('#' + tagname).val($(el).text());
						if (tagname == 'tratamentoPrescritoTBFarmacos')
						{
							$('input[name=tratamentoPrescritoTBFarmacos]').each(function(){
									if ($(el).text().localeCompare($(this).val()) == 0){
										$(this).attr('checked',true);
									}
							});
						}
						if (tagname == 'farmacosOutros')
						{
							$('#tratamentoPrescritoTBFarmacos_13').attr('checked',true);
							$('#'+tagname).removeAttr('disabled');
							$('#' + tagname).val($(el).text());
						}
						$('#' + tagname).change();
						}
					});
				}
			}
		}
	});
/*-----------------------------------------------------------------------------------*/
/*------------------------------Auxiliar Function------------------------------------*/

	var hlcolor = '#FFF8C6';

	//Show fields
	$.fn.showFields = function(argumento){
		var dep = argumento;
		for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
					$(this).addClass('required');
				});
			if($(dep[div]).css('display') != 'block')
				$(dep[div]).toggle(function() {
					$(this).css('background-color', hlcolor);
					$(this).animate({backgroundColor : "white"}, 4000);
				});
		}
	}
	//Show fields without add "required" class
	$.fn.showFieldsWithoutRequirement = function(argumento){
		var dep = argumento;
		for(div in dep){
			if($(dep[div]).css('display') != 'block')
				$(dep[div]).toggle(function() {
					$(this).css('background-color', hlcolor);
					$(this).animate({backgroundColor : "white"}, 4000);
				});
		}
	}
	//Hide fields
	$.fn.hideFields = function(argumento){
		var dep = argumento;
		for(div in dep){
			var elems = $('*', dep[div]);
			$(elems).each(function(){
				var element = $(this);
				if (   element[0].nodeName != 'FIELDSET'
					&& element[0].nodeName != 'SMALL'
					&& element[0].nodeName != 'OPTION')
				$(this).removeClass('required');
			});
			if($(dep[div]).css('display') != 'none')
				$(dep[div]).toggle();
		}
	}
/*----------------------------------------------------------------------------*/
/*------------------------------ Data Quality  ----------------------------------*/
	$('.data').datepicker({
		dateFormat: 'dd/mm/yy',
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Aug','Set','Out','Nov','Dez'],
		maxDate: '+0d',
		changeMonth: true,
		changeYear: true,
		maxDate : '+0y',
		minDate : '-130y',
		yearRange : '-130:+130',
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});

	$('.text').keypress(function(e){
		if((e.which > 32 && e.which < 65)||
			(e.which > 90 && e.which < 97)||
			(e.which > 122 && e.which < 127)||
			(e.which > 127 && e.which < 192)){
			return false;
		}
	});
/*
	$('.number').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)){
			return false;
		}
	});
*/
	$('.hour').livequery('keypress', function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57))
			return false;
		$('.hour').timeEntry({show24Hours: true});
	});

/*------------------------------------------------------------------------------*/
/*--------------------------- Secondary Fields ---------------------------------*/

	//Foi prescrito TB?
	$('#tratamentoPrescritoTB').change(function(){
		var dep = new Array();
		dep[0] = '#divDataInicio';
		dep[1] = '#divTratamentoPrescritoTBFarmaco';
		dep[2] = '#divReacoesAdversasTuberculostaticos';
		dep[3] = '#divInterrupcaoTratamento';
		dep[4] = '#divMudancaEsquemaTratamentoTB';
		dep[5] = '#divTosseDiminuida';
		dep[14] = '#divDataSeguimentoClinico';
		var ped = new Array();
		ped[0] = '#divMotivoSeguimentoNaoRealizado';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			$().showFields(dep);
			$().hideFields(ped);
		// Se nao, ocultar colunas listadas a cima
		}else if($(this).val()=='nao'){
			dep[7] = '#divReacoesAdversasTuberculostaticosMaiores';
			dep[8] = '#divReacoesAdversasTuberculostaticosMenores';
			dep[9] = '#divDataMudanca';
			dep[10] = '#divMudanca';
			dep[11] = '#divMudancaFarmacos';
			dep[12] = '#divMudancaMotivo';
			dep[13] = '#divSuspensaoTratamentoTB';
			dep[6] = '#divSuspensaoDiasTratamentoTB';
			$().hideFields(dep);
			$().showFields(ped);
		}
	});

	$('#obito').change(function(){
		var dep = new Array();
		dep[0] = '#divCasoObito';
		dep[1] = '#divDataObito';
		var ped = new Array();
		ped[0] = '#divTosseDiminuida';
		ped[1] = '#divAlteracoesEvolutivasNoExameFisico';
		ped[2] = '#divFebre';
		ped[3] = '#divExpectoracao';
		ped[4] = '#divAvaliacaoGeral';
		ped[5] = '#divOutrosSintomas';
		
		var notReq = new Array();
		notReq[0] = '#divPesoAtual';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			$().showFields(dep);
			$().showFieldsWithoutRequirement(notReq);
			for(div in ped){
				var elems = $('*', ped[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
				});
				if($(ped[div]).css('display') != 'none')
					$(ped[div]).toggle();
			}
		}
		// Se nao, ocultar colunas listadas a cima
		if($(this).val()=='nao' || $(this).val()=='ignorado'){
			$().hideFields(dep);
			$().hideFields(dep);
			for(div in ped){
				var elems = $('*', ped[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
					{
						if ($(this).attr('id') == 'tosseDiminuida')
							if ($('#tratamentoPrescritoTB').val() == 'sim')
								$(this).addClass('required');
							else
								$(this).removeClass('required');
						else
							$(this).addClass('required');
					}
				});
				if($(ped[div]).css('display') != 'block'){
					if(div == 0 && $('#tratamentoPrescritoTB').val()!='sim')
						continue;
					$(ped[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
				}
			}
		}
	});

	//Reacao ao tratamento?
	$('#reacoesAdversasTuberculostaticos').change(function(){
		var dep = new Array();
		dep[0] = '#divReacoesAdversasTuberculostaticosMaiores';
		dep[1] = '#divReacoesAdversasTuberculostaticosMenores';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim')
			$().showFieldsWithoutRequirement(dep);
		// Se nao, ocultar colunas listadas a cima
		if($(this).val()=='nao' || $(this).val()=='ignorado')
			$().hideFields(dep);
	});
	$('#internacaoHospitalar').change(function(){
		var dep1 = new Array();
		dep1[0] = '#divDataInternacao';
		dep1[1] = '#divDataAlta';
		if ($(this).val() == 'sim' && $('#formulario').val() == 'seguimentoClinico180'){
			$().showFieldsWithoutRequirement(dep1);
		}else if ($(this).val() == 'sim' && $('#formulario').val() != 'seguimentoClinico180'){
			$().showFieldsWithoutRequirement(dep1);
		}else if ($(this).val() == 'nao'){
			$().hideFields(dep1);
		}
	});
	$('#encaminhamentoParaUbs').change(function(){
		var dep = new Array();
		dep[0] = '#divDataAltaHospitalar';
		dep[1] = '#divDataEncaminhamento';
		dep[2] = '#divDataInicioTratamentoUnidade';
		if ($(this).val() == 'sim')
			$().showFieldsWithoutRequirement(dep);
		else
			$().hideFields(dep);
	});
	//Precisa mudar o tratamento?
	$('#mudancaEsquemaTratamentoTB').change(function(){
		var dep = new Array();
		dep[0] = '#divDataMudanca';
		dep[1] = '#divMudanca';
		dep[2] = '#divMudancaFarmacos';
		dep[3] = '#divMudancaMotivo';
		var ped = new Array();
		ped[0] = '#divSuspensaoTratamentoTB'
		ped[1] = '#divSuspensaoDiasTratamentoTB'
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).addClass('required');
				});
				if($(dep[div]).css('display') != 'block')
					$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
			for(div in ped){
				var elems = $('*', ped[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
				});
				if($(ped[div]).css('display') != 'none')
					$(ped[div]).toggle();
			}
		}
		// Se nao, ocultar colunas listadas a cima
		if($(this).val()=='nao' || $(this).val()=='ignorado' || $(this).val() == 'nsa'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
				});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
			var elems = $('*', ped[0]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).addClass('required');
				});
				if($(ped[0]).css('display') != 'block')
					$(ped[0]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});

		}
		// 'Mudanca' field  is never required
		$('*', '#divMudanca').each(function(){
			var element = $(this);
			if (   element[0].nodeName != 'FIELDSET'
				&& element[0].nodeName != 'SMALL'
				&& element[0].nodeName != 'OPTION')
				$(this).removeClass('required');
		});

	});


	//Suspensao do Tratamento
	$('#suspensaoTratamentoTB').change(function(){
		var dep = new Array();
		dep[0] = '#divSuspensaoDiasTratamentoTB';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).addClass('required');
				});
				if($(dep[div]).css('display') != 'block')
					$(dep[div]).toggle(function() {
						$(this).css('background-color', hlcolor);
						$(this).animate({backgroundColor : "white"}, 4000);
					});
			}
		}
		// Se nao, ocultar colunas listadas a cima
		if($(this).val()=='nao' || $(this).val()=='ignorado' || $(this).val() == 'nsa'){
			for(div in dep){
				var elems = $('*', dep[div]);
				$(elems).each(function(){
					var element = $(this);
					if (   element[0].nodeName != 'FIELDSET'
					    && element[0].nodeName != 'SMALL'
					    && element[0].nodeName != 'OPTION')
						$(this).removeClass('required');
				});
				if($(dep[div]).css('display') != 'none')
					$(dep[div]).toggle();
			}
		}
	});
	$('#rx').change(function(){
		var dep = new Array();
		dep[0] = '#divDataRX';
		dep[1] = '#divAvaliacaoPos';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			$().showFields(dep);
		}
		// Se nao, ocultar colunas listadas a cima
		if($(this).val()=='nao'){
			$().hideFields(dep);
		}
	});
	//Probabilidade de TBativa
	$('#internacaoHospitalar').change(function(){
		var dep = new Array();
		dep[0] = '#divDataInternacao';
		dep[1] = '#divDataAlta';
		if ($(this).val() == 'sim')
			$().showFieldsWithoutRequirement(dep);
		else
			$().hideFields(dep);
	});
	$('#encaminhamentoParaUbs').change(function(){
		var dep = new Array();
		dep[0] = '#divDataAltaHospitalar';
		dep[1] = '#divDataEncaminhamento';
		dep[2] = '#divDataInicioTratamentoUnidade';
		if ($(this).val() == 'sim')
			$().showFieldsWithoutRequirement(dep);
		else
			$().hideFields(dep);
	});


/*---------------------------- Other logics -----------------------------*/

	//Disabled all select fields until "formulario"
	//field has no value
	$('select').each(function(){
		if ($(this).attr('id') != 'formulario')
			$(this).attr('disabled',true);
	});
	//Enable fields
	$('#formulario').change(function(){
		if ($(this).val())
			$('select').each(function(){
				if ($(this).attr('id') != 'formulario')
					$(this).removeAttr('disabled');
			});
		else
			$('select').each(function(){
				if ($(this).attr('id') != 'formulario')
					$(this).attr('disabled',true);
			});
	});
	//Select the type of triagem based on cgi response
	var triagem = '';
	var patientId = urlString[urlString.length-2];
	$.ajax({
		type: 'POST',
		url: urlbase + 'triagemName/' + patientId + '/',
		dataType: "html",
		success: function(text){
			triagem = text;
		},
		complete: function(){
			var tipoTriagem = '';
			if ((triagem.search('Amb') != -1)||(triagem.search('amb') != -1))
				tipoTriagem = 'ambulatorio';
			else if ((triagem.search('Hos') != -1)||(triagem.search('hos') != -1))
				tipoTriagem = 'hospital';
			$('#seguimentoClinico').change(function(){
				var dep1 = new Array();
				dep1[0] = '#divInternacaoHospitalar';
				var dep2 = new Array();
				dep2[0] = '#divEncaminhamentoParaUbs';
				var dep3 = new Array();
				dep3[0] = '#divDataInternacao';
				dep3[1] = '#divDataAlta';
				var dep4 = new Array();
				dep4[0] = '#divDataAltaHospitalar';
				dep4[1] = '#divDataEncaminhamento';
				dep4[2] = '#divDataInicioTratamentoUnidade';
				if ($('#formulario').val()=='seguimentoClinico180')
					if ($(this).val() == 'ubs' || $(this).val() == 'ambulatorioDeReferencia')
					{
						if (tipoTriagem == 'ubs' || tipoTriagem == 'ambulatorio')
							$().showFields(dep1);
						if (tipoTriagem == 'hospital')
							$().showFields(dep2);
					}else{
						$().hideFields(dep1);
						$().hideFields(dep2);
						$().hideFields(dep3);
						$().hideFields(dep4);
					}
			});
		}
	});
	$('#mudanca').click( function(){
		if($('#mudanca').is(':checked')){
			$('#data_mudanca').attr('disabled', true);
			$('#data_mudanca').val('')
		} else {
			$('#data_mudanca').removeAttr('disabled');
		}
	});
	$('#tratamentoPrescritoTBFarmacos_13').click(function(){
		if($(this).is(':checked')){
			$('').attr('checked', 'true');
			fieldOutros = $('')
			$('input[name=farmacosOutros]').removeAttr('disabled');
			return;
		}
		$(this).removeAttr('checked');
		$('input[name=farmacosOutros]').val('');
		$('input[name=farmacosOutros]').attr('disabled', 'true');
		return;
	});
	//"Mudanca" enables input text
	$('input[name=mudancaMotivo]:radio').click(function(){
		if($(this).val() == "outro"){
			$('input[name=outro_motivo]').removeAttr('disabled');
		} else {
			$('input[name=outro_motivo]').val('');
			$('input[name=outro_motivo]').attr('disabled','true');
		}
	});

	$('input[name=semMaioresReacoesAdversas]').click(function(){
		if ($(this).attr('checked')){
			$('input[name=reacoesAdversasTuberculostaticosMaiores]').attr('disabled', 'true');
			$('input[name=reacoesAdversasTuberculostaticosMaiores]').removeAttr('checked');
		}
		else
			$('input[name=reacoesAdversasTuberculostaticosMaiores]').removeAttr('disabled');
	});

	$('input[name=semMenoresReacoesAdversas]').click(function(){
		if ($(this).attr('checked')){
			$('input[name=reacoesAdversasTuberculostaticosMenores]').attr('disabled', 'true');
			$('input[name=reacoesAdversasTuberculostaticosMenores]').removeAttr('checked');
		}
		else
			$('input[name=reacoesAdversasTuberculostaticosMenores]').removeAttr('disabled');

	});

	$('input[name=mudancaFarmacos]').click(function(){
		if($(this).val() == 'outros')
		{
			if ($(this).is(':checked'))
				$('input[name=farmacos14]').removeAttr('disabled');
			else{
				$('input[name=farmacos14]').val('');
				$('input[name=farmacos14]').attr('disabled',true);
			}
		}
	});
	$('#diagnosticoDifOutros').click(function(){
		if($(this).is(':checked')){
			$('').attr('checked', 'true');
			$('input[name=outro_diagnostico_sim]').removeAttr('disabled');
			return;
		}
		$(this).removeAttr('checked');
		$('input[name=outro_diagnostico_sim]').val('');
		$('input[name=outro_diagnostico_sim]').attr('disabled', 'true');
		return;
	});
/*---------------------------------------------------------------------------------------------------------*/
	//Make a clock in the page e write date in
	//a portuguese format
	/*
	$('#form_followup').submit(function(){
	});
	*/
	$('#horarioInicioEntrevista').val(getTime());
	$('#horarioInicioEntrevista').click(function(){
		$(this).val('');
	});
/*---------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------*/
	$('div.secondary').css('display', 'none');
/*---------------------------------------------------------------------------*/
/*------------------------- Load Exames Form --------------------------------*/
	var sUrl = '../../../patientLastRegisterByType/' + fichaId + '/Exames/';
	var edits = new Object();
	var menuYloc = null;

	var returned = $.ajax({
		url:sUrl,
		dataType:'html',
		complete: function(xhr, textStatus){
			var response = xhr.responseText;
			try{
				var sizeH =  (getScrollXY()[1]) + 'px';
				$('#divExames').height(sizeH);
				$('#divExames').css('top', '53px');
				$('#divExames').css('overflow', 'all');
				$('#divExames').jScrollPane({showArrows:true});
				menuYloc = 0;
				$(window).scroll(function () {
					var offset = menuYloc+$(document).scrollTop()+"px";
					$('div.jScrollPaneContainer').animate({top:offset},{duration:500,queue:false});
				});
				writeTable(response,$('#divExames'));
			}catch(e){
				$('#divExames').html("A busca não encontrou resultados");
			}
		}
	});
/*---------------------------------------------------------------------------*/
/*-------------------------- Form Validation --------------------------------*/

	$('#form_followup').validate({
		rules: {
			pesoAtual: {
				range: [0, 500]
			}
		}
	});
/*---------------------------------------------------------------------------*/
	$('#form_followup').submit(function(){
		$('input[name=tratamentoPrescritoTBFarmacos]').each(function(){
			$(this).attr('disabled',false);
		});
		if($('input[name=data_inicio]').val()) $('input[name=data_inicio]').attr('disabled',false);
		if(!$('#tratamentoPrescritoTB').val().localeCompare('sim')  ||
		   !$('#tratamentoPrescritoTB').val().localeCompare('nao')) {
			$('#tratamentoPrescritoTB').attr('disabled',false);
		}
		$('input[name=mudancaFarmacos]').each(function(){
			$(this).attr('disabled',false);
		});
	});
});
