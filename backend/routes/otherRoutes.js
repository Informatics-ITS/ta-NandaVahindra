const express = require('express');
const router = express.Router();

router.get('/warmup', (req, res) => {
  res.status(200).send('Warmup request received');
});


module.exports = router;