const express = require('express');

const router = express.Router();

//get 라우터
router.get('/', (req, res) => {
  res.send('Hello, Express_in routes');
});

module.exports = router;
