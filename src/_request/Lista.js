class Lista {


    constructor(jquery, loader, notificacao) {
        this.jquery = jquery;
        this.apiUrl = "https://api.mintel.ao";
        this.loader = loader;
        this.notificacao = notificacao;
    }


    todos() {
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();
        var settings = {
            "url": this.apiUrl + "/lista",
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

                $('.total-sms').text((res.payload).length + " Listas");
                (res.payload).forEach(element => {
                    const sectionBox = $("<section></section").appendTo(".render");
                    sectionBox.addClass("request");

                    const buttonBox = $('<button></button>').appendTo(sectionBox);
                    buttonBox.addClass("request-btn");
                    buttonBox.addClass("black");

                    const paragragh = $("<p></p").appendTo(buttonBox);
                    const paragrahpLink = $("<a></a>")
                        .attr("href", "perfilLista.html?yds=" + element.identificador)
                        .text(element.nome)
                        .appendTo(paragragh)
                });

            } else {
                this.notify.sms(res.payload, 1);
            }

        }).always(function (a) {
            if (a.statusText) {
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
    ver(chave) {
        var load = this.loader;
        var notify = this.notificacao;
        var esse = this;
        load.abrir();
        var settings = {
            "url": this.apiUrl + "/lista/" + chave,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "token": token
            },
        };

        $.ajax(settings).done(function (response) {
            var res = JSON.parse(response);
            //console.log(res.payload);
            if (res.ok) {
                var clientesSelecionados = [];
                $('.title-list').val(res.payload.nome);
                $('.total-sms').text(res.payload["clientes"].length + " Contactos na lista"); 
                for (let i = 0; i < (res.payload["clientes"]).length; i++) {
                    clientesSelecionados[(res.payload["clientes"][i]['identificador'])] = ((res.payload["clientes"][i]['identificador']))
                }
                esse.clientesNaLista(clientesSelecionados);              
            } else {
                notify.sms(res.payload, 1);
            }

        }).always(function (a) {
            //console.log(a);
            if (a.statusText) {
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
  clientesNaLista(clientesSelecionados) {
        //console.log(clientesSelecionados);
        var clientes = [];
        var clientesSeletos = [];
        if(clientesSelecionados[0]){
            clientesSeletos = clientesSelecionados;
        }
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
            var res = JSON.parse(response);
            //console.log(res.payload);
            if (res.ok) {

                for (let i = 0; i < (res.payload).length; i++) {
                    var id = (res.payload[i].identificador);
                    if(clientesSelecionados[id]){
                            clientes.push((res.payload[i].identificador));
                            const sectionBox = $(`
                            <section class="request">
                            <button class="request-btn black">
                                <p> <a href="#?yds=${(res.payload[i].identificador)}"> ${(res.payload[i].nome)} </a> </p>
                                <input type="checkbox" class="sms-checkbox"  style="width:22px;height:22px;margin-right:4px" checked></input>
                            </button>
                            
                            </section>`).appendTo(".render");
                            
                        }else{
                            const sectionBox = $(`
                            <section class="request">
                            <button class="request-btn black">
                                <p> <a href="#?yds=${(res.payload[i].identificador)}"> ${(res.payload[i].nome)} </a> </p>
                                <input type="checkbox" class="sms-checkbox"  style="width:22px;height:22px;margin-right:4px"></input>
                            </button>
                            
                            </section>`).appendTo(".render");
                        }


                    

                }
                if($("#store-contactos")[0]){
                    $("#store-contactos")[0].value = (JSON.stringify(clientes));
                }
                
                $('.sms-checkbox').on('change', function () {

                    var clienteUrl = $(this).closest(".request").find("p a").attr('href')
                    let clienteId = clienteUrl.split("?")[1].split("=")[1];

                    if ($(this).prop("checked")) {
                        clientes.push(clienteId)
                        $("#store-contactos")[0].value = (JSON.stringify(clientes));
                    }else{

                        for (let i = 0; i <= clientes.length; i++) {
                            if (clientes[i] == clienteId) {
                                clientes.splice(i, 1);
                            }
                        }
                        
                        $("#store-contactos")[0].value = (JSON.stringify(clientes));
                        
                    }
                });

            } else {
                notify.sms(res.payload, 1);
            }

        }).always(function (a) {
            //console.log(a);
            if (a.statusText) {
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
    contactosparaenviar() {
        var res = "";
        var contactos = JSON.parse($("#store-contactos").val());

        if (contactos.length < 1) {
            return false;
        }

        contactos.forEach(function (element, k) {
            res += element;
            if ((k + 1) < contactos.length) {
                res += ",";
            }
        })
        return res;
    }
     alterarLista() {
        var load = this.loader;
        var notify = this.notificacao;
        var esse = this;
        
        var identificador = (location.search).split("=")[1];
        var contactos = this.contactosparaenviar();
        var nome = $("#title-list").val();


       
        //return;
         if (!contactos) {
            this.notificacao.sms("Precisa selecionar pelo menos um Contacto na Lista", 1);
            return;
        }
        if (nome.length <= 2) {
            this.notificacao.sms("Nome muito curto, pelo menos 3 caractéres", 1);
            return;
        }
        load.abrir();


        var form = new FormData();
        form.append("identificador", identificador);
        form.append("nome", nome);
        form.append("clientes", contactos);

        var settings = {
        "url": this.apiUrl + "/lista/update",
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
           
            if (res.ok) {
                location.href = "perfilLista.html?yds="+res.payload;             
            } else {
                notify.sms(res.payload, 1);
            }
        }).always(function (a) {
            //console.log(a);
            if (a.statusText) {
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
    criarLista() {
        var load = this.loader;
        var notify = this.notificacao;
        var esse = this;
        
        var contactos = this.contactosparaenviar();
        var nome = $("#title-list").val();


       
        //return;
         if (!contactos) {
            this.notificacao.sms("Precisa selecionar pelo menos um Contacto na Lista", 1);
            return;
        }
        if (nome.length <= 2) {
            this.notificacao.sms("Nome muito curto, pelo menos 3 caractéres", 1);
            return;
        }

        load.abrir();

        var form = new FormData();
        form.append("nome", nome);
        form.append("clientes", contactos);

        var settings = {
        "url": this.apiUrl + "/lista",
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
        var res = JSON.parse(response);
            //console.log(res.payload);
           
            if (res.ok) {
                location.href = "listas.html";             
            } else {
                notify.sms(res.payload, 1);
            }
        }).always(function (a) {
            //console.log(a);
            if (a.statusText) {
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }

}