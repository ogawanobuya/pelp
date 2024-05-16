const path = require('path');
const { getLoader, loaderByName } = require('@craco/craco');

const packages = [path.join(__dirname, '../repositories')];

module.exports = {
  webpack: {
    configure: (webpackConfig, arg) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName('babel-loader')
      );
      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat(packages);
      }
      return {
        ...webpackConfig,
        resolve: {
          ...webpackConfig.resolve,
          alias: {
            src: path.resolve(__dirname, 'src'),
            ...webpackConfig.resolve.alias
          },
          modules: [path.resolve(__dirname, 'src'), 'node_modules'],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
          fallback: {
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            crypto: require.resolve('crypto-browserify'),
            util: require.resolve('util/')
          }
        },
        module: {
          rules: [
            ...webpackConfig.module.rules,
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              exclude: /node_modules/
            },
            {
              test: /\.ts?$/,
              loader: 'ts-loader',
              exclude: /node_modules/
            }
          ]
        }
      };
    }
  }
};