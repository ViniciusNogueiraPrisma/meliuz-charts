$(document).ready(function () {
    $('input[id*=txtTelefone]').setMask("(99)99999 9999");

    $('.divWidth').removeClass('col-xl-9').addClass('col-xl-7');

});

function Limpar() {
    $('#formFaleComRi').find('input:text, textarea, input:password').val('');
}













