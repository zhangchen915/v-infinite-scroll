import nodeResolve from 'rollup-plugin-node-resolve';
import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/index.js',
    output: [{
        file: 'dist/lazy-load.esm.js',
        format: 'esm',
    },{
        name:'lazy',
        file: 'dist/lazy-load.umd.js',
        format: 'umd',
    }],
    plugins: [
        nodeResolve({
            jsnext: true
        }),
        commonjs(),
        vue()
    ],
};