const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// CONEXÃO COM MYSQL
const conexao = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "educa_inclusiva",
    waitForConnections: true,
    connectionLimit: 10
});

// =======================
// LOGIN ALUNO / PROFESSOR
// =======================
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    const sql = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;

    conexao.query(sql, [email, senha], (erro, resultado) => {
        if (erro) return res.status(500).json({ mensagem: "Erro no servidor" });

        if (resultado.length > 0) {
            res.json({ mensagem: "Login correto", usuario: resultado[0] });
        } else {
            res.status(401).json({ mensagem: "Email ou senha incorretos" });
        }
    });
});

// =======================
// ATUALIZAR CONDIÇÃO DO ALUNO (selecionada no login)
// =======================
app.post("/atualizar-condicao", (req, res) => {
    const { id, condicao } = req.body;

    const sql = `UPDATE usuarios SET condicao = ? WHERE id = ? AND tipo = 'aluno'`;

    conexao.query(sql, [condicao, id], (erro, resultado) => {
        if (erro) return res.status(500).json({ mensagem: "Erro no servidor" });
        res.json({ mensagem: "Condição atualizada com sucesso" });
    });
});

// =======================
// BUSCAR ALUNOS DO PROFESSOR (e também do responsável)
// =======================
app.get("/alunos/:professorId", (req, res) => {
    const { professorId } = req.params;

    const sql = `
        SELECT u.* FROM usuarios u
        INNER JOIN professor_aluno pa ON u.id = pa.aluno_id
        WHERE pa.professor_id = ? AND u.tipo = 'aluno'
    `;

    conexao.query(sql, [professorId], (erro, resultado) => {
        if (erro) return res.status(500).json({ mensagem: "Erro no servidor" });
        res.json({ alunos: resultado });
    });
});

// =======================
// ADICIONAR ALUNO AO PROFESSOR / RESPONSÁVEL
// =======================
app.post("/adicionar-aluno", (req, res) => {
    const { professorId, emailAluno } = req.body;

    const sqlBuscaAluno = `SELECT id FROM usuarios WHERE email = ? AND tipo = 'aluno'`;

    conexao.query(sqlBuscaAluno, [emailAluno], (erro, resultado) => {
        if (erro) return res.status(500).json({ mensagem: "Erro no servidor" });
        if (resultado.length === 0) return res.status(404).json({ mensagem: "Aluno não encontrado com esse email" });

        const alunoId = resultado[0].id;

        const sqlVerifica = `SELECT id FROM professor_aluno WHERE professor_id = ? AND aluno_id = ?`;

        conexao.query(sqlVerifica, [professorId, alunoId], (erro, resultado) => {
            if (erro) return res.status(500).json({ mensagem: "Erro no servidor" });
            if (resultado.length > 0) return res.status(400).json({ mensagem: "Este aluno já está vinculado" });

            const sqlAdiciona = `INSERT INTO professor_aluno (professor_id, aluno_id) VALUES (?, ?)`;

            conexao.query(sqlAdiciona, [professorId, alunoId], (erro) => {
                if (erro) return res.status(500).json({ mensagem: "Erro ao adicionar aluno" });
                res.json({ mensagem: "Aluno adicionado com sucesso!", alunoId });
            });
        });
    });
});

// =======================
// BUSCAR DADOS DE UM ALUNO ESPECÍFICO
// =======================
app.get("/aluno/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT id, nome, email, tipo, nivel, pontos, progresso, condicao, nivelAutismo
        FROM usuarios
        WHERE id = ? AND tipo = 'aluno'
    `;

    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) return res.status(500).json({ mensagem: "Erro no servidor" });
        if (resultado.length === 0) return res.status(404).json({ mensagem: "Aluno não encontrado" });
        res.json({ aluno: resultado[0] });
    });
});

// =======================
// BUSCAR ESTATÍSTICAS DA ESCOLA (para o coordenador)
// =======================
app.get("/escola/stats", (req, res) => {
    const sqlAlunos = `
        SELECT
            COUNT(*) AS totalAlunos,
            AVG(progresso) AS progressoMedio,
            SUM(CASE WHEN condicao = 'Visual'    THEN 1 ELSE 0 END) AS visual,
            SUM(CASE WHEN condicao = 'Auditiva'  THEN 1 ELSE 0 END) AS auditiva,
            SUM(CASE WHEN condicao = 'Cognitiva' THEN 1 ELSE 0 END) AS cognitiva,
            SUM(CASE WHEN condicao = 'Física'    THEN 1 ELSE 0 END) AS fisica,
            SUM(CASE WHEN condicao IS NULL OR condicao = 'Nenhuma' THEN 1 ELSE 0 END) AS nenhuma
        FROM usuarios
        WHERE tipo = 'aluno'
    `;

    const sqlProfessores = `SELECT COUNT(*) AS totalProfessores FROM usuarios WHERE tipo = 'professor'`;

    conexao.query(sqlAlunos, (erro, resAlunos) => {
        if (erro) return res.status(500).json({ mensagem: "Erro no servidor" });

        conexao.query(sqlProfessores, (erro, resProfs) => {
            if (erro) return res.status(500).json({ mensagem: "Erro no servidor" });

            res.json({
                totalAlunos: resAlunos[0].totalAlunos,
                totalProfessores: resProfs[0].totalProfessores,
                progressoMedio: Math.round(resAlunos[0].progressoMedio || 0),
                condicoes: {
                    Visual: resAlunos[0].visual,
                    Auditiva: resAlunos[0].auditiva,
                    Cognitiva: resAlunos[0].cognitiva,
                    Fisica: resAlunos[0].fisica,
                    Nenhuma: resAlunos[0].nenhuma
                }
            });
        });
    });
});

// =======================
// BUSCAR TURMAS DO PROFESSOR (para coordenador)
// =======================
app.get("/escola/turmas", (req, res) => {
    const sql = `
        SELECT
            u.nome AS professor,
            COUNT(pa.aluno_id) AS totalAlunos,
            AVG(al.progresso) AS progressoMedio
        FROM usuarios u
        LEFT JOIN professor_aluno pa ON u.id = pa.professor_id
        LEFT JOIN usuarios al ON pa.aluno_id = al.id
        WHERE u.tipo = 'professor'
        GROUP BY u.id, u.nome
    `;

    conexao.query(sql, (erro, resultado) => {
        if (erro) return res.status(500).json({ mensagem: "Erro no servidor" });
        res.json({ turmas: resultado });
    });
});

// =======================
// SERVIDOR
// =======================
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});