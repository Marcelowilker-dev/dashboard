const express = require('express');
const app = express();
const router = express.Router();
const client = require('../bd');
app.use(express.json());

app.use('/', router);

 
    router.get('/vagasCursos/:co_curso', async (req, res) => {
        try {
          const co_curso = req.params.co_curso;
      
         
          if (isNaN(co_curso)) {
            return res.status(400).json({ error: 'co_curso deve ser um número válido' });
          }
      
          // Sua lógica de consulta SQL aqui, usando o valor de co_curso
          const query = 'SELECT SUM(qt_vg_total) AS total_vagas FROM cursos WHERE co_curso = $1';
          const result = await client.query(query, [co_curso]);
          const totalVagas = result.rows[0].total_vagas;
      
          res.json({ total_vagas: totalVagas });
        } catch (error) {
          console.error('Erro ao consultar vagas', error);
          res.status(500).json({ message: 'Erro ao consultar vagas' });
        }
      });
      router.get('/estatisticas', async (req, res) => {
        try {
          const query = 'SELECT no_curso,SUM(qt_ing) AS alunos, SUM(qt_ing_masc) AS masc,SUM(qt_ing_fem) AS fem, (SUM(qt_ing_masc) * 100 / SUM(qt_ing)) AS percentual_masculino, (SUM(qt_ing_fem) * 100 / SUM(qt_ing)) AS percentual_feminino FROM cursos GROUP BY no_curso';
          const result = await client.query(query);
      
          // Certifique-se de que result.rows seja um array (se a consulta retornar vários registros)
          const porcentagens = result.rows;
      
          res.json({ porcentagens: porcentagens });
        } catch (error) {
          console.error('Erro ao listar porcentagens dos cursos:', error);
          res.status(500).json({ message: 'Erro ao listar porcentagens dos cursos' });
        }
      })
      module.exports = router;