const menu = document.getElementById("menuAcessibilidade");

function toggleMenu() {
    menu.classList.toggle("active");
}

/* GUIA DE LEITURA */
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

/* ── LOGIN ALUNO ── */
const formLoginAluno = document.getElementById("form-login-aluno");

formLoginAluno.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("aluno-email").value;
    const senha = document.getElementById("aluno-senha").value;

    // Pega os chips selecionados
    const chipsSelecionados = [...document.querySelectorAll(".pcd-chip.sel")]
        .map(chip => chip.textContent.trim());
    const condicao = chipsSelecionados.length > 0 ? chipsSelecionados[0] : "Nenhuma";

    try {
        const resposta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            // Salva o usuario com a condição selecionada
            const usuario = { ...dados.usuario, condicao };
            localStorage.setItem("usuario", JSON.stringify(usuario));

            // Atualiza a condição no servidor também
            if (condicao !== "Nenhuma") {
                await fetch(`http://localhost:3000/atualizar-condicao`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: dados.usuario.id, condicao })
                }).catch(() => { }); // silencia erro
            }

            window.location.href = "painel.html";
        } else {
            alert(dados.mensagem);
        }
    } catch (erro) {
        alert("Erro ao conectar ao servidor");
    }
});

/* ── SWITCH TABS ── */
function switchTab(tab) {
    document.getElementById('panel-aluno').classList.toggle('active', tab === 'aluno');
    document.getElementById('panel-resp').classList.toggle('active', tab === 'resp');
    document.getElementById('tab-aluno').classList.toggle('active', tab === 'aluno');
    document.getElementById('tab-resp').classList.toggle('active', tab === 'resp');
    document.getElementById('tab-aluno').setAttribute('aria-selected', tab === 'aluno');
    document.getElementById('tab-resp').setAttribute('aria-selected', tab === 'resp');
}

function toggleChip(el) {
    // Só permite 1 chip selecionado por vez
    document.querySelectorAll(".pcd-chip").forEach(c => {
        if (c !== el) c.classList.remove("sel");
    });
    el.classList.toggle("sel");
}

/* ── LOGIN PROFESSOR / RESPONSÁVEL / COORDENADOR / TERAPEUTA ── */
const formLoginProf = document.getElementById("form-login-prof");

formLoginProf.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("resp-email").value;
    const senha = document.getElementById("resp-senha").value;
    const tipoSelect = document.getElementById("resp-tipo").value;

    // Mapeia o texto do select para o tipo interno
    const tipoMap = {
        "Professor(a)": "professor",
        "Responsável / Familiar": "responsavel",
        "Coordenador(a)": "coordenador",
        "Terapeuta / Especialista": "terapeuta"
    };

    // Redirecionamento por tipo
    const redirecionaMap = {
        "professor": "painel-prof.html",
        "responsavel": "painel-responsavel.html",
        "coordenador": "painel-coordenador.html",
        "terapeuta": "painel-prof.html" // terapeuta usa painel similar ao professor
    };

    try {
        const resposta = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            const tipoInterno = tipoMap[tipoSelect] || dados.usuario.tipo;
            const usuario = { ...dados.usuario, tipo: tipoInterno };
            localStorage.setItem("usuario", JSON.stringify(usuario));

            const destino = redirecionaMap[tipoInterno] || "painel-prof.html";
            window.location.href = destino;
        } else {
            alert(dados.mensagem);
        }
    } catch (erro) {
        alert("Erro ao conectar ao servidor");
    }
});

/* ── ACESSIBILIDADE ── */
let fontSize = 16;

function increaseFont() {
    fontSize += 2;
    document.body.style.fontSize = fontSize + "px";
}

function decreaseFont() {
    fontSize -= 2;
    document.body.style.fontSize = fontSize + "px";
}

function toggleContrast() {
    document.body.classList.toggle("high-contrast");
}

function toggleDyslexia() {
    document.body.classList.toggle("dyslexia");
}

let zoom = 1;

function zoomPage() {
    zoom += 0.1;
    document.body.style.zoom = zoom;
}

function speakText() {
    const text = document.body.innerText;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "pt-BR";
    window.speechSynthesis.speak(speech);
}

function toggleTDAH() {
    document.body.classList.toggle("tdah-mode");
}