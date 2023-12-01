#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TESTDIR="/tmp/mime_test"

echo -e "\n\nExports test"
\rm -fr $TESTDIR
mkdir -p $TESTDIR

echo "... building tarball"
cd $SCRIPT_DIR/..
npm pack --silent --pack-destination $TESTDIR > /dev/null 2>&1

echo ... installing tarball
cd $TESTDIR
npm install --silent mime*.tgz

echo "... testing imports"
node --input-type=module - << EOF
  import mime from "mime";
  import mimelite from "mime/lite";

  console.log('okay');
EOF

