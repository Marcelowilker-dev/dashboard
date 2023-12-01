const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:2334*4EDdFCb4gCD-ebG411GC2-bCE1G@monorail.proxy.rlwy.net:23351/railway',
  
});
client.connect();
module.exports = client;