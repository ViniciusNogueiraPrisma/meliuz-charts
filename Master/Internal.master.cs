using System;
using ComuniqueSe.Portais.Paginas.Helpers;
using ComuniqueSe.Portais.Paginas.Helpers.Interfaces;
using ComuniqueSe.Portais.Paginas.Master;


namespace Meliuz.Master
{
    public partial class Internal : InternalMasterPage
    {
        private readonly IConteudoHelper _conteudoHelper = new ConteudoHelper();
        private readonly ICanalHelper _canalHelper = new CanalHelper();

        protected void Page_Load(object sender, EventArgs e)
        {
            WebControlBreadcrumb.IdCanal = CanalParametro;
            WebControlBreadcrumb.IdConteudo = ConteudoParametro;
            WebControlBreadcrumb.IdTeleconferencia = TeleconferenciaParametro;
            WebControlBreadcrumb.BreadcrumbResource = (GetLocalResourceObject(Request.Url.LocalPath.ToLower().Substring(1)) ?? "").ToString();

            if (CanalParametro > 0)
                webControlMenuSubCanais.IdCanal = _canalHelper.GetIdCanalPrincipal(CanalParametro);
            else if (ConteudoParametro > 0)
                webControlMenuSubCanais.IdCanal = _conteudoHelper.GetIdCanalPrincipal(ConteudoParametro);
            else if (CanalParametro <= 0 && ConteudoParametro <= 0 && TeleconferenciaParametro > 0)
                webControlMenuSubCanais.IdCanal = _conteudoHelper.GetIdCanalPrincipalTeleconferencia(TeleconferenciaParametro);
            else
                webControlMenuSubCanais.Visible = false;

            linkFale.HRef = "../" + ConfigHelper.ObterLinkCanal("IdCanalFaleRI");
            linkMailing.HRef = "../" + ConfigHelper.ObterLinkCanal("IdCanalMailing");
            linkCVM.HRef = "../" + ConfigHelper.ObterLinkCanal("IdCanalCVM");

         

        }

        protected long CanalParametro
        {
            get
            {
                var idCanal = Request.QueryString["idCanal"];
                return string.IsNullOrEmpty(idCanal) ? 0 : ConfigHelper.Descriptografar(idCanal);
            }
        }

        protected long ConteudoParametro
        {
            get
            {
                var idConteudo = Request.QueryString["idConteudo"];
                idConteudo = idConteudo ?? Request.QueryString["idMateria"];
                idConteudo = idConteudo ?? Request.QueryString["IdResultado"];
                idConteudo = idConteudo ?? Request.QueryString["Arquivo"];

                return string.IsNullOrEmpty(idConteudo) ? 0 : ConfigHelper.Descriptografar(idConteudo);
            }
        }

        protected long TeleconferenciaParametro
        {
            get
            {
                var idConteudo = Request.QueryString["IdTeleconferencia"];

                return string.IsNullOrEmpty(idConteudo) ? 0 : ConfigHelper.Descriptografar(idConteudo);
            }
        }
    }
}
