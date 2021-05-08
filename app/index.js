const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const addRequestId = require('express-request-id')({ setHeader: false });

// load envs first
dotenv.config();
const app = express();

const config = require('./config');

app.use(addRequestId);
app.use(express.json({ type: ['application/json'] }));

morgan.token('id', (req) => req.id.split('-')[0]);
app.use(
  morgan(
    "[:date[iso] #:id] Started :method :url for :remote-addr",
    {immediate: true}
  )
);
app.use(morgan("[:date[iso] #:id] Completed :status :res[content-length] in :response-time ms"));

app.get('/ping', (req, res) => {
  return res.json({
    message: 'pong'
  })
});

app.listen(config.port, (err) => {
  if (err) {
    console.error(err)
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});


