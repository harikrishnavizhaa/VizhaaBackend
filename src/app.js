const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const organizerRoutes = require('./routes/organizer');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`\n---> [${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  
  const originalJson = res.json;
  res.json = function (body) {
    console.log('<--- Response Body:', body);
    return originalJson.call(this, body);
  };
  
  const originalSend = res.send;
  res.send = function (body) {
    console.log('<--- Response Body:', body);
    return originalSend.call(this, body);
  };

  next();
});

app.get('/health', (_, res) => res.json({ status: 'ok', service: 'vizhaa-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/organizer', organizerRoutes);

module.exports = app;
