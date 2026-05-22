const usuario = JSON.parse(localStorage.getItem("usuario"));


if (!usuario || !usuario.nome) {
    window.location.href = "index.html";
}

document.getElementById("nome").innerText = "Olá, " + usuario.nome;
document.getElementById("nivel").innerText = "Nível: " + usuario.nivel;
document.getElementById("pontos").innerText = "Pontos: " + usuario.pontos;
document.getElementById("progresso").innerText = "Progresso: " + usuario.progresso + "%";