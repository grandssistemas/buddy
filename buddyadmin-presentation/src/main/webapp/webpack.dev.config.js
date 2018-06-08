const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const baseName = 'buddy';

module.exports = {
	entry: path.join(__dirname, 'app', 'app'),
	output: {
		path: path.join(__dirname, 'dist/'),
		filename: `${baseName}.min.js`,
		publicPath: '/dist/'
	},
	devtool: 'source-map',
	devServer: {
		inline: true,
		port: 2222,
		host: '0.0.0.0',
		disableHostCheck: true
	},
	plugins: [
		new ExtractTextPlugin({
			filename: `${baseName}.min.css`,
			allChunks: true
		}),
		new webpack.IgnorePlugin(/\.\/locale$/),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development',
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
