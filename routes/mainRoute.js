const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('components/main'); // make sure this EJS file exists inside views/components
});

module.exports = router;
