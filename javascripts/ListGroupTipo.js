function limpaFiltroPorAno() {    
    if ($(".hidLinguagem").val() == "ptg") {
        window.location = "ListGroupTipo.aspx?idCanal=" + getIdCanal() + '&linguagem=pt';
    } else {
        window.location = "ListGroupTipo.aspx?idCanal=" + getIdCanal() + '&linguagem=en';
    }
}

function efetuarFiltroPorAno() { 
    if ($(".hidLinguagem").val() == "ptg") {
        window.location = "ListGroupTipo.aspx?idCanal=" + getIdCanal() + "&ano=" + $('select[id*=ddlAnoFiltro] option:selected').val() + '&linguagem=pt';
    } else {
        window.location = "ListGroupTipo.aspx?idCanal=" + getIdCanal() + "&ano=" + $('select[id*=ddlAnoFiltro] option:selected').val() + '&linguagem=en';
    }
}

function efetuarFiltroCategoria() { 
    if ($(".hidLinguagem").val() == "ptg") {
        window.location = "ListGroupTipo.aspx?idCanal=" + getIdCanal() + "&categoria=" + $('select[id*=ddlCategoriaFiltro] option:selected').val() + '&linguagem=pt';
    } else {
        window.location = "ListGroupTipo.aspx?idCanal=" + getIdCanal() + "&categoria=" + $('select[id*=ddlCategoriaFiltro] option:selected').val() + '&linguagem=en';
    }
}

function efetuarFiltroCategoriaAno() {  
    if ($(".hidLinguagem").val() == "ptg") {
        window.location = "ListGroupTipo.aspx?idCanal=" + getIdCanal() + "&categoria=" + $('select[id*=ddlCategoriaFiltro] option:selected').val() + "&ano=" + $('select[id*=ddlAnoFiltro] option:selected').val() + '&linguagem=pt';
    } else {
        window.location = "ListGroupTipo.aspx?idCanal=" + getIdCanal() + "&categoria=" + $('select[id*=ddlCategoriaFiltro] option:selected').val() + "&ano=" + $('select[id*=ddlAnoFiltro] option:selected').val() + '&linguagem=en';
    }
}

function getIdCanal() {
    var strHref = window.location.href;
    var strQueryString = strHref.substr(strHref.indexOf("=") + 1);
    var aQueryString = strQueryString.split("&");
    return aQueryString[0];
}


$(document).ready(function () {

    if ($('.list').text().trim() === '') {
        if ($(".hidLinguagem").val() == "ptg") {
            $('.list').first().html('<li><p>N&atilde;o existem mat&eacute;rias com esse filtro escolhido.</p></li> ');
        } else {
            $('.list').first().html('<li><p>There are no materials with this chosen filter.</p></li> ');
        }
    }

    $('a[id*=linkListaTituloChamada]').each(function () {
        var link = $(this).attr('href');
        $(this).parents('.ajusteLista').find('a#recebeLink').attr('href', link);

        var textoLink = $(this).text();

        $(this).parents('.ajusteLista').find('.recebeTexto').text(textoLink);

        $(this).remove();
    });

    $('#labelAno').remove();

    var combo = $('div[id*=ddlAnoLink]').html();
    $('div[class*=recebeCombos]').append(combo);

    $('div[id*=ddlAnoLink]').remove();

    $('h3').each(function () {
        if ($.trim($(this).html()) == "") {
            $(this).remove();
        }
    });

    $('ul').each(function () {
        if ($.trim($(this).text()) == "") {
            $(this).remove();
        }
    });

    $('a.disabled').remove();
});