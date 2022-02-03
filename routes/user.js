const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('User, Express_in routes');
});
module.exports = router;
