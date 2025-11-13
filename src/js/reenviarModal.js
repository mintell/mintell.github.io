//modal
const myButtonModalReenviar = document.querySelector(".modal-reenviar");
const myModalReenviar = document.getElementById("myModal-reenviar");
const myOverlayReenviar = document.getElementById("myOverlay-reenviar");
const closeBtnReenviar = document.querySelector(".close-reenviar");

myButtonModalReenviar.addEventListener("click", function() {
  myModalReenviar.style.display = "block";
  myOverlayReenviar.style.display = "block";
});

myOverlayReenviar.addEventListener("click", function() {
  myModalReenviar.style.display = "none";
  myOverlayReenviar.style.display = "none";
});

closeBtnReenviar.addEventListener("click", function() {
  myModalReenviar.style.display = "none";
  myOverlayReenviar.style.display = "none";
 });


