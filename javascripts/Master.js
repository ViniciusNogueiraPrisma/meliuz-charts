$(document).ready(function () {
  var breadcrumb = $("div[id*=breadcrumbInterna]");
  $("div[class*=breadcrumb]").append(breadcrumb);

  if ($("#hdnDefault").val() != "1") {
    $(".banner-home").removeClass().addClass("banner-internal");
    $(".removerHome").remove();
  } else {
    $(".breadcrumb").remove();
  }

  $("a").each(function () {
    var link = $(this);
    var urlLink = $(this).attr("href");
    if (typeof link.attr("href") != "undefined") {
      if (
        link.attr("href").indexOf("/Download/") > -1 ||
        link.attr("href").indexOf("download.aspx") > -1 ||
        link.attr("href").indexOf("Download.aspx") > -1
      ) {
        var descricao = link.text().trim();
        link.attr("target", "_blank");

        if (descricao == "") {
          descricao = urlLink.split("download.aspx?")[1];
        }

        var url = window.location.href;

        if (url.toLowerCase().indexOf("/listresultados.aspx") > -1) {
          var ano = $(this).parents("div[id*=divResultados]").attr("ano");
          if ($(".hidLinguagem").val() == "ptg") {
            link.attr(
              "onClick",
              "gtag('event', 'link', {'event_label': '" +
                descricao +
                "_PT_" +
                ano +
                "'});"
            );
          } else {
            link.attr(
              "onClick",
              "gtag('event', 'link', {'event_label': '" +
                descricao +
                "_EN_" +
                ano +
                "'});"
            );
          }
        } else {
          link.attr(
            "onClick",
            "gtag('event', 'link', {'event_label': '" + descricao + "'});"
          );
        }
      }
    }
  });

  // Busca
  $(".inputBusca").keypress(function (event) {
    event = event || window.event;

    if (event.keyCode == "13") {
      Buscar();

      event.preventDefault();
    }
  });

  $(".inputBuscaMobile").keypress(function (event) {
    event = event || window.event;

    if (event.keyCode == "13") {
      BuscarMobile();

      event.preventDefault();
    }
  });

  function accessApplyFont(size) {
    localStorage.setItem("access_font_size", size);
    var size_px = 100 + Number(size) + "% !important";
    $("html").attr("style", "font-size:" + size_px);
  }

  var access_font_size = 0;

  if (localStorage.getItem("access_font_size")) {
    access_font_size = Number(localStorage.getItem("access_font_size"));
    accessApplyFont(access_font_size);
  }

  $(".icon-aumentar-fonte").on("click", function (e) {
    e.preventDefault();
    if (access_font_size < 15) {
      access_font_size += 1;
      accessApplyFont(access_font_size);
    }
  });

  $(".icon-diminuir").on("click", function (e) {
    e.preventDefault();
    if (access_font_size > 0) {
      access_font_size -= 1;
      accessApplyFont(access_font_size);
    }
  });

  // Contraste
  function accessApplyTheme(theme) {
    localStorage.setItem("access_theme", theme);

    if (theme == "dark") {
      $("body").attr("data-theme", "dark");
    } else {
      $("body").attr("data-theme", "light");
    }
  }

  var access_theme = "light";

  if (localStorage.getItem("access_theme")) {
    access_theme = localStorage.getItem("access_theme");
    accessApplyTheme(access_theme);
  }

  $("#toggleContrast").on("click", function (e) {
    if (access_theme == "light") {
      access_theme = "dark";
    } else {
      access_theme = "light";
    }
    accessApplyTheme(access_theme);
  });

  var cookiePoliticas = localStorage.getItem("cookiePoliticas");

  if (cookiePoliticas == null) {
    $(".box-cookies").attr("style", "display:block");
  }

  $("#menuInterno li a").each(function () {
    if (location.href.toUpperCase().indexOf(this.href.toUpperCase()) >= 0) {
      $(this).parent().addClass("current-page");
    }

    var textoLink = $(this).text().toLowerCase();

    if (
      textoLink.indexOf("governança") != -1 ||
      textoLink.indexOf("governance") != -1
    ) {
      $(this).attr("href", "/show.aspx?idCanal=RNxdMUgXlS4+cE8qDZMMIg==");
    }
  });

  $("nav.navigation li a").each(function () {
    if (location.href.toUpperCase().indexOf(this.href.toUpperCase()) >= 0) {
      $(this).parents(".dropdown").find("button").addClass("bold");
    }
  });

  $(".navigation .dropdown .dropdown-toggle").each(function () {
    var canal = $(this).text();
    if (canal.indexOf("/") != -1) {
      var canalPrimeiro = $.trim(canal).split(" / ")[0];
      var canalSegundo = $.trim(canal).split(" / ")[1];
      $(this).html(canalPrimeiro + " / <br> " + canalSegundo);
    } else {
      var canalPrimeiro = $.trim(canal).split(" ")[0];
      var canalSegundo = canal.replace(canalPrimeiro, "");
      $(this).html(canalPrimeiro + "<br>" + canalSegundo);
    }
  });

  $(".page-title").each(function () {
    var canal = $(this).text().toLowerCase();

    if (canal.indexOf("sobre") != -1 || canal.indexOf("about") != -1) {
      $("body").addClass("sobre-o-meliuz");
    } else if (canal.indexOf("social") != -1) {
      $("body").addClass("social-e-governanca");
    } else if (
      canal.indexOf("resultados") != -1 ||
      canal.indexOf("results") != -1
    ) {
      $("body").addClass("resultados-e-comunicados");
    } else if (
      canal.indexOf("apresentações") != -1 ||
      canal.indexOf("presentations") != -1
    ) {
      $("body").addClass("apresentacoes-relatorios-e-eventos");
    } else if (
      canal.indexOf("serviços") != -1 ||
      canal.indexOf("services") != -1
    ) {
      $("body").addClass("servicos-ao-investidor");
    } else if (
      canal.indexOf("governança") != -1 ||
      canal.indexOf("governance") != -1
    ) {
      $("body").addClass("governanca");
    }
  });

  var url = window.location.search;

  if (!(url.indexOf("busca") != -1)) {
    $("ul").each(function () {
      if ($.trim($(this).html()) == "") {
        $(this).remove();
      }
    });
  }

  $("ul.menuNetos").each(function () {
    $(this).parent().addClass("dropdown-duplo");
    $(this).prev().addClass("dropdown-page");
    $(this).parent().parent().addClass("fade-up");
  });

  if ($("#hdnDefault").val() == "1" && $("div#Lbanner").length > 0) {
    $("div.alerta").attr("style", "display:block");
    $("body").attr("style", "max-height: 100vh;overflow-y: hidden;");
  }

  $("a.btn-fechar").on("click", function (e) {
    $("div.alerta").hide();
    $("body").attr("style", "");
  });
});

function setCookie() {
  localStorage.setItem("cookiePoliticas", "meliuz");
  $(".box-cookies").attr("style", "display:none");
}

function Buscar() {
  var buscada = $(".inputBusca").val().replace(/"/g, "");
  window.location = "ListaBusca.aspx?busca=" + buscada;
}

function BuscarMobile() {
  var buscada = $(".inputBuscaMobile").val().replace(/"/g, "");
  window.location = "ListaBusca.aspx?busca=" + buscada;
}

function irParaTopo() {
  $("html, body").animate(
    {
      scrollTop: 0,
    },
    "slow"
  );
}

function retornoCallback(arg) {
  var args = arg.split(";");

  switch (args[0]) {
    case "impressao": {
      executaImpressao(args[1]);
      break;
    }
    case "buscarShow": {
      alert(args[1]);
      break;
    }
    case "email": {
      if (args[1] == "success") {
        alert(args[2]);
        fechaBoxEmail();
      } else alert(args[2]);
      break;
    }
    case "novaDescricaoTriResponse":
      exibirNovaDescricao(args[1], args[2]);
      break;
    case "lembreteAgenda":
      var alertagenda = $("input[id$=MsgLembreteAgenda]").val();
      limparCamposAgenda();
      alert(alertagenda);
      break;
    case "paginarResponse":
      efetuarPaginacaoResponse(args[1], args[2]);
      break;
    case "alerta": {
      var alertari = $("input[id$=MsgSucessoRi]").val();
      alert(alertari);
      fechaBoxAlerta();
      limpaModal();
      break;
    }
    case "alertaContatoExiste": {
      var mensagem = unescape(args[1]);
      eval(mensagem);
      fechaBoxAlerta();
      limpaModal();
      $("body").removeClass();
      break;
    }
    case "EventosAnteriores": {
      carregarEventosAnteriores(args);
      break;
    }
    case "EventosProximos": {
      carregarEventosProximos(args);
      break;
    }
    case "paginarcalendarioresponsive": {
      montaEventosCalendario(args[1]);
      mostraEventosDoDiaSelecionadoPosMudancaMes();
      break;
    }
    case "captchaIvalido": {
      var textoAlerta = $("input[id$=MsgErroCaptcha]").val();
      alert(textoAlerta);
      break;
    }
    default:
      break;
  }
}

function erroCallback(err) {
  alert("erro:" + err);
}

window.onload = () => {
  var url = window.location.search;
  if (url.indexOf("0Hd4f3Ci985QdZ03UhVttQ==") != -1) {
    const empresas = [
      "#Picodi",
      "#Acesso",
      "#Promobit",
      "#MelhorPlano",
      "#Alter",
      "#iDinheiro",
      "#Muambator",
    ];
    empresas.forEach((e) => {
      if (window.location.hash.indexOf(e) != -1) {
        const element = document.querySelector(`${e}`);
        let toTop = 0;
        window.matchMedia("(max-width: 991px)").matches
          ? (toTop = element.offsetTop - 200)
          : (toTop = element.offsetTop - 110);
        window.scrollTo({
          top: toTop,
          behavior: "smooth",
        });
      }
    });
  }
};
