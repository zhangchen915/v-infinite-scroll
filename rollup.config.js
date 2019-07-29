import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
        name: 'lazy',
        file: 'dist/lazy-load.js',
        format: 'umd',
    },
    plugins: [
        nodeResolve({
            jsnext: true
        })
    ],
};