import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: "index.js",
        output: [
            {
                file: "dist/mime.mjs",
                format: "esm"
            }
        ],
        plugins: [commonjs()]
    },
    {
        input: "lite.js",
        output: [
            {
                file: "dist/lite.mjs",
                format: "esm"
            }
        ],
        plugins: [commonjs()]
    }
];
