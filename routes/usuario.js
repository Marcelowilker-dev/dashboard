const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../bd');
let userId;


const secretKey = 'MinhaChaveTesteAgoraVai';


router.post('/cadastrar', async (req, res) => {
    try {
        const { email, senha } = req.body;


        if (!email || !senha) {
            return res.status(400).json({ message: 'E-mail e senha obrigatórios.' });
        }


        const hashedSenha = await bcrypt.hash(senha, 10);
        console.log('Senha Hash:', hashedSenha);


        const result = await pool.query('INSERT INTO usuario (email, senha) VALUES ($1, $2) RETURNING *', [email, hashedSenha]);

        if (result.rows.length > 0) {
            console.log('Usuário registrado com sucesso:', result.rows[0]);
            res.json({ message: 'Usuário registrado com sucesso' });
        } else {
            console.error('Erro ao registrar usuário no banco de dados.');
            res.status(500).json({ message: 'Erro ao registrar usuário' });
        }

    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário' });
    }
});




router.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Consulta no banco de dados para verificar email senha e id
        const userResult = await pool.query('SELECT id, email, senha FROM usuario WHERE email = $1', [email]);
        const user = userResult.rows[0];

        // Verifica se o usuario existe
        if (!user) {
            return res.json({ message: 'Credenciais inválidas' });
        }

        // Verifica a senha usando bcrypt
        if (await bcrypt.compare(senha, user.senha)) {
            const { id: userId } = user;

            // Gera o token com o ID do usuário
            const token = jwt.sign({ userId }, secretKey);

            res.json({ message: 'Login realizado com sucesso', token });
        } else {
            res.json({ message: 'Credenciais inválidas' });
        }

    } catch (error) {
        console.error('Erro ao verificar credenciais:', error);
        res.status(500).json({ message: 'Erro ao verificar credenciais' });
    }
});


module.exports = router;