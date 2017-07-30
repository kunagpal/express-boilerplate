/**
 * @file Houses route definitions for all API routes, prefixed with /api
 */

var fs = require('fs'),

	_ = require('lodash'),
	router = require('express').Router(),

	sortClause = ['asc', 'desc'];

// eslint-disable-next-line no-sync
fs.readdirSync('database').forEach(function (modelName) {
	// bail out if the model does not exist or has restful routing disabled
	if (!_.get(global, [modelName = path.parse(modelName).name, 'config', 'rest', 'enabled'])) { return; }

	var model = global[modelName], // eslint-disable-line security/detect-object-injection
		lCase = _.toLower(modelName),
		plural = utils.pluralize(lCase),
		multiUpdate = _.get(model, 'config.rest.multiUpdate'),
		multiDelete = _.get(model, 'config.rest.multiDelete'),
		onPatchOrDelete = function (req, res, next) {
			return function (err, result) {
				return err ? next(err) : res.json({ [req.query._id ? lCase : plural]: result });
			};
		};

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

			var skip = Number(req.headers['x-api-skip']),
				limit = Number(req.headers['x-api-limit']),
				sort = _(req.headers['x-api-sort']).split(', ').transform(function (result, header) {
					var arr = _.split(header, '=');

					arr[0] && _.includes(sortClause, arr[1]) && result.push(arr);
				}, []).value();

			model.find(req.query).sort(sort).skip(skip).limit(limit).project(req.body).toArray(function (err, result) {
				if (err) { return next(err); }

				return res.json(req.query._id ? { [lCase]: result && result[0] || {} } : { [plural]: result });
			});
		})
		// Update
		.patch(function (req, res, next) {
			if (!(multiUpdate || req.params.id)) {
				return next(utils.error.missingId('A valid id is required in the URL path', 400));
			}

			req.params.id && (req.query._id = req.params.id);

			// eslint-disable-next-line max-len
			return model[`update${multiUpdate ? 'Many' : 'One'}`](req.query, { $set: req.body }, onPatchOrDelete(req, res, next));
		})
		// Delete
		.delete(function (req, res, next) {
			if (!(multiDelete || req.params.id)) {
				return next(utils.error.missingId('A valid id is required in the URL path', 400));
			}

			req.params.id && (req.query._id = req.params.id);

			return model[`remove${multiDelete ? 'Many' : 'One'}`](req.query, onPatchOrDelete(req, res, next));
		});
});

module.exports = router;
