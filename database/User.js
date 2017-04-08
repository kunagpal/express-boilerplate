/**
 * @file Provides an abstraction (data definition and helpers) over the User collection.
 */

var path = require('path'),
	model = db.collection(path.basename(__filename).split('.')[0].toLowerCase());

module.exports = utils.makeModel(['name', 'passwordHash', 'authStrategy', 'settings'], model);
