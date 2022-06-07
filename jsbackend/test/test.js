
process.env.NODE_ENV = 'test';
const app = require("../app");
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);
describe('/POST auth',()=>{
    it('POS TEST FOR SIGNIN',(done)=>{
        const res = {
            "email": "dheeraj@gmail.com",
            "password" : "dheeraj1"}
        chai.request(app).post('/signin').send(res).end((err,res) => {
            expect(res).to.have.status(200);
            done();
        });
    }).timeout(10000);
});

describe('',()=>{
    it('NEG TEST FOR SIGNIN',(done)=>{
        const res = {
            "email": "dheeraj@gmail.com",
            "password" : "dheeraj"}
        chai.request(app).post('/signin').send(res).end((err,res) => {
            expect(res).to.have.status(401);
            done();
        });
    }).timeout(10000);
});

// describe('',()=>{
//     it('POS TEST FOR SIGNUP',(done)=>{
//         const res = {
//             "name": "uzumaki",
//             "email": "uzumaki@gmail.com",
//             "password": "uzumaki1"}
//         chai.request(app).post('/signup').send(res).end((err,res) => {
//             expect(res).to.have.status(200);
//             done();
//         });
//     });
// });

describe('',()=>{
    it('NEG TEST FOR SIGNUP',(done)=>{
        const res = {
            "name": "nobita",
            "email": "nobita@gmail.com",
            "password": "nobita"}
        chai.request(app).post('/signup').send(res).end((err,res) => {
            expect(res).to.have.status(400);
            done();
        });
    }).timeout(10000);
});

describe('/POST auth',()=>{
    it('POS TEST FOR GET SINGLE USER',(done)=>{
        chai.request(app).post('/social-login').send().end((err,res) => {
            expect(res).to.have.status(200);
            done();
        });
    }).timeout(10000);
});

describe('/GET posts',()=>{
    it('POS TEST FOR GET all posts',(done)=>{
        chai.request(app).get('/getPosts').send().end((err,res) => {
            expect(res).to.have.status(200);
            console.log(res.body)
            done();
        });
    }).timeout(10000);
});

// describe('/POST auth',()=>{
//     it('POS TEST FOR forgot password',(done)=>{
//         chai.request(app).post('/forgot-password').send().end((err,res) => {
//             expect(res).to.have.status(200);
//             done();
//         });
//     });
// });


describe('/GET posts by UserID',()=>{
    it('POS TEST FOR GET post on ID',(done)=>{

        chai.request(app).get('/getPostsByUser/608e502684564c2e1085b41e').set('Content-Type','application/json').set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDhlNTAyNjg0NTY0YzJlMTA4NWI0MWUiLCJyb2xlIjoic3Vic2NyaWJlciIsImlhdCI6MTYyMTAwMjMzMn0.VwzRtQvTLOTx-xkLRLWH-T51mKAYllHBLz0Eoc_9SjU').end((err,res) => {
            expect(res).to.have.status(200);
            console.log(res.body)
            done();
        });
    }).timeout(10000);
});

describe('/PUT updateUser',()=>{
    it('put for updateUser',(done)=>{
        const req = {
            "name": "dheeraj karnam"
        }
        chai.request(app).put('/updateUser/608e502684564c2e1085b41e').set('Content-Type','application/json').set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDhlNTAyNjg0NTY0YzJlMTA4NWI0MWUiLCJyb2xlIjoic3Vic2NyaWJlciIsImlhdCI6MTYyMTAwMjMzMn0.VwzRtQvTLOTx-xkLRLWH-T51mKAYllHBLz0Eoc_9SjU').type('form').send({'name':'dheeraj kumar karnam'}).end((err,res) => {
            expect(res).to.have.status(200);
            console.log(res.body)
            done();
        });
    }).timeout(10000);
});

describe('/delete user',()=>{
    it('delete a user',(done)=>{
        chai.request(app).delete('/deleteUser/608e502684564c2e1085b41f').set('Content-Type','application/json').set('Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDhlNTAyNjg0NTY0YzJlMTA4NWI0MWUiLCJyb2xlIjoic3Vic2NyaWJlciIsImlhdCI6MTYyMTAwMjMzMn0.VwzRtQvTLOTx-xkLRLWH-T51mKAYllHBLz0Eoc_9SjU').end((err,res) => {
            expect(res).to.have.status(400);
            console.log(res.body)
            done();
        });
    }).timeout(10000);
});