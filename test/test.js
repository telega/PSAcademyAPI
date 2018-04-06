/* eslint-disable */
require('dotenv').config();

var Course = require('../app/models/course');
var User = require('../app/models/user');
var Feedback = require('../app/models/feedback');
var Academy = require('../app/models/academy');
var GlossaryTerm = require('../app/models/glossary');

const mongoose = require('mongoose');

const request = require('supertest');
const chaiHttp = require('chai-http');
 
// clean db (drop stuff)

let dbUrl = process.env.TEST_DB;
mongoose.connect(dbUrl, { useMongoClient:true}, function(err){
	if(err){
		console.log(err);
	}
	mongoose.connection.db.dropDatabase();
});


// test options
let theAdminAccount = {
	'email': 'myadminuser@mytestuser.com',
	'password': 'testuserpassword',
	'role': 'Admin'
};

let theUserAccount = {
	'email': 'mytestuser@mytestuser.com',
	'password': 'testuserpassword',
	'role': 'Member'
};

let theOtherUserAccount = {
	'email': 'mytestuser2@mytestuser.com',
	'password': 'testuserpassword',
	'role': 'Member'
};

// const courseController = require('../app/controllers/course-controller');

let server = require('../server');

let chai = require('chai');
let should = chai.should();

chai.use(chaiHttp);


// Auxiliary functions .
function createLoginCookie(s, loginDetails, done) {
	request(s)
		.post('/login')
		.send(loginDetails)
		.end(function(error, response) {
			if (error) {
				console.log(error);
			}
			var loginCookie = response.headers['set-cookie'];
			done(loginCookie);
		});
}

function createTestUser(accountDetails, done){

	// create the test User
	let testUser = new User();

	testUser.local.email = accountDetails.email;
	testUser.local.password = testUser.generateHash(accountDetails.password);
	testUser.local.profile.firstName = 'Test';
	testUser.local.profile.lastName = 'User';
	testUser.local.role = accountDetails.role;
	testUser.generateUserName().then((un) =>{
		testUser.local.profile.userName = un;

		testUser.save((err)=>{
			if(err){
				throw err;
			}
			done(testUser);
		});
	});

}

function createTestFeedback(done){

	let testFeedback = new Feedback();
	testFeedback.title = ' A Test Feedback Item';
	testFeedback.description = 'The feedback description';

	testFeedback.save(function(err){
		if(err){
			throw err;
		}
		done(testFeedback);
	});
}

function deleteTestFeedback(feedbackId){
	Feedback.remove({_id:feedbackId}, (err)=>{
		if(err){
			throw err;
		}
	});
}


function createTestCourse(done){

	let testModule = {
		name : 'TestModule',
		description: 'Test Module'
	};

	let testUnit = {
		name : 'TestUnit',
		description: 'Test Unit',
		modules: [testModule]
	};

	let testCourse = new Course();
	testCourse.name = 'TestCourse2';
	testCourse.description = 'Test Course';
	testCourse.published = true;
	testCourse.units = [testUnit];

	testCourse.save(function(err){
		if(err){
			throw err;
		}
		done(testCourse);
	});
}

function createBigTestCourse(done){

	let testModule = {
		name : 'Big TestModule',
		description: 'Test Module'
	};

	let testModule2 = {
		name : 'TestModule2',
		description: 'Test Module 2',
		type: 'Quiz'
	};

	let testModule3 = {
		name : 'TestModule3',
		description: 'Test Module 3'
	};

	let testUnit = {
		name : 'Big TestUnit',
		description: 'Test Unit',
		modules: [testModule, testModule2]
	};

	let testUnit2 = {
		name : 'TestUnit2',
		description: 'Test Unit2',
		modules: [testModule3]
	};

	let testCourse = new Course();
	testCourse.name = 'TestCourse2';
	testCourse.description = 'Test Course';
	testCourse.published = true;
	testCourse.units = [testUnit, testUnit2];

	testCourse.save(function(err){
		if(err){
			throw err;
		}
		done(testCourse);
	});
}

function deleteTestCourse(courseId){
	Course.remove({_id:courseId}, (err)=>{
		if(err){
			throw err;
		}
	});
}

function deleteTestUser(userId){

	User.remove({_id: userId}, (err)=>{
		if(err){
			console.log(err);
		}

	});

}

function createTestGlossaryTerm(done){

	let testGlossaryTerm = new GlossaryTerm();
	testGlossaryTerm.heading = 'Test Term Heading';
	testGlossaryTerm.definition = 'Test Term Definition';
	testGlossaryTerm.moreLink = 'http://www.google.com';
	testGlossaryTerm.anchorLink = testGlossaryTerm.generateDefaultAnchor();

	testGlossaryTerm.save(function(err){
		if(err){
			throw err;
		}
		done(testGlossaryTerm);
	});
}

function deleteTestGlossaryTerm(termId){
	GlossaryTerm.remove({_id: termId}, (err)=>{
		if(err){
			console.log(err)
		}
	})

}

// Tests for API routes

/// Academy related routes

describe('API Backend Routes', ()=>{

	
	
// Courses	

	describe('Courses', () =>{

		it('Should list the courses on /api/courses GET', (done) => {
			request(server)
				.get('/api/courses')
				.end((err,res)=>{
					res.should.have.status(200);
					res.body.should.be.an('array');
					done();
				});
		});


		it('Should list the course with specified ID on /api/course/:course_id GET', (done) => {
	
			createTestCourse(function(course){
				request(server)
					.get('/api/courses/' + course._id)
					.end((err,res)=>{
						res.should.have.status(200);
						res.should.be.json;
						deleteTestCourse(course._id);
						done();
					});
			
			});
		});


		it('Should not accept the course without name on /api/courses POST', (done)=>{

			createTestUser(theAdminAccount,function(testUser){

				createLoginCookie(server, theAdminAccount, function(cookie) {

					request(server)
						.post('/api/courses')
						.set('cookie', cookie)
						.send({
						})
						.end((err,res)=>{
							res.should.have.status(422);
							res.should.be.json;
	
							deleteTestUser(testUser._id);

							done();
						});
				});	


			});

		});

		it('Should post a new course on /api/courses POST', (done)=>{

			createTestUser(theAdminAccount,function(testUser){

				createLoginCookie(server, theAdminAccount, function(cookie) {
	
					request(server)
						.post('/api/courses')
						.set('cookie', cookie)
						.send({
							name: 'TestCourse',
							description: 'description',
							order: 99
						})
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.json;
							
							deleteTestUser(testUser._id);

							done();
						});
				});	

			});

		});

		it('Should delete a course on /api/courses/:course_id DELETE', (done)=>{

			createTestUser(theAdminAccount,function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
	
					Course.findOne({ name: 'TestCourse'}, function (err,course){
						let id = course._id;
						
						request(server)
							.delete('/api/courses/' + id)
							.set('cookie', cookie)
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;

								deleteTestUser(testUser._id);

								done();
							});
	
					});
	
				});
			});
		});


		it('Should render the All courses admin page on /admin/courses GET', (done) => {
		
			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
		
					request(server)
						.get('/admin/courses')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;

							deleteTestUser(testUser._id);

							done();
						});
				});	
			});
		});

	});


	// Users

	describe('Users', () =>{

	it('Should render the All Users admin page on /admin/users GET', (done) => {
		
		createTestUser(theAdminAccount, function(testUser){

			createLoginCookie(server, theAdminAccount, function(cookie) {
	
				request(server)
					.get('/admin/users')
					.set('cookie', cookie)
					.end((err,res)=>{
						res.should.have.status(200);
						res.should.be.html;

						deleteTestUser(testUser._id);

						done();
					});
			});	
		});
	});

	it('Should render the user details admin page on /admin/users/:user_id GET', (done) => {
	
		createTestUser(theAdminAccount, function(testUser){

			createTestCourse(function(testCourse){

				let moduleAcademyProgress = {
					itemId: testCourse._id,
					itemProgress: 100,
					itemCompleted: true,
					itemType: 'Course',
					relatedItem: testCourse._id
				};

				testUser.local.academyProgress.push(moduleAcademyProgress);

				testUser.save();

				createLoginCookie(server, theAdminAccount, function(cookie) {
		
					request(server)
						.get('/admin/users/' + testUser._id)
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;

							//cleanup
							deleteTestUser(testUser._id);

							deleteTestCourse(testCourse._id);
							done();
						});
				});	
			});
		});
	});
	})

	// Search

	describe('Search', () =>{

		it('Should return search JSON on /api/search GET', (done) => {
			request(server)
				.get('/api/search')
				.end((err,res)=>{
					res.should.have.status(200);
					res.should.be.json;
					done();
				});
		});

		it('Should return search results page on /search GET', (done) => {
			request(server)
				.get('/search')
				.end((err,res)=>{
					res.should.have.status(200);
					res.should.be.html;
					done();
				});
		});

		it('Should return search results page /search POST', (done) => {
			request(server)
				.post('/search')
				.end((err,res)=>{
					res.should.have.status(200);
					res.should.be.html;
					done();
				});
		});
	})


// Academy Options	

	describe('Academy Options Routes(Admin)', (done)=>{

		it('Should render the Academy options  page on /admin/academy GET', (done) => {

			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
		
					request(server)
						.get('/admin/academy')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;

							deleteTestUser(testUser._id);

							done();
						});
				});	
			});

		});


		it('Should reject empty request /admin/academy PUT', (done) => {

			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
		
					request(server)
						.put('/admin/academy')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(422);
							res.should.be.json;

							deleteTestUser(testUser._id);

							done();
						});
				});	
			});

		});

// Feedback

		it('Should update the options /feedback/courses PUT', (done) => {

			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
		
					request(server)
						.put('/admin/academy')
						.set('cookie', cookie)
						.send({
							academyIntroText:'testtitle',
							academyNewsHeadline: 'testheadline',
							academyNewsText:'testnewstext',
							academyHomeCta:'testcta'
						})
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.json;

							Academy.findOne({}).exec()
								.then((academyOptions)=>{ 
									academyOptions.academyIntroText.should.equal('testtitle');
									academyOptions.academyNewsHeadline.should.equal('testheadline');
									academyOptions.academyNewsText.should.equal('testnewstext');
									academyOptions.academyHomeCta.should.equal('testcta');
									
									deleteTestUser(testUser._id);
									done();
								})
								.catch((err)=>{console.log(err);})

						});
				});	
			});

		});

	});


// Glossary	

	describe('Glossary Routes (Admin)', (done)=>{
		it('Should render the glossary admin page on /admin/glossary GET', (done)=>{
			
			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
		
					request(server)
						.get('/admin/glossary')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;

							deleteTestUser(testUser._id);

							done();
						});
				});	
			});
		})

		it('Should respond 422 if heading is missing on /admin/glossary POST', (done)=>{
			
			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
		
					request(server)
						.post('/admin/glossary')
						.set('cookie', cookie)
						.send({})
						.end((err,res)=>{
							res.should.have.status(422);
							res.should.be.json;

							deleteTestUser(testUser._id);

							done();
						});
				});	
			});
		})

		it('Should greate a new glossary entry on /admin/glossary POST', (done)=>{
			
			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
		
					request(server)
						.post('/admin/glossary')
						.set('cookie', cookie)
						.send({
							heading: 'Test Heading'
						})
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.json;
							deleteTestUser(testUser._id);
							deleteTestGlossaryTerm(res.body.data._id)

							done();
						});
				});	
			});
		})

		it('Should render a single glossary term admin page on /admin/glossary/:term_id GET', (done)=>{
			
			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
					
					createTestGlossaryTerm(function(testGlossaryTerm){
						request(server)
							.get('/admin/glossary/' + testGlossaryTerm._id)
							.set('cookie', cookie)
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.html;

								deleteTestUser(testUser._id);
								deleteTestGlossaryTerm(testGlossaryTerm._id);

								done();
							});
					});
				});	
			});
		})

		it('Should delete a single glossary term admin page on /admin/glossary/:term_id DELETE', (done)=>{
			
			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
					
					createTestGlossaryTerm(function(testGlossaryTerm){
						request(server)
							.delete('/admin/glossary/' + testGlossaryTerm._id)
							.set('cookie', cookie)
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;

								deleteTestUser(testUser._id);
								deleteTestGlossaryTerm(testGlossaryTerm._id);
								
								done();
							});
					});
				});	
			});
		})

		it('Should update a single glossary term admin page on /admin/glossary/:term_id PUT', (done)=>{
			
			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
					
					createTestGlossaryTerm(function(testGlossaryTerm){
						request(server)
							.put('/admin/glossary/' + testGlossaryTerm._id)
							.set('cookie', cookie)
							.send({
								headline: 'test',
								description:'test',
								moreLink:'test',
								anchorLink:'test'
							})
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;

								deleteTestUser(testUser._id);
								deleteTestGlossaryTerm(testGlossaryTerm._id);
								
								done();
							});
					});
				});	
			});
		})
		

	})

// Feedback

	describe('Feedback Routes (Admin)', (done)=>{

		it('Should render the feedback admin page on /feedback/courses GET', (done) => {
		
			createTestUser(theAdminAccount, function(testUser){
	
				createLoginCookie(server, theAdminAccount, function(cookie) {
		
					request(server)
						.get('/admin/feedback')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;

							deleteTestUser(testUser._id);

							done();
						});
				});	
			});
		});

		it('Should update feedback item on /api/feedback/:feedback_id PUT', (done) => {
		
			createTestUser(theAdminAccount, function(testUser){
	
				createTestFeedback((feedBack)=>{

					createLoginCookie(server, theAdminAccount, function(cookie) {
			
						request(server)
							.put('/api/feedback/' + feedBack._id)
							.set('cookie', cookie)
							.send({
								title: 'NEW',
								description: 'NEW',
								published: false
							})
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;

								Feedback.findOne({}).exec()
									.then((fb)=>{
										fb.title.should.equal('NEW');
									}).then(()=>{
										Feedback.remove({_id: feedBack._id}).exec()
											.catch((err)=>console.log(err));
									});

								//clean up
	
								deleteTestUser(testUser._id);
	
								done();
							});
					});	
				});
			});
		});

		it('it should delete feedback item  on /api/feedback/:feedback_id DELETE', (done) => {
		
			createTestUser(theAdminAccount, function(testUser){
	
				createTestFeedback((feedBack)=>{

					createLoginCookie(server, theAdminAccount, function(cookie) {
			
						request(server)
							.delete('/api/feedback/' + feedBack._id)
							.set('cookie', cookie)
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;
	
								deleteTestUser(testUser._id);
	
								done();
							});
					});	
				});
			});
		});

	});

});

// User Routes
describe('User Routes', ()=>{

	// General rendering of pages

	describe('General Page Rendering', ()=>{

		it('Courses /courses GET', (done)=>{

			createTestUser( theUserAccount, function(testUser){
				createLoginCookie(server, theUserAccount, function(cookie) {
	
					request(server)
						.get('/courses')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;
							//clean up
							deleteTestUser(testUser._id);
							done();
													
						});
				});	

			});
		});

		it('Course Page /courses/:course_id GET', (done) => {
			createTestCourse(function(course){
				createTestUser( theUserAccount, function(testUser){
					createLoginCookie(server, theUserAccount, function(cookie) {
						request(server)
							.get('/courses/' + course._id)
							.set('cookie',cookie)
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.html;
							
								deleteTestCourse(course._id);
								deleteTestUser(testUser._id);
								done();
							});
					});
				});	
			});
		});

		it('Profile /profile GET', (done)=>{

			createTestUser( theUserAccount, function(testUser){
				createLoginCookie(server, theUserAccount, function(cookie) {
	
					request(server)
						.get('/profile')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;
						
							//clean up
							deleteTestUser(testUser._id);

							done();
						});
				});	

			});
		});

		it('Leaderboard /leaderboard GET', (done)=>{

			createTestUser( theUserAccount, function(testUser){
				createLoginCookie(server, theUserAccount, function(cookie) {
	
					request(server)
						.get('/leaderboard')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;
						
							//clean up
							deleteTestUser(testUser._id);

							done();
						});
				});	

			});
		});

		it('Feedback /feedback GET', (done)=>{

			createTestUser( theUserAccount, function(testUser){
				createLoginCookie(server, theUserAccount, function(cookie) {
	
					request(server)
						.get('/feedback')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;
						
							//clean up
							deleteTestUser(testUser._id);

							done();
						});
				});	

			});
		});
	
		it('Glossary /glossary GET (logged in)', (done)=>{

			createTestUser( theUserAccount, function(testUser){
				createLoginCookie(server, theUserAccount, function(cookie) {
	
					request(server)
						.get('/glossary')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.html;
						
							//clean up
							deleteTestUser(testUser._id);

							done();
						});
				});	

			});
		});

		it('Glossary /glossary GET (not logged in)', (done)=>{

			request(server)
				.get('/glossary')
				.end((err,res)=>{
					res.should.have.status(200);
					res.should.be.html;
			
					done();
				});
		});	

	
	
	
	})	

	// Use Progress
	describe('User Progress Routes', ()=>{
	
		it('Should add the course to the user on /api/progress/:user_id/courses/:course_id PUT', (done) => {
	
			createTestUser( theUserAccount, function(testUser){
	
				createTestCourse(function(testCourse){
	
					createLoginCookie(server, theUserAccount, function(cookie) {
	
						request(server)
							.put('/api/progress/' + testUser._id + '/courses/' + testCourse._id)
							.set('cookie', cookie)
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;
	
								//clean up
								deleteTestCourse(testCourse._id);
								deleteTestUser(testUser._id);
								done();
							});
					});	
	
				});
	
			});
	
		});

		it('Should check the academy progress and update the users score', (done) => {
	
			createTestUser( theUserAccount, function(testUser){
	
				createTestCourse(function(testCourse){
					var testUnit = testCourse.units[0];
					var testModule = testCourse.units[0].modules[0];
	
					createLoginCookie(server, theUserAccount, function(cookie) {
	
						request(server)
							.put('/api/progress/' + testUser._id + '/courses/' + testCourse._id + '/units/' + testUnit._id + '/modules/' + testModule._id)
							.set('cookie', cookie)
							.send({
								itemProgress: 100,
								itemCompleted: true
							})
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;
								Course.find({}).exec()
									.then((courses)=>{
										User.findOne({_id: testUser._id.toString()}).exec()
											.then((u)=>{
												u.local.academyProgress = u.checkAcademyProgressItems(courses);

												return u.save();
											})
											.then((u)=>{
												u.local.academyScore = u.updateUserAcademyScore();
												return u.save();
											})
											.then((u)=>{
												u.local.academyProgress.forEach(function(ip){
													ip.relatedItem[0].should.be.an('object');
												});
												u.local.academyScore.should.equal(6);
											})
											.then(()=>{
												User.remove({_id: testUser._id}).exec()
													.then(()=>{
														//cleanup
														deleteTestCourse(testCourse._id);
														done();
													});
													
											})
											.catch((err)=>console.log(err));
									});
							});
					});	
	
				});
	
			});
	
		});


		it('Should check the users academy ranking, which should be greater than 0', (done) => {
	
			createTestUser( theUserAccount, function(testUser){

				createTestCourse(function(testCourse){
					var testUnit = testCourse.units[0];
					var testModule = testCourse.units[0].modules[0];
	
					createLoginCookie(server, theUserAccount, function(cookie) {
	
						request(server)
							.put('/api/progress/' + testUser._id + '/courses/' + testCourse._id + '/units/' + testUnit._id + '/modules/' + testModule._id)
							.set('cookie', cookie)
							.send({
								itemProgress: 100,
								itemCompleted: true
							})
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;
								Course.find({}).exec()
									.then((courses)=>{
										User.findOne({_id: testUser._id.toString()}).exec()
											.then((u)=>{
												u.local.academyProgress = u.checkAcademyProgressItems(courses);
												return u.save();
											})
											.then((u)=>{
												u.local.academyScore = u.updateUserAcademyScore();
												return u.save();
											})
											.then((u)=>{
												User.find({}).exec()
													.then(function(users){
														u.local.academyRank = u.updateAcademyRank(users);
														return u.save();
													})
													.then((u)=>{
														u.local.academyProgress.forEach(function(ip){
															ip.relatedItem[0].should.be.an('object');
														});
														u.local.academyRank.should.equal(1);
													})
													.then(()=>{
														User.remove({_id: testUser._id}).exec()
															.then(()=>{
																//cleanup
																deleteTestCourse(testCourse._id);
																done();
															});
															
													});
											})
											.catch((err)=>console.log(err));
									});
							});
					});	
	
				});
			});
	
		});
	
		it('Should 422  with invalid course id on /api/progress/:user_id/courses/:course_id PUT', (done) => {
	
			createTestUser( theUserAccount, function(testUser){
	
	
				createLoginCookie(server, theUserAccount, function(cookie) {
					request(server)
						.put('/api/progress/' + testUser._id + '/courses/' + mongoose.Types.ObjectId(null))
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(422);
							res.should.be.json;
							//clean up
							deleteTestUser(testUser._id);
							done();
						});
				});	
	
			
	
			});
	
		});

		it('Should 422  with invalid user id on /api/progress/:user_id/courses/:course_id PUT', (done) => {
	
			createTestUser( theUserAccount, function(testUser){
	
				createTestCourse(function(testCourse){

					createLoginCookie(server, theUserAccount, function(cookie) {
						request(server)
							.put('/api/progress/' + mongoose.Types.ObjectId(null) + '/courses/' + testCourse._id)
							.set('cookie', cookie)
							.end((err,res)=>{
								res.should.have.status(422);
								res.should.be.json;
								//clean up
								deleteTestUser(testUser._id);
								deleteTestCourse(testCourse._id);
								done();
							});
					});	
	
				});
	
			});
	
		});
	
		it('Respond 422 if missing data .../:user_id/courses/:course_id/units/:unit_id/modules/:module_id PUT', (done) => {
	
			createTestUser(theUserAccount, function(testUser){
	
				createTestCourse(function(testCourse){
					var testUnit = testCourse.units[0];
					var testModule = testCourse.units[0].modules[0];
	
					createLoginCookie(server, theUserAccount, function(cookie) {
	
						request(server)
							.put('/api/progress/' + testUser._id + '/courses/' + testCourse._id + '/units/' + testUnit._id + '/modules/' + testModule._id)
							.set('cookie', cookie)
							.end((err,res)=>{
								res.should.have.status(422);
								res.should.be.json;
	
								//clean up
								deleteTestCourse(testCourse._id);
								deleteTestUser(testUser._id);
								done();
							});
					});	
	
				});
	
			});
	
		});
	
	
		it('Progress the user/api/progress/:user_id/courses/:course_id/units/:unit_id/modules/:module_id PUT', (done) => {
	
			createTestUser( theUserAccount, function(testUser){
	
				createTestCourse(function(testCourse){
					var testUnit = testCourse.units[0];
					var testModule = testCourse.units[0].modules[0];
	
					createLoginCookie(server, theUserAccount, function(cookie) {
	
						request(server)
							.put('/api/progress/' + testUser._id + '/courses/' + testCourse._id + '/units/' + testUnit._id + '/modules/' + testModule._id)
							.set('cookie', cookie)
							.send({
								itemProgress: 100,
								itemCompleted: true
							})
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;

								User.findOne({_id: testUser._id.toString()}).exec()
									.then((u)=>{
										u.local.academyProgress.forEach((progressItem)=>{
											progressItem.itemProgress.should.equal(100);
											progressItem.itemCompleted.should.equal(true);
										});
									}).then(()=>{
										User.remove({_id: testUser._id}).exec()
											.then(()=>{
												//cleanup
												deleteTestCourse(testCourse._id);
												done();

											})
											.catch((err)=>console.log(err));
									});

							});
					});	
	
				});
	
			});
	
		});

		it('Partially progress the user /progres/....modules/:module_id PUT', (done) => {
	
			createTestUser( theUserAccount, function(testUser){
	
				createBigTestCourse(function(testCourse){
					var testUnit = testCourse.units[0];
					var testModule = testCourse.units[0].modules[0];
	
	
					createLoginCookie(server, theUserAccount, function(cookie) {
	
						request(server)
							.put('/api/progress/' + testUser._id + '/courses/' + testCourse._id + '/units/' + testUnit._id + '/modules/' + testModule._id)
							.set('cookie', cookie)
							.send({
								itemProgress: 100,
								itemCompleted: true
							})
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;

								User.findOne({_id: testUser._id}).exec()
									.then((u)=>{
										u.local.academyProgress.forEach((progressItem)=>{
											progressItem.itemProgress.should.be.above(10);
										});
									}).then(()=>{
										User.remove({_id: testUser._id}).exec()
											.then(()=>{
												//cleanup
												deleteTestCourse(testCourse._id);
												done();
											})
											.catch((err)=>console.log(err));
									});
								
							});
					});	
	
				});
	
			});
	
		});

		it('Partially progress the user on completing quiz .../progress/ ...unit_id/modules/:module_id PUT', (done) => {
	
			createTestUser( theUserAccount, function(testUser){
	
				createBigTestCourse(function(testCourse){
					var testUnit = testCourse.units[0];
					var testModule = testCourse.units[0].modules[1];
	
	
					createLoginCookie(server, theUserAccount, function(cookie) {
	
						request(server)
							.put('/api/progress/' + testUser._id + '/courses/' + testCourse._id + '/units/' + testUnit._id + '/modules/' + testModule._id)
							.set('cookie', cookie)
							.send({
								itemProgress: 100,
								itemCompleted: true
							})
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;

								User.findOne({_id: testUser._id}).exec()
									.then((u)=>{
										u.local.academyProgress.forEach((progressItem)=>{
											if(progressItem.itemId == (testUnit._id.toString() || testModule._id.toString() )){
												progressItem.itemProgress.should.equal(100);
											}
																				
										});
									}).then(()=>{
										User.remove({_id: testUser._id}).exec()
											.then(()=>{
												//cleanup
												deleteTestCourse(testCourse._id);
												done();
											})
											.catch((err)=>console.log(err));
									});
								
							});
					});	
	
				});
	
			});
	
		});

		it('Gets the progress of the user api/progress/:user_id/courses/:course_id/units/:unit_id GET', (done) => {
	
			createTestUser( theUserAccount, function(testUser){
	
				createTestCourse(function(testCourse){
					var testUnit = testCourse.units[0];
					var testModule = testCourse.units[0].modules[0];
	
					createLoginCookie(server, theUserAccount, function(cookie) {
	
						request(server)
							.get('/api/progress/' + testUser._id + '/courses/' + testCourse._id + '/units/' + testUnit._id )
							.set('cookie', cookie)
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;
		
								//clean up
								deleteTestCourse(testCourse._id);
								deleteTestUser(testUser._id);
								done();
							});
					});	
	
				});
	
			});
	
		});
	
	});

	// users updating their own settings

	describe('User Settings', ()=>{
		it('Should let the User update their own Profile /profile/:user_id PUT', (done)=>{
			createTestUser( theUserAccount, function(testUser){
				createLoginCookie(server, theUserAccount, function(cookie) {
	
					request(server)
						.put('/profile/' + testUser._id)
						.set('cookie', cookie)
						.send({
							itemProgress: 100,
							itemCompleted: true
						})
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.json;
					
							//clean up
							deleteTestUser(testUser._id);

							done();
						});
				});	

			});
		});

		it('Should NOT let the user update any other profile /profile/:user_id PUT', (done)=>{
			createTestUser( theUserAccount, function(testUser){
				createLoginCookie(server, theUserAccount, function(cookie) {
	
					request(server)
						.put('/profile/' + mongoose.Types.ObjectId(null))
						.set('cookie', cookie)
						.send({
							itemProgress: 100,
							itemCompleted: true
						})
						.end((err,res)=>{
							res.should.have.status(401);
							res.should.be.json;
						
							//clean up
							deleteTestUser(testUser._id);

							done();
						});
				});	

			});
		});

	});

	
	describe('Feedback Route', ()=>{
		
		it('should reject empty feedback on /feedback POST', (done)=>{

			createTestUser( theUserAccount, function(testUser){
				createLoginCookie(server, theUserAccount, function(cookie) {
	
					request(server)
						.post('/feedback')
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(422);
							res.should.be.json;
						
							//clean up
							deleteTestUser(testUser._id);

							done();
						});
				});	

			});
		});

		it('should create feedback on /feedback POST', (done)=>{

			createTestUser( theUserAccount, function(testUser){
				createLoginCookie(server, theUserAccount, function(cookie) {
	
					request(server)
						.post('/feedback')
						.set('cookie', cookie)
						.send({
							title: 'Test Feedback Item',
							description: 'This is the description of the feedback Item'
						})
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.json;
						
							//clean up
							deleteTestUser(testUser._id);
							Feedback.remove({ title: 'Test Feedback Item' }).exec()
								.catch((err)=>console.log(err));

							done();
						});
				});	

			});
		});

		it('should update the vote count /feedback/:feedback_id PUT', (done)=>{

			createTestUser( theUserAccount, function(testUser){
				createTestFeedback(function(testFeedback){
					createLoginCookie(server, theUserAccount, function(cookie) {
						request(server)
							.put('/feedback/' + testFeedback._id )
							.set('cookie', cookie)
							.send({
								voteId: testUser._id.toString()
							})
							.end((err,res)=>{
								res.should.have.status(200);
								res.should.be.json;
								
								Feedback.findOne({}).exec()
									.then((fb)=>{
										fb.userVotes.length.should.equal(1);
									}).then(()=>{
										Feedback.remove({_id: testFeedback._id}).exec()
											.catch((err)=>console.log(err));
	
									});

								//clean up
								deleteTestUser(testUser._id);
								
								done();
							});
					});	
				});
			});
		});
	});



});
