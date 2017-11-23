const path = require('path');
const webpackConfig = require('./webpack.config');

// Update prod config to write files to the tmp folder which is ignored by git
module.exports = function (env) {
    webpackConfigObj = webpackConfig(env);
    webpackConfigObj.output.path = path.join(process.cwd(), "tmp/docs");
    return webpackConfigObj;
};
