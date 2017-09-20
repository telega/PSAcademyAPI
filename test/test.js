require('dotenv').config();
const test_email = process.env.TEST_EMAIL; 
const test_pw = process.env.TEST_PW;
const request = require('supertest');
const superagent = require('superagent');
const chaiHttp = require('chai-http')

let agent = superagent.agent();
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
describe('/GET Courses', () =>{
	it('it should GET all the courses', (done) => {

		request(server)
			.get('/api/courses')
			.end((err,res)=>{
				res.should.have.status(200);
				res.body.should.be.an('array');
				done();
			});
});
});


describe('Admin /GET Users', () =>{
	it('it should GET all the All Users admin page', (done) => {
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

