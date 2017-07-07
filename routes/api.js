/**
 * @file Houses route definitions for all API routes, prefixed with /api
 */

var fs = require('fs'),
	router = require('express').Router();

// eslint-disable-next-line no-sync
fs.readdirSync('database').forEach(function (model) {
	model = path.parse(model).name;

	var lCase = _.toLower(model),
		plural = utils.pluralize(lCase);

	model = global[model]; // eslint-disable-line security/detect-object-injection
	if (!model) { return; }

	router
		.route('/' + plural + '/:id?')
		// Create
		.post(function (req, res, next) {
			model.insertOne(req.body, function (err, result) {
				return err ? next(err) : res.json({ [lCase]: _.get(result, 'ops[0]', {}) });
			});
		})
		// Read
		.get(function (req, res, next) {
			req.params.id && (req.query._id = req.params.id);

			model.find(req.query).project(req.body).toArray(function (err, result) {
				if (err) { return next(err); }

				return res.json(req.query._id ? { [lCase]: result && result[0] || {} } : { [plural]: result });
			});
		})
		// Update
		.put(function (req, res, next) {
			req.params.id && (req.query._id = req.params.id);
			req.body.updatedAt = new Date().toISOString();

			model.updateMany(req.query, req.body, function (err, result) {
				return err ? next(err) : res.json({ [req.query._id ? lCase : plural]: result });
			});
		})
		// Delete
		.delete(function (req, res, next) {
			req.params.id && (req.query._id = req.params.id);

			model.removeMany(req.query, function (err, result) {
				return err ? next(err) : res.json({ [req.query._id ? lCase : plural]: result });
			});
		});
});

module.exports = router;
