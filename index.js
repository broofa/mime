'use strict';

const Mime = require('./Mime');
module.exports = new Mime(require('./types/standard.json'), require('./types/other.json'));
