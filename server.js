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
// LOGIN ALUNO
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
// SERVIDOR
// =======================
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});