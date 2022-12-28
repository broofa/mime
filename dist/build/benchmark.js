import Benchmark from 'benchmark';
import mime from '../src/index.js';
const suite = new Benchmark.Suite();
const extensions = Object.keys(mime._types);
let idx = 0;
suite
    .add('mime.getType', function () {
    mime.getType(extensions[idx++]);
    if (idx >= extensions.length)
        idx = 0;
})
    .on('cycle', function (event) {
    console.log(String(event.target));
})
    .run();
//# sourceMappingURL=benchmark.js.map