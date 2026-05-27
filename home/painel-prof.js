const usuario = JSON.parse(localStorage.getItem("usuario"));

// ── VERIFICAÇÃO DE PERMISSÃO ──
// Apenas professor, coordenador e apoio podem acessar esta página.
// Aluno e responsável são bloqueados.
const tiposPermitidosProf = ["professor", "coordenador", "apoio"];

if (!usuario) {
    window.location.href = "index.html";
} else if (usuario.tipo === "aluno") {
    // Aluno tenta acessar o painel do professor
    localStorage.setItem("_acesso_negado",
        JSON.stringify({
            motivo: `Sua conta é de aluno. Esta área é exclusiva para educadores.`,
            destino: "painel.html",
            label:   "Ir para meu painel de aluno"
        })
    );
    window.location.href = "acesso-negado.html";
} else if (usuario.tipo === "responsavel") {
    // Responsável redireciona para o painel correto
    window.location.href = "painel-responsavel.html";
} else if (!tiposPermitidosProf.includes(usuario.tipo)) {
    window.location.href = "index.html";
}

// ── Avatares por tipo ──
const avatares = {
    professor:   "👨‍🏫",
    responsavel: "👨‍👩‍👧",
    coordenador: "🏫",
    apoio:       "🩺"
};

// ── Preenche hero ──
document.getElementById("hero-nome").textContent = "Olá, " + usuario.nome + "!";

const nomesTipo = {
    professor:   "Professor(a)",
    coordenador: "Coordenador(a)",
    apoio:       "Apoio / Cuidador"
};
document.getElementById("tipo-texto").textContent = nomesTipo[usuario.tipo] || usuario.tipo;

const avatar = avatares[usuario.tipo] || "👤";
document.getElementById("hero-avatar").textContent = avatar;

// ── Cores dos avatares dos cards ──
const avatarCores = ["av-blue", "av-green", "av-purple", "av-red"];
let todosAlunos = [];

// ── Busca alunos do servidor ──
async function carregarAlunos() {
    try {
        const resposta = await fetch(`http://localhost:3000/alunos/${usuario.id}`);
        const dados    = await resposta.json();

        if (resposta.ok) {
            todosAlunos = dados.alunos;
            renderizarCards(todosAlunos);
            atualizarStats(todosAlunos);
        } else {
            usarDadosDemo();
        }
    } catch (_) {
        usarDadosDemo();
    }
}

function usarDadosDemo() {
    const demo = [
        { id: 1, nome: "Ana Paula",    email: "ana@escola.com",   condicao: "Visual",    nivel: 3, pontos: 320, progresso: 65 },
        { id: 2, nome: "Carlos Souza", email: "carlos@escola.com", condicao: "Cognitiva", nivel: 2, pontos: 180, progresso: 38 },
        { id: 3, nome: "Bruna Melo",   email: "bruna@escola.com",  condicao: "Auditiva",  nivel: 4, pontos: 510, progresso: 72 }
    ];
    todosAlunos = demo;
    renderizarCards(demo);
    atualizarStats(demo);

    // Avisa que é modo demo
    const container = document.getElementById("cards-container");
    const aviso = document.createElement("div");
    aviso.style.cssText = "grid-column:1/-1;background:#FFF9C4;border-radius:12px;padding:12px 16px;color:#F57F17;font-weight:700;font-size:13px;margin-bottom:8px;";
    aviso.textContent = "⚠️ Servidor offline — exibindo dados de exemplo.";
    container.prepend(aviso);
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
        const cor        = avatarCores[i % avatarCores.length];
        const condicao   = aluno.condicao || "Nenhuma";
        const badgeClass = "badge-" + condicao.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const progresso  = aluno.progresso || 0;

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
        "Nenhuma":  "✅",
        "Visual":   "👁️",
        "Auditiva": "👂",
        "Cognitiva":"🧠",
        "Física":   "♿",
        "Outro":    "⭐"
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
    const busca    = document.getElementById("busca").value.toLowerCase();
    const condicao = document.getElementById("filtro-condicao").value;

    const filtrados = todosAlunos.filter(a => {
        const nomeBate     = a.nome.toLowerCase().includes(busca);
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
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ professorId: usuario.id, emailAluno: email })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mostrarAlerta("✅ Aluno adicionado com sucesso!", "success");
            setTimeout(() => { fecharModal(); carregarAlunos(); }, 1500);
        } else {
            mostrarAlerta(dados.mensagem || "Erro ao adicionar aluno", "error");
        }
    } catch (_) {
        mostrarAlerta("Erro ao conectar ao servidor", "error");
    }
}

// ── Alerta ──
function mostrarAlerta(mensagem, tipo) {
    const alerta = document.getElementById("alerta");
    alerta.textContent = mensagem;
    alerta.className   = "alert " + tipo;

    if (tipo === "success") {
        setTimeout(() => limparAlerta(), 3000);
    }
}

function limparAlerta() {
    document.getElementById("alerta").className = "alert";
}

// ── Fechar modal ao clicar fora ──
document.getElementById("modalAdicionar").addEventListener("click", (e) => {
    if (e.target.id === "modalAdicionar") fecharModal();
});

// ── Sair ──
function sair() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

// ── Inicia ──
carregarAlunos();