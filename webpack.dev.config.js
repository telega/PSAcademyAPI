const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	mode:'development',
	
	entry: {
		academy: './src/academy/academy.js',
		admin: './src/admin/admin.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'public')
	},
	watchOptions:{
		poll:true
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
		]
	},
	devtool:'inline-source-map',
	plugins:[
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new CleanWebpackPlugin(['public']),
		new CopyWebpackPlugin([{from:'assets'}])
	]
};