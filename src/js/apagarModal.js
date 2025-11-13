//modal
const myButtonModalApagar = document.querySelector(".modal-apagar");
const myModalApagar = document.getElementById("myModal-apagar");
const myOverlayApagar = document.getElementById("myOverlay-apagar");
const closeBtnApagar = document.querySelector(".close-apagar");

myButtonModalApagar.addEventListener("click", function() {
  myModalApagar.style.display = "block";
  myOverlayApagar.style.display = "block";
});

myOverlayApagar.addEventListener("click", function() {
  myModalApagar.style.display = "none";
  myOverlayApagar.style.display = "none";
});

closeBtnApagar.addEventListener("click", function() {
  myModalApagar.style.display = "none";
  myOverlayApagar.style.display = "none";
 });


