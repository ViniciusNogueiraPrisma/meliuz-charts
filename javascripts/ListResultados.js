$(document).ready(function () {

    var combo = $('div[id*=ddlAnoLink]');
    $('div[class*=recebeCombo]').append(combo);

    $('select[id*=ddlCategoriaFiltro]').remove();

    var ano = $("select[id*=ddlAnoFiltro] option:selected").text();
    efetuarFiltroPorAno(ano);

    $("a[id*=linkArq]").each(function () {
        if ((!$.trim($(this).html()) == "") && ($(this).text().indexOf('PDF') != -1)) {
            if ($(this).hasClass("Release")) {
                $(this).html('<i class="icon-download" title="Baixar Arquivo"></i>');
            } else if ($(this).hasClass("Apresentacao")) {
                $(this).html('<i class="icon-video" title="Baixar Arquivo"></i>');
            } 
        } else if ((!$.trim($(this).html()) == "") && ($.trim($(this).text().indexOf('MP3') != -1) || ($(this).text().indexOf('ZIP') != -1))) {
            if ($(this).hasClass("audio")) {
                $(this).html('<i class="icon-volume" title="Baixar Audio"></i>');
            } else if ($(this).hasClass("Release")) {
                $(this).html('<i class="icon-download" title="Baixar Arquivo"></i>');
            }
        }
            


    });

    $("tr[id*=rptResultados_ResultadoArq]").find('a[href*="javascript:void(0)"]').each(function() {
        $(this).parent().parent().attr('style', 'display:none');
    });


 

    // Inserir PDF disable
    var th = 0;
    var cont = 1;
    var trim1;
    var trim2;
    var trim3;
    var trim4;

    $('div[id*=rptResultados_ulAno]').each(function () {
        $(this).find('th').each(function () {
            if (th === cont) {
                if ($(this).attr('resultado') != undefined) {
                    switch (cont) {
                        case 1:
                            trim1 = true;
                            break;
                        case 2:
                            trim2 = true;
                            break;
                        case 3:
                            trim3 = true;
                            break;
                        case 4:
                            trim4 = true;
                            break;
                    }
                }
                th++;
                cont++;
            } else {
                th++;
                return;
            }
        });
        th = 0;
        cont = 1;

        $(this).find("a[id*=linkArq]").each(function () {
            var id = $(this).attr('id');
            var index = id.substr(id.indexOf('T_') - 1);
            var identificador = index.split('_')[0];
            if ($(".hidLinguagem").val() == 'ptg') {
                if ((identificador === '1T') && (trim1 === true)) {
                    if ($.trim($(this).html()) == "") {
                        $(this).removeAttr('href');
                        $(this).attr('style', 'cursor:default');
                        $(this).addClass('disabled');
                    }
                    if ($(this).hasClass("Release")) {
                        $(this).html('<i class="icon-download" title="Baixar Arquivo"></i>');
                    } else if ($(this).hasClass("Apresentacao")) {
                        $(this).html('<i class="icon-video" title="Baixar Arquivo"></i>');
                    } else if ($(this).hasClass("audio")) {
                        $(this).html('<i class="icon-volume" title="Baixar Audio"></i>');
                    }
                }
                                 
                if ((identificador === '2T') && (trim2 === true)) {
                    if ($.trim($(this).html()) == "") {
                        $(this).removeAttr('href');
                        $(this).attr('style', 'cursor:default');
                        $(this).addClass('disabled');                       
                    }
                    if ($(this).hasClass("Release")) {
                        $(this).html('<i class="icon-download" title="Baixar Arquivo"></i>');
                    } else if ($(this).hasClass("Apresentacao")) {
                        $(this).html('<i class="icon-video" title="Baixar Arquivo"></i>');
                    } else if ($(this).hasClass("audio")) {
                        $(this).html('<i class="icon-volume" title="Baixar Audio"></i>');
                    }
                }

                if ((identificador === '3T') && (trim3 === true)) {
                    if ($.trim($(this).html()) == "") {
                        $(this).removeAttr('href');
                        $(this).attr('style', 'cursor:default');
                        $(this).addClass('disabled');                        
                    }
                    if ($(this).hasClass("Release")) {
                        $(this).html('<i class="icon-download" title="Baixar Arquivo"></i>');
                    } else if ($(this).hasClass("Apresentacao")) {
                        $(this).html('<i class="icon-video" title="Baixar Arquivo"></i>');
                    } else if ($(this).hasClass("audio")) {
                        $(this).html('<i class="icon-volume" title="Baixar Audio"></i>');
                    }
                }
                    

                if ((identificador === '4T') && (trim4 === true)) {
                    if ($.trim($(this).html()) == "") {
                        $(this).removeAttr('href');
                        $(this).attr('style', 'cursor:default');
                        $(this).addClass('disabled');                     
                    }
                    if ($(this).hasClass("Release")) {
                        $(this).html('<i class="icon-download" title="Baixar Arquivo"></i>');
                    } else if ($(this).hasClass("Apresentacao")) {
                        $(this).html('<i class="icon-video" title="Baixar Arquivo"></i>');
                    } else if ($(this).hasClass("audio")) {
                        $(this).html('<i class="icon-volume" title="Baixar Audio"></i>');
                    }
                }
                   
            } 
            if ($(".hidLinguagem").val() == 'eng') {
                if ((identificador === '1T') && (trim1 === true)) {
                    if ($.trim($(this).html()) == "") {
                        $(this).removeAttr('href');
                        $(this).attr('style', 'cursor:default');
                        $(this).addClass('disabled');                       
                    }
                    if ($(this).hasClass("Release")) {
                        $(this).html('<i class="icon-download" title="Download File"></i>');
                    } else if ($(this).hasClass("Apresentacao")) {
                        $(this).html('<i class="icon-video" title="Download File"></i>');
                    } else if ($(this).hasClass("audio")) {
                        $(this).html('<i class="icon-volume" title="Download Audio"></i>');
                    }
                }

                if ((identificador === '2T') && (trim2 === true)) {
                    if ($.trim($(this).html()) == "") {
                        $(this).removeAttr('href');
                        $(this).attr('style', 'cursor:default');
                        $(this).addClass('disabled');                  
                    }
                    if ($(this).hasClass("Release")) {
                        $(this).html('<i class="icon-download" title="Download File"></i>');
                    } else if ($(this).hasClass("Apresentacao")) {
                        $(this).html('<i class="icon-video" title="Download File"></i>');
                    } else if ($(this).hasClass("audio")) {
                        $(this).html('<i class="icon-volume" title="Download Audio"></i>');
                    }
                }
                    

                if ((identificador === '3T') && (trim3 === true)) {
                    if ($.trim($(this).html()) == "") {
                        $(this).removeAttr('href');
                        $(this).attr('style', 'cursor:default');
                        $(this).addClass('disabled');                     
                    }
                    if ($(this).hasClass("Release")) {
                        $(this).html('<i class="icon-download" title="Download File"></i>');
                    } else if ($(this).hasClass("Apresentacao")) {
                        $(this).html('<i class="icon-video" title="Download File"></i>');
                    } else if ($(this).hasClass("audio")) {
                        $(this).html('<i class="icon-volume" title="Download Audio"></i>');
                    }
                }
                    

                if ((identificador === '4T') && (trim4 === true)) {
                    if ($.trim($(this).html()) == "") {
                        $(this).removeAttr('href');
                        $(this).attr('style', 'cursor:default');
                        $(this).addClass('disabled');                      
                    }
                    if ($(this).hasClass("Release")) {
                        $(this).html('<i class="icon-download" title="Download File"></i>');
                    } else if ($(this).hasClass("Apresentacao")) {
                        $(this).html('<i class="icon-video" title="Download File"></i>');
                    } else if ($(this).hasClass("audio")) {
                        $(this).html('<i class="icon-volume" title="Download Audio"></i>');
                    }
                }
                    
            }

            cont++;
        });
        cont = 1;


        trim1 = false;
        trim2 = false;
        trim3 = false;
        trim4 = false;
    });
    // FIM Inserir PDF disable


    $("th[id*=rptResultados]").each(function () {
        if ($(this).attr('resultado') == undefined) {
            $(this).remove();
        }

    });

    //remover 'td' vazias
    $("a[id*=linkArq]").each(function () {
        if (($.trim($(this).html()) == "")) {
            $(this).parent().remove();
        }
    });//fim

 

});

function efetuarFiltroPorAno(ano) {
    $('div[ano]').hide();
    $('div[ano=' + ano + ']').show();
}

function limpaFiltroPorAno() {
    $('div[ano]').hide();
    $('div[ano]').show();
}

