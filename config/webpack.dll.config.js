const Path = require('path');
const Webpack = require('webpack');

module.exports = {
    entry: {
        ngs: ['angular', 'angular-resource', 'angular-sanitize', '@uirouter/angularjs',
            'angular-animate', 'angular-touch', 'angular-cookies'
        ],
        ngui: ['jquery', 'sweetalert', 'datetimepickerCN', 'datetimepicker', 'angular-loading-bar', 'angular-strap', 'angular-ui-grid', 'ui-select',
            'angular-ui-tour', 'angular-ui-tree', 'angular-validation', 'angular-carousel'
        ],
        base: ['babel-polyfill', 'lodash']
    },
    output: {
        path: Path.join(__dirname, '../dll'),
        filename: '[name].dll.js',
        library: '[name]'
    },
    plugins: [
        new Webpack.DllPlugin({
            path: Path.join(__dirname, '../dll/manifest/', '[name].manifest.json'),
            name: '[name]'
        })
    ]
};