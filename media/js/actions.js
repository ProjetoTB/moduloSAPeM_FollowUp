/**
 * Actions.js
 *
 * Author: Fernando.Ferreira@icsystems.com.br
 * Date:   March 15th, 2010
 */

/*-------------------------- Global Functions ------------------------------*/
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
	if (xml.getElementsByTagName('error')[0] == undefined)
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

//Document is ready, let's play
$(document).ready(function(){

	$('#dataPreenchimento').writePortugueseDate();

/*------------------------------Edition and Relation-----------------------------*/
	//Relation between forms
	//Diagnóstico - Consulta e FollowUp
	var urlString = $(location).attr('href');
	var urlbase = 'https://gruyere.lps.ufrj.br/~fferreira/sapem/';
	var urlArray = urlString.split('/');
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
									if ($(el).text().search($(this).val()) != -1)
										$(this).attr('checked',true);
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
									if ($(el).text().search($(this).val()) != -1)
										$(this).attr('checked',true);
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
						if (tagname == 'diagnostico')
						$('#' + tagname).val($(el).text());
						if (tagname == 'tratamentoPrescritoTB')
						{
							if ($(el).text() == '')
								$('#' + tagname).val('ignorado');
							else
								$('#' + tagname).val($(el).text());
						}
						if (tagname == 'observacoes')
							$('#' + tagname).val($(el).text());
						if (tagname == 'data_inicio')
							$('#' + tagname).val($(el).text());
						if (tagname == 'tratamentoPrescritoTBFarmacos')
						{
							$('input[name=tratamentoPrescritoTBFarmacos]').each(function(){
									if ($(el).text().search($(this).val()) != -1)
									$(this).attr('checked',true);
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
/*-------------------------------------------------------------------------------*/
/*------------------------------Auxiliar Function------------------------------------*/
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
			var elems = $('*', dep[div]);
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

	var hlcolor = '#FFF8C6';

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

	$('.number').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)){
			return false;
		}
	});
/*----------------------------------------------------------------------------*/
/*--------------------------- Secondary Fields ---------------------------------*/

	//Definindo o formulario
	$('#formulario').change(function(){
		var dep = new Array();
		if($('#formulario').val() == 'seguimentoClinico60')
			$('#tituloRXTorax').html('RX de Tórax (60 dias)');
		else if($('#formulario').val() == 'seguimentoClinico180')
			$('#tituloRXTorax').html('RX de Tórax (180 dias)');
		else
			$('#tituloRXTorax').html('RX de Tórax');
	});

	//Foi prescrito TB?
	$('#tratamentoPrescritoTB').change(function(){
		var dep = new Array();
		dep[0] = '#divDataInicio';
		dep[1] = '#divTratamentoPrescritoTBFarmaco';
		dep[2] = '#divReacoesAdversasTuberculostaticos';
		dep[3] = '#divMudancaEsquemaTratamentoTB';
		dep[4] = '#divTosseDiminuida';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim')
			$().showFields(dep);
		// Se nao, ocultar colunas listadas a cima
		if($(this).val()=='nao'){
			dep[7] = '#divReacoesAdversasTuberculostaticosMaiores';
			dep[8] = '#divReacoesAdversasTuberculostaticosMenores';
			dep[9] = '#divDataMudanca';
			dep[10] = '#divMudanca';
			dep[11] = '#divMudancaFarmacos';
			dep[12] = '#divMudancaMotivo';
			dep[13] = '#divSuspensaoTratamentoTB';
			dep[6] = '#divSuspensaoDiasTratamentoTB';
			$().hideFields(dep);
		}
	});

	$('#obito').change(function(){
		var dep = new Array();
		dep[0] = '#divCasoObito';
		dep[1] = '#divDataObito';
		var ped = new Array();
		ped[0] = '#divTosseDiminuida';
		ped[1] = '#divPesoAtual';
		ped[2] = '#divAlteracoesEvolutivasNoExameFisico';
		ped[3] = '#divFebre';
		ped[4] = '#divExpectoracao';
		ped[5] = '#divAvaliacaoGeral';
		ped[6] = '#divOutrosSintomas';
		// Se sim, disponibilizar colunas listadas a cima
		if($(this).val()=='sim'){
			$().showFields(dep);
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
			$().showFields(dep);
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
	//Probabilidade de TBativa
	//O diagnostico eh tb???
	$('#diagnostico').change(function(){
		var dep = new Array();
		dep[0] = '#divDiagnosticoDiferenteTB';
		// Se naun, disponibilizar colunas listadas a cima
		if($(this).val()=='nao_tb'){
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
		} else {
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

/*---------------------------- Other logics -----------------------------*/

	$('select').each(function(){
		if ($(this).attr('id') != 'formulario')
			$(this).attr('disabled',true);
	});
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
	var triagem = '';
	var patientId = urlString[urlString.length-2];
	$.ajax({
		type: 'POST',
		url: 'https://gruyere.lps.ufrj.br/~fferreira/sapem/triagemName/' + patientId + '/',
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
	//Houve obito?

	//"Mudanca" enables input text
	$('input[name=mudancaMotivo]:radio').click(function(){
		if($(this).val() == "outro"){
			$('input[name=outro_motivo]').removeAttr('disabled');
		} else {
			$('input[name=outro_motivo]').val('');
			$('input[name=outro_motivo]').attr('disabled','true');
		}
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
/*---------------------------------------------------------------------------*/
	$('div.secondary').css('display', 'none');
/*---------------------------------------------------------------------------*/
	//Temporary Solution
	// All primary fields are required
	$('div.primary').each(function(){
		var elem_primary = $('*', this);
		$(elem_primary).each(function(){
			var element = $(this);
			if (  element[0].nodeName != 'FIELDSET'
			   && element[0].nodeName != 'SMALL'
			   && element[0].nodeName != 'OPTION')
				$(this).addClass('required');
		});
	});
	//But Observacoes
	var elem_obs = $('*','#divObservacoes');
	$(elem_obs).each(function(){
		var element = $(this);
		if (  element[0].nodeName != 'FIELDSET'
		   && element[0].nodeName != 'SMALL'
		   && element[0].nodeName != 'OPTION')
			$(this).removeClass('required');
	});
/*---------------------------------------------------------------------------*/
/*------------------------- Load Exames Form --------------------------------*/
	var url=$(location).attr('href');
	var numForm = parseInt(url[url.length - 4],10) - 1;
	var numPatient = url[url.length - 2];
	var sUrl='../../../patientLastRegister/' + numForm + '/' + numPatient + '/';
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
	$('#form_followup').validate();
/*---------------------------------------------------------------------------*/
});
