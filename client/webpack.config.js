const path = require('path');
const fs = require('fs');

const TerserPlugin = require('terser-webpack-plugin');

const APP_DIR = fs.realpathSync(process.cwd());

const resolveAppPath = relativePath => path.resolve(APP_DIR, relativePath);

module.exports = {
  entry: resolveAppPath('src'),
  output: {
    // TranscriptionWidget : Uncomment the next two lines
    filename: 'transcription-widget.js',
    library: ['recogito', 'TranscriptionWidget'],

    // SenseWidget
    // filename: 'sense-widget.js',
    // library: ['recogito', 'SenseWidget'],
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  performance: {
    hints: false
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat"
    }
  },
  module: {
    rules: [
      { 
        test: /\.(js|jsx)$/, 
        use: { 
          loader: 'babel-loader' ,
          options: {
            "presets": [
              "@babel/preset-env",
              "@babel/preset-react"
            ],
            "plugins": [
              [
                "@babel/plugin-proposal-class-properties"
              ]
            ]
          }
        }
      },
      { test: /\.css$/,  use: [ 'style-loader', 'css-loader'] },
    ]
  }
}