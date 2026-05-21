const menu = document.getElementById("menuAcessibilidade");

function toggleMenu(){
    menu.classList.toggle("active");
}

/* GUIA */

const guide = document.getElementById("reading-guide");

function toggleGuide(){

    if(guide.style.display === "block"){
        guide.style.display = "none";
    }else{
        guide.style.display = "block";
    }
}

document.addEventListener("mousemove", (e)=>{

    guide.style.top = e.clientY + "px";

});