require('dotenv').config();

var Course = require('../app/models/course');
var User = require('../app/models/user');
const mongoose = require('mongoose');

const test_email = process.env.TEST_EMAIL; 
const test_pw = process.env.TEST_PW;
const request = require('supertest');
// const superagent = require('superagent');
const chaiHttp = require('chai-http');

// let createdCourseID = null;

// let agent = superagent.agent();
let theAccount = {
	'email': test_email,
	'password': test_pw
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

function createTestUser(done){

	// create the test User
	var testUser = new User();

	testUser.local.email = 'mytestuser@mytestuser.com';
	testUser.local.password = 'testuserpassword';
	testUser.local.profile.firstName = 'Test';
	testUser.local.profile.lastName = 'User';


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

describe('API Routes', ()=>{
	
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

			createLoginCookie(server, theAccount, function(cookie) {

				request(server)
					.post('/api/courses')
					.set('cookie', cookie)
					.send({
					})
					.end((err,res)=>{
						res.should.have.status(500);
						res.should.be.json;
						done();
					});
			});	

		});


		it('Should post a new course on /api/courses POST', (done)=>{

			createLoginCookie(server, theAccount, function(cookie) {

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
						done();
					});
			});	

		});


		it('Should delete a course on /api/courses/:course_id DELETE', (done)=>{

			createLoginCookie(server, theAccount, function(cookie) {

				Course.findOne({ name: 'TestCourse'}, function (err,course){
					let id = course._id;
					
					request(server)
						.delete('/api/courses/' + id)
						.set('cookie', cookie)
						.end((err,res)=>{
							res.should.have.status(200);
							res.should.be.json;
							done();
						});

				});

			});

		});

	});

});

// User Progress Routes


describe('User Progress Routes', ()=>{

	it('it should add the course to the user on /api/progress/:user_id/courses/:course_id PUT', (done) => {

		createTestUser( function(testUser){

			createTestCourse(function(testCourse){

				createLoginCookie(server, theAccount, function(cookie) {

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

		createTestUser( function(testUser){


			createLoginCookie(server, theAccount, function(cookie) {
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

	it('Respond 422 if missing data .../:user_id/courses/:course_id/units/:unit_id/modules/:module_id PUT', (done) => {

		createTestUser( function(testUser){

			createTestCourse(function(testCourse){
				var testUnit = testCourse.units[0];
				var testModule = testCourse.units[0].modules[0];

				createLoginCookie(server, theAccount, function(cookie) {

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

		createTestUser( function(testUser){

			createTestCourse(function(testCourse){
				var testUnit = testCourse.units[0];
				var testModule = testCourse.units[0].modules[0];


				createLoginCookie(server, theAccount, function(cookie) {

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

});

// Academy Admin Routes

describe('Admin Routes ', () =>{
	it('it should render the All Users admin page on /admin/users GET', (done) => {
		createLoginCookie(server, theAccount, function(cookie) {

			request(server)
				.get('/admin/users')
				.set('cookie', cookie)
				.end((err,res)=>{
					res.should.have.status(200);
					res.should.be.html;
					done();
				});
		});	
	});
});

