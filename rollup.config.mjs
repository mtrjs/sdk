import clear from 'rollup-plugin-clear';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import ts from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      name: 'monitor',
      format: 'umd',
      sourcemap: false,
      exports: 'named',
    },
    {
      file: 'dist/index.min.js',
      name: 'monitor',
      format: 'umd',
      sourcemap: false,
      plugins: [terser()],
      exports: 'named',
    },
    {
      file: 'dist/index.es.js',
      name: 'monitor',
      format: 'es',
      plugins: [terser()],
      sourcemap: false,
    },
  ],
  plugins: [
    clear({
      targets: ['dist'],
      watch: true, // default: false
    }),
    json(),
    ts(),
    commonjs(),
    nodeResolve(),
    babel({ babelHelpers: 'bundled' }),
  ],
};
