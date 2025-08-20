<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="MenuTopo.ascx.cs" Inherits="Meliuz.ascx.MenuTopo" %>
<%@ Register Assembly="ComuniqueSe.WebControls, Version=1.0.0.0, Culture=Neutral, PublicKeyToken=5b058f9e1367e870" Namespace="ComuniqueSe.WebControls.MeusDownloads" TagPrefix="cmd" %>
<%@ Register Assembly="ComuniqueSe.WebControls, Version=1.0.0.0, Culture=Neutral, PublicKeyToken=5b058f9e1367e870" Namespace="ComuniqueSe.WebControls.ControleMeusFavoritos" tagPrefix="wcmf" %>
		
        	
        	
        <cmd:WebControlMeusDownloadsIcone ID="downloadLink" runat="server" visible="false"/>


		<div class="filter" id="ddlAnoLink" runat="server">

			<asp:DropDownList CssClass="form-select"  runat="server" ID="ddlCategoriaFiltro" onchange="javascript:filtrarCategoria();">
                 <asp:ListItem Text="<%$resources:ddlCategoriafiltroItem %>" value="Tipo" />
            </asp:DropDownList> 

			<label for="year-filter" id="labelAno">
				<asp:Literal runat="server" Text="<%$Resources: Ano %>" ></asp:Literal>
			</label>

			<asp:DropDownList runat="server" ID="ddlAnoFiltro" CssClass="form-select" onchange="javascript:filtrarCategoria();" >  
            </asp:DropDownList>
		</div>
					

      
       
           
				
			
          
        







   



   












 
			
					