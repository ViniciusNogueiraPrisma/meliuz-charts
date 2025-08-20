using System.ComponentModel;
using System.Threading;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using ComuniqueSe.Portais.Paginas.UserControls;
using ComuniqueSe.WebControls.ControleMeusFavoritos;

namespace Meliuz.ascx
{
    public partial class MenuTopo : MenuTopoControl
    {

        private static bool _exibirCategoria = true;
        public MenuTopo()
            : base(_exibirCategoria)
        {
        }

        public string _langShareIt;

        protected override void Page_Load(object sender, System.EventArgs e)
        {
            base.Page_Load(sender, e);
            TrocalinguagemShareIt();
        }

        private void TrocalinguagemShareIt()
        {
            switch (Thread.CurrentThread.CurrentUICulture.Name)
            {
                case "en-US":
                    _langShareIt = "en";
                    break;
                case "pt-BR":
                    _langShareIt = "pt";
                    break;
            }
        }

        protected override void DownloadInvisible()
        {
            downloadLink.Visible = false;
        }

        protected override HtmlAnchor LnkAumentarFonte
        {
            get { return new HtmlAnchor(); }
        }

        protected override HtmlAnchor LnkDiminuirFonte
        {
            get { return new HtmlAnchor(); }
        }

        protected override Literal TxtFonte
        {
            get { return new Literal(); }
        }

        protected override WebControlMarcarFavorito FavoritosLink
        {
            get { return new WebControlMarcarFavorito(); }
        }

        protected override HtmlAnchor VoltarLink
        {
            get { return new HtmlAnchor(); }
        }

        protected override HtmlAnchor PrintLink
        {
            get { return new HtmlAnchor(); }
        }

        protected override HtmlAnchor EmailLink
        {
            get { return new HtmlAnchor(); }
        }

        protected override HtmlAnchor CompartilharLink
        {
            get { return new HtmlAnchor(); }
        }

        protected HtmlImage SeparadorFonte
        {
            get { return new HtmlImage(); }
        }

        protected override HtmlImage SeparadorVoltar
        {
            get { return new HtmlImage(); }
        }

        protected override HtmlImage SeparadorImprimir
        {
            get { return new HtmlImage(); }
        }

        protected override HtmlImage SeparadorEmail
        {
            get { return new HtmlImage() ; }
        }

        protected override HtmlImage SeparadorPdf
        {
            get { return new HtmlImage(); }
        }

        protected override HtmlImage SeparadorDownloads
        {
            get { return new HtmlImage(); }
        }

        protected override HtmlImage SeparadorCompartilhar
        {
            get { return new HtmlImage(); }
        }

        protected override HtmlImage SeparadorFavoritos
        {
            get { return new HtmlImage(); }
        }

        protected override HtmlImage SeparadorTamanhoFonte
        {
            get { return new HtmlImage(); }
        }

        protected override LinkButton PdfLink
        {
            get { return new LinkButton(); }
        }

        protected override LinkButton PdfLinkAgenda
        {
            get { return new LinkButton(); }
        }

        protected override HtmlGenericControl DdlAnoLink
        {
            get { return ddlAnoLink; }
        }

        protected override DropDownList DdlAnoFiltro
        {
            get { return ddlAnoFiltro; }
        }

        protected override HtmlGenericControl DdlCategoriaLink
        {
            get { return new HtmlGenericControl(); }
        }

        protected override DropDownList DdlCategoriaFiltro
        {
            get { return ddlCategoriaFiltro; }
        }

        public override void ShowFavoritoControl() 
        {
            FavoritosLink.Visible = true;
        }

        public override void HideFavoritoControl() 
        {
            FavoritosLink.Visible = false;
        }

        [Localizable(true)]
        public bool ExibeSeparadorFonte
        {
            set
            {
                SeparadorFonte.Visible = value;
            }
        }

       [Localizable(true)]
        public bool ExibeSeparadorFavoritos
        {
            set
            {
                FavoritosLink.Visible = value;
            }
        }

       [Localizable(true)]
       public bool ExibeSeparadorVoltar
       {
           set
           {
               SeparadorVoltar.Visible = value;
           }
       }

       [Localizable(true)]
       public bool ExibeSeparadorImprimir
       {
           set
           {
               SeparadorImprimir.Visible = value;
           }
       }

       [Localizable(true)]
       public bool ExibeSeparadorEmail
       {
           set
           {
               SeparadorEmail.Visible = value;
           }
       }

       [Localizable(true)]
       public bool ExibeSeparadorPdf
       {
           set
           {
               SeparadorPdf.Visible = value;
           }
       }

       [Localizable(true)]
       public bool ExibeSeparadorDownloads
       {
           set
           {
               SeparadorDownloads.Visible = value;
           }
       }

       [Localizable(true)]
       public bool ExibeSeparadorCompartilhar
       {
           set
           {
               SeparadorCompartilhar.Visible = value;
           }
       }
    }
}
