var path = require('path'),
	router = require('express').Router();

// require(path.join(__dirname, '..', 'scripts', 'misc', 'passport'));

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: 'Express' });
});

module.exports = router;
