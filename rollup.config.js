import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import uglify from '@lopatnov/rollup-plugin-uglify';

export default [
  {
    input: 'src/index.js',
    output: {
        file: 'lib/sciboard.js',
        name: 'SciBoard',
        format: 'umd',
        sourcemap: true,
        sourcemapFile: 'lib/sciboard.js.map',
    },
    plugins: [
      resolve(),
      babel()
    ],
  },
  {
    input: 'src/index.js',
    output: {
        file: 'lib/sciboard.min.js',
        name: 'SciBoard',
        format: 'umd',
        sourcemap: false,
    },
    plugins: [
      resolve(),
      uglify({
        mangle: {
          properties: true
        }
      }),
      babel()
    ],
  },
];
