const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../bd');
app.use(express.json());

app.use('/', router);


router.get('/vagasCursos/:co_curso', async (req, res) => {
  try {
    const co_curso = req.params.co_curso;


    if (isNaN(co_curso)) {
      return res.status(400).json({ error: 'co_curso deve ser um número válido' });
    }


    const query = 'SELECT SUM(qt_vg_total) AS total_vagas FROM cursos WHERE co_curso = $1';
    const result = await pool.query(query, [co_curso]);
    const totalVagas = result.rows[0].total_vagas;

    res.json({ total_vagas: totalVagas });
  } catch (error) {
    console.error('Erro ao consultar vagas', error);
    res.status(500).json({ message: 'Erro ao consultar vagas' });
  }
});
// esta rota retorna todos os dados estatisticos se for passado como argumento o valor '1'
//tambem retornará os dados dos respectivos anos do censo se for passado o valor do ano em questao.
router.get('/estatisticas/:anoCenso', async (req, res) => {
  try {
    const censo =req.params.anoCenso;
   ;
  let query;
  let result;
   
  if (censo ==='1') {
    query = 'SELECT nu_ano_censo, co_curso, no_curso, SUM(qt_ing) AS alunos, SUM(qt_ing_masc) AS masc, SUM(qt_ing_fem) AS fem, (SUM(qt_ing_masc) * 100.0 / SUM(qt_ing)) AS percentual_masculino, (SUM(qt_ing_fem) * 100.0 / SUM(qt_ing)) AS percentual_feminino, MAX(qt_ing_vestibular) AS qt_ing_vestibular, MAX(qt_ing_enem) AS qt_ing_enem, SUM(qt_ing_avaliacao_seriada) + SUM(qt_ing_egr) AS OUTRAS_FORMAS_ING FROM cursos GROUP BY nu_ano_censo, co_curso, no_curso';
    
    result = await pool.query(query);
 }else {
    query = 'SELECT nu_ano_censo, co_curso, no_curso, SUM(qt_ing) AS alunos, SUM(qt_ing_masc) AS masc, SUM(qt_ing_fem) AS fem, (SUM(qt_ing_masc) * 100.0 / SUM(qt_ing)) AS percentual_masculino,(SUM(qt_ing_fem) * 100.0 / SUM(qt_ing)) AS percentual_feminino, MAX(qt_ing_vestibular) AS qt_ing_vestibular, MAX(qt_ing_enem) AS qt_ing_enem, SUM(qt_ing_avaliacao_seriada) + SUM(qt_ing_egr) AS OUTRAS_FORMAS_ING FROM cursos  where nu_ano_censo =$1 GROUP BY nu_ano_censo, co_curso, no_curso';
     result = await pool.query(query, [censo]);
   }
   


    const porcentagens = result.rows;

    if (porcentagens.length === 0) {
      return res.status(404).json({ message: 'Nenhum resultado encontrado para o ano do censo fornecido.' });
    }

    res.json({ porcentagens: porcentagens });
  } catch (error) {
    console.error('Erro ao listar porcentagens dos cursos:', error);
    res.status(500).json({ message: 'Erro ao listar porcentagens dos cursos' });
  }
})
module.exports = router;