const usuario = JSON.parse(localStorage.getItem("usuario"));

// ── VERIFICAÇÃO DE PERMISSÃO ──
const tiposPermitidosProf = ["professor", "coordenador", "apoio"];

if (!usuario) {
    window.location.href = "index.html";
} else if (usuario.tipo === "aluno") {
    alert("Sua conta é de aluno. Esta área é exclusiva para educadores.");
    window.location.href = "painel.html";
} else if (usuario.tipo === "responsavel") {
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
        {
            id: 1, nome: "Ana Paula", email: "ana@escola.com", cpf: "12345678901",
            rg: "1234567", telefone: "11999999999", serie: "5º Fundamental",
            tipoEscola: "Regular", condicao: "Visual", nivelAutismo: 0,
            nivel: 3, pontos: 320, progresso: 65
        },
        {
            id: 2, nome: "Carlos Souza", email: "carlos@escola.com", cpf: "98765432109",
            rg: "7654321", telefone: "11888888888", serie: "7º Fundamental",
            tipoEscola: "Integral", condicao: "Cognitiva", nivelAutismo: 1,
            nivel: 2, pontos: 180, progresso: 38
        },
        {
            id: 3, nome: "Bruna Melo", email: "bruna@escola.com", cpf: "11122233344",
            rg: "5555555", telefone: "11777777777", serie: "1º Médio",
            tipoEscola: "Regular", condicao: "Auditiva", nivelAutismo: 0,
            nivel: 4, pontos: 510, progresso: 72
        }
    ];
    todosAlunos = demo;
    renderizarCards(demo);
    atualizarStats(demo);

    const container = document.getElementById("cards-container");
    const aviso = document.createElement("div");
    aviso.style.cssText = "grid-column:1/-1;background:#FFF9C4;border-radius:12px;padding:12px 16px;color:#F57F17;font-weight:700;font-size:13px;margin-bottom:8px;";
    aviso.textContent = "⚠️ Servidor offline — exibindo dados de exemplo.";
    container.prepend(aviso);
}

// ✅ Ícones por condição (inclui variação sem acento para segurança)
function iconeCondicao(condicao) {
    const icons = {
        "Nenhuma":   "✅",
        "Visual":    "👁️",
        "Auditiva":  "👂",
        "Cognitiva": "🧠",
        "Física":    "♿",
        "Fisica":    "♿",
        "Outro":     "⭐"
    };
    // Tenta match direto, depois normalizado
    if (icons[condicao]) return icons[condicao];
    const norm = (condicao || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    for (const [key, val] of Object.entries(icons)) {
        if (key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === norm) return val;
    }
    return "⭐";
}

// ✅ Classe do badge por condição (normaliza acentos)
function badgeClass(condicao) {
    const norm = (condicao || "Nenhuma").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return "badge-" + norm;
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
        const cor          = avatarCores[i % avatarCores.length];
        // ✅ Lê condicao direto do objeto (vem do banco)
        const condicao     = aluno.condicao    || "Nenhuma";
        const progresso    = aluno.progresso   || 0;
        const cpf          = aluno.cpf         || "—";
        const rg           = aluno.rg          || "—";
        const telefone     = aluno.telefone    || "—";
        const serie        = aluno.serie       || "Não informado";
        const tipoEscola   = aluno.tipoEscola  || "Não informado";
        const nivelAutismo = aluno.nivelAutismo || 0;

        const nivelAutismoTexto = { 0: "Sem TEA", 1: "Leve", 2: "Moderado" }[nivelAutismo] || "Não informado";

        return `
        <div class="aluno-card">
            <div class="card-top">
                <div class="card-avatar ${cor}">🧒</div>
                <div>
                    <div class="card-nome">${aluno.nome}</div>
                    <div class="card-email">${aluno.email}</div>
                </div>
            </div>

            <!-- ✅ Badge de condição/necessidade exibido corretamente -->
            <span class="badge ${badgeClass(condicao)}">
                ${iconeCondicao(condicao)} ${condicao}
            </span>

            <div style="background:#F8FBFF;border-radius:12px;padding:12px;margin-bottom:14px;font-size:12px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <div>
                        <strong style="color:#1565C0;display:block;font-size:11px;margin-bottom:2px;">CPF</strong>
                        <span style="color:#546E7A;">${cpf}</span>
                    </div>
                    <div>
                        <strong style="color:#1565C0;display:block;font-size:11px;margin-bottom:2px;">RG</strong>
                        <span style="color:#546E7A;">${rg}</span>
                    </div>
                    <div>
                        <strong style="color:#1565C0;display:block;font-size:11px;margin-bottom:2px;">Telefone</strong>
                        <span style="color:#546E7A;">${telefone}</span>
                    </div>
                    <div>
                        <strong style="color:#1565C0;display:block;font-size:11px;margin-bottom:2px;">Série</strong>
                        <span style="color:#546E7A;">${serie}</span>
                    </div>
                    <div>
                        <strong style="color:#1565C0;display:block;font-size:11px;margin-bottom:2px;">Tipo Escola</strong>
                        <span style="color:#546E7A;">${tipoEscola}</span>
                    </div>
                    <div>
                        <strong style="color:#1565C0;display:block;font-size:11px;margin-bottom:2px;">Autismo</strong>
                        <span style="color:#546E7A;">${nivelAutismoTexto}</span>
                    </div>
                    <!-- ✅ Necessidade também exibida no grid de dados -->
                    <div style="grid-column:1/-1;">
                        <strong style="color:#1565C0;display:block;font-size:11px;margin-bottom:2px;">Tipo de Necessidade</strong>
                        <span style="color:#546E7A;">${iconeCondicao(condicao)} ${condicao}</span>
                    </div>
                </div>
            </div>

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