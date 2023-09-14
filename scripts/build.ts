#!/usr/bin/env node

import chalk from 'chalk';
import { MimeDatabase, MimeEntry } from 'mime-db';
import mimeScore, { FACET_SCORES } from 'mime-score';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MIME_DB_URL =
  'https://raw.githubusercontent.com/jshttp/mime-db/master/db.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = __dirname.replace(/\/mime\/.*/, '/mime');

if (ROOT_DIR === __dirname) {
  throw new Error('Could not find root directory');
}

type MimeScoreEntry = Omit<MimeEntry, 'extensions'> & {
  extensions: string[]; // redefine this so it's not readonly or optional
  type: string;
  score: number;
};

function normalizeTypes(types: MimeDatabase) {
  const cloned: Record<string, MimeScoreEntry> = {};
  const byExtension: Record<string, MimeScoreEntry> = {};

  let firstWarning = true;
  // Loop through all entries (to clear out )
  for (const [type, mimeEntry] of Object.entries(types)) {
    const { source, extensions } = mimeEntry;

    // Skip entries without extensions
    if (!extensions) continue;

    const scoreEntry = {
      ...mimeEntry,
      extensions: [...extensions],
      type,
      score: mimeScore(type ?? '', source ?? ''),
    } as MimeScoreEntry;

    cloned[type] = scoreEntry;

    // Inspect each extension for this entry
    for (const ext of scoreEntry.extensions) {
      // Compare to extensions|entries we've already visited.  If there's a
      // conflict, keep the higher-scoring one
      let keep = scoreEntry;
      let drop = byExtension[ext];

      if (drop) {
        if ((drop?.score ?? 0) > keep.score) {
          [drop, keep] = [keep, drop];
        }
        // Prefix lower-priority entry with a '*'
        drop.extensions = drop.extensions.map((e) => {
          if (e === ext) return `*${e}`;
          return e;
        });

        if (firstWarning) {
          firstWarning = false;
          console.warn(
            `The following extension conflicts were detected and resolved by preferring the ${chalk.green(
              'green',
            )} type over the ${chalk.red('red')} type based on the ${chalk.bold(
              'mime-score',
            )}.  See https://github.com/broofa/mime-score.\n------`,
          );
        }

        console.log(
          `${ext.padStart(8)}: ${chalk.green(
            keep.type.padEnd(33),
          )} ${keep.score.toFixed(2)}  |  ${chalk.red(drop.type.padEnd(40))} ${
            drop.score
          }`,
        );
      }

      // Cache the highest ranking type for this extension
      byExtension[ext] = keep;
    }
  }

  return cloned;
}

async function writeTypesFile(name: string, types: Record<string, string[]>) {
  const dirpath = path.join(ROOT_DIR, '/types');
  const filepath = path.join(dirpath, `${name}.ts`);
  await mkdir(dirpath, { recursive: true });

  await writeFile(
    filepath,
    `const types : {[key: string]: string[]} = ${JSON.stringify(types)};
Object.freeze(types);
export default types;`,
  );
}

async function main() {
  const mimedb = await fetch(MIME_DB_URL).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch mime-db: ${res.url} ${res.statusText}`);
    }
    return res.json() as Promise<MimeDatabase>;
  });

  const types = normalizeTypes(mimedb);

  // Segregate into standard and non-standard types based on facet per
  // https://tools.ietf.org/html/rfc6838#section-3.1
  const standard: Record<string, string[]> = {};
  const other: Record<string, string[]> = {};

  Object.keys(types)
    .sort()
    .forEach(function (k) {
      const entry = types[k];

      if (entry.extensions) {
        if (mimeScore(entry.type, entry.source) >= FACET_SCORES.default) {
          standard[entry.type] = entry.extensions;
        } else {
          other[entry.type] = entry.extensions;
        }
      }
    });

  await await Promise.all([
    writeTypesFile('standard', standard),
    writeTypesFile('other', other),
  ]);
}

const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  console.error(
    chalk.red(
      `Node 18+ is required to run this script. 'Looks like you're running ${process.versions.node}`,
    ),
  );
  process.exit(1);
}

await main();
