import nodeResolve from 'rollup-plugin-node-resolve';

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
        })
    ],
};