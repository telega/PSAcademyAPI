require('dotenv').config();
console.log(process.env.NODE_ENV);

var Course = require('../app/models/course');

const test_email = process.env.TEST_EMAIL; 
const test_pw = process.env.TEST_PW;
const request = require('supertest');
// const superagent = require('superagent');
const chaiHttp = require('chai-http');

let createdCourseID = null;

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
// Auxiliary function.
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
// Using auxiliary function in test cases.
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

console.log(createdCourseID)
