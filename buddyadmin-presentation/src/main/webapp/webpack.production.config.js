const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssNano = require('cssnano');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const baseName = 'buddy';

module.exports = {
	entry: path.join(__dirname, 'app', 'app'),
	output: {
		path: path.join(__dirname, 'dist/'),
		publicPath: 'dist/',
		filename: `${baseName}.[chunkhash].min.js`
	},
	plugins: [
		new CleanWebpackPlugin(['dist', 'index.html']),
		new UglifyJSPlugin({
			include: /\.min\.js$/,
			beautify: true,
			comments: false,
			minimize: true,
			mangle: false,
			compress: {
				warnings: false
			}
		}),
		new ExtractTextPlugin({
			filename: `${baseName}.[chunkhash].min.css`,
			allChunks: true
		}),
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.min\.css$/,
			cssProcessor: cssNano,
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: true
		}),
		new webpack.IgnorePlugin(/\.\/locale$/),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
			DEBUG: false
		}),
		new HtmlWebpackPlugin({
			minify: true,
			template: path.join(__dirname, 'public/index.ejs'),
			filename: path.join(__dirname, 'index.html'),
			alwaysWriteToDisk: true
		}),
		new HtmlWebpackHarddiskPlugin()
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/, /bower_components/],
				use: [
					{
						loader: 'babel-loader'
					}
				]
			},
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract({
					use: 'css-loader'
				})
			},
			{
				test: /\.(jpe?g|png|gif|svg|eot|woff2|woff|ttf)$/i,
				use: 'file-loader?name=public/icons/[name].[ext]'
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'ngtemplate-loader?relativeTo=src'
					},
					{
						loader: 'html-loader',
						options: {
							minimize: true
						}
					}
				]
			}
		]
	}
};
