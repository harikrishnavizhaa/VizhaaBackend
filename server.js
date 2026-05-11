require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config');

app.listen(config.port, () => {
  console.log(`Vizhaa API → http://localhost:${config.port}`);
});
