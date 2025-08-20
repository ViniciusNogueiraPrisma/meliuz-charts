$(document).ready(function () {

    $('a[id*=linkListaTituloChamada]').each(function () {
        var link = $(this).attr('href');
        $(this).parents('.ajusteLista').find('a.recebeLink').attr('href', link);
        var textoLink = $(this).text();

        $(this).parents('.ajusteLista').find('.recebeTexto').text(textoLink);

        $(this).remove();
    });


    var cont1 = 0;
    $('button[class*=accordion-button]').each(function () {
        $(this).attr('data-bs-target', '#collapse-' + cont1);
        $(this).attr('aria-controls', 'collapse-' + cont1);
        cont1++;
    });

    var cont2 = 0;
    $('div[id*=collapse-]').each(function () {
        var id = $(this).attr('id');
        $(this).attr('id', id + cont2);
        cont2++;
    });

    $('button[class*=accordion-button]').each(function () {
        if ($.trim($(this).html()) == "") {
            $(this).parents('.accordion-item').remove();
        }
    });

    var combo = $('div[id*=ddlAnoLink]');
    $('div[class*=recebeCombo]').append(combo);

    $('select[id*=ddlCategoriaFiltro]').remove();

    $('a.disabled').remove();

    var url = window.location.search;

    if (url.indexOf('CZFMzZA5f/4M2qEKn3KX6w==') != -1) {
        $('div[id*=ddlAnoLink]').remove();
    }


});

function efetuarFiltroPorAno(ano) {
    if ($(".hidLinguagem").val() == "ptg") {
        window.location = "ListGroup.aspx?idCanal=" + getIdCanal() + "&ano=" + ano + '&linguagem=pt';
    } else {
        window.location = "ListGroup.aspx?idCanal=" + getIdCanal() + "&ano=" + ano + '&linguagem=en';
    }
}

function limpaFiltroPorAno() {
    if ($(".hidLinguagem").val() == "ptg") {
        window.location = "ListGroup.aspx?idCanal=" + getIdCanal() + '&linguagem=pt';
    } else {
        window.location = "ListGroup.aspx?idCanal=" + getIdCanal() + '&linguagem=en';
    }
}

function getIdCanal() {
    var strHref = window.location.href;
    var strQueryString = strHref.substr(strHref.indexOf("=") + 1);
    var aQueryString = strQueryString.split("&");
    return aQueryString[0];
}


