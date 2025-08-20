using System;
using System.Web.UI.WebControls;
using System.Configuration;
using ComuniqueSe.Portais.Paginas.Helpers;
using ComuniqueSe.Portais.Paginas.Helpers.Interfaces;
using System.Web;
using ComuniqueSeWorkflow.Infraestrutura;

namespace Meliuz.Master
{
    public partial class Master : ComuniqueSe.Portais.Paginas.Master.Master
    {

        private readonly IConteudoHelper _conteudoHelper = new ConteudoHelper();
        private readonly ICanalHelper _canalHelper = new CanalHelper();

        protected override LinkButton HlkCulturaPtBr { get { return hlkCulturaPtBR; } }
        protected override LinkButton HlkCulturaEnUs { get { return hlkCulturaEnUS; } }
        protected override LinkButton HlkCulturaEs { get { return new LinkButton(); } }

        protected override HiddenField HdfSlugPT { get { return new HiddenField() ; } }

        protected override HiddenField HdfSlugEN { get { return new HiddenField(); } }

        protected override HiddenField HdfSlugES { get { return new HiddenField(); } }



        protected override void Page_Load(object sender, EventArgs e)
        {           

            base.Page_Load(sender, e);

            WebControlRetrancaSplashFull.IdConta = ConfigHelper.ObterIdContaDefault();
            WebControlRetrancaSplashFull.ImagePath = ConfigurationManager.AppSettings["WorkflowSiteFilesPath"];
            WebControlRetrancaSplashFull.IdRetranca = Convert.ToInt64(ConfigurationManager.AppSettings["IdRetrancaSplashFull"]);

            WebControlMenuTemplate.CustomMenuAttribute = new[] { "1", "2", "3", "4", "5" };
            WebControlMenuPaiMobile.CustomMenuAttribute = new[] { "1", "2", "3", "4", "5" };
            WebControlMenuMobile.CustomMenuAttribute = new[] { "1", "2", "3", "4", "5" };

            var url = HttpContext.Current.Request.Url;

            if (url.ToString().ToLower().Contains("default")){
                canonical.Text = "<link rel='canonical' href='https://ri.meliuz.com.br/'/>";
            }
            //else
            //{
                

            //    canonical.Text = "<link rel='canonical' href='" + AntiXssEncoder.UrlEncode(url.ToString())  + "'/>";
            //}

           

            string img;
          
            if (CanalParametro > 0)
            {
                img = _canalHelper.GetImagemCanal(CanalParametro);
                if (!string.IsNullOrEmpty(img))
                {
                    idEscpaanimacao.Style.Add("background-image", "url(images/" + img + ")");
                }
                else
                {
                    idEscpaanimacao.Style.Add("background-image", "url(images/banner-home.jpg)");
                }

                var urlPagina = Request.Url.Scheme + "://" + Request.Url.Authority + Request.Url.AbsolutePath + "?idCanal=" + criptId(CanalParametro);

                canonical.Text = "<link rel='canonical' href='" + urlPagina + "'/>";

            }
            else if (ConteudoParametro > 0)
            {
                img = _conteudoHelper.GetImagemCanal(ConteudoParametro);
                if (!string.IsNullOrEmpty(img))
                {
                    idEscpaanimacao.Style.Add("background-image", "url(images/" + img + ")");
                }
                else
                {
                    idEscpaanimacao.Style.Add("background-image", "url(images/banner-home.jpg)");
                }

                var urlPagina = Request.Url.Scheme + "://" + Request.Url.Authority + Request.Url.AbsolutePath + "?idMateria=" + criptId(ConteudoParametro);
                canonical.Text = "<link rel='canonical' href='" + urlPagina + "'/>";

            }
            else
            {
                idEscpaanimacao.Style.Add("background-image", "url(images/banner-home.jpg)");
            }
           
            linkFaleRI.HRef = "../" + ConfigHelper.ObterLinkCanal("IdCanalFaleRI");
            linkCentral.HRef = "../" + ConfigHelper.ObterLinkCanal("IdCanalCentral");

        }

        protected override void CarregaBotoesCultura()
        {
            switch (Session["MyCulture"].ToString())
            {
                case ("pt-BR"):
                    hlkCulturaPtBR.Visible = true;
                    hlkCulturaEnUS.Visible = true;
                    linkPT.Visible = true;
                    linkEN.Visible = true;
                    break;

                case ("en-US"):
                    hlkCulturaPtBR.Visible = true;
                    hlkCulturaEnUS.Visible = true;
                    linkPT.Visible = true;
                    linkEN.Visible = true;
                    break;
            }


        }

        protected string criptId (long id)
        {
            return new Criptografia().Criptografar(id);
        }

    }
}