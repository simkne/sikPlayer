const path = require('path');

// css extraction and minification
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// clean out build dir in-between builds
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = [
  {
    entry: {
      'main': [
        './src/js/main.js',
        './src/sass/main.scss'
      ]
    },
    output: {
      filename: './pub/js/[name].min.js',
      path: path.resolve(__dirname)
    },
    module: {
      rules: [
        // js babelization
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        // sass compilation
        {
          test: /\.(sass|scss)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        // loader for webfonts (only required if loading custom fonts)
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: './pub/assets/fonts/[name][ext]',
          }
        },
        // loader for images and icons (only required if css references image files)
        {
<<<<<<< HEAD
          test: /\.(png|jpg|gif)$/,
=======
          test: /\.(png|jpg|gif|svg)$/,
>>>>>>> 10ac8f5806e334d9bf3423d8fd397976c6a4d8d8
          type: 'asset/resource',
          generator: {
            filename: './pub/assets/img/[name][ext]',
          }
        },
<<<<<<< HEAD
        // loader for images and icons (only required if css references image files)
        {
          test: /\.(svg)$/,
          type: 'asset/resource',
          generator: {
            filename: './pub/assets/img/icons/[name][ext]',
          }
        },
=======
>>>>>>> 10ac8f5806e334d9bf3423d8fd397976c6a4d8d8
      ]
    },
    plugins: [
      // clear out build directories on each build
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          './pub/js/*',  //only the main file, keep vendor files
<<<<<<< HEAD
          './pub/css/*',
          './pub/img/*',
          './pub/img/icons/*'
=======
          './pub/css/*'
>>>>>>> 10ac8f5806e334d9bf3423d8fd397976c6a4d8d8
        ]
      }),
      // css extraction into dedicated file
      new MiniCssExtractPlugin({
        filename: './pub/css/main.min.css'
      }),
      //copy vendor files across as fallback
      new CopyPlugin({
        patterns: [
          { from: "./src/js/vendor/*", to: "./pub/js/vendor/[name][ext]" },
         // { from: "./src/css/*", to: "./pub/css/[name][ext]" },          
          { from: "./src/img/icons/*", to: "./pub/assets/img/icons/[name][ext]" },          
          { from: "./src/img/*", to: "./pub/assets/img/[name][ext]" },          
        ],
      }),
    ],
    optimization: {
      // minification - only performed when mode = production
      minimizer: [
        // js minification - special syntax enabling webpack 5 default terser-webpack-plugin 
        `...`,
        // css minification
        new CssMinimizerPlugin(),
      ]
    },
  }
];
