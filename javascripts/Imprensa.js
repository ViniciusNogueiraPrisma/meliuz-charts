$(document).ready(function () {

    $("a[id*=linkListaTituloChamada]").each(function () {
        var link = $(this).attr('href');
        $(this).parents('.ajusteLista').find('a.recebeLink').attr('href', link);

        var textoLink = $(this).text();

        $(this).parents('.ajusteLista').find('.recebeTexto').text(textoLink);

        $(this).remove();

    });
});


function efetuarFiltroPorAno() {
    window.location = "Imprensa.aspx?idCanal=" + getIdCanal() + "&ano=" + $('select[id$=ddlAnoFiltro] option:selected').val();  
}

function limpaFiltroPorAno() {
    window.location = "Imprensa.aspx?idCanal=" + getIdCanal();
}

function getIdCanal() {
    var strReturn = "";
    var strHref = window.location.href;
    var strQueryString = strHref.substr(strHref.indexOf("=") + 1);
    var aQueryString = strQueryString.split("&");
    return aQueryString[0];
}




