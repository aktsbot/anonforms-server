const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('User router works!');
});

module.exports = router;
