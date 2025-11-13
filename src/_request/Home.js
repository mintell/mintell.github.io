class Home {


    constructor(jquery, loader, notificacao) {
        this.jquery = jquery;
        this.apiUrl = "https://api.mintel.ao";
        this.loader = loader;
        this.notificacao = notificacao;
    }

    //
    dados() {
        var cred = localStorage.getItem("creditos");
        if(cred){
            document.querySelector(".creditos ul").innerHTML = `<li><p>${(cred)} sms</p></li>`;
        }
        
         
        var load = this.loader;
        var notify = this.notificacao;
     
        load.abrir();

        setTimeout(function(){
            load.fechar();
        }, 700)

        var token = localStorage.getItem("token");
        var url = this.apiUrl;
        var settings = {
            "url": this.apiUrl + "/usuario/dados",
            "method": "GET",
            "timeout": 0,
            "headers": {
                "token": token
            },
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false
        };

        $.ajax(settings).done(function (response) {
            var res = JSON.parse(response);
            localStorage.setItem("nome", (res.payload).nome);
            localStorage.setItem("genero", (res.payload).genero);
            localStorage.setItem("telefone", (res.payload).telefone);
            localStorage.setItem("email", (res.payload).email);
            localStorage.setItem("secretkey", (res.payload).secretkey);
            localStorage.setItem("authid", (res.payload).authid);
            localStorage.setItem("pacote", (res.payload).pacote);
            localStorage.setItem("desde", (res.payload).desde);
            localStorage.setItem("ate", (res.payload).ate);
            localStorage.setItem("tempo", (res.payload).tempo);

            document.querySelector(".licenca").innerHTML = `<p>LICENÇA: </p><p class="licenca-value">VALIDA ATE
                        ${((res.payload).ate)}</p>`;




            
            //CREDITOS
            var form = new FormData();
            form.append("authid", (res.payload).authid);
            form.append("secretkey", (res.payload).secretkey);

            var settings = {
            "url": url+"/usuario/creditosms",
            "method": "GET",
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
            localStorage.setItem("creditos",JSON.stringify((res.payload)));
             document.querySelector(".creditos ul").innerHTML = `<li><p>${(res.payload)} sms</p></li>`;
            });


            //REMETENTES
            var form = new FormData();
            form.append("authid", (res.payload).authid);
            form.append("secretkey", (res.payload).secretkey);

            var settings = {
                "url": url + "/usuario/remetente",
                "method": "GET",
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
                var html = "";
                localStorage.setItem("remetentes",JSON.stringify((res.payload)));
                (res.payload).forEach(element => {
                    html += `<li><a href="#">${(element.name)}</a></li>`;
                });
                
                document.querySelector(".remetentes div").innerHTML = `
                        <ul>
                            ${html}
                        </ul>`;

            }).always(function(a){
                if(a.statusText){
                    notify.sms("Erro, verifique a sua rede", 1);
                }
            });



        }).always(function(a){
            if(a.statusText){
                notify.sms("Erro, verifique a sua rede", 1);
            }
        });
    }


   


}