const fs = require('fs-extra');
const packageJson = require('../package.json');

const version = packageJson.version;


fs.outputFileSync('dist/application/version.txt', version);

console.log(`Versión creada: ${version}`);
