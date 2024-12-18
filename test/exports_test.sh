#!/usr/bin/env bash
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TESTDIR="/tmp/mime_test"

echo -e "\n\nExports test"
\rm -fr $TESTDIR
mkdir -p $TESTDIR

echo "... building tarball"
cd $SCRIPT_DIR/..
npm pack --ignore-scripts --silent --pack-destination $TESTDIR > /dev/null 2>&1

echo ... installing tarball
cd $TESTDIR
npm install --silent mime*.tgz

echo "... testing imports"
node --input-type=module --no-warnings - << EOF
  import mime from "mime";
  import mimelite from "mime/lite";
  import standard from "mime/types/standard.js";
  import other from "mime/types/other.js";
  import pkg from "mime/package.json" with {type: 'json'};
EOF

echo "... cleanup"
# Cleanup
\rm -fr $TESTDIR

echo "... done"