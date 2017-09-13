#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

let db = require('mime-db');
let chalk = require('chalk');

const STANDARD_FACET_SCORE = 900;

// Get a mimetype "score" that can be used to resolve conflicts over extensions
// in a deterministic way.
//
// In case of conflict over an extension, the highest score wins
function getScore(entry) {
  let pri = 0;
  const [type, subtype] = entry.type.split('/');
  const facet = /^([a-z]+\.|x-)/.test(subtype) && RegExp.$1 || undefined;

  // https://tools.ietf.org/html/rfc6838#section-3 defines "facets" that can be
  // used to distinguish standard .vs. vendor .vs. experimental .vs. personal
  // mime types.
  switch (facet) {
    case 'vnd.': pri += 400; break;
    case 'x.': pri += 300; break;
    case 'x-': pri += 200; break;
    case 'prs.': pri += 100; break;
    default: pri += STANDARD_FACET_SCORE;
  }

  // Use mime-db's logic for ranking by source
  switch (entry.source) {
    // Prioritize by source (same as mime-types module)
    case 'iana': pri += 40; break;
    case 'apache': pri += 20; break;
    case 'nginx': pri += 10; break;
    default: pri += 30; break;
  }

  // Prefer application over other types (e.g. text/xml and application/xml, and
  // text/rtf and application/rtf all appear to be respectable mime thingz.  Lovely,
  // right?)
  switch (type) {
    case 'application': pri += 1; break;
    default: break;
  }

  // All other things being equal, use length
  pri += 1 - entry.type.length/100;

  return pri;
}

const byExtension = {};

// Clear out any conflict extensions in mime-db

for (let type in db) {
  let entry = db[type];
  entry.type = type;

  if (!entry.extensions) continue;

  entry.extensions.forEach(ext => {
    if (ext in byExtension) {
      const e0 = entry;
      const e1 = byExtension[ext];
      e0.pri = getScore(e0);
      e1.pri = getScore(e1);

      let drop = e0.pri < e1.pri ? e0 : e1;
      let keep = e0.pri >= e1.pri ? e0 : e1;
      drop.extensions = drop.extensions.filter(e => e !== ext);

      console.log(`${ext}: Keeping ${chalk.green(keep.type)} (${keep.pri}), dropping ${chalk.red(drop.type)} (${drop.pri})`);
    }
    byExtension[ext] = entry;
  });

  //maps[map][key] = extensions;
}

function writeTypesFile(types, path) {
  fs.writeFileSync(path, JSON.stringify(types));
}

// Segregate into standard and non-standard types based on facet per
// https://tools.ietf.org/html/rfc6838#section-3.1
const standard = {};
const other = {};

Object.keys(db).sort().forEach(k => {
  const entry = db[k];

  if (entry.extensions) {
    if (getScore(entry) >= STANDARD_FACET_SCORE) {
      standard[entry.type] = entry.extensions;
    } else {
      other[entry.type] = entry.extensions;
    }
  }
});

writeTypesFile(standard, path.join(__dirname, '../types', 'standard.json'));
writeTypesFile(other, path.join(__dirname, '../types', 'other.json'));

//console.log(JSON.stringify(maps, null, 2));
