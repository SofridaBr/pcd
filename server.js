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
    database: "alunos",
    waitForConnections: true,
    connectionLimit: 10
});

// =======================
// LOGIN ALUNO / PROFESSOR
// =======================
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    const sql = `
        SELECT * FROM usuarios
        WHERE email = ?
        AND senha = ?
    `;

    conexao.query(sql, [email, senha], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({
                mensagem: "Erro no servidor"
            });
        }

        if (resultado.length > 0) {
            res.json({
                mensagem: "Login correto",
                usuario: resultado[0]
            });
        } else {
            res.status(401).json({
                mensagem: "Email ou senha incorretos"
            });
        }
    });
});

// =======================
// BUSCAR ALUNOS DO PROFESSOR
// =======================
app.get("/alunos/:professorId", (req, res) => {
    const { professorId } = req.params;

    const sql = `
        SELECT u.* FROM usuarios u
        INNER JOIN professor_aluno pa ON u.id = pa.aluno_id
        WHERE pa.professor_id = ? AND u.tipo = 'aluno'
    `;

    conexao.query(sql, [professorId], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }

        res.json({ alunos: resultado });
    });
});

// =======================
// ADICIONAR ALUNO AO PROFESSOR
// =======================
app.post("/adicionar-aluno", (req, res) => {
    const { professorId, emailAluno } = req.body;

    // 1. Busca o aluno pelo email
    const sqlBuscaAluno = `
        SELECT id FROM usuarios
        WHERE email = ? AND tipo = 'aluno'
    `;

    conexao.query(sqlBuscaAluno, [emailAluno], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }

        if (resultado.length === 0) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado com esse email"
            });
        }

        const alunoId = resultado[0].id;

        // 2. Verifica se já está associado
        const sqlVerifica = `
            SELECT id FROM professor_aluno
            WHERE professor_id = ? AND aluno_id = ?
        `;

        conexao.query(sqlVerifica, [professorId, alunoId], (erro, resultado) => {
            if (erro) {
                return res.status(500).json({ mensagem: "Erro no servidor" });
            }

            if (resultado.length > 0) {
                return res.status(400).json({
                    mensagem: "Este aluno já está na sua turma"
                });
            }

            // 3. Adiciona a relação
            const sqlAdiciona = `
                INSERT INTO professor_aluno (professor_id, aluno_id)
                VALUES (?, ?)
            `;

            conexao.query(sqlAdiciona, [professorId, alunoId], (erro) => {
                if (erro) {
                    return res.status(500).json({ mensagem: "Erro ao adicionar aluno" });
                }

                res.json({
                    mensagem: "Aluno adicionado com sucesso!",
                    alunoId
                });
            });
        });
    });
});

// =======================
// BUSCAR DADOS DE UM ALUNO ESPECÍFICO
// (usado pelo painel do aluno para dados sempre frescos)
// =======================
app.get("/aluno/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT id, nome, email, tipo, nivel, pontos, progresso, condicao
        FROM usuarios
        WHERE id = ? AND tipo = 'aluno'
    `;

    conexao.query(sql, [id], (erro, resultado) => {
        if (erro) {
            return res.status(500).json({ mensagem: "Erro no servidor" });
        }

        if (resultado.length === 0) {
            return res.status(404).json({ mensagem: "Aluno não encontrado" });
        }

        res.json({ aluno: resultado[0] });
    });
});

// =======================
// SERVIDOR
// =======================
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});