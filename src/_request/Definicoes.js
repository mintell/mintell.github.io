class Definicoes {


    constructor(jquery, loader, notificacao) {
        this.jquery = jquery;
        this.apiUrl = "https://api.mintel.ao";
        this.loader = loader;
        this.notificacao = notificacao;
    }


    ver() {
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();

         $("#secret")[0].value = ((localStorage.getItem("secretkey")));
            $("#auth")[0].value =((localStorage.getItem("authid")));
      
        setTimeout(function(){
            load.fechar();
        },700)

    }


}