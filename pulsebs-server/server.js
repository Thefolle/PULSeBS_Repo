const express = require( 'express' );

//Initializing server
const app = express();
const port = 3001;

app.use( express.json() );

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

/*
 * Unprotected APIs
 */

/*
 * Routes ...
 */

/*
 * Protected APIs
 */

/*
 * Routes ...
 */

app.listen( port, () => console.log( `REST API server listening at http://localhost:${ port }` ) );
