import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
        name: 'lazy',
        file: 'dist/lazy-load.js',
        format: 'esm',
    },
    plugins: [
        nodeResolve({
            jsnext: true
        })
    ],
};