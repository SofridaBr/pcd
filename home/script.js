

const menu = document.getElementById("menuAcessibilidade");

function toggleMenu() {
    menu.classList.toggle("active");
}

/* GUIA */

const guide = document.getElementById("reading-guide");

function toggleGuide() {

    if (guide.style.display === "block") {
        guide.style.display = "none";
    } else {
        guide.style.display = "block";
    }
}

document.addEventListener("mousemove", (e) => {

    guide.style.top = e.clientY + "px";

});


const formLoginAluno = document.getElementById("form-login-aluno");

console.log("SCRIPT FUNCIONANDO");
console.log(formLoginAluno);

formLoginAluno.addEventListener("submit", async (e) => {

    e.preventDefault();

    console.log("CLICOU NO BOTÃO");

    const email = document.getElementById("aluno-email").value;

    const senha = document.getElementById("aluno-senha").value;

    console.log("ENVIANDO:", email, senha);

    try {

        const resposta = await fetch("http://localhost:3000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                senha
            })

        });

        const dados = await resposta.json();

        if (resposta.ok) {

            alert("Login realizado!");

            localStorage.setItem("usuario", JSON.stringify(dados.usuario));

            window.location.href = "painel.html";

        } else {

            alert(dados.mensagem);

        }

    } catch (erro) {

        alert("Erro ao conectar ao servidor");


    }

});



function switchTab(tab) {
    document.getElementById('panel-aluno').classList.toggle('active', tab === 'aluno');
    document.getElementById('panel-resp').classList.toggle('active', tab === 'resp');
    document.getElementById('tab-aluno').classList.toggle('active', tab === 'aluno');
    document.getElementById('tab-resp').classList.toggle('active', tab === 'resp');
    document.getElementById('tab-aluno').setAttribute('aria-selected', tab === 'aluno');
    document.getElementById('tab-resp').setAttribute('aria-selected', tab === 'resp');
}

function toggleChip(el) {
    el.classList.toggle('sel');
}

/* MENU ACESSIBILIDADE */


/* FONTE */

let fontSize = 16;

function increaseFont() {
    fontSize += 2;
    document.body.style.fontSize = fontSize + "px";
}

function decreaseFont() {
    fontSize -= 2;
    document.body.style.fontSize = fontSize + "px";
}

/* CONTRASTE */

function toggleContrast() {
    document.body.classList.toggle("high-contrast");
}

/* DISLEXIA */

function toggleDyslexia() {
    document.body.classList.toggle("dyslexia");
}

/* ZOOM */

let zoom = 1;

function zoomPage() {
    zoom += 0.1;
    document.body.style.zoom = zoom;
}

/* LEITOR DE TEXTO */

function speakText() {

    const text = document.body.innerText;

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "pt-BR";

    window.speechSynthesis.speak(speech);
}

/* MODO TDAH */

function toggleTDAH() {
    document.body.classList.toggle("tdah-mode");
}

/* GUIA DE LEITURA */

const formLoginProf = document.getElementById("form-login-prof");

formLoginProf.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("resp-email").value;
    const senha = document.getElementById("resp-senha").value;

    try {
        const resposta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert("Login realizado!");
            localStorage.setItem("usuario", JSON.stringify(dados.usuario));
            window.location.href = "painel.html";
        } else {
            alert(dados.mensagem);
        }

    } catch (erro) {
        alert("Erro ao conectar ao servidor");
    }
});

