class Cliente {


    constructor(jquery, loader, notificacao) {
        this.jquery = jquery;
        this.apiUrl = "https://website-3634ff61.bsc.jwz.mybluehost.me/API";
        this.loader = loader;
        this.notificacao = notificacao;
    }


    ver(chave) {
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();
        var settings = {
            "url": this.apiUrl + "/cliente/"+chave,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "token": token
            },
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {

                $("#client-name").val(res.payload.nome);
                $("#client-phone").val(res.payload.telefone);
                $("#client-email").val(res.payload.email);
                $("#client-textarea").html(res.payload.nota);

            } else {
                notify.sms(res.payload, 1);
            }

        }).always(function (a) {
            //console.log(a);
            if(a.statusText){
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
    todos() {
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();
        var settings = {
            "url": this.apiUrl + "/cliente",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "token": token
            },
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {

                $('.total-client').text((res.payload).length + " Clientes");
                (res.payload).forEach(element => {
                    const sectionBox = $("<section></section").appendTo(".render");
                    sectionBox.addClass("request");

                    const buttonBox = $('<button></button>').appendTo(sectionBox);
                    buttonBox.addClass("request-btn");
                    buttonBox.addClass("black");

                    const paragragh = $("<p></p").appendTo(buttonBox);
                    const paragragh2 = $("<p></p").text(element.telefone).appendTo(buttonBox);

                    const paragrahpLink = $("<a></a>")
                        .attr("href", "cliente.html?yds=" + element.identificador)
                        .text(element.nome)
                        .appendTo(paragragh)
                });


            } else {
                notify.sms(res.payload, 1);
            }

        }).always(function (a) {
            //console.log(a);
            if(a.statusText){
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }

    inserir() {
        var token = localStorage.getItem("token");
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();

        var form = new FormData();
        var nome = document.querySelector("#client-name").value;
        var telefone = document.querySelector("#client-phone").value;
        var email = document.querySelector("#client-email").value;
        var nota = document.querySelector("#client-textarea").value;



        form.append("nome", nome);
        form.append("telefone", telefone);
        form.append("email", email);
        form.append("nota", nota);

        var settings = {
            "url": this.apiUrl+"/cliente",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "token": token
            },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if(res.ok){
                location.href = "clientes.html"
            }else{
                load.fechar();
                notify.sms(res.payload,1);
            }
        }).always(function (a) {
            if(a.statusText){
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });;
    }
    alterar(chave) {
        var token = localStorage.getItem("token");
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();

        var form = new FormData();
        var nome = document.querySelector("#client-name").value;
        var telefone = document.querySelector("#client-phone").value;
        var email = document.querySelector("#client-email").value;
        var nota = document.querySelector("#client-textarea").value;



        form.append("identificador", chave);
        form.append("nome", nome);
        form.append("telefone", telefone);
        form.append("email", email);
        form.append("nota", nota);

        var settings = {
            "url": this.apiUrl+"/cliente/update",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "token": token
            },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
        };

        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if(res.ok){
                location.href = "cliente.html?yds="+chave;
            }else{
                load.fechar();
                notify.sms(res.payload,1);
            }
        }).always(function (a) {
            if(a.statusText){
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });;
    }

}