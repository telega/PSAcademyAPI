const path = require('path');
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
	devtool:'inline-source-map',
	plugins:[
		new CleanWebpackPlugin(['public']),
		new CopyWebpackPlugin([{from:'assets'}])
	]
};