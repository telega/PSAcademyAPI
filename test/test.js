let mongoose = require('mongoose');
let Course = require('../app/models/course');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('/GET Courses', () =>{
	it('it should GET all the courses', (done) => {
		chai.request(server)
			.get('/api/courses')
			.end((err,res) => {
				res.should.have.status(200);
				res.body.should.be.an('array');
				done();
			})
	})
})