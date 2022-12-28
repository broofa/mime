import mimeDB from 'mime-db' assert { type: 'json' };

for (const [type, typeEntry] of Object.entries(mimeDB)) {
  console.log(type);
}

export default mime;
