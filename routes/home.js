/**
 * @file Contains routes that require authentication to be accessed.
 */

var router = require('express').Router();

/* GET users listing. */
router.get('/', function (req, res) {
	res.send('respond with a resource');
});

module.exports = router;
