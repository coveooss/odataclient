const webpack = require("webpack");
const webpackConfigs = require('./webpack.config.js');

const componentsConfig = webpackConfigs[0];

componentsConfig.devtool = "inline-source-map";
componentsConfig.module.rules.find(rule => rule.loader == "ts-loader").options = {
    compilerOptions: {
        "inlineSourceMap": true
    },
};
componentsConfig.module.rules.push({
    enforce: "post",
    test: /\.ts$/,
    loader: 'istanbul-instrumenter-loader',
    exclude: [
        'node_modules',
        /\.spec\.ts$/
    ]
});

var plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('test'),
    }),
    new webpack.SourceMapDevToolPlugin({
        filename: null, // if no value is provided the sourcemap is inlined
        test: /\.(ts|js)($|\?)/i // process .js and .ts files only
    })
]
componentsConfig.plugins = plugins;

module.exports = componentsConfig;
