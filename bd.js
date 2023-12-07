const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:CFFFc6-Bgf2fDa6D52bac*GG4CG5a3be@roundhouse.proxy.rlwy.net:18009/railway',

});

process.on('exit', () => {
  pool.end();
});

module.exports = pool;
