class Sms {


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
            "url": this.apiUrl + "/mensagem/" + chave,
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
                var destin = JSON.parse(res.payload[0].destinatarios).length;

                $(".sms-enviadas").html(destin);
                
                

                //console.log((res.payload[0].listas).length);
                $("#qtd_contactos").html((res.payload[0].contactos).length);
                for (let i = 0; i < (res.payload[0].contactos).length; i++) {
                    //console.log(!(res.payload[0].contactos[0]));
                    if (!(res.payload[0].contactos[0])) {
                        $("#qtd_contactos").html("");
                        continue;
                    }
                    $(".contacto-remetente").html((res.payload[0].contactos).length);
                    $(`
                    <section class="request">
                    <button class="request-btn black">
                         <p> <a href="#?yds=${(res.payload[0].contactos[i].identificador)}"> ${(res.payload[0].contactos[i].nome)} </a> </p>
                    </button>
                    
                    </section>`).appendTo(".contactos");

                }
                for (let i = 0; i < (res.payload[0].listas).length; i++) {
                    //console.log(!(res.payload[0].listas[0]));
                    if (!(res.payload[0].listas[0])) {
                        $("#qtd_listas").html("");
                        continue;
                    }
                    $(".lista-remetente").html((res.payload[0].listas).length);
                    $("#qtd_listas").html((res.payload[0].listas).length);
                    $(`
                    <section class="request">
                    <button class="request-btn black">
                         <p> <a href="#?yds=${(res.payload[0].listas[i].identificador)}"> ${(res.payload[0].listas[i].nome)} </a> </p>
                    </button>
                    
                    </section>`).appendTo(".sms-list");

                }

                $("#remetentes").html(`<option>${res.payload[0].remetente} </option>`)

                $("#sms-box").html(res.payload[0].mensagem);

                console.log(res.payload[0].quando);
                $("#quando").html(res.payload[0].quando);
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

    todos() {
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();
        var settings = {
            "url": this.apiUrl + "/mensagem",
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

                $('.total-sms').text(res.payload.length + " SMS Enviadas");
                (res.payload).forEach(element => {
                    const sectionBox = $("<section></section").appendTo(".render");
                    sectionBox.addClass("request");

                    const buttonBox = $('<button></button>').appendTo(sectionBox);
                    buttonBox.addClass("request-btn");
                    buttonBox.addClass("black");

                    const paragragh = $("<p></p").appendTo(buttonBox);
                    const dataJson = $("<span></span")
                        .text(element.quando)
                        .appendTo(buttonBox);

                    const paragrahpLink = $("<a></a>")
                        .attr("href", "perfilSms.html?yds=" + element.identificador)
                        .text(element.mensagem.slice(0, 20))
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


    listasparaenviar() {
        var res = "";
        var listas = JSON.parse($("#store-listas").val());

        if (listas.length < 1) {
            return false;
        }

        listas.forEach(function (element, k) {
            res += element;
            if ((k + 1) < listas.length) {
                res += ",";
            }
        })
        return res;
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

    enviar() {

        var load = this.loader;
        var notify = this.notificacao;

        var form = new FormData();

        var listas = this.listasparaenviar();
        var contactos = this.contactosparaenviar();
        var remetente = $("#remetentes").val();
        var mensagem = $("#mensagem").val();

        if (!listas && !contactos) {
            this.notificacao.sms("Precisa selecionar pelo menos um Contacto ou uma Lista de envio", 1);
            return;
        }
        if (mensagem.length <= 8) {
            this.notificacao.sms("Mensagem muito curta, pelo menos 8 caractéres", 1);
            return;
        }
        if (remetente.length <= 2) {
            this.notificacao.sms("Não pode enviar mensagem sem remetente", 1);
            return;
        }


        form.append("listas", listas);
        form.append("contactos", contactos);
        form.append("remetente", remetente);
        form.append("mensagem", mensagem);

        var settings = {
            "url": this.apiUrl + "/mensagem",
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

        load.abrir();
        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {

                location.href = "sms.html"

            } else {
                notify.sms(res.payload, 1);
            }

        }).always(function (a) {
            if (a.statusText) {
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
    agendar() {

        var load = this.loader;
        var notify = this.notificacao;

        var form = new FormData();


        var listas = this.listasparaenviar();
        var contactos = this.contactosparaenviar();
        var remetente = $("#remetentes").val();
        var mensagem = $("#mensagem").val();

        var date = $("#date").val();
        var hour = $("#hour").val();

        console.log(date + hour);
        console.log(listas);
        console.log(contactos);
        console.log(remetente);
        console.log(mensagem);

        //return;
        if (!listas && !contactos) {
            this.notificacao.sms("Precisa selecionar pelo menos um Contacto ou uma Lista de envio", 1);
            return;
        }
        if (mensagem.length <= 8) {
            this.notificacao.sms("Mensagem muito curta, pelo menos 8 caractéres", 1);
            return;
        }
        if (remetente.length <= 2) {
            this.notificacao.sms("Não pode guardar mensagem sem remetente", 1);
            return;
        }


        form.append("listas", listas);
        form.append("contactos", contactos);
        form.append("remetente", remetente);
        form.append("mensagem", mensagem);
        form.append("date", date);
        form.append("hour", hour);

        var settings = {
            "url": this.apiUrl + "/smsprog",
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

        load.abrir();
        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {

                location.href = "smsProgramada.html?yds="+res.payload;

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



    todosProgramadas() {
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();
        var settings = {
            "url": this.apiUrl + "/smsprog",
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

                $('.total-sms').text(res.payload.length + " SMS programadas");
                (res.payload).forEach(element => {
                    const sectionBox = $("<section></section").appendTo(".render");
                    sectionBox.addClass("request");

                    const buttonBox = $('<button></button>').appendTo(sectionBox);
                    buttonBox.addClass("request-btn");
                    buttonBox.addClass("black");

                    const paragragh = $("<p></p").appendTo(buttonBox);
                    const dataJson = $("<span></span")
                        .text(element.quando)
                        .appendTo(buttonBox);

                    const paragrahpLink = $("<a></a>")
                        .attr("href", "smsProgramada.html?yds=" + element.identificador)
                        .text(element.mensagem.slice(0, 20))
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


    verProgramada(chave) {
        var esse = this;
        let clientesSelecionados = [];
        let listasSelecionadas = [];
        let listas = [];
        var load = this.loader;
        var notify = this.notificacao;
        load.abrir();
        var settings = {
            "url": this.apiUrl + "/smsprog/" + chave,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "token": token
            },
        };

        $.ajax(settings).done(function (response) {
            ////console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {
                
                var destin = JSON.parse(res.payload[0].destinatarios).length;
                $("#qtd_contactos").html((res.payload[0].contactos).length);
                $("#qtd_listas").html((res.payload[0].listas).length);

                $(".sms-enviadas").html(destin);
                if((res.payload[0].listas[0])) {                     
                    $(".lista-remetente").html((res.payload[0].listas).length);
                }
                if((res.payload[0].contactos[0])) {                     
                    $(".contacto-remetente").html((res.payload[0].contactos).length);
                }
                
                $("#hour").val((res.payload[0].hora));
                $("#date").val((res.payload[0].data));
                //console.log((res.payload[0].contactos));
                for (let i = 0; i < (res.payload[0].contactos).length; i++) {
                    clientesSelecionados[(res.payload[0].contactos[i]['identificador'])] = ((res.payload[0].contactos[i]['identificador']))
                }
                esse.clientesProgramada(clientesSelecionados);
                //console.log(clientes);
                //--------
                for (let i = 0; i < (res.payload[0].listas).length; i++) {
                    listasSelecionadas[(res.payload[0].listas[i]['identificador'])] = ((res.payload[0].listas[i]['identificador']))
                }
                esse.listasProgramada(listasSelecionadas);

                $("#remetentes").prepend(`<option selected>${res.payload[0].remetente} </option>`)

                $("#sms-box").html(res.payload[0].mensagem);

                //console.log(res.payload[0].quando);
                $("#quando").html(res.payload[0].quando);
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

    //------------
    clientesProgramada(clientesSelecionados) {
        var clientes = [];
        var clientesSeletos = [];
        if(clientesSelecionados[0]){
            clientesSeletos = clientesSelecionados;
            clientes = clientesSeletos;
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
            ////console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {
                
                for (let i = 0; i < (res.payload).length; i++) {
                        var id = (res.payload[i].identificador);
                        if(clientesSelecionados[id]){
                            clientes.push(id)
                            const sectionBox = $(`
                            <section class="request">
                            <button class="request-btn black">
                                <p> <a href="#?yds=${(res.payload[i].identificador)}"> ${(res.payload[i].nome)} </a> </p>
                                <input type="checkbox" class="sms-checkbox"  style="width:22px;height:22px;margin-right:4px" checked></input>
                            </button>
                            
                            </section>`).appendTo(".contactos");
                        }else{
                            const sectionBox = $(`
                            <section class="request">
                            <button class="request-btn black">
                                <p> <a href="#?yds=${(res.payload[i].identificador)}"> ${(res.payload[i].nome)} </a> </p>
                                <input type="checkbox" class="sms-checkbox"  style="width:22px;height:22px;margin-right:4px"></input>
                            </button>
                            
                            </section>`).appendTo(".contactos");
                        }

                    
                    

                }
                
                $("#store-contactos")[0].value = (JSON.stringify(clientesSeletos));
                $("#qtd_contactos").html((clientes).length);
                $('.sms-checkbox').on('change', function () {

                    var clienteUrl = $(this).closest(".request").find("p a").attr('href')
                    let clienteId = clienteUrl.split("?")[1].split("=")[1];

                    if ($(this).prop("checked")) {
                        clientes.push(clienteId)
                        $("#store-contactos")[0].value = (JSON.stringify(clientes));
                        
                        //console.log(`O checkbox está marcado e a sua URL e: ${clienteId}`);
                        //console.log(clientes)

                    }
                    else {

                        for (let i = 0; i <= clientes.length; i++) {
                            if (clientes[i] == clienteId) {
                                clientes.splice(i, 1);
                            }
                        }
                        //console.log(`O checkbox foi desmarcado e a sua URL e: ${clienteId}`);
                        $("#store-contactos")[0].value = (JSON.stringify(clientes));
                        
                        //console.log(clientes)
                    }

                    //console.warn(clientes.length);
                    $("#qtd_contactos").html((clientes).length);
                    
                    


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
    clientes() {
        let clientes = [];
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
            //console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {




                for (let i = 0; i < (res.payload).length; i++) {

                    const sectionBox = $(`
                    <section class="request">
                    <button class="request-btn black">
                         <p> <a href="#?yds=${(res.payload[i].identificador)}"> ${(res.payload[i].nome)} </a> </p>
                         <input type="checkbox" class="sms-checkbox"  style="width:22px;height:22px;margin-right:4px"></input>
                    </button>
                    
                    </section>`).appendTo(".contactos");

                }


                $('.sms-checkbox').on('change', function () {

                    var clienteUrl = $(this).closest(".request").find("p a").attr('href')
                    let clienteId = clienteUrl.split("?")[1].split("=")[1];

                    if ($(this).prop("checked")) {
                        clientes.push(clienteId)
                        $("#store-contactos")[0].value = (JSON.stringify(clientes));
                        //console.log(`O checkbox está marcado e a sua URL e: ${clienteId}`);
                        //console.log(clientes)

                    }
                    else {

                        for (let i = 0; i <= clientes.length; i++) {
                            if (clientes[i] == clienteId) {
                                clientes.splice(i, 1);
                            }
                        }
                        //console.log(`O checkbox foi desmarcado e a sua URL e: ${clienteId}`);
                        $("#store-contactos")[0].value = (JSON.stringify(clientes));
                        //console.log(clientes)
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
    //------------
    listasProgramada(listasSelecionadas) {
        
        var listasSeletas = [];
        var destinatarios = [];
        if(listasSelecionadas[0]){
            listasSeletas = listasSelecionadas;
            destinatarios = listasSeletas;
        }
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
            ////console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {



                

                for (let i = 0; i < (res.payload).length; i++) {
                        var id = (res.payload[i].identificador);
                        if(listasSeletas[id]){
                            destinatarios.push(id)
                            const sectionBox = $(`
                            <section class="request">
                            <button class="request-btn black">
                                <p> <a href="#?yds=${(res.payload[i].identificador)}"> ${(res.payload[i].nome)} </a> </p>
                                <input type="checkbox" class="list-checkbox"  style="width:22px;height:22px;margin-right:4px" checked></input>
                            </button>
                            
                            </section>`).appendTo(".sms-list");
                        }else{
                            const sectionBox = $(`
                            <section class="request">
                            <button class="request-btn black">
                                <p> <a href="#?yds=${(res.payload[i].identificador)}"> ${(res.payload[i].nome)} </a> </p>
                                <input type="checkbox" class="list-checkbox"  style="width:22px;height:22px;margin-right:4px"></input>
                            </button>
                            
                            </section>`).appendTo(".sms-list");
                        }
                        
                    
                    

                }
                $("#store-listas")[0].value = (JSON.stringify(listasSeletas));
                $("#qtd_listas").html((listasSeletas).length);
                $('.list-checkbox').on('change', function () {

                    var destinatarioUrl = $(this).closest(".request").find("p a").attr('href')
                    let destinatarioId = destinatarioUrl.split("?")[1].split("=")[1];

                    if ($(this).prop("checked")) {
                        destinatarios.push(destinatarioId)
                        $("#store-listas")[0].value = (JSON.stringify(destinatarios));
                        //console.log(`O checkbox está marcado e a sua URL e: ${destinatarioId}`);
                        //console.log(destinatarios)

                    }
                    else {

                        for (let i = 0; i <= destinatarios.length; i++) {
                            if (destinatarios[i] == destinatarioId) {
                                destinatarios.splice(i, 1);
                            }
                        }
                        //console.log(`O checkbox foi desmarcado e a sua URL e: ${destinatarioId}`);
                        $("#store-listas")[0].value = (JSON.stringify(destinatarios));
                        //console.log(destinatarios)
                    }
                    $("#qtd_listas").html((listasSeletas).length);


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
    listas() {
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



                var destinatarios = []

                for (let i = 0; i < res.payload.length; i++) {

                    const sectionBox = $(`
                    <section class="request">
                    <button class="request-btn black">
                         <p> <a href="#?yds=${(res.payload[i].identificador)}"> ${(res.payload[i].nome)} </a> </p>
                         <input type="checkbox" class="list-checkbox" style="width:22px;height:22px;margin-right:4px"></input>
                    </button>
                    
                    </section>`).appendTo(".sms-list");


                }

                $('.list-checkbox').on('change', function () {

                    var destinatarioUrl = $(this).closest(".request").find("p a").attr('href')
                    let destinatarioId = destinatarioUrl.split("?")[1].split("=")[1];

                    if ($(this).prop("checked")) {
                        destinatarios.push(destinatarioId)
                        $("#store-listas")[0].value = (JSON.stringify(destinatarios));
                        //console.log(`O checkbox está marcado e a sua URL e: ${destinatarioId}`);
                        //console.log(destinatarios)

                    }
                    else {

                        for (let i = 0; i <= destinatarios.length; i++) {
                            if (destinatarios[i] == destinatarioId) {
                                destinatarios.splice(i, 1);
                            }
                        }
                        //console.log(`O checkbox foi desmarcado e a sua URL e: ${destinatarioId}`);
                        $("#store-listas")[0].value = (JSON.stringify(destinatarios));
                        //console.log(destinatarios)
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



    //ALTERAR PROGRAMADO
    alterarProgramado() {

        var load = this.loader;
        var notify = this.notificacao;

        var form = new FormData();

        var identificador = (location.search).split("=")[1];
        var listas = this.listasparaenviar();
        var contactos = this.contactosparaenviar();
        var remetente = $("#remetentes").val();
        var mensagem = $("#sms-box").val();

        var date = $("#date").val();
        var hour = $("#hour").val();

       
        //return;
         if (!listas && !contactos) {
            this.notificacao.sms("Precisa selecionar pelo menos um Contacto ou uma Lista de envio", 1);
            return;
        }
        if (mensagem.length <= 8) {
            this.notificacao.sms("Mensagem muito curta, pelo menos 8 caractéres", 1);
            return;
        }
        if (remetente.length <= 2) {
            this.notificacao.sms("Não pode guardar mensagem sem remetente", 1);
            return;
        }


        form.append("identificador", identificador);
        form.append("listas", listas);
        form.append("contactos", contactos);
        form.append("remetente", remetente);
        form.append("mensagem", mensagem);
        form.append("date", date);
        form.append("hour", hour);

        var settings = {
            "url": this.apiUrl + "/smsprog/update",
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

        load.abrir();
        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {

                location.href = "smsProgramada.html?yds="+res.payload;

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

    //ENVIAR AGORA
    enviarAgora() {
        var esse = this;
        var load = this.loader;
        var notify = this.notificacao;
        var apagar = this.apagarProgramada;

        var form = new FormData();

        var listas = this.listasparaenviar();
        var contactos = this.contactosparaenviar();
        var remetente = $("#remetentes").val();
        var mensagem = $("#sms-box").val();

        if (!listas && !contactos) {
            this.notificacao.sms("Precisa selecionar pelo menos um Contacto ou uma Lista de envio", 1);
            return;
        }
        if (mensagem.length <= 8) {
            this.notificacao.sms("Mensagem muito curta, pelo menos 8 caractéres", 1);
            return;
        }
        if (remetente.length <= 2) {
            this.notificacao.sms("Não pode enviar mensagem sem remetente", 1);
            return;
        }


        form.append("listas", listas);
        form.append("contactos", contactos);
        form.append("remetente", remetente);
        form.append("mensagem", mensagem);

        var settings = {
            "url": this.apiUrl + "/mensagem",
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

        load.abrir();
        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {

                esse.apagarProgramada();

            } else {
                notify.sms(res.payload, 1);
            }

        }).always(function (a) {
            if (a.statusText) {
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }   
    
    //APAGAR
    apagarProgramada() {

        var load = this.loader;
        var notify = this.notificacao;

        var form = new FormData();

        var identificador = (location.search).split("=")[1];

        form.append("identificador", identificador);

        var settings = {
            "url": this.apiUrl + "/smsprog/apagar",
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

        load.abrir();
        $.ajax(settings).done(function (response) {
            //console.log(response);
            var res = JSON.parse(response);
            if (res.ok) {

                location.href = "agendadas.html"

            } else {
                notify.sms(res.payload, 1);
            }

        }).always(function (a) {
            if (a.statusText) {
                notify.sms("Erro, verifique a sua rede", 1);
            }
            load.fechar();
        });
    }
}