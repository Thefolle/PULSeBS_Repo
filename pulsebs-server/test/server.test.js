const express = require( 'express' );
const request = require( "supertest" );
const pulsebsDAO = require( '../pulsebsDAO' );
const server = require( "../server" );
const morgan = require( 'morgan' ); // logging middleware
const jwt = require( 'express-jwt' );
const jsonwebtoken = require( 'jsonwebtoken' );
const cookieParser = require( 'cookie-parser' );

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 900; //seconds

// Authorization error
const authErrorObj = {errors: [ {'param': 'Server', 'msg': 'Authorization error'} ]};

//Initializing server
const app = express();
const port = 3001;

app.use( "/", server );

let token;
let session;

beforeAll( ( done ) => {

    const authdata = {
        email: 'davide.calarco@gmail.com',
        password: 'password'
    };

    const response = request( app )
        .post( '/api/login' )
        .send( {email: 'davide.calarco@gmail.com', password: 'password'} )
        .end( ( err, response ) => {
            token = response.body.token;
            done();
        } );
} );


//POST BOOK A SEAT

describe( 'post /api/student/booking', () => {
    it( 'POST should return a 1', async () => {
        const lectureId = 2;

        await request( app )
            .post( '/api/student/booking' )
            .set( 'Cookie', `token=${ token }` )
            .set( 'Content-Type', 'application/json' )
            .send( {lectureId: lectureId} )
            .then( ( res ) => {
                expect( res.status ).toBe( 201 );
                expect( res.body.response ).toBe( 1 );
            } );
    } );

} );


//GET STUDENT LECTURES

describe( 'get /api/student/lectures', () => {
    it( 'should return a 200 if exists', async () => {

        const response = await request( app )
            .get( '/api/student/lectures' )
            .set( 'Cookie', `token=${ token }` )
            .set( 'Content-Type', 'application/json' )
            .set( 'Authorization', `Bearer ${ token }` )
        expect( response.status ).toBe( 200 );
        expect( response.body.length ).toEqual( 4 );
    } );

} );


//GET ALL STUDENT'S BOOKINGS
describe( 'get /api/student/bookings', () => {
    it( 'should return a 200 if exists', async () => {
        
        const response = await request( app )
            .get( '/api/student/bookings' )
            .set( 'Cookie', `token=${ token }` )
            .set( 'Content-Type', 'application/json' )
            .set( 'Authorization', `Bearer ${ token }` )
        expect( response.status ).toBe( 200 );
        expect( response.body.length ).toEqual( 3 );
    } );
} );


//  DELETE cancle the lecture that already booked
describe( '/api/student/bookings/:id', () => {
    it( 'should return a 200 if exists', async () => {

          await request( app )
            .delete( '/api/student/booking/1' )
            .set( 'Cookie', `token=${ token }` )
            .set( 'Content-Type', 'application/json' )
            .then( ( res ) => {
                expect( res.status ).toBe( 201 );
                expect( res.body.response ).toBe( 1 );
            } );
    } );
} );


//app.listen(port, () => console.log(`REST API server listening at http://localhost:${port}`));
