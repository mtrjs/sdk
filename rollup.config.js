const typescript = require('@rollup/plugin-typescript');
const clear = require('rollup-plugin-clear');
const terser = require('@rollup/plugin-terser');
const nodeResolve = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const babel = require('@rollup/plugin-babel');

module.exports = {
  input: 'core/index.ts',
  output: [
    {
      file: 'monitor.js',
      name: 'monitor',
      format: 'umd',
      sourcemap: false,
    },
    {
      file: 'monitor.min.js',
      name: 'monitor',
      format: 'umd',
      sourcemap: false,
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript(),
    json(),
    clear({
      targets: ['./monitor.js', './monitor.min.js'],
      watch: true, // default: false
    }),
    nodeResolve(),
    babel({ babelHelpers: 'bundled' }),
  ],
};
