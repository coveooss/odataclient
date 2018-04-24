const webpack = require("webpack");
const minimize = process.argv.indexOf("--optimize-minimize") !== -1;

var plugins = [];

if (minimize) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  }));
}

const packageName = "[name]";

module.exports = [{
  mode: "production",
  entry: {
    "odata": "./src/Index.ts",
  },
  output: {
    path: require("path").resolve("./bin/js"),
    filename: minimize ? `${packageName}.min.js` : `${packageName}.js`,
    chunkFilename: minimize ? `${packageName}.min.js` : `${packageName}.js`,
    libraryTarget: "umd",
    library: "OData",
    publicPath: "js/",
    devtoolModuleFilenameTemplate: "[resource-path]"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: 'tsconfig.json',
        }
      },
    ]
  },
  plugins: plugins,
  bail: true
}]