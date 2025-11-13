class Usuario {


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

        $("#client-name").attr("placeholder", (localStorage.getItem("nome")));
        $("#client-sex").attr("placeholder", (localStorage.getItem("genero")));
        $("#client-phone").attr("placeholder", (localStorage.getItem("telefone")));
        $("#client-email").attr("placeholder", (localStorage.getItem("email")));
        setTimeout(function(){
            load.fechar();
        },700)

    }


}