const express = require( 'express' );

const pulsebsDAO = require( './pulsebsDAO' );
const morgan = require( 'morgan' ); // logging middleware
const jwt = require( 'express-jwt' );
const jsonwebtoken = require( 'jsonwebtoken' );
const cookieParser = require( 'cookie-parser' );
const moment = require( 'moment' );

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 900; //seconds
const bcrypt = require( 'bcrypt' );

const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const { response } = require('express');


// Authorization error
const authErrorObj = {errors: [ {'param': 'Server', 'msg': 'Authorization error'} ]};

checkPassword = function ( user, password ) {
    /*
     The salt used to obfuscate passwords is 0
     console.log('hash:' + bcrypt.hashSync('password', 0));
    */
    return bcrypt.compareSync( password, user.hash );
}

//Initializing server
const app = express();
const port = 3001;

// Set-up logging
app.use( morgan( 'tiny' ) );

// Process body content
app.use( express.json() );

// Transporter needed to send emails
var mailOptions = null;
let transporter = nodemailer.createTransport( {
                                                  service: 'gmail',
                                                  port: 587,
                                                  secure: false, // true for 465, false for other ports
                                                  auth: {
                                                      user: 'noreply.pulsebs@gmail.com',
                                                      pass: 'pswteam9pulsebs',
                                                  },
                                                  tls: {
                                                      rejectUnauthorized: false
                                                  }
                                              } );

// Email sender (each day at 11PM)
const j = schedule.scheduleJob( {hour: 23, minute: 0, second: 0}, () => {
    console.log( 'It is 11PM: sending emails to teachers for tomorrow\'s lessons' );

    // TESTED
    pulsebsDAO.getTomorrowLessonsStats()
              .then( ( lessons ) => {
                  if ( lessons !== 0 ) { // There is at least one lesson
                      lessons.forEach( l => {
                          mailOptions = {
                              from: '"PULSeBS Team9" <noreply.pulsebs@gmail.com>',
                              //to: l.email, // COMMENTED IN ORDER NOT TO SEND EMAILS TO RANDOM PEOPLE IN THE WORLD.
                              to: 'teacher.team9@yopmail.com',
                              subject: 'Tomorrow lesson (' + l.desc + ')',
                              text: "Dear " + l.surname + " " + l.name + " (" + l.id + "), here are some useful informations about tomorrow lesson:\n\n"
                                  + "     - Class: " + l.class + ".\n     - Course: '" + l.desc + "'.\n     - Number of students attending: " + l.nStudents + ".\n\nHave a good lesson.\n\n - PULSeBS Team9."
                          };

                          transporter.sendMail( mailOptions, function ( error, info ) {
                              if ( error ) {
                                  console.log( error );
                              } else {
                                  console.log( 'Email sent to: ' + l.id + ", info: " + info.response );
                              }
                          } );
                      } );
                  } else console.log( "There are no lessons tomorrow." )
              } ).catch(
        ( err ) => {
            console.log( err );
        }
    )
} );

// Authentication endpoint
// TESTED
app.post( '/api/login', ( req, res ) => {
    const email = req.body.email;
    const password = req.body.password;
    pulsebsDAO.getUserByEmail( email )
              .then( ( user ) => {
                  if ( user === undefined ) {
                      res.status( 404 ).send( {
                                                  errors: [ {'param': 'Server', 'msg': 'Invalid e-mail'} ]
                                              } );
                  } else {
                      if ( !checkPassword( user, password ) ) {
                          res.status( 401 ).send( {
                                                      errors: [ {'param': 'Server', 'msg': 'Wrong password'} ]
                                                  } );
                      } else {
                          //AUTHENTICATION SUCCESS
                          const token = jsonwebtoken.sign( {user: user.id}, jwtSecret, {expiresIn: expireTime} );
                          res.cookie( 'token', token, {httpOnly: true, sameSite: true, maxAge: 1000 * expireTime} );
                          res.json( {
                                        id: user.id,
                                        name: user.name,
                                        surname: user.surname,
                                        type: user.type,
                                        token: token
                                    } );
                      }
                  }
              } ).catch(
        // Delay response when wrong user/pass is sent to avoid fast guessing attempts
        ( err ) => {
            console.log( err );
            new Promise( ( resolve ) => {
                setTimeout( resolve, 1000 )
            } ).then( () => res.status( 401 ).json( authErrorObj ) )
        }
    );
} );

app.use( cookieParser() );

/*
 * Unprotected APIs
 */

app.post( '/api/logout', ( req, res ) => {
    res.clearCookie( 'token' ).end();
} );


app.use(
    jwt( {
             secret: jwtSecret,
             getToken: req => req.cookies.token
         } )
);

// To return a better object in case of errors
app.use( function ( err, req, res, next ) {
    if ( err.name === 'UnauthorizedError' ) {
        res.status( 401 ).json( authErrorObj );
    }
} );

/*
 * Protected APIs
 */

const dbError = {
    error: "db",
    description: "Database error"
}

const authError = {
    error: "auth",
    description: "User not authenticated"
}

const validError = {
    error: "validation",
    description: "Data not valid"
}

/*TEACHER */

app.get( '/api/teacher/lectures', ( req, res ) => {
    const user = req.user && req.user.user;
    pulsebsDAO.getTeacherLectures( user )
              .then( ( lectures ) => {
                  res.json( lectures );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'msg': err} ],
                                          } );
              } );
} );

app.get( '/api/getStudentsForLecture', ( req, res ) => {
    const user = req.user && req.user.user;
    pulsebsDAO.getStudentsForLecturev2( user )
              .then( ( students ) => {
                  res.json( students );
              } ).catch( ( err ) => {
        res.status( 500 ).json( {
                                    errors: [ {'msg': err} ],
                                } );
    } );
} );


/****** STUDENT ******/


//GET /student/lectures
app.get( '/api/student/lectures', ( req, res ) => {
    const user = req.user && req.user.user;
    // const user = 269901;
    pulsebsDAO.getStudentLectures( user )
              .then( ( lectures ) => {
                  res.json( lectures );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'msg': err} ],
                                          } );
              } );
} );


//POST /student/booking
app.post( '/api/student/booking', ( req, res ) => {
    const lectureId = req.body.lectureId;
    if ( !lectureId ) {
        res.status( 401 ).end();
    } else {
        const user = req.user && req.user.user;
        pulsebsDAO.bookSeat( lectureId, user )
                  .then( ( response ) => {
                      pulsebsDAO.getLectureStats(lectureId)
                        .then( ( lecture ) => {

                            pulsebsDAO.getInfoByStudentId(user)
                            .then((student) => {
                                var email = student.email;
                                var name = student.name;
                                var surname = student.surname;
                                                            
                                // Send booking email to student
                                mailOptions = {
                                    from: '"PULSeBS Team9" <noreply.pulsebs@gmail.com>',
                                    //to: email, // COMMENTED IN ORDER NOT TO SEND EMAILS TO RANDOM PEOPLE IN THE WORLD
                                    to: 'student.team9@yopmail.com',
                                    subject: 'Booking confirmation (' + lecture.course + ')',
                                    text: "Dear " + name + " " + surname + " (" + user + "), this email is to confirm that you have successfully booked for this lesson:\n\n"
                                        + "     - Course: '" + lecture.course + "'.\n     - Classroom: " + lecture.classroom + ".\n     - Date: " + moment(lecture.date).format("YYYY-MM-DD HH:mm") + ".\n\nHave a good lesson.\n\n - PULSeBS Team9."
                                };

                                transporter.sendMail( mailOptions, function ( error, info ) {
                                    if ( error ) {
                                        console.log( error );
                                    } else {
                                        console.log( 'Email sent to: ' + l.id + ", info: " + info.response );
                                    }
                        } ); 
                            }).catch(( err ) => {
                                console.log( err );
                            });
                        }).catch(( err ) => {
                            console.log( err );
                        });


                      res.status( 201 ).json( {response} )
                  })
                  .catch( ( err ) => {
                      res.status( 500 ).json( {errors: [ {'param': 'Server', 'msg': err} ],} )
                  } );
    }
} );


//GET /student/bookings

app.get( '/api/student/bookings', ( req, res ) => {
    const user = req.user && req.user.user;
    //const user = 269901;
    pulsebsDAO.getStudentBookings( user )
              .then( ( bookings ) => {
                  res.json( bookings );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'msg': err} ],
                                          } );
              } );
} )

// DELETE /student/bookings
app.delete('/api/student/bookings/:id', (req, res) => {
    const bookingId = req.params.id;
    if (!bookingId) {
        res.status(401).end();
    } else{
        // const user = req.user && req.user.user;
        pulsebsDAO.cancelBooking(bookingId)
            .then((response) => res.status(201).json({response}))
            .catch((err) => {
                res.status(500).json({
                    errors: [{'param': 'Server', 'msg': err}],
                });
        });
    }
});


// if ( process.env.TEST && process.env.TEST === '1' )
//     module.exports = app; //uncomment to test
// else
//     app.listen( port, () => console.log( `REST API server listening at http://localhost:${ port }` ) ) //comment to test

// Exported for E2E testing
exports.server = app;
exports.handleToCloseServer = app.listen(port, () => console.log(`REST API server listening at http://localhost:${port}`))