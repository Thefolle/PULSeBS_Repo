const sqlite3 = require( 'sqlite3' ).verbose();
const bcrypt = require( 'bcrypt' );
const moment = require( 'moment' );

/*
* Database Connection
*/
const db = new sqlite3.Database( 'pulsebs.db', ( err ) => {
    if ( err ) return console.error( err.message );
    console.log( 'Connected to the in-memory SQlite database.' );
} );

/*
* DAO Methods
*/
