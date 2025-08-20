
function imprimirClick() {
    imprimir($('.titShow').text(), $('.titShow').text(), $('.txtShow').html(), $('.titShow').text());
}

function AbrirDiv(id) {
    if (document.getElementById(id).style['display'] == 'block') {
        document.getElementById(id).style['display'] = 'none';
        $('a.[id=a' + id + ']').removeAttr('class', 'selected');
    } else {
        document.getElementById(id).style['display'] = 'block';
        $('a.[id=a' + id + ']').attr('class', 'selected');
    }
}

$(document).ready(function () {

    $('.txt-show').addClass('list-show');

    $(document).ready(function () {
        $('a[id*=aesconder]').each(function (index) {
            var id = (this.id).toString().replace('aesconder', 'esconder');
            var js = "AbrirDiv('" + id + "');";
            var newclick = new Function(js);
            $(this).attr('onclick', '').click(newclick);
        });
        $('div[id*=esconder]').css('display', 'none');
    });
    $('div[id*=esconder]').css('display', 'none');
});

