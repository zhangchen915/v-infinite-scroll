import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: {
        name: 'infiniteScroll',
        file: 'dist/infiniteScroll.js',
        format: 'umd',
    },
    plugins: [
        nodeResolve({
            jsnext: true
        })
    ],
};