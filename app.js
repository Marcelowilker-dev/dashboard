const express = require('express');
const bodyParser = require('body-parser');
const client = require('./bd');
//const cors = require('cors');
const port = 3000;
const app = express();

const indexRouter = require("./routes/index");

//app.use(cors())
app.use(bodyParser.json());
app.use(express.json());
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

module.exports = app;