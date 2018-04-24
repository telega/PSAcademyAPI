const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



module.exports = {
	mode:'production',
	entry: {
		academy: './src/academy/academy.js',
		admin: './src/admin/admin.js',
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'public')
	},
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
		]
	},
	devtool:'source-map',
	plugins:[
		new UglifyJSPlugin({
			sourceMap:true
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production')
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new CleanWebpackPlugin(['public']),
		new CopyWebpackPlugin([{from:'assets'}], {ignore:['.DS_Store']}),
		
		//new BundleAnalyzerPlugin()

	]
};