const express = require( 'express' );

const pulsebsDAO = require( './pulsebsDAO' );
const morgan = require( 'morgan' ); // logging middleware
const jwt = require( 'express-jwt' );
const jsonwebtoken = require( 'jsonwebtoken' );
const cookieParser = require( 'cookie-parser' );
const moment = require( 'moment' );

const jwtSecret = '6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX';
const expireTime = 900000; //seconds
const bcrypt = require( 'bcrypt' );

const schedule = require( 'node-schedule' );
const nodemailer = require( 'nodemailer' );


// Authorization error
const authErrorObj = {errors: [ {'param': 'Server', 'message': 'Authorization error'} ]};
const databaseErrorObj = {errors: [ {'param': 'Server', 'message': 'Error during DB execution'} ]};
const dataErrorObj = {errors: [ {'param': 'Server', 'message': 'Data sent is not correct'} ]};

let checkPassword = function ( user, password ) {
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
let mailOptions = null;
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
schedule.scheduleJob( {hour: 23, minute: 0, second: 0}, () => {
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
app.post( '/api/login', ( req, res ) => {
    const email = req.body.email;
    const password = req.body.password;
    pulsebsDAO.getUserByEmail( email )
              .then( ( user ) => {
                  if ( user === undefined ) {
                      res.status( 404 ).send( {
                                                  errors: [ {'param': 'Server', 'message': 'Invalid e-mail'} ]
                                              } );
                  } else {
                      if ( !checkPassword( user, password ) ) {
                          res.status( 401 ).send( {
                                                      errors: [ {'param': 'Server', 'message': 'Wrong password'} ]
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
    res.clearCookie( 'token' ).status( 200 ).end();
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

/*TEACHER */

app.get( '/api/teacher/lectures', ( req, res ) => {
    const user = req.user && req.user.user;
    pulsebsDAO.getTeacherLectures( user )
              .then( ( lectures ) => {
                  res.json( lectures );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'message': err} ],
                                          } );
              } );
} );

//TODO: change this route according to REST best practice
app.get( '/api/teacher/getStudentsForLecture', ( req, res ) => {
    const user = req.user && req.user.user;
    pulsebsDAO.getStudentsForLecturev2( user )
              .then( ( students ) => {
                  res.json( students );
              } ).catch( ( err ) => {
        res.status( 500 ).json( {
                                    errors: [ {'message': err} ],
                                } );
    } );
} );


//API for check authenticated User
app.get( '/api/user', ( req, res ) => {
    const userRequest = req.user && req.user.user;
    pulsebsDAO.getUserById( userRequest )
              .then( ( user ) => {
                  res.json( {
                                id: user.id,
                                name: user.name,
                                surname: user.surname,
                                type: user.type
                            } );
              } ).catch(
        () => {
            res.status( 404 ).json( authErrorObj );
        }
    );
} );

/*
*   Update lecture
*       request body:
*           presence: has to be 0 in order to modify it accordingly; this information is redundant, but it sets the stage in case other
*               properties will be modifiable in future;
*/

app.put( '/api/teachers/:teacherId/lectures/:lectureId', ( req, res ) => {
    //const user = req.user && req.user.user;
    const teacherId = req.params.teacherId;
    const lectureId = req.params.lectureId;
    const presence = req.body.presence;
    if ( presence === 1 ) {
        res.status( 409 ).json( {message: "The lecture cannot be turnt to be in presence."} );
    } else if ( presence !== 0 ) {
        res.status( 422 ).json( {message: "The field presence has to be 0 and, moreover, it is compulsory."} );
    } else {

        pulsebsDAO.turnLectureIntoOnline( lectureId, teacherId ).then( ( information ) => {
            // if success
            res.status( 200 ).json( {
                                        message: "The selected lecture with id " + lectureId + " has been correctly turnt into an online lecture." +
                                            " Students booked for this lecture are going to be immediately informed of the change by email, if any is booked."
                                    } );

            if ( process.env.TEST && process.env.TEST === '0' ) {
                let mailOpts;
                information.map( studentAndLectureInfo => {
                    mailOpts = {
                        from: '"PULSeBS Team9" <noreply.pulsebs@gmail.com>',
                        to: 'student.team9@yopmail.com', // replace this row with studentAndLectureInfo.studentEmail
                        subject: 'Lecture of ' + studentAndLectureInfo.courseDescription + ' has just been turnt to be online',
                        text: "Dear " + studentAndLectureInfo.studentSurname + " " + studentAndLectureInfo.studentName +
                            " (" + studentAndLectureInfo.studentId + ")," +
                            " the lesson of the course " + studentAndLectureInfo.courseDescription + "," +
                            " planned to take place in class " + studentAndLectureInfo.lectureClass +
                            " on " + moment.unix( studentAndLectureInfo.lectureDate ).format( "YYYY-MM-DD HH:mm" ) + "," +
                            " has been just turnt to be online by the teacher." + "\n\n" +
                            "Have a good virtual lesson.\n\n - PULSeBS Team9."
                    };
                    transporter.sendMail( mailOpts, function ( error, info ) {
                        if ( error ) {
                            console.log( "Some error occured in sending the email to " + info.studentEmail + ": " + error );
                        } else {
                            console.log( 'Email sent to: ' + studentAndLectureInfo.studentId + ", info: " + info.response );
                        }
                    } );
                } )
            }

        } ).catch( exitCode => {
            if ( exitCode === -1 ) {
                res.status( 404 ).json( {message: "No lecture exists with id " + lectureId + " ."} );
            } else if ( exitCode === -2 ) {
                res.status( 409 ).json( {message: "The selected lecture with id " + lectureId + " is not active yet."} );
            } else if ( exitCode === -3 ) {
                res.status( 409 ).json( {
                                            message: "The selected lecture with id " + lectureId + " cannot be turnt to be online because " +
                                                "it is starting within 30 minutes as of now."
                                        } );
            } else if ( exitCode === -4 ) {
                res.status( 500 ).json(
                    {
                        message:
                            "Internal error, the lecture has not been turnt into online.\n" +
                            "You can:\n" +
                            "\tRetry this operation\n" +
                            "\tRefresh the page and retry this operation\n" +
                            "\tLog out and log in back and retry this operation\n"
                    }
                );
            }
        } );
    }
} );

app.get( '/api/teachers/:teacherId/statistics/courses/:courseId', ( req, res ) => {
    //const user = req.user && req.user.user;
    const teacherId = req.params.teacherId;
    const courseId = req.params.courseId;
    const groupBy = req.query.groupBy;
    const presence = req.query.presence;

    pulsebsDAO.getTeacherBookingStatistics( teacherId, courseId, groupBy, presence ).then( statistics => {
        res.status( 200 ).json( statistics );
    } ).catch( error => {
        console.log( error );
        res.status( 500 ).end();
    } );
} )

app.get( '/api/teachers/getFromSSN/:ssn', (req, res) => {
    const ssn = req.params.ssn;
    if ( !ssn ) {
        res.status( 401 ).end();
    } else {
        pulsebsDAO.getTeacherFromSSN(ssn)
                  .then( ( teacher ) => {
                      res.status( 200 ).json( teacher );
                  } )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {
                                                  errors: [ {'message': err} ],
                                              } );
                  } );
    }
})

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
                                              errors: [ {'message': err} ],
                                          } );
              } );
} );


//  POST /student/booking
// FIXME: refactor
app.post( '/api/students/:studentId/booking', ( req, res ) => {
    const lectureId = req.body.lectureId;
    if ( !lectureId ) {
        res.status( 401 ).end();
    } else {
        const user = req.user && req.user.user;
        pulsebsDAO.bookSeat( lectureId, user )
                  .then( ( response ) => {
                      if ( process.env.TEST && process.env.TEST === '0' ) {
                          pulsebsDAO.getLectureStats( lectureId )
                                    .then( ( lecture ) => {

                                        pulsebsDAO.getInfoByStudentId( user )
                                                  .then( ( student ) => {
                                                      //var email = student.email;
                                                      let name = student.name;
                                                      let surname = student.surname;


                                                      // Send booking email to student
                                                      mailOptions = {
                                                          from: '"PULSeBS Team9" <noreply.pulsebs@gmail.com>',
                                                          //to: email, // COMMENTED IN ORDER NOT TO SEND EMAILS TO
                                                          // RANDOM PEOPLE IN THE WORLD
                                                          to: 'student.team9@yopmail.com',
                                                          subject: 'Booking confirmation (' + lecture.course + ')',
                                                          text: "Dear " + name + " " + surname + " (" + user + "), this email is to confirm that you have successfully booked for this lesson:\n\n"
                                                              + "     - Course: '" + lecture.course + "'.\n     - Classroom: " + lecture.classroom + ".\n     - Date: " + moment( lecture.date ).format( "YYYY-MM-DD HH:mm" ) + ".\n\nHave a good lesson.\n\n - PULSeBS Team9."
                                                      };

                                                      transporter.sendMail( mailOptions, function ( error, info ) {
                                                          if ( error ) {
                                                              console.log( error );
                                                          } else {
                                                              console.log( 'Email sent to: ' + l.id + ", info: " + info.response );
                                                          }
                                                      } );

                                                  } ).catch( ( err ) => {
                                            console.log( err );
                                        } );
                                    } ).catch( ( err ) => {
                              console.log( err );
                          } );
                      }
                      res.status( 201 ).json( {response} )
                  } )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {errors: [ {'param': 'Server', 'msg': err} ],} )
                  } );
    }
} );

/**
 * @Feihong
 * PUT /api/students/:studentId/lectures/:lectureId
 */
// Add a student to a waiting list
app.put( '/api/students/:studentId/lectures/:lectureId', ( req, res ) => {
    const lectureId = req.params.lectureId;
    if ( !lectureId ) {
        res.status( 401 ).end();
    } else {
        const user = req.user && req.user.user
        pulsebsDAO.addStudentToWaitingList( user, lectureId )
                  .then( ( response ) => {
                      res.status( 201 ).json( {response} )
                  } )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {errors: [ {'param': 'Server', 'msg': err} ]} )
                  } )
    }
} )

/**
 * @Feihong
 * GET /student/waitings
 */
//  get waiting list of lecures of a student

app.get( '/api/student/waitings', ( req, res ) => {
    const studentId = req.user && req.user.user
    pulsebsDAO.getWaitingList( studentId )
              .then( ( waitings ) => {
                  res.json( waitings )
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'message': err} ]
                                          } )
              } )
} )

/**
 * @Feihong
 * POST /students/studentId/lectures/lectureId
 */
//According the free seats of a lecture, to Update the bookable attribute of table lecture
app.post( '/api/students/:studentId/lectures/checkSeats/:lectureId', ( req, res ) => {
    const lectureId = req.params.lectureId
    if ( !lectureId ) {
        res.status( 400 ).end( "Can not get lecture!" );
    } else {
        pulsebsDAO.checkSeatsOfLecture( lectureId )
                  .then( ( lectureIdResult ) => res.status( 200 ).json( {"lectureId": lectureIdResult} ) )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {errors: [ {'param': 'Server-checkSeatsOfLecture', 'msg': err} ],} )
                  } )
    }
} )


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
                                              errors: [ {'message': err} ],
                                          } );
              } );
} )

app.get( '/api/student/getFromSSN/:ssn', (req, res) => {
    const ssn = req.params.ssn;
    if ( !ssn ) {
        res.status( 401 ).end();
    } else {
        pulsebsDAO.getStudentFromSSN(ssn)
                  .then( ( student ) => {
                      res.status( 200 ).json( student );
                  } )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {
                                                  errors: [ {'message': err} ],
                                              } );
                  } );
    }
})

/**
 * @Feihong
 * POST /student/bookings
 */
//  FIXME: refactor
app.delete( '/api/students/:studentId/bookings/:bookingId', ( req, res ) => {
    const bookingId = req.params.bookingId;
    if ( !bookingId ) {
        res.status( 401 ).end();
    } else {
        // const user = req.user && req.user.user;
        pulsebsDAO.cancelBookings( bookingId )
                  .then( ( response ) => response === 1 ?
                      res.status( 201 ).json( {response} ) :
                      res.status( 401 ).json( {response} )
                  )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {
                                                  errors: [ {'param': 'Server', 'message': err} ],
                                              } );
                  } );
    }
} );

/**
 * @Feihong
 * DELETE /students/:studentId/lectures/:lectureId/waiting
 *  delete a waiting item from waiting table and add a new booking
 */
app.delete( '/api/students/:studentId/lectures/:lectureId/waiting', ( req, res ) => {
    const lectureId = req.params.lectureId;
    if ( !lectureId ) {
        res.status( 401 ).end( 'can not find lecture' );
    } else {
        pulsebsDAO.deleteWaitingAddBooking( lectureId )
                  .then( ( studentAndLectureInfo ) => {
                      res.status( 200 ).json(
                          {
                              message: "The lecture was find in the waiting table," +
                                  "and successfuly was picked to the booking table, and now need sending a email to notice the student, the lecture id is: " + lectureId
                          } )
                      if ( process.env.TEST && process.env.TEST === '0' ) {
                          let mailOptions2;
                          mailOptions2 = {
                              from: '"PULSeBS Team9" <noreply.pulsebs@gmail.com>',
                              to: 'student.team9@yopmail.com', // replace this row with
                                                               // studentAndLectureInfo.studentEmail
                              //to: 'shinylover520@gmail.com', // replace this row with
                              // studentAndLectureInfo.studentEmail subject: 'Lecture of ' +
                              // studentAndLectureInfo.courseDescription + ' has just been turnt to be online',
                              subject: 'Your waiting lecture was picked from the waiting list',
                              text: "Dear " + studentAndLectureInfo.studentSurname + " " + studentAndLectureInfo.studentName +
                                  " (" + studentAndLectureInfo.studentId + ")," +
                                  " the lesson of the course " + studentAndLectureInfo.courseDescription + " that in your waiting list was picked, and it was " +
                                  " planned to take place in class " + studentAndLectureInfo.lectureClass +
                                  " on " + moment.unix( studentAndLectureInfo.lectureDate ).format( "YYYY-MM-DD HH:mm" ) + "." + "\n\n" +
                                  "Have a good lesson.\n\n - PULSeBS Team9."
                          };
                          transporter.sendMail( mailOptions2, function ( error, info ) {
                              if ( error ) {
                                  console.log( "Some error occured in sending the email to shinylover520@gmail.com :" + error );
                              } else {
                                  console.log( 'Email sent to: ' + studentAndLectureInfo.studentId );
                              }
                          } );
                      }

                  } )
                  .catch( ( exitCode ) => {
                      if ( exitCode === 0 ) {
                          res.status( 404 ).json( {message: "Find waiting err."} );
                      } else if ( exitCode === -1 ) {
                          res.status( 404 ).json( {message: "There is no such a lecture in waiting list with id " + lectureId + " ."} );
                      } else if ( exitCode === -2 ) {
                          res.status( 409 ).json( {message: "Delete waiting err."} );
                      } else if ( exitCode === -3 ) {
                          res.status( 409 ).json( {
                                                      message: "Add new booking err."
                                                  } );
                      } else if ( exitCode === -4 ) {
                          res.status( 409 ).json( {
                                                      message: "Find student informations err."
                                                  } );
                      } else if ( exitCode === -5 ) {
                          res.status( 500 ).json(
                              {
                                  message:
                                      "There is no such a student, so can not find informations of the student"
                              }
                          );
                      }
                  } );
    }
} )

// DELETE /student/bookings
//FIXME: refactor
/*app.delete( '/api/students/:studentId/bookings/:bookingId', ( req, res ) => {
    const studentId = req.params.studentId;
    const bookingId = req.params.bookingId;
    if ( !bookingId ) {
        res.status( 401 ).end();
    } else {
        // const user = req.user && req.user.user;
        pulsebsDAO.cancelBookings( bookingId )
                  .then( ( response ) => response === 1 ?
                      res.status( 201 ).json( {response} ) :
                      res.status( 401 ).json( {response} )
                  )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {
                                                  errors: [ {'param': 'Server', 'message': err} ],
                                              } );
                  } );
    }
} );*/

// FIXME:
app.delete( '/api/teachers/:teacherId/lectures/:lectureId', ( req, res ) => {
    const lectureId = req.params.lectureId;
    //const teacherId = req.params.teacherId;
    if ( !lectureId ) {
        res.status( 401 ).end();
    } else {
        // const user = req.user && req.user.user;
        pulsebsDAO.cancelLecture( lectureId )
                  .then( ( response ) => {
                      if ( process.env.TEST && process.env.TEST === '0' ) {
                          pulsebsDAO.getLectureStats( lectureId )
                                    .then( ( lecture ) => {
                                        pulsebsDAO.getStudentsForLecture( lectureId )
                                                  .then( ( students ) => {
                                                      if ( students.length !== 0 ) {
                                                          students.forEach( s => {
                                                              //var email = s.email;
                                                              let name = s.name;
                                                              let surname = s.surname;
                                                              let user = s.id;
                                                              mailOptions = {
                                                                  from: '"PULSeBS Team9" <noreply.pulsebs@gmail.com>',
                                                                  //to: email, // COMMENTED IN ORDER NOT TO SEND EMAILS
                                                                  // TO RANDOM PEOPLE IN THE WORLD.
                                                                  to: 'student.team9@yopmail.com',
                                                                  subject: 'Cancel Lecture (' + lecture.course + ')',
                                                                  text: "Dear " + name + " " + surname + " (" + user + "), this email is to confirm that the lesson of " + lecture.course + " in Classroom: " + lecture.classroom + " and Date: " + moment( lecture.date ).format( "YYYY-MM-DD HH:mm" ) + " is cancelled.\n\n"
                                                                      + "Have a good day.\n\n - PULSeBS Team9."
                                                              };
                                                              transporter.sendMail( mailOptions, function ( error, info ) {
                                                                  if ( error ) {
                                                                      console.log( error );
                                                                  } else {
                                                                      console.log( 'Email sent to: ' + user + ", info: " + info.response );
                                                                  }
                                                              } );
                                                          } );
                                                      }
                                                  } ).catch( ( err ) => {
                                            console.log( err );
                                        } );
                                    } ).catch( ( err ) => {
                              console.log( err );
                          } );
                      }
                      res.status( 200 ).json( {response} );
                  } )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {
                                                  errors: [ {'param': 'Server', 'msg': err} ],
                                              } );
                  } );
    }
} );
/*
* /api/sofficer - PUT
* Called from client when a support officer wants to load data from .csv file.
* Thi API parse a JSON object and execute statements on DB.
* */
app.put( '/api/sofficer/', ( req, res ) => {
    console.log( req.body );
    //Ligh validation body
    if ( 'classes' in req.body &&
        'courses' in req.body &&
        'lectures' in req.body &&
        'students' in req.body &&
        'subscriptions' in req.body &&
        'teachers' in req.body
    ) pulsebsDAO.loadCsvData( req.body )
                .then( () => res.status( 200 ).end() )
                .catch( () => res.status( 400 ).json( databaseErrorObj ) )
    else res.status( 400 ).json( dataErrorObj )

} )

/**
 * @Feihong
 * @Story17
 * Get all the Lectures for SupportOffice page
 * GET: /api/supportOffice/lectures
 */
app.get('/api/supportOffice/lectures', (req, res) =>{
    pulsebsDAO.getAllLecturesForSupportOffice()
        .then((lectures) => {
            
            res.json(lectures);
            
        }).catch((err) => {
            res.status(500).json({
                errors: [ {'message': err} ],
                location: [{'function-location': '/api/supportOffice/lectures'}]
            })
        })
})

/**
 * @Feihong
 * @Story17
 * Update the bookable attribute for the lecture that was clicked by support officer
 * POST: /api/supportOffice/lecture/:lectureId/:num
 */
app.post('/api/supportOffice/lecture/:lectureId/:num', (req, res) => {
    const lectureId = req.params.lectureId
    const num = req.params.num
    pulsebsDAO.updateBookableAttributForLecture(lectureId, num)
        .then((message) => {
            res.json(
                message
            )
        }).catch( ( err) => {
            res.status(500).json(err)
        })
})

// api/supportOffice/lectures/delete?from=${ startDate }&to=${ endDate } -DELETE
// Called from client when a support officer wants to update the schedule (delete + insert)
app.delete( '/api/supportOffice/bookings/delete', ( req, res ) => {
    const startDate = req.query.from;
    const endDate = req.query.to;
    if ( !startDate || !endDate ) {
        res.status( 401 ).end();
    } else {
        const user = req.user && req.user.user;
        pulsebsDAO.cancelBookingsByDate( startDate, endDate )
                  .then( ( response ) => {
                      res.status( 200 ).json( {response} );
                  } )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {
                          errors: [ {'param': 'Server', 'msg': err} ],
                    } );
                  } );
    }
} );

app.delete( '/api/supportOffice/lectures/delete', ( req, res ) => {
    const startDate = req.query.from;
    const endDate = req.query.to;
    if ( !startDate || !endDate ) {
        res.status( 401 ).end();
    } else {
        const user = req.user && req.user.user;
        pulsebsDAO.cancelLecturesByDate( startDate, endDate )
                  .then( ( response ) => {
                      res.status( 200 ).json( {response} );
                  } )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {
                          errors: [ {'param': 'Server', 'msg': err} ],
                    } );
                  } );
    }
} );

//BOOKING MANAGER

app.get( '/api/manager/getAllBookings', ( req, res ) => {
    const course = req.query.course;
    const lecture = req.query.lecture;
    pulsebsDAO.getAllBookings( course, lecture )
              .then( ( bookings ) => {
                  res.json( bookings );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'message': err} ],
                                          } );
              } );
} );

app.get( '/api/manager/getAllAttendances', ( req, res ) => {
    const course = req.query.course;
    const lecture = req.query.lecture;
    pulsebsDAO.getAllAttendances( course, lecture )
              .then( ( bookings ) => {
                  res.json( bookings );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'message': err} ],
                                          } );
              } );
} );


app.get( '/api/manager/getAllCancellationsLectures', ( req, res ) => {
    const course = req.query.course;
    const lecture = req.query.lecture;
    pulsebsDAO.getAllCancellationsLectures( course, lecture )
              .then( ( cancellations ) => {
                  res.json( cancellations );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'message': err} ],
                                          } );
              } );
} );

app.get( '/api/manager/getAllCancellationsBookings', ( req, res ) => {
    const course = req.query.course;
    const lecture = req.query.lecture;
    pulsebsDAO.getAllCancellationsBookings( course, lecture )
              .then( ( cancellations ) => {
                  res.json( cancellations );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'message': err} ],
                                          } );
              } );
} );

app.get( '/api/manager/getAllCourses', ( req, res ) => {
    pulsebsDAO.getAllCourses()
              .then( ( courses ) => {
                  res.json( courses );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'message': err} ],
                                          } );
              } );
} );

app.get( '/api/manager/getAllLectures', ( req, res ) => {
    pulsebsDAO.getAllLectures()
              .then( ( lectures ) => {
                  res.json( lectures );
              } )
              .catch( ( err ) => {
                  res.status( 500 ).json( {
                                              errors: [ {'message': err} ],
                                          } );
              } );
} );

app.get( '/api/manager/contactWithStudent/:studentId', ( req, res ) => {
    const studentId = req.params.studentId;
    // console.log("server up:");
    // console.log(studentId);
    if ( !studentId ) {
        res.status( 401 ).end();
    } else {
        pulsebsDAO.getContactsWithPositiveStudent( studentId )
                  .then( ( contacts ) => {
                      // console.log("server down:");
                      // console.log(contacts);
                      res.status( 200 ).json( contacts );
                  } )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {
                                                  errors: [ {'message': err} ],
                                              } );
                  } );
    }
} );

app.get( '/api/manager/contactWithTeacher/:teacherId', ( req, res ) => {
    const teacherId = req.params.teacherId;
    // console.log("server up:");
    // console.log(studentId);
    if ( !teacherId ) {
        res.status( 401 ).end();
    } else {
        pulsebsDAO.getContactsWithPositiveTeacher( teacherId )
                  .then( ( contacts ) => {
                      // console.log("server down:");
                      // console.log(contacts);
                      res.status( 200 ).json( contacts );
                  } )
                  .catch( ( err ) => {
                      res.status( 500 ).json( {
                                                  errors: [ {'message': err} ],
                                              } );
                  } );
    }
} );

app.get( '/api/teacher/:courseId/lecture/:lectureId/presence', ( req, res ) => {
    pulsebsDAO.getStudentsForLecture( req.params.lectureId )
              .then( result => result ? res.status( 200 ).json( result ).end() : res.status( 200 ).json( [] ).end() )
              .catch( err => res.status( 500 ).json( {
                                                         errors: [ {'message': err} ],
                                                     } ).end() );
} );

app.put( '/api/teacher/:courseId/lecture/:lectureId/presence', ( req, res ) => {
    pulsebsDAO.setStudentPresencesForLecture( req.params.lectureId, req.body )
              .then( result => res.status( 200 ).end() )
              .catch( err => res.status( 500 ).json( {
                                                         errors: [ {'message': err} ],
                                                     } ).end() );
} );


// Exported for E2E testing
exports.server = app;
app.disable( "x-powered-by" );
exports.handleToCloseServer = app.listen( port, () => console.log( `REST API server listening at http://localhost:${ port }` ) )
