const User = require('../app/models/user');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.promise = bluebird;
const async = require('async');
const colors = require('colors');
const program = require('commander');

const generateUserNames = (dburl)=>{

	mongoose.connect(dburl, {
		useMongoClient:true
	});

	console.log(colors.red('Generating User Names'));

	User.find({}).cursor()
		.eachAsync((user)=>{

			return user.generateUserName().then((un)=>{
					console.log(colors.cyan(user.local.profile.firstName + ' ' + user.local.profile.lastName + ' => ' + un));
					user.local.profile.userName=un;
					return user.save();
				});

		})
		.then(()=>{
			console.log('done')
			mongoose.connection.close();
		})
		.catch((err)=>{
			console.log(err);
		});


	// User.find({}).exec()
	// 	.then((users)=>{
	// 		let update = users.map((user)=>{
	// 			return user.generateUserName().then((un)=>{
	// 				console.log(colors.cyan(user.local.profile.firstName + ' ' + user.local.profile.lastName + ' => ' + un));
	// 				user.local.profile.userName=un;
	// 				return user.save();
	// 			});
	// 		});

	// 		Promise.all(update).then(()=>{
	// 			console.log('Done');
	// 			mongoose.connection.close();
	// 		});
	// 	})
	// 	.catch((err)=>{
	// 		console.log(err);
	// 	});

};






program
	.version('1.0.0')
	.description('utility to update academy records');

program.command('generateUserNames')
	.alias('guns')
	.description('generate user names for all users.')
	.action((dburl)=>{
		generateUserNames(dburl);
	});


program.parse(process.argv);