const usuario = JSON.parse(localStorage.getItem("usuario"));

document.getElementById("nome").innerText =
    "Olá, " + usuario.nome;

document.getElementById("nivel").innerText =
    "Nível: " + usuario.nivel;

document.getElementById("pontos").innerText =
    "Pontos: " + usuario.pontos;

document.getElementById("progresso").innerText =
    "Progresso: " + usuario.progresso + "%";