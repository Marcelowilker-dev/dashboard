const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../bd');
app.use(express.json());
const jwt = require('jsonwebtoken');
app.use('/', router);

function verificarToken(req, res, next) {

  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {

    const decoded = jwt.verify(token, 'MinhaChaveTesteAgoraVai');

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

//router.get('/vagasCursos/:co_curso/:nu_ano_censo', verificarToken, async (req, res) => {
  router.get('/vagasCursos/:co_curso/:nu_ano_censo', async (req, res) => {
  try {
    const co_curso = req.params.co_curso;
    const nu_ano_censo = req.params.nu_ano_censo;

    let query;
    let result;

    if (isNaN(co_curso)) {
      return res.status(400).json({ error: 'co_curso deve ser um número válido' });
    } else if (nu_ano_censo === '1') {
      query = 'SELECT SUM(qt_ing) AS total_vagas FROM cursos WHERE co_curso = $1';
      result = await pool.query(query, [co_curso]);

    } else {
      query = 'SELECT SUM(qt_ing) AS total_vagas FROM cursos WHERE co_curso = $1 AND nu_ano_censo = $2';
      result = await pool.query(query, [co_curso, nu_ano_censo]);
    }



    const totalVagas = result.rows[0].total_vagas;

    res.json({ total_vagas: totalVagas });
  } catch (error) {
    console.error('Erro ao consultar vagas', error);
    res.status(500).json({ message: 'Erro ao consultar vagas' });
  }
});
// esta rota retorna todos os dados estatisticos se for passado como argumento o valor '1'
//tambem retornará os dados dos  anos do censo se for passado o valor do ano em questao.
//router.get('/estatisticas/:anoCenso', verificarToken, async (req, res) => {
  router.get('/estatisticas/:anoCenso',  async (req, res) => {
  try {
    const censo = req.params.anoCenso;

    let query;
    let result;

    if (censo === '1') {
      query = `
      SELECT
       nu_ano_censo,
       co_curso,
       no_curso, 
       SUM(qt_ing) AS alunos,
       SUM(qt_ing_masc) AS masc,
       SUM(qt_ing_fem) AS fem,
       sum(qt_ing_branca) AS ing_branca,
       SUM(qt_ing_preta) as ing_preta,
       sum(qt_ing_parda) as ing_parda, 
       sum(qt_ing_amarela) as ing_amarela,
       sum(qt_ing_indigena) as ing_indigena,
       sum(qt_ing_cornd) as ing_cornd,
       (SUM(qt_ing_branca) * 100.0 / SUM(qt_ing)) AS percentual_ing_branca,
       (SUM(qt_ing_preta) * 100.0 / SUM(qt_ing)) AS percentual_ing_preta,
       (SUM(qt_ing_parda) * 100.0 / SUM(qt_ing)) AS percentual_ing_parda,
       (SUM(qt_ing_amarela) * 100.0 / SUM(qt_ing)) AS percentual_ing_amarela,
       (SUM(qt_ing_indigena) * 100.0 / SUM(qt_ing)) AS percentual_ing_indigena,
       (SUM(qt_ing_cornd) * 100.0 / SUM(qt_ing)) AS percentual_ing_cornd,
       (SUM(qt_ing_masc) * 100.0 / SUM(qt_ing)) AS percentual_masculino,
       (SUM(qt_ing_fem) * 100.0 / SUM(qt_ing)) AS percentual_feminino,
       MAX(qt_ing_vestibular) AS qt_ing_vestibular, MAX(qt_ing_enem) AS qt_ing_enem,
       MAX(qt_ing_vg_prog_especial) AS qt_ing_vg_prog_especial,
       SUM(qt_ing_avaliacao_seriada) + SUM(qt_ing_egr) AS OUTRAS_FORMAS_ING 
      FROM cursos   GROUP BY nu_ano_censo, co_curso, no_curso`;

      result = await pool.query(query);
    } else {
      let query = `
      SELECT
        nu_ano_censo,
        co_curso,
        no_curso,
        SUM(qt_ing) AS alunos,
        SUM(qt_ing_masc) AS masc,
        SUM(qt_ing_fem) AS fem,
        SUM(qt_ing_branca) AS ing_branca,
        SUM(qt_ing_preta) AS ing_preta,
        SUM(qt_ing_parda) AS ing_parda,
        SUM(qt_ing_amarela) AS ing_amarela,
        SUM(qt_ing_indigena) AS ing_indigena,
        SUM(qt_ing_cornd) AS ing_cornd,
        ROUND((SUM(qt_ing_branca) * 100.0 / NULLIF(SUM(qt_ing), 0)), 2) AS percentual_ing_branca,
        ROUND((SUM(qt_ing_preta) * 100.0 / NULLIF(SUM(qt_ing), 0)), 2) AS percentual_ing_preta,
        ROUND((SUM(qt_ing_parda) * 100.0 / NULLIF(SUM(qt_ing), 0)), 2) AS percentual_ing_parda,
        ROUND((SUM(qt_ing_amarela) * 100.0 / NULLIF(SUM(qt_ing), 0)), 2) AS percentual_ing_amarela,
        ROUND((SUM(qt_ing_indigena) * 100.0 / NULLIF(SUM(qt_ing), 0)), 2) AS percentual_ing_indigena,
        ROUND((SUM(qt_ing_cornd) * 100.0 / NULLIF(SUM(qt_ing), 0)), 2) AS percentual_ing_cornd,
        ROUND((SUM(qt_ing_masc) * 100.0 / NULLIF(SUM(qt_ing), 0)), 2) AS percentual_masculino,
        ROUND((SUM(qt_ing_fem) * 100.0 / NULLIF(SUM(qt_ing), 0)), 2) AS percentual_feminino,
        MAX(qt_ing_vestibular) AS qt_ing_vestibular,
        MAX(qt_ing_enem) AS qt_ing_enem, MAX(qt_ing_vg_prog_especial) AS qt_ing_vg_prog_especial,
        SUM(qt_ing_avaliacao_seriada) + SUM(qt_ing_egr) AS OUTRAS_FORMAS_ING
      FROM cursos where nu_ano_censo = $1 GROUP BY nu_ano_censo, co_curso, no_curso
    `;
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