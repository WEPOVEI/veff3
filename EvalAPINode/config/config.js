var nconf = require('nconf');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

nconf.argv().env();

nconf.file(__dirname + '/env/' + process.env.NODE_ENV + '.json');
module.exports = nconf.stores.file.store;