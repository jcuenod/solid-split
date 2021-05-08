import babel from '@rollup/plugin-babel'
const pkg = require('./package.json')

const production = process.env.NODE_ENV === 'production'

export default [
    {
        watch: {
            clearScreen: true,
            exclude: ['node_modules', 'distribution'],
        },
        treeshake: production,
        input: './src/index.js',
        output: [
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: false,
            },
        ],
        plugins: [
            babel({
                presets: ['solid'],
                exclude: /node_modules\//,
            }),
        ],
    },
]
