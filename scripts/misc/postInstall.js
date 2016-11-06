var fs = require('fs'),
	path = require('path'),
	childProcess = require('child_process'), // eslint-disable-line security/detect-child-process

	bcryptPath = path.join(__dirname, '..', '..', 'node_modules', 'bcrypt');

if (process.platform === 'win32' && !process.env.APPVEYOR) { // the bcrypt issue is only prevalent on Microsoft Windows
	console.info('Running on a Windows platform, installing bcryptjs instead of bcrypt');
	childProcess.exec('npm i bcryptjs', function () {
		fs.rename(`${bcryptPath}s`, bcryptPath, function () {
			console.info('bcryptjs has been installed to replace bcrypt');
		});
	});
}
