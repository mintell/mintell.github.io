class Inicio{


    constructor(jquery, loader, notificacao) {
        this.jquery = jquery;
        this.apiUrl = "https://website-3634ff61.bsc.jwz.mybluehost.me/API";
        this.loader = loader;
        this.notificacao = notificacao;
    }
    
    //FUNCAO PARA FAZER LOGIN
    entrar(){
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();
        var telefone = document.querySelector("#entrar-telefone").value;
        var passe = document.querySelector("#entrar-passe").value;

        var form = new FormData();
        form.append("telefone", telefone);
        form.append("palavra_passe", passe);

        var settings = {
        "url": this.apiUrl+"/entrar",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if(res.ok){
                localStorage.setItem("token",res.payload);
                location.href = "src/pages/home.html";
            }else{
                load.fechar();
                notify.sms(res.payload,1);
            }
        }).always(function(a){
            if(a.statusText){
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
    //FUNCAO PARA RECEBER CODIGO DE VERIFICACAO
    receberCodigo(){
        var load = this.loader;
        var notify = this.notificacao;
        var telefone = document.querySelector("#entrar-telefone").value;

        var form = new FormData();
        form.append("telefone", telefone);

        var settings = {
        "url": this.apiUrl+"/entrar/recebercodigo",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };
        
        if (telefone.length <= 8) {
            this.notificacao.sms("Número de telefone muito curto", 1);
            return;
        }

        load.abrir();
        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if(res.ok){
                localStorage.setItem("telefone",telefone);
                location.href = "validar-codigo.html";
            }else{
                load.fechar();
                notify.sms(res.payload,1);
            }
        }).always(function(a){
            if(a.statusText){
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
    //FUNCAO PARA VERIFICAR CODIGO DE VERIFICACAO
    verificarCodigo(){
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();
        var codigo = document.querySelector("#entrar-codigo").value;
        var telefone = localStorage.getItem("telefone");

        var form = new FormData();
        form.append("codigo", codigo);
        form.append("telefone", telefone);

        var settings = {
        "url": this.apiUrl+"/entrar/verificarcodigo",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if(res.ok){
                localStorage.setItem("codigo",codigo);
                location.href = "nova-palavra-passe.html";
            }else{
                load.fechar();
                notify.sms(res.payload,1);
            }
        }).always(function(a){
            if(a.statusText){
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
    //FUNCAO PARA RECUPERAR CONTA
    novaPalavraPasse(){
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();
        var palavra_passe = document.querySelector("#entrar-passe").value;
        var codigo = localStorage.getItem("codigo");
        var telefone = localStorage.getItem("telefone");

        var form = new FormData();
        form.append("codigo", codigo);
        form.append("telefone", telefone);
        form.append("palavra_passe", palavra_passe);

        var settings = {
        "url": this.apiUrl+"/entrar/novapalavrapasse",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if(res.ok){
                localStorage.setItem("token",res.payload);
                location.href = "home.html";
            }else{
                load.fechar();
                notify.sms(res.payload,1);
            }
        }).always(function(a){
            if(a.statusText){
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }


}
