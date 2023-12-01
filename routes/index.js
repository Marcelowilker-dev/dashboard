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
          console.error('Erro ao listar senhas:', error);
          res.status(500).json({ message: 'Erro ao listar senhas' });
        }
      });
      module.exports = router;