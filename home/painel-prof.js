const usuario = JSON.parse(localStorage.getItem("usuario"));

// Se não está logado ou não é professor/responsável, volta pro login
if (!usuario || usuario.tipo === "aluno") {
    window.location.href = "index.html";
}

// ── Avatares por tipo ──
const avatares = {
    "professor": "👨‍🏫",
    "responsavel": "👨‍👩‍👧",
    "coordenador": "🏫",
    "terapeuta": "🩺"
};

// ── Preenche hero ──
document.getElementById("hero-nome").textContent = "Olá, " + usuario.nome + "!";
document.getElementById("tipo-texto").textContent = usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1);

const avatar = avatares[usuario.tipo] || "👤";
document.getElementById("hero-avatar").textContent = avatar;

// ── Cores dos avatares dos cards ──
const avatarCores = ["av-blue", "av-green", "av-purple", "av-red"];
let todosAlunos = [];

// ── Busca alunos do servidor ──
async function carregarAlunos() {
    try {
        const resposta = await fetch(`http://localhost:3000/alunos/${usuario.id}`);
        const dados = await resposta.json();

        if (resposta.ok) {
            todosAlunos = dados.alunos;
            renderizarCards(todosAlunos);
            atualizarStats(todosAlunos);
        } else {
            document.getElementById("cards-container").innerHTML = `
                <div class="empty">
                    <i class="ti ti-mood-sad"></i>
                    <p>Erro ao carregar alunos.</p>
                </div>`;
        }
    } catch (erro) {
        document.getElementById("cards-container").innerHTML = `
            <div class="empty">
                <i class="ti ti-wifi-off"></i>
                <p>Sem conexão com o servidor.</p>
            </div>`;
    }
}

// ── Renderiza os cards ──
function renderizarCards(alunos) {
    const container = document.getElementById("cards-container");

    if (alunos.length === 0) {
        container.innerHTML = `
            <div class="empty">
                <i class="ti ti-user-off"></i>
                <p>Nenhum aluno encontrado.</p>
            </div>`;
        return;
    }

    container.innerHTML = alunos.map((aluno, i) => {
        const cor = avatarCores[i % avatarCores.length];
        const condicao = aluno.condicao || "Nenhuma";
        const badgeClass = "badge-" + condicao.toLowerCase().replace("ã", "a").replace("í", "i");
        const progresso = aluno.progresso || 0;

        return `
        <div class="aluno-card">
            <div class="card-top">
                <div class="card-avatar ${cor}">🧒</div>
                <div>
                    <div class="card-nome">${aluno.nome}</div>
                    <div class="card-email">${aluno.email}</div>
                </div>
            </div>

            <span class="badge ${badgeClass}">
                ${iconeCondicao(condicao)} ${condicao}
            </span>

            <div class="progress-label">
                <span>Progresso</span>
                <span>${progresso}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progresso}%"></div>
            </div>

            <div class="card-stats">
                <div class="mini-stat">
                    <div class="mini-num">⭐ ${aluno.nivel || 1}</div>
                    <div class="mini-label">Nível</div>
                </div>
                <div class="mini-stat">
                    <div class="mini-num">🏆 ${aluno.pontos || 0}</div>
                    <div class="mini-label">Pontos</div>
                </div>
            </div>
        </div>`;
    }).join("");
}

// ── Ícones por condição ──
function iconeCondicao(condicao) {
    const icons = {
        "Nenhuma": "✅",
        "Visual": "👁️",
        "Auditiva": "👂",
        "Cognitiva": "🧠",
        "Física": "♿",
        "Outro": "⭐"
    };
    return icons[condicao] || "⭐";
}

// ── Atualiza stats do hero ──
function atualizarStats(alunos) {
    document.getElementById("stat-total").textContent = alunos.length;

    if (alunos.length > 0) {
        const media = Math.round(
            alunos.reduce((acc, a) => acc + (a.progresso || 0), 0) / alunos.length
        );
        document.getElementById("stat-media").textContent = media + "%";
    }
}

// ── Filtro de busca e condição ──
function filtrar() {
    const busca = document.getElementById("busca").value.toLowerCase();
    const condicao = document.getElementById("filtro-condicao").value;

    const filtrados = todosAlunos.filter(a => {
        const nomeBate = a.nome.toLowerCase().includes(busca);
        const condicaoBate = condicao === "" || (a.condicao || "Nenhuma") === condicao;
        return nomeBate && condicaoBate;
    });

    renderizarCards(filtrados);
}

// ── MODAL - Adicionar aluno ──
function abrirModal() {
    document.getElementById("modalAdicionar").classList.add("active");
    document.getElementById("emailAluno").value = "";
    limparAlerta();
}

function fecharModal() {
    document.getElementById("modalAdicionar").classList.remove("active");
}

// ── Adicionar aluno ──
async function confirmarAdicionar() {
    const email = document.getElementById("emailAluno").value.trim();

    if (!email) {
        mostrarAlerta("Por favor, digite um email válido", "error");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/adicionar-aluno", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                professorId: usuario.id,
                emailAluno: email
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mostrarAlerta("✅ Aluno adicionado com sucesso!", "success");
            fecharModal();
            carregarAlunos(); // Recarrega a lista
        } else {
            mostrarAlerta(dados.mensagem || "Erro ao adicionar aluno", "error");
        }
    } catch (erro) {
        mostrarAlerta("Erro ao conectar ao servidor", "error");
    }
}

// ── Alerta ──
function mostrarAlerta(mensagem, tipo) {
    const alerta = document.getElementById("alerta");
    alerta.textContent = mensagem;
    alerta.className = "alert " + tipo;

    if (tipo === "success") {
        setTimeout(() => limparAlerta(), 3000);
    }
}

function limparAlerta() {
    document.getElementById("alerta").className = "alert";
}

// ── Fechar modal ao clicar fora ──
document.getElementById("modalAdicionar").addEventListener("click", (e) => {
    if (e.target.id === "modalAdicionar") {
        fecharModal();
    }
});

// ── Sair ──
function sair() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

// ── Inicia ──
carregarAlunos();