const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
  resolve: {
    fallback: {
      path: false,
      fs: false,
      crypto: false,
    },
  },
};
