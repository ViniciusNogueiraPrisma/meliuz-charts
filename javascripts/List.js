$(document).ready(function () {

    $("a[id*=linkListaTituloChamada]").each(function () {
        var link = $(this).attr('href');
		var targetLink = $(this).attr('target');
        $(this).parents('.ajusteLista').find('a.recebeLink').attr('href', link);
		$(this).parents('.ajusteLista').find('a.recebeLink').attr('target', targetLink);

        var textoLink = $(this).text();

        $(this).parents('.ajusteLista').find('.recebeTexto').text(textoLink);

        $(this).remove();

    });

    var combo = $('div[id*=ddlAnoLink]');
    $('div[class*=recebeCombo]').append(combo);

    $('select[id*=ddlCategoriaFiltro]').remove();

    $('a.disabled').remove();
});


function efetuarFiltroPorAno() {
    if ($(".hidLinguagem").val() == "ptg") {
        window.location = "List.aspx?idCanal=" + getIdCanal() + "&ano=" + $('select[id$=ddlAnoFiltro] option:selected').val() + '&linguagem=pt';
    } else {
        window.location = "List.aspx?idCanal=" + getIdCanal() + "&ano=" + $('select[id$=ddlAnoFiltro] option:selected').val() + '&linguagem=en';
    }
}

function limpaFiltroPorAno() {
    if ($(".hidLinguagem").val() == "ptg") {
        window.location = "List.aspx?idCanal=" + getIdCanal() + '&linguagem=pt';
    } else {
        window.location = "List.aspx?idCanal=" + getIdCanal() + '&linguagem=en';
    }
}

function getIdCanal() {
    var strReturn = "";
    var strHref = window.location.href;
    var strQueryString = strHref.substr(strHref.indexOf("=") + 1);
    var aQueryString = strQueryString.split("&");
    return aQueryString[0];
}




