/**
 * @file Houses route definitions for all API routes, prefixed with /api
 */

var fs = require('fs'),

	_ = require('lodash'),
	router = require('express').Router();

// eslint-disable-next-line no-sync
fs.readdirSync('database').forEach(function (modelName) {
	// bail out if the model does not exist or has restful routing disabled
	if (!_.get(global, [modelName = path.parse(modelName).name, 'config', 'rest', 'enabled'])) { return; }

	var model = global[modelName], // eslint-disable-line security/detect-object-injection
		lCase = _.toLower(modelName),
		plural = utils.pluralize(lCase),
		multiUpdate = _.get(model, 'config.rest.multiUpdate'),
		multiDelete = _.get(model, 'config.rest.multiDelete');

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
		.patch(function (req, res, next) {
			if (!(multiUpdate || req.params.id)) {
				return res.status(400).json({
					error: { name: 'missingId', message: 'A valid id is required in the url path' }
				});
			}

			req.params.id && (req.query._id = req.params.id);

			return model.updateOne(req.query, { $set: req.body }, function (err, result) {
				return err ? next(err) : res.json({ [req.query._id ? lCase : plural]: result });
			});
		})
		// Delete
		.delete(function (req, res, next) {
			if (!(multiDelete || req.params.id)) {
				return res.status(400).json({
					error: { name: 'missingId', message: 'A valid id is required in the url path' }
				});
			}

			req.params.id && (req.query._id = req.params.id);

			return model.removeOne(req.query, function (err, result) {
				return err ? next(err) : res.json({ [req.query._id ? lCase : plural]: result });
			});
		});
});

module.exports = router;
