const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:2334*4EDdFCb4gCD-ebG411GC2-bCE1G@monorail.proxy.rlwy.net:23351/railway',

});

process.on('exit', () => {
  pool.end();
});

module.exports = pool;
