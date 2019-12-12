const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader', 'angular2-template-loader']
            },
            {
                test: /\.(html|css)$/,
                use: 'raw-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new webpack.DefinePlugin({
            config: JSON.stringify({
                apiUrl: 'http://localhost:4000'
            })
        })
    ],
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8082',
                secure: false
            }
        }
    }
}