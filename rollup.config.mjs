import clear from 'rollup-plugin-clear';
import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import ts from 'rollup-plugin-ts';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'packages/core/index.ts',
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
  ],
  plugins: [
    ts(),
    babel({ babelHelpers: 'bundled' }),
    commonjs(),
    nodeResolve(),
    json(),
    clear({
      targets: ['dist'],
      watch: true, // default: false
    }),
  ],
};
