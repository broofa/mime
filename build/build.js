#!/usr/bin/env node

'use strict';

let fs = require('fs');
let path = require('path');
let mimeScore = require('mime-score');

let db = require('mime-db');
let chalk = require('chalk');

let STANDARD_FACET_SCORE = 900;

let byExtension = {};

// Clear out any conflict extensions in mime-db
for (let type in db) {
  const entry = db[type];
  entry.type = type;
  if (!entry.extensions) continue;

  entry.extensions.forEach(function(ext) {
    let drop;
    let keep = entry;
    if (ext in byExtension) {
      let e0 = entry;
      let e1 = byExtension[ext];

      e0.pri = mimeScore(e0.type, e0.source);
      e1.pri = mimeScore(e1.type, e1.source);

      drop = e0.pri < e1.pri ? e0 : e1;
      keep = e0.pri >= e1.pri ? e0 : e1;

      // Prefix lower-priority extensions with '*'
      drop.extensions = drop.extensions.map(function(e) {
        return e === ext ? '*' + e : e;
      });

      console.log(
        ext + ': Preferring ' + chalk.green(keep.type) + ' (' + keep.pri +
        ') over ' + chalk.red(drop.type) + ' (' + drop.pri + ')' + ' for ' + ext
      );
    }

    // Cache the highest ranking type for this extension
    if (keep === entry) byExtension[ext] = entry;
  });
}

function writeTypesFile(types, path) {
  fs.writeFileSync(path, 'module.exports = ' + JSON.stringify(types) + ';');
}

// Segregate into standard and non-standard types based on facet per
// https://tools.ietf.org/html/rfc6838#section-3.1
let standard = {};
let other = {};

Object.keys(db).sort().forEach(function(k) {
  let entry = db[k];

  if (entry.extensions) {
    if (mimeScore(entry.type, entry.source) >= STANDARD_FACET_SCORE) {
      standard[entry.type] = entry.extensions;
    } else {
      other[entry.type] = entry.extensions;
    }
  }
});

writeTypesFile(standard, path.join(__dirname, '../types', 'standard.js'));
writeTypesFile(other, path.join(__dirname, '../types', 'other.js'));
