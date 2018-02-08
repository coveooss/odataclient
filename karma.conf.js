const webpackConfig = require("./webpack.config.tests.js");

var configuration = {
    frameworks: ["jasmine"],
    files: [
        { pattern: "tests/**/*.ts" }
    ],
    preprocessors: {
        "src/**/*.ts": ["webpack"],
        "tests/**/*.ts": ["webpack"],
    },
    mime: {
        'text/x-typescript': ['ts', 'tsx'],
    },
    reporters: ["coverage-istanbul", "spec", "junit"],
    coverageIstanbulReporter: {
        dir: "./bin/coverage",
        reports: [
            'cobertura',
            'json',
            'lcov',
            'text-summary'
        ],
        fixWebpackSourcePaths: true
    },
    junitReporter: {
        outputDir: 'bin/UT'
    },
    webpack: webpackConfig,
    browsers:["ChromeHeadless"],
    customLaunchers: {
        ChromeDebugging: {
          base: 'Chrome',
          flags: [ '--remote-debugging-port=9222' ]
        }
    }
};

module.exports = function(config) {
  config.set(configuration);
};