[![Stories in Ready](https://badge.waffle.io/kunagpal/express-boilerplate.png?label=ready&title=Ready)](https://waffle.io/kunagpal/express-boilerplate)
[![Code Climate](https://codeclimate.com/github/kunagpal/express-boilerplate/badges/gpa.svg)](https://codeclimate.com/github/kunagpal/express-boilerplate)
[![Test Coverage](https://codeclimate.com/github/kunagpal/express-boilerplate/badges/coverage.svg)](https://codeclimate.com/github/kunagpal/express-boilerplate/coverage)
[![Issues](https://codeclimate.com/github/kunagpal/express-boilerplate/badges/issue_count.svg)](https://codeclimate.com/github/kunagpal/express-boilerplate/issues)
[![Dependencies](https://david-dm.org/kunagpal/express-boilerplate.svg)](https://david-dm.org/kunagpal/express-boilerplate)
[![devDependencies](https://david-dm.org/kunagpal/express-boilerplate/dev-status.svg)](https://david-dm.org/kunagpal/express-boilerplate#info=devDependencies)
[![Linux build](https://travis-ci.org/kunagpal/express-boilerplate.svg?branch=master)](https://travis-ci.org/kunagpal/express-boilerplate)
[![Windows build](https://ci.appveyor.com/api/projects/status/9dr0pa7wdotlopnu/branch/master?svg=true)](https://ci.appveyor.com/project/kunagpal/express-boilerplate/branch/master)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/352/badge)](https://bestpractices.coreinfrastructure.org/projects/352)
[![Greenkeeper badge](https://badges.greenkeeper.io/kunagpal/express-boilerplate.svg)](https://greenkeeper.io/)

# express-boilerplate

## A project scaffold intended for use with Express.js

### This project is hosted: markdown-style-project-link

### For exhaustive documentation, check out the project [wiki](https://github.com/kunagpal/express-boilerplate/wiki)

### Please report any bugs or issues [here](https://waffle.io/kunagpal/express-boilerplate)

#### Installation instructions

* Install the latest edition of Node.js from [here](https://nodejs.org/en/download/)
* Install the latest version of MongoDB from [here](https://www.mongodb.org/downloads#production)
* Install all dependencies with `npm i --silent`
* Create a file `.env` in the root directory with the following contents:

```
GOOGLE_ID=value
GOOGLE_KEY=value
TWITTER_ID=value
TWITTER_KEY=value
FACEBOOK_ID=value
FACEBOOK_KEY=value
EMAIL_PASSWORD=value
COOKIE_SECRET=randomsecretstring
SESSION_SECRET=randomsecretstring
MONGO=mongodb://127.0.0.1:27017/testDb
```

* Start the localhost mongod server via `mongod`
* Run the server locally at port 3000 or "PORT" in process.env with `npm start`
* View the website at `localhost:3000` within your browser

External Requirements:

* A MongoDB instance running locally or valid `MONGO` string in process.env
* Valid social authentication tokens in process.env
* A valid `COOKIE_SECRET` string in process.env for better security (Optional)
* A valid `SENTRY_DSN` token in process.env for Sentry error alerts (optional)
