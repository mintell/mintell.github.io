var corrida = false;
const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
}

const vaiTela = (route) => {
    window.history.pushState({}, "", route);
    handleLocation();
}

const prefixed = "SimTaxi/";
const routes = {
    404: "/src/pages/404.html",
    "/": "/src/pages/inicio.html",
    "/home": "/src/pages/home.html",
    "/reclamacao": "/src/pages/reclamacao.html",
}

const handleLocation = async () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    
    const route = routes[path] || routes[404];
    const html = await fetch(route).then(function(data){
        var res = data.text();
        res.then(function(ui){
            document.querySelector(".corpo").innerHTML = ui;
      

        
            if (hash == "") {
                
            }
            if (hash == "#chamarotaxi") {
                
            }

            if (path == "/home") {
                loader.abrir();
                
                setTimeout(function () {

                    

                    loader.fechar();
                }, 1000);
            }
        })
    })
    

}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();