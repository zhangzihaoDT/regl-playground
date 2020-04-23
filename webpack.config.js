// webpack.config.js
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: {
    home: path.join(__dirname, "src", "js", "index.js"),
    "one-shot-rendering": path.join(
      __dirname,
      "src",
      "js",
      "one-shot-rendering.js"
    ),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
    sourceMapFilename: "[file].map",
  },
  module: {
    rules: [
      // rule for .js/.jsx files
      {
        test: /\.(js|jsx)$/,
        include: [path.join(__dirname, "js", "src")],
        exclude: [path.join(__dirname, "node_modules")],
        use: {
          loader: "babel-loader",
        },
      },
      // rule for css files
      {
        test: /\.css$/,
        include: path.join(__dirname, "src", "css"),
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader",
        }),
      },
      {
        test: /\.glsl$/,
        use: [
          {
            loader: "webpack-glsl-loader",
          },
        ],
      },
    ],
  },
  mode: "development",
  target: "web",
  devtool: "inline-source-map",
  plugins: [
    new BundleAnalyzerPlugin(),

    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "templates", "index.html"),
      hash: true,
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      template: path.join(
        __dirname,
        "src",
        "templates",
        "one-shot-rendering.html"
      ),
      hash: true,
      filename: "one-shot-rendering.html",
    }),
    new ExtractTextPlugin("[name].bundle.css"),
  ],
  devServer: {
    host: "localhost",
    port: 8080,
    contentBase: path.join(__dirname, "dist"),
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
};
