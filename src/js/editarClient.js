
const editarEbookBtn = document.querySelector('#editClient-btn')


const myPopup = document.getElementById("myPopup");
const closePopup = document.querySelector(".close-pop-up");
const myPopupText = document.querySelector('.popup p')


editarEbookBtn.addEventListener('click',function(){
    this.classList.toggle('active');
   editarEbookBtn.style.display = "none";

    if(editarEbookBtn.className.match("active")){
    
        myPopup.style.display = "block";
        myPopupText.textContent = 'Modo de edição activo'
        myPopup.style.backgroundColor = '#00f0ff';
        setTimeout(function() {
            myPopup.style.top = "10px";
        }, 100);
        setTimeout(function() {
            myPopup.style.top = "-50px";
            setTimeout(function() {
            myPopup.style.display = "none";
            }, 500);
        }, 3000);

    }
  

});



closePopup.addEventListener("click", function() {
  myPopup.style.top = "-50px";
  setTimeout(function() {
    myPopup.style.display = "none";
  }, 500);
});

window.addEventListener("click", function(event) {
  if (event.target === myPopup) {
    myPopup.style.top = "-50px";
    setTimeout(function() {
      myPopup.style.display = "none";
    }, 500);
  }
});

