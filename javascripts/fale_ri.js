$(document).ready(function () {

    if ($(".hidLinguagem").val() == "ptg") {
        $('input[id*=txtTelefone]').setMask("(99)99999 9999");
    } else {
        $('input[id*=txtTelefone]').setMask("99(999)999 9999");
    }



    

    $('input[class*=IdEmail]').each(function () {
        var pegaId = $(this).attr('id');
        $('.recebeEmail').attr('for', pegaId)
    });

    $('input[class*=IdTel]').each(function () {
        var idTel = $(this).attr('id');
        $('.recebeTel').attr('for', idTel)
    });

    $('input[class*=IdSim]').each(function () {
        var idSim = $(this).attr('id');
        $('.recebeSim').attr('for', idSim)
    });

    $('input[class*=IdNao]').each(function () {
        var idNao = $(this).attr('id');
        $('.recebeNao').attr('for', idNao)
    });

    $('.divWidth').removeClass('col-xl-9').addClass('col-xl-7');

 
});

function Limpar() {
    $('#formFaleComRi').find('input:text, textarea, input:password').val('');
}

function ValidaCaptcha() {
    $("#alertasModal").remove();
}









