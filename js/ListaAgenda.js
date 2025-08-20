
$(document).ready(function () {


     $('div#eventos').attr('style', 'display:none');
    
    
    $("a[id*=EnviarLembreteAgenda]").click(function () {
        if (podeMarcar()) {
            MarcarLembrete();
        }
    });
    setTimeout("$('div#eventos div').each(function () {var id = $(this).attr('id');var count = $(this).find('ul').children().length;var titulo = $(this).find('a#titleEvento').text().toLowerCase();var dataFim = '0';if($(this).attr('datafim') != ''){dataFim = $(this).attr('datafim').split('/')[0];}$('.ui-datepicker-calendar a').each(function () {var dia = $(this).text();if (dia == id || dia == dataFim) {if (titulo.indexOf('call') != -1 || titulo.indexOf('conferência') != -1 || titulo.indexOf('conference') != -1) {$(this).addClass('blue');} else if (titulo.indexOf('divulgação') != -1 || titulo.indexOf('release') != -1) {$(this).addClass('pink');} else if (titulo.indexOf('webcast') != -1) {$(this).addClass('green');} else if (titulo.indexOf('live') != -1) {$(this).addClass('red');} else if (count > 1) {$(this).addClass('purple');}else {$(this).addClass('black');}}});});", 500);
    
});



// Função necessária para evitar duplo click nas setas que mudam o mes
function waitFunction() {

    $('.ui-datepicker-prev').hide();
    $('.ui-datepicker-next').hide();
                    
    setTimeout("$('.ui-datepicker-prev').show();", 500);
    setTimeout("$('.ui-datepicker-next').show();", 500);


    setTimeout("$('div#eventos div').each(function () {var id = $(this).attr('id');var count = $(this).find('ul').children().length;var titulo = $(this).find('a#titleEvento').text().toLowerCase();var dataFim = '0';if($(this).attr('datafim') != ''){dataFim = $(this).attr('datafim').split('/')[0];}$('.ui-datepicker-calendar a').each(function () {var dia = $(this).text();if (dia == id || dia == dataFim) {if (titulo.indexOf('call') != -1 || titulo.indexOf('conferência') != -1 || titulo.indexOf('conference') != -1) {$(this).addClass('blue');} else if (titulo.indexOf('divulgação') != -1 || titulo.indexOf('release') != -1) {$(this).addClass('pink');} else if (titulo.indexOf('webcast') != -1) {$(this).addClass('green');} else if (titulo.indexOf('live') != -1) {$(this).addClass('red');} else if (count > 1) {$(this).addClass('purple');}else {$(this).addClass('black');}}});});", 500);

  
}

function OutlookButtonClick(e) {
    var idExportar = e.target.parentNode.parentNode.attributes.eventoid.value;

    $("#_idEventoExportarPraOutlook").val(idExportar); // input type="hidden" no aspx que recebe o evento a ser exportado
    __doPostBack(uniqueIdExportarPraOutlook);
}


function GmailButtonClick(e) {
    var idExportar = e.target.parentNode.parentNode.attributes.eventoid.value;

    $("#_idEventoExportarPraGmail").val(idExportar); // input type="hidden" no aspx que recebe o evento a ser exportado
    __doPostBack(uniqueIdExportarPraGmail);
}

function excluirEventoDaListEnviarLembrete(e) {

    var excluirId = e.target.id == "spanBtnExcluir" ? e.target.parentElement.attributes.idevento.value : e.target.attributes.idevento.value;

    var splitCookieEvento = docCookies.getItem('CookieListaAgendaMeliuz').split(',');
    
    splitCookieEvento = $.grep(splitCookieEvento, function (value) {
        return value != excluirId;        
    });
    docCookies.setItem('CookieListaAgendaMeliuz', splitCookieEvento);
        
    var splitCookieLembrete = docCookies.getItem("CookieEnviarLembreteAgendaMeliuz").split(',');

    for (var i = 0; i < splitCookieLembrete.length; i++) {
        if (splitCookieLembrete[i].split('&D')[0] == excluirId) {
            splitCookieLembrete = $.grep(splitCookieLembrete, function (value) {        //  Remove o cookie 
                return value != splitCookieLembrete[i];                                 //  referente aos dias 
            });                                                                         //  para lembrete de cada evento
            docCookies.setItem('CookieEnviarLembreteAgendaMeliuz', splitCookieLembrete);
        }
    }
    
    __doPostBack(uniqueIdEventosSelecionadosPraEnviarLembrete);

}

function addEventoAListEnviarLembrete(e) {

    if (e.currentTarget.checked == true) {

        var idEvento = e.target.attributes.idevento.value;
        var diasParaLembrete = e.target.offsetParent.parentNode.parentNode.children[3].children[1].children[0].value;

        var cookieEvento = docCookies.getItem('CookieListaAgendaMeliuz');
                
        if (typeof cookieEvento != 'undefined' && cookieEvento != "" && cookieEvento != null) { // Se cookie já tiver valor
            var splitCookieEvento = cookieEvento.split(',');
            if ($.inArray(idEvento, splitCookieEvento) == -1) // Se idEvento NÃO estiver no cookie
            {
                splitCookieEvento.push(idEvento);
                docCookies.setItem('CookieListaAgendaMeliuz', splitCookieEvento);

                var cookieLembrete = docCookies.getItem("CookieEnviarLembreteAgendaMeliuz");  //  Adiciona o cookie 
                var splitCookieLembrete = cookieLembrete.split(',');                    //  referente aos dias 
                                                                                        //  para lembrete 
                splitCookieLembrete.push(idEvento + '&D' + diasParaLembrete);           //  de cada 
                docCookies.setItem("CookieEnviarLembreteAgendaMeliuz", splitCookieLembrete);  //  evento
                
                __doPostBack(uniqueIdEventosSelecionadosPraEnviarLembrete);
            }
            else {
                if ($(".hidLinguagem").val() == "ptg")
                    alert("Este item já foi adicionado");
                else
                    alert("This item has already been added");
            }
        }
        else {
            docCookies.setItem("CookieListaAgendaMeliuz", idEvento);
            docCookies.setItem("CookieEnviarLembreteAgendaMeliuz", idEvento + '&D' + diasParaLembrete);

            __doPostBack(uniqueIdEventosSelecionadosPraEnviarLembrete);
        }       
    }
    else        
        return;
}


function mostraEventosDoDiaSelecionado(e) {

    $('#divAgenda').attr('style', 'display:block');
    var nameData = e.target.attributes.name.value;

    $("#_isDiaAntOuProx").val('');
    $("#_recebeDataDiaSelecionado").val(nameData); // input type="hidden" no aspx que recebe a data do evento clicado
    __doPostBack(uniqueIdUpdateEventosDiaSelecionado);

}

function mostraEventosDoDiaSelecionadoPosMudancaMes() {

    $('#divAgenda').attr('style', 'display:none');
    $("#_isDiaAntOuProx").val('');
    $("#_recebeDataDiaSelecionado").val("00/00/0000");
    __doPostBack(uniqueIdUpdateEventosDiaSelecionado);

}

function retornaEventosAnteriores(e) {
    
    var data = e.target.attributes.data.value;

    $("#_isDiaAntOuProx").val("anterior"); // input type="hidden" no aspx que recebe a data do evento clicado
    $("#_recebeDataDiaSelecionado").val(data); // input type="hidden" no aspx que recebe a data do evento clicado

    __doPostBack(uniqueIdUpdateEventosDiaSelecionado);
}

function retornaProximosEventos(e) {

    var data = e.target.attributes.data.value;

    $("#_isDiaAntOuProx").val("proximo"); // input type="hidden" no aspx que recebe a data do evento clicado
    $("#_recebeDataDiaSelecionado").val(data); // input type="hidden" no aspx que recebe a data do evento clicado

    __doPostBack(uniqueIdUpdateEventosDiaSelecionado);
}

function podeMarcar() {
 
    if ($('input[id*=EventosSelecionadosPraEnviarLembrete]').length < 1) {
        if ($(".hidLinguagem").val() == "ptg")
            alert("Selecione pelo menos um evento.");
        else
            alert("Select an Event.");
        return false;
    }

    if ($("input[id*=exampleInputEmail2]").val() == "") {
        if ($(".hidLinguagem").val() == "ptg") {
            alert("É necessário um nome.");
        }
        else {
            alert("Insert a name.");
        }
        return false;
    }

    if ($("input[id*=exampleInputPassword2]").val() == "") {
        if ($(".hidLinguagem").val() == "ptg") {
            alert("É necessário um email.");
        }
        else {
            alert("Insert a email.");
        }
        return false;
    }

    var email = $("input[id*=exampleInputPassword2]").val();
    var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    if (!filter.test(email)) {
        if ($(".hidLinguagem").val() == "ptg") {
            alert('E-mail Inválido!');
        }
        else {
            alert('Invalid E-mail!');
        }
        return false;
    }

    return true;
}

var evento = [];

function MarcarLembrete() {

    var checked = $("input[id*=EventosSelecionadosPraEnviarLembrete]");
    var nome = $("input[id*=exampleInputEmail2]").val();
    var email = $("input[id*=exampleInputPassword2]").val();

    var getCookieLembrete = docCookies.getItem('CookieEnviarLembreteAgendaMeliuz').split(',');

    for (x = 0; x < checked.length; x++) {
        var IdEvento = getCookieLembrete[x].split('&D')[0];
        var dias = getCookieLembrete[x].split('&D')[1];
        
        var checkBox = new Object();
        checkBox.IdEvento = IdEvento;
        checkBox.Dias = dias;
        evento[x] = checkBox;
    }

    var eventoJSON = JSON.stringify(evento);
    CallServer("lembreteAgenda;" + eventoJSON + ";" + nome + ";" + email + ";");
}

function limparCamposAgenda() {
    $('input[id*=exampleInputEmail2]').val('');
    $('input[id*=exampleInputPassword2]').val('');       
}


$(window).on('load', function () {

    $(".nice-select").remove();
    $('select[name=realizado_length]').attr('style', 'display:block');

});