const express = require('express');

const router = express.Router();

router.get('/admin', (req, res) => {
    const name = 'Admin Home'
    res.render('home.ejs', {name});
})

module.exports = router;