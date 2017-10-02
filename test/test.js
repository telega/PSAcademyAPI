require('dotenv').config();

var Course = require('../app/models/course');
var User = require('../app/models/user');
const mongoose = require('mongoose');


const request = require('supertest');
const chaiHttp = require('chai-http');

// clean db (drop stuff)

Course.collection.drop();
User.collection.drop();

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

// const courseController = require('../app/controllers/course-controller');

let chai = require('chai');

let server = require('../server');
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
	var testUser = new User();

	testUser.local.email = accountDetails.email;
	testUser.local.password = testUser.generateHash(accountDetails.password);
	testUser.local.profile.firstName = 'Test';
	testUser.local.profile.lastName = 'User';
	testUser.local.role = accountDetails.role;


	testUser.save((err)=>{
		if(err){
			throw err;
		}
		done(testUser);
	});

}




function createTestCourse(done){

	var testModule = {
		name : 'TestModule',
		description: 'Test Module'
	};

	var testUnit = {
		name : 'TestUnit',
		description: 'Test Unit',
		modules: [testModule]
	};

	var testCourse = new Course();
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

// Tests for API routes

/// Academy related routes

describe('API Backend Routes', ()=>{

	
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

		it('it should render the All Users admin page on /admin/users GET', (done) => {
		
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


		it('it should render the All courses admin page on /admin/courses GET', (done) => {
		
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

});

// User Routes
describe('User Routes', ()=>{

	describe('User Progress Routes', ()=>{
	
		it('it should add the course to the user on /api/progress/:user_id/courses/:course_id PUT', (done) => {
	
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
	
		it('it should 422  with invalid course id on /api/progress/:user_id/courses/:course_id PUT', (done) => {
	
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

		it('it should 422  with invalid user id on /api/progress/:user_id/courses/:course_id PUT', (done) => {
	
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
	
								
								res.body.academyProgress.should.be.an('array');
	
								let ap = res.body.academyProgress;
								ap.forEach(function(item){
									item.itemCompleted.should.equal(true);
								});
	
								//clean up
								deleteTestCourse(testCourse._id);
								deleteTestUser(testUser._id);
								done();
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

});
