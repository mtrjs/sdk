const clear = require('rollup-plugin-clear');
const terser = require('@rollup/plugin-terser');
const nodeResolve = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const babel = require('@rollup/plugin-babel');
const ts = require('rollup-plugin-ts');

module.exports = [
  {
    input: 'packages/core/index.ts',
    output: [
      {
        file: 'dist/index.js',
        name: 'monitor',
        format: 'umd',
        sourcemap: false,
      },
      {
        file: 'dist/index.min.js',
        name: 'monitor',
        format: 'umd',
        sourcemap: false,
        plugins: [terser()],
      },
      {
        file: 'dist/index.es.js',
        name: 'monitor',
        format: 'es',
        sourcemap: false,
      },
    ],
    plugins: [
      ts(),
      json(),
      clear({
        targets: ['./index.js', './index.es.js', './index.min.js'],
        watch: true, // default: false
      }),
      nodeResolve(),
      babel({ babelHelpers: 'bundled' }),
    ],
  },
];
