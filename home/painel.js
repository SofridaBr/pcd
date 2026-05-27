const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));

if (!usuarioLocal || usuarioLocal.tipo !== "aluno") {
    window.location.href = "index.html";
}

async function carregarDadosAluno() {
    try {
        const resposta = await fetch(`http://localhost:3000/aluno/${usuarioLocal.id}`);
        const dados = await resposta.json();

        if (!resposta.ok) {
            mostrarErro("Não foi possível carregar seus dados. Tente novamente.");
            return;
        }

        const aluno = dados.aluno;

        // Atualiza o localStorage com dados frescos do banco
        localStorage.setItem("usuario", JSON.stringify({ ...usuarioLocal, ...aluno }));

        renderizarPainel(aluno);

    } catch (erro) {
        if (usuarioLocal.nome) {
            renderizarPainel(usuarioLocal);
        } else {
            mostrarErro("Sem conexão com o servidor. Faça login novamente.");
        }
    }
}

function renderizarPainel(aluno) {
    const condicao = aluno.condicao || "Nenhuma";
    const nivel = aluno.nivel || 1;
    const pontos = aluno.pontos || 0;
    const progresso = aluno.progresso || 0;

    document.getElementById("hero-nome").textContent = "Olá, " + aluno.nome + "! 👋";
    document.getElementById("badge-texto").textContent = condicao;

    const badgeEl = document.getElementById("hero-badge");
    badgeEl.className = "badge-condicao badge-" + condicao.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace("a", "a")
        .replace("i", "i");

    document.getElementById("stat-nivel").textContent = "⭐ " + nivel;
    document.getElementById("stat-pontos").textContent = "🏆 " + pontos;
    document.getElementById("stat-progresso").textContent = progresso + "%";

    const conteudo = document.getElementById("conteudo-principal");
    conteudo.innerHTML = `
        <div class="section-title">
            <i class="ti ti-chart-bar" style="color:#1565C0"></i> Meu Progresso
        </div>

        <div class="progress-section">
            <div class="progress-header">
                <span>Progresso geral</span>
                <span>${progresso}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
        </div>

        <div class="section-title" style="margin-top:8px">
            <i class="ti ti-star" style="color:#1565C0"></i> Minhas Conquistas
        </div>

        <div class="cards-row">
            <div class="info-card">
                <div class="card-icon">⭐</div>
                <div class="card-valor">${nivel}</div>
                <div class="card-label">Nível atual</div>
            </div>
            <div class="info-card">
                <div class="card-icon">🏆</div>
                <div class="card-valor">${pontos}</div>
                <div class="card-label">Pontos conquistados</div>
            </div>
            <div class="info-card">
                <div class="card-icon">📊</div>
                <div class="card-valor">${progresso}%</div>
                <div class="card-label">Progresso geral</div>
            </div>
            <div class="info-card">
                <div class="card-icon">♿</div>
                <div class="card-valor" style="font-size:18px">${condicao}</div>
                <div class="card-label">Condição registrada</div>
            </div>
        </div>
    `;

    // Anima a barra de progresso
    setTimeout(() => {
        const fill = document.querySelector(".progress-fill");
        if (fill) fill.style.width = progresso + "%";
    }, 100);
}

function mostrarErro(msg) {
    document.getElementById("conteudo-principal").innerHTML = `
        <div class="error-state">
            <i class="ti ti-wifi-off" style="font-size:48px;display:block;margin-bottom:12px"></i>
            ${msg}
        </div>
    `;
}

function sair() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

carregarDadosAluno();