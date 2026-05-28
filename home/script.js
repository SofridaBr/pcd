// ═══════════════════════════════════════════════════════
// ACESSIBILIDADE
// ═══════════════════════════════════════════════════════
const menu = document.getElementById("menuAcessibilidade");

function toggleMenu() {
    menu.classList.toggle("active");
}

const guide = document.getElementById("reading-guide");
function toggleGuide() {
    guide.style.display = guide.style.display === "block" ? "none" : "block";
}
document.addEventListener("mousemove", (e) => { guide.style.top = e.clientY + "px"; });

let fontSize = 16;
function increaseFont() { fontSize += 2; document.body.style.fontSize = fontSize + "px"; }
function decreaseFont() { fontSize -= 2; document.body.style.fontSize = fontSize + "px"; }
function toggleContrast()  { document.body.classList.toggle("high-contrast"); }
function toggleDyslexia()  { document.body.classList.toggle("dyslexia"); }
let zoom = 1;
function zoomPage() { zoom += 0.1; document.body.style.zoom = zoom; }
function speakText() {
    const speech = new SpeechSynthesisUtterance(document.body.innerText);
    speech.lang = "pt-BR";
    window.speechSynthesis.speak(speech);
}
function toggleTDAH() { document.body.classList.toggle("tdah-mode"); }

// ═══════════════════════════════════════════════════════
// FORMATADORES (substituem o oninput="apenasNumeros")
// ═══════════════════════════════════════════════════════

// Não é mais usado diretamente, mas mantido para compatibilidade
function apenasNumeros(input) {
    input.value = input.value.replace(/\D/g, '');
}

document.addEventListener('DOMContentLoaded', function () {

    // ── CPF: 000.000.000-00 (máx 14 chars formatados / 11 dígitos) ──
    document.querySelectorAll('input[id$="-cpf"]').forEach(input => {
        // Remove o oninput nativo para evitar conflito
        input.removeAttribute('oninput');
        input.addEventListener('input', function () {
            let d = this.value.replace(/\D/g, '').slice(0, 11);
            if (d.length <= 3)      this.value = d;
            else if (d.length <= 6) this.value = d.slice(0,3) + '.' + d.slice(3);
            else if (d.length <= 9) this.value = d.slice(0,3) + '.' + d.slice(3,6) + '.' + d.slice(6);
            else                    this.value = d.slice(0,3) + '.' + d.slice(3,6) + '.' + d.slice(6,9) + '-' + d.slice(9);
        });
    });

    // ── RG: 00.000.000-0 (máx 10 chars formatados / 9 dígitos) ──
    document.querySelectorAll('input[id$="-rg"]').forEach(input => {
        input.removeAttribute('oninput');
        input.addEventListener('input', function () {
            let d = this.value.replace(/\D/g, '').slice(0, 9);
            if (d.length <= 2)      this.value = d;
            else if (d.length <= 5) this.value = d.slice(0,2) + '.' + d.slice(2);
            else if (d.length <= 8) this.value = d.slice(0,2) + '.' + d.slice(2,5) + '.' + d.slice(5);
            else                    this.value = d.slice(0,2) + '.' + d.slice(2,5) + '.' + d.slice(5,8) + '-' + d.slice(8);
        });
    });

    // ── Telefone: (11) 99999-9999 ou (11) 9999-9999 ──
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.removeAttribute('oninput');
        input.addEventListener('input', function () {
            let d = this.value.replace(/\D/g, '').slice(0, 11);
            if (d.length <= 2)       this.value = d.length ? '(' + d : '';
            else if (d.length <= 6)  this.value = '(' + d.slice(0,2) + ') ' + d.slice(2);
            else if (d.length <= 10) this.value = '(' + d.slice(0,2) + ') ' + d.slice(2,6) + '-' + d.slice(6);
            else                     this.value = '(' + d.slice(0,2) + ') ' + d.slice(2,7) + '-' + d.slice(7);
        });
    });

    // ── Mostrar/ocultar campo de disciplina ──
    const tipoSelect = document.getElementById("ci-tipo");
    const disciplinaContainer = document.getElementById("disciplina-container");
    if (tipoSelect) {
        tipoSelect.addEventListener('change', function () {
            const mostrar = this.value === 'professor' || this.value === 'apoio';
            disciplinaContainer.style.display = mostrar ? 'block' : 'none';
            if (!mostrar) document.getElementById("ci-disciplina").value = '';
        });
    }
});

// ═══════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════
function switchTab(tab) {
    document.getElementById('panel-aluno').classList.toggle('active', tab === 'aluno');
    document.getElementById('panel-resp').classList.toggle('active', tab === 'resp');
    document.getElementById('tab-aluno').classList.toggle('active', tab === 'aluno');
    document.getElementById('tab-resp').classList.toggle('active', tab === 'resp');
    document.getElementById('tab-aluno').setAttribute('aria-selected', tab === 'aluno');
    document.getElementById('tab-resp').setAttribute('aria-selected', tab === 'resp');

    const anterior = document.getElementById("alerta-acesso");
    if (anterior) anterior.remove();
}

function toggleChip(el) {
    document.querySelectorAll(".pcd-chip").forEach(c => { if (c !== el) c.classList.remove("sel"); });
    el.classList.toggle("sel");
}

// ═══════════════════════════════════════════════════════
// TOGGLE PARA NOVOS CAMPOS
// ═══════════════════════════════════════════════════════

function toggleEscola(el, valor) {
    el.parentElement.querySelectorAll(".pcd-chip").forEach(c => c.classList.remove("sel"));
    el.classList.add("sel");
    document.getElementById("ca-tipo-escola").value = valor;
}

function toggleAutismo(el, nivel) {
    el.parentElement.querySelectorAll(".pcd-chip").forEach(c => c.classList.remove("sel"));
    el.classList.add("sel");
    document.getElementById("ca-nivel-autismo").value = nivel;
}

function toggleEscolaInst(el, valor) {
    el.parentElement.querySelectorAll(".pcd-chip").forEach(c => c.classList.remove("sel"));
    el.classList.add("sel");
    document.getElementById("ci-tipo-escola").value = valor;
}

// ═══════════════════════════════════════════════════════
// MAPEAMENTOS
// ═══════════════════════════════════════════════════════
const tipoMap = {
    "Professor(a)":           "professor",
    "Responsável / Familiar": "responsavel",
    "Coordenador(a)":         "coordenador",
    "Apoio / Cuidador":       "apoio"
};

const redirecionaMap = {
    "aluno":       "painel.html",
    "professor":   "painel-prof.html",
    "responsavel": "painel-responsavel.html",
    "coordenador": "painel-coordenador.html",
    "apoio":       "painel-prof.html"
};

// ═══════════════════════════════════════════════════════
// LOGIN ALUNO
// ═══════════════════════════════════════════════════════
document.getElementById("form-login-aluno").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email    = document.getElementById("aluno-email").value.trim();
    const senha    = document.getElementById("aluno-senha").value;
    const condicao = [...document.querySelectorAll(".pcd-chip.sel")]
        .map(c => c.textContent.trim())[0] || "Nenhuma";

    if (!email || !senha) { alert("Preencha e-mail e senha."); return; }

    try {
        const res   = await fetch("http://localhost:3000/login", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email, senha })
        });
        const dados = await res.json();

        if (!res.ok) { alert(dados.mensagem); return; }

        const usuario = dados.usuario;

        if (usuario.tipo !== "aluno") {
            const nomesTipo = {
                professor:   "Professor(a)",
                responsavel: "Responsável / Familiar",
                coordenador: "Coordenador(a)",
                apoio:       "Apoio / Cuidador"
            };
            mostrarAcessoNegado(
                `Sua conta é do tipo "<strong>${nomesTipo[usuario.tipo] || usuario.tipo}</strong>". ` +
                `Esta área é exclusiva para alunos. ` +
                `Por favor, use a aba <strong>"Professor / Responsável"</strong> para entrar.`
            );
            return;
        }

        localStorage.setItem("usuario", JSON.stringify({ ...usuario, condicao }));

        if (condicao !== "Nenhuma") {
            try {
                await fetch("http://localhost:3000/atualizar-condicao", {
                    method:  "POST",
                    headers: { "Content-Type": "application/json" },
                    body:    JSON.stringify({ id: usuario.id, condicao })
                });
            } catch (_) { }
        }

        window.location.href = "painel.html";

    } catch {
        alert("Erro ao conectar ao servidor. Verifique se ele está rodando.");
    }
});

// ═══════════════════════════════════════════════════════
// LOGIN PROFESSOR / RESPONSÁVEL / COORDENADOR / APOIO
// ═══════════════════════════════════════════════════════
document.getElementById("form-login-prof").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email        = document.getElementById("resp-email").value.trim();
    const senha        = document.getElementById("resp-senha").value;
    const tipoSelect   = document.getElementById("resp-tipo").value;
    const tipoEsperado = tipoMap[tipoSelect] || "professor";

    if (!email || !senha) { alert("Preencha e-mail e senha."); return; }

    try {
        const res   = await fetch("http://localhost:3000/login", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email, senha })
        });
        const dados = await res.json();

        if (!res.ok) { alert(dados.mensagem); return; }

        const usuario = dados.usuario;

        if (usuario.tipo === "aluno") {
            mostrarAcessoNegado(
                `Sua conta é de <strong>aluno</strong>. ` +
                `Por favor, use a aba <strong>"Sou Aluno"</strong> para fazer login.`
            );
            return;
        }

        if (usuario.tipo !== tipoEsperado) {
            const nomesTipo = {
                professor:   "Professor(a)",
                responsavel: "Responsável / Familiar",
                coordenador: "Coordenador(a)",
                apoio:       "Apoio / Cuidador"
            };
            mostrarAcessoNegado(
                `Você selecionou <strong>"${tipoSelect}"</strong>, ` +
                `mas seu cadastro é do tipo <strong>"${nomesTipo[usuario.tipo] || usuario.tipo}"</strong>. ` +
                `Selecione o tipo correto no menu e tente novamente.`
            );
            return;
        }

        localStorage.setItem("usuario", JSON.stringify(usuario));
        window.location.href = redirecionaMap[usuario.tipo] || "painel-prof.html";

    } catch {
        alert("Erro ao conectar ao servidor. Verifique se ele está rodando.");
    }
});

// ═══════════════════════════════════════════════════════
// AVISO DE ACESSO NEGADO
// ═══════════════════════════════════════════════════════
function mostrarAcessoNegado(mensagem) {
    const anterior = document.getElementById("alerta-acesso");
    if (anterior) anterior.remove();

    const div = document.createElement("div");
    div.id = "alerta-acesso";
    div.style.cssText = `
        background: #FFEBEE; color: #B71C1C;
        border: 2px solid #EF9A9A; border-radius: 14px;
        padding: 14px 16px; font-size: 13px; font-weight: 600;
        margin-top: 8px; display: flex; align-items: flex-start; gap: 10px;
        line-height: 1.6;
    `;
    div.innerHTML = `<span style="font-size:22px;flex-shrink:0">🚫</span><span>${mensagem}</span>`;

    const panelAtivo = document.querySelector(".panel.active .form");
    if (panelAtivo) panelAtivo.appendChild(div);

    setTimeout(() => { if (div.parentNode) div.remove(); }, 7000);
}

// ═══════════════════════════════════════════════════════
// MODAL: CRIAR CONTA DE ALUNO
// ═══════════════════════════════════════════════════════
function abrirModalCadastroAluno() {
    document.getElementById("modal-aluno").classList.add("active");
    document.getElementById("alerta-aluno").className = "modal-alert";
    ["ca-nome", "ca-email", "ca-cpf", "ca-rg", "ca-telefone", "ca-serie", "ca-senha", "ca-senha2"].forEach(id => {
        document.getElementById(id).value = "";
    });
    document.getElementById("ca-tipo-escola").value = "Não informado";
    document.getElementById("ca-nivel-autismo").value = "0";
    document.querySelectorAll("#modal-aluno .pcd-chip").forEach(c => c.classList.remove("sel"));
}

function fecharModalAluno() {
    document.getElementById("modal-aluno").classList.remove("active");
}

document.getElementById("modal-aluno").addEventListener("click", e => {
    if (e.target.id === "modal-aluno") fecharModalAluno();
});

async function cadastrarAluno() {
    const nome         = document.getElementById("ca-nome").value.trim();
    const email        = document.getElementById("ca-email").value.trim();
    const cpf          = document.getElementById("ca-cpf").value.trim();
    const rg           = document.getElementById("ca-rg").value.trim();
    const telefone     = document.getElementById("ca-telefone").value.trim();
    const serie        = document.getElementById("ca-serie").value;
    const tipoEscola   = document.getElementById("ca-tipo-escola").value;
    const nivelAutismo = document.getElementById("ca-nivel-autismo").value;
    const senha        = document.getElementById("ca-senha").value;
    const senha2       = document.getElementById("ca-senha2").value;

    if (!nome || !email || !cpf || !rg || !telefone || !senha || !senha2) {
        setAlertaAluno("Preencha todos os campos obrigatórios.", "error"); return;
    }
    if (senha.length < 6) {
        setAlertaAluno("A senha deve ter pelo menos 6 caracteres.", "error"); return;
    }
    if (senha !== senha2) {
        setAlertaAluno("As senhas não coincidem.", "error"); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAlertaAluno("Digite um e-mail válido.", "error"); return;
    }

    const cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
        setAlertaAluno("CPF deve ter 11 dígitos.", "error"); return;
    }

    const rgNumeros = rg.replace(/\D/g, '');
    if (rgNumeros.length < 7 || rgNumeros.length > 9) {
        setAlertaAluno("RG deve ter entre 7 e 9 dígitos.", "error"); return;
    }

    const telNumeros = telefone.replace(/\D/g, '');
    if (telNumeros.length < 10 || telNumeros.length > 11) {
        setAlertaAluno("Telefone deve ter entre 10 e 11 dígitos.", "error"); return;
    }

    try {
        const res   = await fetch("http://localhost:3000/cadastro/aluno", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
                nome, email, cpf: cpfNumeros, rg: rgNumeros, telefone: telNumeros,
                serie, tipoEscola, nivelAutismo, senha
            })
        });
        const dados = await res.json();

        if (!res.ok) { setAlertaAluno(dados.mensagem, "error"); return; }

        setAlertaAluno("✅ Conta criada com sucesso! Agora faça login.", "success");
        setTimeout(() => {
            fecharModalAluno();
            document.getElementById("aluno-email").value = email;
            switchTab("aluno");
        }, 2000);

    } catch {
        setAlertaAluno("Erro ao conectar ao servidor.", "error");
    }
}

function setAlertaAluno(msg, tipo) {
    const el = document.getElementById("alerta-aluno");
    el.textContent = msg;
    el.className   = "modal-alert " + tipo;
}

// ═══════════════════════════════════════════════════════
// MODAL: SOLICITAR CADASTRO INSTITUCIONAL
// ═══════════════════════════════════════════════════════
function abrirModalCadastroInstitucional() {
    document.getElementById("modal-institucional").classList.add("active");
    document.getElementById("alerta-inst").className = "modal-alert";
    ["ci-nome", "ci-email", "ci-cpf", "ci-rg", "ci-telefone", "ci-disciplina", "ci-senha", "ci-senha2"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    document.getElementById("ci-tipo-escola").value = "Não informado";
    document.querySelectorAll("#modal-institucional .pcd-chip").forEach(c => c.classList.remove("sel"));
    document.getElementById("disciplina-container").style.display = 'none';
}

function fecharModalInstitucional() {
    document.getElementById("modal-institucional").classList.remove("active");
}

document.getElementById("modal-institucional").addEventListener("click", e => {
    if (e.target.id === "modal-institucional") fecharModalInstitucional();
});

async function cadastrarInstitucional() {
    const nome         = document.getElementById("ci-nome").value.trim();
    const tipo         = document.getElementById("ci-tipo").value;
    const email        = document.getElementById("ci-email").value.trim();
    const cpf          = document.getElementById("ci-cpf").value.trim();
    const rg           = document.getElementById("ci-rg").value.trim();
    const telefone     = document.getElementById("ci-telefone").value.trim();
    const disciplina   = document.getElementById("ci-disciplina").value.trim();
    const tipoEscola   = document.getElementById("ci-tipo-escola").value;
    const senha        = document.getElementById("ci-senha").value;
    const senha2       = document.getElementById("ci-senha2").value;

    if (!nome || !email || !cpf || !rg || !telefone || !senha || !senha2) {
        setAlertaInst("Preencha todos os campos obrigatórios.", "error"); return;
    }
    if (senha.length < 6) {
        setAlertaInst("A senha deve ter pelo menos 6 caracteres.", "error"); return;
    }
    if (senha !== senha2) {
        setAlertaInst("As senhas não coincidem.", "error"); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setAlertaInst("Digite um e-mail válido.", "error"); return;
    }

    const cpfNumeros = cpf.replace(/\D/g, '');
    if (cpfNumeros.length !== 11) {
        setAlertaInst("CPF deve ter 11 dígitos.", "error"); return;
    }

    const rgNumeros = rg.replace(/\D/g, '');
    if (rgNumeros.length < 7 || rgNumeros.length > 9) {
        setAlertaInst("RG deve ter entre 7 e 9 dígitos.", "error"); return;
    }

    const telNumeros = telefone.replace(/\D/g, '');
    if (telNumeros.length < 10 || telNumeros.length > 11) {
        setAlertaInst("Telefone deve ter entre 10 e 11 dígitos.", "error"); return;
    }

    if ((tipo === "professor" || tipo === "apoio") && !disciplina) {
        setAlertaInst("Disciplina é obrigatória para professores.", "error"); return;
    }

    try {
        const res   = await fetch("http://localhost:3000/cadastro/institucional", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({
                nome, email, cpf: cpfNumeros, rg: rgNumeros, telefone: telNumeros,
                disciplina, tipoEscola, tipo, senha
            })
        });
        const dados = await res.json();

        if (!res.ok) { setAlertaInst(dados.mensagem, "error"); return; }

        setAlertaInst("✅ Cadastro realizado com sucesso! Agora faça login.", "success");
        setTimeout(() => {
            fecharModalInstitucional();
            document.getElementById("resp-email").value = email;
            switchTab("resp");
        }, 2000);

    } catch {
        setAlertaInst("Erro ao conectar ao servidor.", "error");
    }
}

function setAlertaInst(msg, tipo) {
    const el = document.getElementById("alerta-inst");
    el.textContent = msg;
    el.className   = "modal-alert " + tipo;
}