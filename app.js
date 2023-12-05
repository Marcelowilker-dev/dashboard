const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./bd');
const port = 3000;
const app = express();

const indexRouter = require("./routes/index");

app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;